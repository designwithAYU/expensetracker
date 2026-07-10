import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Receipt, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/store'
import { CATEGORIES } from '../constants/categories'
import ExpenseCard from '../components/expense/ExpenseCard'
import ExpenseEditModal from '../components/expense/ExpenseEditModal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { useToast } from '../hooks/useToast'

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Highest amount' },
  { value: 'amount-asc', label: 'Lowest amount' },
]

export default function ExpenseList() {
  const expenses = useStore(s => s.expenses)
  const user = useStore(s => s.user)
  const updateExpense = useStore(s => s.updateExpense)
  const deleteExpense = useStore(s => s.deleteExpense)
  const navigate = useNavigate()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('date-desc')
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    let list = expenses.filter(e => {
      const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) || (e.notes || '').toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || e.category === category
      return matchesSearch && matchesCategory
    })
    const [key, dir] = sort.split('-')
    list = [...list].sort((a, b) => {
      let cmp = key === 'date' ? new Date(a.date) - new Date(b.date) : a.amount - b.amount
      return dir === 'desc' ? -cmp : cmp
    })
    return list
  }, [expenses, search, category, sort])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink dark:text-paper">All Expenses</h2>
        <Button size="sm" icon={Plus} onClick={() => navigate('/add-expense')}>Add Expense</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          containerClassName="flex-1"
          placeholder="Search expenses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={<Search size={15} />}
        />
        <Select
          value={category}
          onChange={e => setCategory(e.target.value)}
          options={[{ value: 'all', label: 'All Categories' }, ...CATEGORIES.map(c => ({ value: c.id, label: c.label }))]}
          containerClassName="sm:w-52"
        />
        <Select value={sort} onChange={e => setSort(e.target.value)} options={SORT_OPTIONS} containerClassName="sm:w-48" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No expenses found" description="Try adjusting your filters, or add a new expense." actionLabel="Add Expense" onAction={() => navigate('/add-expense')} />
      ) : (
        <div className="space-y-2.5">
          {filtered.map(e => (
            <ExpenseCard
              key={e.id}
              expense={e}
              currency={user?.currency}
              onEdit={setEditing}
              onDelete={(id) => { deleteExpense(id); toast.info('Expense deleted.') }}
            />
          ))}
        </div>
      )}

      <ExpenseEditModal
        expense={editing}
        onClose={() => setEditing(null)}
        onSave={(form) => { updateExpense(form.id, { ...form, amount: Number(form.amount) }); setEditing(null); toast.success('Expense updated.') }}
      />
    </div>
  )
}
