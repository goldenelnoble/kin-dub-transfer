
-- Table pour les colis (parcels)
CREATE TABLE public.parcels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  dimensions JSONB, -- {length, width, height}
  description TEXT,
  declared_value DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'received',
  priority VARCHAR(20) DEFAULT 'standard', -- standard, express, urgent
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  estimated_delivery DATE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Table pour le suivi des étapes (tracking events)
CREATE TABLE public.parcel_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  coordinates JSONB, -- {lat, lng} pour la géolocalisation
  image_url TEXT -- pour les photos de preuve
);

-- Index pour améliorer les performances
CREATE INDEX idx_parcels_tracking_number ON public.parcels(tracking_number);
CREATE INDEX idx_parcels_status ON public.parcels(status);
CREATE INDEX idx_parcel_tracking_parcel_id ON public.parcel_tracking(parcel_id);
CREATE INDEX idx_parcel_tracking_created_at ON public.parcel_tracking(created_at);

-- Fonction pour générer un numéro de suivi unique
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Format: GEN + année + mois + 6 chiffres aléatoires
    new_number := 'GEN' || TO_CHAR(NOW(), 'YYMM') || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Vérifier si le numéro existe déjà
    SELECT EXISTS(SELECT 1 FROM public.parcels WHERE tracking_number = new_number) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro de suivi
CREATE OR REPLACE FUNCTION set_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL OR NEW.tracking_number = '' THEN
    NEW.tracking_number := generate_tracking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_tracking_number
  BEFORE INSERT ON public.parcels
  FOR EACH ROW
  EXECUTE FUNCTION set_tracking_number();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_parcels_updated_at
  BEFORE UPDATE ON public.parcels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer automatiquement une entrée de suivi lors de la création d'un colis
CREATE OR REPLACE FUNCTION create_initial_tracking()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.parcel_tracking (parcel_id, status, location, description, created_by)
  VALUES (
    NEW.id,
    'received',
    'Dubai - Centre de tri',
    'Colis reçu et enregistré dans notre système',
    NEW.created_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_initial_tracking
  AFTER INSERT ON public.parcels
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_tracking();

-- Activer le temps réel pour les mises à jour
ALTER TABLE public.parcels REPLICA IDENTITY FULL;
ALTER TABLE public.parcel_tracking REPLICA IDENTITY FULL;

-- Ajouter les tables aux publications temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.parcels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parcel_tracking;
