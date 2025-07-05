-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'supervisor', 'operator', 'auditor');

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'operator',
  is_active BOOLEAN NOT NULL DEFAULT true,
  identifier TEXT UNIQUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create senders table
CREATE TABLE public.senders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_number TEXT NOT NULL,
  id_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipients table
CREATE TABLE public.recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  txn_id TEXT NOT NULL UNIQUE,
  amount DECIMAL NOT NULL,
  receiving_amount DECIMAL NOT NULL,
  currency TEXT NOT NULL,
  commission_percentage DECIMAL NOT NULL,
  commission_amount DECIMAL NOT NULL,
  fees DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  payment_method TEXT NOT NULL,
  mobile_money_network TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  direction TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  sender_id UUID REFERENCES public.senders(id),
  recipient_id UUID REFERENCES public.recipients(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "System can insert profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);

-- Create RLS policies for senders
CREATE POLICY "Authenticated users can view senders" ON public.senders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create senders" ON public.senders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update senders" ON public.senders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete senders" ON public.senders FOR DELETE TO authenticated USING (true);

-- Create RLS policies for recipients
CREATE POLICY "Authenticated users can view recipients" ON public.recipients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create recipients" ON public.recipients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update recipients" ON public.recipients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete recipients" ON public.recipients FOR DELETE TO authenticated USING (true);

-- Create RLS policies for transactions
CREATE POLICY "Authenticated users can view transactions" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update transactions" ON public.transactions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete transactions" ON public.transactions FOR DELETE TO authenticated USING (true);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email, 'Utilisateur'),
    'operator',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for authentication with identifier
CREATE OR REPLACE FUNCTION public.authenticate_with_identifier(
  p_identifier TEXT,
  p_password TEXT
)
RETURNS TABLE(email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT au.email::TEXT
  FROM auth.users au
  JOIN public.user_profiles up ON au.id = up.id
  WHERE up.identifier = p_identifier
    AND up.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_senders_updated_at
  BEFORE UPDATE ON public.senders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipients_updated_at
  BEFORE UPDATE ON public.recipients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin user profile
INSERT INTO public.user_profiles (id, name, role, is_active, identifier)
SELECT 
  id,
  'Administrateur NGOMA',
  'admin'::user_role,
  true,
  'NGOMA'
FROM auth.users
WHERE email = 'admin@golden-el-nobles.com'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  identifier = EXCLUDED.identifier;