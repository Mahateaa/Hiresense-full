import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { quizData, Question } from "@/data/questions";
type QuizState = "intro" | "quiz" | "results";
const Quiz = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const category = categoryId ? quizData[categoryId] : null;
  
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(category?.duration || 0);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const calculateResults = useCallback(() => {
    if (!category) return { correct: 0, incorrect: 0, unanswered: 0, percentage: 0 };
    
    let correct = 0;
    let incorrect = 0;
    
    category.questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });
    
    const unanswered = category.questions.length - correct - incorrect;
    const percentage = Math.round((correct / category.questions.length) * 100);
    
    return { correct, incorrect, unanswered, percentage };
  }, [category, answers]);
  const handleSubmit = useCallback(() => {
    setQuizState("results");
  }, []);
  useEffect(() => {
    if (quizState !== "quiz" || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizState, timeLeft, handleSubmit]);
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Category Not Found</CardTitle>
            <CardDescription>The requested assessment category doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
<Button onClick={() => navigate("/test")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const startQuiz = () => {
    setTimeLeft(category.duration);
    setAnswers({});
    setCurrentQuestion(0);
    setQuizState("quiz");
  };
  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };
  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };
  const restartQuiz = () => {
    setQuizState("intro");
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(category.duration);
  };
  const question = category.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / category.questions.length) * 100;
  const results = calculateResults();
  const isTimeWarning = timeLeft < 60 && timeLeft > 0;
  // Intro Screen
  if (quizState === "intro") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
          
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl gradient-primary">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl">{category.title}</CardTitle>
              <CardDescription className="text-base">
                Get ready to test your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-2xl font-bold text-primary">{category.questions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-2xl font-bold text-primary">{formatTime(category.duration)}</p>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                </div>
              </div>
              
              <div className="rounded-lg border border-border p-4 space-y-2">
                <h4 className="font-semibold">Instructions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Answer all questions within the time limit</li>
                  <li>• Each question has only one correct answer</li>
                  <li>• You can navigate between questions freely</li>
                  <li>• Quiz will auto-submit when time runs out</li>
                  <li>• Review your answers before submitting</li>
                </ul>
              </div>
              
              <Button onClick={startQuiz} size="lg" className="w-full gradient-primary glow-primary">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  // Results Screen
  if (quizState === "results") {
    const isPassing = results.percentage >= 60;
    
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${isPassing ? "bg-green-500/20" : "bg-destructive/20"}`}>
                {isPassing ? (
                  <Trophy className="h-10 w-10 text-green-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-destructive" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {isPassing ? "Congratulations!" : "Assessment Complete"}
              </CardTitle>
              <CardDescription className="text-base">
                {isPassing 
                  ? "You've passed the assessment!"
                  : "Keep practicing to improve your score"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-6xl font-bold gradient-text">{results.percentage}%</p>
                <p className="text-muted-foreground mt-2">Overall Score</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-green-500/10 p-4">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-2xl font-bold text-green-500">{results.correct}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="rounded-lg bg-destructive/10 p-4">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <p className="text-2xl font-bold text-destructive">{results.incorrect}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-2xl font-bold text-muted-foreground">{results.unanswered}</p>
                  <p className="text-sm text-muted-foreground">Unanswered</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="font-semibold text-center">Review Answers</h4>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {category.questions.map((q, index) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    const wasAnswered = userAnswer !== undefined;
                    
                    return (
                      <div key={q.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{q.question}</p>
                            <div className="mt-1 flex items-center gap-2">
                              {wasAnswered ? (
                                isCorrect ? (
                                  <Badge className="bg-green-500/20 text-green-500 border-0">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Correct
                                  </Badge>
                                ) : (
                                  <Badge className="bg-destructive/20 text-destructive border-0">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Incorrect
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="secondary">Unanswered</Badge>
                              )}
                            </div>
                            {!isCorrect && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Correct: {q.options[q.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={restartQuiz} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                <Button onClick={() => navigate("/test")} className="flex-1 gradient-primary">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  // Quiz Screen
  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{category.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {category.questions.length}
            </p>
          </div>
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-lg font-bold ${
            isTimeWarning ? "bg-destructive/20 text-destructive animate-pulse" : "bg-muted"
          }`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress */}
        <Progress value={progress} className="mb-6 h-2" />
        
        {/* Question Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {category.questions.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = index === currentQuestion;
            
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  isCurrent
                    ? "gradient-primary text-primary-foreground"
                    : isAnswered
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        {/* Question Card */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-muted/50 ${
                    answers[question.id] === index
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => handleAnswer(question.id, index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => goToQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentQuestion === category.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="gradient-primary glow-primary">
              Submit Assessment
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => goToQuestion(currentQuestion + 1)}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Quiz;