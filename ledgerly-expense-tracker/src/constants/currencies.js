export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
]

export const getCurrencySymbol = (code) => (CURRENCIES.find(c => c.code === code) || CURRENCIES[0]).symbol
