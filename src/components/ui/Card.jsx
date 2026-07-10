import clsx from 'clsx'

export default function Card({ children, className, as: As = 'div', ...props }) {
  return (
    <As
      className={clsx(
        'bg-paper-card dark:bg-ink-card border border-black/5 dark:border-white/5 rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </As>
  )
}
