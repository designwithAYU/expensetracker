import { getCurrencySymbol } from '../constants/currencies'

export function formatMoney(amount, currency = 'INR', opts = {}) {
  const symbol = getCurrencySymbol(currency)
  const n = Number(amount) || 0
  const formatted = n.toLocaleString('en-IN', {
    maximumFractionDigits: opts.decimals ?? (n % 1 === 0 ? 0 : 2),
    minimumFractionDigits: 0,
  })
  return `${symbol}${formatted}`
}

export function formatDate(date, style = 'medium') {
  const d = new Date(date)
  if (isNaN(d)) return ''
  if (style === 'short') return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  if (style === 'day') return d.toLocaleDateString('en-IN', { weekday: 'short' })
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function relativeDay(date) {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const same = (a, b) => a.toDateString() === b.toDateString()
  if (same(d, today)) return 'Today'
  if (same(d, yesterday)) return 'Yesterday'
  return formatDate(date, 'short')
}

export function monthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(key) {
  const [y, m] = key.split('-')
  return new Date(y, m - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}
