import { create } from 'zustand'
import { storage } from '../utils/storage'
import { generateSmartAlerts } from '../services/aiService'

const defaultSettings = { theme: 'dark', aiProvider: 'local', aiApiKey: '' }

export const useStore = create((set, get) => ({
  user: storage.getUser(),
  expenses: storage.getExpenses(),
  budget: storage.getBudget(),
  settings: storage.getSettings() || defaultSettings,
  aiHistory: storage.getAIHistory(),
  reports: storage.getReports(),
  notifications: storage.getNotifications(),

  // ---- user / onboarding ----
  setUser: (user) => {
    storage.setUser(user)
    set({ user })
  },
  updateUser: (patch) => {
    const user = { ...get().user, ...patch }
    storage.setUser(user)
    set({ user })
  },

  // ---- expenses ----
  addExpense: (expense) => {
    const expenses = [{ ...expense, id: expense.id || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() }, ...get().expenses]
    storage.setExpenses(expenses)
    set({ expenses })
    get().refreshNotifications()
  },
  updateExpense: (id, patch) => {
    const expenses = get().expenses.map(e => (e.id === id ? { ...e, ...patch } : e))
    storage.setExpenses(expenses)
    set({ expenses })
    get().refreshNotifications()
  },
  deleteExpense: (id) => {
    const expenses = get().expenses.filter(e => e.id !== id)
    storage.setExpenses(expenses)
    set({ expenses })
  },

  // ---- budget ----
  setBudget: (budget) => {
    storage.setBudget(budget)
    set({ budget })
  },

  // ---- settings ----
  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    storage.setSettings(settings)
    set({ settings })
  },

  // ---- AI chat history ----
  addAIMessage: (message) => {
    const aiHistory = [...get().aiHistory, message]
    storage.setAIHistory(aiHistory)
    set({ aiHistory })
  },
  clearAIHistory: () => {
    storage.setAIHistory([])
    set({ aiHistory: [] })
  },

  // ---- reports ----
  saveReport: (report) => {
    const reports = [report, ...get().reports]
    storage.setReports(reports)
    set({ reports })
  },

  // ---- notifications ----
  refreshNotifications: () => {
    const { expenses, user, budget } = get()
    if (!user) return
    const alerts = generateSmartAlerts({ expenses, user, budget })
    const notifications = alerts.map((a, i) => ({ id: `notif-${Date.now()}-${i}`, read: false, createdAt: new Date().toISOString(), ...a }))
    storage.setNotifications(notifications)
    set({ notifications })
  },
  markNotificationRead: (id) => {
    const notifications = get().notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    storage.setNotifications(notifications)
    set({ notifications })
  },
  markAllNotificationsRead: () => {
    const notifications = get().notifications.map(n => ({ ...n, read: true }))
    storage.setNotifications(notifications)
    set({ notifications })
  },

  // ---- reset ----
  resetAll: () => {
    storage.clearAll()
    set({ user: null, expenses: [], budget: null, settings: defaultSettings, aiHistory: [], reports: [], notifications: [] })
  },
  importData: (data) => {
    storage.importAll(data)
    set({
      user: data.user ?? get().user,
      expenses: data.expenses ?? get().expenses,
      budget: data.budget ?? get().budget,
      settings: data.settings ?? get().settings,
      aiHistory: data.aiHistory ?? get().aiHistory,
      reports: data.reports ?? get().reports,
      notifications: data.notifications ?? get().notifications,
    })
  },
}))
