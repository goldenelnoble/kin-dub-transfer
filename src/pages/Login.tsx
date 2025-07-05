
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, isLoading } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const downloadSetupFile = (platform: 'windows' | 'linux') => {
    let content: string;
    let filename: string;

    if (platform === 'windows') {
      filename = 'setup.bat';
      content = `@echo off
echo ================================
echo Golden El Nobles Cargo Services
echo Installation Setup
echo ================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé.
    echo Veuillez télécharger et installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo Node.js détecté...
echo Installation des dépendances...
echo.

REM Installer les dépendances
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Échec de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo Configuration de l'environnement...

REM Créer le fichier de configuration
echo VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co > .env.local
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ >> .env.local

echo.
echo ================================
echo Installation terminée avec succès!
echo ================================
echo.
echo Pour démarrer l'application:
echo 1. Ouvrez une invite de commande dans ce dossier
echo 2. Tapez: npm run dev
echo 3. Ouvrez votre navigateur à l'adresse: http://localhost:8080
echo.
echo Pour accès réseau, l'application sera accessible via:
echo http://[VOTRE-IP]:8080
echo.
pause`;
    } else {
      filename = 'setup.sh';
      content = `#!/bin/bash

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
chmod +x setup.sh`;
    }

    // Créer et télécharger le fichier
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10% left-10% w-72 h-72 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20% right-15% w-96 h-96 bg-gradient-to-tl from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-50% left-80% w-64 h-64 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        {/* Left side - Logo and branding */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="flex flex-col items-center lg:items-start space-y-6">
            {/* Logo plus grand et plus visible */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 rounded-3xl blur-xl opacity-20 scale-110"></div>
              <img 
                src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
                alt="Golden El Nobles Cargo" 
                className="relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-2xl shadow-2xl ring-4 ring-white/50" 
              />
            </div>
            
            {/* Titre principal modernisé sans redondance */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
                Golden El Nobles
                <span className="block text-3xl md:text-4xl lg:text-5xl mt-2">Services</span>
              </h1>
              
              {/* Nom complet de l'entreprise */}
              <div className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 mb-4">
                GOLDEN EL NOBLES CARGO SERVICES L.L.C
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-emerald-700">
                  Gestion de Transferts d'Argent
                </h2>
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-lg md:text-xl text-orange-600 font-medium">
                  <span>Kinshasa</span>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                  <span>Dubaï</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features highlights */}
          <div className="hidden lg:block space-y-4 text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <span>Transferts sécurisés et rapides</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <span>Suivi en temps réel</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <span>Service client 24/7</span>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 max-w-md w-full space-y-6">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-2xl border border-white/50 p-1">
            <LoginForm />
          </div>
        </div>
      </div>
      
      {/* Download Setup Section */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={() => downloadSetupFile('windows')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Setup Windows</span>
            </button>
            <button
              onClick={() => downloadSetupFile('linux')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Setup Linux/Mac</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Téléchargez le setup pour installer l'application en local
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-500 text-center">
          © 2023 Golden El Nobles Cargo Services L.L.C. Tous droits réservés. @merveille_ngoma
        </p>
      </div>
    </div>
  );
};

export default Login;
