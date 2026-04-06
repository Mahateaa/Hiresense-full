
-- Jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL,
  title text NOT NULL,
  company text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Full-time',
  salary_min integer,
  salary_max integer,
  description text,
  skills jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT TO authenticated USING (is_active = true);

-- Recruiters manage their own jobs
CREATE POLICY "Recruiters can create jobs" ON public.jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update their jobs" ON public.jobs
  FOR UPDATE TO authenticated USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can delete their jobs" ON public.jobs
  FOR DELETE TO authenticated USING (auth.uid() = recruiter_id);

-- Job applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL,
  resume_url text,
  cover_letter text,
  status text NOT NULL DEFAULT 'applied',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Candidates can apply
CREATE POLICY "Candidates can create applications" ON public.job_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = candidate_id);

-- Candidates can view their own applications
CREATE POLICY "Candidates can view own applications" ON public.job_applications
  FOR SELECT TO authenticated USING (auth.uid() = candidate_id);

-- Recruiters can view applications for their jobs
CREATE POLICY "Recruiters can view applications for their jobs" ON public.job_applications
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.recruiter_id = auth.uid())
  );

-- Recruiters can update application status
CREATE POLICY "Recruiters can update application status" ON public.job_applications
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.recruiter_id = auth.uid())
  );

-- Test submissions table
CREATE TABLE public.test_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer,
  total_points integer,
  status text NOT NULL DEFAULT 'in_progress',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.test_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can create submissions" ON public.test_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can view own submissions" ON public.test_submissions
  FOR SELECT TO authenticated USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can update own in-progress submissions" ON public.test_submissions
  FOR UPDATE TO authenticated USING (auth.uid() = candidate_id AND status = 'in_progress');

CREATE POLICY "Recruiters can view submissions for their tests" ON public.test_submissions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.tests WHERE tests.id = test_submissions.test_id AND tests.recruiter_id = auth.uid())
  );

-- Allow candidates to view active tests
CREATE POLICY "Candidates can view active tests" ON public.tests
  FOR SELECT TO authenticated USING (is_active = true);

-- Allow candidates to view questions of active tests
CREATE POLICY "Candidates can view questions of active tests" ON public.questions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.tests WHERE tests.id = questions.test_id AND tests.is_active = true)
  );

-- Resume storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Candidates can upload resumes" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Candidates can view own resumes" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Recruiters can view applicant resumes" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'resumes');

-- Enable realtime for applications
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_submissions;
