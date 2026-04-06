import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const AIChatbot = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your AI recruitment assistant. Ask me about jobs, resume upload, tests, or interview prep."
    }
  ]);

  const [inputValue, setInputValue] = useState("");

  const getBotResponse = (message: string) => {
    const text = message.toLowerCase();

    // resume upload
    if (
      text.includes("resume") ||
      text.includes("upload") ||
      text.includes("cv")
    ) {
      navigate("/upload");
      return {
        answer: "You can upload your resume on the Resume Parser page. I'm taking you there.",
        suggestions: ["Parse my resume", "Extract skills", "Upload PDF resume"]
      };
    }

    // jobs
    if (
      text.includes("job") ||
      text.includes("apply") ||
      text.includes("opening")
    ) {
      navigate("/jobs");
      return {
        answer: "Here are available jobs matching your profile.",
        suggestions: ["Show remote jobs", "Frontend jobs", "AI jobs"]
      };
    }

    // tests
    if (
      text.includes("test") ||
      text.includes("assessment") ||
      text.includes("quiz")
    ) {
      navigate("/test");
      return {
        answer: "You can take skill assessments here. I'm opening the test page.",
        suggestions: ["Java test", "React test", "Aptitude test"]
      };
    }

    // interview prep
    if (
      text.includes("interview") ||
      text.includes("prepare") ||
      text.includes("prep")
    ) {
      navigate("/interviewprep");
      return {
        answer: "Here are interview preparation resources.",
        suggestions: [
          "Behavioral interview tips",
          "Technical interview prep",
          "HR questions"
        ]
      };
    }

    // dashboard
    if (
      text.includes("dashboard") ||
      text.includes("profile")
    ) {
      navigate("/dashboard");
      return {
        answer: "Opening your dashboard.",
        suggestions: [
          "Check profile",
          "View scores",
          "See recommendations"
        ]
      };
    }

    // job posting
    if (
      text.includes("post job") ||
      text.includes("recruiter") ||
      text.includes("hire")
    ) {
      navigate("/job-upload");
      return {
        answer: "You can post a job from here.",
        suggestions: [
          "Post frontend job",
          "Add requirements",
          "Create job listing"
        ]
      };
    }

    // unrelated
    return {
      answer:
        "I can help only with recruitment tasks like jobs, resume upload, tests, and interview prep.",
      suggestions: [
        "Upload resume",
        "Find jobs",
        "Take test",
        "Interview prep"
      ]
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;

    setMessages(prev => [
      ...prev,
      { role: "user", text: userMsg }
    ]);

    setInputValue("");

    setTimeout(() => {
      const response = getBotResponse(userMsg);

      setMessages(prev => [
        ...prev,
        { role: "bot", text: response.answer }
      ]);
    }, 500);
  };

  return (
    <>
      {/* Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-primary text-white shadow-glow"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-card rounded-2xl shadow-2xl border flex flex-col"
          >
            {/* Header */}
            <div className="gradient-primary p-4 text-white">
              <h3 className="font-semibold text-lg">
                Recruitment AI Assistant
              </h3>
              <p className="text-xs">
                Ask about jobs, resume, tests, interviews
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && handleSend()
                  }
                  placeholder="Ask something..."
                />
                <Button onClick={handleSend}>
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;