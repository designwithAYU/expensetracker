import { getCategory } from '../../constants/categories'
import { ICON_MAP } from '../../constants/iconMap'
import { formatMoney, relativeDay } from '../../utils/format'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import { Receipt } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RecentTransactions({ expenses, currency }) {
  const recent = expenses.slice(0, 6)
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-ink dark:text-paper">Recent Transactions</h3>
        <Link to="/expenses" className="text-xs text-vault-light font-medium hover:underline">View all</Link>
      </div>
      {recent.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" description="Add your first expense to see it here." />
      ) : (
        <ul className="divide-y divide-black/5 dark:divide-white/5">
          {recent.map(e => {
            const cat = getCategory(e.category)
            const Icon = ICON_MAP[cat.icon]
            return (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}1A` }}>
                  <Icon size={16} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-paper truncate">{e.description}</p>
                  <p className="text-xs text-slate">{cat.label} · {relativeDay(e.date)}</p>
                </div>
                <span className="font-mono text-sm text-ink dark:text-paper whitespace-nowrap">{formatMoney(e.amount, currency)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
