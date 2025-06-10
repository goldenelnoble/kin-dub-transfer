
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

    // First, check if the user already exists in user_profiles
    const { data: existingUsers, error: checkError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('name', adminCredentials.name)
      .limit(1);

    if (checkError) {
      console.error('Error checking for existing admin:', checkError);
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('Admin user already exists');
      return adminCredentials;
    }

    // Create the user using normal signup (this works with anon key)
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
      console.error('Error creating admin user:', authError);
      
      // Check if user already exists
      if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
        console.log('User already exists, attempting to promote...');
        
        // Try to promote existing user
        const { data: promoteData, error: promoteError } = await supabase.rpc(
          'promote_user_to_admin', 
          { user_email: adminCredentials.email }
        );

        if (promoteError) {
          console.error('Error promoting existing user to admin:', promoteError);
          return null;
        }

        if (promoteData) {
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

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Now promote the user to admin using our SQL function
    const { data: promoteData, error: promoteError } = await supabase.rpc(
      'promote_user_to_admin', 
      { user_email: adminCredentials.email }
    );

    if (promoteError) {
      console.error('Error promoting user to admin:', promoteError);
      return null;
    }

    if (!promoteData) {
      console.error('Failed to promote user to admin - user not found');
      return null;
    }

    console.log('User successfully promoted to admin');
    return adminCredentials;

  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return null;
  }
};

export const displayAdminCredentials = (credentials: AdminCredentials) => {
  console.log('\n=== ADMIN USER CREATED SUCCESSFULLY ===');
  console.log('Email:', credentials.email);
  console.log('Password:', credentials.password);
  console.log('Name:', credentials.name);
  console.log('========================================\n');
  
  return {
    title: "Utilisateur Admin Créé",
    message: `Un compte administrateur a été créé avec succès.\n\nEmail: ${credentials.email}\nMot de passe: ${credentials.password}\n\nVous pouvez maintenant vous connecter avec ces identifiants.`
  };
};
