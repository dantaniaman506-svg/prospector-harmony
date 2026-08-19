import { Home, Search, History, Bookmark, Settings, CreditCard, LogOut } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { BrandWord } from "@/components/Brand";
import type { TabId } from "@/components/BottomTabs";

const ITEMS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "leads", label: "Find Leads", Icon: Search },
  { id: "history", label: "History", Icon: History },
  { id: "saved", label: "Saved", Icon: Bookmark },
  { id: "plans", label: "Plans & Billing", Icon: CreditCard },
  { id: "settings", label: "Settings", Icon: Settings },
];

/** Desktop-only left rail — mobile keeps the floating bottom tab bar. */
export function DesktopSidebar({
  active,
  onChange,
  onSignOut,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
  onSignOut: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card/70 px-5 py-6 backdrop-blur-xl lg:flex">
      <BrandWord />

      <nav className="mt-9 flex flex-1 flex-col gap-1.5">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptic.tap();
                onChange(id);
              }}
              className={`press flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              <Icon className="size-[18px]" strokeWidth={isActive ? 2.4 : 1.9} />
              {label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          haptic.tap();
          onSignOut();
        }}
        className="press flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOut className="size-[18px]" /> Log out
      </button>
    </aside>
  );
}
