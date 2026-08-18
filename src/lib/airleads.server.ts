export const WEBHOOK_URL =
  process.env["AIRLEADS_WEBHOOK_URL"] ?? "https://jixa.app.n8n.cloud/webhook/airleads-scrape";

export const AUTH_EMAIL = (process.env["APP_LOGIN_EMAIL"] ?? "client@airleads.ai").toLowerCase();
export const AUTH_PASSWORD = process.env["APP_LOGIN_PASSWORD"] ?? "AirLeads@2026";

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

function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of Object.keys(obj)) {
    const norm = k.toLowerCase().replace(/[^a-z]/g, "");
    if (keys.includes(norm)) {
      const v = obj[k];
      if (v !== null && v !== undefined && String(v).trim() !== "") return String(v).trim();
    }
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  const raw = pick(obj, keys);
  if (!raw) return null;
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function unwrap(payload: unknown): Record<string, unknown> {
  if (Array.isArray(payload)) return (payload[0] as Record<string, unknown>) ?? {};
  if (payload && typeof payload === "object") return payload as Record<string, unknown>;
  return {};
}

/** true unless the backend explicitly says success: false */
export function isSuccess(payload: unknown): boolean {
  return unwrap(payload)["success"] !== false;
}

export function backendMessage(payload: unknown): string {
  const obj = unwrap(payload);
  const msg = pick(obj, ["message", "error", "errormessage", "reason"]);
  return msg;
}

export function parseWebhookPayload(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed !== "string") return parsed;

    const nested = parsed.trim();
    if (!nested) return null;
    try {
      return JSON.parse(nested) as unknown;
    } catch {
      return parsed;
    }
  } catch {
    return null;
  }
}

function looksLikeLead(row: unknown): boolean {
  if (!row || typeof row !== "object") return false;
  const keys = Object.keys(row as object).map((k) => k.toLowerCase().replace(/[^a-z]/g, ""));
  return keys.some((k) => ["businessname", "business", "name", "title", "phone"].includes(k));
}

export function normalizeLeads(payload: unknown): Lead[] {
  let rows: unknown[] = [];

  if (Array.isArray(payload) && payload.some(looksLikeLead)) {
    rows = payload;
  } else {
    const obj = unwrap(payload);
    for (const key of ["leads", "data", "results", "items", "rows"]) {
      if (Array.isArray(obj[key])) {
        rows = obj[key] as unknown[];
        break;
      }
    }
    // n8n sometimes wraps every item: [{ json: { leads: [...] } }]
    if (rows.length === 0 && Array.isArray(payload)) {
      for (const entry of payload) {
        const inner = unwrap((entry as Record<string, unknown>)?.["json"] ?? entry);
        for (const key of ["leads", "data", "results", "items"]) {
          if (Array.isArray(inner[key])) {
            rows = inner[key] as unknown[];
            break;
          }
        }
        if (rows.length) break;
      }
    }
  }

  return rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
    .map((r, i) => {
      const raw = (r["json"] && typeof r["json"] === "object" ? r["json"] : r) as Record<
        string,
        unknown
      >;
      const website = pick(raw, ["website", "url", "site", "webpage"]);
      const social = pick(raw, [
        "socialmedia",
        "social",
        "instagram",
        "instagramlink",
        "facebook",
        "linkedin",
        "socials",
      ]);
      return {
        id: pick(raw, ["id", "leadid", "placeid"]) || `lead-${Date.now()}-${i}`,
        businessName: pick(raw, ["businessname", "business", "name", "companyname", "title"]),
        phone: pick(raw, ["phone", "phonenumber", "mobile", "contactnumber", "telephone", "tel"]),
        address: pick(raw, ["address", "fulladdress", "street", "formattedaddress"]),
        website,
        email: pick(raw, ["email", "emailaddress", "mail"]),
        rating: pickNumber(raw, ["rating", "stars", "score"]),
        reviewsCount: pickNumber(raw, ["reviewscount", "reviews", "reviewcount", "totalreviews"]),
        category: pick(raw, ["category", "businesstype", "type", "industry", "niche"]),
        city: pick(raw, ["city", "location", "town"]),
        country: pick(raw, ["country"]),
        hasWebsite: raw["hasWebsite"] === true || (!!website && raw["hasWebsite"] !== false),
        googleMapsUrl: pick(raw, [
          "googlemapsurl",
          "mapslink",
          "maps",
          "mapsurl",
          "googlemaps",
          "mapurl",
        ]),
        socialMedia: social,
      } satisfies Lead;
    })
    .filter((l) => l.businessName || l.phone || l.email);
}
