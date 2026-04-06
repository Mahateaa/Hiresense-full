import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
interface Question {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "text" | "code";
  options: string[];
  correct_answer: string;
  points: number;
}
const CreateTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question_text: "",
      question_type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: "",
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
  };
  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };
  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a test title", variant: "destructive" });
      return;
    }
    if (questions.length === 0) {
      toast({ title: "Error", description: "Please add at least one question", variant: "destructive" });
      return;
    }
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toast({ title: "Error", description: `Question ${i + 1} is empty`, variant: "destructive" });
        return;
      }
      if (q.question_type === "multiple_choice") {
        const filledOptions = q.options.filter(o => o.trim());
        if (filledOptions.length < 2) {
          toast({ title: "Error", description: `Question ${i + 1} needs at least 2 options`, variant: "destructive" });
          return;
        }
        if (!q.correct_answer.trim()) {
          toast({ title: "Error", description: `Question ${i + 1} needs a correct answer`, variant: "destructive" });
          return;
        }
      }
    }
    setIsSubmitting(true);
    try {
      // Create test
      const { data: testData, error: testError } = await supabase
        .from("tests")
        .insert({
          recruiter_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          duration_minutes: duration,
        })
        .select()
        .single();
      if (testError) throw testError;
      // Create questions
      const questionsToInsert = questions.map((q, index) => ({
        test_id: testData.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === "multiple_choice" ? q.options.filter(o => o.trim()) : null,
        correct_answer: q.correct_answer || null,
        points: q.points,
        order_index: index,
      }));
      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsToInsert);
      if (questionsError) throw questionsError;
      toast({ title: "Success", description: "Test created successfully!" });
      navigate("/hr-dashboard");
    } catch (error: any) {
      console.error("Error creating test:", error);
      toast({ title: "Error", description: error.message || "Failed to create test", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/hr-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Create</span> New Test
          </h1>
          <p className="text-muted-foreground">Design assessments for your candidates</p>
        </motion.div>
        {/* Test Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Test Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this test covers..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  min={5}
                  max={180}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Questions ({questions.length})</CardTitle>
              <Button onClick={addQuestion} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No questions added yet.</p>
                  <p className="text-sm">Click "Add Question" to get started.</p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">Question {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Question Type</Label>
                        <Select
                          value={question.question_type}
                          onValueChange={(value) => updateQuestion(question.id, "question_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="text">Text Answer</SelectItem>
                            <SelectItem value="code">Code</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value) || 1)}
                          min={1}
                          max={100}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Question Text *</Label>
                      <Textarea
                        value={question.question_text}
                        onChange={(e) => updateQuestion(question.id, "question_text", e.target.value)}
                        placeholder="Enter your question..."
                        rows={2}
                      />
                    </div>
                    {question.question_type === "multiple_choice" && (
                      <div className="space-y-3">
                        <Label>Options</Label>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-6">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            />
                          </div>
                        ))}
                        <div>
                          <Label>Correct Answer</Label>
                          <Select
                            value={question.correct_answer}
                            onValueChange={(value) => updateQuestion(question.id, "correct_answer", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options.map((option, optIndex) => (
                                option.trim() && (
                                  <SelectItem key={optIndex} value={option}>
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </SelectItem>
                                )
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    {(question.question_type === "text" || question.question_type === "code") && (
                      <div>
                        <Label>Expected Answer (for reference)</Label>
                        <Textarea
                          value={question.correct_answer}
                          onChange={(e) => updateQuestion(question.id, "correct_answer", e.target.value)}
                          placeholder="Enter expected answer..."
                          rows={2}
                        />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end gap-4"
        >
          <Button variant="outline" onClick={() => navigate("/hr-dashboard")}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gradient-primary text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Test"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
export default CreateTest;