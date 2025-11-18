import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  mockData,
  mockStats,
  mockTimeSeriesData,
  mockCategoryData,
  mockBudgets,
  mockPaymentTransactions,
  mockEmailImports,
  mockAlerts,
  mockAuditTrail,
  mockVendorPerformance,
  mockReportTemplates,
} from '../data/mockData';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoData: typeof mockData;
  demoStats: typeof mockStats;
  demoTimeSeriesData: typeof mockTimeSeriesData;
  demoCategoryData: typeof mockCategoryData;
  demoBudgets: typeof mockBudgets;
  demoPaymentTransactions: typeof mockPaymentTransactions;
  demoEmailImports: typeof mockEmailImports;
  demoAlerts: typeof mockAlerts;
  demoAuditTrail: typeof mockAuditTrail;
  demoVendorPerformance: typeof mockVendorPerformance;
  demoReportTemplates: typeof mockReportTemplates;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('invoice-ocr-demo-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('invoice-ocr-demo-mode', JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev: boolean) => !prev);
  };

  const value = {
    isDemoMode,
    toggleDemoMode,
    demoData: mockData,
    demoStats: mockStats,
    demoTimeSeriesData: mockTimeSeriesData,
    demoCategoryData: mockCategoryData,
    demoBudgets: mockBudgets,
    demoPaymentTransactions: mockPaymentTransactions,
    demoEmailImports: mockEmailImports,
    demoAlerts: mockAlerts,
    demoAuditTrail: mockAuditTrail,
    demoVendorPerformance: mockVendorPerformance,
    demoReportTemplates: mockReportTemplates,
  };

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
