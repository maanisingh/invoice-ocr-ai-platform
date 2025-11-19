import { useMemo, useState } from 'react';
import { Card, Table, Tag, Input, Select, DatePicker, Button, Tooltip, Timeline, Badge, Alert } from 'antd';
import {
  SafetyOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDemoMode } from '@/contexts/DemoModeContext';

dayjs.extend(relativeTime);

const { RangePicker } = DatePicker;

export default function AuditTrail() {
  const { isDemoMode, demoAuditTrail } = useDemoMode();
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  const auditData = useMemo(() => {
    if (!isDemoMode) return { trail: [], filteredTrail: [], stats: { totalActions: 0, uniqueUsers: 0, recentActions: 0, criticalActions: 0 } };

    let filtered = demoAuditTrail;

    // Apply filters
    if (searchText) {
      filtered = filtered.filter(
        (entry) =>
          entry.entityName.toLowerCase().includes(searchText.toLowerCase()) ||
          entry.userName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.action === actionFilter);
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter((entry) => entry.userRole === userFilter);
    }

    // Calculate stats
    const stats = {
      totalActions: demoAuditTrail.length,
      uniqueUsers: new Set(demoAuditTrail.map((e) => e.userId)).size,
      recentActions: demoAuditTrail.filter(
        (e) => new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      criticalActions: demoAuditTrail.filter((e) => e.action === 'deleted' || e.action === 'approved').length,
    };

    return {
      trail: demoAuditTrail,
      filteredTrail: filtered,
      stats,
    };
  }, [isDemoMode, demoAuditTrail, searchText, actionFilter, userFilter]);

  const getActionIcon = (action: string) => {
    const icons: { [key: string]: any } = {
      created: <FileAddOutlined />,
      updated: <EditOutlined />,
      approved: <CheckCircleOutlined />,
      rejected: <CloseCircleOutlined />,
      deleted: <DeleteOutlined />,
      exported: <DownloadOutlined />,
      viewed: <EyeOutlined />,
      downloaded: <DownloadOutlined />,
    };
    return icons[action] || <ClockCircleOutlined />;
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      created: 'blue',
      updated: 'orange',
      approved: 'green',
      rejected: 'red',
      deleted: 'red',
      exported: 'purple',
      viewed: 'default',
      downloaded: 'cyan',
    };
    return colors[action] || 'default';
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'red',
      manager: 'orange',
      user: 'blue',
      client: 'green',
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      sorter: (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      render: (timestamp: string) => (
        <Tooltip title={dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{dayjs(timestamp).fromNow()}</span>
        </Tooltip>
      ),
    },
    {
      title: 'User',
      key: 'user',
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div className="font-semibold">{record.userName}</div>
          <Tag color={getRoleColor(record.userRole)} className="text-xs mt-1">
            {record.userRole.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 130,
      render: (action: string) => (
        <Tag color={getActionColor(action)} icon={getActionIcon(action)}>
          {action.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Entity',
      key: 'entity',
      render: (_: any, record: any) => (
        <div>
          <div className="font-mono text-sm text-purple-600">{record.entityName}</div>
          <span className="text-xs text-gray-500">{record.entityType}</span>
        </div>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (ip: string) => <span className="font-mono text-xs">{ip}</span>,
    },
    {
      title: 'Location',
      key: 'location',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm">{record.metadata?.location || 'Unknown'}</div>
          <span className="text-xs text-gray-500">{record.metadata?.browser || 'Unknown'}</span>
        </div>
      ),
    },
    {
      title: 'Changes',
      key: 'changes',
      width: 100,
      render: (_: any, record: any) => (
        record.changes ? (
          <Tooltip
            title={
              <div>
                <div><strong>Before:</strong> {JSON.stringify(record.changes.before)}</div>
                <div><strong>After:</strong> {JSON.stringify(record.changes.after)}</div>
              </div>
            }
          >
            <Button size="small" type="link" icon={<EyeOutlined />}>
              View
            </Button>
          </Tooltip>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Audit Trail & Compliance
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Complete activity log and compliance tracking
            </p>
          </div>
          <Button type="primary" size="large" icon={<DownloadOutlined />}>
            Export Audit Log
          </Button>
        </div>
      </motion.div>

      {/* Demo Mode Alert */}
      {!isDemoMode && (
        <Alert
          message="Demo Mode Required"
          description="Audit trail data is only available in demo mode. Please turn demo mode on from the toggle in the header to view audit logs and compliance tracking."
          type="info"
          showIcon
          className="mb-6"
        />
      )}

      {isDemoMode && (
        <>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {auditData.stats?.totalActions || 0}
                </p>
              </div>
              <SafetyOutlined className="text-3xl text-purple-500" />
            </div>
          </Card>
          <Card className="shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {auditData.stats?.uniqueUsers || 0}
                </p>
              </div>
              <UserOutlined className="text-3xl text-blue-500" />
            </div>
          </Card>
          <Card className="shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Last 24 Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {auditData.stats?.recentActions || 0}
                </p>
              </div>
              <ClockCircleOutlined className="text-3xl text-green-500" />
            </div>
          </Card>
          <Card className="shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Critical Actions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {auditData.stats?.criticalActions || 0}
                </p>
              </div>
              <Badge count={auditData.stats?.criticalActions || 0} offset={[-5, 5]}>
                <CheckCircleOutlined className="text-3xl text-orange-500" />
              </Badge>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6 shadow-lg rounded-xl">
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Search by user or entity..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
              allowClear
            />
            <Select
              placeholder="Action Type"
              value={actionFilter}
              onChange={setActionFilter}
              className="w-40"
              options={[
                { label: 'All Actions', value: 'all' },
                { label: 'Created', value: 'created' },
                { label: 'Updated', value: 'updated' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Deleted', value: 'deleted' },
                { label: 'Exported', value: 'exported' },
                { label: 'Viewed', value: 'viewed' },
              ]}
            />
            <Select
              placeholder="User Role"
              value={userFilter}
              onChange={setUserFilter}
              className="w-40"
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Admin', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'User', value: 'user' },
                { label: 'Client', value: 'client' },
              ]}
            />
            <RangePicker />
            <Button>Reset Filters</Button>
          </div>
        </Card>
      </motion.div>

      {/* Audit Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card
          title={
            <span>
              <SafetyOutlined className="mr-2 text-green-500" />
              Audit Log ({auditData.filteredTrail.length} entries)
            </span>
          }
          className="shadow-lg rounded-xl"
        >
          <Table
            columns={columns}
            dataSource={auditData.filteredTrail}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} entries`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </motion.div>

      {/* Recent Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card title="Recent Activity (Last 10)" className="shadow-lg rounded-xl">
          <Timeline
            items={auditData.trail.slice(0, 10).map((entry) => ({
              dot: getActionIcon(entry.action),
              color: getActionColor(entry.action),
              children: (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{entry.userName}</span>
                    <Tag color={getActionColor(entry.action)}>{entry.action}</Tag>
                    <span className="font-mono text-sm text-purple-600">{entry.entityName}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dayjs(entry.timestamp).format('MMM DD, YYYY HH:mm:ss')} • {entry.ipAddress} • {entry.metadata?.location}
                  </div>
                </div>
              ),
            }))}
          />
        </Card>
      </motion.div>
        </>
      )}
    </div>
  );
}
