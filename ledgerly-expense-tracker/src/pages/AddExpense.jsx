import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, Check } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories'
import { useStore } from '../context/store'
import { categorizeExpense, parseNaturalLanguageExpense } from '../services/aiService'
import { useToast } from '../hooks/useToast'

export default function AddExpense() {
  const navigate = useNavigate()
  const addExpense = useStore(s => s.addExpense)
  const user = useStore(s => s.user)
  const toast = useToast()

  const [nlInput, setNlInput] = useState('')
  const [aiApplied, setAiApplied] = useState(false)
  const [form, setForm] = useState({
    description: '', amount: '', category: 'other', paymentMethod: 'UPI',
    date: new Date().toISOString().slice(0, 10), notes: '',
  })

  const update = (patch) => setForm(f => ({ ...f, ...patch }))

  const handleParse = () => {
    if (!nlInput.trim()) return
    const parsed = parseNaturalLanguageExpense(nlInput)
    setForm(f => ({ ...f, description: parsed.description, amount: parsed.amount || f.amount, category: parsed.category, date: parsed.date }))
    setAiApplied(true)
    toast.success('AI parsed your expense — review and save below.')
  }

  const handleDescriptionBlur = () => {
    if (form.description && form.category === 'other') {
      const guess = categorizeExpense(form.description)
      if (guess !== 'other') update({ category: guess })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) {
      toast.error('Description and amount are required.')
      return
    }
    addExpense({ ...form, amount: Number(form.amount) })
    toast.success('Expense added.')
    navigate('/expenses')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card className="p-5 bg-gradient-to-br from-vault/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-gold" />
          <h3 className="font-display text-lg text-ink dark:text-paper">Quick add with AI</h3>
        </div>
        <p className="text-sm text-slate mb-3">Describe your expense naturally, and AI will fill the form for you.</p>
        <div className="flex gap-2">
          <Input
            placeholder='e.g. "Spent ₹350 on Pizza yesterday"'
            value={nlInput}
            onChange={e => setNlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleParse())}
            containerClassName="flex-1"
          />
          <Button onClick={handleParse} icon={Wand2}>Parse</Button>
        </div>
        {aiApplied && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-vault-light flex items-center gap-1.5 mt-3">
            <Check size={13} /> Fields below were auto-filled — feel free to adjust.
          </motion.p>
        )}
      </Card>

      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Description" placeholder="e.g. Dinner with friends" value={form.description} onChange={e => update({ description: e.target.value })} onBlur={handleDescriptionBlur} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" prefix={user?.currency === 'USD' ? '$' : '₹'} value={form.amount} onChange={e => update({ amount: e.target.value })} required />
            <Input label="Date" type="date" value={form.date} onChange={e => update({ date: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={e => update({ category: e.target.value })} options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))} />
            <Select label="Payment Method" value={form.paymentMethod} onChange={e => update({ paymentMethod: e.target.value })} options={PAYMENT_METHODS} />
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-ink/70 dark:text-paper/70 mb-1.5">Notes</span>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-paper dark:bg-ink px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-vault/40 focus:border-vault transition-all resize-none"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={e => update({ notes: e.target.value })}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
