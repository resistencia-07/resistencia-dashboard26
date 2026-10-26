-- =============================================================================
-- RESISTENCIA DASHBOARD — SUPABASE DATABASE SCHEMA
-- =============================================================================
-- This script sets up the projects table with Row Level Security (RLS)
-- and automatic updated_at timestamp management.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ndurance.si', 'AVD', 'Nexlume', 'Alchemist')),
  username TEXT DEFAULT '',
  password TEXT DEFAULT '',
  admin_username TEXT DEFAULT '',
  admin_password TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow operations using the project API key (anon / authenticated)
DROP POLICY IF EXISTS "Allow all project operations with API key" ON public.projects;
CREATE POLICY "Allow all project operations with API key"
  ON public.projects
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
