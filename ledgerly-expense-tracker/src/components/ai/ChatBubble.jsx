import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Vault, User } from 'lucide-react'

export default function ChatBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={clsx('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isUser ? 'bg-gold/20 text-gold' : 'bg-vault/15 text-vault-light')}>
        {isUser ? <User size={15} /> : <Vault size={15} />}
      </div>
      <div className={clsx(
        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        isUser ? 'bg-vault text-white rounded-tr-sm' : 'bg-paper-soft dark:bg-ink-soft text-ink dark:text-paper rounded-tl-sm'
      )}>
        {content}
      </div>
    </motion.div>
  )
}
