import { useMemo, useEffect, useRef } from 'react'
import { Button } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined,
  TrophyOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useInvoiceStore } from '@/store/invoiceStore'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import autoAnimate from '@formkit/auto-animate'
import { cn, gradients, modernCard, glassmorphism, hoverLift, hoverGlow } from '@/lib/utils'

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

const categoryData = [
  { name: 'Office Supplies', value: 12000 },
  { name: 'Software', value: 18000 },
  { name: 'Marketing', value: 8500 },
  { name: 'Travel', value: 15000 },
]

const monthlyData = [
  { month: 'Jan', amount: 8500 },
  { month: 'Feb', amount: 13500 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 15000 },
  { month: 'May', amount: 13200 },
  { month: 'Jun', amount: 17500 },
]

export default function ModernClientDashboard() {
  const navigate = useNavigate()
  const { getInvoices } = useInvoiceStore()
  const allInvoices = getInvoices()
  const parent = useRef(null)

  const [headerRef, headerInView] = useInView({ triggerOnce: true })
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [chartsRef, chartsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  // Calculate stats with useMemo
  const stats = useMemo(() => {
    const total = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const pending = allInvoices.filter(inv => inv.status === 'pending').length
    const approved = allInvoices.filter(inv => inv.status === 'approved').length
    const thisMonth = allInvoices.filter(inv =>
      dayjs(inv.invoiceDate).isAfter(dayjs().subtract(30, 'days'))
    )
    const lastMonth = allInvoices.filter(inv => {
      const date = dayjs(inv.invoiceDate)
      return date.isAfter(dayjs().subtract(60, 'days')) && date.isBefore(dayjs().subtract(30, 'days'))
    })
    const growth = lastMonth.length ? ((thisMonth.length - lastMonth.length) / lastMonth.length * 100) : 0

    return { total, pending, approved, count: allInvoices.length, growth }
  }, [allInvoices])

  const recentInvoices = useMemo(() => allInvoices.slice(0, 5), [allInvoices])

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      approved: '#52c41a',
      pending: '#faad14',
      processing: '#1677ff',
      rejected: '#ff4d4f',
    }
    return colors[status] || '#d9d9d9'
  }

  return (
    <div className="h-full pb-20 lg:pb-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen">
        {/* Modern Hero Stats - Mobile */}
        <div ref={headerRef} className={cn("relative overflow-hidden px-4 pt-8 pb-16", gradients.ocean)}>
          {/* Animated background particles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white mb-6 relative z-10"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrophyOutlined className="text-2xl" />
              <span className="text-sm font-semibold opacity-90">Total Value</span>
            </div>
            <div className="text-5xl font-black mb-2 tracking-tight">
              ${(stats.total / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpOutlined />
              <span>+{stats.growth.toFixed(0)}% from last month</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn("rounded-3xl p-5", glassmorphism, "backdrop-blur-2xl bg-white/20")}
            >
              <div className="flex items-center gap-2 text-white/90 text-xs mb-2">
                <FileTextOutlined />
                <span>Invoices</span>
              </div>
              <div className="text-white text-3xl font-black mb-1">{stats.count}</div>
              <div className="text-white/70 text-xs flex items-center gap-1">
                <ArrowUpOutlined className="text-xs" />
                {stats.growth.toFixed(0)}% growth
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={cn("rounded-3xl p-5", glassmorphism, "backdrop-blur-2xl bg-white/20")}
            >
              <div className="flex items-center gap-2 text-white/90 text-xs mb-2">
                <ClockCircleOutlined />
                <span>Pending</span>
              </div>
              <div className="text-white text-3xl font-black mb-1">{stats.pending}</div>
              <div className="text-white/70 text-xs">Need review</div>
            </motion.div>
          </div>
        </div>

        {/* Floating Action Button - Mobile */}
        <div className="-mt-8 mb-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={hoverLift}
          >
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate('/client/upload/camera')}
              block
              className={cn(
                "rounded-2xl h-16 text-base font-bold shadow-2xl border-0",
                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                hoverGlow
              )}
            >
              Upload New Invoice
            </Button>
          </motion.div>
        </div>

        {/* Mini Insights - Mobile */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(modernCard, "bg-white p-5", hoverLift)}
            >
              <div className="text-xs text-gray-500 mb-2 font-semibold">This Month</div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                ${(monthlyData[monthlyData.length - 1]?.amount / 1000).toFixed(1)}k
              </div>
              <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                <ArrowUpOutlined /> 12%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(modernCard, "bg-white p-5", hoverLift)}
            >
              <div className="text-xs text-gray-500 mb-2 font-semibold">Avg Amount</div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                ${stats.count > 0 ? ((stats.total / stats.count) / 1000).toFixed(1) : '0'}k
              </div>
              <div className="text-xs text-gray-400 font-medium">Per invoice</div>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-gray-900">Recent Activity</h3>
            <Button
              type="text"
              size="small"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/client/invoices')}
              className="text-blue-600 text-xs font-bold hover:text-blue-700"
            >
              View All
            </Button>
          </div>

          <div ref={parent} className="space-y-3">
            {recentInvoices.slice(0, 4).map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <div
                  className={cn(
                    "bg-white rounded-2xl p-4 shadow-lg active:scale-98 transition-all cursor-pointer",
                    hoverGlow
                  )}
                  onClick={() => navigate(`/client/invoices/${invoice.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base text-gray-900 truncate">
                          {invoice.vendorName}
                        </span>
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 shadow-lg"
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {dayjs(invoice.invoiceDate).format('MMM D, YYYY')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-gray-900">
                        ${invoice.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 capitalize font-semibold">
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-8 p-8">
        {/* Desktop Header with Action */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center justify-end mb-6"
        >
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => navigate('/client/upload/camera')}
            className={cn(
              "h-14 px-8 text-base font-bold rounded-2xl shadow-2xl border-0",
              "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
              hoverLift, hoverGlow
            )}
          >
            Upload Invoice
          </Button>
        </motion.div>

        {/* Desktop Stats Cards */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-2 font-semibold">Total Invoices</div>
                <div className="text-5xl font-black text-gray-900 mb-3">{stats.count}</div>
                <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                  <ArrowUpOutlined />
                  <span>{stats.growth.toFixed(1)}% vs last month</span>
                </div>
              </div>
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl"
              )}>
                <FileTextOutlined className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-2 font-semibold">Pending Review</div>
                <div className="text-5xl font-black text-gray-900 mb-3">{stats.pending}</div>
                <div className="text-sm text-gray-400 font-medium">Awaiting approval</div>
              </div>
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl"
              )}>
                <ClockCircleOutlined className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className={cn(modernCard, "bg-white p-6", hoverLift, hoverGlow)}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-2 font-semibold">Total Amount</div>
                <div className="text-5xl font-black text-gray-900 mb-3">
                  ${(stats.total / 1000).toFixed(1)}k
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                  <ArrowUpOutlined />
                  <span>12.3% vs last month</span>
                </div>
              </div>
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl"
              )}>
                <DollarOutlined className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desktop Charts */}
        <motion.div
          ref={chartsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={chartsInView ? { opacity: 1, y: 0 } : {}}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          <div className={cn(modernCard, "bg-white p-6 xl:col-span-2", hoverLift)}>
            <div className="text-2xl font-black mb-6 text-gray-900">Monthly Spending</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '14px', fontWeight: 600 }} />
                <YAxis stroke="#64748b" style={{ fontSize: '14px', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    fontWeight: 600
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ fill: '#3b82f6', r: 6, strokeWidth: 3, stroke: '#fff' }}
                  fill="url(#colorAmount)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={cn(modernCard, "bg-white p-6", hoverLift)}>
            <div className="text-2xl font-black mb-6 text-gray-900">By Category</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `$${(entry.value / 1000).toFixed(1)}k`}
                  outerRadius={70}
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-lg shadow-md"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-700 font-semibold">{item.name}</span>
                  </div>
                  <span className="font-black text-gray-900">
                    ${(item.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Desktop Recent Invoices */}
        <div className={cn(modernCard, "bg-white p-6", hoverLift)}>
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-black text-gray-900">Recent Invoices</div>
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/client/invoices')}
              className="text-blue-600 font-bold hover:text-blue-700"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className={cn(
                  "flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer transition-all",
                  hoverLift, "hover:bg-gray-100"
                )}
                onClick={() => navigate(`/client/invoices/${invoice.id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="font-black text-gray-900 text-lg">{invoice.vendorName}</div>
                    <div className="text-sm text-gray-500 font-semibold mt-1">
                      {invoice.invoiceNumber} • {dayjs(invoice.invoiceDate).format('MMM DD, YYYY')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">
                      ${invoice.totalAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-md"
                        style={{ backgroundColor: getStatusColor(invoice.status) }}
                      />
                      <span className="text-xs capitalize text-gray-600 font-bold">{invoice.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
