import { LANGUAGES, moviesData, tvShowsData, type Movie, type TVShow } from "@/data/mediaData";

const GITHUB_TOKEN_STORAGE_KEY = "cinema-hub-github-token";
const REPO_OWNER = "shoaibrayeen";
const REPO_NAME = "cinema-hub";
const WORKFLOW_FILE = "add-media.yml";
const WORKFLOW_REF = "master";

export function isGithubConnected(): boolean {
  try {
    return !!localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY);
  } catch {
    return false;
  }
}

export function getGithubToken(): string | null {
  try {
    return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveGithubToken(token: string): void {
  try {
    localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token);
  } catch {
    // localStorage unavailable — token simply won't persist across reloads
  }
}

export function clearGithubToken(): void {
  try {
    localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
  } catch {
    // no-op
  }
}

export async function triggerAddMediaWorkflow(token: string, inputs: Record<string, string>): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ ref: WORKFLOW_REF, inputs }),
    },
  );

  // A successful dispatch returns 204 with no body — GitHub gives no direct
  // link back to the run/PR it creates.
  if (response.status !== 204) {
    let detail = "";
    try {
      const body: { message?: string } = await response.json();
      if (body.message) detail = `: ${body.message}`;
    } catch {
      // response wasn't JSON — ignore and use the bare status
    }
    throw new Error(`GitHub workflow trigger failed (${response.status})${detail}`);
  }
}

export type DataObjectName = "moviesData" | "tvShowsData";

export function getKnownLanguageKeys(dataObjectName: DataObjectName): string[] {
  const data = dataObjectName === "moviesData" ? moviesData : tvShowsData;
  return Array.from(new Set<string>([...LANGUAGES, ...Object.keys(data)]));
}

export function findDuplicateEntry(dataObjectName: DataObjectName, language: string, name: string): boolean {
  const data = dataObjectName === "moviesData" ? moviesData : (tvShowsData as Record<string, (Movie | TVShow)[]>);
  const items = data[language];
  if (!items) return false;
  const target = name.trim().toLowerCase();
  return items.some((item) => item.name.trim().toLowerCase() === target);
}
