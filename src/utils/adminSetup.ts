
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

    // First, check if admin already exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminCredentials.email,
      password: adminCredentials.password,
    });

    if (!signInError && signInData.user) {
      console.log('Admin user already exists and can login');
      // Sign out immediately after checking
      await supabase.auth.signOut();
      return adminCredentials;
    }

    console.log('Admin user does not exist or cannot login, creating new one...');

    // Try to create the user with admin service key approach
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminCredentials.email,
      password: adminCredentials.password,
      options: {
        data: { 
          name: adminCredentials.name 
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (authError) {
      console.error('Error creating admin user:', authError);
      
      // If user already exists, try to fix their profile
      if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
        console.log('User already exists, attempting to fix profile...');
        
        // Try to promote existing user
        const { data: promoteData, error: promoteError } = await supabase.rpc(
          'promote_user_to_admin', 
          { user_email: adminCredentials.email }
        );

        if (!promoteError && promoteData) {
          console.log('Existing user successfully promoted to admin');
          return adminCredentials;
        }
      }
      
      return null;
    }

    if (!authData.user) {
      console.error('No user data returned from signup');
      return null;
    }

    console.log('Admin user created with ID:', authData.user.id);

    // Sign out the newly created user
    await supabase.auth.signOut();

    // Wait for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Now promote the user to admin using our SQL function
    const { data: promoteData, error: promoteError } = await supabase.rpc(
      'promote_user_to_admin', 
      { user_email: adminCredentials.email }
    );

    if (promoteError) {
      console.error('Error promoting user to admin:', promoteError);
      
      // Try to manually create the profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          name: adminCredentials.name,
          role: 'admin',
          is_active: true
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return null;
      }
    }

    console.log('Admin user created and promoted successfully');
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
