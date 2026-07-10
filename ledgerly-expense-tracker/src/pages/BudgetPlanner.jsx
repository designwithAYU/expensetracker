import { useState } from 'react'
import { Wand2, Save } from 'lucide-react'
import { useStore } from '../context/store'
import { generateOptimizedBudget } from '../services/aiService'
import { getCategory } from '../constants/categories'
import { formatMoney } from '../utils/format'
import { expensesForMonth, byCategory } from '../utils/analytics'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useToast } from '../hooks/useToast'

export default function BudgetPlanner() {
  const user = useStore(s => s.user)
  const budget = useStore(s => s.budget)
  const setBudget = useStore(s => s.setBudget)
  const expenses = useStore(s => s.expenses)
  const toast = useToast()
  const currency = user?.currency

  const [income, setIncome] = useState(user?.monthlyIncome || 0)
  const [savingsGoal, setSavingsGoal] = useState(user?.savingsGoal || 0)
  const [draft, setDraft] = useState(budget)

  const actualSpend = byCategory(expensesForMonth(expenses))

  const generate = () => {
    const allocation = generateOptimizedBudget({ income: Number(income), savingsGoal: Number(savingsGoal) })
    setDraft(allocation)
  }

  const updateCategory = (cat, value) => setDraft(d => ({ ...d, [cat]: Number(value) }))

  const save = () => {
    setBudget(draft)
    toast.success('Budget saved.')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h2 className="font-display text-2xl text-ink dark:text-paper">Budget Planner</h2>

      <Card className="p-5">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input label="Monthly Income" type="number" prefix={currency === 'USD' ? '$' : '₹'} value={income} onChange={e => setIncome(e.target.value)} />
          <Input label="Savings Goal" type="number" prefix={currency === 'USD' ? '$' : '₹'} value={savingsGoal} onChange={e => setSavingsGoal(e.target.value)} />
        </div>
        <Button icon={Wand2} onClick={generate}>Generate Optimized Budget</Button>
      </Card>

      {draft && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-ink dark:text-paper">Allocation</h3>
            <Button size="sm" icon={Save} onClick={save}>Save Budget</Button>
          </div>
          <div className="space-y-4">
            {Object.entries(draft).map(([cat, amt]) => {
              const category = getCategory(cat)
              const spent = actualSpend[cat] || 0
              const overBudget = spent > amt
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink dark:text-paper">{category.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${overBudget ? 'text-coral' : 'text-slate'}`}>spent {formatMoney(spent, currency)}</span>
                      <input
                        type="number"
                        className="w-24 text-right rounded-lg border border-black/10 dark:border-white/10 bg-paper dark:bg-ink px-2 py-1 text-sm font-mono"
                        value={amt}
                        onChange={e => updateCategory(cat, e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (spent / (amt || 1)) * 100)}%`, backgroundColor: overBudget ? '#E15554' : category.color }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="ledger-divider text-slate/20 my-4" />
          <div className="flex justify-between text-sm">
            <span className="text-slate">Total allocated</span>
            <span className="font-mono font-medium text-ink dark:text-paper">{formatMoney(Object.values(draft).reduce((a, b) => a + b, 0), currency)}</span>
          </div>
        </Card>
      )}
    </div>
  )
}
