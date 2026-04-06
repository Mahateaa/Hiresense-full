// src/lib/skillMatching.ts

export type MatchResult = {
  title: string;
  match: number;
  techMatch: number;
  softMatch: number;
  matchedTech: string[];
  matchedSoft: string[];
};

export type ExplainItem = {
  required: string;
  status: "exact" | "synonym" | "partial" | "missing";
  via?: string;
  credit: number; // 1 for exact/synonym, 0.35 for partial, 0 for missing
};

export type ExplainBreakdown = {
  title: string;
  tech: ExplainItem[];
  soft: { required: string; matched: boolean }[];
  techScore: number;
  techMatch: number;
  softMatch: number;
  finalMatch: number;
  weights: { tech: number; soft: number };
};

export const TECH_WEIGHT = 0.8;
export const SOFT_WEIGHT = 0.2;

export const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\bnodejs\b/g, "node.js")
    .replace(/\breactjs\b/g, "react")
    .replace(/\bnextjs\b/g, "next.js")
    .replace(/\bpowerbi\b/g, "power bi");

export const SYNONYMS: Record<string, string[]> = {
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

export const RELATED: Record<string, string[]> = {
  sql: ["mysql", "postgresql", "sqlite"],
  "machine learning": ["python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"],
  react: ["javascript", "typescript", "html", "css"],
  docker: ["kubernetes", "ci/cd"],
  git: ["github", "gitlab"],
  "data visualization": ["tableau", "power bi", "matplotlib"],
};

export const JOBS = [
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
] as const;

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
    if (have.has(normalize(rel))) return 0.35;
  }
  return 0;
};

export function computeMatches(techSkills: string[], softSkillsArr: string[]): MatchResult[] {
  const haveTech = new Set(techSkills.map(normalize));
  const haveSoft = new Set(softSkillsArr.map(normalize));

  const results: MatchResult[] = JOBS.map((job) => {
    let techScore = 0;
    const matchedTech: string[] = [];

    for (const req of job.requiredTech) {
      if (hasSkill(req, haveTech)) {
        techScore += 1;
        matchedTech.push(req);
      } else {
        techScore += partialCredit(req, haveTech);
      }
    }

    const techMatch = job.requiredTech.length ? Math.round((techScore / job.requiredTech.length) * 100) : 0;

    const matchedSoft = job.requiredSoft.filter((s) => hasSkill(s, haveSoft));
    const softMatch = job.requiredSoft.length ? Math.round((matchedSoft.length / job.requiredSoft.length) * 100) : 0;

    const match = Math.round(TECH_WEIGHT * techMatch + SOFT_WEIGHT * softMatch);

    return { title: job.title, match, techMatch, softMatch, matchedTech, matchedSoft };
  });

  results.sort((a, b) => b.match - a.match);
  return results;
}

export function explainMatchForJob(
  jobTitle: string,
  techSkills: string[],
  softSkills: string[]
): ExplainBreakdown | null {
  const job = JOBS.find((j) => j.title === jobTitle);
  if (!job) return null;

  const haveTech = new Set(techSkills.map(normalize));
  const haveSoft = new Set(softSkills.map(normalize));

  const tech = job.requiredTech.map((req): ExplainItem => {
    const r = normalize(req);

    if (haveTech.has(r)) {
      return { required: req, status: "exact", via: req, credit: 1 };
    }

    const syns = SYNONYMS[r] || [];
    for (const s of syns) {
      if (haveTech.has(normalize(s))) {
        return { required: req, status: "synonym", via: s, credit: 1 };
      }
    }

    const rels = RELATED[r] || [];
    for (const rel of rels) {
      if (haveTech.has(normalize(rel))) {
        return { required: req, status: "partial", via: rel, credit: 0.35 };
      }
    }

    return { required: req, status: "missing", credit: 0 };
  });

  const soft = job.requiredSoft.map((req) => ({ required: req, matched: hasSkill(req, haveSoft) }));

  const techScore = tech.reduce((sum, t) => sum + t.credit, 0);
  const techMatch = job.requiredTech.length ? Math.round((techScore / job.requiredTech.length) * 100) : 0;

  const softMatchedCount = soft.filter((s) => s.matched).length;
  const softMatch = job.requiredSoft.length ? Math.round((softMatchedCount / job.requiredSoft.length) * 100) : 0;

  const finalMatch = Math.round(TECH_WEIGHT * techMatch + SOFT_WEIGHT * softMatch);

  return {
    title: job.title,
    tech,
    soft,
    techScore,
    techMatch,
    softMatch,
    finalMatch,
    weights: { tech: TECH_WEIGHT, soft: SOFT_WEIGHT },
  };
}
