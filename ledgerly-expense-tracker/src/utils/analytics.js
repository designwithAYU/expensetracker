import { monthKey } from './format'

export function totalOf(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
}

export function expensesForMonth(expenses, key = monthKey(new Date())) {
  return expenses.filter(e => monthKey(e.date) === key)
}

export function byCategory(expenses) {
  const map = {}
  for (const e of expenses) {
    map[e.category] = (map[e.category] || 0) + Number(e.amount || 0)
  }
  return map
}

export function monthlyTrend(expenses, months = 6) {
  const now = new Date()
  const result = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = monthKey(d)
    const total = totalOf(expensesForMonth(expenses, key))
    result.push({ key, label: d.toLocaleDateString('en-IN', { month: 'short' }), total })
  }
  return result
}

export function weeklyTrend(expenses, weeks = 8) {
  const now = new Date()
  const result = []
  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(now)
    end.setDate(now.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    const total = expenses
      .filter(e => {
        const d = new Date(e.date)
        return d >= start && d <= end
      })
      .reduce((s, e) => s + Number(e.amount || 0), 0)
    result.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, total })
  }
  return result
}

export function financialHealthScore({ income, expenses, savingsGoal }) {
  if (!income || income <= 0) return { score: 0, label: 'No data', factors: [] }
  const spent = totalOf(expenses)
  const savingsRate = Math.max(0, (income - spent) / income)
  const goalRatio = savingsGoal > 0 ? Math.min(1, (income - spent) / savingsGoal) : 1
  const spendRatio = Math.min(1.5, spent / income)

  let score = 0
  score += Math.min(40, savingsRate * 100 * 0.6)
  score += Math.min(30, goalRatio * 30)
  score += Math.max(0, 30 - Math.max(0, spendRatio - 0.7) * 60)
  score = Math.round(Math.max(0, Math.min(100, score)))

  let label = 'Needs Attention'
  if (score >= 80) label = 'Excellent'
  else if (score >= 60) label = 'Healthy'
  else if (score >= 40) label = 'Fair'

  const factors = [
    { label: 'Savings rate', value: `${Math.round(savingsRate * 100)}%`, good: savingsRate > 0.2 },
    { label: 'Budget usage', value: `${Math.round(spendRatio * 100)}%`, good: spendRatio < 0.9 },
    { label: 'Goal progress', value: `${Math.round(goalRatio * 100)}%`, good: goalRatio > 0.5 },
  ]

  return { score, label, factors }
}

export function detectUnusualSpending(expenses) {
  const cats = byCategory(expenses)
  const alerts = []
  const now = new Date()
  const thisMonthKey = monthKey(now)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = monthKey(lastMonth)

  const thisMonthByCat = byCategory(expensesForMonth(expenses, thisMonthKey))
  const lastMonthByCat = byCategory(expensesForMonth(expenses, lastMonthKey))

  for (const cat in thisMonthByCat) {
    const prev = lastMonthByCat[cat] || 0
    const curr = thisMonthByCat[cat]
    if (prev > 0 && curr > prev * 1.5 && curr - prev > 200) {
      alerts.push({ category: cat, current: curr, previous: prev, increase: Math.round(((curr - prev) / prev) * 100) })
    }
  }
  return alerts
}
