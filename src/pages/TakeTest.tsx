import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const TakeTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) fetchTest();
  }, [id, user]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      const { data: testData, error } = await supabase.from("tests").select("*").eq("id", id).single();
      if (error) throw error;
      setTest(testData);
      setTimeLeft(testData.duration_minutes * 60);

      const { data: qData } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", id!)
        .order("order_index");
      setQuestions(qData || []);

      // Check existing submission
      const { data: existing } = await supabase
        .from("test_submissions")
        .select("*")
        .eq("test_id", id!)
        .eq("candidate_id", user!.id)
        .eq("status", "in_progress")
        .maybeSingle();

      if (existing) {
        setSubmissionId(existing.id);
        setAnswers(typeof existing.answers === 'object' && existing.answers ? existing.answers as Record<string, string> : {});
      } else {
        // Create new submission
        const { data: newSub } = await supabase
          .from("test_submissions")
          .insert({ test_id: id, candidate_id: user!.id, answers: {} })
          .select()
          .single();
        if (newSub) setSubmissionId(newSub.id);
      }
    } catch {
      toast({ title: "Error", description: "Test not found", variant: "destructive" });
      navigate("/tests");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || !submissionId) return;
    setSubmitting(true);

    try {
      // Calculate score for multiple choice
      let score = 0;
      let totalPoints = 0;
      questions.forEach(q => {
        totalPoints += q.points;
        if (q.question_type === "multiple_choice" && answers[q.id] === q.correct_answer) {
          score += q.points;
        }
      });

      await supabase
        .from("test_submissions")
        .update({
          answers,
          score,
          total_points: totalPoints,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      toast({ title: "Test Submitted!", description: `You scored ${score}/${totalPoints}` });
      navigate("/tests");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }, [submitting, submissionId, answers, questions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p>Loading test...</p></div>;
  if (!test) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6 sticky top-20 z-10 bg-background py-2">
          <Button variant="ghost" onClick={() => navigate("/tests")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"} className="text-lg px-4 py-1">
              <Clock className="w-4 h-4 mr-1" /> {formatTime(timeLeft)}
            </Badge>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
          {test.description && <p className="text-muted-foreground mb-6">{test.description}</p>}

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-primary font-bold">Q{idx + 1}.</span>
                    {q.question_text}
                    <Badge variant="outline" className="ml-auto">{q.points} pts</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {q.question_type === "multiple_choice" && Array.isArray(q.options) ? (
                    <div className="space-y-2">
                      {q.options.map((opt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            answers[q.id] === opt
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Textarea
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={q.question_type === "code" ? "Write your code here..." : "Type your answer..."}
                      rows={q.question_type === "code" ? 8 : 4}
                      className={q.question_type === "code" ? "font-mono text-sm" : ""}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting} size="lg" className="gradient-primary text-white">
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Test"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TakeTest;
