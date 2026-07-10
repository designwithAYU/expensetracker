import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, PieChart, MessageCircle, Sparkles, Wallet, FileText, Settings, Vault } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/assistant', label: 'AI Assistant', icon: MessageCircle },
  { to: '/insights', label: 'AI Insights', icon: Sparkles },
  { to: '/budget', label: 'Budget Planner', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ onNavigate }) {
  return (
    <nav className="h-full flex flex-col bg-paper-card dark:bg-ink-card border-r border-black/5 dark:border-white/5 w-64 shrink-0">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-black/5 dark:border-white/5">
        <div className="w-8 h-8 rounded-lg bg-vault flex items-center justify-center">
          <Vault size={16} className="text-white" />
        </div>
        <span className="font-display text-lg font-semibold text-ink dark:text-paper">Ledgerly</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-vault/10 text-vault-light'
                : 'text-ink/70 dark:text-paper/70 hover:bg-black/5 dark:hover:bg-white/5'
            )}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <div className="ledger-divider text-slate/30 mb-3" />
        <p className="text-[11px] text-slate leading-relaxed">Your data stays on this device. Nothing leaves your browser except optional AI requests.</p>
      </div>
    </nav>
  )
}
