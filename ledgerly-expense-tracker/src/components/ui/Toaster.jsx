import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '../../hooks/useToast'

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const colors = { success: 'text-vault-light', error: 'text-coral', info: 'text-gold' }

export default function Toaster() {
  const toasts = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm">
      <AnimatePresence>
        {toasts.map(t => {
          const Icon = icons[t.type]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-2.5 bg-paper-card dark:bg-ink-card border border-black/5 dark:border-white/10 rounded-xl shadow-lg px-4 py-3"
            >
              <Icon size={18} className={colors[t.type]} />
              <p className="text-sm text-ink dark:text-paper flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-slate hover:text-ink dark:hover:text-paper">
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
