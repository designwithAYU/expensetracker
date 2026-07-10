const KEYS = {
  USER: 'et_user',
  EXPENSES: 'et_expenses',
  BUDGET: 'et_budget',
  SETTINGS: 'et_settings',
  AI_HISTORY: 'et_ai_history',
  REPORTS: 'et_reports',
  NOTIFICATIONS: 'et_notifications',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const storage = {
  KEYS,
  read,
  write,
  getUser: () => read(KEYS.USER, null),
  setUser: (v) => write(KEYS.USER, v),
  getExpenses: () => read(KEYS.EXPENSES, []),
  setExpenses: (v) => write(KEYS.EXPENSES, v),
  getBudget: () => read(KEYS.BUDGET, null),
  setBudget: (v) => write(KEYS.BUDGET, v),
  getSettings: () => read(KEYS.SETTINGS, null),
  setSettings: (v) => write(KEYS.SETTINGS, v),
  getAIHistory: () => read(KEYS.AI_HISTORY, []),
  setAIHistory: (v) => write(KEYS.AI_HISTORY, v),
  getReports: () => read(KEYS.REPORTS, []),
  setReports: (v) => write(KEYS.REPORTS, v),
  getNotifications: () => read(KEYS.NOTIFICATIONS, []),
  setNotifications: (v) => write(KEYS.NOTIFICATIONS, v),
  exportAll: () => ({
    user: read(KEYS.USER, null),
    expenses: read(KEYS.EXPENSES, []),
    budget: read(KEYS.BUDGET, null),
    settings: read(KEYS.SETTINGS, null),
    aiHistory: read(KEYS.AI_HISTORY, []),
    reports: read(KEYS.REPORTS, []),
    notifications: read(KEYS.NOTIFICATIONS, []),
    exportedAt: new Date().toISOString(),
  }),
  importAll: (data) => {
    if (data.user) write(KEYS.USER, data.user)
    if (data.expenses) write(KEYS.EXPENSES, data.expenses)
    if (data.budget) write(KEYS.BUDGET, data.budget)
    if (data.settings) write(KEYS.SETTINGS, data.settings)
    if (data.aiHistory) write(KEYS.AI_HISTORY, data.aiHistory)
    if (data.reports) write(KEYS.REPORTS, data.reports)
    if (data.notifications) write(KEYS.NOTIFICATIONS, data.notifications)
  },
  clearAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
}
