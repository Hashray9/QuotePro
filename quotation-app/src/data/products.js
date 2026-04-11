// 40 Electronics products across 6 categories
export const categories = [
  'All', 'TVs', 'Refrigerators', 'CCTV', 'Computers', 'Air Conditioners', 'Washing Machines'
];

export const products = [
  // === TVs (8) ===
  { id: 1, name: 'Samsung 32" HD Smart TV', model: 'UA32T4340', brand: 'Samsung', category: 'TVs', price: 15490, image: '/images/tv.png', keywords: ['samsung', '32', 'tv', 'hd', 'smart tv', '32 inch'] },
  { id: 2, name: 'Samsung 43" Crystal 4K UHD TV', model: 'UA43AUE60', brand: 'Samsung', category: 'TVs', price: 33990, image: '/images/tv.png', keywords: ['samsung', '43', 'tv', '4k', 'crystal', 'uhd', '43 inch'] },
  { id: 3, name: 'Samsung 55" Crystal 4K UHD TV', model: 'UA55AUE60', brand: 'Samsung', category: 'TVs', price: 52990, image: '/images/tv.png', keywords: ['samsung', '55', 'tv', '4k', 'uhd', '55 inch'] },
  { id: 4, name: 'LG 43" 4K Smart TV', model: '43UR7500', brand: 'LG', category: 'TVs', price: 31990, image: '/images/tv.png', keywords: ['lg', '43', 'tv', '4k', 'smart', '43 inch'] },
  { id: 5, name: 'LG 55" 4K OLED TV', model: 'OLED55C3', brand: 'LG', category: 'TVs', price: 119990, image: '/images/tv.png', keywords: ['lg', '55', 'tv', 'oled', '4k', '55 inch'] },
  { id: 6, name: 'Sony 55" Bravia 4K TV', model: 'KD-55X74L', brand: 'Sony', category: 'TVs', price: 59990, image: '/images/tv.png', keywords: ['sony', '55', 'tv', 'bravia', '4k', '55 inch'] },
  { id: 7, name: 'Sony 65" Bravia 4K TV', model: 'KD-65X80L', brand: 'Sony', category: 'TVs', price: 89990, image: '/images/tv.png', keywords: ['sony', '65', 'tv', 'bravia', '4k', '65 inch'] },
  { id: 8, name: 'TCL 43" Full HD Smart TV', model: '43S5400', brand: 'TCL', category: 'TVs', price: 21990, image: '/images/tv.png', keywords: ['tcl', '43', 'tv', 'full hd', 'smart', '43 inch'] },

  // === Refrigerators (7) ===
  { id: 9, name: 'Samsung 253L Double Door Fridge', model: 'RT28T3042S8', brand: 'Samsung', category: 'Refrigerators', price: 24990, image: '/images/fridge.png', keywords: ['samsung', 'fridge', 'refrigerator', 'double door', '253'] },
  { id: 10, name: 'Samsung 394L Frost Free Fridge', model: 'RT39C5532S8', brand: 'Samsung', category: 'Refrigerators', price: 38990, image: '/images/fridge.png', keywords: ['samsung', 'fridge', 'refrigerator', 'frost free', '394'] },
  { id: 11, name: 'LG 260L Double Door Fridge', model: 'GL-S292RDSY', brand: 'LG', category: 'Refrigerators', price: 26990, image: '/images/fridge.png', keywords: ['lg', 'fridge', 'refrigerator', 'double door', '260'] },
  { id: 12, name: 'LG 655L Side-by-Side Fridge', model: 'GL-B257DBSY', brand: 'LG', category: 'Refrigerators', price: 72990, image: '/images/fridge.png', keywords: ['lg', 'fridge', 'refrigerator', 'side by side', '655'] },
  { id: 13, name: 'Whirlpool 245L Double Door Fridge', model: 'IF INV 278 ELT', brand: 'Whirlpool', category: 'Refrigerators', price: 23490, image: '/images/fridge.png', keywords: ['whirlpool', 'fridge', 'refrigerator', 'double door', '245'] },
  { id: 14, name: 'Whirlpool 190L Single Door Fridge', model: 'WDE 205 CLS', brand: 'Whirlpool', category: 'Refrigerators', price: 15490, image: '/images/fridge.png', keywords: ['whirlpool', 'fridge', 'refrigerator', 'single door', '190'] },
  { id: 15, name: 'Haier 320L Double Door Fridge', model: 'HEF-32TMS', brand: 'Haier', category: 'Refrigerators', price: 28490, image: '/images/fridge.png', keywords: ['haier', 'fridge', 'refrigerator', 'double door', '320'] },

  // === CCTV (7) ===
  { id: 16, name: 'Hikvision 2MP Dome Camera', model: 'DS-2CE5AD0T-IRP', brand: 'Hikvision', category: 'CCTV', price: 1490, image: '/images/cctv.png', keywords: ['hikvision', 'camera', 'dome', '2mp', 'cctv'] },
  { id: 17, name: 'Hikvision 4MP IP Dome Camera', model: 'DS-2CD1343G2-I', brand: 'Hikvision', category: 'CCTV', price: 3490, image: '/images/cctv.png', keywords: ['hikvision', 'camera', 'dome', '4mp', 'ip', 'cctv'] },
  { id: 18, name: 'Hikvision 4CH DVR', model: 'DS-7A04HGHI-F1', brand: 'Hikvision', category: 'CCTV', price: 3290, image: '/images/cctv.png', keywords: ['hikvision', 'dvr', '4ch', '4 channel', 'cctv'] },
  { id: 19, name: 'Hikvision 8CH DVR', model: 'DS-7B08HUHI-K1', brand: 'Hikvision', category: 'CCTV', price: 6490, image: '/images/cctv.png', keywords: ['hikvision', 'dvr', '8ch', '8 channel', 'cctv'] },
  { id: 20, name: 'Dahua 2MP Bullet Camera', model: 'DH-HAC-HFW1209TLP', brand: 'Dahua', category: 'CCTV', price: 1290, image: '/images/cctv.png', keywords: ['dahua', 'camera', 'bullet', '2mp', 'cctv'] },
  { id: 21, name: 'Dahua 4MP IP Camera', model: 'DH-IPC-HDW2449TP', brand: 'Dahua', category: 'CCTV', price: 3890, image: '/images/cctv.png', keywords: ['dahua', 'camera', '4mp', 'ip', 'cctv'] },
  { id: 22, name: 'CP Plus 2MP Dome Camera', model: 'CP-USC-DA24L2', brand: 'CP Plus', category: 'CCTV', price: 1190, image: '/images/cctv.png', keywords: ['cp plus', 'camera', 'dome', '2mp', 'cctv'] },

  // === Computers/Laptops (7) ===
  { id: 23, name: 'HP 15s Core i3 Laptop', model: '15s-fq5007TU', brand: 'HP', category: 'Computers', price: 38990, image: '/images/laptop.png', keywords: ['hp', 'laptop', 'i3', '15s', 'computer'] },
  { id: 24, name: 'HP 14s Core i5 Laptop', model: '14s-dy5008TU', brand: 'HP', category: 'Computers', price: 52990, image: '/images/laptop.png', keywords: ['hp', 'laptop', 'i5', '14s', 'computer'] },
  { id: 25, name: 'Dell Inspiron 15 i5 Laptop', model: '5530', brand: 'Dell', category: 'Computers', price: 56990, image: '/images/laptop.png', keywords: ['dell', 'laptop', 'inspiron', 'i5', '15', 'computer'] },
  { id: 26, name: 'Dell Vostro 14 i3 Laptop', model: '3430', brand: 'Dell', category: 'Computers', price: 34990, image: '/images/laptop.png', keywords: ['dell', 'laptop', 'vostro', 'i3', '14', 'computer'] },
  { id: 27, name: 'Lenovo IdeaPad Slim 3 i5', model: '82RK00WVIN', brand: 'Lenovo', category: 'Computers', price: 48990, image: '/images/laptop.png', keywords: ['lenovo', 'laptop', 'ideapad', 'i5', 'slim', 'computer'] },
  { id: 28, name: 'Asus VivoBook 15 i3', model: 'X1504ZA', brand: 'Asus', category: 'Computers', price: 32990, image: '/images/laptop.png', keywords: ['asus', 'laptop', 'vivobook', 'i3', '15', 'computer'] },
  { id: 29, name: 'Asus VivoBook 15 i5', model: 'X1504VA', brand: 'Asus', category: 'Computers', price: 49990, image: '/images/laptop.png', keywords: ['asus', 'laptop', 'vivobook', 'i5', '15', 'computer'] },

  // === Air Conditioners (6) ===
  { id: 30, name: 'Daikin 1.0T 3 Star Split AC', model: 'FTL35UV16W3', brand: 'Daikin', category: 'Air Conditioners', price: 32990, image: '/images/ac.png', keywords: ['daikin', 'ac', 'air conditioner', '1 ton', '1t', 'split'] },
  { id: 31, name: 'Daikin 1.5T 5 Star Inverter AC', model: 'FTKF50UV16V', brand: 'Daikin', category: 'Air Conditioners', price: 47990, image: '/images/ac.png', keywords: ['daikin', 'ac', 'air conditioner', '1.5 ton', '1.5t', 'inverter'] },
  { id: 32, name: 'Voltas 1.5T 3 Star Split AC', model: '183V CZT3', brand: 'Voltas', category: 'Air Conditioners', price: 33990, image: '/images/ac.png', keywords: ['voltas', 'ac', 'air conditioner', '1.5 ton', '1.5t', 'split'] },
  { id: 33, name: 'Blue Star 1.5T 5 Star Inverter AC', model: 'IC518DATU', brand: 'Blue Star', category: 'Air Conditioners', price: 45990, image: '/images/ac.png', keywords: ['blue star', 'ac', 'air conditioner', '1.5 ton', '1.5t', 'inverter'] },
  { id: 34, name: 'LG 1.0T 5 Star AI Dual Inverter AC', model: 'RS-Q14JNZE', brand: 'LG', category: 'Air Conditioners', price: 39990, image: '/images/ac.png', keywords: ['lg', 'ac', 'air conditioner', '1 ton', '1t', 'inverter', 'ai'] },
  { id: 35, name: 'LG 2.0T 3 Star Split AC', model: 'RS-Q24JNZE', brand: 'LG', category: 'Air Conditioners', price: 52990, image: '/images/ac.png', keywords: ['lg', 'ac', 'air conditioner', '2 ton', '2t', 'split'] },

  // === Washing Machines (5) ===
  { id: 36, name: 'Samsung 7kg Front Load Washer', model: 'WW70T4020EE', brand: 'Samsung', category: 'Washing Machines', price: 28990, image: '/images/washer.png', keywords: ['samsung', 'washing machine', 'washer', 'front load', '7kg'] },
  { id: 37, name: 'Samsung 8kg Top Load Washer', model: 'WA80BG4545BY', brand: 'Samsung', category: 'Washing Machines', price: 18990, image: '/images/washer.png', keywords: ['samsung', 'washing machine', 'washer', 'top load', '8kg'] },
  { id: 38, name: 'LG 7kg Front Load Washer', model: 'FHM1207SDM', brand: 'LG', category: 'Washing Machines', price: 30990, image: '/images/washer.png', keywords: ['lg', 'washing machine', 'washer', 'front load', '7kg'] },
  { id: 39, name: 'LG 8kg Top Load Washer', model: 'T80SPSF2Z', brand: 'LG', category: 'Washing Machines', price: 19990, image: '/images/washer.png', keywords: ['lg', 'washing machine', 'washer', 'top load', '8kg'] },
  { id: 40, name: 'Whirlpool 7.5kg Top Load Washer', model: 'SW ULTRA 7.5', brand: 'Whirlpool', category: 'Washing Machines', price: 16990, image: '/images/washer.png', keywords: ['whirlpool', 'washing machine', 'washer', 'top load', '7.5kg'] },
];

export function addProduct(product) {
  product.id = products.length + 1;
  products.push(product);
}

export function addCategory(category) {
  if (!categories.includes(category)) {
    categories.push(category);
  }
}