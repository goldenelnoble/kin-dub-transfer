
import { supabase } from "@/integrations/supabase/client";

export interface AdminCredentials {
  email: string;
  password: string;
  name: string;
}

export const createAdminUser = async (): Promise<AdminCredentials | null> => {
  try {
    // Default admin credentials
    const adminCredentials: AdminCredentials = {
      email: "admin@goldennoblescargoai.com",
      password: "Admin123!",
      name: "Administrateur Principal"
    };

    console.log('Creating admin user with email:', adminCredentials.email);

    // Try to create the user directly
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminCredentials.email,
      password: adminCredentials.password,
      options: {
        data: { 
          name: adminCredentials.name 
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      
      // If user already exists, that's fine - they can still use the existing credentials
      if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
        console.log('User already exists, returning existing credentials...');
        return adminCredentials;
      }
      
      return null;
    }

    if (!authData.user) {
      console.error('No user data returned from signup');
      return null;
    }

    console.log('Admin user created with ID:', authData.user.id);

    // Wait a moment for the profile to be created by the trigger
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Admin user created successfully');
    return adminCredentials;

  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return null;
  }
};

export const displayAdminCredentials = (credentials: AdminCredentials) => {
  const message = `
🎉 UTILISATEUR ADMIN CRÉÉ AVEC SUCCÈS 🎉

📧 Email: ${credentials.email}
🔐 Mot de passe: ${credentials.password}
👤 Nom: ${credentials.name}

Vous pouvez maintenant vous connecter avec ces identifiants.
`;
  
  console.log(message);
  
  return {
    title: "Utilisateur Admin Créé",
    message: `Un compte administrateur a été créé avec succès.\n\nEmail: ${credentials.email}\nMot de passe: ${credentials.password}\n\nVous pouvez maintenant vous connecter avec ces identifiants.`
  };
};
