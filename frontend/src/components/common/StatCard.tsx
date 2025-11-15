import { Card, Statistic, Progress } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface StatCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode
  suffix?: string
  icon?: React.ReactNode
  trend?: number
  loading?: boolean
  color?: string
  showProgress?: boolean
  progressPercent?: number
}

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  loading,
  color = '#1677ff',
  showProgress,
  progressPercent,
}: StatCardProps) {
  return (
    <Card
      loading={loading}
      className="card-hover p-4 md:p-6"
      style={{ height: '100%' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <Statistic
            title={<span className="text-sm md:text-base font-medium">{title}</span>}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ color, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
          />
        </div>
        {icon && (
          <div
            className="text-2xl md:text-3xl p-2 md:p-3 rounded-lg self-start"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-4">
          <span className={`text-sm md:text-base ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {' '}{Math.abs(trend)}%
          </span>
          <span className="text-gray-500 ml-2 text-xs md:text-sm">vs last month</span>
        </div>
      )}
      {showProgress && progressPercent !== undefined && (
        <div className="mt-4">
          <Progress percent={progressPercent} strokeColor={color} size="small" />
        </div>
      )}
    </Card>
  )
}
