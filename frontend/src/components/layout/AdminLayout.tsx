import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  FolderOutlined,
  ApiOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MobileOutlined,
  WarningOutlined,
  SafetyOutlined,
  StarOutlined,
  AuditOutlined,
  MailOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import DemoModeToggle from '@/components/DemoModeToggle'
import ThemeToggle from '@/components/ThemeToggle'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDarkMode } = useThemeStore()

  // Handle responsive sidebar margin
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  // Grouped menu items with sections - ENTERPRISE STYLE
  const menuItems = [
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">OVERVIEW</span>,
      children: [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/admin/dashboard">Dashboard</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">INVOICES</span>,
      children: [
        {
          key: '/admin/invoices',
          icon: <FileTextOutlined />,
          label: <Link to="/admin/invoices">All Invoices</Link>,
        },
        {
          key: '/admin/mobile-capture',
          icon: <MobileOutlined />,
          label: <Link to="/admin/mobile-capture">Upload Invoice</Link>,
        },
        {
          key: '/admin/email-import',
          icon: <MailOutlined />,
          label: <Link to="/admin/email-import">Email Import</Link>,
        },
        {
          key: '/admin/duplicates',
          icon: <WarningOutlined />,
          label: <Link to="/admin/duplicates">Duplicates</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">MANAGEMENT</span>,
      children: [
        {
          key: '/admin/clients',
          icon: <TeamOutlined />,
          label: <Link to="/admin/clients">Clients</Link>,
        },
        {
          key: '/admin/categories',
          icon: <FolderOutlined />,
          label: <Link to="/admin/categories">Categories</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">ANALYTICS</span>,
      children: [
        {
          key: '/admin/advanced-reports',
          icon: <BarChartOutlined />,
          label: <Link to="/admin/advanced-reports">Advanced Reports</Link>,
        },
        {
          key: '/admin/vendor-performance',
          icon: <StarOutlined />,
          label: <Link to="/admin/vendor-performance">Vendor Performance</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">SECURITY & COMPLIANCE</span>,
      children: [
        {
          key: '/admin/fraud-detection',
          icon: <SafetyOutlined />,
          label: <Link to="/admin/fraud-detection">Fraud Detection</Link>,
        },
        {
          key: '/admin/audit-trail',
          icon: <AuditOutlined />,
          label: <Link to="/admin/audit-trail">Audit Trail</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">SETTINGS</span>,
      children: [
        {
          key: '/admin/ai-integration',
          icon: <RobotOutlined />,
          label: <Link to="/admin/ai-integration">AI Integration</Link>,
        },
        {
          key: '/admin/integrations',
          icon: <ApiOutlined />,
          label: <Link to="/admin/integrations">Integrations</Link>,
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">Configuration</Link>,
        },
      ],
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        className="enterprise-sidebar"
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Logo Section */}
          <div className="sidebar-logo" style={{ flexShrink: 0, height: '80px' }}>
            <div className="logo-icon-wrapper">
              <FileTextOutlined className="logo-icon" />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <div className="logo-title">Invoice OCR</div>
                <div className="logo-subtitle">Admin Portal</div>
              </div>
            )}
          </div>

          {/* Scrollable Menu Container */}
          <div style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
          }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              className="enterprise-menu"
              style={{
                borderRight: 0,
                height: '100%',
              }}
            />
          </div>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: isDesktop ? (collapsed ? 80 : 240) : 0,
        }}
        className="transition-all duration-200"
      >
        <Header
          className="enterprise-header"
          style={{
            padding: 0,
            background: isDarkMode ? '#141414' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 24,
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space size="large">
            <div className="demo-mode-toggle">
              <DemoModeToggle />
            </div>
            <div className="theme-toggle">
              <ThemeToggle />
            </div>
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar src={user?.avatar} icon={<UserOutlined />} />
                <span className="hidden md:inline">
                  {user?.firstName} {user?.lastName}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 0,
            padding: '24px',
            minHeight: 'calc(100vh - 64px)',
            background: '#f8fafc',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
