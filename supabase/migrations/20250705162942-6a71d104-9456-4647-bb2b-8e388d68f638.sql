-- Ajouter une colonne region à la table user_profiles pour distinguer les opérateurs
ALTER TABLE public.user_profiles 
ADD COLUMN region TEXT DEFAULT 'kinshasa' CHECK (region IN ('kinshasa', 'dubai'));

-- Créer un index pour des requêtes efficaces par région
CREATE INDEX idx_user_profiles_region ON public.user_profiles(region);

-- Mettre à jour les utilisateurs existants avec la région par défaut
UPDATE public.user_profiles 
SET region = 'kinshasa' 
WHERE region IS NULL;