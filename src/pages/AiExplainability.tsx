// src/pages/AiExplainability.tsx
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, Loader2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { computeMatches, explainMatchForJob, type ExplainBreakdown } from "@/lib/skillMatching";
import { useLocation } from "react-router-dom";

type ParsedProfile = { name?: string | null; email?: string | null; phone?: string | null };

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

export default function AiExplainability() {
  const { toast } = useToast();
  const location = useLocation();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [profile, setProfile] = useState<ParsedProfile | null>(null);

  const [selectedJob, setSelectedJob] = useState<string>("");

  const matches = useMemo(() => computeMatches(technicalSkills, softSkills), [technicalSkills, softSkills]);

  // allow auto-select from query param: ?job=Frontend%20Developer
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const job = params.get("job");
    if (job) setSelectedJob(job);
  }, [location.search]);

  // default to best match once matches exist
  useEffect(() => {
    if (!selectedJob && matches.length > 0) setSelectedJob(matches[0].title);
  }, [matches, selectedJob]);

  const breakdown: ExplainBreakdown | null = useMemo(() => {
    if (!selectedJob) return null;
    return explainMatchForJob(selectedJob, technicalSkills, softSkills);
  }, [selectedJob, technicalSkills, softSkills]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF resume only.", variant: "destructive" });
      return;
    }

    setFile(uploadedFile);
    setTechnicalSkills([]);
    setSoftSkills([]);
    setProfile(null);
    setSelectedJob("");
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("http://localhost:5000/api/parse-resume", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.details || json?.error || "Failed to parse resume");

      const tech = Array.isArray(json?.extracted?.technicalSkills) ? json.extracted.technicalSkills : [];
      const soft = Array.isArray(json?.extracted?.softSkills) ? json.extracted.softSkills : [];
      const p = json?.extracted?.profile ?? null;

      setTechnicalSkills(tech);
      setSoftSkills(soft);
      setProfile(p);

      toast({
        title: "Resume processed!",
        description: `Extracted ${tech.length} technical skills and ${soft.length} soft skills.`,
      });
    } catch (err: any) {
      toast({ title: "Parsing failed", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAny = technicalSkills.length > 0 || softSkills.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Transparent Matching</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Explainability</h1>
          <p className="text-muted-foreground">
            Upload a resume to see exactly how the match score is calculated — best match or any selected job.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>PDF only (Max 5MB)</CardDescription>
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
                <Button className="w-full mt-4 gradient-primary text-white" onClick={handleProcess}>
                  Process Resume
                </Button>
              )}

              {isProcessing && (
                <div className="mt-6 text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Analyzing...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Explain */}
          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
              <CardDescription>
                {hasAny ? "Choose a job to explain (best match selected by default)" : "Upload & process a resume to see explanation"}
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

              {!hasAny ? (
                <p className="text-sm text-muted-foreground">No data yet. Upload a PDF resume and click Process Resume.</p>
              ) : (
                <>
                  {/* Job selector */}
                  <div className="mb-4">
                    <label className="text-sm font-medium">Select a job to explain</label>
                    <select
                      className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                    >
                      {matches.map((m) => (
                        <option key={m.title} value={m.title}>
                          {m.title} ({m.match}%)
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Tip: the first option is your <b>best match</b>.
                    </p>
                  </div>

                  {/* Breakdown */}
                  {breakdown && (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm">Why this score?</div>
                          <div className="text-xs text-muted-foreground">
                            Final = {Math.round(breakdown.weights.tech * 100)}% Tech + {Math.round(breakdown.weights.soft * 100)}% Soft
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{breakdown.finalMatch}%</div>
                          <div className="text-xs text-muted-foreground">Final Match</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Technical Match</span>
                            <span className="font-medium">{breakdown.techMatch}%</span>
                          </div>
                          <ProgressBar value={breakdown.techMatch} />

                          <div className="mt-3 flex flex-wrap gap-2">
                            {breakdown.tech.slice(0, 14).map((t) => {
                              const label =
                                t.status === "exact"
                                  ? "Exact"
                                  : t.status === "synonym"
                                  ? `Synonym (${t.via})`
                                  : t.status === "partial"
                                  ? `Partial (+${Math.round(t.credit * 100)}%) via ${t.via}`
                                  : "Missing";

                              const variant = t.status === "partial" ? "outline" : t.status === "synonym" ? "secondary" : "default";

                              return (
                                <Badge key={t.required} variant={variant as any} className="text-xs">
                                  {t.required}
                                  <span className="ml-2 opacity-70">• {label}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Soft Skills Match</span>
                            <span className="font-medium">{breakdown.softMatch}%</span>
                          </div>
                          <ProgressBar value={breakdown.softMatch} />

                          <div className="mt-3 flex flex-wrap gap-2">
                            {breakdown.soft.some((s) => s.matched) ? (
                              breakdown.soft
                                .filter((s) => s.matched)
                                .map((s) => (
                                  <Badge key={s.required} variant="secondary" className="text-xs">
                                    {s.required}
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
                            <li>Exact match = full point</li>
                            <li>Synonym match = full point</li>
                            <li>Related match = partial credit (0.35)</li>
                            <li>Final score = weighted TechMatch + SoftMatch</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
