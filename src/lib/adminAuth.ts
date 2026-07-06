const ADMIN_AUTH_STORAGE_KEY = "cinema-hub-admin-auth";

// SHA-256 hex digest of "shoaib:msr1896" — the plaintext password is never committed to source.
const ADMIN_CREDENTIALS_HASH = "1a6e610168d3f87be98b2412a211aba677d3752fa5359d0949152d10d71d648c";

export async function hashCredentials(username: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`${username}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const hash = await hashCredentials(username, password);
  return hash === ADMIN_CREDENTIALS_HASH;
}

export function isAdminAuthed(): boolean {
  try {
    return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAdminAuthed(): void {
  try {
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true");
  } catch {
    // localStorage unavailable (private mode etc.) — session simply won't persist
  }
}

export function clearAdminAuthed(): void {
  try {
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } catch {
    // no-op
  }
}
