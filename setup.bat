@echo off
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
pause