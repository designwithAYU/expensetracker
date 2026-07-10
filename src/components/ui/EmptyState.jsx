import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-vault/10 flex items-center justify-center mb-4">
          <Icon size={24} className="text-vault" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-display text-lg font-medium text-ink dark:text-paper mb-1">{title}</h3>
      {description && <p className="text-sm text-slate max-w-xs mb-5">{description}</p>}
      {actionLabel && (
        <Button onClick={onAction} size="sm">{actionLabel}</Button>
      )}
    </div>
  )
}
