import { Menu, Sun, Moon } from 'lucide-react'
import { useStore } from '../../context/store'
import { useTheme } from '../../hooks/useTheme'
import NotificationBell from '../notifications/NotificationBell'

export default function Topbar({ onMenuClick, title }) {
  const user = useStore(s => s.user)
  const { theme, toggle } = useTheme()

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-black/5 dark:border-white/5 bg-paper/80 dark:bg-ink/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-ink dark:text-paper">
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg sm:text-xl text-ink dark:text-paper">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={toggle} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-ink dark:text-paper">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <NotificationBell />
        <div className="w-9 h-9 rounded-full bg-vault text-white flex items-center justify-center font-display text-sm font-medium">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
