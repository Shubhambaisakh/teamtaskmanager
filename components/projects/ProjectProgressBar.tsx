import { cn } from '@/lib/utils'

interface ProjectProgressBarProps {
  progress: number
}

export function ProjectProgressBar({ progress }: ProjectProgressBarProps) {
  const getColorClass = () => {
    if (progress < 25) return 'bg-red-500'
    if (progress < 75) return 'bg-amber-500'
    return 'bg-green-500'
  }

  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
      <div
        className={cn('h-full transition-all duration-300', getColorClass())}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
