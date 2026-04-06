import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle, Clock, TrendingUp, FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: string;
  status: string;
  created_at: string;
  cover_letter: string | null;
  resume_url: string | null;
  job: { title: string; company: string; location: string } | null;
}

interface Submission {
  id: string;
  score: number | null;
  total_points: number | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  test: { title: string; duration_minutes: number } | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [appsRes, subsRes, profileRes] = await Promise.all([
        supabase
          .from("job_applications")
          .select("id, status, created_at, cover_letter, resume_url, job:jobs(title, company, location)")
          .eq("candidate_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("test_submissions")
          .select("id, score, total_points, status, started_at, completed_at, test:tests(title, duration_minutes)")
          .eq("candidate_id", user.id)
          .order("started_at", { ascending: false }),
        supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
      ]);
      setApplications((appsRes.data as any) || []);
      setSubmissions((subsRes.data as any) || []);
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const completedTests = submissions.filter((s) => s.status === "completed").length;
  const pendingTests = submissions.filter((s) => s.status === "in_progress").length;
  const interviewCount = applications.filter((a) => a.status === "interview").length;

  const statusColor = (status: string) => {
    switch (status) {
      case "applied": return "secondary";
      case "reviewing": return "outline";
      case "interview": return "default";
      case "rejected": return "destructive";
      case "accepted": return "default";
      default: return "secondary";
    }
  };

  const displayName = profile.full_name || user?.email?.split("@")[0] || "Candidate";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{displayName}</span>
          </h1>
          <p className="text-muted-foreground">Track your applications and assessment progress</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Briefcase, label: "Applied Jobs", value: applications.length, color: "text-blue-500" },
            { icon: Clock, label: "Interviews", value: interviewCount, color: "text-yellow-500" },
            { icon: CheckCircle, label: "Tests Completed", value: completedTests, color: "text-green-500" },
            { icon: TrendingUp, label: "Tests Pending", value: pendingTests, color: "text-purple-500" },
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-3xl font-bold">{loading ? "–" : stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="tests">My Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
                    <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{app.job?.title || "Unknown Job"}</h3>
                            <p className="text-sm text-muted-foreground">{app.job?.company} • {app.job?.location}</p>
                          </div>
                          <Badge variant={statusColor(app.status) as any}>{app.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-2">
                            {app.resume_url && (
                              <Badge variant="outline" className="gap-1 cursor-pointer">
                                <FileText className="w-3 h-3" /> Resume
                              </Badge>
                            )}
                            {app.cover_letter && (
                              <Badge variant="outline">Cover Letter</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't taken any tests yet.</p>
                    <Button onClick={() => navigate("/tests")}>Browse Tests</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{sub.test?.title || "Unknown Test"}</h3>
                            <p className="text-sm text-muted-foreground">{sub.test?.duration_minutes} min duration</p>
                          </div>
                          <Badge variant={sub.status === "completed" ? "default" : "secondary"}>
                            {sub.status}
                          </Badge>
                        </div>
                        {sub.status === "completed" && sub.score !== null && sub.total_points !== null && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Score</span>
                              <span className="font-bold text-primary">
                                {sub.score}/{sub.total_points} ({Math.round((sub.score / sub.total_points) * 100)}%)
                              </span>
                            </div>
                            <Progress value={(sub.score / sub.total_points) * 100} className="h-2" />
                          </div>
                        )}
                        <div className="flex justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            Started: {new Date(sub.started_at).toLocaleDateString()}
                          </span>
                          {sub.completed_at && (
                            <span className="text-xs text-muted-foreground">
                              Completed: {new Date(sub.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
