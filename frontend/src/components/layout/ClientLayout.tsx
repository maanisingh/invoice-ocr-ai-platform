import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  CameraOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ApiOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import DemoModeToggle from '@/components/DemoModeToggle'
import ThemeToggle from '@/components/ThemeToggle'

const { Header, Sider, Content } = Layout

export default function ClientLayout() {
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
      label: 'My Profile',
      onClick: () => navigate('/client/profile'),
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

  // Grouped menu items with section headers
  const menuItems = [
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">MAIN</span>,
      children: [
        {
          key: '/client/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/client/dashboard">Dashboard</Link>,
        },
        {
          key: '/client/invoices',
          icon: <FileTextOutlined />,
          label: <Link to="/client/invoices">My Invoices</Link>,
        },
        {
          key: '/client/upload',
          icon: <UploadOutlined />,
          label: <Link to="/client/upload">Upload Documents</Link>,
        },
        {
          key: '/client/upload/camera',
          icon: <CameraOutlined />,
          label: <Link to="/client/upload/camera">Camera Capture</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">ANALYTICS</span>,
      children: [
        {
          key: '/client/advanced-reports',
          icon: <BarChartOutlined />,
          label: <Link to="/client/advanced-reports">Advanced Reports</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">FINANCIAL</span>,
      children: [
        {
          key: '/client/budget',
          icon: <DollarOutlined />,
          label: <Link to="/client/budget">Budget Management</Link>,
        },
        {
          key: '/client/subscriptions',
          icon: <ThunderboltOutlined />,
          label: <Link to="/client/subscriptions">Subscriptions</Link>,
        },
        {
          key: '/client/purchases',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/client/purchases">Purchases</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">DEVELOPER</span>,
      children: [
        {
          key: '/client/integrations',
          icon: <AppstoreAddOutlined />,
          label: <Link to="/client/integrations">Integrations</Link>,
        },
        {
          key: '/client/api-keys',
          icon: <ApiOutlined />,
          label: <Link to="/client/api-keys">API Keys</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: !collapsed && <span className="sidebar-section-header">ACCOUNT</span>,
      children: [
        {
          key: '/client/profile',
          icon: <UserOutlined />,
          label: <Link to="/client/profile">Profile</Link>,
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
            display: isDesktop ? 'block' : 'none',
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
                <div className="logo-subtitle">Client Portal</div>
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
        {/* Desktop Header - Only shown on desktop */}
        <Header
          className="enterprise-header"
          style={{
            display: isDesktop ? 'flex' : 'none',
            padding: 0,
            background: isDarkMode ? '#141414' : '#fff',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 12,
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
            padding: isDesktop ? '28px 0 115px 227px' : '0 0 100px 0',
            minHeight: isDesktop ? 'calc(100vh - 64px)' : '100vh',
            background: '#f8fafc',
            overflowX: 'hidden',
          }}
          className=""
        >
          <Outlet />
        </Content>

        {/* Mobile Bottom Navigation - Modern iOS/Android Style */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 z-50"
          style={{ display: isDesktop ? 'none' : 'block' }}>
          {/* Safe area for notch/home indicator */}
          <div className="h-1 bg-gradient-to-b from-transparent to-black/20"></div>

          <div className="flex items-center justify-between px-3 py-2 relative">
            {/* Left: User Avatar - Clickable to Profile */}
            <div
              onClick={() => navigate('/client/profile')}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <Avatar
                src={user?.avatar}
                icon={<UserOutlined />}
                size={32}
                style={{
                  backgroundColor: '#667eea',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                }}
              />
              <span className="text-[8px] font-semibold text-gray-400 mt-1 tracking-wide">{user?.firstName}</span>
            </div>

            <Link
              to="/client/invoices"
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 ${
                location.pathname === '/client/invoices'
                  ? 'text-purple-400 bg-purple-500/20 scale-105'
                  : 'text-gray-400 hover:text-gray-200 active:scale-95'
              }`}
            >
              <FileTextOutlined style={{ fontSize: 22, marginBottom: 4 }} />
              <span className="text-[9px] font-semibold tracking-wide">Invoices</span>
            </Link>

            {/* Center FAB Button */}
            <Link
              to="/client/upload/camera"
              className="flex flex-col items-center justify-center -mt-8 active:scale-95 transition-transform duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 border-4 border-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0"></div>
                <CameraOutlined style={{ fontSize: 28, color: 'white', position: 'relative', zIndex: 1 }} />
              </div>
              <span className="text-[8px] font-bold text-gray-300 mt-1 tracking-wide">SCAN</span>
            </Link>

            <Link
              to="/client/budget"
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 ${
                location.pathname === '/client/budget'
                  ? 'text-green-400 bg-green-500/20 scale-105'
                  : 'text-gray-400 hover:text-gray-200 active:scale-95'
              }`}
            >
              <BarChartOutlined style={{ fontSize: 22, marginBottom: 4 }} />
              <span className="text-[9px] font-semibold tracking-wide">Budget</span>
            </Link>

            {/* Right: Logout Button */}
            <div
              onClick={handleLogout}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <LogoutOutlined style={{ fontSize: 20, color: '#ef4444' }} />
              </div>
              <span className="text-[8px] font-semibold text-red-400 mt-1 tracking-wide">Logout</span>
            </div>
          </div>

          {/* Bottom safe area for iOS home indicator */}
          <div className="h-5 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      </Layout>
    </Layout>
  )
}
