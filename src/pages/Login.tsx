
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
      filename = 'Golden-El-Nobles-Installer.bat';
      content = `@echo off
title Golden El Nobles Cargo Services - Installateur Automatique
color 0A
echo.
echo ================================================
echo    Golden El Nobles Cargo Services
echo    Installateur Automatique Securise v2.0
echo ================================================
echo.

:: Verifier les privileges administrateur
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Privileges administrateur detectes
) else (
    echo [INFO] Privileges utilisateur standard detectes
    echo [INFO] Tentative d'installation sans privileges admin...
)

echo.
echo [ETAPE 1/4] Verification de Node.js...

:: Verifier si Node.js est installe
node --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js detecte: %NODE_VERSION%
    goto :install_deps
) else (
    echo [INFO] Node.js non detecte, installation automatique...
    goto :install_nodejs
)

:install_nodejs
echo.
echo [ETAPE 2/4] Telechargement de Node.js...

:: Creer le dossier temporaire
if not exist "%TEMP%\\golden-setup" mkdir "%TEMP%\\golden-setup"
cd /d "%TEMP%\\golden-setup"

:: Telecharger Node.js avec PowerShell (plus fiable)
echo [INFO] Telechargement en cours... (patientez)
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs.msi'}"

if not exist "nodejs.msi" (
    echo [ERREUR] Echec du telechargement de Node.js
    echo [SOLUTION] Verifiez votre connexion internet
    echo [ALTERNATIVE] Installez manuellement depuis: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Telechargement termine
echo.
echo [ETAPE 3/4] Installation de Node.js...
echo [INFO] Installation silencieuse en cours...

:: Installer Node.js silencieusement
msiexec /i "nodejs.msi" /quiet /norestart
if %errorlevel% == 0 (
    echo [OK] Node.js installe avec succes!
) else (
    echo [AVERTISSEMENT] Installation avec privileges limites
    echo [INFO] Tentative d'installation utilisateur...
    msiexec /i "nodejs.msi" /qn ALLUSERS=0
)

:: Actualiser les variables d'environnement
call refreshenv 2>nul
set "PATH=%PATH%;%ProgramFiles%\\nodejs;%APPDATA%\\npm"

:: Verifier l'installation
timeout /t 3 /nobreak >nul
node --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js %NODE_VERSION% operationnel!
) else (
    echo [AVERTISSEMENT] Redemarrage requis pour finaliser l'installation
    echo [INFO] Relancer ce script apres redemarrage
    pause
    exit /b 1
)

:: Nettoyer les fichiers temporaires
del /f /q "nodejs.msi" 2>nul

:install_deps
echo.
echo [ETAPE 4/4] Installation des dependances...
echo [INFO] Configuration de l'environnement...

:: Retourner au dossier de l'application
cd /d "%~dp0"

:: Verifier si npm est disponible
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] npm non detecte apres installation Node.js
    echo [SOLUTION] Redemarrez votre ordinateur et relancez ce script
    pause
    exit /b 1
)

echo [INFO] Installation des modules npm...
call npm install --silent
if %errorlevel% == 0 (
    echo [OK] Dependances installees!
) else (
    echo [AVERTISSEMENT] Quelques avertissements lors de l'installation
    echo [INFO] L'application devrait fonctionner normalement
)

echo.
echo [INFO] Creation du fichier de configuration...

:: Creer le fichier .env.local
(
echo VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ
) > .env.local

echo [OK] Configuration creee: .env.local

:: Creer un script de demarrage rapide
(
echo @echo off
echo title Golden El Nobles Cargo Services
echo echo Demarrage de l'application...
echo npm run dev
echo pause
) > "Demarrer-Application.bat"

echo [OK] Script de demarrage cree: Demarrer-Application.bat

echo.
echo ================================================
echo    INSTALLATION TERMINEE AVEC SUCCES!
echo ================================================
echo.
echo [DEMARRAGE] Options disponibles:
echo.
echo 1. Double-clic sur "Demarrer-Application.bat"
echo 2. Ou tapez: npm run dev
echo 3. Puis ouvrez: http://localhost:8080
echo.
echo [RESEAU] Pour acces reseau local:
echo    http://[VOTRE-IP]:8080
echo.
echo [SUPPORT] Golden El Nobles Cargo Services L.L.C
echo           Email: support@golden-el-nobles.com
echo.

:: Proposer de demarrer automatiquement
set /p START_NOW="Demarrer l'application maintenant? (O/N): "
if /i "%START_NOW%"=="O" (
    echo [INFO] Demarrage en cours...
    start "Golden El Nobles" cmd /k "npm run dev"
    timeout /t 5 /nobreak >nul
    start "http://localhost:8080"
)

echo.
echo Merci d'utiliser Golden El Nobles Cargo Services!
pause`;
    } else {
      filename = 'golden-el-nobles-installer.sh';
      content = `#!/bin/bash

# Golden El Nobles Cargo Services - Installateur Automatique
# Version: 2.0.0
# Éditeur: Golden El Nobles Cargo Services L.L.C

# Couleurs pour l'affichage
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo -e "\${GREEN}================================================\${NC}"
echo -e "\${CYAN}   Golden El Nobles Cargo Services\${NC}"
echo -e "\${GREEN}   Installateur Automatique Sécurisé v2.0\${NC}"
echo -e "\${GREEN}================================================\${NC}"
echo

# Détecter l'OS
detect_os() {
    if [[ "\\$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if [ -f /etc/debian-version ]; then
            DISTRO="debian"
        elif [ -f /etc/redhat-release ]; then
            DISTRO="redhat"
        elif [ -f /etc/arch-release ]; then
            DISTRO="arch"
        else
            DISTRO="unknown"
        fi
    elif [[ "\\$OSTYPE" == "darwin"* ]]; then
        OS="mac"
        DISTRO="mac"
    else
        OS="unknown"
        DISTRO="unknown"
    fi
    
    echo -e "\${BLUE}[INFO]\${NC} Système détecté: \\$OS (\\$DISTRO)"
}

# Installer Node.js automatiquement
install_nodejs() {
    echo -e "\${YELLOW}[ETAPE 2/4]\${NC} Installation de Node.js..."
    
    case \\$DISTRO in
        "debian")
            echo -e "\${BLUE}[INFO]\${NC} Installation via apt..."
            sudo apt update -qq
            sudo apt install -y curl
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt install -y nodejs
            ;;
        "redhat")
            echo -e "\${BLUE}[INFO]\${NC} Installation via yum/dnf..."
            if command -v dnf &> /dev/null; then
                sudo dnf install -y curl
                curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
                sudo dnf install -y nodejs npm
            else
                sudo yum install -y curl
                curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
                sudo yum install -y nodejs npm
            fi
            ;;
        "arch")
            echo -e "\${BLUE}[INFO]\${NC} Installation via pacman..."
            sudo pacman -Sy --noconfirm nodejs npm
            ;;
        "mac")
            echo -e "\${BLUE}[INFO]\${NC} Installation via Homebrew..."
            if ! command -v brew &> /dev/null; then
                echo -e "\${YELLOW}[INFO]\${NC} Installation de Homebrew..."
                /bin/bash -c "\\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew install node
            ;;
        *)
            echo -e "\${RED}[ERREUR]\${NC} Distribution non supportée pour l'installation automatique"
            echo -e "\${YELLOW}[SOLUTION]\${NC} Installez manuellement depuis: https://nodejs.org"
            exit 1
            ;;
    esac
}

# Vérifier Node.js
check_nodejs() {
    echo -e "\${YELLOW}[ETAPE 1/4]\${NC} Vérification de Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=\\$(node --version)
        echo -e "\${GREEN}[OK]\${NC} Node.js détecté: \\$NODE_VERSION"
        return 0
    else
        echo -e "\${YELLOW}[INFO]\${NC} Node.js non détecté, installation automatique..."
        return 1
    fi
}

# Installer les dépendances
install_dependencies() {
    echo -e "\${YELLOW}[ETAPE 3/4]\${NC} Installation des dépendances..."
    
    if ! command -v npm &> /dev/null; then
        echo -e "\${RED}[ERREUR]\${NC} npm non détecté après installation Node.js"
        exit 1
    fi
    
    echo -e "\${BLUE}[INFO]\${NC} Installation des modules npm..."
    if npm install --silent; then
        echo -e "\${GREEN}[OK]\${NC} Dépendances installées!"
    else
        echo -e "\${YELLOW}[AVERTISSEMENT]\${NC} Quelques avertissements lors de l'installation"
        echo -e "\${BLUE}[INFO]\${NC} L'application devrait fonctionner normalement"
    fi
}

# Configuration
setup_config() {
    echo -e "\${YELLOW}[ETAPE 4/4]\${NC} Configuration de l'environnement..."
    
    # Créer le fichier .env.local
    cat > .env.local << EOL
VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ
EOL

    echo -e "\${GREEN}[OK]\${NC} Configuration créée: .env.local"
    
    # Créer un script de démarrage
    cat > start-app.sh << 'EOL'
#!/bin/bash
echo "Démarrage de Golden El Nobles Cargo Services..."
npm run dev
EOL
    
    chmod +x start-app.sh
    echo -e "\${GREEN}[OK]\${NC} Script de démarrage créé: start-app.sh"
}

# Script principal
main() {
    detect_os
    
    if ! check_nodejs; then
        install_nodejs
        
        # Vérifier l'installation
        if command -v node &> /dev/null; then
            NODE_VERSION=\\$(node --version)
            echo -e "\${GREEN}[OK]\${NC} Node.js \\$NODE_VERSION opérationnel!"
        else
            echo -e "\${RED}[ERREUR]\${NC} Échec de l'installation de Node.js"
            exit 1
        fi
    fi
    
    install_dependencies
    setup_config
    
    echo
    echo -e "\${GREEN}================================================\${NC}"
    echo -e "\${GREEN}   INSTALLATION TERMINÉE AVEC SUCCÈS!\${NC}"
    echo -e "\${GREEN}================================================\${NC}"
    echo
    echo -e "\${YELLOW}[DÉMARRAGE]\${NC} Options disponibles:"
    echo
    echo -e "1. Tapez: \${CYAN}./start-app.sh\${NC}"
    echo -e "2. Ou tapez: \${CYAN}npm run dev\${NC}"
    echo -e "3. Puis ouvrez: \${CYAN}http://localhost:8080\${NC}"
    echo
    echo -e "\${YELLOW}[RÉSEAU]\${NC} Pour accès réseau local:"
    echo -e "   \${CYAN}http://[VOTRE-IP]:8080\${NC}"
    echo
    echo -e "\${YELLOW}[SUPPORT]\${NC} Golden El Nobles Cargo Services L.L.C"
    echo -e "          Email: support@golden-el-nobles.com"
    echo
    
    # Proposer de démarrer automatiquement
    read -p "Démarrer l'application maintenant? (o/N): " start_now
    if [[ "\\$start_now" =~ ^[Oo]\\$ ]]; then
        echo -e "\${BLUE}[INFO]\${NC} Démarrage en cours..."
        npm run dev &
        sleep 3
        
        # Ouvrir le navigateur
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8080
        elif command -v open &> /dev/null; then
            open http://localhost:8080
        fi
    fi
    
    echo
    echo -e "\${GREEN}Merci d'utiliser Golden El Nobles Cargo Services!\${NC}"
}

# Exécuter le script principal
main

# Rendre le script exécutable
chmod +x "\\$0"`;
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

    // Afficher les instructions
    if (platform === 'windows') {
      setTimeout(() => {
        alert(`🚀 INSTALLATEUR AUTOMATIQUE WINDOWS

✅ NOUVELLE VERSION AMÉLIORÉE:
- Télécharge et installe Node.js automatiquement
- Installation silencieuse sans intervention
- Détection automatique des privilèges
- Script de démarrage inclus

📋 INSTRUCTIONS:
1. Clic droit sur le fichier → "Exécuter en tant qu'administrateur"
2. Ou double-clic simple (installation utilisateur)
3. Laissez l'installateur faire le travail automatiquement

⚡ PLUS BESOIN D'INSTALLER NODEJS MANUELLEMENT!
Le script s'occupe de tout automatiquement.`);
      }, 1000);
    } else {
      setTimeout(() => {
        alert(`🚀 INSTALLATEUR AUTOMATIQUE LINUX/MAC

✅ FONCTIONNALITÉS:
- Détection automatique de votre distribution
- Installation automatique de Node.js
- Support Ubuntu, CentOS, Arch, macOS
- Configuration automatique complète

📋 INSTRUCTIONS:
1. Ouvrir un terminal
2. Naviguer vers le dossier du fichier
3. chmod +x golden-el-nobles-installer.sh
4. ./golden-el-nobles-installer.sh

⚡ INSTALLATION ENTIÈREMENT AUTOMATISÉE!`);
      }, 1000);
    }
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
