
-- Create appliances table
CREATE TABLE public.appliances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  watts NUMERIC NOT NULL,
  hours_per_day NUMERIC NOT NULL,
  days_per_month NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  electricity_price NUMERIC NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required per spec)
CREATE POLICY "Allow all access to appliances" ON public.appliances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings row
INSERT INTO public.settings (electricity_price) VALUES (0);
