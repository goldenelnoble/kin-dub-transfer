# Golden El Nobles Cargo Services - Guide d'Installation Locale

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Connexion internet stable

## Instructions d'Installation

### 1. Téléchargement
Téléchargez le fichier setup depuis l'application ou clonez le projet :
```bash
git clone https://github.com/votre-repo/golden-el-nobles-cargo.git
cd golden-el-nobles-cargo
```

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration
Créez un fichier `.env.local` avec les variables d'environnement :
```
VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ
```

### 4. Lancement de l'application
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:8080`

## Fonctionnement en Réseau

L'application est conçue pour fonctionner en réseau local tout en maintenant une connexion internet pour :
- Synchronisation des données en temps réel
- Authentification des utilisateurs
- Sauvegarde des transactions

### Configuration Réseau
Pour permettre l'accès depuis d'autres machines du réseau :

1. Modifiez le fichier `vite.config.ts` :
```typescript
server: {
  host: "0.0.0.0", // Permet l'accès depuis le réseau
  port: 8080,
}
```

2. Lancez avec : `npm run dev`
3. Accédez depuis d'autres machines via : `http://[IP-DU-SERVEUR]:8080`

## Maintenance de la Connexion

L'application maintient automatiquement :
- Connexion WebSocket pour les mises à jour en temps réel
- Reconnexion automatique en cas de perte de réseau
- Synchronisation des données offline/online

## Production

Pour déployer en production :
```bash
npm run build
npm run preview
```

## Support

Pour toute assistance technique, contactez l'équipe de développement.