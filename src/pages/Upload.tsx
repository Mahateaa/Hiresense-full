// Upload.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;         
};

type MatchResult = {
  title: string;
  match: number;
  techMatch: number;
  softMatch: number;
  matchedTech: string[];
  matchedSoft: string[];
};

// ---------- Explainability UI helpers ----------
const TECH_WEIGHT = 0.8;
const SOFT_WEIGHT = 0.2;

const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\bnodejs\b/g, "node.js")
    .replace(/\breactjs\b/g, "react")
    .replace(/\bnextjs\b/g, "next.js")
    .replace(/\bpowerbi\b/g, "power bi");

// Keep these aligned with computeMatches()
const SYNONYMS: Record<string, string[]> = {
  "node.js": ["node", "nodejs"],
  javascript: ["js"],
  typescript: ["ts"],
  react: ["reactjs"],
  "next.js": ["nextjs"],
  postgresql: ["postgres"],
  "power bi": ["powerbi"],
  "machine learning": ["ml"],
  "artificial intelligence": ["ai"],
};

const RELATED: Record<string, string[]> = {
  sql: ["mysql", "postgresql", "sqlite"],
  "machine learning": ["python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"],
  react: ["javascript", "typescript", "html", "css"],
  docker: ["kubernetes", "ci/cd"],
  git: ["github", "gitlab"],
  "data visualization": ["tableau", "power bi", "matplotlib"],
};

