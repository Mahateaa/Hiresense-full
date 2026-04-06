const express = require("express");
const multer = require("multer");
const cors = require("cors");

// ✅ PDF parser
const pdfParseLib = require("@cedrugs/pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;
const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/health", (req, res) => res.json({ ok: true }));

/* ------------------- Skills Lists ------------------- */

// TECH: Expanded to support many job roles
const TECH_SKILLS = [
  // Languages
  "C", "C++", "C#", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust",
  "Kotlin", "Swift", "PHP", "Ruby", "R", "SQL",

  // Frontend / Web
  "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap",
  "React", "Next.js", "Angular", "Vue", "Svelte",
  "Redux", "Zustand", "React Router",
  "Vite", "Webpack",

  // Backend / APIs
  "Node.js", "Express", "NestJS",
  "Django", "Flask", "FastAPI",
  "Spring", "Spring Boot",
  "REST", "GraphQL",
  "Swagger", "OpenAPI",

  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis",
  "Firebase", "Supabase",

  // DevOps / Cloud
  "Git", "GitHub", "GitLab",
  "Docker", "Kubernetes",
  "AWS", "Azure", "GCP",
  "Linux", "Nginx", "Apache",
  "CI/CD", "GitHub Actions", "Jenkins",

  // Testing / QA
  "Unit Testing", "Integration Testing", "Testing",
  "Jest", "Cypress", "Playwright", "Selenium",
  "Test Cases", "Bug Tracking",

  // Data / ML / AI
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "PyTorch", "TensorFlow", "Keras", "Scikit-learn",
  "Pandas", "NumPy", "Matplotlib", "OpenCV",
  "Data Visualization", "Statistics",

  // Analytics / BI
  "Microsoft Excel", "Excel", "Google Sheets",
  "Power BI", "Tableau", "Looker Studio", "Alteryx",
  "Google Analytics",

  // Tools
  "Postman", "Jira", "Notion",
  "VS Code", "IntelliJ IDEA", "Eclipse",

  // Design / Content
  "Canva", "Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro",
  "Content Writing", "SEO", "Email Marketing", "Social Media"
];

// SOFT: Expanded (includes Curiosity etc.)
const SOFT_SKILLS = [
  "Communication", "Teamwork", "Leadership", "Time Management", "Adaptability",
  "Problem Solving", "Critical Thinking", "Creativity",
  "Public Speaking", "Presentation Skills",
  "Decision Making", "Attention to Detail",
  "Collaboration", "Conflict Resolution",
  "Emotional Intelligence", "Networking",
  "Curiosity", "Work Ethic", "Self Motivation", "Fast Learner"
];

/* ------------------- Normalization & Synonyms ------------------- */

const NORMALIZE_REPLACEMENTS = [
  [/\bnodejs\b/g, "node.js"],
  [/\breactjs\b/g, "react"],
  [/\bnextjs\b/g, "next.js"],
  [/\bpowerbi\b/g, "power bi"],
  [/\bpostgres\b/g, "postgresql"],
  [/\bjs\b/g, "javascript"],
  [/\bts\b/g, "typescript"],
  [/\bml\b/g, "machine learning"],
  [/\bai\b/g, "artificial intelligence"],
];

// Optional synonym mapping: if resume contains any alias, we count the main skill too
const ALIASES = {
  "node.js": ["node", "nodejs"],
  "javascript": ["js"],
  "typescript": ["ts"],
  "react": ["reactjs"],
  "next.js": ["nextjs"],
  "postgresql": ["postgres"],
  "power bi": ["powerbi"],
  "machine learning": ["ml"],
  "artificial intelligence": ["ai"],
};

/* ------------------- Skill Extractor ------------------- */

function normalizeText(text) {
  let t = (text || "").toLowerCase();
  for (const [re, to] of NORMALIZE_REPLACEMENTS) t = t.replace(re, to);
  return t;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchSkillInText(normalizedText, skill) {
  const escaped = escapeRegExp(skill.toLowerCase());
  // word-boundary-ish match
  const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return re.test(normalizedText);
}

function extractListFromText(text, list) {
  const normalized = normalizeText(text);

  const found = [];

  for (const skill of list) {
    const s = skill.toLowerCase();

    // Direct match
    if (matchSkillInText(normalized, s)) {
      found.push(skill);
      continue;
    }

    // Alias match
    const aliases = ALIASES[s] || [];
    if (aliases.some((a) => matchSkillInText(normalized, a.toLowerCase()))) {
      found.push(skill);
    }
  }

  return [...new Set(found)];
}

/* ------------------- Profile Extractors ------------------- */

function extractEmail(text) {
  return text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || null;
}

function extractPhone(text) {
  return text.match(/(\+?\d[\d\s-]{8,}\d)/)?.[0]?.trim() || null;
}

function extractName(text) {
  const lines = (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const blacklist = ["resume", "curriculum", "vitae", "cv", "linkedin", "github", "portfolio"];
  for (const line of lines.slice(0, 10)) {
    const lower = line.toLowerCase();
    const looksLikeEmail = /@/.test(line);
    const looksLikePhone = /\d{6,}/.test(line);
    const blacklisted = blacklist.some((w) => lower.includes(w));
    const tooLong = line.length > 60;

    if (!looksLikeEmail && !looksLikePhone && !blacklisted && !tooLong) {
      if (!["skills", "education", "experience", "projects"].includes(lower)) return line;
    }
  }
  return null;
}

/* ------------------- API ------------------- */

app.post("/api/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are supported" });
    }

    const pdf = await pdfParse(req.file.buffer);
    const text = pdf.text || "";

    const technicalSkills = extractListFromText(text, TECH_SKILLS);
    const softSkills = extractListFromText(text, SOFT_SKILLS);

    const profile = {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
    };

    return res.json({
      ok: true,
      pages: pdf.numpages,
      extracted: { technicalSkills, softSkills, profile },
      textPreview: text.slice(0, 500),
    });
  } catch (e) {
    console.error("PDF PARSE ERROR:", e);
    return res.status(500).json({
      error: "Failed to parse PDF",
      details: e?.message || String(e),
    });
  }
});

const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
  console.log("pdfParse type:", typeof pdfParse);
});