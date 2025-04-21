
import { Currency, MobileMoneyNetwork, UserRole } from "@/types";

// Default commission percentages
export const DEFAULT_COMMISSION_PERCENTAGES = {
  kinshasa_to_dubai: 3.5,
  dubai_to_kinshasa: 3.0
};

// Available mobile money networks
export const MOBILE_MONEY_NETWORKS: MobileMoneyNetwork[] = [
  {
    id: "1",
    name: "M-Pesa",
    country: "Congo DRC",
    active: true
  },
  {
    id: "2",
    name: "Orange Money",
    country: "Congo DRC",
    active: true
  },
  {
    id: "3",
    name: "Airtel Money",
    country: "Congo DRC",
    active: true
  },
  {
    id: "4",
    name: "Africell Money",
    country: "Congo DRC",
    active: true
  },
  {
    id: "5",
    name: "eWallet UAE",
    country: "UAE",
    active: true
  }
];

// Available currencies
export const AVAILABLE_CURRENCIES = [
  Currency.USD,
  Currency.EUR,
  Currency.AED,
  Currency.CDF
];

// Currency symbols
export const CURRENCY_SYMBOLS = {
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
  [Currency.AED]: "د.إ",
  [Currency.CDF]: "FC"
};

// User role permissions
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canCreateUsers: true,
    canEditUsers: true,
    canViewAllTransactions: true,
    canCreateTransactions: true,
    canValidateTransactions: true,
    canCancelTransactions: true,
    canViewReports: true,
    canConfigureSystem: true,
    canViewAuditLog: true,
    canManageMobileNetworks: true
  },
  [UserRole.SUPERVISOR]: {
    canCreateUsers: false,
    canEditUsers: false,
    canViewAllTransactions: true,
    canCreateTransactions: true,
    canValidateTransactions: true,
    canCancelTransactions: true,
    canViewReports: true,
    canConfigureSystem: false,
    canViewAuditLog: true,
    canManageMobileNetworks: false
  },
  [UserRole.OPERATOR]: {
    canCreateUsers: false,
    canEditUsers: false,
    canViewAllTransactions: false,
    canCreateTransactions: true,
    canValidateTransactions: false,
    canCancelTransactions: false,
    canViewReports: false,
    canConfigureSystem: false,
    canViewAuditLog: false,
    canManageMobileNetworks: false
  },
  [UserRole.AUDITOR]: {
    canCreateUsers: false,
    canEditUsers: false,
    canViewAllTransactions: true,
    canCreateTransactions: false,
    canValidateTransactions: false,
    canCancelTransactions: false,
    canViewReports: true,
    canConfigureSystem: false,
    canViewAuditLog: true,
    canManageMobileNetworks: false
  }
};

// Sample users for demo
export const DEMO_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@transferapp.com",
    password: "admin123",
    role: UserRole.ADMIN,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: "2",
    name: "Supervisor User",
    email: "supervisor@transferapp.com",
    password: "super123",
    role: UserRole.SUPERVISOR,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: "3",
    name: "Operator User",
    email: "operator@transferapp.com",
    password: "oper123",
    role: UserRole.OPERATOR,
    createdAt: new Date(),
    lastLogin: null
  },
  {
    id: "4",
    name: "Auditor User",
    email: "auditor@transferapp.com",
    password: "audit123",
    role: UserRole.AUDITOR,
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Sample transactions for demo
export const DEMO_TRANSACTIONS = [
  // Add some demo transactions here
];
