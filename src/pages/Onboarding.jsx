import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Vault, ArrowRight, ArrowLeft } from 'lucide-react'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { CURRENCIES } from '../constants/currencies'
import { useStore } from '../context/store'

const steps = ['name', 'income', 'goal', 'currency']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', monthlyIncome: '', savingsGoal: '', currency: 'INR' })
  const setUser = useStore(s => s.setUser)
  const navigate = useNavigate()

  const update = (patch) => setForm(f => ({ ...f, ...patch }))
  const next = () => (step < steps.length - 1 ? setStep(step + 1) : finish())
  const back = () => step > 0 && setStep(step - 1)

  const finish = () => {
    setUser({
      name: form.name || 'Friend',
      monthlyIncome: Number(form.monthlyIncome) || 0,
      savingsGoal: Number(form.savingsGoal) || 0,
      currency: form.currency,
      createdAt: new Date().toISOString(),
    })
    navigate('/dashboard')
  }

  const canProceed = {
    0: form.name.trim().length > 0,
    1: Number(form.monthlyIncome) > 0,
    2: Number(form.savingsGoal) >= 0,
    3: !!form.currency,
  }[step]

  return (
    <div className="min-h-screen bg-paper dark:bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-vault flex items-center justify-center">
            <Vault size={17} className="text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-ink dark:text-paper">Ledgerly</span>
        </div>

        <div className="flex gap-1.5 mb-8">
          {steps.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-vault' : 'bg-black/10 dark:bg-white/10'}`} />
          ))}
        </div>

        <div className="bg-paper-card dark:bg-ink-card border border-black/5 dark:border-white/5 rounded-2xl p-7">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="name" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h2 className="font-display text-2xl text-ink dark:text-paper mb-1.5">What should we call you?</h2>
                <p className="text-sm text-slate mb-5">We'll use this to personalize your dashboard.</p>
                <Input autoFocus placeholder="e.g. Aditi Sharma" value={form.name} onChange={e => update({ name: e.target.value })} onKeyDown={e => e.key === 'Enter' && canProceed && next()} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="income" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h2 className="font-display text-2xl text-ink dark:text-paper mb-1.5">Monthly income</h2>
                <p className="text-sm text-slate mb-5">Used to calculate your budget and health score.</p>
                <Input autoFocus type="number" placeholder="85000" prefix="₹" value={form.monthlyIncome} onChange={e => update({ monthlyIncome: e.target.value })} onKeyDown={e => e.key === 'Enter' && canProceed && next()} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="goal" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h2 className="font-display text-2xl text-ink dark:text-paper mb-1.5">Monthly savings goal</h2>
                <p className="text-sm text-slate mb-5">How much would you like to save each month?</p>
                <Input autoFocus type="number" placeholder="20000" prefix="₹" value={form.savingsGoal} onChange={e => update({ savingsGoal: e.target.value })} onKeyDown={e => e.key === 'Enter' && canProceed && next()} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="currency" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <h2 className="font-display text-2xl text-ink dark:text-paper mb-1.5">Preferred currency</h2>
                <p className="text-sm text-slate mb-5">You can change this later in Settings.</p>
                <Select value={form.currency} onChange={e => update({ currency: e.target.value })} options={CURRENCIES.map(c => ({ value: c.code, label: `${c.symbol} ${c.label}` }))} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-7">
            <Button variant="ghost" size="sm" onClick={back} disabled={step === 0} icon={ArrowLeft}>Back</Button>
            <Button size="sm" onClick={next} disabled={!canProceed} icon={ArrowRight} iconRight>
              {step === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
