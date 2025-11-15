import { Tag } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'processing'
}

const statusConfig = {
  pending: {
    color: 'warning',
    icon: <ClockCircleOutlined />,
    text: 'Pending',
  },
  approved: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    text: 'Approved',
  },
  rejected: {
    color: 'error',
    icon: <CloseCircleOutlined />,
    text: 'Rejected',
  },
  processing: {
    color: 'processing',
    icon: <SyncOutlined spin />,
    text: 'Processing',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Tag color={config.color} icon={config.icon}>
      <span className="text-xs md:text-sm font-medium">
        {config.text}
      </span>
    </Tag>
  )
}
