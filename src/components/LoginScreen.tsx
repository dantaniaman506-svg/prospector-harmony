import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { signIn } from "@/lib/airleads.functions";
import { haptic } from "@/lib/haptics";
import { TechBackground } from "@/components/TechBackground";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    haptic.tap();
    setLoading(true);
    setError("");
    const { ok } = await login({ data: { email, password } });
    setLoading(false);
    if (ok) {
      haptic.success();
      window.localStorage.setItem("airleads-session", remember ? "persist" : "session");
      onSuccess();
    } else {
      haptic.error();
      setError("Invalid email or password");
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden px-5 pb-10 pt-6">
      <TechBackground />

      <header className="relative flex items-center justify-between">
        <span className="font-display text-lg font-extrabold tracking-tight">
          AirLeads <span className="text-primary">AI</span>
        </span>
        <span className="rounded-full bg-primary/12 px-3 py-1.5 text-[11px] font-bold text-primary">
          AI Lead Engine
        </span>
      </header>

      <div className="relative mx-auto mt-14 w-full max-w-md">
        <h1 className="text-center text-4xl font-extrabold">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Log in to access your <span className="font-semibold text-primary">dashboard</span>
        </p>

        <form onSubmit={submit} className="card-soft mt-9 space-y-5 p-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Mail className="size-5 shrink-0 text-primary" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Lock className="size-5 shrink-0 text-primary" />
              <input
                id="password"
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => {
                  haptic.select();
                  setShow((s) => !s);
                }}
                className="press text-muted-foreground"
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              haptic.select();
              setRemember((r) => !r);
            }}
            className="press flex items-center gap-3 text-sm"
          >
            <span
              className={`grid size-5 place-items-center rounded-md border-2 transition-colors ${
                remember ? "border-primary bg-primary" : "border-border"
              }`}
            >
              {remember && (
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                >
                  <path d="M4 12.5 9.5 18 20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            Remember me
          </button>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-bold"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : null}
            {loading ? "Signing in" : "Login"}
            {!loading && <ArrowRight className="size-5" />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Access is limited to authorised AirLeads accounts only.
        </p>
      </div>
    </div>
  );
}
