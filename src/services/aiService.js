import { CATEGORY_KEYWORDS } from '../constants/categories'
import { byCategory, financialHealthScore, monthlyTrend, totalOf, expensesForMonth, detectUnusualSpending } from '../utils/analytics'
import { monthKey, monthLabel, formatMoney } from '../utils/format'

// ---------------------------------------------------------------------------
// This service supports two modes:
// 1. "local" mode (default, works fully offline, no key needed) — a rule based
//    engine that categorizes expenses, parses natural language, and answers
//    finance questions using the user's own stored data.
// 2. "live" mode — if the user adds an OpenAI or Gemini API key in Settings,
//    requests are sent directly to that provider for richer natural-language
//    responses. The key is stored only in this browser's local storage.
// ---------------------------------------------------------------------------

function getAIConfig() {
  try {
    const s = JSON.parse(localStorage.getItem('et_settings') || '{}')
    return { provider: s.aiProvider || 'local', apiKey: s.aiApiKey || '' }
  } catch {
    return { provider: 'local', apiKey: '' }
  }
}

async function callLive(prompt, systemPrompt) {
  const { provider, apiKey } = getAIConfig()
  if (!apiKey) return null
  try {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      })
      const data = await res.json()
      return data?.choices?.[0]?.message?.content || null
    }
    if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
          }),
        }
      )
      const data = await res.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
    }
  } catch {
    return null
  }
  return null
}

// ---- 1. Automatic categorization -----------------------------------------
export function categorizeExpense(description = '') {
  const text = description.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return cat
  }
  return 'other'
}

// ---- 2. Natural language expense entry ------------------------------------
export function parseNaturalLanguageExpense(input, currencySymbol = '₹') {
  const text = input.trim()
  const amountMatch = text.match(/(?:rs\.?|inr|₹|\$|€|£)\s?([\d,]+(?:\.\d+)?)/i) || text.match(/([\d,]+(?:\.\d+)?)/)
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0

  let date = new Date()
  if (/yesterday/i.test(text)) date.setDate(date.getDate() - 1)
  else if (/today/i.test(text)) { /* keep today */ }
  else if (/last week/i.test(text)) date.setDate(date.getDate() - 7)

  const category = categorizeExpense(text)

  let description = text
    .replace(/(?:rs\.?|inr|₹|\$|€|£)\s?[\d,]+(?:\.\d+)?/i, '')
    .replace(/\b(spent|on|yesterday|today|last week|paid|for)\b/gi, '')
    .replace(/[\d,]+(?:\.\d+)?/, '')
    .trim()
    .replace(/\s+/g, ' ')
  if (!description) description = category.charAt(0).toUpperCase() + category.slice(1)

  return {
    amount,
    category,
    date: date.toISOString().slice(0, 10),
    description: description.charAt(0).toUpperCase() + description.slice(1),
    confidence: amount > 0 ? 0.85 : 0.4,
  }
}

