-- Create app_role enum for user types
CREATE TYPE public.app_role AS ENUM ('recruiter', 'candidate');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles timestamp
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create question type enum
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'text', 'code');

-- Create tests table
CREATE TABLE public.tests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type public.question_type NOT NULL DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT,
    points INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tests
CREATE POLICY "Recruiters can view their own tests"
ON public.tests FOR SELECT
USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can create tests"
ON public.tests FOR INSERT
WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update their own tests"
ON public.tests FOR UPDATE
USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can delete their own tests"
ON public.tests FOR DELETE
USING (auth.uid() = recruiter_id);

-- RLS Policies for questions (via test ownership)
CREATE POLICY "Recruiters can view questions of their tests"
ON public.questions FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.tests WHERE tests.id = questions.test_id AND tests.recruiter_id = auth.uid()
));

CREATE POLICY "Recruiters can add questions to their tests"
ON public.questions FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.tests WHERE tests.id = questions.test_id AND tests.recruiter_id = auth.uid()
));

CREATE POLICY "Recruiters can update questions of their tests"
ON public.questions FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.tests WHERE tests.id = questions.test_id AND tests.recruiter_id = auth.uid()
));

CREATE POLICY "Recruiters can delete questions from their tests"
ON public.questions FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.tests WHERE tests.id = questions.test_id AND tests.recruiter_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_tests_updated_at
BEFORE UPDATE ON public.tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();