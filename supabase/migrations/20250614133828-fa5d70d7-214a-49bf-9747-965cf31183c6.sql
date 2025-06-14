
-- Table des clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des marchandises
CREATE TABLE public.marchandises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  reference TEXT UNIQUE,
  poids DECIMAL,
  dimensions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mise à jour de la table colis existante pour correspondre au nouveau modèle
ALTER TABLE public.parcels 
ADD COLUMN client_id UUID REFERENCES public.clients(id),
ADD COLUMN marchandises JSONB,
ADD COLUMN qr_code_url TEXT,
ADD COLUMN box_id UUID;

-- Table des boxes
CREATE TABLE public.boxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  qr_code_principal TEXT,
  emplacement_actuel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter la contrainte de clé étrangère pour box_id dans parcels
ALTER TABLE public.parcels 
ADD CONSTRAINT fk_parcels_box FOREIGN KEY (box_id) REFERENCES public.boxes(id);

-- Table de jonction pour les marchandises dans les colis (optionnelle)
CREATE TABLE public.colis_marchandises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colis_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
  marchandise_id UUID REFERENCES public.marchandises(id),
  quantite INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fonction pour générer les QR codes des boxes
CREATE OR REPLACE FUNCTION public.generate_box_qr_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  colis_count INTEGER;
  colis_ids JSONB;
BEGIN
  -- Compter le nombre de colis dans cette box
  SELECT COUNT(*), JSONB_AGG(id) 
  INTO colis_count, colis_ids
  FROM public.parcels 
  WHERE box_id = NEW.id;
  
  -- Si plus de 5 colis, générer un QR code
  IF colis_count > 5 THEN
    UPDATE public.boxes 
    SET qr_code_principal = CONCAT('{"box_id":"', NEW.id, '","colis":', colis_ids, ',"url":"https://app.lovable/box/', NEW.id, '"}')
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour la génération automatique des QR codes des boxes
CREATE TRIGGER trigger_generate_box_qr
  AFTER UPDATE ON public.parcels
  FOR EACH ROW
  WHEN (NEW.box_id IS NOT NULL AND (OLD.box_id IS NULL OR OLD.box_id != NEW.box_id))
  EXECUTE FUNCTION generate_box_qr_code();

-- Indexes pour les performances (sans le duplicate)
CREATE INDEX idx_clients_nom ON public.clients(nom);
CREATE INDEX idx_marchandises_nom ON public.marchandises(nom);
CREATE INDEX idx_marchandises_reference ON public.marchandises(reference);
CREATE INDEX idx_parcels_client_id ON public.parcels(client_id);
CREATE INDEX idx_parcels_box_id ON public.parcels(box_id);

-- Mise à jour de la fonction de suivi existante
CREATE OR REPLACE FUNCTION public.create_initial_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.parcel_tracking (parcel_id, status, location, description, created_by)
  VALUES (
    NEW.id,
    'received',
    'Centre de réception',
    'Colis reçu et enregistré dans le système',
    NEW.created_by
  );
  RETURN NEW;
END;
$$;
