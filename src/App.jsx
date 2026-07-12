import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import ExpenseList from './pages/ExpenseList'
import Analytics from './pages/Analytics'
import AIAssistant from './pages/AIAssistant'
import AIInsights from './pages/AIInsights'
import BudgetPlanner from './pages/BudgetPlanner'
import Reports from './pages/Reports'
import SettingsPage from './pages/Settings'
import AppLayout from './layouts/AppLayout'
import { useStore } from './context/store'

export default function App() {
  const refreshNotifications = useStore((s) => s.refreshNotifications)
  const user = useStore((s) => s.user)

  useEffect(() => {
    if (user) {
      refreshNotifications()
    }
  }, [user, refreshNotifications])

  return (
    <BrowserRouter basename="/expensetracker">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/budget" element={<BudgetPlanner />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
