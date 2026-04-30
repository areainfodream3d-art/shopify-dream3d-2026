-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella Utenti (gestita da Supabase Auth)
-- Dati aggiuntivi in tabella profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Prodotti
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    material TEXT CHECK (material IN ('pla', 'resina')),
    category TEXT NOT NULL,
    specifications JSONB DEFAULT '{}',
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    featured BOOLEAN DEFAULT FALSE,
    customizable BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Immagini Prodotto
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Carrello
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    customization JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Tabella Ordini
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL CHECK (total > 0),
    shipping_address JSONB NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('stripe', 'paypal')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    order_status TEXT DEFAULT 'processing' CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Items Ordine
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    customization JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Richieste Commissione
CREATE TABLE commission_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stl_file_url TEXT NOT NULL,
    project_description TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    material TEXT CHECK (material IN ('pla', 'resina', 'both')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'approved', 'in_progress', 'completed', 'rejected')),
    deadline TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Preventivi Commissione
CREATE TABLE commission_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commission_id UUID REFERENCES commission_requests(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    timeline TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_products_material ON products(material);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_commission_requests_user_id ON commission_requests(user_id);
CREATE INDEX idx_commission_requests_status ON commission_requests(status);

-- Politiche RLS (Row Level Security)
-- Prodotti: visibili a tutti
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prodotti visibili a tutti" ON products FOR SELECT USING (true);

-- Solo admin possono modificare prodotti
CREATE POLICY "Solo admin possono modificare prodotti" ON products 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Carrello: utenti possono gestire solo i propri items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utenti possono vedere propri carrello" ON cart_items 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Utenti possono modificare propri carrello" ON cart_items 
FOR ALL USING (user_id = auth.uid());

-- Ordini: utenti possono vedere solo propri ordini
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utenti possono vedere propri ordini" ON orders 
FOR SELECT USING (user_id = auth.uid());

-- Commissioni: utenti possono gestire solo proprie richieste
ALTER TABLE commission_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utenti possono vedere proprie commissioni" ON commission_requests 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Utenti possono creare commissioni" ON commission_requests 
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin possono vedere tutto
CREATE POLICY "Admin possono vedere tutte le commissioni" ON commission_requests 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Trigger per creare profilo automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Inserimento dati di esempio (Seed Data)
INSERT INTO products (slug, name, description, price, material, category, stock, featured, image_url) VALUES
('vaso-geometrico', 'Vaso Geometrico Moderno', 'Vaso dal design geometrico unico, perfetto per piante grasse.', 25.00, 'pla', 'Arredamento', 10, true, 'https://placehold.co/600x400/000000/00d4ff?text=Vaso+Geometrico'),
('supporto-cuffie', 'Supporto Cuffie Gaming', 'Supporto robusto per cuffie da gaming, disponibile in vari colori.', 15.00, 'pla', 'Accessori', 20, true, 'https://placehold.co/600x400/000000/00ff88?text=Supporto+Cuffie'),
('miniature-fantasy', 'Set Miniature Fantasy', 'Set di 5 miniature dettagliate per giochi di ruolo, stampate in resina alta definizione.', 45.00, 'resina', 'Giochi', 5, true, 'https://placehold.co/600x400/000000/0080ff?text=Miniature+Fantasy'),
('portachiavi-personalizzato', 'Portachiavi Personalizzato', 'Portachiavi con nome o logo personalizzabile.', 8.00, 'pla', 'Gadget', 100, false, 'https://placehold.co/600x400/000000/ffffff?text=Portachiavi');
