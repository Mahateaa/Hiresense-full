// src/pages/AiSkillMatching.tsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, Loader2, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { computeMatches, type MatchResult } from "@/lib/skillMatching";
import { useNavigate } from "react-router-dom";

type Profile = { name?: string | null; email?: string | null; phone?: string | null };

export default function AiSkillMatching() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const matches = useMemo(() => computeMatches(technicalSkills, softSkills), [technicalSkills, softSkills]);
  const [selected, setSelected] = useState<MatchResult | null>(null);

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
    setSelected(null);
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

  const openExplainability = (jobTitle: string) => {
    navigate(`/ai/explainability?job=${encodeURIComponent(jobTitle)}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Role Suggestions</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Skill Matching</h1>
          <p className="text-muted-foreground">Upload a resume to get job matches based on extracted skills.</p>
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

          {/* Matches */}
          <Card>
            <CardHeader>
              <CardTitle>Matched Jobs</CardTitle>
              <CardDescription>{hasAny ? "Top matches based on extracted skills" : "Upload & process a resume to see matches"}</CardDescription>
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
                <p className="text-sm text-muted-foreground">No matches yet. Upload a PDF resume and click Process Resume.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {matches.slice(0, 7).map((m) => {
                      const active = selected?.title === m.title;
                      return (
                        <button
                          key={m.title}
                          className={`w-full text-left rounded-lg border p-3 transition ${
                            active ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                          }`}
                          onClick={() => setSelected(m)}
                          type="button"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">{m.title}</div>
                              <div className="text-xs text-muted-foreground">Tech: {m.techMatch}% | Soft: {m.softMatch}%</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Matched Tech: {m.matchedTech.slice(0, 10).join(", ")}
                                {m.matchedTech.length > 10 ? "..." : ""}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Matched Soft: {m.matchedSoft.join(", ") || "—"}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-green-500 whitespace-nowrap">{m.match}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      className="flex-1 gradient-primary text-white"
                      disabled={!matches.length}
                      onClick={() => setSelected(matches[0])}
                    >
                      Select Best Match
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={!selected}
                      onClick={() => selected && openExplainability(selected.title)}
                    >
                      Explain this match
                    </Button>
                  </div>

                  {selected && (
                    <div className="mt-4 rounded-lg border p-3">
                      <div className="text-sm font-semibold mb-2">Selected: {selected.title}</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Final: {selected.match}%</Badge>
                        <Badge variant="outline">Tech: {selected.techMatch}%</Badge>
                        <Badge variant="outline">Soft: {selected.softMatch}%</Badge>
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
