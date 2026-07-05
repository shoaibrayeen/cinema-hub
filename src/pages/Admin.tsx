import { useState, type FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/admin/LoginForm";
import AddMediaForm from "@/components/admin/AddMediaForm";
import { isAdminAuthed, clearAdminAuthed } from "@/lib/adminAuth";
import { isGithubConnected, saveGithubToken, clearGithubToken, getGithubToken } from "@/lib/githubWorkflow";

const ConnectGithubStep = ({ onConnected }: { onConnected: () => void }) => {
  const [token, setToken] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    saveGithubToken(token.trim());
    onConnected();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Paste a fine-grained GitHub Personal Access Token scoped only to{" "}
          <code className="text-foreground">shoaibrayeen/cinema-hub</code> with{" "}
          <span className="text-foreground">Actions: Read and write</span> permission. It's used only to trigger the
          add-media workflow — it never touches file contents directly.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="github-token">GitHub token</Label>
        <Input
          id="github-token"
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Connect GitHub
      </Button>
    </form>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => isAdminAuthed());
  const [githubConnected, setGithubConnected] = useState(() => isGithubConnected());

  const handleLogout = () => {
    clearAdminAuthed();
    setAuthed(false);
  };

  const handleDisconnectGithub = () => {
    clearGithubToken();
    setGithubConnected(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 py-12">
      <h1 className="text-2xl font-semibold">Admin — Add media</h1>

      {!authed && <LoginForm onSuccess={() => setAuthed(true)} />}

      {authed && !githubConnected && <ConnectGithubStep onConnected={() => setGithubConnected(true)} />}

      {authed && githubConnected && (
        <>
          {/* githubConnected being true already implies a token was just saved to localStorage;
              this fallback only guards against the two falling out of sync mid-render. */}
          {/* v8 ignore next */}
          <AddMediaForm token={getGithubToken() ?? ""} />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <button type="button" onClick={handleDisconnectGithub} className="underline hover:text-foreground">
              Disconnect GitHub
            </button>
            <button type="button" onClick={handleLogout} className="underline hover:text-foreground">
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
