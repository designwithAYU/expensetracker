import { Link, useNavigate } from 'react-router-dom'
import { Wallet, TrendingDown, PiggyBank, Landmark, Plus, MessageCircle, Sparkles, FileDown } from 'lucide-react'
import { useStore } from '../context/store'
import { totalOf, expensesForMonth, byCategory, monthlyTrend, weeklyTrend, financialHealthScore } from '../utils/analytics'
import { formatMoney } from '../utils/format'
import VaultDial from '../components/dashboard/VaultDial'
import StatCard from '../components/dashboard/StatCard'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import CategoryPie from '../components/charts/CategoryPie'
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart'
import WeeklyTrendChart from '../components/charts/WeeklyTrendChart'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { exportDashboardPDF } from '../utils/pdfExport'

export default function Dashboard() {
  const user = useStore(s => s.user)
  const expenses = useStore(s => s.expenses)
  const navigate = useNavigate()
  const currency = user?.currency

  const thisMonth = expensesForMonth(expenses)
  const totalThisMonth = totalOf(thisMonth)
  const remaining = (user?.monthlyIncome || 0) - totalThisMonth
  const health = financialHealthScore({ income: user?.monthlyIncome, expenses: thisMonth, savingsGoal: user?.savingsGoal })
  const catData = byCategory(thisMonth)
  const mTrend = monthlyTrend(expenses)
  const wTrend = weeklyTrend(expenses)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate">{greeting()},</p>
          <h2 className="font-display text-2xl text-ink dark:text-paper">{user?.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon={Plus} onClick={() => navigate('/add-expense')}>Add Expense</Button>
          <Button size="sm" variant="outline" icon={MessageCircle} onClick={() => navigate('/assistant')}>Ask AI</Button>
          <Button size="sm" variant="outline" icon={Sparkles} onClick={() => navigate('/insights')}>Generate Report</Button>
          <Button size="sm" variant="outline" icon={FileDown} onClick={() => exportDashboardPDF({ user, totalThisMonth, remaining, health, catData, currency })}>Export PDF</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 flex flex-col items-center justify-center lg:col-span-1">
          <VaultDial score={health.score} label={health.label} />
          <div className="grid grid-cols-3 gap-3 w-full mt-5">
            {health.factors.map(f => (
              <div key={f.label} className="text-center">
                <p className={`font-mono text-sm font-medium ${f.good ? 'text-vault-light' : 'text-coral'}`}>{f.value}</p>
                <p className="text-[11px] text-slate mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          <StatCard label="Income" value={formatMoney(user?.monthlyIncome, currency)} icon={Landmark} delay={0.05} />
          <StatCard label="Total Expenses" value={formatMoney(totalThisMonth, currency)} icon={TrendingDown} tone="negative" delay={0.1} />
          <StatCard label="Total Savings" value={formatMoney(Math.max(0, remaining), currency)} icon={PiggyBank} tone="positive" delay={0.15} />
          <StatCard label="Remaining Budget" value={formatMoney(remaining, currency)} icon={Wallet} tone={remaining < 0 ? 'negative' : 'gold'} delay={0.2} />
        </div>
      </div>

      <BudgetProgress income={user?.monthlyIncome} spent={totalThisMonth} currency={currency} />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Spending by Category</h3>
          <CategoryPie data={catData} currency={currency} />
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Monthly Expense Trend</h3>
          <MonthlyTrendChart data={mTrend} currency={currency} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-display text-lg text-ink dark:text-paper mb-3">Weekly Expense Trend</h3>
          <WeeklyTrendChart data={wTrend} currency={currency} />
        </Card>
        <RecentTransactions expenses={expenses} currency={currency} />
      </div>
    </div>
  )
}
