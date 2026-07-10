import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vault, ArrowRight, GitFork, Sparkles, PieChart, MessageCircle, ShieldCheck } from 'lucide-react'

const features = [
  { icon: Sparkles, title: 'Natural language entry', desc: '"Spent ₹350 on pizza yesterday" becomes a categorized, dated expense automatically.' },
  { icon: PieChart, title: 'Live analytics', desc: 'Category breakdowns, monthly trends, and weekly spending, visualized as you spend.' },
  { icon: MessageCircle, title: 'AI finance assistant', desc: 'Ask where your money went and get answers grounded in your own ledger, not guesses.' },
  { icon: ShieldCheck, title: 'Private by default', desc: 'Everything lives in your browser. Nothing is uploaded except optional AI requests.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink dark:text-paper">
      <nav className="flex items-center justify-between px-6 sm:px-10 h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-vault flex items-center justify-center">
            <Vault size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-semibold">Ledgerly</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70 dark:text-paper/70">
          <a href="#features" className="hover:text-vault-light transition-colors">Features</a>
          <a href="#about" className="hover:text-vault-light transition-colors">About</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-vault-light transition-colors flex items-center gap-1.5"><GitFork size={15} /> GitHub</a>
        </div>
        <Link to="/onboarding" className="text-sm font-medium bg-vault text-white px-4 py-2 rounded-xl hover:bg-vault-light transition-colors">
          Get Started
        </Link>
      </nav>

      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <span className="inline-block text-xs uppercase tracking-widest text-gold font-semibold mb-4">Personal finance, sharpened</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] mb-6">
            Track every rupee.<br />Understand every pattern.
          </h1>
          <p className="text-base sm:text-lg text-slate max-w-lg mb-8 leading-relaxed">
            Ledgerly turns scattered spending into a clear ledger — with AI that categorizes, explains, and plans your budget, entirely from data that stays on your device.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/onboarding" className="inline-flex items-center gap-2 bg-vault text-white px-6 py-3 rounded-xl font-medium hover:bg-vault-light transition-colors">
              Get Started <ArrowRight size={16} />
            </Link>
            <a href="#features" className="text-sm font-medium text-ink/70 dark:text-paper/70 hover:text-vault-light">See how it works</a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <div className="rounded-3xl bg-ink-card border border-white/10 p-6 shadow-2xl shadow-vault/10 rotate-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-paper/60 text-xs uppercase tracking-wider">Financial Health</span>
              <span className="text-gold text-xs font-medium">Excellent</span>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff1a" strokeWidth="7" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#C9A227" strokeWidth="7" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * 0.18} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-paper font-semibold">82</div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex justify-between text-sm"><span className="text-paper/60">Income</span><span className="text-paper font-mono">₹85,000</span></div>
                <div className="flex justify-between text-sm"><span className="text-paper/60">Spent</span><span className="text-paper font-mono">₹52,300</span></div>
                <div className="flex justify-between text-sm"><span className="text-paper/60">Saved</span><span className="text-gold font-mono">₹32,700</span></div>
              </div>
            </div>
            <div className="ledger-divider text-white/10 mb-4" />
            <p className="text-paper/70 text-sm leading-relaxed">"Your biggest category this month is Food at ₹14,200 — trimming 15% there could add ₹2,100 to savings."</p>
          </div>
        </motion.div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 sm:px-10 py-20 border-t border-black/5 dark:border-white/5">
        <h2 className="font-display text-3xl mb-12">Built for how money actually moves</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
              <div className="w-11 h-11 rounded-xl bg-vault/10 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-vault-light" />
              </div>
              <h3 className="font-display text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-6 sm:px-10 py-20 border-t border-black/5 dark:border-white/5">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl mb-4">No backend. No accounts. No leaks.</h2>
            <p className="text-slate leading-relaxed mb-6">Ledgerly runs entirely in your browser. Your expenses, budget, and settings are stored locally, and only your natural-language questions are ever sent out — and only if you connect an AI key yourself.</p>
            <Link to="/onboarding" className="inline-flex items-center gap-2 text-vault-light font-medium hover:underline">
              Start tracking now <ArrowRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl bg-paper-soft dark:bg-ink-soft p-8">
            <div className="ledger-divider text-slate/30 mb-4" />
            <p className="font-mono text-sm text-slate">localStorage.expenses → [ ... ]</p>
            <p className="font-mono text-sm text-slate">localStorage.budget → {'{'} food: 8000, ... {'}'}</p>
            <p className="font-mono text-sm text-slate">network requests → none, unless AI key set</p>
            <div className="ledger-divider text-slate/30 mt-4" />
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 sm:px-10 py-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-sm text-slate">
        <span>Ledgerly — a portfolio fintech project</span>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-vault-light flex items-center gap-1.5"><GitFork size={14} /> Source</a>
      </footer>
    </div>
  )
}
