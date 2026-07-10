import clsx from 'clsx'

export default function Skeleton({ className }) {
  return <div className={clsx('animate-pulse rounded-lg bg-black/5 dark:bg-white/5', className)} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/5 p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}
