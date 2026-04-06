import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, loading, signOut } = useAuth();

  // Public nav items (landing page only)
  const publicNavItems = [
    { name: "Home", path: "/" },
  ];

  // Candidate nav items
  const candidateNavItems = [
    { name: "About", path: "/about" },
    { name: "Jobs", path: "/jobs" },
        { name: "Tests", path: "/tests" },

    { name: "Upload Resume", path: "/upload" },
    { name: "Feature hub", path: "/ai-hub" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },
  ];

  // Recruiter nav items
  const recruiterNavItems = [
    { name: "Post Job", path: "/job-upload" },
    { name: "HR Analytics", path: "/hr-dashboard" },
        { name: "Create Test", path: "/create-test" },

    { name: "Feature Hub", path: "/ai-hub" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },

  ];

  // Determine which nav items to show
  const getNavItems = () => {
    if (loading) return []; // Don't show nav items while loading
    if (!user) return publicNavItems;
    if (role === "recruiter") return recruiterNavItems;
    if (role === "candidate") return candidateNavItems;
    // User is logged in but role not yet loaded - show empty until role loads
    return [];
  };

  const navItems = getNavItems();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">HireSense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth">
                    <Button className="gradient-primary text-white shadow-glow">
                      Get Started
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!loading && (
                  <>
                    {user ? (
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full mt-4 flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full gradient-primary text-white mt-4">
                          Get Started
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
