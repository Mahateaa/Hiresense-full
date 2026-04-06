import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Tests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, [user]);

  const fetchTests = async () => {
    try {
      const { data: testsData } = await supabase
        .from("tests")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      setTests(testsData || []);

      if (user) {
        const { data: subsData } = await supabase
          .from("test_submissions")
          .select("*")
          .eq("candidate_id", user.id);
        setSubmissions(subsData || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSubmission = (testId: string) => {
    return submissions.find(s => s.test_id === testId);
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Available <span className="text-gradient">Tests</span>
          </h1>
          <p className="text-xl text-muted-foreground">Take assessments curated by recruiters to showcase your skills</p>
        </motion.div>

        {tests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No tests available at the moment.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, idx) => {
              const submission = getSubmission(test.id);
              const completed = submission?.status === "completed";

              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        {completed && <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Done</Badge>}
                      </div>
                      {test.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{test.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end gap-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{test.duration_minutes} min</span>
                        <span className="flex items-center gap-1"><FileText className="w-4 h-4" />Assessment</span>
                      </div>
                      {completed ? (
                        <div className="text-sm font-medium">
                          Score: {submission.score}/{submission.total_points}
                        </div>
                      ) : (
                        <Button onClick={() => navigate(`/take-test/${test.id}`)} className="w-full">
                          {submission ? "Continue Test" : "Start Test"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;
