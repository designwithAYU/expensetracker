import { useState } from 'react'
import { Sparkles, RefreshCw, FileDown, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useStore } from '../context/store'
import { generateAIReport, predictNextMonthSpend } from '../services/aiService'
import { getCategory } from '../constants/categories'
import { formatMoney } from '../utils/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import VaultDial from '../components/dashboard/VaultDial'
import { CardSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { exportReportPDF } from '../utils/pdfExport'
import { useToast } from '../hooks/useToast'

export default function AIInsights() {
  const expenses = useStore(s => s.expenses)
  const user = useStore(s => s.user)
  const budget = useStore(s => s.budget)
  const saveReport = useStore(s => s.saveReport)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const currency = user?.currency

  const generate = async () => {
    setLoading(true)
    const r = await generateAIReport({ expenses, user, budget })
    setReport(r)
    saveReport(r)
    setLoading(false)
  }

  const prediction = expenses.length ? predictNextMonthSpend(expenses) : 0

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink dark:text-paper">AI Insights</h2>
        <Button icon={report ? RefreshCw : Sparkles} onClick={generate} disabled={loading}>
          {report ? 'Regenerate Report' : 'Generate AI Report'}
        </Button>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      )}

      {!loading && !report && (
        <Card className="p-8">
          <EmptyState icon={Sparkles} title="No report yet" description="Generate an AI-powered analysis of your spending, savings, and budget health." actionLabel="Generate AI Report" onAction={generate} />
        </Card>
      )}

      {!loading && report && (
        <>
          <Card className="p-6 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
            <VaultDial score={report.healthScore} label={report.healthLabel} size={140} />
            <div>
              <h3 className="font-display text-lg text-ink dark:text-paper mb-2">{report.month} Summary</h3>
              <p className="text-sm text-slate leading-relaxed">{report.summary}</p>
            </div>
          </Card>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-slate mb-2">Predicted next month</p>
              <p className="font-display text-xl text-ink dark:text-paper">{formatMoney(prediction, currency)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-slate mb-2">Spending trend</p>
              <p className="font-display text-xl flex items-center gap-1.5">
                {report.trendDirection === 'rising'
                  ? <><TrendingUp size={18} className="text-coral" /> <span className="text-coral">Rising</span></>
                  : <><TrendingDown size={18} className="text-vault-light" /> <span className="text-vault-light">Falling</span></>}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-slate mb-2">Total this month</p>
              <p className="font-display text-xl text-ink dark:text-paper">{formatMoney(report.totalSpent, currency)}</p>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Top Expense Categories</h3>
            <div className="space-y-3">
              {report.topCategories.map(([id, amt]) => {
                const cat = getCategory(id)
                const pct = report.totalSpent > 0 ? (amt / report.totalSpent) * 100 : 0
                return (
                  <div key={id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ink dark:text-paper">{cat.label}</span>
                      <span className="font-mono text-slate">{formatMoney(amt, currency)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {report.unusual.length > 0 && (
            <Card className="p-5 border-gold/30">
              <h3 className="font-display text-lg text-ink dark:text-paper mb-3 flex items-center gap-2">
                <AlertTriangle size={17} className="text-gold" /> Areas to Watch
              </h3>
              <ul className="space-y-2">
                {report.unusual.map(u => (
                  <li key={u.category} className="text-sm text-slate">
                    <span className="text-ink dark:text-paper font-medium">{getCategory(u.category).label}</span> spending is up {u.increase}% versus last month.
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="flex justify-end">
            <Button variant="outline" icon={FileDown} onClick={() => { exportReportPDF(report, currency); toast.success('Report exported.') }}>Export PDF</Button>
          </div>
        </>
      )}
    </div>
  )
}
