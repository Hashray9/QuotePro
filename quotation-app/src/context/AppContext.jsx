import { createContext, useContext, useReducer, useCallback } from 'react';
import { chatHistories as initialChatHistories, getLastMessage } from '../data/chatHistory';
import { salespeople } from '../data/salespeople';
import { parseMessage, generateQuotationId, formatCurrency } from '../utils/messageParser';

const AppContext = createContext();

const initialState = {
  currentUser: null, // { role: 'admin' | 'salesperson', salespersonId?: number }
  selectedSalesperson: null,
  chatHistories: JSON.parse(JSON.stringify(initialChatHistories)),
  activeQuotationPreview: null, // quotation object or null
  processingMessage: false,
  customerDetection: null, // { messageId, customers, parsedProducts, originalMessage }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SELECT_SALESPERSON':
      return { ...state, selectedSalesperson: action.payload };
    case 'ADD_MESSAGE': {
      const { salespersonId, message } = action.payload;
      const history = [...(state.chatHistories[salespersonId] || []), message];
      return {
        ...state,
        chatHistories: { ...state.chatHistories, [salespersonId]: history },
      };
    }
    case 'ADD_MESSAGES': {
      const { salespersonId, messages } = action.payload;
      const history = [...(state.chatHistories[salespersonId] || []), ...messages];
      return {
        ...state,
        chatHistories: { ...state.chatHistories, [salespersonId]: history },
      };
    }
    case 'UPDATE_QUOTATION': {
      const { salespersonId, messageId, quotationUpdates } = action.payload;
      const history = state.chatHistories[salespersonId] || [];
      const updatedHistory = history.map(msg => {
        if (msg.id === messageId && msg.type === 'quotation') {
          return {
            ...msg,
            quotation: { ...msg.quotation, ...quotationUpdates }
          };
        }
        return msg;
      });
      return {
        ...state,
        chatHistories: { ...state.chatHistories, [salespersonId]: updatedHistory }
      };
    }
    case 'UPDATE_QUOTATION_ITEMS': {
      const { salespersonId, messageId, items } = action.payload;
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const gst = subtotal * 0.18;
      const total = subtotal + gst;

      const history = state.chatHistories[salespersonId] || [];
      const updatedHistory = history.map(msg => {
        if (msg.id === messageId && msg.type === 'quotation') {
          return {
            ...msg,
            quotation: {
              ...msg.quotation,
              items, subtotal, gst, total,
              isUpdated: true
            }
          };
        }
        return msg;
      });

      return {
        ...state,
        chatHistories: { ...state.chatHistories, [salespersonId]: updatedHistory }
      };
    }
    case 'SET_PROCESSING':
      return { ...state, processingMessage: action.payload };
    case 'SET_CUSTOMER_DETECTION':
      return { ...state, customerDetection: action.payload };
    case 'SHOW_QUOTATION_PREVIEW':
      return { ...state, activeQuotationPreview: action.payload };
    case 'LOGOUT':
      return { ...initialState, chatHistories: state.chatHistories };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback((role, salespersonId) => {
    dispatch({ type: 'SET_USER', payload: { role, salespersonId } });
    if (role === 'salesperson') {
      dispatch({ type: 'SELECT_SALESPERSON', payload: salespersonId });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const selectSalesperson = useCallback((id) => {
    dispatch({ type: 'SELECT_SALESPERSON', payload: id });
  }, []);

  const sendMessage = useCallback((salespersonId, text) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Add user message
    const userMsg = {
      id: `msg-${Date.now()}`,
      type: 'sent',
      text,
      time,
      date: 'Today',
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId, message: userMsg } });
    dispatch({ type: 'SET_PROCESSING', payload: true });

    // Simulate AI processing delay
    setTimeout(() => {
      const parsed = parseMessage(text);

      if (!parsed.hasResults) {
        const noMatchMsg = {
          id: `msg-${Date.now()}-sys`,
          type: 'system',
          text: '❌ Could not understand the request. Please try something like:\n"Quotation for Rajesh - 2 Samsung 55 inch TV and 1 LG fridge"',
          time,
          date: 'Today',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId, message: noMatchMsg } });
        dispatch({ type: 'SET_PROCESSING', payload: false });
        return;
      }

      if (parsed.matchedCustomers.length > 1) {
        // Multiple customer matches - need selection
        const detectMsg = {
          id: `msg-${Date.now()}-detect`,
          type: 'system',
          text: `🔍 Found ${parsed.matchedCustomers.length} customers matching "${parsed.customerName}". Please select:`,
          time,
          date: 'Today',
          customerMatches: parsed.matchedCustomers.map(c => ({ id: c.id, name: c.name, city: c.city })),
          selectedCustomer: null,
          awaitingSelection: true,
        };
        dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId, message: detectMsg } });
        dispatch({
          type: 'SET_CUSTOMER_DETECTION',
          payload: {
            messageId: detectMsg.id,
            customers: parsed.matchedCustomers,
            parsedProducts: parsed.matchedProducts,
            originalMessage: text,
            salespersonId,
          },
        });
        dispatch({ type: 'SET_PROCESSING', payload: false });
      } else if (parsed.matchedCustomers.length === 1) {
        // Single customer match - proceed directly
        completeQuotation(salespersonId, parsed.matchedCustomers[0], parsed.matchedProducts, time, dispatch);
      } else if (parsed.matchedProducts.length > 0) {
        // Products found but no customer
        const noCustomerMsg = {
          id: `msg-${Date.now()}-nocust`,
          type: 'system',
          text: '⚠️ Products detected but no customer name found. Please include the customer name, e.g. "for Rajesh"',
          time,
          date: 'Today',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId, message: noCustomerMsg } });
        dispatch({ type: 'SET_PROCESSING', payload: false });
      }
    }, 1200);
  }, []);

  const selectDetectedCustomer = useCallback((customerId) => {
    const detection = state.customerDetection;
    if (!detection) return;

    const customer = detection.customers.find(c => c.id === customerId);
    if (!customer) return;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Add selection confirmation
    const confirmMsg = {
      id: `msg-${Date.now()}-confirm`,
      type: 'system',
      text: `✅ Customer selected: ${customer.name}, ${customer.city}`,
      time,
      date: 'Today',
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId: detection.salespersonId, message: confirmMsg } });

    // Complete the quotation
    completeQuotation(detection.salespersonId, customer, detection.parsedProducts, time, dispatch);
    dispatch({ type: 'SET_CUSTOMER_DETECTION', payload: null });
  }, [state.customerDetection]);

  const dismissDetection = useCallback(() => {
    dispatch({ type: 'SET_CUSTOMER_DETECTION', payload: null });
  }, []);

  const showQuotationPreview = useCallback((quotation) => {
    dispatch({ type: 'SHOW_QUOTATION_PREVIEW', payload: quotation });
  }, []);

  const hideQuotationPreview = useCallback(() => {
    dispatch({ type: 'SHOW_QUOTATION_PREVIEW', payload: null });
  }, []);

  const generateManualQuotation = useCallback((salespersonId, customer, items) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const parsedProducts = items.map(item => ({
      product: item.product,
      qty: item.qty,
      total: item.qty * item.product.price
    }));

    const userMsg = {
      id: `msg-${Date.now()}-form`,
      type: 'sent',
      text: `📱 Created a quote manually via Form for ${customer.name}`,
      time,
      date: 'Today',
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId, message: userMsg } });

    completeQuotation(salespersonId, customer, parsedProducts, time, dispatch);
  }, []);

  const updateQuotationStage = useCallback((salespersonId, messageId, stage, setFollowUp = true) => {
    const updates = { stage };
    if (setFollowUp && stage === 'Sent') {
      const followUp = new Date();
      followUp.setDate(followUp.getDate() + 2);
      updates.followUpDate = followUp.toISOString();
    }
    dispatch({ type: 'UPDATE_QUOTATION', payload: { salespersonId, messageId, quotationUpdates: updates } });
  }, []);

  const addQuotationNote = useCallback((salespersonId, messageId, noteContent, type = 'text', nextFollowUpDate = null) => {
    // We need current notes array, but we can do a hack by passing the current quotation's notes or just merging
    // Since we don't have getState in useReducer easily here, we can handle it at the component level passing notes in, 
    // or better, dispatching an ADD_NOTE action. Let's just dispatch UPDATE_QUOTATION and the caller will pass the new notes array.
  }, []); // Caller will use updateQuotation directly for notes

  const updateQuotation = useCallback((salespersonId, messageId, updates) => {
    dispatch({ type: 'UPDATE_QUOTATION', payload: { salespersonId, messageId, quotationUpdates: updates } });
  }, []);

  const updateQuotationItems = useCallback((salespersonId, messageId, items) => {
    dispatch({ type: 'UPDATE_QUOTATION_ITEMS', payload: { salespersonId, messageId, items } });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    selectSalesperson,
    sendMessage,
    selectDetectedCustomer,
    dismissDetection,
    showQuotationPreview,
    hideQuotationPreview,
    generateManualQuotation,
    updateQuotationStage,
    updateQuotation,
    updateQuotationItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function completeQuotation(salespersonId, customer, parsedProducts, time, dispatch) {
  if (parsedProducts.length === 0) {
    const noProductMsg = {
      id: `msg-${Date.now()}-noprod`,
      type: 'system',
      text: `✅ Customer: ${customer.name}\n❌ No matching products found. Please specify products like "Samsung 55 inch TV"`,
      time,
      date: 'Today',
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { salespersonId, message: noProductMsg } });
    dispatch({ type: 'SET_PROCESSING', payload: false });
    return;
  }

  const subtotal = parsedProducts.reduce((sum, p) => sum + p.total, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // Product summary message
  const productSummary = parsedProducts.map(p =>
    `• ${p.qty}x ${p.product.name} - ${formatCurrency(p.product.price)} each`
  ).join('\n');

  const summaryMsg = {
    id: `msg-${Date.now()}-summary`,
    type: 'system',
    text: `📦 Detected products:\n${productSummary}\nTotal: ${formatCurrency(subtotal)}`,
    time,
    date: 'Today',
  };

  const quotation = {
    id: generateQuotationId(),
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone || customer.whatsapp,
      whatsapp: customer.whatsapp || customer.phone,
      city: customer.city,
      address: customer.address,
    },
    items: parsedProducts.map(p => ({
      product: {
        id: p.product.id,
        name: p.product.name,
        model: p.product.model,
        image: p.product.image,
        brand: p.product.brand,
      },
      qty: p.qty,
      price: p.product.price,
    })),
    subtotal,
    gst,
    total,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    createdAt: new Date().toISOString(),
    status: 'draft',
    stage: 'Draft',
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    validTill: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: []
  };

  const quotationMsg = {
    id: `msg-${Date.now()}-quote`,
    type: 'quotation',
    time,
    date: 'Today',
    quotation,
  };

  dispatch({ type: 'ADD_MESSAGES', payload: { salespersonId, messages: [summaryMsg, quotationMsg] } });
  dispatch({ type: 'SET_PROCESSING', payload: false });
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
