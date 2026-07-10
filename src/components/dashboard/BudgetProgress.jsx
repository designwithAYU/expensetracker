import { motion } from 'framer-motion'
import Card from '../ui/Card'
import { formatMoney } from '../../utils/format'

export default function BudgetProgress({ income, spent, currency }) {
  const pct = income > 0 ? Math.min(100, (spent / income) * 100) : 0
  const over = spent > income
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-ink dark:text-paper">Budget used this month</span>
        <span className="text-sm font-mono text-slate">{Math.round(pct)}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${over ? 'bg-coral' : pct > 80 ? 'bg-gold' : 'bg-vault'}`}
        />
      </div>
      <div className="flex items-center justify-between mt-2.5 text-xs text-slate">
        <span>{formatMoney(spent, currency)} spent</span>
        <span>{formatMoney(income, currency)} income</span>
      </div>
    </Card>
  )
}
