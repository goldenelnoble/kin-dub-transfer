
-- First, let's add the identifier column if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS identifier TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_user_profiles_identifier ON public.user_profiles(identifier);

-- Find the existing admin user and update their identifier
UPDATE public.user_profiles 
SET identifier = 'NGOMA',
    role = 'admin'::user_role,
    is_active = true
WHERE role = 'admin'::user_role
  AND identifier IS NULL
  AND id = (SELECT id FROM public.user_profiles WHERE role = 'admin'::user_role AND identifier IS NULL ORDER BY created_at ASC LIMIT 1);

-- If no admin exists, let's check if there's any user we can promote
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  -- If no user has the NGOMA identifier yet, find the first user and set it
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE identifier = 'NGOMA') THEN
    SELECT id INTO first_user_id 
    FROM public.user_profiles 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      UPDATE public.user_profiles 
      SET identifier = 'NGOMA',
          role = 'admin'::user_role,
          is_active = true
      WHERE id = first_user_id;
    END IF;
  END IF;
END $$;

-- Create authentication function that works with identifiers
CREATE OR REPLACE FUNCTION public.authenticate_with_identifier(
  p_identifier TEXT,
  p_password TEXT  
) RETURNS TABLE(user_id uuid, email text, role text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    up.role::text
  FROM auth.users au
  JOIN public.user_profiles up ON au.id = up.id
  WHERE up.identifier = p_identifier
    AND up.is_active = true;
END;
$$;
