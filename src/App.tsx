import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";
import MascotHelper from "./components/MascotHelper";
import Home from "./pages/Home";
import About from "./pages/About";
import Jobs from "./pages/Jobs";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import HRDashboard from "./pages/HRDashboard";
import JobUpload from "./pages/JobUpload";
import AIHub from "./pages/AIHub";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import InterviewPrep from "./pages/interviewprep"
import Test from "./pages/test"; // path may differ
import Quiz from "./pages/Quiz";
import ResetPassword from "./pages/ResetPassword";
import ResumeParser from "@/pages/ResumeParser";
import AiExplainability from "@/pages/AiExplainability";
import AiSkillMatching from "@/pages/AiSkillMatching";
import CreateTest from "./pages/CreateTest";
import JobDetail from "./pages/JobDetail";
import Tests from "./pages/Tests";
import TakeTest from "./pages/TakeTest";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/jobs" element={<Jobs />} />
<Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/tests" element={<Tests />} />
                  <Route path="/take-test/:id" element={<TakeTest />} />                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/hr-dashboard" element={<HRDashboard />} />
                  <Route path="/job-upload" element={<JobUpload />} />
                  <Route path="/ai-hub" element={<AIHub />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
    <Route path="/interviewprep" element={<InterviewPrep />} />
    <Route path="/test" element={<Test />} />
            <Route path="/quiz/:categoryId" element={<Quiz />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/ai/resume-parser" element={<ResumeParser />} />
<Route path="/ai/explainability" element={<AiExplainability />} />
<Route path="/ai/skill-matching" element={<AiSkillMatching />} />
                  <Route path="/create-test" element={<CreateTest />} />


                </Routes>
              </main>
              <Footer />
              <AIChatbot />
              <MascotHelper />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
