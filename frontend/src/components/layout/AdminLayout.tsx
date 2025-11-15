import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge, Drawer } from 'antd'
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
  CameraOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
      label: (!collapsed || isMobile) && <span className="sidebar-section-header">MAIN</span>,
      children: [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/admin/dashboard" onClick={() => isMobile && setDrawerVisible(false)}>Dashboard</Link>
              {!isMobile && <Badge count={5} className="menu-badge" />}
            </div>
          ),
        },
        {
          key: '/admin/invoices',
          icon: <FileTextOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/admin/invoices" onClick={() => isMobile && setDrawerVisible(false)}>Invoices</Link>
              {!isMobile && <Badge count={23} className="menu-badge" />}
            </div>
          ),
        },
        {
          key: '/admin/invoices/camera',
          icon: <CameraOutlined />,
          label: <Link to="/admin/invoices/camera" onClick={() => isMobile && setDrawerVisible(false)}>Camera Upload</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: (!collapsed || isMobile) && <span className="sidebar-section-header">MANAGEMENT</span>,
      children: [
        {
          key: '/admin/clients',
          icon: <TeamOutlined />,
          label: (
            <div className="menu-item-content">
              <Link to="/admin/clients" onClick={() => isMobile && setDrawerVisible(false)}>Clients</Link>
              {!isMobile && <Badge count={42} className="menu-badge" />}
            </div>
          ),
        },
        {
          key: '/admin/categories',
          icon: <FolderOutlined />,
          label: <Link to="/admin/categories" onClick={() => isMobile && setDrawerVisible(false)}>Categories</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: (!collapsed || isMobile) && <span className="sidebar-section-header">ANALYTICS</span>,
      children: [
        {
          key: '/admin/reports',
          icon: <BarChartOutlined />,
          label: <Link to="/admin/reports" onClick={() => isMobile && setDrawerVisible(false)}>Reports</Link>,
        },
      ],
    },
    {
      type: 'group' as const,
      label: (!collapsed || isMobile) && <span className="sidebar-section-header">SYSTEM</span>,
      children: [
        {
          key: '/admin/integrations',
          icon: <ApiOutlined />,
          label: <Link to="/admin/integrations" onClick={() => isMobile && setDrawerVisible(false)}>Integrations</Link>,
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings" onClick={() => isMobile && setDrawerVisible(false)}>Settings</Link>,
        },
      ],
    },
  ]

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="sidebar-logo" style={{ flexShrink: 0 }}>
        <div className="logo-icon-wrapper">
          <FileTextOutlined className="logo-icon" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="logo-text">
            <div className="logo-title">Invoice OCR</div>
            <div className="logo-subtitle">Admin Portal</div>
          </div>
        )}
      </div>

      {/* Scrollable Menu Container */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="enterprise-menu"
        />
      </div>

      {/* Bottom User Card */}
      {(!collapsed || isMobile) && (
        <div className="sidebar-user-card" style={{ flexShrink: 0 }}>
          <div className="user-card-content">
            <Avatar size={40} src={user?.avatar} icon={<UserOutlined />} className="user-avatar" />
            <div className="user-info">
              <div className="user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <div className="user-card-stats">
            <div className="stat-item">
              <span className="stat-label">System Status</span>
              <span className="stat-value">✓ Operational</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Users</span>
              <span className="stat-value">42 online</span>
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
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
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          closable={false}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          width={240}
          bodyStyle={{ padding: 0, background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}
          style={{ background: 'transparent' }}
        >
          <div
            style={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={() => setDrawerVisible(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1000,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                width: 32,
                height: 32,
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="hover:bg-white/20 transition-colors"
            />
            {sidebarContent}
          </div>
        </Drawer>
      )}

      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 240) }}>
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
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space size="large">
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={toggleTheme}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            />
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
            padding: isMobile ? '16px' : '24px',
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
