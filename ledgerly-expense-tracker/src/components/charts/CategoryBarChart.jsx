import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getCategory } from '../../constants/categories'
import { formatMoney } from '../../utils/format'

export default function CategoryBarChart({ data, currency, height = 280 }) {
  const entries = Object.entries(data).map(([id, value]) => ({ id, value, label: getCategory(id).label, color: getCategory(id).color }))
    .sort((a, b) => b.value - a.value)
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={entries} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-black/5 dark:text-white/10" />
          <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
          <Tooltip formatter={(v) => formatMoney(v, currency)} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
            {entries.map(e => <Cell key={e.id} fill={e.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
