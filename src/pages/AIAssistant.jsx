import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import { useStore } from '../context/store'
import { askFinanceAssistant } from '../services/aiService'
import ChatBubble from '../components/ai/ChatBubble'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const SUGGESTIONS = [
  'How much did I spend on food?',
  'Where can I save money?',
  'What are my biggest expenses?',
  'Compare this month with last month.',
  'How can I improve my savings?',
]

export default function AIAssistant() {
  const aiHistory = useStore(s => s.aiHistory)
  const addAIMessage = useStore(s => s.addAIMessage)
  const clearAIHistory = useStore(s => s.clearAIHistory)
  const expenses = useStore(s => s.expenses)
  const user = useStore(s => s.user)
  const budget = useStore(s => s.budget)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiHistory, loading])

  const send = async (question) => {
    const q = question ?? input
    if (!q.trim() || loading) return
    addAIMessage({ role: 'user', content: q })
    setInput('')
    setLoading(true)
    const answer = await askFinanceAssistant(q, { expenses, user, budget })
    addAIMessage({ role: 'assistant', content: answer })
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-ink dark:text-paper">AI Financial Assistant</h2>
        {aiHistory.length > 0 && (
          <button onClick={clearAIHistory} className="text-xs text-slate hover:text-coral flex items-center gap-1">
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {aiHistory.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-vault/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} className="text-vault-light" />
              </div>
              <p className="text-sm text-slate mb-4">Ask me anything about your spending, grounded in your own data.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-paper-soft dark:bg-ink-soft text-ink/80 dark:text-paper/80 hover:bg-vault/10 hover:text-vault-light transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {aiHistory.map((m, i) => <ChatBubble key={i} role={m.role} content={m.content} />)}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-vault/15 flex items-center justify-center">
                <Sparkles size={14} className="text-vault-light animate-pulse" />
              </div>
              <div className="bg-paper-soft dark:bg-ink-soft rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex gap-2 pt-4 mt-2 border-t border-black/5 dark:border-white/5">
          <input
            className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-paper dark:bg-ink px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-vault/40 focus:border-vault"
            placeholder="Ask about your finances..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <Button icon={Send} onClick={() => send()} disabled={loading} />
        </div>
      </Card>
    </div>
  )
}
