import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatMoney } from '../../utils/format'

export default function MonthlyTrendChart({ data, currency, height = 260 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="vaultFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F5C56" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0F5C56" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-black/5 dark:text-white/10" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v} />
          <Tooltip formatter={(v) => formatMoney(v, currency)} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 13 }} />
          <Area type="monotone" dataKey="total" stroke="#0F5C56" strokeWidth={2.5} fill="url(#vaultFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
