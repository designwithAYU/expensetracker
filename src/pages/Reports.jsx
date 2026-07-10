import { FileDown, FileText, Table2 } from 'lucide-react'
import { useStore } from '../context/store'
import { formatMoney } from '../utils/format'
import { getCategory } from '../constants/categories'
import { byCategory, expensesForMonth, totalOf } from '../utils/analytics'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { exportReportPDF, exportExpensesCSV } from '../utils/pdfExport'

export default function Reports() {
  const reports = useStore(s => s.reports)
  const user = useStore(s => s.user)
  const expenses = useStore(s => s.expenses)
  const currency = user?.currency

  const thisMonth = expensesForMonth(expenses)
  const totalThisMonth = totalOf(thisMonth)
  const catData = byCategory(thisMonth)
  const largestExpense = thisMonth.reduce((max, e) => (e.amount > (max?.amount || 0) ? e : max), null)
  const topCategoryEntry = Object.entries(catData).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink dark:text-paper">Reports</h2>
        <Button size="sm" variant="outline" icon={Table2} onClick={() => exportExpensesCSV(expenses, currency)}>Export CSV</Button>
      </div>

      <Card className="p-5">
        <h3 className="font-display text-lg text-ink dark:text-paper mb-4">This Month at a Glance</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2.5"><span className="text-slate">Income</span><span className="font-mono">{formatMoney(user?.monthlyIncome, currency)}</span></div>
          <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2.5"><span className="text-slate">Expenses</span><span className="font-mono">{formatMoney(totalThisMonth, currency)}</span></div>
          <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2.5"><span className="text-slate">Savings</span><span className="font-mono">{formatMoney((user?.monthlyIncome || 0) - totalThisMonth, currency)}</span></div>
          <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2.5"><span className="text-slate">Largest Expense</span><span className="font-mono">{largestExpense ? `${largestExpense.description} — ${formatMoney(largestExpense.amount, currency)}` : '—'}</span></div>
          <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2.5 sm:col-span-2"><span className="text-slate">Most Spent Category</span><span className="font-mono">{topCategoryEntry ? `${getCategory(topCategoryEntry[0]).label} — ${formatMoney(topCategoryEntry[1], currency)}` : '—'}</span></div>
        </div>
      </Card>

      <div>
        <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Generated AI Reports</h3>
        {reports.length === 0 ? (
          <Card className="p-8">
            <EmptyState icon={FileText} title="No AI reports yet" description="Generate one from the AI Insights page — it will appear here for reference." />
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map(r => (
              <Card key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink dark:text-paper">{r.month} — Health score {r.healthScore}/100</p>
                  <p className="text-xs text-slate mt-0.5">Generated {new Date(r.generatedAt).toLocaleString()}</p>
                </div>
                <Button size="sm" variant="outline" icon={FileDown} onClick={() => exportReportPDF(r, currency)}>PDF</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
