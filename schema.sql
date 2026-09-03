-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service_type TEXT NOT NULL,
    estimated_budget TEXT,
    message TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to insert new inquiries
CREATE POLICY "Allow public inserts" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (true);
