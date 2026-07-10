import clsx from 'clsx'

export default function Select({ label, options, className, containerClassName, ...props }) {
  return (
    <label className={clsx('block', containerClassName)}>
      {label && <span className="block text-sm font-medium text-ink/70 dark:text-paper/70 mb-1.5">{label}</span>}
      <select
        className={clsx(
          'w-full rounded-xl border border-black/10 dark:border-white/10 bg-paper dark:bg-ink px-3.5 py-2.5 text-sm text-ink dark:text-paper outline-none focus:ring-2 focus:ring-vault/40 focus:border-vault transition-all',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
    </label>
  )
}
