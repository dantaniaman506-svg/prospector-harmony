import { Copy, Check, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { haptic } from "@/lib/haptics";
import type { Lead } from "@/lib/airleads.functions";
import type { LeadStatus } from "@/components/LeadCard";

type Props = {
  leads: Lead[];
  statuses: Record<string, LeadStatus>;
  onStatusChange: (id: string, status: LeadStatus) => void;
};

const COLS = [
  { key: "businessName", label: "Business" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "category", label: "Category" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
] as const;

export function LeadsTable({ leads, statuses, onStatusChange }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, id: string) {
    if (!value) return;
    haptic.select();
    void navigator.clipboard?.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div className="card-soft overflow-hidden p-0">
      <div className="max-h-[65vh] overflow-auto">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead className="sticky top-0 z-10 bg-secondary">
            <tr>
              <th className="px-3 py-3 font-bold text-muted-foreground">#</th>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className="whitespace-nowrap px-3 py-3 font-bold text-muted-foreground"
                >
                  {c.label}
                </th>
              ))}
              <th className="whitespace-nowrap px-3 py-3 font-bold text-muted-foreground">
                Rating
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-bold text-muted-foreground">Maps</th>
              <th className="whitespace-nowrap px-3 py-3 font-bold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => {
              const status = statuses[lead.id] ?? "open";
              return (
                <tr key={lead.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 text-muted-foreground">{i + 1}</td>
                  {COLS.map((c) => {
                    const cell = lead[c.key] ?? "";
                    const cellId = `${lead.id}-${c.key}`;
                    return (
                      <td key={c.key} className="max-w-[190px] px-3 py-3">
                        <button
                          type="button"
                          onClick={() => copy(cell, cellId)}
                          className="press flex max-w-full items-center gap-1.5 text-left font-medium"
                        >
                          <span className="truncate">{cell || "—"}</span>
                          {cell &&
                            (copied === cellId ? (
                              <Check className="size-3 shrink-0 text-primary" />
                            ) : (
                              <Copy className="size-3 shrink-0 text-muted-foreground/60" />
                            ))}
                        </button>
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-3 py-3">
                    {lead.rating !== null ? (
                      <span className="flex items-center gap-1 font-semibold">
                        <Star className="size-3 fill-current text-accent" />
                        {lead.rating}
                        {lead.reviewsCount !== null && (
                          <span className="text-muted-foreground">({lead.reviewsCount})</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {lead.googleMapsUrl ? (
                      <a
                        href={lead.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${lead.businessName} in Google Maps`}
                        className="press grid size-7 place-items-center rounded-lg bg-primary/12 text-primary"
                      >
                        <MapPin className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        haptic.tap();
                        onStatusChange(lead.id, status === "closed" ? "open" : "closed");
                      }}
                      className={`press whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        status === "closed"
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {status === "closed" ? "Closed" : "Open"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
