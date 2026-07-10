import { useStore } from '../context/store'
import { byCategory, expensesForMonth, monthlyTrend, weeklyTrend, totalOf } from '../utils/analytics'
import { formatMoney, monthKey } from '../utils/format'
import Card from '../components/ui/Card'
import CategoryPie from '../components/charts/CategoryPie'
import CategoryBarChart from '../components/charts/CategoryBarChart'
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart'
import WeeklyTrendChart from '../components/charts/WeeklyTrendChart'
import BudgetProgress from '../components/dashboard/BudgetProgress'

export default function Analytics() {
  const expenses = useStore(s => s.expenses)
  const user = useStore(s => s.user)
  const budget = useStore(s => s.budget)
  const currency = user?.currency

  const thisMonth = expensesForMonth(expenses)
  const catData = byCategory(thisMonth)
  const mTrend = monthlyTrend(expenses, 6)
  const wTrend = weeklyTrend(expenses, 8)

  const now = new Date()
  const lastMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  const lastMonthTotal = totalOf(expensesForMonth(expenses, lastMonthKey))
  const thisMonthTotal = totalOf(thisMonth)
  const diffPct = lastMonthTotal > 0 ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : null

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl text-ink dark:text-paper">Analytics</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-slate mb-2">This month</p>
          <p className="font-display text-2xl text-ink dark:text-paper">{formatMoney(thisMonthTotal, currency)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-slate mb-2">Last month</p>
          <p className="font-display text-2xl text-ink dark:text-paper">{formatMoney(lastMonthTotal, currency)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-slate mb-2">Month-over-month</p>
          <p className={`font-display text-2xl ${diffPct === null ? 'text-slate' : diffPct > 0 ? 'text-coral' : 'text-vault-light'}`}>
            {diffPct === null ? '—' : `${diffPct > 0 ? '+' : ''}${diffPct}%`}
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Category Breakdown</h3>
          <CategoryPie data={catData} currency={currency} />
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Category Comparison</h3>
          <CategoryBarChart data={catData} currency={currency} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Monthly Spending</h3>
          <MonthlyTrendChart data={mTrend} currency={currency} />
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Weekly Spending</h3>
          <WeeklyTrendChart data={wTrend} currency={currency} />
        </Card>
      </div>

      {budget && (
        <BudgetProgress income={user?.monthlyIncome} spent={thisMonthTotal} currency={currency} />
      )}
    </div>
  )
}
