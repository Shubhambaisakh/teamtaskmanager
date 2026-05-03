import { cn } from '@/lib/utils'

interface ProjectProgressBarProps {
  progress: number
}

export function ProjectProgressBar({ progress }: ProjectProgressBarProps) {
  const getColorClass = () => {
    if (progress === 0) return 'bg-white/10'
    if (progress < 25) return 'bg-gradient-to-r from-[#F87171] to-[#FBB13C]'
    if (progress < 50) return 'bg-gradient-to-r from-[#FBB13C] to-[#00BFA5]'
    if (progress < 75) return 'bg-gradient-to-r from-[#00BFA5] to-[#34D399]'
    if (progress < 100) return 'bg-gradient-to-r from-[#34D399] to-[#00E5CC]'
    return 'bg-gradient-to-r from-[#34D399] to-[#00E5CC]'
  }

  return (
    <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden relative">
      <div
        className={cn('h-full transition-all duration-500 ease-out rounded-full', getColorClass())}
        style={{ width: `${progress}%` }}
      />
      {/* Shimmer effect */}
      {progress > 0 && progress < 100 && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}
    </div>
  )
}
