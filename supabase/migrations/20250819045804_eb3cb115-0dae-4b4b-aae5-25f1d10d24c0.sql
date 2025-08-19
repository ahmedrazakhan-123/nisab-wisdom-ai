-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('admin', 'standard_user', 'researcher');
CREATE TYPE public.asset_type AS ENUM ('crypto', 'stock', 'halal_asset', 'commodity', 'real_estate');
CREATE TYPE public.compliance_status AS ENUM ('halal', 'haram', 'doubtful', 'pending_review');
CREATE TYPE public.audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'compliance_check');

-- User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    country TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'standard_user',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Assets table (crypto, stocks, etc.)
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    asset_type asset_type NOT NULL,
    description TEXT,
    website_url TEXT,
    whitepaper_url TEXT,
    whitepaper_content TEXT,
    current_price DECIMAL(20, 8),
    market_cap BIGINT,
    volume_24h DECIMAL(20, 8),
    price_change_24h DECIMAL(10, 4),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance rules table (AAOIFI and other Islamic finance rules)
CREATE TABLE public.compliance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name TEXT NOT NULL,
    rule_category TEXT NOT NULL,
    rule_description TEXT NOT NULL,
    rule_source TEXT, -- e.g., 'AAOIFI Standard 21', 'Quran 2:275'
    rule_criteria JSONB, -- Structured criteria for automated checking
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset compliance status
CREATE TABLE public.asset_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    compliance_status compliance_status NOT NULL,
    compliance_score DECIMAL(3, 2), -- 0.00 to 1.00
    compliance_reasons TEXT[],
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checked_by UUID REFERENCES auth.users(id),
    automated_check BOOLEAN DEFAULT true,
    UNIQUE (asset_id)
);

-- User portfolios
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    total_value DECIMAL(20, 8) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio assets (many-to-many)
CREATE TABLE public.portfolio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    quantity DECIMAL(20, 8) NOT NULL,
    average_price DECIMAL(20, 8) NOT NULL,
    current_value DECIMAL(20, 8),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (portfolio_id, asset_id)
);

-- Knowledge base for RAG chatbot
CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL, -- e.g., 'Quran', 'Hadith', 'AAOIFI', 'Fatwa'
    source_reference TEXT, -- e.g., 'Quran 2:275', 'Bukhari 2084'
    category TEXT NOT NULL,
    keywords TEXT[],
    embedding VECTOR(1536), -- OpenAI embeddings
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News and sentiment analysis
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT UNIQUE,
    source TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    sentiment_score DECIMAL(3, 2), -- -1.00 to 1.00
    sentiment_label TEXT, -- 'positive', 'negative', 'neutral'
    related_assets UUID[],
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for security
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action audit_action NOT NULL,
    resource_type TEXT, -- e.g., 'portfolio', 'asset', 'compliance'
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zakat calculations table
CREATE TABLE public.zakat_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    calculation_data JSONB NOT NULL,
    total_wealth DECIMAL(20, 8) NOT NULL,
    nisab_threshold DECIMAL(20, 8) NOT NULL,
    zakat_due DECIMAL(20, 8) NOT NULL,
    currency TEXT DEFAULT 'USD',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_assets_symbol ON public.assets(symbol);
CREATE INDEX idx_assets_type ON public.assets(asset_type);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolio_assets_portfolio_id ON public.portfolio_assets(portfolio_id);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_keywords ON public.knowledge_base USING GIN(keywords);
CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zakat_calculations ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policies for assets (public read, admin write)
CREATE POLICY "Anyone can view assets"
    ON public.assets FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage assets"
    ON public.assets FOR ALL
    USING (public.is_admin(auth.uid()));

-- RLS Policies for compliance_rules
CREATE POLICY "Anyone can view compliance rules"
    ON public.compliance_rules FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage compliance rules"
    ON public.compliance_rules FOR ALL
    USING (public.is_admin(auth.uid()));

-- RLS Policies for asset_compliance
CREATE POLICY "Anyone can view asset compliance"
    ON public.asset_compliance FOR SELECT
    USING (true);

CREATE POLICY "Admins and researchers can manage compliance"
    ON public.asset_compliance FOR ALL
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'researcher'));

-- RLS Policies for portfolios
CREATE POLICY "Users can manage their own portfolios"
    ON public.portfolios FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all portfolios"
    ON public.portfolios FOR SELECT
    USING (public.is_admin(auth.uid()));

-- RLS Policies for portfolio_assets
CREATE POLICY "Users can manage their portfolio assets"
    ON public.portfolio_assets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE portfolios.id = portfolio_assets.portfolio_id
            AND portfolios.user_id = auth.uid()
        )
    );

-- RLS Policies for knowledge_base
CREATE POLICY "Anyone can view verified knowledge"
    ON public.knowledge_base FOR SELECT
    USING (is_verified = true);

CREATE POLICY "Admins can manage all knowledge"
    ON public.knowledge_base FOR ALL
    USING (public.is_admin(auth.uid()));

-- RLS Policies for news_articles
CREATE POLICY "Anyone can view news articles"
    ON public.news_articles FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage news articles"
    ON public.news_articles FOR ALL
    USING (public.is_admin(auth.uid()));

-- RLS Policies for audit_logs
CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- RLS Policies for zakat_calculations
CREATE POLICY "Users can manage their own zakat calculations"
    ON public.zakat_calculations FOR ALL
    USING (auth.uid() = user_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
    );

    -- Assign default role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'standard_user');

    -- Create default portfolio
    INSERT INTO public.portfolios (user_id, name, is_default)
    VALUES (NEW.id, 'My Portfolio', true);

    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_assets_updated_at
    BEFORE UPDATE ON public.portfolio_assets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
    BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_rules_updated_at
    BEFORE UPDATE ON public.compliance_rules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_user_id UUID,
    p_action audit_action,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        metadata
    ) VALUES (
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_old_values,
        p_new_values,
        p_metadata
    );
END;
$$;