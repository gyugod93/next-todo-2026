export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

const PRODUCT_NAMES = [
  "Wireless Headphones Pro",
  "Smart Watch Series X",
  "Running Shoes Elite",
  "Coffee Maker Deluxe",
  "Yoga Mat Premium",
  "Bluetooth Speaker Max",
  "Leather Wallet Classic",
  "Sunglasses UV400",
  "Laptop Stand Adjustable",
  "Water Bottle Insulated",
  "Mechanical Keyboard TKL",
  "Gaming Mouse RGB",
  "Backpack Urban 30L",
  "Desk Lamp LED",
  "Phone Case Armor",
  "Earbuds True Wireless",
  "Fitness Tracker Band",
  "Portable Charger 20K",
  "Canvas Tote Bag",
  "Travel Pillow Memory",
  "Air Purifier HEPA",
  "Standing Desk Mat",
  "Cold Brew Coffee Kit",
  "Resistance Bands Set",
  "Notebook Hardcover A5",
  "Pen Set Calligraphy",
  "Plant Pot Ceramic",
  "Scented Candle Soy",
  "Face Serum Vitamin C",
  "Lip Balm SPF30",
];

const CATEGORIES = ["전자기기", "패션", "홈&가든", "스포츠", "도서", "뷰티"];

const PRICES = [
  89, 149, 79, 59, 39, 99, 45, 129, 55, 29, 179, 69, 89, 35, 19, 119, 49, 79,
  25, 45, 199, 65, 39, 29, 15, 22, 35, 28, 89, 12,
];

const RATINGS = [
  4.8, 4.5, 4.7, 4.2, 4.9, 4.6, 4.3, 4.7, 4.4, 4.8, 4.5, 4.9, 4.6, 4.3, 4.7,
  4.8, 4.5, 4.6, 4.4, 4.7, 4.8, 4.5, 4.6, 4.7, 4.9, 4.3, 4.8, 4.6, 4.7, 4.5,
];

const REVIEWS = [
  1243, 856, 2341, 445, 3211, 987, 234, 1567, 678, 4521, 345, 2134, 876, 123,
  987, 1456, 678, 2345, 123, 876, 2567, 345, 678, 987, 1234, 234, 456, 789,
  1345, 234,
];

export const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: PRODUCT_NAMES[i],
  price: PRICES[i],
  category: CATEGORIES[i % CATEGORIES.length],
  rating: RATINGS[i],
  reviews: REVIEWS[i],
  imageUrl: `https://picsum.photos/seed/prod${i + 1}/800/600`,
}));

export const getAllProducts = (): Product[] => mockProducts;

export const getProductSlice = (start: number, end: number): Product[] =>
  mockProducts.slice(start, end);
