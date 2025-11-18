export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'client' | 'user'
  organizationId: string
  avatar?: string
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  logo?: string
  settings: OrganizationSettings
  createdAt: string
}

export interface OrganizationSettings {
  ocrConfidenceThreshold: number
  defaultLanguage: string
  emailNotifications: boolean
  whatsappNotifications: boolean
  autoApproveHighConfidence: boolean
}

export interface Invoice {
  id: string
  invoiceNumber: string
  vendorName: string
  vendorEmail?: string
  vendorPhone?: string
  vendorAddress?: string
  invoiceDate: string
  dueDate?: string
  totalAmount: number
  currency: string
  taxAmount?: number
  subtotal?: number
  status: 'pending' | 'approved' | 'rejected' | 'processing'
  ocrConfidence: number
  clientId?: string
  clientName?: string
  categoryId?: string
  categoryName?: string
  items: InvoiceItem[]
  fileUrl: string
  fileName: string
  fileType: string
  notes?: string
  extractedData?: Record<string, any>
  createdAt: string
  updatedAt: string
  approvedBy?: string
  approvedAt?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  companyName?: string
  address?: string
  organizationId: string
  emailMonitoringEnabled: boolean
  whatsappMonitoringEnabled: boolean
  invoiceCount: number
  totalSpent: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  keywords: string[]
  accountCode?: string
  parentId?: string
  color?: string
  icon?: string
  organizationId: string
  createdAt: string
}

export interface EmailIntegration {
  id: string
  provider: 'gmail' | 'outlook' | 'imap'
  email: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  settings: {
    imapHost?: string
    imapPort?: number
    smtpHost?: string
    smtpPort?: number
    useSSL?: boolean
  }
  organizationId: string
  createdAt: string
}

export interface WhatsAppIntegration {
  id: string
  phoneNumber?: string
  status: 'connected' | 'disconnected' | 'qr_pending'
  qrCode?: string
  lastSync?: string
  organizationId: string
  createdAt: string
}

export interface AccountingIntegration {
  id: string
  provider: 'quickbooks' | 'xero' | 'custom'
  status: 'connected' | 'disconnected' | 'error'
  accessToken?: string
  refreshToken?: string
  lastSync?: string
  fieldMapping: Record<string, string>
  organizationId: string
  createdAt: string
}

export interface APIKey {
  id: string
  name: string
  key: string
  lastUsed?: string
  createdAt: string
  expiresAt?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  details?: Record<string, any>
  ipAddress?: string
  createdAt: string
}

export interface DashboardStats {
  totalInvoices: number
  pendingInvoices: number
  approvedInvoices: number
  rejectedInvoices: number
  totalAmount: number
  monthlyAmount: number
  clientCount: number
  averageProcessingTime: number
  averageOCRConfidence: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface FilterOptions {
  status?: string[]
  dateRange?: [string, string]
  clientId?: string
  categoryId?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}

// Multi-format invoice support
export interface InvoiceFormat {
  id: string
  name: string
  description: string
  mimeTypes: string[]
  maxSize: number
  icon: string
  ocrSupported: boolean
}

export const INVOICE_FORMATS: InvoiceFormat[] = [
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Standard PDF invoice format',
    mimeTypes: ['application/pdf'],
    maxSize: 10485760, // 10MB
    icon: 'FilePdfOutlined',
    ocrSupported: true,
  },
  {
    id: 'image',
    name: 'Image (JPG/PNG)',
    description: 'Invoice as image file',
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    maxSize: 5242880, // 5MB
    icon: 'FileImageOutlined',
    ocrSupported: true,
  },
  {
    id: 'xml',
    name: 'XML (e-Invoice)',
    description: 'Electronic invoice XML format (UBL, Factur-X, ZUGFeRD)',
    mimeTypes: ['application/xml', 'text/xml'],
    maxSize: 2097152, // 2MB
    icon: 'FileTextOutlined',
    ocrSupported: false,
  },
  {
    id: 'excel',
    name: 'Excel Spreadsheet',
    description: 'Invoice in Excel format',
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    maxSize: 10485760, // 10MB
    icon: 'FileExcelOutlined',
    ocrSupported: false,
  },
  {
    id: 'word',
    name: 'Word Document',
    description: 'Invoice in Word format',
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 10485760, // 10MB
    icon: 'FileWordOutlined',
    ocrSupported: true,
  },
]

// Multi-currency support
export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
  decimalPlaces: number
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', decimalPlaces: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', decimalPlaces: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimalPlaces: 0 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', decimalPlaces: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', decimalPlaces: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', decimalPlaces: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', decimalPlaces: 2 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH', decimalPlaces: 2 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE', decimalPlaces: 2 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO', decimalPlaces: 2 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK', decimalPlaces: 2 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE', decimalPlaces: 2 },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', locale: 'ar-SA', decimalPlaces: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', decimalPlaces: 2 },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK', decimalPlaces: 2 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ', decimalPlaces: 2 },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', locale: 'es-MX', decimalPlaces: 2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', decimalPlaces: 2 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA', decimalPlaces: 2 },
]

// Platform integrations
export interface PlatformIntegration {
  id: string
  name: string
  logo: string
  type: 'accounting' | 'erp' | 'crm' | 'payment' | 'storage'
  status: 'connected' | 'disconnected' | 'pending'
  authType: 'oauth' | 'api_key' | 'webhook'
  supportedFeatures: string[]
}

export const PLATFORM_INTEGRATIONS: PlatformIntegration[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    logo: '/logos/quickbooks.png',
    type: 'accounting',
    status: 'disconnected',
    authType: 'oauth',
    supportedFeatures: ['invoice_sync', 'vendor_sync', 'auto_categorize'],
  },
  {
    id: 'xero',
    name: 'Xero',
    logo: '/logos/xero.png',
    type: 'accounting',
    status: 'disconnected',
    authType: 'oauth',
    supportedFeatures: ['invoice_sync', 'vendor_sync', 'multi_currency'],
  },
  {
    id: 'sap',
    name: 'SAP Business One',
    logo: '/logos/sap.png',
    type: 'erp',
    status: 'disconnected',
    authType: 'api_key',
    supportedFeatures: ['invoice_sync', 'purchase_orders', 'approval_workflow'],
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    logo: '/logos/netsuite.png',
    type: 'erp',
    status: 'disconnected',
    authType: 'oauth',
    supportedFeatures: ['invoice_sync', 'vendor_sync', 'multi_entity'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '/logos/stripe.png',
    type: 'payment',
    status: 'disconnected',
    authType: 'api_key',
    supportedFeatures: ['payment_tracking', 'invoice_payment'],
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    logo: '/logos/google-drive.png',
    type: 'storage',
    status: 'disconnected',
    authType: 'oauth',
    supportedFeatures: ['auto_import', 'backup'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    logo: '/logos/dropbox.png',
    type: 'storage',
    status: 'disconnected',
    authType: 'oauth',
    supportedFeatures: ['auto_import', 'backup'],
  },
]

// Utility function to format currency
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  if (!currency) return `${amount.toFixed(2)}`

  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  }).format(amount)
}

// Utility function to get file format info
export function getInvoiceFormat(mimeType: string): InvoiceFormat | undefined {
  return INVOICE_FORMATS.find(format => format.mimeTypes.includes(mimeType))
}
