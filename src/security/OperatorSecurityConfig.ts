
// Configuration des contraintes de sécurité pour les opérateurs à Dubaï et Kinshasa
export const OperatorSecurityConfig = {
  // Contraintes juridiques par région
  legalConstraints: {
    dubai: {
      laws: [
        'Dubai Data Law (Law No. 1 of 2022)',
        'DIFC Data Protection Law'
      ],
      requirements: {
        dataEncryption: 'AES-256 + HSM certifié FIPS 140-2',
        breachNotification: '72 heures',
        dataLocalization: false
      },
      regulatoryBody: 'TDRA (Telecommunications Regulatory Authority)',
      complianceCertification: 'Tier III+ (Uptime Institute)'
    },
    kinshasa: {
      laws: [
        'Loi n° 13/015 sur la protection des données personnelles (RDC, 2021)'
      ],
      requirements: {
        dataEncryption: 'AES-256 (clés gérées localement)',
        breachNotification: '72 heures',
        dataLocalization: true,
        explicitConsent: true
      },
      regulatoryBody: 'Ministère du Numérique',
      complianceCertification: 'ISO 27001'
    }
  },

  // Contraintes techniques
  technicalConstraints: {
    infrastructure: {
      networkRedundancy: {
        minimumProviders: 2,
        maxLatency: 100, // ms
        uptimeRequirement: 99.9
      },
      physicalSecurity: {
        datacenterTier: 'III+',
        biometricAccess: true,
        surveillance: '24/7',
        accessLogging: true
      },
      businessContinuity: {
        powerBackup: {
          generators: true,
          batteries: true,
          autonomyHours: 48
        },
        recoveryTime: 15, // minutes
        backupMethods: ['satellite', 'redundant_fiber']
      }
    },
    maintenance: {
      dubai: {
        allowedWindow: '02:00-04:00 GST',
        maxDuration: 2 // hours
      },
      kinshasa: {
        allowedWindow: '18:00-06:00 WAT',
        maxDuration: 4 // hours
      }
    }
  },

  // Obligations de transparence
  transparencyObligations: {
    audits: {
      frequency: 'quarterly',
      auditorType: 'independent_certified',
      reportLevel: 'OWASP ASVS Level 2',
      accessType: 'physical_logical'
    },
    logging: {
      retention: {
        dubai: 2, // years
        kinshasa: 1 // years
      },
      realTimeMonitoring: true,
      apiAccess: true
    },
    penetrationTesting: {
      frequency: 'quarterly',
      certificationRequired: 'CERT_approved'
    }
  },

  // Sanctions et pénalités
  sanctions: {
    financial: {
      downtimePerHour: 0.05, // 5% du CA mensuel
      dataBreachPenalty: 500000, // USD
      currency: 'USD'
    },
    termination: {
      unauthorizedAccess: true,
      dataLocalizationViolation: true,
      complianceFailure: true
    }
  },

  // Checklist de conformité
  complianceChecklist: [
    {
      id: 'datacenter_certification',
      requirement: 'Preuve de certification des datacenters',
      dubai: 'Tier III',
      kinshasa: 'ISO 27001',
      mandatory: true
    },
    {
      id: 'penetration_tests',
      requirement: 'Tests de pénétration trimestriels',
      frequency: 'quarterly',
      certificationRequired: true,
      mandatory: true
    },
    {
      id: 'confidentiality_agreement',
      requirement: 'Clause de confidentialité signée',
      scope: 'tous les techniciens',
      mandatory: true
    },
    {
      id: 'data_evacuation_plan',
      requirement: 'Plan d\'évacuation des données',
      scenarios: ['conflit', 'catastrophe naturelle'],
      mandatory: true
    },
    {
      id: 'regulatory_approval',
      requirement: 'Agrément réglementaire',
      dubai: 'TDRA',
      kinshasa: 'Ministère du Numérique',
      mandatory: true
    }
  ]
};

// Types pour la gestion des opérateurs
export interface OperatorProfile {
  id: string;
  name: string;
  region: 'dubai' | 'kinshasa';
  type: 'hosting' | 'network' | 'security' | 'maintenance';
  status: 'active' | 'suspended' | 'terminated';
  complianceScore: number;
  certifications: OperatorCertification[];
  lastAudit: Date;
  contractStart: Date;
  contractEnd: Date;
}

export interface OperatorCertification {
  type: string;
  issuer: string;
  validFrom: Date;
  validUntil: Date;
  verified: boolean;
  documentUrl?: string;
}

export interface ComplianceIncident {
  id: string;
  operatorId: string;
  type: 'downtime' | 'security_breach' | 'compliance_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  occurredAt: Date;
  resolvedAt?: Date;
  penalty?: number;
  currency?: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
}
