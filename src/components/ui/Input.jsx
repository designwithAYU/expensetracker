import clsx from 'clsx'

export default function Input({ label, error, className, containerClassName, prefix, ...props }) {
  return (
    <label className={clsx('block', containerClassName)}>
      {label && <span className="block text-sm font-medium text-ink/70 dark:text-paper/70 mb-1.5">{label}</span>}
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate text-sm">{prefix}</span>}
        <input
          className={clsx(
            'w-full rounded-xl border border-black/10 dark:border-white/10 bg-paper dark:bg-ink px-3.5 py-2.5 text-sm text-ink dark:text-paper placeholder:text-slate/60 outline-none focus:ring-2 focus:ring-vault/40 focus:border-vault transition-all',
            prefix && 'pl-7',
            error && 'border-coral focus:ring-coral/30 focus:border-coral',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="block text-xs text-coral mt-1">{error}</span>}
    </label>
  )
}
