
-- Activer RLS sur les tables qui n'en ont pas encore (si elles n'ont pas déjà RLS activé)
DO $$
BEGIN
    -- Vérifier et activer RLS pour senders
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'senders' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE public.senders ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Vérifier et activer RLS pour recipients
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'recipients' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Vérifier et activer RLS pour transactions
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'transactions' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Politiques RLS pour senders (créer seulement si elles n'existent pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'senders' AND policyname = 'All authenticated users can view senders') THEN
        CREATE POLICY "All authenticated users can view senders" 
          ON public.senders 
          FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'senders' AND policyname = 'All authenticated users can create senders') THEN
        CREATE POLICY "All authenticated users can create senders" 
          ON public.senders 
          FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'senders' AND policyname = 'Supervisors and admins can update senders') THEN
        CREATE POLICY "Supervisors and admins can update senders" 
          ON public.senders 
          FOR UPDATE 
          TO authenticated 
          USING (public.get_current_user_role() IN ('admin', 'supervisor'));
    END IF;
END
$$;

-- Politiques RLS pour recipients
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recipients' AND policyname = 'All authenticated users can view recipients') THEN
        CREATE POLICY "All authenticated users can view recipients" 
          ON public.recipients 
          FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recipients' AND policyname = 'All authenticated users can create recipients') THEN
        CREATE POLICY "All authenticated users can create recipients" 
          ON public.recipients 
          FOR INSERT 
          TO authenticated 
          WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'recipients' AND policyname = 'Supervisors and admins can update recipients') THEN
        CREATE POLICY "Supervisors and admins can update recipients" 
          ON public.recipients 
          FOR UPDATE 
          TO authenticated 
          USING (public.get_current_user_role() IN ('admin', 'supervisor'));
    END IF;
END
$$;

-- Politiques RLS pour transactions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'All authenticated users can view transactions') THEN
        CREATE POLICY "All authenticated users can view transactions" 
          ON public.transactions 
          FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Operators can create transactions') THEN
        CREATE POLICY "Operators can create transactions" 
          ON public.transactions 
          FOR INSERT 
          TO authenticated 
          WITH CHECK (public.get_current_user_role() IN ('admin', 'supervisor', 'operator'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Supervisors and admins can update transactions') THEN
        CREATE POLICY "Supervisors and admins can update transactions" 
          ON public.transactions 
          FOR UPDATE 
          TO authenticated 
          USING (public.get_current_user_role() IN ('admin', 'supervisor'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions' AND policyname = 'Only admins can delete transactions') THEN
        CREATE POLICY "Only admins can delete transactions" 
          ON public.transactions 
          FOR DELETE 
          TO authenticated 
          USING (public.get_current_user_role() = 'admin');
    END IF;
END
$$;

-- Ajouter des contraintes de validation (avec vérification d'existence)
DO $$
BEGIN
    -- Contrainte pour montant positif
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_positive_amount') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT check_positive_amount CHECK (amount > 0);
    END IF;
    
    -- Contrainte pour frais positifs
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_positive_fees') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT check_positive_fees CHECK (fees >= 0);
    END IF;
    
    -- Contrainte pour commission positive
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_positive_commission') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT check_positive_commission CHECK (commission_amount >= 0);
    END IF;
    
    -- Contrainte pour statut valide
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_status') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT check_valid_status CHECK (status IN ('pending', 'validated', 'completed', 'cancelled'));
    END IF;
    
    -- Contrainte pour méthode de paiement valide
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_payment_method') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT check_valid_payment_method CHECK (payment_method IN ('agency', 'mobile_money'));
    END IF;
END
$$;

-- Ajouter des index pour améliorer les performances (avec vérification d'existence)
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON public.transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Assurer l'intégrité référentielle (avec vérification d'existence)
DO $$
BEGIN
    -- Contrainte clé étrangère pour sender
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transactions_sender') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT fk_transactions_sender 
        FOREIGN KEY (sender_id) REFERENCES public.senders(id) ON DELETE SET NULL;
    END IF;
    
    -- Contrainte clé étrangère pour recipient
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_transactions_recipient') THEN
        ALTER TABLE public.transactions 
        ADD CONSTRAINT fk_transactions_recipient 
        FOREIGN KEY (recipient_id) REFERENCES public.recipients(id) ON DELETE SET NULL;
    END IF;
END
$$;
