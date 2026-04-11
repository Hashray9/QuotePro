import { products } from '../data/products';
import { customers } from '../data/customers';

/**
 * Parse a natural language message to extract customer name and product requests.
 * Simulates AI parsing with keyword matching.
 */
export function parseMessage(message) {
  const lowerMsg = message.toLowerCase();

  // Extract customer name - look for patterns like "for <name>", "to <name>"
  const customerName = extractCustomerName(lowerMsg);
  const matchedCustomers = customerName ? findMatchingCustomers(customerName) : [];

  // Extract products with quantities
  const matchedProducts = findMatchingProducts(lowerMsg);

  return {
    customerName,
    matchedCustomers,
    matchedProducts,
    hasResults: matchedCustomers.length > 0 || matchedProducts.length > 0
  };
}

function extractCustomerName(msg) {
  const stopWords = ['samsung', 'lg', 'sony', 'tcl', 'hp', 'dell', 'lenovo', 'asus', 'daikin', 'voltas', 'hikvision', 'dahua', 'whirlpool', 'haier', 'blue', 'cp', 'star', 'plus',
    'quotation', 'quote', 'pricing', 'price', 'rates', 'rate', 'send', 'share', 'generate', 'prepare', 'create', 'make', 'need', 'please', 'can', 'could', 'would', 'want',
    'the', 'a', 'an', 'and', 'or', 'with', 'also', 'some', 'few', 'just', 'got', 'new', 'his', 'her', 'their', 'our', 'one', 'two', 'three', 'four', 'five',
    'inch', 'ton', 'load', 'door', 'front', 'top', 'double', 'single', 'split', 'inverter', 'smart', 'channel'];

  // Broad set of natural language patterns — ordered from most specific to least
  const patterns = [
    // "Rajesh called / needs / wants / is asking / messaged / said / requested"
    /([a-z]+(?:\s+[a-z]+)?)\s+(?:called|needs|wants|is\s+asking|messaged|said|requested|requires|inquired|asked|looking)/i,
    // "from Rajesh" / "requirement from Rajesh"
    /(?:from|by)\s+([a-z]+(?:\s+[a-z]+)?)/i,
    // "send/share/prepare quote/quotation/pricing to/for Rajesh"
    /(?:send|share|prepare|generate|create|make|get)\s+(?:a\s+)?(?:quotation|quote|pricing|price\s*list|estimate|proposal)\s+(?:to|for)\s+([a-z]+(?:\s+[a-z]+)?)/i,
    // "quotation/quote for/to Rajesh"
    /(?:quotation|quote|pricing|estimate|proposal)\s+(?:for|to)\s+([a-z]+(?:\s+[a-z]+)?)/i,
    // "for Rajesh" / "to Rajesh" (general)
    /(?:for|to)\s+([a-z]+(?:\s+[a-z]+)?)\s*[-–—,]/i,
    // "customer/client Rajesh"
    /(?:customer|client|buyer|party)\s+([a-z]+(?:\s+[a-z]+)?)/i,
    // "Rajesh madam/sir/ji/bhai" (honorifics)
    /([a-z]+(?:\s+[a-z]+)?)\s+(?:madam|sir|ji|bhai|uncle|aunty|sahab|didi)/i,
    // Last resort: "for Name" or "to Name" anywhere
    /(?:for|to)\s+([a-z]+(?:\s+[a-z]+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = msg.match(pattern);
    if (match) {
      let name = match[1].trim();
      // Remove trailing common words
      name = name.replace(/\s+(called|needs|wants|is|he|she|they|has|had|and|who|that|with|also|from|about|just|please|sir|madam|ji)$/i, '').trim();
      // Remove leading filler words
      name = name.replace(/^(mr|mrs|ms|dear|hi|hello|hey)\s+/i, '').trim();
      const firstWord = name.split(' ')[0].toLowerCase();
      if (stopWords.includes(firstWord)) continue;
      if (name.length < 2) continue;
      // Check if the name could actually be a customer (at least the first word matches someone)
      const possibleMatch = customers.some(c => {
        const custFirst = c.name.toLowerCase().split(' ')[0];
        const custFull = c.name.toLowerCase();
        return custFirst === name.toLowerCase() || custFull.includes(name.toLowerCase());
      });
      if (possibleMatch) return name;
    }
  }
  return null;
}

function findMatchingCustomers(name) {
  const lowerName = name.toLowerCase().trim();
  return customers.filter(c => {
    const lowerCustomerName = c.name.toLowerCase();
    const firstName = lowerCustomerName.split(' ')[0];
    const lastName = lowerCustomerName.split(' ')[1] || '';
    return firstName === lowerName ||
           lowerCustomerName === lowerName ||
           lowerCustomerName.includes(lowerName) ||
           (lowerName.includes(' ') && firstName === lowerName.split(' ')[0] && lastName === lowerName.split(' ')[1]);
  });
}

function findMatchingProducts(msg) {
  const results = [];
  
  // Split message into clauses to prevent keywords from one product cross-contaminating another
  const clauses = msg.split(/\b(?:and|&|,|plus|with|also|then)\b/i);

  for (let clause of clauses) {
    let remainingMsg = ` ${clause.toLowerCase()} `;
    // Pad punctuation with spaces so word boundary \b works perfectly
    remainingMsg = remainingMsg.replace(/([.,()[\]{}|:;"'-])/g, ' $1 ');

    // Calculate potential score for all products based on this specific clause
    const candidates = products.map(product => {
      let score = 0;
      const brandRegex = new RegExp(`\\b${product.brand}\\b`, 'i');
      if (brandRegex.test(remainingMsg)) score += 2;
      
      let matchedKeywords = [];
      for (const kw of product.keywords) {
        if (kw.toLowerCase() === product.brand.toLowerCase()) continue;
        const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
        if (kwRegex.test(remainingMsg)) {
          score += 1;
          matchedKeywords.push(kw);
        }
      }
      return { product, score, matchedKeywords };
    }).filter(c => c.score >= 3);

    // Sort by score descending so best matches get to "consume" keywords first
    candidates.sort((a, b) => b.score - a.score || b.matchedKeywords.length - a.matchedKeywords.length || b.product.price - a.product.price);

    for (const candidate of candidates) {
      let currentScore = 0;
      // Brand must be in the original clause to count
      const brandRegex = new RegExp(`\\b${candidate.product.brand}\\b`, 'i');
      if (brandRegex.test(clause)) currentScore += 2;
      
      let currentMatchedKws = [];
      for (const kw of candidate.product.keywords) {
        if (kw.toLowerCase() === candidate.product.brand.toLowerCase()) continue;
        const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
        if (kwRegex.test(remainingMsg)) { // Check against remaining unconsumed string
          currentScore += 1;
          currentMatchedKws.push(kw);
        }
      }

      if (currentScore >= 3) {
        const qty = extractQuantity(clause, candidate.product, currentMatchedKws);
        results.push({
          product: candidate.product,
          qty: qty,
          total: qty * candidate.product.price
        });

        // Consume the keywords so overlapping products don't double-match in the same clause
        for (const kw of currentMatchedKws) {
          const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
          remainingMsg = remainingMsg.replace(kwRegex, ' ');
        }
      }
    }
  }

  return results;
}

function extractQuantity(msg, product, currentMatchedKws) {
  const brand = product.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // 1. Try to find number near specific identifying keywords (e.g., '55', '2mp')
  const specificKws = currentMatchedKws.filter(k => !['tv', 'ac', 'fridge', 'camera', 'washer', 'cctv'].includes(k));
  if (specificKws.length > 0) {
    // Sort descending by length for regex alternation
    const specificStr = specificKws.sort((a,b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const specificPattern = new RegExp(`(\\d+)\\s*(?:x|nos|pcs|units?)?\\s*(?:of\\s+)?(?:${brand}\\s+)?(?:${specificStr})`, 'i');
    const match = msg.match(specificPattern);
    if (match) return parseInt(match[1]);
  }

  // 2. Fallback to any matched keyword
  if (currentMatchedKws && currentMatchedKws.length > 0) {
    const allKwsStr = currentMatchedKws.sort((a,b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const allPattern = new RegExp(`(\\d+)\\s*(?:x|nos|pcs|units?)?\\s*(?:of\\s+)?(?:${brand}\\s+)?(?:${allKwsStr})`, 'i');
    const matchAll = msg.match(allPattern);
    if (matchAll) return parseInt(matchAll[1]);
  }

  // 3. Absolute fallback: number right before brand
  const fallback = new RegExp(`(\\d+)\\s*(?:x\\s*)?${brand}`, 'i');
  const fbMatch = msg.match(fallback);
  if (fbMatch) return parseInt(fbMatch[1]);
  
  return 1;
}

/**
 * Format currency in Indian Rupee format
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate quotation ID
 */
let quotationCounter = 6;
export function generateQuotationId() {
  return `QT-2026-${String(quotationCounter++).padStart(3, '0')}`;
}
