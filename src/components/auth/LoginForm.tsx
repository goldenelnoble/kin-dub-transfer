
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ArrowRight, Shield, Zap } from "lucide-react";

export function LoginForm() {
  const { instantLogin, adminAutoLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInstantLogin = async () => {
    console.log('Attempting instant login without credentials...');
    const success = await instantLogin();
    if (success) {
      console.log('Instant login successful, navigating to dashboard...');
      navigate("/dashboard");
    }
  };

  const handleAdminAutoLogin = async () => {
    console.log('Attempting admin auto login...');
    const success = await adminAutoLogin();
    if (success) {
      console.log('Admin auto login successful, navigating to home page...');
      navigate("/");
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-4 pb-6">
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Accès Instantané
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Connexion immédiate sans mot de passe
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Instant Login Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleInstantLogin}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Zap className="h-6 w-6" />
                <span>Connexion Instantanée</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
          <p className="text-sm text-center text-gray-600">
            Accès direct sans aucune authentification
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou</span>
          </div>
        </div>

        {/* Admin Auto Login Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleAdminAutoLogin}
            className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>Connexion Admin Rapide</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-xs text-center text-gray-500">
            Connexion automatique pour l'administrateur
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-6">
        <p className="text-xs text-center text-gray-500 w-full leading-relaxed">
          Système de connexion sans sécurité - Accès libre pour tous les utilisateurs
        </p>
      </CardFooter>
    </Card>
  );
}
