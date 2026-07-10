import clsx from 'clsx'
import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-vault text-white hover:bg-vault-light shadow-sm shadow-vault/30',
  gold: 'bg-gold text-ink hover:bg-gold-light shadow-sm shadow-gold/30',
  ghost: 'bg-transparent text-ink dark:text-paper hover:bg-black/5 dark:hover:bg-white/5',
  outline: 'bg-transparent border border-black/10 dark:border-white/15 text-ink dark:text-paper hover:bg-black/5 dark:hover:bg-white/5',
  danger: 'bg-coral/10 text-coral hover:bg-coral/20',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3 rounded-xl',
}

export default function Button({ children, variant = 'primary', size = 'md', className, icon: Icon, iconRight, disabled, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {Icon && !iconRight && <Icon size={16} strokeWidth={2} />}
      {children}
      {Icon && iconRight && <Icon size={16} strokeWidth={2} />}
    </motion.button>
  )
}
