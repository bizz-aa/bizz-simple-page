import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, ShoppingCart, Package, Wallet, Users, BarChart3, Settings,
  LogOut, Bell, Landmark, UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthedLayout,
});

const MODULES = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/m/sales", label: "Sales", icon: ShoppingCart },
  { to: "/m/crm", label: "Customers & CRM", icon: UserRound },
  { to: "/m/inventory", label: "Inventory", icon: Package },
  { to: "/m/finance", label: "Finance", icon: Wallet },
  { to: "/m/tax", label: "Tax Management", icon: Landmark },
  { to: "/m/employees", label: "Employees", icon: Users },
  { to: "/m/reports", label: "Reports", icon: BarChart3 },
  { to: "/m/admin", label: "Administration", icon: Settings },
] as const;

const HEADINGS: { match: string; title: string; subtitle: string }[] = [
  { match: "/dashboard", title: "Welcome back,", subtitle: "Here's what's happening with your business today." },
  { match: "/m/sales", title: "Sales", subtitle: "Manage orders, quotes and invoices." },
  { match: "/m/crm", title: "Customers & CRM", subtitle: "Relationships and campaigns." },
  { match: "/m/inventory", title: "Inventory", subtitle: "Stock levels, products and movements." },
  { match: "/m/finance", title: "Finance", subtitle: "Cashflow, accounts and expenses." },
  { match: "/m/tax", title: "Tax Management", subtitle: "Independent tax records & compliance." },
  { match: "/m/employees", title: "Employees", subtitle: "Team, roles and payroll." },
  { match: "/m/reports", title: "Reports", subtitle: "Business performance at a glance." },
  { match: "/m/admin", title: "Administration", subtitle: "Users, roles and settings." },
  { match: "/pos", title: "Point of Sale", subtitle: "Fast checkout for your counter." },
];

function useHeading(pathname: string) {
  return (
    HEADINGS.find((h) => pathname === h.match || pathname.startsWith(h.match + "/")) ?? {
      title: "Bizz Automators",
      subtitle: "Business automation workspace.",
    }
  );
}


function AuthedLayout() {
  const router = useRouter();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<{ email?: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const heading = useHeading(pathname);


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { data: alerts } = useQuery({
    queryKey: ["low-stock-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .lt("stock_quantity", 5);
      return count ?? 0;
    },
    refetchInterval: 60000,
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-96 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-40 items-center justify-center border-b border-sidebar-border px-8 py-8">
          <img
            src="/logo.png"
            alt="BIZZ AUTOMATORS logo"
            className="h-32 w-32 rounded-3xl object-contain"
          />
        </div>
        <nav className="flex-1 space-y-2 px-3 py-4">
          {MODULES.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== "/dashboard" && pathname.startsWith(item.to)) ||
              (item.to === "/m/sales" && pathname.startsWith("/pos")) ||
              (item.to === "/m/admin" && false);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 ease-out ${
                  active
                    ? "border-white/20 bg-white/15 text-foreground shadow-[0_10px_35px_rgba(255,255,255,0.12)] backdrop-blur-xl"
                    : "border-transparent bg-transparent text-sidebar-foreground/80 hover:border-white/10 hover:bg-white/10 hover:text-foreground hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)] hover:backdrop-blur-md"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-primary shadow-inner"
                      : "bg-white/5 text-sidebar-foreground/80 group-hover:bg-white/15 group-hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex h-screen flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/90 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold tracking-tight text-white md:text-2xl">
                {heading.title}
              </h1>
              <p className="mt-0.5 truncate text-xs text-white/55 md:text-sm">{heading.subtitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button className="relative grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/80 transition hover:bg-white/10">
                <Bell className="h-4 w-4" />
                {alerts && alerts > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-black">{alerts}</span>
                ) : null}
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-sm font-bold text-black transition hover:bg-amber-300"
                  aria-label="Account menu"
                >
                  {(user?.email ?? "?")[0]?.toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg">
                    <button onClick={signOut} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-6 pb-6 pt-8">
          <div key={pathname} className="page-transition">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
