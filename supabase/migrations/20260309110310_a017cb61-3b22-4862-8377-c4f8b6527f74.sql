
-- Add user_id to appliances (no default needed since table is empty now)
ALTER TABLE public.appliances ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all access to appliances" ON public.appliances;

-- Create user-scoped policies for appliances
CREATE POLICY "Users can view their own appliances" ON public.appliances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own appliances" ON public.appliances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own appliances" ON public.appliances FOR DELETE USING (auth.uid() = user_id);

-- Add user_id to settings
ALTER TABLE public.settings ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all access to settings" ON public.settings;

-- Create user-scoped policies for settings
CREATE POLICY "Users can view their own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);

-- Create usage_history table for trends
CREATE TABLE public.usage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  total_monthly_kwh NUMERIC NOT NULL,
  total_monthly_cost NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

ALTER TABLE public.usage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history" ON public.usage_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.usage_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own history" ON public.usage_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own history" ON public.usage_history FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
