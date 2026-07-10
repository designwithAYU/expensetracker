export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: '#C9A227', icon: 'utensils' },
  { id: 'shopping', label: 'Shopping', color: '#17877D', icon: 'bag' },
  { id: 'bills', label: 'Bills & Utilities', color: '#E15554', icon: 'receipt' },
  { id: 'travel', label: 'Travel', color: '#5B8DEF', icon: 'plane' },
  { id: 'entertainment', label: 'Entertainment', color: '#B072D9', icon: 'film' },
  { id: 'health', label: 'Health', color: '#3FB27F', icon: 'heart' },
  { id: 'groceries', label: 'Groceries', color: '#E0975B', icon: 'cart' },
  { id: 'rent', label: 'Rent & Housing', color: '#8D6E63', icon: 'home' },
  { id: 'education', label: 'Education', color: '#4A90A4', icon: 'book' },
  { id: 'emergency', label: 'Emergency Fund', color: '#D95050', icon: 'shield' },
  { id: 'savings', label: 'Savings', color: '#0F5C56', icon: 'piggy' },
  { id: 'other', label: 'Other', color: '#6B7280', icon: 'dots' },
]

export const getCategory = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]

export const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking', 'Wallet']

export const CATEGORY_KEYWORDS = {
  food: ['pizza', 'restaurant', 'burger', 'cafe', 'coffee', 'dinner', 'lunch', 'breakfast', 'swiggy', 'zomato', 'food', 'snack', 'starbucks', 'dominos', 'mcdonald'],
  groceries: ['grocery', 'groceries', 'supermarket', 'bigbasket', 'blinkit', 'zepto', 'vegetables', 'fruits', 'milk'],
  shopping: ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes', 'shopping', 'mall', 'store', 'purchase'],
  bills: ['electricity', 'water bill', 'internet', 'wifi', 'phone bill', 'recharge', 'gas bill', 'utility', 'bill'],
  travel: ['uber', 'ola', 'flight', 'train', 'taxi', 'cab', 'petrol', 'fuel', 'metro', 'bus', 'travel', 'trip'],
  entertainment: ['movie', 'netflix', 'spotify', 'prime', 'concert', 'game', 'cinema', 'theatre', 'subscription'],
  health: ['doctor', 'medicine', 'pharmacy', 'hospital', 'gym', 'fitness', 'health', 'clinic'],
  rent: ['rent', 'housing', 'maintenance', 'landlord'],
  education: ['course', 'book', 'tuition', 'school', 'college', 'udemy', 'education'],
  savings: ['savings', 'invest', 'mutual fund', 'sip', 'deposit'],
}
