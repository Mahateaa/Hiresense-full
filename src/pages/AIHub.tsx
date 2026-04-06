import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileSearch,
  Target,
  BarChart3,
  Sparkles,
  Lightbulb,
  Puzzle,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AIHub = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleLaunch = (moduleId: string) => {
    if (moduleId === "resume-parser") navigate("/ai/resume-parser");
    else if (moduleId === "skill-matching") navigate("/ai/skill-matching");
    else if (moduleId === "explainability") navigate("/ai/explainability");
    else if (moduleId === "interview-prep") navigate("/interviewprep");
    else if (moduleId === "test-analysis") navigate("/test");
  };

  const aiModules = [
    {
      id: "resume-parser",
      title: "Resume Parser",
      description: "Upload a resume to automatically extract the candidate’s profile, contact details, technical skills, and soft skills  all in a structured format you can review instantly.",
      icon: FileSearch,
      status: "ready",
      color: "text-blue-500",
      roles: ["recruiter", "candidate"],
    },
    {
      id: "skill-matching",
      title: "AI Skill Matching",
      description: "Upload a resume and let our AI compare extracted skills against job requirements to generate the best role matches, along with match percentage and supporting skills.",
      icon: Target,
      status: "ready",
      color: "text-green-500",
      roles: ["recruiter", "candidate"],
    },
    {
      id: "explainability",
      title: "AI Explainability",
      description: "Understand how each match score is calculated by viewing the exact skills that contributed to it, including technical and soft skill breakdowns with transparent scoring logic.",
      icon: Lightbulb,
      status: "beta",
      color: "text-cyan-500",
      roles: ["recruiter", "candidate"],
    },
    {
      id: "test-analysis",
      title: "Take tests",
      description: "Attempt coding, aptitude, and role-based assessments designed to measure key skills  with instant scoring and performance insights.",
      icon: BarChart3,
      status: "ready",
      color: "text-purple-500",
      roles: ["candidate"],
    },
    {
      id: "ai-reporting",
      title: "AI Reporting",
      description: "Generate recruitment reports with summaries",
      icon: Sparkles,
      status: "beta",
      color: "text-amber-500",
      roles: ["recruiter"],
    },
    {
      id: "interview-prep",
      title: "Interview Prep",
      description: "Watch interview prep videos and learn how to answer common HR and technical questions effectively. Will include AI assisstance soon!",
      icon: MessageSquare,
      status: "beta",
      color: "text-indigo-500",
      roles: ["candidate"],
    },
    {
      id: "bias-detection",
      title: "Bias Detection",
      description: "Fair hiring analysis (coming soon)",
      icon: Brain,
      status: "coming-soon",
      color: "text-rose-500",
      roles: ["recruiter"],
    },
  ];

  const filteredModules = aiModules.filter((m) => !role || m.roles.includes(role));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Some AI-Powered Features</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Feature Hub</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore AI modules to supercharge your recruitment experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, idx) => (
            <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className="h-full hover:shadow-card transition-all hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-lg bg-gradient-secondary ${module.color}`}>
                      <module.icon className="w-6 h-6" />
                    </div>
                    <Badge
                      variant={module.status === "ready" ? "default" : module.status === "beta" ? "secondary" : "outline"}
                    >
                      {module.status === "coming-soon" ? "Coming Soon" : module.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled={module.status === "coming-soon"}>
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gradient-primary text-white"
                      disabled={module.status === "coming-soon"}
                      onClick={() => handleLaunch(module.id)}
                    >
                      Launch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIHub;
