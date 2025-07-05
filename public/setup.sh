#!/bin/bash

echo "================================"
echo "Golden El Nobles Cargo Services"
echo "Installation Setup"
echo "================================"
echo

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé."
    echo "Veuillez télécharger et installer Node.js depuis https://nodejs.org"
    exit 1
fi

echo "Node.js détecté..."
echo "Installation des dépendances..."
echo

# Installer les dépendances
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Échec de l'installation des dépendances"
    exit 1
fi

echo
echo "Configuration de l'environnement..."

# Créer le fichier de configuration
cat > .env.local << EOL
VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ
EOL

echo
echo "================================"
echo "Installation terminée avec succès!"
echo "================================"
echo
echo "Pour démarrer l'application:"
echo "1. Ouvrez un terminal dans ce dossier"
echo "2. Tapez: npm run dev"
echo "3. Ouvrez votre navigateur à l'adresse: http://localhost:8080"
echo
echo "Pour accès réseau, l'application sera accessible via:"
echo "http://[VOTRE-IP]:8080"
echo

# Rendre le script exécutable
chmod +x setup.sh