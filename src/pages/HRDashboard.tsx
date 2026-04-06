import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, CheckCircle, Clock, FileText, Eye, ExternalLink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [jobsRes, testsRes] = await Promise.all([
        supabase.from("jobs").select("*").eq("recruiter_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("tests").select("*").eq("recruiter_id", user!.id).order("created_at", { ascending: false }),
      ]);

      const jobsData = jobsRes.data || [];
      const testsData = testsRes.data || [];
      setJobs(jobsData);
      setTests(testsData);

      // Fetch applications for recruiter's jobs
      if (jobsData.length > 0) {
        const jobIds = jobsData.map(j => j.id);
        const { data: appsData } = await supabase
          .from("job_applications")
          .select("*")
          .in("job_id", jobIds)
          .order("created_at", { ascending: false });
        setApplications(appsData || []);
      }

      // Fetch test submissions
      if (testsData.length > 0) {
        const testIds = testsData.map(t => t.id);
        const { data: subsData } = await supabase
          .from("test_submissions")
          .select("*")
          .in("test_id", testIds)
          .order("completed_at", { ascending: false });
        setSubmissions(subsData || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const getJobTitle = (jobId: string) => jobs.find(j => j.id === jobId)?.title || "Unknown";
  const getTestTitle = (testId: string) => tests.find(t => t.id === testId)?.title || "Unknown";

  const stats = [
    { icon: Briefcase, label: "Posted Jobs", value: jobs.length, color: "text-blue-500" },
    { icon: Users, label: "Total Applicants", value: applications.length, color: "text-purple-500" },
    { icon: FileText, label: "Created Tests", value: tests.length, color: "text-orange-500" },
    { icon: CheckCircle, label: "Test Submissions", value: submissions.filter(s => s.status === "completed").length, color: "text-green-500" },
  ];

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2"><span className="text-gradient">HR</span> Dashboard</h1>
            <p className="text-muted-foreground">Manage your jobs, applications, and tests</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/job-upload")}>Post Job</Button>
            <Button variant="outline" onClick={() => navigate("/create-test")}>Create Test</Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card>
                <CardContent className="pt-6">
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="results">Test Results ({submissions.filter(s => s.status === "completed").length})</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader><CardTitle>Job Applications</CardTitle></CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No applications yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Cover Letter</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map(app => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{getJobTitle(app.job_id)}</TableCell>
                          <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={app.status === "applied" ? "outline" : "default"}>
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.resume_url ? (
                              <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> View
                              </a>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{app.cover_letter || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader><CardTitle>My Job Listings</CardTitle></CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No jobs posted yet.</p>
                    <Button onClick={() => navigate("/job-upload")}>Post Your First Job</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map(job => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell><Badge variant="outline">{job.type}</Badge></TableCell>
                          <TableCell>{applications.filter(a => a.job_id === job.id).length}</TableCell>
                          <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader><CardTitle>Test Results</CardTitle></CardHeader>
              <CardContent>
                {submissions.filter(s => s.status === "completed").length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No test submissions yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.filter(s => s.status === "completed").map(sub => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{getTestTitle(sub.test_id)}</TableCell>
                          <TableCell>
                            <span className="font-semibold">{sub.score}</span>
                            <span className="text-muted-foreground">/{sub.total_points}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700">Completed</Badge>
                          </TableCell>
                          <TableCell>{sub.completed_at ? new Date(sub.completed_at).toLocaleDateString() : "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HRDashboard;
