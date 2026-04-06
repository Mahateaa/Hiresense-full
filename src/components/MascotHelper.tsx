import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  "💡 Tip: Complete your profile to get better job matches!",
  "🎯 Pro tip: Add more skills to improve your matching accuracy!",
  "📊 Did you know? Companies using AI hiring save 70% time!",
  "✨ Try our AI Resume Parser for instant skill extraction!",
  "🚀 Upload your resume to get personalized job recommendations!",
];

const MascotHelper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show mascot after 3 seconds
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  useEffect(() => {
    // Rotate tips every 8 seconds
    if (isVisible) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % tips.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-24 left-6 z-40 max-w-xs"
        >
          <div className="relative">
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2 p-4 bg-card border border-border rounded-2xl rounded-bl-sm shadow-lg"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted"
                onClick={handleDismiss}
              >
                <X className="w-3 h-3" />
              </Button>
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm"
                >
                  {tips[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Mascot */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow cursor-pointer"
              onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MascotHelper;
