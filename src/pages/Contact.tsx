import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, ValidationError } from "@formspree/react";

const Contact = () => {
  const { toast } = useToast();

  const [state, handleSubmit] = useForm("xvgrnwjq");

  if (state.succeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Message Sent ✅</h2>
          <p className="text-muted-foreground">
            Thanks! We'll get back to you within 24 hours.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you shortly
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input name="firstName" placeholder="First Name" required />
                    <Input name="lastName" placeholder="Last Name" required />
                  </div>

                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                  <ValidationError field="email" errors={state.errors} />

                  <Input
                    name="phone"
                    placeholder="Phone (Optional)"
                  />

                  <Input
                    name="subject"
                    placeholder="Subject"
                    required
                  />

                  <Textarea
                    name="message"
                    placeholder="Your message..."
                    rows={6}
                    required
                  />
                  <ValidationError field="message" errors={state.errors} />

                  <Button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full gradient-primary text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {state.submitting ? "Sending..." : "Send Message"}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* right side unchanged */}
        </div>
      </div>
    </div>
  );
};

export default Contact;