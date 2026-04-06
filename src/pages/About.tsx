import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Zap, Award } from "lucide-react";

const About = () => {
  const values = [
    { icon: Target, title: "Mission-Driven", desc: "Democratizing access to quality jobs through AI" },
    { icon: Zap, title: "Innovation First", desc: "Constantly pushing boundaries in recruitment tech" },
    { icon: Users, title: "People-Centric", desc: "Focusing on candidate and recruiter experience" },
    { icon: Award, title: "Excellence", desc: "Delivering superior matching accuracy and results" }
  ];

  const team = [
    { name: "Mahathi N", role: "AI/ML+FullStack"},
    { name: "Siri Chandhana", role: "Frontend" },
    { name: "Srivalli N", role: "UI/UX"},
    { name: "Sriram Pranav", role: "AI/ML"}
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            About <span className="text-gradient">HireSense</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to revolutionize recruitment by making hiring faster, 
            smarter, and more equitable through the power of artificial intelligence.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="gradient-secondary border-0">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
              <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
                HireSense leverages cutting-edge natural language processing and machine learning 
                to eliminate bias, reduce time-to-hire by 70%, and ensure every candidate is matched 
                with opportunities that truly fit their skills and aspirations.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "NLP-Powered Resume Parsing", desc: "Extract skills, experience, and qualifications with 98% accuracy" },
              { title: "Intelligent Skill Matching", desc: "Our ML algorithms match candidates to jobs based on true compatibility" },
              { title: "Automated Assessments", desc: "Coding challenges and aptitude tests integrated seamlessly" },
              { title: "AI Interview Bot", desc: "Conduct scalable preliminary interviews with conversational AI" },
              { title: "Real-Time Analytics", desc: "Track candidate pipelines, skill gaps, and hiring metrics" },
              { title: "Bias Reduction", desc: "Anonymized screening ensures fair evaluation of all candidates" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-card transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto mb-4"></div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-primary mb-1">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
