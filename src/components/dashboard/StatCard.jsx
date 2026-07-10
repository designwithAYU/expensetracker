import { motion } from 'framer-motion'
import Card from '../ui/Card'

export default function StatCard({ label, value, sub, icon: Icon, tone = 'default', delay = 0 }) {
  const toneColor = {
    default: 'text-ink dark:text-paper',
    positive: 'text-vault-light',
    negative: 'text-coral',
    gold: 'text-gold',
  }[tone]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className="p-5 h-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-slate font-medium">{label}</span>
          {Icon && <Icon size={16} className="text-slate/70" />}
        </div>
        <div className={`font-display text-2xl font-semibold tabular-nums ${toneColor}`}>{value}</div>
        {sub && <div className="text-xs text-slate mt-1.5">{sub}</div>}
      </Card>
    </motion.div>
  )
}
