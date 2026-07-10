import { useRef } from 'react'
import { Sun, Moon, Download, Upload, Trash2, Bot } from 'lucide-react'
import { useStore } from '../context/store'
import { useTheme } from '../hooks/useTheme'
import { CURRENCIES } from '../constants/currencies'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { storage } from '../utils/storage'
import { useToast } from '../hooks/useToast'

export default function SettingsPage() {
  const user = useStore(s => s.user)
  const updateUser = useStore(s => s.updateUser)
  const settings = useStore(s => s.settings)
  const updateSettings = useStore(s => s.updateSettings)
  const resetAll = useStore(s => s.resetAll)
  const importData = useStore(s => s.importData)
  const { theme, toggle } = useTheme()
  const toast = useToast()
  const fileRef = useRef(null)

  const handleExport = () => {
    const data = storage.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ledgerly-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exported.')
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        importData(data)
        toast.success('Backup imported.')
      } catch {
        toast.error('Invalid backup file.')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (confirm('This will permanently delete all your data on this device. Continue?')) {
      resetAll()
      window.location.href = '/'
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h2 className="font-display text-2xl text-ink dark:text-paper">Settings</h2>

      <Card className="p-5">
        <h3 className="font-display text-lg text-ink dark:text-paper mb-4">Profile</h3>
        <div className="space-y-4">
          <Input label="Name" value={user?.name || ''} onChange={e => updateUser({ name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly Income" type="number" value={user?.monthlyIncome || ''} onChange={e => updateUser({ monthlyIncome: Number(e.target.value) })} />
            <Input label="Savings Goal" type="number" value={user?.savingsGoal || ''} onChange={e => updateUser({ savingsGoal: Number(e.target.value) })} />
          </div>
          <Select label="Currency" value={user?.currency} onChange={e => updateUser({ currency: e.target.value })} options={CURRENCIES.map(c => ({ value: c.code, label: `${c.symbol} ${c.label}` }))} />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display text-lg text-ink dark:text-paper mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink/80 dark:text-paper/80">Theme</span>
          <Button size="sm" variant="outline" icon={theme === 'dark' ? Sun : Moon} onClick={toggle}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display text-lg text-ink dark:text-paper mb-1 flex items-center gap-2"><Bot size={17} /> AI Provider</h3>
        <p className="text-xs text-slate mb-4">Ledgerly works fully offline using local rule-based AI. Add your own key for richer, live responses.</p>
        <div className="space-y-4">
          <Select label="Provider" value={settings.aiProvider} onChange={e => updateSettings({ aiProvider: e.target.value })}
            options={[{ value: 'local', label: 'Local (offline, no key needed)' }, { value: 'openai', label: 'OpenAI' }, { value: 'gemini', label: 'Google Gemini' }]} />
          {settings.aiProvider !== 'local' && (
            <Input label="API Key" type="password" placeholder="sk-..." value={settings.aiApiKey} onChange={e => updateSettings({ aiApiKey: e.target.value })} />
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display text-lg text-ink dark:text-paper mb-4">Data</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" icon={Download} onClick={handleExport}>Export Backup</Button>
          <Button size="sm" variant="outline" icon={Upload} onClick={() => fileRef.current?.click()}>Import Backup</Button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
          <Button size="sm" variant="danger" icon={Trash2} onClick={handleReset}>Reset All Data</Button>
        </div>
      </Card>
    </div>
  )
}