// ---- 3. AI financial chat assistant ----------------------------------------
export async function askFinanceAssistant(question, { expenses, user, budget }) {
  const q = question.toLowerCase()
  const currency = user?.currency || 'INR'
  const cats = byCategory(expenses)
  const thisMonth = expensesForMonth(expenses)
  const thisMonthByCat = byCategory(thisMonth)
  const total = totalOf(expenses)
  const totalThisMonth = totalOf(thisMonth)

  const systemPrompt = `You are a helpful, concise personal finance assistant embedded in an expense tracker app. Answer using only the data provided. Keep answers under 120 words, use the user's currency, and be encouraging but honest.`
  const dataSummary = `User: ${user?.name || 'User'}. Currency: ${currency}. Monthly income: ${formatMoney(user?.monthlyIncome, currency)}. Savings goal: ${formatMoney(user?.savingsGoal, currency)}. This month spent: ${formatMoney(totalThisMonth, currency)}. Category breakdown this month: ${JSON.stringify(thisMonthByCat)}. All-time category breakdown: ${JSON.stringify(cats)}. Total expense records: ${expenses.length}.`

  const live = await callLive(`${dataSummary}\n\nQuestion: ${question}`, systemPrompt)
  if (live) return live

  // Local rule-based fallback
  if (/food/.test(q)) {
    const amt = thisMonthByCat.food || 0
    return `You've spent ${formatMoney(amt, currency)} on food this month. That's ${total ? Math.round((amt / totalThisMonth || 0) * 100) : 0}% of this month's spending.`
  }
  if (/save|saving/.test(q) && /where|how/.test(q)) {
    const top = Object.entries(thisMonthByCat).sort((a, b) => b[1] - a[1])[0]
    if (top) return `Your biggest spending category this month is ${top[0]} at ${formatMoney(top[1], currency)}. Trimming even 15% there could meaningfully boost your savings rate.`
    return `Add a few expenses first, and I'll point out where you can trim spending.`
  }
  if (/biggest|top|most/.test(q) && /expense|spend/.test(q)) {
    const sorted = Object.entries(thisMonthByCat).sort((a, b) => b[1] - a[1])
    if (!sorted.length) return `No expenses logged yet this month.`
    return `Your top categories this month: ${sorted.slice(0, 3).map(([c, v]) => `${c} (${formatMoney(v, currency)})`).join(', ')}.`
  }
  if (/compare/.test(q)) {
    const now = new Date()
    const lastMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    const lastTotal = totalOf(expensesForMonth(expenses, lastMonthKey))
    const diff = totalThisMonth - lastTotal
    return `This month: ${formatMoney(totalThisMonth, currency)} vs last month: ${formatMoney(lastTotal, currency)}. You're spending ${diff >= 0 ? 'more' : 'less'} by ${formatMoney(Math.abs(diff), currency)}.`
  }
  if (/improve|budget/.test(q)) {
    const health = financialHealthScore({ income: user?.monthlyIncome, expenses: thisMonth, savingsGoal: user?.savingsGoal })
    return `Your financial health score is ${health.score}/100 (${health.label}). Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings, and revisit your biggest category first.`
  }
  return `Based on your data: this month you've spent ${formatMoney(totalThisMonth, currency)} across ${Object.keys(thisMonthByCat).length} categories. Ask me about food spending, savings tips, or how this month compares to last month.`
}

