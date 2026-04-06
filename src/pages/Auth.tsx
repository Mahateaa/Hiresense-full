import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Briefcase, Users, Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { PasswordInput } from "@/components/PasswordInput";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserRole = "recruiter" | "candidate";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshRole } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // ✅ Auto-redirect already logged-in users
  // ✅ BUT only when user is on LOGIN tab (prevents fighting with signup flow)
  useEffect(() => {
    let isMounted = true;

    const checkAndRedirect = async (userId: string) => {
      try {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();

        if (!isMounted) return;

        if (roleData?.role === "recruiter") {
          navigate("/hr-dashboard", { replace: true });
        } else {
          navigate("/jobs", { replace: true });
        }
      } catch {
        if (isMounted) navigate("/jobs", { replace: true });
      }
    };

    if (!isLogin || isLoading) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isMounted) {
        checkAndRedirect(session.user.id);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate, isLogin, isLoading]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  // ✅ SIGNUP (no redirect to /login; just switch tab to Login)
  const handleSignUp = async () => {
    if (!validateForm()) return;

    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're a recruiter or candidate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description:
            error.message === "User already registered"
              ? "This email is already registered. Try logging in instead."
              : error.message,
          variant: "destructive",
        });
        return;
      }

      // If email confirmation is ON, user may be null
      if (!data.user) {
        toast({
          title: "Check your email",
          description: "We sent a confirmation link. After verifying, login to continue.",
        });

        // ✅ Switch to login tab on SAME PAGE
        setIsLogin(true);
        setPassword("");
        return;
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        full_name: fullName || null,
        company_name: selectedRole === "recruiter" ? companyName : null,
      });

      if (profileError) {
        console.error(profileError);
        toast({
          title: "Profile creation failed",
          description: profileError.message,
          variant: "destructive",
        });
        return;
      }

      // Create role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: selectedRole,
      });

      if (roleError) {
        console.error(roleError);
        toast({
          title: "Role assignment failed",
          description: roleError.message,
          variant: "destructive",
        });
        return;
      }

      // ✅ Sign out so they must login (your intended flow)
      await supabase.auth.signOut();

      toast({
        title: "Account created successfully!",
        description: "Please login now to continue.",
      });

      // ✅ Switch to login tab (NO route change)
      setIsLogin(true);

      // Optional cleanup
      setPassword("");
      setSelectedRole(null);
      setFullName("");
      setCompanyName("");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Sign up failed",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGIN (fixed: no premature clearing/loading reset)
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description:
            error.message === "Invalid login credentials"
              ? "Invalid email or password. Please try again."
              : error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

        await refreshRole();

        if (roleData?.role === "recruiter") {
          navigate("/hr-dashboard", { replace: true });
        } else {
          navigate("/jobs", { replace: true });
        }
      }
    } catch (err: any) {
      console.error(err);
      navigate("/jobs", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">HireSense</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h1>

            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to continue to your dashboard"
                : "Create an account to start your journey"}
            </p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <Tabs
                value={isLogin ? "login" : "signup"}
                onValueChange={(v) => {
                  setIsLogin(v === "login");
                  setErrors({});
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label>I am a...</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={selectedRole === "candidate" ? "default" : "outline"}
                          className={`h-auto py-4 flex-col gap-2 ${
                            selectedRole === "candidate" ? "gradient-primary text-white" : ""
                          }`}
                          onClick={() => setSelectedRole("candidate")}
                        >
                          <Users className="w-6 h-6" />
                          <span>Candidate</span>
                          <span className="text-xs opacity-80">Looking for jobs</span>
                        </Button>

                        <Button
                          type="button"
                          variant={selectedRole === "recruiter" ? "default" : "outline"}
                          className={`h-auto py-4 flex-col gap-2 ${
                            selectedRole === "recruiter" ? "gradient-primary text-white" : ""
                          }`}
                          onClick={() => setSelectedRole("recruiter")}
                        >
                          <Briefcase className="w-6 h-6" />
                          <span>Recruiter</span>
                          <span className="text-xs opacity-80">Hiring talent</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    {selectedRole === "recruiter" && (
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Acme Inc."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>

                    {isLogin && (
                      <ForgotPasswordDialog>
                        <button type="button" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      </ForgotPasswordDialog>
                    )}
                  </div>

                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full gradient-primary text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>{isLogin ? "Sign In" : "Create Account"}</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
