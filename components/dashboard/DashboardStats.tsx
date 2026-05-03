import { HiCubeTransparent } from 'react-icons/hi'
import { MdAssignment, MdAccessTime, MdWarning, MdCheckCircle } from 'react-icons/md'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardStatsProps {
  stats: {
    totalProjects: number
    assignedTasks: number
    dueToday: number
    overdue: number
    completedThisWeek: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: HiCubeTransparent,
      gradient: 'from-[#667eea] to-[#764ba2]',
      iconBg: 'bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20',
      iconColor: 'text-[#667eea]',
      valueColor: 'text-[#667eea]',
      glowColor: 'shadow-[#667eea]/20',
    },
    {
      label: 'Assigned Tasks',
      value: stats.assignedTasks,
      icon: MdAssignment,
      gradient: 'from-[#00BFA5] to-[#00E5CC]',
      iconBg: 'bg-gradient-to-br from-[#00BFA5]/20 to-[#00E5CC]/20',
      iconColor: 'text-[#00BFA5]',
      valueColor: 'text-[#00BFA5]',
      glowColor: 'shadow-[#00BFA5]/20',
    },
    {
      label: 'Due Today',
      value: stats.dueToday,
      icon: MdAccessTime,
      gradient: 'from-[#f093fb] to-[#f5576c]',
      iconBg: 'bg-gradient-to-br from-[#f093fb]/20 to-[#f5576c]/20',
      iconColor: 'text-[#f093fb]',
      valueColor: 'text-[#f093fb]',
      glowColor: 'shadow-[#f093fb]/20',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: MdWarning,
      gradient: 'from-[#fa709a] to-[#fee140]',
      iconBg: 'bg-gradient-to-br from-[#fa709a]/20 to-[#fee140]/20',
      iconColor: 'text-[#fa709a]',
      valueColor: 'text-[#fa709a]',
      glowColor: 'shadow-[#fa709a]/20',
    },
    {
      label: 'Completed This Week',
      value: stats.completedThisWeek,
      icon: MdCheckCircle,
      gradient: 'from-[#a8edea] to-[#fed6e3]',
      iconBg: 'bg-gradient-to-br from-[#a8edea]/20 to-[#fed6e3]/20',
      iconColor: 'text-[#34D399]',
      valueColor: 'text-[#34D399]',
      glowColor: 'shadow-[#34D399]/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.label}
            className="bg-[#111118] border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                    {stat.label}
                  </p>
                  <p className={`text-4xl font-bold ${stat.valueColor} transition-all duration-300 group-hover:scale-110`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${stat.glowColor}`}>
                  <Icon className={`h-7 w-7 ${stat.iconColor}`} />
                </div>
              </div>
              {/* Gradient line at bottom */}
              <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient} rounded-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
