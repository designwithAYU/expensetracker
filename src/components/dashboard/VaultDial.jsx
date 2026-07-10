import { useMemo } from 'react'

// Signature element: a circular "vault dial" gauge with tick marks like a
// bank vault combination dial, with the needle/arc sweeping in on load.
export default function VaultDial({ score = 0, label = '', size = 176 }) {
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(100, score)) / 100
  const offset = circumference * (1 - pct)

  const ticks = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 40; i++) {
      const angle = (i / 40) * 360
      arr.push(angle)
    }
    return arr
  }, [])

  const color = score >= 80 ? 'var(--color-vault-light)' : score >= 60 ? 'var(--color-gold)' : score >= 40 ? '#E0975B' : 'var(--color-coral)'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 180 180" className="-rotate-90">
        {ticks.map((angle, i) => (
          <line
            key={i}
            x1={90 + 80 * Math.cos((angle * Math.PI) / 180)}
            y1={90 + 80 * Math.sin((angle * Math.PI) / 180)}
            x2={90 + (i % 5 === 0 ? 74 : 77) * Math.cos((angle * Math.PI) / 180)}
            y2={90 + (i % 5 === 0 ? 74 : 77) * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
            className="text-ink/15 dark:text-paper/15"
          />
        ))}
        <circle cx="90" cy="90" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-ink/5 dark:text-paper/8" />
        <circle
          cx="90" cy="90" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ '--dial-full': circumference, '--dial-offset': offset, strokeDashoffset: circumference }}
          className="animate-dial-sweep"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold text-ink dark:text-paper tabular-nums">{score}</span>
        <span className="text-[11px] uppercase tracking-wider text-slate mt-0.5">{label}</span>
      </div>
    </div>
  )
}