// ---- 4 & 5. AI-generated monthly report + suggestions ----------------------
export async function generateAIReport({ expenses, user, budget }) {
  const currency = user?.currency || 'INR'
  const thisMonth = expensesForMonth(expenses)
  const totalThisMonth = totalOf(thisMonth)
  const byCat = byCategory(thisMonth)
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const health = financialHealthScore({ income: user?.monthlyIncome, expenses: thisMonth, savingsGoal: user?.savingsGoal })
  const unusual = detectUnusualSpending(expenses)
  const trend = monthlyTrend(expenses, 3)
  const trendDirection = trend[2]?.total > trend[1]?.total ? 'rising' : 'falling'

  const systemPrompt = `You are a financial analyst writing a short monthly report for a personal expense tracker app. Be specific, use the numbers given, keep it under 180 words, structured with short paragraphs. Do not invent numbers not provided.`
  const dataSummary = `Income: ${formatMoney(user?.monthlyIncome, currency)}. Spent this month: ${formatMoney(totalThisMonth, currency)}. Savings goal: ${formatMoney(user?.savingsGoal, currency)}. Top categories: ${sorted.slice(0, 4).map(([c, v]) => `${c}: ${formatMoney(v, currency)}`).join(', ')}. Health score: ${health.score}/100 (${health.label}). 3-month trend: ${trend.map(t => `${t.label}: ${formatMoney(t.total, currency)}`).join(', ')}.`

  const live = await callLive(dataSummary, systemPrompt)

  return {
    id: `report-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    month: monthLabel(monthKey(new Date())),
    healthScore: health.score,
    healthLabel: health.label,
    totalSpent: totalThisMonth,
    topCategories: sorted.slice(0, 5),
    trend,
    trendDirection,
    unusual,
    summary: live || buildLocalReportSummary({ user, currency, totalThisMonth, sorted, health, trendDirection, unusual }),
  }
}

function buildLocalReportSummary({ user, currency, totalThisMonth, sorted, health, trendDirection, unusual }) {
  const top = sorted[0]
  const remaining = (user?.monthlyIncome || 0) - totalThisMonth
  let text = `This month you spent ${formatMoney(totalThisMonth, currency)}, leaving ${formatMoney(remaining, currency)} against your income. `
  if (top) text += `Your largest category was ${top[0]} at ${formatMoney(top[1], currency)}, which is worth reviewing first if you want to cut costs. `
  text += `Your financial health score is ${health.score}/100 (${health.label}), and your spending trend over the last three months is ${trendDirection}. `
  if (unusual.length) text += `Unusual activity detected in ${unusual.map(u => u.category).join(', ')} — spending jumped noticeably versus last month. `
  text += remaining > (user?.savingsGoal || 0) * 0.5
    ? `You're on track toward your savings goal — keep it up.`
    : `Consider trimming discretionary categories to stay closer to your savings goal.`
  return text
}

// ---- 6. Budget planning -----------------------------------------------------
const BUDGET_ALLOCATION = {
  food: 0.15,
  groceries: 0.10,
  bills: 0.10,
  rent: 0.25,
  travel: 0.08,
  entertainment: 0.05,
  shopping: 0.07,
  health: 0.05,
  education: 0.05,
  emergency: 0.05,
  savings: 0.05,
}

export function generateOptimizedBudget({ income, savingsGoal }) {
  const disposable = Math.max(0, income - savingsGoal)
  const allocation = {}
  for (const [cat, pct] of Object.entries(BUDGET_ALLOCATION)) {
    allocation[cat] = Math.round(disposable * pct)
  }
  allocation.savings = (allocation.savings || 0) + savingsGoal
  return allocation
}

// ---- 7. Spending prediction --------------------------------------------------
export function predictNextMonthSpend(expenses) {
  const trend = monthlyTrend(expenses, 4)
  const totals = trend.map(t => t.total).filter(t => t > 0)
  if (!totals.length) return 0
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length
  const last = totals[totals.length - 1] || avg
  return Math.round((avg * 0.4 + last * 0.6))
}

// ---- 9. Smart alerts for overspending ----------------------------------------
export function generateSmartAlerts({ expenses, user, budget }) {
  const alerts = []
  const thisMonth = expensesForMonth(expenses)
  const totalThisMonth = totalOf(thisMonth)
  const currency = user?.currency || 'INR'

  if (user?.monthlyIncome && totalThisMonth > user.monthlyIncome * 0.9) {
    alerts.push({ type: 'warning', title: 'Budget exceeded', message: `You've spent ${formatMoney(totalThisMonth, currency)}, over 90% of your income this month.` })
  }
  const remaining = (user?.monthlyIncome || 0) - totalThisMonth
  if (user?.savingsGoal && remaining >= user.savingsGoal) {
    alerts.push({ type: 'success', title: 'Savings goal achieved', message: `You're on pace to hit your ${formatMoney(user.savingsGoal, currency)} savings goal this month.` })
  }
  const unusual = detectUnusualSpending(expenses)
  for (const u of unusual) {
    alerts.push({ type: 'warning', title: 'Unusual spending detected', message: `${u.category} spending is up ${u.increase}% vs last month.` })
  }
  if (budget) {
    for (const [cat, limit] of Object.entries(budget)) {
      const spent = byCategory(thisMonth)[cat] || 0
      if (limit > 0 && spent > limit) {
        alerts.push({ type: 'warning', title: `${cat} budget warning`, message: `You've exceeded your ${cat} budget by ${formatMoney(spent - limit, currency)}.` })
      }
    }
  }
  const today = new Date()
  const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate()
  if (daysLeft <= 3) {
    alerts.push({ type: 'info', title: 'Upcoming monthly reset', message: `${daysLeft} day(s) left in this month. Your budget will reset soon.` })
  }
  return alerts
}
