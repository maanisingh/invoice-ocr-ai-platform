import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge, Tooltip } from 'antd'
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
  DesktopOutlined,
  MobileOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import DemoModeToggle from '@/components/DemoModeToggle'
import ThemeToggle from '@/components/ThemeToggle'

const { Header, Sider, Content } = Layout

export default function ClientLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDarkMode } = useThemeStore()

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
    <div className={viewMode === 'mobile' ? 'mobile-simulator' : ''}>
      <Layout className="min-h-screen">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onBreakpoint={(broken) => setCollapsed(broken)}
          className="enterprise-sidebar hidden lg:block"
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
          marginLeft: 0,
          transition: 'margin-left 0.2s',
        }}
        className={collapsed ? 'lg:ml-[80px]' : 'lg:ml-[240px]'}
      >
        {/* Desktop Header - Only shown on desktop */}
        <Header
          className="enterprise-header sm:pr-6 hidden lg:flex"
          style={{
            padding: 0,
            background: isDarkMode ? '#141414' : '#fff',
            display: 'flex',
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
            <Tooltip title={`Switch to ${viewMode === 'desktop' ? 'Mobile' : 'Desktop'} View`}>
              <Button
                type="text"
                icon={viewMode === 'desktop' ? <MobileOutlined /> : <DesktopOutlined />}
                onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
                style={{ fontSize: '18px' }}
              />
            </Tooltip>
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
            padding: 0,
            minHeight: '100vh',
            background: '#f8fafc',
            overflowX: 'hidden',
            paddingBottom: '80px',
          }}
          className="lg:p-6 lg:pb-6 lg:min-h-[calc(100vh-64px)]"
        >
          <Outlet />
        </Content>

        {/* Mobile Bottom Navigation - Modern iOS/Android Style */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 z-50">
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

    {/* Mobile Simulator CSS */}
    <style>{`
      .mobile-simulator {
        max-width: 375px;
        margin: 0 auto;
        box-shadow: 0 0 0 8px #1f2937, 0 0 0 10px #374151, 0 20px 60px rgba(0,0,0,0.5);
        border-radius: 36px;
        overflow: hidden;
        position: relative;
        background: #1f2937;
      }

      .mobile-simulator::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 28px;
        background: #1f2937;
        border-radius: 0 0 20px 20px;
        z-index: 9999;
      }

      .mobile-simulator::after {
        content: '';
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 6px;
        background: #4b5563;
        border-radius: 3px;
        z-index: 10000;
      }

      .mobile-simulator .ant-layout {
        border-radius: 24px;
        overflow: hidden;
      }

      /* Force mobile breakpoint */
      .mobile-simulator .lg\\:hidden {
        display: block !important;
      }

      .mobile-simulator .hidden.lg\\:block {
        display: none !important;
      }

      .mobile-simulator .lg\\:flex {
        display: none !important;
      }

      .mobile-simulator .ml-0.lg\\:ml-\\[240px\\] {
        margin-left: 0 !important;
      }

      .mobile-simulator .lg\\:p-6 {
        padding: 0 !important;
      }

      .mobile-simulator .lg\\:pb-6 {
        padding-bottom: 0 !important;
      }

      .mobile-simulator .lg\\:min-h-\\[calc\\(100vh-64px\\)\\] {
        min-height: 100vh !important;
      }
    `}</style>
  </div>
  )
}
