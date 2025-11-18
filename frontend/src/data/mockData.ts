import { faker } from '@faker-js/faker';

// Generate invoice images using placeholders
const generateInvoiceImage = (index: number) => {
  const templates = [
    `https://picsum.photos/seed/inv${index}/600/800`,
    `https://via.placeholder.com/600x800/1a1a1a/ffffff?text=Invoice+${index}`,
    `https://placehold.co/600x800/0066cc/white?text=Invoice+${index}`,
  ];
  return templates[index % templates.length];
};

// Generate realistic company names
const companyNames = [
  'TechCorp Solutions', 'Global Enterprises', 'Innovation Labs', 'Digital Dynamics',
  'Smart Systems Inc', 'Future Technologies', 'Alpha Innovations', 'Beta Services',
  'Gamma Solutions', 'Delta Group', 'Epsilon Corp', 'Zeta Industries',
  'Theta Consulting', 'Kappa Technologies', 'Lambda Solutions', 'Mu Enterprises',
  'Nu Digital', 'Xi Systems', 'Omicron Inc', 'Pi Solutions',
  'Rho Tech', 'Sigma Services', 'Tau Group', 'Upsilon Corp',
  'Phi Industries', 'Chi Consulting', 'Psi Technologies', 'Omega Solutions',
  'Acme Corporation', 'Sterling Industries', 'Pinnacle Group', 'Summit Solutions',
  'Horizon Technologies', 'Apex Systems', 'Vertex Corp', 'Zenith Enterprises',
  'Momentum Inc', 'Catalyst Solutions', 'Nexus Group', 'Synergy Corp',
  'Quantum Technologies', 'Fusion Industries', 'Velocity Solutions', 'Vortex Systems',
  'Matrix Corp', 'Phoenix Group', 'Eclipse Technologies', 'Titan Industries',
  'Atlas Solutions', 'Orion Corp', 'Neptune Systems', 'Mercury Group',
];

// Generate vendors
export const generateVendors = (count: number = 50) => {
  const vendors = [];
  for (let i = 0; i < count; i++) {
    vendors.push({
      id: `vendor-${i + 1}`,
      name: companyNames[i % companyNames.length],
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      taxId: faker.string.alphanumeric(10).toUpperCase(),
      category: faker.helpers.arrayElement([
        'Software & Technology',
        'Office Supplies',
        'Professional Services',
        'Marketing & Advertising',
        'Equipment & Hardware',
        'Utilities',
        'Travel & Entertainment',
        'Insurance',
        'Telecommunications',
        'Maintenance & Repairs',
      ]),
      totalInvoices: faker.number.int({ min: 5, max: 50 }),
      totalSpent: faker.number.float({ min: 5000, max: 500000, multipleOf: 0.01 }),
      avgInvoiceAmount: faker.number.float({ min: 500, max: 15000, multipleOf: 0.01 }),
      rating: faker.number.float({ min: 3.5, max: 5.0, multipleOf: 0.1 }),
      paymentTerms: faker.helpers.arrayElement(['Net 30', 'Net 60', 'Due on Receipt', 'Net 15', 'Net 45']),
      createdAt: faker.date.past({ years: 2 }),
    });
  }
  return vendors;
};

// Generate clients
export const generateClients = (count: number = 30) => {
  const clients = [];
  for (let i = 0; i < count; i++) {
    clients.push({
      id: `client-${i + 1}`,
      name: faker.person.fullName(),
      company: companyNames[Math.floor(Math.random() * companyNames.length)],
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']),
      totalInvoices: faker.number.int({ min: 1, max: 30 }),
      totalRevenue: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.01 }),
      outstandingBalance: faker.number.float({ min: 0, max: 50000, multipleOf: 0.01 }),
      creditLimit: faker.number.float({ min: 10000, max: 200000, multipleOf: 0.01 }),
      paymentHistory: faker.helpers.arrayElement(['Excellent', 'Good', 'Fair', 'Poor']),
      lastInvoiceDate: faker.date.recent({ days: 60 }),
      createdAt: faker.date.past({ years: 3 }),
    });
  }
  return clients;
};

