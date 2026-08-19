import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { readSession } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — AirLeads AI" },
      {
        name: "description",
        content:
          "Sign in to your AirLeads AI workspace to generate verified leads of businesses without a website.",
      },
      { property: "og:title", content: "Log in — AirLeads AI" },
      {
        property: "og:description",
        content: "Secure access to your AirLeads AI lead generation dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (readSession()) navigate({ to: "/app", replace: true });
    else setChecked(true);
  }, [navigate]);

  if (!checked) return <div className="min-h-dvh bg-background" />;

  return <LoginScreen onSuccess={() => navigate({ to: "/app", replace: true })} />;
}