const findWhyMatched = (required: string, haveSet: Set<string>) => {
  const r = normalize(required);

  // exact
  if (haveSet.has(r)) return { type: "exact" as const, via: required };

  // synonym
  const syns = SYNONYMS[r] || [];
  for (const s of syns) {
    if (haveSet.has(normalize(s))) return { type: "synonym" as const, via: s };
  }

  // related -> partial
  const rels = RELATED[r] || [];
  for (const rel of rels) {
    if (haveSet.has(normalize(rel))) return { type: "partial" as const, via: rel, credit: 0.35 };
  }

  return null;
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

// ---------- Explainability Card ----------
const ExplainMatch = ({
  match,
  userTech,
  userSoft,
}: {
  match: MatchResult;
  userTech: string[];
  userSoft: string[];
}) => {
  const haveTech = new Set(userTech.map(normalize));
  const haveSoft = new Set(userSoft.map(normalize));

  return (
    <div className="mt-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">Why this score?</div>
          <div className="text-xs text-muted-foreground">
            We combine Technical + Soft skills using weights: Tech {Math.round(TECH_WEIGHT * 100)}% and Soft{" "}
            {Math.round(SOFT_WEIGHT * 100)}%.
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{match.match}%</div>
          <div className="text-xs text-muted-foreground">Final Match</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Technical Match</span>
            <span className="font-medium">{match.techMatch}%</span>
          </div>
          <ProgressBar value={match.techMatch} />
          <div className="mt-2 flex flex-wrap gap-2">
            {(match.matchedTech || []).slice(0, 12).map((req) => {
              const why = findWhyMatched(req, haveTech);
              const label =
                why?.type === "exact"
                  ? "Exact"
                  : why?.type === "synonym"
                  ? `Synonym (${why.via})`
                  : why?.type === "partial"
                  ? `Partial (+${Math.round((why.credit || 0) * 100)}%) via ${why.via}`
                  : "—";

              const variant =
                why?.type === "partial" ? "outline" : why?.type === "synonym" ? "secondary" : "default";

              return (
                <Badge key={req} variant={variant as any} className="text-xs">
                  {req}
                  <span className="ml-2 opacity-70">• {label}</span>
                </Badge>
              );
            })}
          </div>

          <div className="mt-2 text-[11px] text-muted-foreground">
            Normalization example: “reactjs” → “react”, “nodejs” → “node.js”, “powerbi” → “power bi”.
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Soft Skills Match</span>
            <span className="font-medium">{match.softMatch}%</span>
          </div>
          <ProgressBar value={match.softMatch} />
          <div className="mt-2 flex flex-wrap gap-2">
            {(match.matchedSoft || []).length ? (
              match.matchedSoft.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                  <span className="ml-2 opacity-70">• Matched</span>
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No soft skills matched for this role.</span>
            )}
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground mb-1">How scoring works</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Exact skill match = full point</li>
            <li>Synonym match (e.g., JS → JavaScript) = full point</li>
            <li>Related skill match = partial credit (0.35)</li>
            <li>
              Final = ({Math.round(TECH_WEIGHT * 100)}% × TechMatch) + ({Math.round(SOFT_WEIGHT * 100)}% × SoftMatch)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const { toast } = useToast();

  // -------- Matching (more roles + more skills + weighted) --------
  const computeMatches = (techSkills: string[], softSkillsArr: string[]): MatchResult[] => {
    const haveTech = new Set(techSkills.map(normalize));
    const haveSoft = new Set(softSkillsArr.map(normalize));

    const hasSkill = (required: string, have: Set<string>) => {
      const r = normalize(required);
      if (have.has(r)) return true;
      const syns = SYNONYMS[r] || [];
      return syns.some((s) => have.has(normalize(s)));
    };

    const partialCredit = (required: string, have: Set<string>) => {
      const r = normalize(required);
      const related = RELATED[r] || [];
      for (const rel of related) {
        if (have.has(normalize(rel))) return 0.35; // partial credit
      }
      return 0;
    };

    // ✅ Expanded job types
    const jobs = [
      {
        title: "Frontend Developer",
        requiredTech: [
          "HTML", "CSS", "JavaScript", "React", "TypeScript",
          "React Router", "Redux", "Tailwind CSS", "Bootstrap",
          "REST", "Git", "GitHub", "Vite", "Webpack",
          "Jest", "Cypress", "Figma", "Canva",
        ],
        requiredSoft: ["Communication", "Teamwork", "Problem Solving", "Attention to Detail", "Time Management"],
      },
      {
        title: "UI/UX Designer",
        requiredTech: [
          "Figma", "Canva", "Adobe Photoshop", "Adobe Illustrator",
          "HTML", "CSS", "Prototyping", "Wireframing", "Design Systems",
        ],
        requiredSoft: ["Creativity", "Communication", "Attention to Detail", "Collaboration"],
      },
      {
        title: "Full Stack Engineer",
        requiredTech: [
          "JavaScript", "TypeScript", "Node.js", "Express", "React",
          "REST", "SQL", "MySQL", "PostgreSQL", "MongoDB",
          "Git", "GitHub", "Docker", "CI/CD", "Swagger", "Postman", "Linux",
        ],
        requiredSoft: ["Problem Solving", "Communication", "Adaptability", "Collaboration", "Decision Making"],
      },
      {
        title: "Backend Developer",
        requiredTech: [
          "Node.js", "Express", "REST", "SQL", "PostgreSQL", "MySQL",
          "Redis", "Docker", "Linux", "Nginx",
          "Git", "GitHub", "CI/CD", "Swagger", "Postman",
        ],
        requiredSoft: ["Problem Solving", "Attention to Detail", "Critical Thinking", "Communication"],
      },
      {
        title: "Data Analyst",
        requiredTech: [
          "SQL", "Excel", "Google Sheets",
          "Power BI", "Tableau", "Looker Studio",
          "Python", "Pandas", "Matplotlib",
          "Data Visualization", "Statistics",
        ],
        requiredSoft: ["Attention to Detail", "Communication", "Critical Thinking", "Presentation Skills"],
      },
      {
        title: "Business Analyst",
        requiredTech: [
          "Excel", "Google Sheets", "Power BI", "Tableau",
          "SQL", "Documentation", "Requirements Gathering",
          "Jira", "Notion",
        ],
        requiredSoft: ["Communication", "Critical Thinking", "Collaboration", "Decision Making"],
      },
      {
        title: "DevOps Engineer",
        requiredTech: [
          "Linux", "Git", "Docker", "Kubernetes",
          "AWS", "Azure", "GCP",
          "Nginx", "CI/CD", "Jenkins", "GitHub Actions",
          "Networking",
        ],
        requiredSoft: ["Problem Solving", "Attention to Detail", "Communication", "Adaptability"],
      },
      {
        title: "QA / Software Tester",
        requiredTech: [
          "Unit Testing", "Jest", "Cypress", "Playwright",
          "Jira", "Bug Tracking",
          "Postman", "Swagger", "Git",
        ],
        requiredSoft: ["Attention to Detail", "Critical Thinking", "Communication"],
      },
      {
        title: "ML Engineer",
        requiredTech: [
          "Python", "Machine Learning", "Deep Learning",
          "Pandas", "NumPy", "Scikit-learn",
          "PyTorch", "TensorFlow",
          "SQL", "Git", "Docker",
          "NLP", "Computer Vision", "Matplotlib",
        ],
        requiredSoft: ["Critical Thinking", "Problem Solving", "Communication", "Creativity"],
      },
      {
        title: "Digital Marketing Executive",
        requiredTech: [
          "Canva", "Content Writing", "SEO", "Google Analytics",
          "Social Media", "Email Marketing",
          "Excel", "Power BI",
        ],
        requiredSoft: ["Creativity", "Communication", "Networking", "Time Management"],
      },
    ];

    const results: MatchResult[] = jobs.map((job) => {
      let techScore = 0;
      const matchedTech: string[] = [];

      for (const req of job.requiredTech) {
        if (hasSkill(req, haveTech)) {
          techScore += 1;
          matchedTech.push(req);
        } else {
          techScore += partialCredit(req, haveTech); // 0 or 0.35
        }
      }

      const techMatch = job.requiredTech.length
        ? Math.round((techScore / job.requiredTech.length) * 100)
        : 0;

      const matchedSoft = job.requiredSoft.filter((s) => hasSkill(s, haveSoft));
      const softMatch = job.requiredSoft.length
        ? Math.round((matchedSoft.length / job.requiredSoft.length) * 100)
        : 0;

      const match = Math.round(TECH_WEIGHT * techMatch + SOFT_WEIGHT * softMatch);

      return {
        title: job.title,
        match,
        techMatch,
        softMatch,
        matchedTech,
        matchedSoft,
      };
    });

    results.sort((a, b) => b.match - a.match);
    return results;
  };

  // ---- Upload only stores the file ----
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF resume only.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    setTechnicalSkills([]);
    setSoftSkills([]);
    setProfile(null);
    setMatches([]);
    setIsProcessing(false);
  };

  // ---- Calls backend to parse ----
  const handleProcessResume = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("http://localhost:5000/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.details || json?.error || "Failed to parse resume");

      const tech: string[] = Array.isArray(json?.extracted?.technicalSkills)
        ? json.extracted.technicalSkills
        : [];

      const soft: string[] = Array.isArray(json?.extracted?.softSkills)
        ? json.extracted.softSkills
        : [];

      const p: Profile | null = json?.extracted?.profile ?? null;

      setTechnicalSkills(tech);
      setSoftSkills(soft);
      setProfile(p);

      setMatches(computeMatches(tech, soft));

      toast({
        title: "Resume processed!",
        description: `Extracted ${tech.length} technical skills and ${soft.length} soft skills.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Parsing failed",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAnySkills = technicalSkills.length > 0 || softSkills.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Upload Your <span className="text-gradient">Resume</span>
          </h1>
          <p className="text-xl text-muted-foreground">Our AI will analyze your resume and match you with opportunities</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>Supported format: PDF (Max 5MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                    {!file ? (
                      <>
                        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                      </>
                    ) : (
                      <>
                        <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <p className="text-lg font-medium mb-2">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                    )}
                  </div>

                  <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>

                {file && !isProcessing && (
                  <Button className="w-full mt-4 gradient-primary text-white" onClick={handleProcessResume} disabled={!file || isProcessing}>
                    Process Resume
                  </Button>
                )}

                {isProcessing && (
                  <div className="mt-6 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">AI is analyzing your resume...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {hasAnySkills && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
                  Results
                </CardTitle>
                <CardDescription>
                  {hasAnySkills ? "Extracted profile + skills" : "Upload a resume and click Process Resume"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {profile && (
                  <div className="mb-4 rounded-lg border p-3 text-sm">
                    <div className="font-semibold">{profile.name || "Name not found"}</div>
                    <div className="text-muted-foreground">{profile.email || "Email not found"}</div>
                    <div className="text-muted-foreground">{profile.phone || "Phone not found"}</div>
                  </div>
                )}

                {hasAnySkills ? (
                  <>
                    {technicalSkills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Technical Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {technicalSkills.map((skill, idx) => (
                            <motion.div
                              key={`${skill}-${idx}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.02 }}
                            >
                              <Badge variant="secondary">{skill}</Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {softSkills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {softSkills.map((skill, idx) => (
                            <motion.div
                              key={`${skill}-${idx}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.02 }}
                            >
                              <Badge variant="outline">{skill}</Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matches.length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-2">Match Results</h4>
                        <div className="space-y-4">
                          {matches.slice(0, 5).map((m) => (
                            <div key={m.title} className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-medium">{m.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  Tech: {m.techMatch}% | Soft: {m.softMatch}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Matched Tech: {m.matchedTech.slice(0, 10).join(", ")}
                                  {m.matchedTech.length > 10 ? "..." : ""}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Matched Soft: {m.matchedSoft.join(", ") || "—"}
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-green-500 whitespace-nowrap">{m.match}% Match</span>
                            </div>
                          ))}
                        </div>

                        {/* ✅ Explainability for best match */}
                        {matches.length > 0 && (
                          <ExplainMatch match={matches[0]} userTech={technicalSkills} userSoft={softSkills} />
                        )}
                      </div>
                    )}

                    <Button className="w-full gradient-primary text-white">View Matched Jobs</Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No skills extracted yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
