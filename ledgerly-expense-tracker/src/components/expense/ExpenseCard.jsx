import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { getCategory } from '../../constants/categories'
import { ICON_MAP } from '../../constants/iconMap'
import { formatMoney, formatDate } from '../../utils/format'
import Card from '../ui/Card'

export default function ExpenseCard({ expense, currency, onEdit, onDelete }) {
  const cat = getCategory(expense.category)
  const Icon = ICON_MAP[cat.icon]

  return (
    <Card className="p-4 flex items-center gap-3 hover:border-vault/30 transition-colors group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}1A` }}>
        <Icon size={17} style={{ color: cat.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink dark:text-paper truncate">{expense.description}</p>
        <p className="text-xs text-slate">{cat.label} · {expense.paymentMethod} · {formatDate(expense.date)}</p>
      </div>
      <span className="font-mono text-sm font-medium text-ink dark:text-paper whitespace-nowrap">{formatMoney(expense.amount, currency)}</span>
      <div className="hidden group-hover:flex items-center gap-1 ml-1">
        <button onClick={() => onEdit(expense)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate hover:text-vault-light">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(expense.id)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate hover:text-coral">
          <Trash2 size={14} />
        </button>
      </div>
    </Card>
  )
}
