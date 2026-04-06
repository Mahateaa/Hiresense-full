import { Play, Clock, Eye, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const videoCategories = [
  {
    id: "behavioral",
    title: "Behavioral Interviews",
    videos: [
      {
        id: "1",
        title: "STAR Method: Answer Any Behavioral Question",
        channel: "Interview Prep Pro",
        views: "2.3M views",
        duration: "12:45",
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop",
        link: "https://www.youtube.com/watch?v=uQEuo7woEEk",
      },
      {
        id: "2",
        title: "Top 10 Behavioral Interview Questions",
        channel: "Career Guide",
        views: "1.8M views",
        duration: "18:30",
        thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=225&fit=crop",
        link: "https://www.youtube.com/watch?v=_MgsOydZ1Bg",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Interviews",
    videos: [
      {
        id: "3",
        title: "Coding Interview Preparation Guide",
        channel: "Tech Interview Hub",
        views: "3.5M views",
        duration: "25:00",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
        link: "https://www.youtube.com/watch?v=Q4C3ZRJLnac",
      },
      {
        id: "4",
        title: "System Design Interview Basics",
        channel: "Engineering Explained",
        views: "1.2M views",
        duration: "32:15",
        thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=225&fit=crop",
        link: "https://www.youtube.com/watch?v=L9TfZdODuFQ",
      },
    ],
  },
  {
    id: "general",
    title: "General Interview Tips",
    videos: [
      {
        id: "5",
        title: "How to Introduce Yourself Professionally",
        channel: "Interview Success",
        views: "5.1M views",
        duration: "8:20",
        thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=225&fit=crop",
        link: "https://www.youtube.com/watch?v=Qr7la25a82E",
      },
      {
        id: "6",
        title: "Common Interview Mistakes to Avoid",
        channel: "HR Insights",
        views: "890K views",
        duration: "15:45",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
        link: "https://www.youtube.com/watch?v=r3QKbZZtVJAs",
      },
    ],
  },
];

const InterviewPrep = () => {
 const handleVideoClick = (link: string) => {
  window.open(link, "_blank");
};


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 gradient-primary border-0">
              <BookOpen className="mr-2 h-3 w-3" />
              Interview Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Interview Prep</span> Videos
            </h1>
            <p className="text-lg text-muted-foreground">
              Curated collection of the best interview preparation videos to help 
              candidates succeed in their next opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Video Categories */}
      <section className="py-12">
        <div className="container space-y-16">
          {videoCategories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-1 rounded-full gradient-primary" />
                <h2 className="text-2xl font-bold">{category.title}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="card-hover bg-card border-border overflow-hidden cursor-pointer group"
                    onClick={() => handleVideoClick(video.link)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary glow-primary">
                          <Play className="h-8 w-8 text-primary-foreground fill-current" />
                        </div>
                      </div>
                      <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0">
                        <Clock className="mr-1 h-3 w-3" />
                        {video.duration}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </CardTitle>
                      <CardDescription>{video.channel}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {video.views}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tip Section */}
      <section className="py-16">
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden bg-card border border-border p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-10 blur-3xl" />
            <div className="relative max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">💡 Pro Tip</h3>
              <p className="text-muted-foreground">
                Practice answering questions out loud before your interview. Record yourself 
                and watch the playback to identify areas for improvement. This helps build 
                confidence and refine your communication skills.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InterviewPrep;