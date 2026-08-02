import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Home, ShoppingCart, Scan, Package, MoreHorizontal, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import sunsetBg from "@/assets/sunset-bg.jpg";

export type TaxCard = { label: string; icon: LucideIcon; onClick?: () => void; to?: string };
export type TaxListItem = { label: string; icon: LucideIcon; onClick?: () => void; to?: string };

export function TaxLayout({
  title,
  subtitle,
  headerIcon: HeaderIcon,
  cards = [],
  sections = [],
  children,
}: {
  title: string;
  subtitle: string;
  headerIcon: LucideIcon;
  cards?: TaxCard[];
  sections?: { title: string; icon: LucideIcon; items: TaxListItem[] }[];
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();

  const go = (item: { onClick?: () => void; to?: string; label: string }) => {
    if (item.onClick) return item.onClick();
    if (item.to) return navigate({ to: item.to });
    toast.info(`${item.label} — coming soon`);
  };

  return (
    <div
      className="relative -m-6 min-h-[calc(100vh-4rem)] overflow-hidden text-white"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(14,14,14,0.85) 0%, rgba(14,14,14,0.6) 40%, rgba(14,14,14,0.3) 70%, rgba(14,14,14,0.9) 100%), url(${sunsetBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="mx-auto max-w-md md:max-w-6xl px-5 md:px-10 pb-28 md:pb-12 pt-6 md:pt-10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20">
            <HeaderIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
        </div>

        {cards.length > 0 && (
          <div className="mt-8 md:mt-12 grid grid-cols-4 gap-4 md:gap-8">
            {cards.map((c) => (
              <button
                key={c.label}
                onClick={() => go(c)}
                className="group flex flex-col items-center gap-3 md:gap-4 transition hover:scale-110"
              >
                <div className="grid h-16 w-16 md:h-28 md:w-28 place-items-center rounded-2xl md:rounded-3xl border border-amber-300/30 bg-amber-400/15 backdrop-blur-xl transition group-hover:bg-amber-400/25 group-hover:shadow-lg group-hover:shadow-amber-400/20">
                  <c.icon className="h-6 w-6 md:h-10 md:w-10 text-amber-400" />
                </div>
                <span className="text-center text-[11px] md:text-sm font-semibold text-white">{c.label}</span>
              </button>
            ))}
          </div>
        )}

        {sections.map((sec) => (
          <div
            key={sec.title}
            className="mt-8 rounded-3xl border border-white/30 bg-white/10 backdrop-blur-xl p-5"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
                <sec.icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-display text-lg font-bold text-white">{sec.title}</h2>
            </div>
            <div className="mt-3 h-px bg-white/20" />
            <ul className="mt-2 divide-y divide-white/20">
              {sec.items.map((t) => (
                <li key={t.label}>
                  <button
                    onClick={() => go(t)}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-white/10"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/15 backdrop-blur">
                      <t.icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="flex-1 text-[15px] text-white font-medium">{t.label}</span>
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-black/40 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Sales" icon={ShoppingCart} onClick={() => navigate({ to: "/m/sales" })} />
          <BottomBtn label="Scan" icon={Scan} big onClick={() => navigate({ to: "/pos" })} />
          <BottomBtn label="Stock" icon={Package} onClick={() => navigate({ to: "/m/inventory" })} />
          <BottomBtn label="More" icon={MoreHorizontal} onClick={() => navigate({ to: "/m/admin" })} />
        </div>
      </nav>
    </div>
  );
}

function BottomBtn({
  label, icon: Icon, active, big, onClick,
}: { label: string; icon: LucideIcon; active?: boolean; big?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span
        className={`grid place-items-center rounded-full transition ${
          big ? "h-14 w-14 -mt-6 shadow-lg shadow-amber-500/40" : "h-10 w-10"
        } ${active || big ? "bg-amber-500 text-white" : "bg-white/10 text-white/70"}`}
      >
        <Icon className={big ? "h-6 w-6" : "h-5 w-5"} />
      </span>
      <span className={`text-[10px] ${active ? "text-white" : "text-white/60"}`}>{label}</span>
    </button>
  );
}
