-- Activer la publication en temps réel pour la table transactions
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;