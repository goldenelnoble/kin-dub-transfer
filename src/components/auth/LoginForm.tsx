
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Lock, Mail, User, ArrowRight, Key, Shield } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [isLogin, setIsLogin] = useState(true);
  const { login, loginWithIdentifier, register, adminAutoLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted:', { email, identifier, isLogin, activeTab });
    
    let success = false;
    if (isLogin) {
      if (activeTab === "email") {
        console.log('Attempting email login...');
        success = await login(email, password);
      } else {
        console.log('Attempting identifier login...');
        success = await loginWithIdentifier(identifier, password);
      }
      console.log('Login result:', success);
    } else {
      console.log('Attempting registration...');
      success = await register(email, password, name);
      console.log('Registration result:', success);
    }
    
    if (success && isLogin) {
      console.log('Login successful, navigating to dashboard...');
      navigate("/dashboard");
    }
    
    // For registration, user needs to verify email first
    if (success && !isLogin) {
      console.log('Registration successful, switching to login tab...');
      setIsLogin(true); // Switch back to login tab
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    }
  };

  const handleAdminAutoLogin = async () => {
    console.log('Attempting admin auto login...');
    const success = await adminAutoLogin();
    if (success) {
      console.log('Admin auto login successful, navigating to dashboard...');
      navigate("/dashboard");
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-4 pb-6">
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {isLogin ? "Bienvenue" : "Créer un compte"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            {isLogin 
              ? "Connectez-vous à votre espace de gestion" 
              : "Rejoignez notre plateforme de transferts"
            }
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Admin Auto Login Button */}
        <div className="mb-6">
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
          <p className="text-xs text-center text-gray-500 mt-2">
            Connexion automatique pour l'administrateur
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou connexion manuelle</span>
          </div>
        </div>

        <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger 
              value="login" 
              className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Inscription
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-6">
            {/* Login method selector */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-orange-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="email" 
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="identifier"
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Identifiant
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="identifier">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-gray-700 font-medium">Identifiant</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Votre identifiant"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-identifier" className="text-gray-700 font-medium">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password-identifier"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-gray-700 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password-register"
                    type="password"
                    placeholder="Minimum 6 caractères"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-6">
        <p className="text-xs text-center text-gray-500 w-full leading-relaxed">
          En utilisant cette application, vous acceptez nos{" "}
          <span className="text-orange-600 hover:underline cursor-pointer">conditions d'utilisation</span>{" "}
          et notre{" "}
          <span className="text-orange-600 hover:underline cursor-pointer">politique de confidentialité</span>.
        </p>
      </CardFooter>
    </Card>
  );
}
