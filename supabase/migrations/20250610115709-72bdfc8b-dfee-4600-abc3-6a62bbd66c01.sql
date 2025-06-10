
-- Créer un utilisateur admin via le système d'authentification Supabase
-- Utiliser la fonction auth.admin.createUser pour créer l'utilisateur avec email et mot de passe

-- Premièrement, nous devons créer l'utilisateur via l'API auth de Supabase
-- Cela doit être fait via le code de l'application, pas via SQL direct

-- Une fois l'utilisateur créé, le trigger handle_new_user() créera automatiquement
-- le profil dans user_profiles avec le rôle par défaut 'operator'

-- Nous devrons ensuite mettre à jour le rôle vers 'admin'
-- Cette requête sera exécutée après la création de l'utilisateur

-- Pour l'instant, créons une fonction qui nous permettra de promouvoir un utilisateur existant en admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Trouver l'UUID de l'utilisateur par email dans auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RETURN false;
    END IF;
    
    -- Mettre à jour le rôle vers admin
    UPDATE public.user_profiles 
    SET role = 'admin'::user_role,
        updated_at = now()
    WHERE id = user_uuid;
    
    RETURN true;
END;
$$;
