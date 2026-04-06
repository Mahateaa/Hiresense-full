import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Profile = { name?: string | null; email?: string | null; phone?: string | null };

export default function ResumeParser() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { toast } = useToast();

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
  };

  const handleParse = async () => {
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

      toast({ title: "Resume parsed!", description: `Extracted ${tech.length} technical and ${soft.length} soft skills.` });
    } catch (err: any) {
      toast({ title: "Parsing failed", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAnySkills = technicalSkills.length > 0 || softSkills.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Resume Parser</h1>
          <p className="text-muted-foreground">Upload a resume to extract profile + skills.</p>
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
                <Button className="w-full mt-4 gradient-primary text-white" onClick={handleParse}>
                  Parse Resume
                </Button>
              )}

              {isProcessing && (
                <div className="mt-6 text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Extracting data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {hasAnySkills && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
                Extracted Results
              </CardTitle>
              <CardDescription>{hasAnySkills ? "Profile + skills extracted" : "Upload & parse to see results"}</CardDescription>
            </CardHeader>

            <CardContent>
              {profile && (
                <div className="mb-4 rounded-lg border p-3 text-sm">
                  <div className="font-semibold">{profile.name || "Name not found"}</div>
                  <div className="text-muted-foreground">{profile.email || "Email not found"}</div>
                  <div className="text-muted-foreground">{profile.phone || "Phone not found"}</div>
                </div>
              )}

              {technicalSkills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((s, i) => (
                      <Badge key={`${s}-${i}`} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {softSkills.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-semibold mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {softSkills.map((s, i) => (
                      <Badge key={`${s}-${i}`} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {!hasAnySkills && <p className="text-sm text-muted-foreground">No skills extracted yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
