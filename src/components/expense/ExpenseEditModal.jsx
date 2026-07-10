import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { CATEGORIES, PAYMENT_METHODS } from '../../constants/categories'

export default function ExpenseEditModal({ expense, onClose, onSave }) {
  const [form, setForm] = useState(expense)
  useEffect(() => setForm(expense), [expense])
  if (!expense) return null

  const update = (patch) => setForm(f => ({ ...f, ...patch }))

  return (
    <Modal open={!!expense} onClose={onClose} title="Edit Expense">
      <div className="space-y-4">
        <Input label="Description" value={form.description} onChange={e => update({ description: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Amount" type="number" value={form.amount} onChange={e => update({ amount: e.target.value })} />
          <Input label="Date" type="date" value={form.date} onChange={e => update({ date: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" value={form.category} onChange={e => update({ category: e.target.value })} options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))} />
          <Select label="Payment Method" value={form.paymentMethod} onChange={e => update({ paymentMethod: e.target.value })} options={PAYMENT_METHODS} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  )
}
