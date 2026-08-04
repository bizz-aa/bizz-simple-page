import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Package, ScanLine, Landmark, LayoutGrid } from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/m/inventory", label: "Stock", icon: Package },
  { to: "/pos", label: "Scan", icon: ScanLine, center: true },
  { to: "/m/tax", label: "Tax", icon: Landmark },
  { to: "/m/admin", label: "More", icon: LayoutGrid },
] as const;

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="border-t border-white/10 bg-neutral-950/85 backdrop-blur-2xl">
        <div
          className="mx-auto flex max-w-md items-stretch justify-between gap-1 px-3 pt-2"
          style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
        >
          {ITEMS.map((item) => {
            const active =
              pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            if ("center" in item && item.center) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex flex-1 flex-col items-center gap-1 pt-0.5"
                  aria-label={item.label}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/40 bg-amber-400/15 text-amber-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-medium text-white/50">{item.label}</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-1 flex-col items-center gap-1 pt-0.5"
                aria-label={item.label}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl transition ${
                    active ? "bg-white/10 text-white" : "text-white/45"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span
                  className={`text-[10px] font-medium ${active ? "text-white" : "text-white/45"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
