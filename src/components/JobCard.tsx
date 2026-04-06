import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    skills: string[];
    posted: string;
  };
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-card transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {job.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              {job.salary}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Posted {job.posted}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {job.skills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gradient-primary text-white">
            <Briefcase className="w-4 h-4 mr-2" />
            Apply Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;
