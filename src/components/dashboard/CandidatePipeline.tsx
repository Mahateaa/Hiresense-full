import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, MessageSquare, FileCheck, Trophy } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  match: number;
}

interface PipelineStage {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  candidates: Candidate[];
}

const CandidatePipeline = () => {
  const pipelineStages: PipelineStage[] = [
    {
      id: "applied",
      title: "Applied",
      icon: Users,
      color: "bg-blue-500",
      candidates: [
        { id: "1", name: "Alex Chen", role: "Full Stack Dev", avatar: "AC", match: 92 },
        { id: "2", name: "Sarah Kim", role: "Backend Dev", avatar: "SK", match: 88 },
        { id: "3", name: "Mike Ross", role: "DevOps", avatar: "MR", match: 85 },
      ],
    },
    {
      id: "screening",
      title: "Screening",
      icon: FileCheck,
      color: "bg-purple-500",
      candidates: [
        { id: "4", name: "Emily Davis", role: "Frontend Dev", avatar: "ED", match: 91 },
        { id: "5", name: "John Smith", role: "ML Engineer", avatar: "JS", match: 89 },
      ],
    },
    {
      id: "interview",
      title: "Interview",
      icon: MessageSquare,
      color: "bg-amber-500",
      candidates: [
        { id: "6", name: "Lisa Wang", role: "Data Scientist", avatar: "LW", match: 94 },
      ],
    },
    {
      id: "offer",
      title: "Offer",
      icon: UserCheck,
      color: "bg-green-500",
      candidates: [
        { id: "7", name: "David Park", role: "Senior SWE", avatar: "DP", match: 96 },
      ],
    },
    {
      id: "hired",
      title: "Hired",
      icon: Trophy,
      color: "bg-gradient-primary",
      candidates: [],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Candidate Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage, stageIdx) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIdx * 0.1 }}
              className="min-w-[250px] flex-shrink-0"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className={`p-2 rounded-lg ${stage.color}`}>
                  <stage.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">{stage.title}</span>
                <Badge variant="secondary" className="ml-auto">
                  {stage.candidates.length}
                </Badge>
              </div>
              
              <div className="space-y-3 min-h-[200px] p-3 rounded-lg bg-muted/50 border border-border">
                {stage.candidates.length === 0 ? (
                  <div className="flex items-center justify-center h-[150px] text-muted-foreground text-sm">
                    No candidates
                  </div>
                ) : (
                  stage.candidates.map((candidate, idx) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: stageIdx * 0.1 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-card border border-border shadow-sm cursor-pointer hover:shadow-card transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-primary text-white text-xs">
                            {candidate.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${candidate.match}%` }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-full bg-gradient-primary rounded-full"
                          />
                        </div>
                        <span className="ml-2 text-xs font-medium text-primary">
                          {candidate.match}%
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatePipeline;
