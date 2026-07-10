import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function FloatingActionButton() {
  const navigate = useNavigate()
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => navigate('/add-expense')}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-2xl bg-gold text-ink shadow-lg shadow-gold/30 flex items-center justify-center lg:hidden"
      aria-label="Add expense"
    >
      <Plus size={24} strokeWidth={2.5} />
    </motion.button>
  )
}
