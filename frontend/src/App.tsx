import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { ConfigProvider, theme } from 'antd'

// Layouts
import AdminLayout from '@/components/layout/AdminLayout'
import ClientLayout from '@/components/layout/ClientLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Admin Pages
import EnhancedDashboard from '@/pages/admin/EnhancedDashboard'
import AdvancedInvoicesPage from '@/pages/admin/AdvancedInvoicesPage'
import MobileCapturePage from '@/pages/admin/MobileCapturePage'
import DuplicateDetectionPage from '@/pages/admin/DuplicateDetectionPage'
import ClientsPage from '@/pages/admin/ClientsPage'
import ClientDetailPage from '@/pages/admin/ClientDetailPage'
import CategoriesPage from '@/pages/admin/CategoriesPage'
import IntegrationsPage from '@/pages/admin/IntegrationsPage'
import SettingsPage from '@/pages/admin/SettingsPage'
import ReportsPage from '@/pages/admin/ReportsPage'
import FraudDetectionPage from '@/pages/admin/FraudDetectionPage'
import BudgetTrackingPage from '@/pages/admin/BudgetTrackingPage'
import VendorPerformancePage from '@/pages/admin/VendorPerformancePage'
import AuditTrailPage from '@/pages/admin/AuditTrailPage'
import EmailImportPage from '@/pages/admin/EmailImportPage'
import AdminAdvancedReportsPage from '@/pages/admin/AdvancedReportsPage'
import AIIntegrationPage from '@/pages/admin/AIIntegrationPage'

// Client Pages
import EnhancedClientDashboard from '@/pages/client/EnhancedDashboard'
import ClientInvoicesPage from '@/pages/client/InvoicesPage'
import ClientCameraPage from '@/pages/client/CameraPage'
import ClientProfilePage from '@/pages/client/ProfilePage'
import ClientReportsPage from '@/pages/client/ReportsPage'
import APIKeysPage from '@/pages/client/APIKeysPage'
import ClientBudgetPage from '@/pages/client/BudgetPage'
import ClientSubscriptionsPage from '@/pages/client/SubscriptionsPage'
import ClientPurchasesPage from '@/pages/client/PurchasesPage'
import ClientAdvancedReportsPage from '@/pages/client/AdvancedReportsPage'

function App() {
  const { isDarkMode } = useThemeStore()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 14,
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<EnhancedDashboard />} />
              <Route path="invoices" element={<AdvancedInvoicesPage />} />
              <Route path="mobile-capture" element={<MobileCapturePage />} />
              <Route path="email-import" element={<EmailImportPage />} />
              <Route path="duplicates" element={<DuplicateDetectionPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/:clientId" element={<ClientDetailPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="advanced-reports" element={<AdminAdvancedReportsPage />} />
              <Route path="budget-tracking" element={<BudgetTrackingPage />} />
              <Route path="vendor-performance" element={<VendorPerformancePage />} />
              <Route path="fraud-detection" element={<FraudDetectionPage />} />
              <Route path="audit-trail" element={<AuditTrailPage />} />
              <Route path="ai-integration" element={<AIIntegrationPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute allowedRole="client" />}>
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="dashboard" element={<EnhancedClientDashboard />} />
              <Route path="invoices" element={<ClientInvoicesPage />} />
              <Route path="upload/camera" element={<ClientCameraPage />} />
              <Route path="reports" element={<ClientReportsPage />} />
              <Route path="advanced-reports" element={<ClientAdvancedReportsPage />} />
              <Route path="budget" element={<ClientBudgetPage />} />
              <Route path="subscriptions" element={<ClientSubscriptionsPage />} />
              <Route path="purchases" element={<ClientPurchasesPage />} />
              <Route path="api-keys" element={<APIKeysPage />} />
              <Route path="profile" element={<ClientProfilePage />} />
            </Route>
          </Route>

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
