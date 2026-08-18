import { useRef, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Star,
  Ban,
  ExternalLink,
} from "lucide-react";
import { haptic } from "@/lib/haptics";
import type { Lead } from "@/lib/airleads.functions";

export type LeadStatus = "open" | "closed";

type Props = {
  lead: Lead;
  status: LeadStatus;
  saved: boolean;
  onStatusChange: (status: LeadStatus) => void;
  onToggleSave: () => void;
};

export function LeadCard({ lead, status, saved, onStatusChange, onToggleSave }: Props) {
  const [menu, setMenu] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    timer.current = setTimeout(() => {
      haptic.longPress();
      setMenu(true);
    }, 450);
  };
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const rows = [
    {
      Icon: Phone,
      value: lead.phone || "Not available",
      label: "Phone",
      href: lead.phone ? `tel:${lead.phone}` : undefined,
    },
    {
      Icon: MapPin,
      value:
        lead.address || [lead.city, lead.country].filter(Boolean).join(", ") || "Not available",
      label: "Address",
    },
    {
      Icon: Mail,
      value: lead.email || "Not available",
      label: "Email",
      href: lead.email ? `mailto:${lead.email}` : undefined,
    },
    {
      Icon: Globe,
      value: lead.website || "No website",
      label: "Website",
      href: lead.website?.startsWith("http") ? lead.website : undefined,
    },
  ];

  return (
    <div className="card-soft relative overflow-hidden p-4">
      <span
        className={`absolute inset-y-0 left-0 w-1 transition-colors ${
          status === "closed" ? "bg-destructive" : "bg-info"
        }`}
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <button
          type="button"
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onContextMenu={(e) => e.preventDefault()}
          className="press select-none text-left"
        >
          <h3 className="text-[17px] font-bold leading-tight">
            {lead.businessName || "Unnamed business"}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="size-3.5" />
            {[lead.category, lead.city || lead.country].filter(Boolean).join(" · ") ||
              "Business lead"}
          </p>
        </button>
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save lead"}
          onClick={() => {
            haptic.select();
            onToggleSave();
          }}
          className="press text-muted-foreground"
        >
          {saved ? (
            <BookmarkCheck className="size-5 text-primary" />
          ) : (
            <Bookmark className="size-5" />
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-2">
        {lead.rating !== null && (
          <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
            <Star className="size-3.5 fill-current" />
            {lead.rating}
            {lead.reviewsCount !== null && (
              <span className="font-semibold opacity-70">({lead.reviewsCount})</span>
            )}
          </span>
        )}
        {!lead.hasWebsite && (
          <span className="flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-bold text-primary">
            <Ban className="size-3.5" /> No website
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2 pl-2">
        {rows.map(({ Icon, value, label, href }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5"
          >
            <Icon className="size-4 shrink-0 text-primary" />
            {href ? (
              <a
                href={href}
                className="truncate text-[13px] font-medium underline-offset-4 hover:underline"
              >
                {value}
              </a>
            ) : (
              <span className="truncate text-[13px] font-medium">{value}</span>
            )}
          </div>
        ))}
      </div>

      {lead.googleMapsUrl && (
        <a
          href={lead.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="press mt-3 ml-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[13px] font-bold text-primary-foreground"
        >
          <MapPin className="size-4" /> Open in Maps
          <ExternalLink className="size-3.5 opacity-80" />
        </a>
      )}

      <div className="mt-3 flex items-center justify-between pl-2">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            status === "closed" ? "bg-destructive/12 text-destructive" : "bg-info/12 text-info"
          }`}
        >
          {status === "closed" ? "Deal closed" : "Open lead"}
        </span>
        <span className="text-[11px] text-muted-foreground">Long press name to change</span>
      </div>

      {menu && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-background/70 backdrop-blur-md">
          <div className="card-soft w-[86%] p-3">
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">
              Mark this business as
            </p>
            <button
              type="button"
              onClick={() => {
                haptic.success();
                onStatusChange("closed");
                setMenu(false);
              }}
              className="press flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-secondary"
            >
              <span className="size-3 rounded-full bg-destructive" /> Closed
            </button>
            <button
              type="button"
              onClick={() => {
                haptic.select();
                onStatusChange("open");
                setMenu(false);
              }}
              className="press flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-secondary"
            >
              <span className="size-3 rounded-full bg-info" /> Not closed
            </button>
            <button
              type="button"
              onClick={() => setMenu(false)}
              className="press w-full rounded-xl px-3 py-2 text-xs text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
