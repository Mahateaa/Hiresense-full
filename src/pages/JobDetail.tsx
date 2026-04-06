import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Upload, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  useEffect(() => {
    if (id) fetchJob();
  }, [id]);
  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setJob(data);
      // Check if already applied
      if (user) {
        const { data: appData } = await supabase
          .from("job_applications")
          .select("id")
          .eq("job_id", id)
          .eq("candidate_id", user.id);
        setHasApplied((appData?.length || 0) > 0);
      }
      // Get applicant count (recruiters)
      const { count } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", id!);
      setApplicantCount(count || 0);
    } catch (error: any) {
      toast({ title: "Error", description: "Job not found", variant: "destructive" });
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };
  const handleApply = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please log in to apply", variant: "destructive" });
      return;
    }
    setApplying(true);
    try {
      let resumeUrl: string | null = null;
      if (resumeFile) {
        const filePath = `${user.id}/${Date.now()}_${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, resumeFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(filePath);
        resumeUrl = urlData.publicUrl;
      }
      const { error } = await supabase.from("job_applications").insert({
        job_id: id,
        candidate_id: user.id,
        resume_url: resumeUrl,
        cover_letter: coverLetter.trim() || null,
      });
      if (error) throw error;
      toast({ title: "Applied!", description: "Your application has been submitted." });
      setHasApplied(true);
      setShowApplyForm(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };
  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p>Loading...</p></div>;
  if (!job) return null;
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const salary = job.salary_min && job.salary_max
    ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
    : job.salary_min ? `From $${(job.salary_min / 1000).toFixed(0)}k` : null;
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                  <p className="text-lg text-muted-foreground">{job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{job.type}</Badge>
                  {role === "recruiter" && (
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" /> {applicantCount} applicants
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                )}
                {salary && (
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{salary}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
              {job.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>
              )}
              {skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {role === "candidate" && !hasApplied && !showApplyForm && (
                <Button onClick={() => setShowApplyForm(true)} className="gradient-primary text-white">
                  Apply Now
                </Button>
              )}
              {hasApplied && (
                <Badge variant="outline" className="text-green-600 border-green-600">✓ Applied</Badge>
              )}
              {showApplyForm && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Submit Application</h3>
                  <div>
                    <Label>Resume (PDF/DOC) *</Label>
                    <div className="mt-1">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cover Letter (optional)</Label>
                    <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell the recruiter why you're a great fit..." rows={4} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApply} disabled={applying || !resumeFile} className="gradient-primary text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      {applying ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowApplyForm(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
export default JobDetail;