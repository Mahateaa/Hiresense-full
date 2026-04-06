export type ParsedResume = {
  extracted?: {
    technicalSkills?: string[];
    softSkills?: string[];
    profile?: { name?: string | null; email?: string | null; phone?: string | null };
  };
};

export async function parseResume(file: File): Promise<ParsedResume> {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch("http://localhost:5000/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.details || json?.error || "Failed to parse resume");
  return json;
}
