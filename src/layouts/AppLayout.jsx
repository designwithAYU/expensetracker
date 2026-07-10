import { useState, useEffect } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import FloatingActionButton from '../components/layout/FloatingActionButton'
import Toaster from '../components/ui/Toaster'
import { useStore } from '../context/store'
import { X } from 'lucide-react'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/add-expense': 'Add Expense',
  '/analytics': 'Analytics',
  '/assistant': 'AI Assistant',
  '/insights': 'AI Insights',
  '/budget': 'Budget Planner',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const user = useStore(s => s.user)

  useEffect(() => setMobileOpen(false), [location.pathname])

  if (!user) return <Navigate to="/onboarding" replace />

  return (
    <div className="h-screen flex bg-paper dark:bg-ink text-ink dark:text-paper overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={TITLES[location.pathname] || ''} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 sm:p-6 max-w-7xl mx-auto w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <FloatingActionButton />
      </div>
      <Toaster />
    </div>
  )
}
