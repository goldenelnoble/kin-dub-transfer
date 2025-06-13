
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building,
  FileText,
  TrendingUp,
  Globe
} from 'lucide-react';
import { OperatorSecurityConfig, OperatorProfile, ComplianceIncident } from '../OperatorSecurityConfig';

const OperatorComplianceDashboard = () => {
  const [operators, setOperators] = useState<OperatorProfile[]>([]);
  const [incidents, setIncidents] = useState<ComplianceIncident[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<'dubai' | 'kinshasa' | 'all'>('all');

  useEffect(() => {
    // Simulation de données d'opérateurs
    const mockOperators: OperatorProfile[] = [
      {
        id: 'op-dubai-001',
        name: 'Emirates Data Center Services',
        region: 'dubai',
        type: 'hosting',
        status: 'active',
        complianceScore: 95,
        certifications: [
          {
            type: 'Tier III',
            issuer: 'Uptime Institute',
            validFrom: new Date('2024-01-01'),
            validUntil: new Date('2025-12-31'),
            verified: true
          }
        ],
        lastAudit: new Date('2024-11-01'),
        contractStart: new Date('2024-01-01'),
        contractEnd: new Date('2025-12-31')
      },
      {
        id: 'op-kin-001',
        name: 'Congo Telecom Infrastructure',
        region: 'kinshasa',
        type: 'network',
        status: 'active',
        complianceScore: 78,
        certifications: [
          {
            type: 'ISO 27001',
            issuer: 'BSI Group',
            validFrom: new Date('2024-03-01'),
            validUntil: new Date('2025-03-01'),
            verified: true
          }
        ],
        lastAudit: new Date('2024-10-15'),
        contractStart: new Date('2024-01-01'),
        contractEnd: new Date('2025-12-31')
      }
    ];

    const mockIncidents: ComplianceIncident[] = [
      {
        id: 'inc-001',
        operatorId: 'op-kin-001',
        type: 'downtime',
        severity: 'high',
        description: 'Coupure électrique non planifiée - 2h d\'indisponibilité',
        occurredAt: new Date('2024-12-10T14:30:00'),
        resolvedAt: new Date('2024-12-10T16:30:00'),
        penalty: 5000,
        currency: 'USD',
        status: 'resolved'
      }
    ];

    setOperators(mockOperators);
    setIncidents(mockIncidents);
  }, []);

  const getComplianceStatus = (score: number) => {
    if (score >= 95) return { status: 'excellent', color: 'bg-green-500', icon: CheckCircle };
    if (score >= 85) return { status: 'good', color: 'bg-blue-500', icon: TrendingUp };
    if (score >= 70) return { status: 'warning', color: 'bg-yellow-500', icon: AlertTriangle };
    return { status: 'critical', color: 'bg-red-500', icon: XCircle };
  };

  const filteredOperators = selectedRegion === 'all' 
    ? operators 
    : operators.filter(op => op.region === selectedRegion);

  const getRegionRequirements = (region: 'dubai' | 'kinshasa') => {
    return OperatorSecurityConfig.legalConstraints[region];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#43A047]">
            Conformité des Opérateurs
          </h2>
          <p className="text-muted-foreground">
            Suivi des contraintes de sécurité - Dubaï & Kinshasa
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={selectedRegion === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedRegion('all')}
          >
            <Globe className="h-4 w-4 mr-1" />
            Toutes les régions
          </Button>
          <Button 
            variant={selectedRegion === 'dubai' ? 'default' : 'outline'}
            onClick={() => setSelectedRegion('dubai')}
          >
            Dubaï
          </Button>
          <Button 
            variant={selectedRegion === 'kinshasa' ? 'default' : 'outline'}
            onClick={() => setSelectedRegion('kinshasa')}
          >
            Kinshasa
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-[#43A047]" />
              <div>
                <p className="text-sm text-muted-foreground">Opérateurs Actifs</p>
                <p className="text-2xl font-bold">{operators.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conformité Moyenne</p>
                <p className="text-2xl font-bold">
                  {Math.round(operators.reduce((acc, op) => acc + op.complianceScore, 0) / operators.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Incidents Actifs</p>
                <p className="text-2xl font-bold">
                  {incidents.filter(i => i.status !== 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#F97316]" />
              <div>
                <p className="text-sm text-muted-foreground">Audits en Retard</p>
                <p className="text-2xl font-bold">
                  {operators.filter(op => {
                    const daysSinceAudit = (Date.now() - op.lastAudit.getTime()) / (1000 * 60 * 60 * 24);
                    return daysSinceAudit > 90; // Plus de 3 mois
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operators" className="w-full">
        <TabsList>
          <TabsTrigger value="operators">Opérateurs</TabsTrigger>
          <TabsTrigger value="compliance">Checklist Conformité</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="requirements">Exigences Légales</TabsTrigger>
        </TabsList>

        <TabsContent value="operators" className="space-y-4">
          {filteredOperators.map((operator) => {
            const complianceStatus = getComplianceStatus(operator.complianceScore);
            const StatusIcon = complianceStatus.icon;

            return (
              <Card key={operator.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-6 w-6 text-white p-1 rounded-full ${complianceStatus.color}`} />
                      <div>
                        <CardTitle className="text-lg">{operator.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {operator.region.toUpperCase()} • {operator.type}
                        </p>
                      </div>
                    </div>
                    <Badge variant={operator.status === 'active' ? 'default' : 'destructive'}>
                      {operator.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Score de Conformité</p>
                      <Progress value={operator.complianceScore} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {operator.complianceScore}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Certifications</p>
                      <div className="space-y-1">
                        {operator.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Dernier Audit</p>
                      <p className="text-sm text-muted-foreground">
                        {operator.lastAudit.toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Contrat: {operator.contractEnd.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Conformité Opérateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {OperatorSecurityConfig.complianceChecklist.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{item.requirement}</p>
                      {item.dubai && item.kinshasa && (
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Dubaï:</span> {item.dubai} • 
                          <span className="font-medium ml-2">Kinshasa:</span> {item.kinshasa}
                        </div>
                      )}
                      {item.frequency && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {item.frequency}
                        </Badge>
                      )}
                    </div>
                    {item.mandatory && (
                      <Badge variant="destructive" className="text-xs">
                        Obligatoire
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={
                        incident.severity === 'critical' ? 'destructive' :
                        incident.severity === 'high' ? 'destructive' :
                        incident.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {incident.severity}
                      </Badge>
                      <Badge variant="outline">{incident.type}</Badge>
                    </div>
                    <p className="font-medium">{incident.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {incident.occurredAt.toLocaleString('fr-FR')}
                    </p>
                    {incident.penalty && (
                      <p className="text-sm font-medium text-red-600 mt-2">
                        Pénalité: {incident.penalty.toLocaleString()} {incident.currency}
                      </p>
                    )}
                  </div>
                  <Badge variant={
                    incident.status === 'resolved' ? 'default' :
                    incident.status === 'open' ? 'destructive' : 'secondary'
                  }>
                    {incident.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dubaï */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-[#F97316]">🇦🇪</span>
                  <span>Dubaï - Exigences Légales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Lois Applicables:</p>
                  <ul className="text-sm space-y-1">
                    {getRegionRequirements('dubai').laws.map((law, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{law}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Exigences Techniques:</p>
                  <div className="text-sm space-y-1">
                    <p><strong>Chiffrement:</strong> {getRegionRequirements('dubai').requirements.dataEncryption}</p>
                    <p><strong>Notification:</strong> {getRegionRequirements('dubai').requirements.breachNotification}</p>
                    <p><strong>Certification:</strong> {getRegionRequirements('dubai').complianceCertification}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kinshasa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-[#43A047]">🇨🇩</span>
                  <span>Kinshasa - Exigences Légales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Lois Applicables:</p>
                  <ul className="text-sm space-y-1">
                    {getRegionRequirements('kinshasa').laws.map((law, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{law}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Exigences Spécifiques:</p>
                  <div className="text-sm space-y-1">
                    <p><strong>Localisation:</strong> Obligatoire en RDC</p>
                    <p><strong>Consentement:</strong> Explicite requis</p>
                    <p><strong>Certification:</strong> {getRegionRequirements('kinshasa').complianceCertification}</p>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Hébergement des données utilisateurs locaux obligatoirement en RDC (sauf dérogation écrite)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperatorComplianceDashboard;
