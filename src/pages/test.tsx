import { Brain, Code, Lightbulb, Clock, Users, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const assessmentCategories = [
  {
    id: "aptitude",
    title: "Aptitude Test",
    description: "Evaluate numerical reasoning, logical thinking, and problem-solving abilities",
    icon: Brain,
    questions: 25,
    duration: "30 min",
    difficulty: "Medium",
    topics: ["Numerical Reasoning", "Data Interpretation", "Pattern Recognition"],
  },
  {
    id: "reasoning",
    title: "Logical Reasoning",
    description: "Test deductive and inductive reasoning capabilities",
    icon: Lightbulb,
    questions: 20,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Syllogisms", "Analogies", "Critical Thinking"],
  },
  {
    id: "technical",
    title: "Technical Assessment",
    description: "Evaluate programming knowledge and technical problem-solving skills",
    icon: Code,
    questions: 15,
    duration: "45 min",
    difficulty: "Hard",
    topics: ["Data Structures", "Algorithms", "System Design"],
  },
  {
    id: "Frontend",
    title: "Frontend Assesment",
    description: "Evaluates core front-end skills and problem-solving ability",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["HTML & CSS", "Java Script", "React", "Git and Rest API's"],
  },
  {
    id: "UI/UX Design",
    title: "UI/UX Assessment",
    description: "design tools knowledge, prototyping skills, and user experience fundamentals",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Design Tools", "Wireframing & Prototyping", "Design Systems"],
  },
  {
    id: "Full Stack Engineer",
    title: "Full Stack Assesment",
    description: "Tests frontend, backend, database, and API development skills",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Hard",
    topics: ["Fronend", "Backend", "Databases", "Devops and API's"],
  },
  {
    id: "Backend Developer",
    title: "Backend Assessment",
    description: "Tests server-side development, databases, APIs, and deployment skills",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Backend Development", "Databases", "API's", "Devops and deployment"],
  },
  {
    id: "Data Analyst",
    title: "Data Analyst Assessment",
    description: "Evaluates data analysis, visualization, and statistical skills",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Data Analysis", "SQL Spreadsheets", "Statistics"],
  },
  {
    id: "Business Analyst",
    title: "Businness Analyst Assessment",
    description: "Evaluates data analysis, requirements gathering, and documentation skills",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Analysis", "Data & Reporting", "Documentation"],
  },
  {
    id: "QA / Software Tester",
    title: "QA / Software Assessment",
    description: "valuates testing concepts, automation tools",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Software testing", "Automation tools", "API Testing"],
  },
  {
    id: "ML Engineer",
    title: "ML Engineer Assessment",
    description: "valuates machine learning, data processing, and model development skills",
    icon: Code,
    questions: 10,
    duration: "25 min",
    difficulty: "Medium",
    topics: ["Machine Learning", "Libraries", "Deep learning"],
  },
  {
    id: "Digital Marketing",
    title: "Digital Marketing Assessment",
    description: "Evaluates marketing strategy, analytics, and content creation skills",
    icon: Code,
    questions: 10, 
    duration: "25 min",
    difficulty: "Easy",
    topics: ["SEO & Analytics", "Social Media", "Marketing Tools"],
  }
];

const stats = [
  { label: "Candidates Assessed", value: "12,500+", icon: Users },
  { label: "Avg. Completion Time", value: "32 min", icon: Clock },
  { label: "Hiring Success Rate", value: "94%", icon: Trophy },
];

const Index = () => {  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 gradient-primary border-0">
              For Candidates looking for job
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Improve your <span className="gradient-text">skills</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive assessment platform to evaluate candidate's own knowledge on aptitude, 
              reasoning, and technical skills with precision and efficiency.
            </p>
            <div className="flex items-center justify-center gap-4">
<Button 
                    className="w-full gradient-primary group-hover:glow-primary transition-shadow"
                    onClick={() => navigate(`/quiz/test}`)}
                  >                Start Assessment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Assessment Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
Select from our curated assessments to evaluate your skills, identify weaknesses, and improve effectively.            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentCategories.map((category, index) => (
              <Card 
                key={category.id} 
                className="card-hover bg-card border-border group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-4 group-hover:glow-primary transition-shadow">
                      <category.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <Badge variant="secondary">{category.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span>{category.questions} questions</span>
                    <span>•</span>
                    <span>{category.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
<Button 
                    className="w-full gradient-primary group-hover:glow-primary transition-shadow"
                    onClick={() => navigate(`/quiz/${category.id}`)}
                  >                    Start Test
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden gradient-primary p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to find your next star hire?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Start assessing candidates today and build your dream team with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;