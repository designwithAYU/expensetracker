import clsx from 'clsx'

export default function Badge({ children, color, className }) {
  return (
    <span
      className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', className)}
      style={color ? { backgroundColor: `${color}1A`, color } : undefined}
    >
      {color && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
      {children}
    </span>
  )
}