// Generate line items
const generateLineItems = (count: number = faker.number.int({ min: 1, max: 8 })) => {
  const items = [];
  const descriptions = [
    'Consulting Services', 'Software License', 'Monthly Subscription',
    'Hardware Equipment', 'Training Sessions', 'Support Services',
    'Development Hours', 'Design Services', 'Marketing Campaign',
    'Cloud Hosting', 'Database License', 'API Integration',
    'Security Audit', 'Performance Optimization', 'Custom Development',
    'Project Management', 'Technical Writing', 'Quality Assurance',
    'Data Migration', 'System Upgrade', 'Maintenance Contract',
  ];

  for (let i = 0; i < count; i++) {
    const quantity = faker.number.int({ min: 1, max: 100 });
    const unitPrice = faker.number.float({ min: 10, max: 5000, multipleOf: 0.01 });
    const total = quantity * unitPrice;

    items.push({
      id: `line-${i + 1}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      quantity,
      unitPrice,
      total,
      taxRate: faker.helpers.arrayElement([0, 0.05, 0.08, 0.10, 0.13]),
      discount: faker.helpers.arrayElement([0, 0.05, 0.10, 0.15, 0.20]),
    });
  }
  return items;
};

// Generate invoices
export const generateInvoices = (count: number = 150) => {
  const invoices = [];
  const vendors = generateVendors(50);
  const clients = generateClients(30);

  const statuses = ['Pending', 'Paid', 'Overdue', 'Draft', 'Cancelled', 'Processing'];
  const categories = [
    'Software & Technology', 'Office Supplies', 'Professional Services',
    'Marketing & Advertising', 'Equipment & Hardware', 'Utilities',
    'Travel & Entertainment', 'Insurance', 'Telecommunications',
    'Maintenance & Repairs', 'Legal Services', 'Accounting Services',
  ];

  for (let i = 0; i < count; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const lineItems = generateLineItems();

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = lineItems.reduce((sum, item) => sum + (item.total * item.taxRate), 0);
    const discountAmount = lineItems.reduce((sum, item) => sum + (item.total * item.discount), 0);
    const total = subtotal + taxAmount - discountAmount;

    const issueDate = faker.date.past({ years: 1 });
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 15, max: 60 }));

    const status = faker.helpers.arrayElement(statuses);
    const paidDate = status === 'Paid' ? faker.date.between({ from: issueDate, to: new Date() }) : null;

    // AI/ML confidence scores
    const overallConfidence = faker.number.float({ min: 0.75, max: 0.99, multipleOf: 0.01 });

    invoices.push({
      id: `INV-${String(i + 1).padStart(6, '0')}`,
      invoiceNumber: `${faker.string.alpha({ length: 3 }).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      vendorAddress: vendor.address,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: client.address,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      paidDate: paidDate?.toISOString() || null,
      status,
      category: faker.helpers.arrayElement(categories),
      lineItems,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD', 'AUD']),
      paymentMethod: faker.helpers.arrayElement(['Credit Card', 'Bank Transfer', 'Check', 'PayPal', 'Wire Transfer']),
      notes: faker.lorem.sentence(),
      tags: faker.helpers.arrayElements(['urgent', 'recurring', 'verified', 'archived', 'flagged'], { min: 0, max: 3 }),
      imageUrl: generateInvoiceImage(i),
      ocrProcessed: faker.datatype.boolean(0.9),
      aiConfidence: {
        overall: overallConfidence,
        invoiceNumber: faker.number.float({ min: 0.85, max: 0.99, multipleOf: 0.01 }),
        vendor: faker.number.float({ min: 0.80, max: 0.99, multipleOf: 0.01 }),
        total: faker.number.float({ min: 0.90, max: 0.99, multipleOf: 0.01 }),
        date: faker.number.float({ min: 0.88, max: 0.99, multipleOf: 0.01 }),
        lineItems: faker.number.float({ min: 0.75, max: 0.95, multipleOf: 0.01 }),
      },
      duplicateRisk: faker.number.float({ min: 0, max: 0.3, multipleOf: 0.01 }),
      fraudScore: faker.number.float({ min: 0, max: 0.15, multipleOf: 0.01 }),
      processingTime: faker.number.float({ min: 0.5, max: 5.0, multipleOf: 0.1 }),
      extractedFields: faker.number.int({ min: 15, max: 35 }),
      validationErrors: faker.number.int({ min: 0, max: 3 }),
      createdAt: issueDate.toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
      uploadedBy: faker.person.fullName(),
      approvedBy: status === 'Paid' ? faker.person.fullName() : null,
    });
  }

  // Sort by date (newest first)
  return invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate dashboard statistics
export const generateDashboardStats = (invoices: any[]) => {
  const now = new Date();
  const thisMonth = invoices.filter(inv => {
    const date = new Date(inv.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const lastMonth = invoices.filter(inv => {
    const date = new Date(inv.createdAt);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
  });

  const pending = invoices.filter(inv => inv.status === 'Pending');
  const paid = invoices.filter(inv => inv.status === 'Paid');
  const overdue = invoices.filter(inv => inv.status === 'Overdue');

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const thisMonthRevenue = thisMonth.reduce((sum, inv) => sum + inv.total, 0);
  const lastMonthRevenue = lastMonth.reduce((sum, inv) => sum + inv.total, 0);
  const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  return {
    totalInvoices: invoices.length,
    totalRevenue,
    pendingInvoices: pending.length,
    paidInvoices: paid.length,
    overdueInvoices: overdue.length,
    thisMonthInvoices: thisMonth.length,
    thisMonthRevenue,
    lastMonthRevenue,
    revenueGrowth,
    avgInvoiceValue: totalRevenue / invoices.length,
    avgProcessingTime: invoices.reduce((sum, inv) => sum + inv.processingTime, 0) / invoices.length,
    avgAiConfidence: invoices.reduce((sum, inv) => sum + inv.aiConfidence.overall, 0) / invoices.length,
    totalPendingAmount: pending.reduce((sum, inv) => sum + inv.total, 0),
    totalPaidAmount: paid.reduce((sum, inv) => sum + inv.total, 0),
    totalOverdueAmount: overdue.reduce((sum, inv) => sum + inv.total, 0),
  };
};

// Generate time series data for charts
export const generateTimeSeriesData = (invoices: any[]) => {
  const monthlyData: any[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear();
    });

    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: monthInvoices.reduce((sum, inv) => sum + inv.total, 0),
      invoices: monthInvoices.length,
      paid: monthInvoices.filter(inv => inv.status === 'Paid').length,
      pending: monthInvoices.filter(inv => inv.status === 'Pending').length,
      overdue: monthInvoices.filter(inv => inv.status === 'Overdue').length,
    });
  }

  return monthlyData;
};

// Generate category breakdown
export const generateCategoryBreakdown = (invoices: any[]) => {
  const categories: { [key: string]: number } = {};

  invoices.forEach(inv => {
    if (!categories[inv.category]) {
      categories[inv.category] = 0;
    }
    categories[inv.category] += inv.total;
  });

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Generate payment transactions
export const generatePaymentTransactions = (invoices: any[]) => {
  const transactions = [];
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid');

  for (let i = 0; i < paidInvoices.length; i++) {
    const invoice = paidInvoices[i];
    const paymentDate = invoice.paidDate ? new Date(invoice.paidDate) : new Date();

    transactions.push({
      id: `txn-${String(i + 1).padStart(6, '0')}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      vendorName: invoice.vendorName,
      amount: invoice.total,
      currency: invoice.currency,
      paymentMethod: invoice.paymentMethod,
      paymentGateway: faker.helpers.arrayElement(['Stripe', 'PayPal', 'Bank Transfer', 'Check']),
      transactionId: faker.string.alphanumeric(16).toUpperCase(),
      status: faker.helpers.arrayElement(['Completed', 'Pending', 'Failed', 'Refunded']),
      fee: invoice.total * faker.number.float({ min: 0.015, max: 0.03, multipleOf: 0.001 }),
      netAmount: invoice.total * (1 - faker.number.float({ min: 0.015, max: 0.03, multipleOf: 0.001 })),
      paymentDate: paymentDate.toISOString(),
      settlementDate: new Date(paymentDate.getTime() + (1000 * 60 * 60 * 24 * faker.number.int({ min: 1, max: 5 }))).toISOString(),
      notes: faker.lorem.sentence(),
      createdAt: paymentDate.toISOString(),
    });
  }

  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate budget allocations
export const generateBudgets = () => {
  const categories = [
    'Software & Technology', 'Office Supplies', 'Professional Services',
    'Marketing & Advertising', 'Equipment & Hardware', 'Utilities',
    'Travel & Entertainment', 'Insurance', 'Telecommunications',
    'Maintenance & Repairs', 'Legal Services', 'Accounting Services',
  ];

  return categories.map((category, i) => ({
    id: `budget-${i + 1}`,
    category,
    allocated: faker.number.int({ min: 10000, max: 100000 }),
    spent: faker.number.int({ min: 5000, max: 95000 }),
    period: 'Monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    alertThreshold: faker.number.int({ min: 75, max: 90 }),
    department: faker.helpers.arrayElement(['Engineering', 'Sales', 'Marketing', 'Operations', 'HR', 'Finance']),
    owner: faker.person.fullName(),
    status: faker.helpers.arrayElement(['On Track', 'At Risk', 'Over Budget']),
  }));
};

// Generate email import data
export const generateEmailImports = () => {
  const imports = [];
  for (let i = 0; i < 25; i++) {
    const processedDate = faker.date.recent({ days: 30 });
    imports.push({
      id: `email-${i + 1}`,
      from: faker.internet.email(),
      subject: `Invoice ${faker.string.alpha({ length: 3 }).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`,
      receivedAt: faker.date.recent({ days: 30 }).toISOString(),
      processedAt: processedDate.toISOString(),
      status: faker.helpers.arrayElement(['Processed', 'Processing', 'Failed', 'Pending']),
      extractedInvoiceId: faker.helpers.maybe(() => `INV-${String(faker.number.int({ min: 1, max: 150 })).padStart(6, '0')}`, { probability: 0.8 }),
      confidence: faker.number.float({ min: 0.75, max: 0.99, multipleOf: 0.01 }),
      attachmentCount: faker.number.int({ min: 1, max: 3 }),
      processingTime: faker.number.float({ min: 2, max: 15, multipleOf: 0.1 }),
      errors: faker.helpers.maybe(() => [faker.lorem.sentence()], { probability: 0.15 }),
    });
  }
  return imports.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
};

// Generate notification/alert data
export const generateAlerts = (invoices: any[], budgets: any[]) => {
  const alerts: any[] = [];

  // Fraud alerts
  const highFraudInvoices = invoices.filter(inv => inv.fraudScore > 0.1).slice(0, 3);
  highFraudInvoices.forEach((inv, i) => {
    alerts.push({
      id: `alert-fraud-${i + 1}`,
      type: 'fraud',
      severity: 'high',
      title: 'Potential Fraud Detected',
      message: `Invoice ${inv.invoiceNumber} has a high fraud risk score of ${(inv.fraudScore * 100).toFixed(1)}%`,
      invoiceId: inv.id,
      createdAt: new Date(inv.createdAt).toISOString(),
      read: faker.datatype.boolean(0.3),
      actionRequired: true,
    });
  });

  // Duplicate alerts
  const highDuplicateInvoices = invoices.filter(inv => inv.duplicateRisk > 0.15).slice(0, 2);
  highDuplicateInvoices.forEach((inv, i) => {
    alerts.push({
      id: `alert-dup-${i + 1}`,
      type: 'duplicate',
      severity: 'medium',
      title: 'Possible Duplicate Invoice',
      message: `Invoice ${inv.invoiceNumber} may be a duplicate (${(inv.duplicateRisk * 100).toFixed(0)}% match)`,
      invoiceId: inv.id,
      createdAt: new Date(inv.createdAt).toISOString(),
      read: faker.datatype.boolean(0.5),
      actionRequired: true,
    });
  });

  // Budget alerts
  const overBudgets = budgets.filter(b => (b.spent / b.allocated) > 0.85).slice(0, 3);
  overBudgets.forEach((budget, i) => {
    const percentage = ((budget.spent / budget.allocated) * 100).toFixed(0);
    alerts.push({
      id: `alert-budget-${i + 1}`,
      type: 'budget',
      severity: parseInt(percentage) > 100 ? 'high' : 'medium',
      title: parseInt(percentage) > 100 ? 'Budget Exceeded' : 'Budget Alert',
      message: `${budget.category} budget is at ${percentage}% (${budget.spent.toLocaleString()}/${budget.allocated.toLocaleString()})`,
      budgetId: budget.id,
      createdAt: faker.date.recent({ days: 7 }).toISOString(),
      read: faker.datatype.boolean(0.4),
      actionRequired: parseInt(percentage) > 100,
    });
  });

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate audit trail
export const generateAuditTrail = (invoices: any[]) => {
  const actions = ['created', 'updated', 'approved', 'rejected', 'deleted', 'exported', 'viewed', 'downloaded'];
  const trail = [];

  for (let i = 0; i < 100; i++) {
    const invoice = invoices[Math.floor(Math.random() * Math.min(invoices.length, 50))];
    const action = faker.helpers.arrayElement(actions);
    const timestamp = faker.date.recent({ days: 30 });

    trail.push({
      id: `audit-${i + 1}`,
      action,
      entityType: 'invoice',
      entityId: invoice.id,
      entityName: invoice.invoiceNumber,
      userId: `user-${faker.number.int({ min: 1, max: 10 })}`,
      userName: faker.person.fullName(),
      userRole: faker.helpers.arrayElement(['admin', 'manager', 'user', 'client']),
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
      changes: action === 'updated' ? {
        before: { status: 'Pending' },
        after: { status: 'Approved' },
      } : null,
      timestamp: timestamp.toISOString(),
      metadata: {
        browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
        location: faker.location.city(),
      },
    });
  }

  return trail.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate vendor performance scores
export const generateVendorPerformance = (vendors: any[], invoices: any[]) => {
  return vendors.map(vendor => {
    const vendorInvoices = invoices.filter(inv => inv.vendorId === vendor.id);
    const paidInvoices = vendorInvoices.filter(inv => inv.status === 'Paid');

    const avgPaymentTime = paidInvoices.length > 0
      ? paidInvoices.reduce((sum, inv) => {
          if (inv.paidDate) {
            const due = new Date(inv.dueDate);
            const paid = new Date(inv.paidDate);
            return sum + ((paid.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
          }
          return sum;
        }, 0) / paidInvoices.length
      : 0;

    return {
      vendorId: vendor.id,
      vendorName: vendor.name,
      totalInvoices: vendorInvoices.length,
      totalAmount: vendorInvoices.reduce((sum, inv) => sum + inv.total, 0),
      avgInvoiceAmount: vendorInvoices.length > 0
        ? vendorInvoices.reduce((sum, inv) => sum + inv.total, 0) / vendorInvoices.length
        : 0,
      onTimeDeliveryRate: faker.number.float({ min: 0.75, max: 0.99, multipleOf: 0.01 }),
      qualityScore: faker.number.float({ min: 3.5, max: 5.0, multipleOf: 0.1 }),
      complianceScore: faker.number.float({ min: 0.80, max: 1.0, multipleOf: 0.01 }),
      responseTime: faker.number.float({ min: 2, max: 48, multipleOf: 0.5 }), // hours
      avgPaymentTime, // days (negative means early, positive means late)
      disputeRate: faker.number.float({ min: 0, max: 0.1, multipleOf: 0.001 }),
      innovationScore: faker.number.float({ min: 3.0, max: 5.0, multipleOf: 0.1 }),
      costCompetitiveness: faker.number.float({ min: 3.0, max: 5.0, multipleOf: 0.1 }),
      overallRating: faker.number.float({ min: 3.5, max: 5.0, multipleOf: 0.1 }),
      lastReviewDate: faker.date.recent({ days: 90 }).toISOString(),
      trend: faker.helpers.arrayElement(['improving', 'stable', 'declining']),
    };
  });
};

// Generate report templates
export const generateReportTemplates = () => {
  return [
    {
      id: 'template-1',
      name: 'Monthly Financial Summary',
      description: 'Comprehensive overview of monthly invoices, spending, and trends',
      category: 'Financial',
      frequency: 'Monthly',
      widgets: ['revenue-trend', 'category-breakdown', 'status-distribution', 'top-vendors'],
      recipients: [],
      lastGenerated: faker.date.recent({ days: 30 }).toISOString(),
      isActive: true,
    },
    {
      id: 'template-2',
      name: 'Vendor Performance Report',
      description: 'Detailed analysis of vendor metrics and performance indicators',
      category: 'Vendor Management',
      frequency: 'Quarterly',
      widgets: ['vendor-scores', 'payment-history', 'compliance-metrics'],
      recipients: [],
      lastGenerated: faker.date.recent({ days: 90 }).toISOString(),
      isActive: true,
    },
    {
      id: 'template-3',
      name: 'Budget vs Actual Analysis',
      description: 'Compare budgeted amounts against actual spending by category',
      category: 'Budget',
      frequency: 'Monthly',
      widgets: ['budget-progress', 'variance-analysis', 'forecast'],
      recipients: [],
      lastGenerated: faker.date.recent({ days: 30 }).toISOString(),
      isActive: true,
    },
    {
      id: 'template-4',
      name: 'Fraud & Risk Assessment',
      description: 'Identify high-risk invoices and potential fraud patterns',
      category: 'Security',
      frequency: 'Weekly',
      widgets: ['fraud-alerts', 'duplicate-detection', 'anomaly-patterns'],
      recipients: [],
      lastGenerated: faker.date.recent({ days: 7 }).toISOString(),
      isActive: true,
    },
    {
      id: 'template-5',
      name: 'Cash Flow Forecast',
      description: 'Predictive analysis of upcoming cash flow based on historical data',
      category: 'Forecasting',
      frequency: 'Weekly',
      widgets: ['cash-flow-prediction', 'payment-schedule', 'liquidity-analysis'],
      recipients: [],
      lastGenerated: faker.date.recent({ days: 7 }).toISOString(),
      isActive: true,
    },
  ];
};

// Export all mock data
export const mockData = {
  invoices: generateInvoices(150),
  vendors: generateVendors(50),
  clients: generateClients(30),
};

// Add computed stats and new data
export const mockStats = generateDashboardStats(mockData.invoices);
export const mockTimeSeriesData = generateTimeSeriesData(mockData.invoices);
export const mockCategoryData = generateCategoryBreakdown(mockData.invoices);
export const mockBudgets = generateBudgets();
export const mockPaymentTransactions = generatePaymentTransactions(mockData.invoices);
export const mockEmailImports = generateEmailImports();
export const mockAlerts = generateAlerts(mockData.invoices, mockBudgets);
export const mockAuditTrail = generateAuditTrail(mockData.invoices);
export const mockVendorPerformance = generateVendorPerformance(mockData.vendors, mockData.invoices);
export const mockReportTemplates = generateReportTemplates();

export default mockData;
