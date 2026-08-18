import { Home, Search, History, Bookmark, Settings } from "lucide-react";
import { haptic } from "@/lib/haptics";

export type TabId = "dashboard" | "leads" | "history" | "saved" | "settings" | "plans";

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "leads", label: "Find Leads", Icon: Search },
  { id: "history", label: "History", Icon: History },
  { id: "saved", label: "Saved", Icon: Bookmark },
  { id: "settings", label: "Settings", Icon: Settings },
];

export function BottomTabs({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="glass-panel mx-auto flex max-w-md items-center justify-between rounded-full px-2 py-2 shadow-[var(--shadow-soft)]">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptic.tap();
                onChange(id);
              }}
              className="press relative flex flex-1 flex-col items-center gap-1 rounded-full py-2"
            >
              <span
                className={`grid size-9 place-items-center rounded-full transition-all duration-300 ${
                  isActive ? "bg-primary/18 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-[19px]" strokeWidth={isActive ? 2.4 : 1.9} />
              </span>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
