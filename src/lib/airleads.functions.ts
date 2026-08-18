import { createServerFn } from "@tanstack/react-start";

export type GenerateInput = {
  country: string;
  location: string;
  businessType: string;
  mode?: "specific" | "random";
};

export type Lead = {
  id: string;
  businessName: string;
  phone: string;
  address: string;
  website: string;
  email: string;
  rating: number | null;
  reviewsCount: number | null;
  category: string;
  city: string;
  country: string;
  hasWebsite: boolean;
  googleMapsUrl: string;
  socialMedia: string;
};

export const signIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { AUTH_EMAIL, AUTH_PASSWORD } = await import("./airleads.server");
    const ok =
      typeof data?.email === "string" &&
      typeof data?.password === "string" &&
      data.email.trim().toLowerCase() === AUTH_EMAIL &&
      data.password === AUTH_PASSWORD;
    return { ok };
  });

export const generateLeads = createServerFn({ method: "POST" })
  .inputValidator((data: GenerateInput) => data)
  .handler(async ({ data }) => {
    const { WEBHOOK_URL, normalizeLeads, isSuccess, backendMessage, parseWebhookPayload } =
      await import("./airleads.server");
    const { COUNTRIES, LOCATIONS } = await import("./countries");

    const country = (data.country ?? "").trim();
    let location = (data.location ?? "").trim();

    // Random discovery mode: the server picks the city so the client can't inject anything odd.
    if (data.mode === "random") {
      const code = COUNTRIES.find((c) => c.name === country)?.code ?? "IN";
      const cities = LOCATIONS[code] ?? [];
      location = cities.length ? cities[Math.floor(Math.random() * cities.length)]! : location;
    }

    // Exact contract with the n8n webhook: raw JSON, three root-level keys.
    const body = {
      country,
      location,
      businessType: (data.businessType ?? "").trim().slice(0, 80),
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180_000);
    const startedAt = Date.now();

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const text = await res.text();
      console.info("AirLeads webhook response", {
        status: res.status,
        elapsedMs: Date.now() - startedAt,
        responseBytes: text.length,
        contentType: res.headers.get("content-type"),
      });

      if (!res.ok) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message:
            res.status === 404
              ? "Automation webhook not found (404). In n8n, activate the workflow so the production webhook is live."
              : `Lead engine returned an error (${res.status}). Please try again in a moment.`,
        };
      }

      const payload = parseWebhookPayload(text);

      if (payload === null) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message:
            "n8n returned HTTP 200 with an empty body. The production workflow is responding before the scraper reaches ‘Send Leads to Frontend’.",
        };
      }

      if (!isSuccess(payload)) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message: backendMessage(payload) || "The automation could not complete this search.",
        };
      }

      const leads = normalizeLeads(payload);
      if (leads.length === 0) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message:
            backendMessage(payload) ||
            "No leads found for this combination. Try another city or business type.",
        };
      }

      return { ok: true as const, leads, message: "", location };
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return {
        ok: false as const,
        leads: [] as Lead[],
        message: aborted
          ? "This search took too long (over 3 minutes) and was stopped. Try a specific city or a narrower business type."
          : "Couldn't reach the lead engine. Check your connection and try again.",
      };
    } finally {
      clearTimeout(timer);
    }
  });
