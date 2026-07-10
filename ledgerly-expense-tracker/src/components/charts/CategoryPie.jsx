import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { getCategory } from '../../constants/categories'
import { formatMoney } from '../../utils/format'
import EmptyState from '../ui/EmptyState'
import { PieChart as PieIcon } from 'lucide-react'

export default function CategoryPie({ data, currency, height = 260 }) {
  const entries = Object.entries(data).map(([id, value]) => ({ id, value, ...getCategory(id) }))
  if (!entries.length) return <EmptyState icon={PieIcon} title="No spending data" description="Add expenses to see your category breakdown." />

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={entries} dataKey="value" nameKey="label" innerRadius="58%" outerRadius="85%" paddingAngle={3} strokeWidth={0}>
            {entries.map(e => <Cell key={e.id} fill={e.color} />)}
          </Pie>
          <Tooltip
            formatter={(value, name) => [formatMoney(value, currency), name]}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
