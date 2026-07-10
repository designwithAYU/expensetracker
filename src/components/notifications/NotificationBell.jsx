import { useState } from 'react'
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../context/store'
import EmptyState from '../ui/EmptyState'

const icons = { warning: AlertTriangle, success: CheckCircle2, info: Info }
const colors = { warning: 'text-gold', success: 'text-vault-light', info: 'text-slate' }

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const notifications = useStore(s => s.notifications)
  const markAllRead = useStore(s => s.markAllNotificationsRead)
  const markRead = useStore(s => s.markNotificationRead)
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-ink dark:text-paper">
        <Bell size={19} />
        {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral" />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-paper-card dark:bg-ink-card border border-black/5 dark:border-white/10 rounded-2xl shadow-xl z-40"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5">
                <span className="font-medium text-sm text-ink dark:text-paper">Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs text-vault-light flex items-center gap-1 hover:underline">
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <EmptyState icon={Bell} title="All caught up" description="You have no notifications right now." />
              ) : (
                <ul className="divide-y divide-black/5 dark:divide-white/5">
                  {notifications.map(n => {
                    const Icon = icons[n.type] || Info
                    return (
                      <li key={n.id} onClick={() => markRead(n.id)} className={`flex gap-2.5 px-4 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${n.read ? 'opacity-60' : ''}`}>
                        <Icon size={16} className={`${colors[n.type] || 'text-slate'} shrink-0 mt-0.5`} />
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-paper">{n.title}</p>
                          <p className="text-xs text-slate mt-0.5">{n.message}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
