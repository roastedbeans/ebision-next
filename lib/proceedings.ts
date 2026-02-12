import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ValidYear } from "@/constants/config";
import { YEAR_CONFIG } from "@/constants/config";

export interface ProceedingPeriod {
  id: string;
  title: string;
  description: string | null;
  periodId: number | null;
  coverImageUrl: string | null;
  createdAt: string;
}

export interface Paper {
  id: string;
  session: string | null;
  articleId: string | null;
  presentationType: string;
  presentationDate: string | null;
  startTime: string | null;
  endTime: string | null;
  paperTitle: string;
  authors: string;
  institutions: string | null;
  abstractFileUrl: string | null;
  paperFileUrl: string | null;
}

export interface Period {
  id: number;
  name: string;
  venue: string | null;
  date: string | null;
}

const PROCEEDINGS_CONFIG: Record<
  ValidYear,
  { csvPath: string; papersDir: string; coverImage: string } | null
> = {
  2025: {
    csvPath: "public/data/2025/program-book-table.csv",
    papersDir: "public/data/2025/ebision-papers",
    coverImage: "/proceedings/ebision-2025.png",
  },
  2026: null,
};

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ?? "";
    }
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let field = "";
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          i++;
          if (line[i] === '"') {
            field += '"';
            i++;
          } else {
            break;
          }
        } else {
          field += line[i];
          i++;
        }
      }
      result.push(field);
      if (line[i] === ",") i++;
    } else {
      let field = "";
      while (i < line.length && line[i] !== ",") {
        field += line[i];
        i++;
      }
      result.push(field.trim());
      if (line[i] === ",") i++;
    }
  }
  return result;
}

function getPdfMap(papersDir: string): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const basePath = join(process.cwd(), papersDir);
    const files = readdirSync(basePath);
    for (const file of files) {
      if (file.endsWith(".pdf")) {
        const prefix = file.slice(0, 2);
        if (/^\d{2}$/.test(prefix)) {
          map.set(prefix, `/data/2025/ebision-papers/${file}`);
        }
      }
    }
  } catch {
    // Directory may not exist
  }
  return map;
}

export function getProceedingPeriods(year: ValidYear): ProceedingPeriod[] {
  const config = PROCEEDINGS_CONFIG[year];
  if (!config) return [];

  const yearConfig = YEAR_CONFIG[year];
  const proceedingId = `ebision-${year}`;
  return [
    {
      id: proceedingId,
      title: `EBISION ${year} Proceedings`,
      description: `Online proceedings for ${yearConfig.conferenceName}`,
      periodId: 1,
      coverImageUrl: config.coverImage,
      createdAt: yearConfig.startDate,
    },
  ];
}

export function getProceedingDetail(
  year: ValidYear,
  proceedingId: string,
): {
  proceedingPeriod: ProceedingPeriod | null;
  period: Period | null;
  papers: Paper[];
} {
  const config = PROCEEDINGS_CONFIG[year];
  if (!config || proceedingId !== `ebision-${year}`) {
    return { proceedingPeriod: null, period: null, papers: [] };
  }

  const yearConfig = YEAR_CONFIG[year];
  const csvPath = join(process.cwd(), config.csvPath);
  let csvContent: string;
  try {
    csvContent = readFileSync(csvPath, "utf-8");
  } catch {
    return {
      proceedingPeriod: {
        id: proceedingId,
        title: `EBISION ${year} Proceedings`,
        description: null,
        periodId: 1,
        coverImageUrl: config.coverImage,
        createdAt: yearConfig.startDate,
      },
      period: {
        id: 1,
        name: yearConfig.conferenceName,
        venue: yearConfig.venue,
        date: yearConfig.dates,
      },
      papers: [],
    };
  }

  const rows = parseCSV(csvContent);
  const pdfMap = getPdfMap(config.papersDir);
  const papers: Paper[] = rows.map((row, index) => {
    const articleId = (row.articleId ?? "").padStart(2, "0").slice(0, 2);
    const paperFile = pdfMap.get(articleId);
    return {
      id: `paper-${year}-${index + 1}`,
      session: row.session || null,
      articleId: row.articleId || null,
      presentationType: row.presentationType || "oral",
      presentationDate: row.presentationDate || null,
      startTime: row.startTime || null,
      endTime: row.endTime || null,
      paperTitle: row.paperTitle || "",
      authors: row.authors || "",
      institutions: row.institutions || null,
      abstractFileUrl: null,
      paperFileUrl: paperFile || null,
    };
  });

  const proceedingPeriod: ProceedingPeriod = {
    id: proceedingId,
    title: `EBISION ${year} Proceedings`,
    description: `Online proceedings for ${yearConfig.conferenceName}`,
    coverImageUrl: config.coverImage,
    periodId: 1,
    createdAt: yearConfig.startDate,
  };

  const period: Period = {
    id: 1,
    name: yearConfig.conferenceName,
    venue: yearConfig.venue,
    date: yearConfig.dates,
  };

  return { proceedingPeriod, period, papers };
}
