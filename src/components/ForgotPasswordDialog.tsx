import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";
import { z } from "zod";
const emailSchema = z.string().email("Please enter a valid email address");
interface ForgotPasswordDialogProps {
  children: React.ReactNode;
}
const ForgotPasswordDialog = ({ children }: ForgotPasswordDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }
    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    setIsLoading(false);
    if (resetError) {
      toast({
        title: "Error",
        description: resetError.message,
        variant: "destructive",
      });
      return;
    }
    setEmailSent(true);
    toast({
      title: "Check your email",
      description: "We've sent you a password reset link.",
    });
  };
  const handleClose = () => {
    setIsOpen(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setEmail("");
      setError("");
      setEmailSent(false);
    }, 200);
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            {emailSent
              ? "Check your email for a password reset link."
              : "Enter your email address and we'll send you a link to reset your password."}
          </DialogDescription>
        </DialogHeader>
        {emailSent ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              If an account exists for <strong>{email}</strong>, you will receive a password reset email shortly.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter className="sm:justify-start">
              <Button
                type="submit"
                className="w-full gradient-primary text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ForgotPasswordDialog;