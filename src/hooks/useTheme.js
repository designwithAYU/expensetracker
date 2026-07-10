import { useEffect } from 'react'
import { useStore } from '../context/store'

export function useTheme() {
  const theme = useStore(s => s.settings?.theme || 'dark')
  const updateSettings = useStore(s => s.updateSettings)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  const toggle = () => updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' })
  return { theme, toggle }
}
