
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
      filename = 'Golden-El-Nobles-Setup.ps1';
      content = `# Golden El Nobles Cargo Services - Installation Sécurisée
# Certificat de sécurité: Approuvé pour installation locale
# Version: 1.0.0
# Éditeur: Golden El Nobles Cargo Services L.L.C

# Définir la politique d'exécution pour ce script uniquement
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

Write-Host "================================" -ForegroundColor Green
Write-Host "Golden El Nobles Cargo Services" -ForegroundColor Yellow
Write-Host "Installation Sécurisée v1.0.0" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Vérifier les privilèges administrateur
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ATTENTION: Il est recommandé d'exécuter en tant qu'administrateur" -ForegroundColor Yellow
    Write-Host "Continuer quand même? (O/N): " -NoNewline -ForegroundColor Cyan
    $response = Read-Host
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "Installation annulée par l'utilisateur." -ForegroundColor Red
        exit 1
    }
}

# Vérifier Node.js
Write-Host "Vérification de Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js détecté: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js non trouvé"
    }
} catch {
    Write-Host "✗ ERREUR: Node.js n'est pas installé." -ForegroundColor Red
    Write-Host "Téléchargement automatique depuis https://nodejs.org..." -ForegroundColor Yellow
    
    # Télécharger Node.js automatiquement
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $nodeInstaller = "$env:TEMP\\nodejs-installer.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
        Write-Host "Lancement de l'installation de Node.js..." -ForegroundColor Green
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $nodeInstaller, "/quiet" -Wait
        Write-Host "✓ Node.js installé avec succès!" -ForegroundColor Green
        Remove-Item $nodeInstaller -Force
    } catch {
        Write-Host "Impossible de télécharger Node.js automatiquement." -ForegroundColor Red
        Write-Host "Veuillez installer manuellement depuis: https://nodejs.org" -ForegroundColor Yellow
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}

Write-Host ""
Write-Host "Installation des dépendances..." -ForegroundColor Cyan

# Installer les dépendances avec gestion d'erreur améliorée
try {
    & npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dépendances installées avec succès!" -ForegroundColor Green
    } else {
        throw "Erreur lors de l'installation des dépendances"
    }
} catch {
    Write-Host "✗ ERREUR: Échec de l'installation des dépendances" -ForegroundColor Red
    Write-Host "Vérifiez votre connexion internet et réessayez." -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""
Write-Host "Configuration de l'environnement..." -ForegroundColor Cyan

# Créer le fichier de configuration de manière sécurisée
$envContent = @"
VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ
"@

try {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8 -Force
    Write-Host "✓ Configuration créée: .env.local" -ForegroundColor Green
} catch {
    Write-Host "✗ Erreur lors de la création du fichier de configuration" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Installation terminée avec succès!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour démarrer l'application:" -ForegroundColor Yellow
Write-Host "1. Ouvrez PowerShell ou l'invite de commande dans ce dossier" -ForegroundColor White
Write-Host "2. Tapez: npm run dev" -ForegroundColor Cyan
Write-Host "3. Ouvrez votre navigateur à l'adresse: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour accès réseau, l'application sera accessible via:" -ForegroundColor Yellow
Write-Host "http://[VOTRE-IP]:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "© 2023 Golden El Nobles Cargo Services L.L.C" -ForegroundColor Gray
Write-Host ""

# Demander si l'utilisateur veut démarrer automatiquement
Write-Host "Démarrer l'application maintenant? (O/N): " -NoNewline -ForegroundColor Cyan
$startNow = Read-Host
if ($startNow -eq "O" -or $startNow -eq "o") {
    Write-Host "Démarrage de l'application..." -ForegroundColor Green
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:8080"
}

Read-Host "Appuyez sur Entrée pour quitter"`;
    } else {
      filename = 'golden-el-nobles-setup.sh';
      content = `#!/bin/bash

# Golden El Nobles Cargo Services - Installation Sécurisée
# Version: 1.0.0
# Éditeur: Golden El Nobles Cargo Services L.L.C

echo "================================"
echo "Golden El Nobles Cargo Services"
echo "Installation Sécurisée v1.0.0"
echo "================================"
echo

# Fonction de vérification des privilèges
check_privileges() {
    if [ "$EUID" -eq 0 ]; then
        echo "⚠️  Attention: Exécution en tant que root détectée"
        echo "Il est recommandé d'exécuter ce script avec un utilisateur normal."
        read -p "Continuer quand même? (o/N): " response
        if [[ ! "$response" =~ ^[Oo]$ ]]; then
            echo "Installation annulée."
            exit 1
        fi
    fi
}

# Vérifier les privilèges
check_privileges

# Détecter l'OS
OSValue="$(uname -s)"
case "\${OSValue}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:\${OSValue}"
esac

echo "Système détecté: \$MACHINE"
echo

# Vérifier Node.js
echo "Vérification de Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js détecté: $NODE_VERSION"
else
    echo "✗ ERREUR: Node.js n'est pas installé."
    echo "Installation automatique de Node.js..."
    
    if [[ "$MACHINE" == "Mac" ]]; then
        if command -v brew &> /dev/null; then
            brew install node
        else
            echo "Homebrew non trouvé. Veuillez installer Node.js manuellement."
            echo "https://nodejs.org/en/download/"
            exit 1
        fi
    elif [[ "$MACHINE" == "Linux" ]]; then
        if command -v apt &> /dev/null; then
            sudo apt update && sudo apt install -y nodejs npm
        elif command -v yum &> /dev/null; then
            sudo yum install -y nodejs npm
        elif command -v pacman &> /dev/null; then
            sudo pacman -S nodejs npm
        else
            echo "Gestionnaire de paquets non supporté."
            echo "Veuillez installer Node.js manuellement: https://nodejs.org"
            exit 1
        fi
    fi
    
    # Vérifier l'installation
    if command -v node &> /dev/null; then
        echo "✓ Node.js installé avec succès!"
    else
        echo "✗ Échec de l'installation de Node.js"
        exit 1
    fi
fi

echo
echo "Installation des dépendances..."

# Installer les dépendances avec gestion d'erreur
if npm install; then
    echo "✓ Dépendances installées avec succès!"
else
    echo "✗ ERREUR: Échec de l'installation des dépendances"
    echo "Vérifiez votre connexion internet et réessayez."
    exit 1
fi

echo
echo "Configuration de l'environnement..."

# Créer le fichier de configuration
cat > .env.local << EOL
VITE_SUPABASE_URL=https://lgrjdbrzlgfmrrvisgrs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncmpkYnJ6bGdmbXJydmlzZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTI1OTMsImV4cCI6MjA2NzI4ODU5M30.4XXmZbIDTYb_G80OLOt2NvMF2o_HaJhRqc3p7PW4bEQ
EOL

if [ $? -eq 0 ]; then
    echo "✓ Configuration créée: .env.local"
else
    echo "✗ Erreur lors de la création du fichier de configuration"
    exit 1
fi

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
echo "© 2023 Golden El Nobles Cargo Services L.L.C"
echo

# Demander si l'utilisateur veut démarrer automatiquement
read -p "Démarrer l'application maintenant? (o/N): " start_now
if [[ "$start_now" =~ ^[Oo]$ ]]; then
    echo "Démarrage de l'application..."
    npm run dev &
    sleep 3
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8080
    elif command -v open &> /dev/null; then
        open http://localhost:8080
    fi
fi

# Rendre le script exécutable
chmod +x "$0"`;
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

    // Afficher les instructions de sécurité
    if (platform === 'windows') {
      setTimeout(() => {
        alert(`📋 INSTRUCTIONS DE SÉCURITÉ WINDOWS:

1. Clic droit sur le fichier téléchargé
2. Sélectionnez "Propriétés"
3. Cochez "Débloquer" si présent
4. Clic droit → "Exécuter avec PowerShell"

OU

1. Ouvrez PowerShell en tant qu'administrateur
2. Tapez: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
3. Confirmez avec "O"
4. Exécutez le script

Le script est sécurisé et approuvé par Golden El Nobles Cargo Services L.L.C.`);
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
