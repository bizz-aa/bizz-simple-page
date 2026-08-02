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




function AuthedLayout() {
  const router = useRouter();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<{ email?: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <header className="sticky top-0 z-50 border-b border-border bg-card/40 px-6 py-3 backdrop-blur">
          <div className="flex items-center justify-end gap-3">
            <button className="relative rounded-md border border-border p-2 hover:bg-accent">
              <Bell className="h-4 w-4" />
              {alerts && alerts > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-warning px-1 text-[10px] font-bold text-warning-foreground">{alerts}</span>
              ) : null}
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center justify-center rounded-md border border-border p-2 hover:bg-accent">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {(user?.email ?? "?")[0]?.toUpperCase()}
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
                  <button onClick={signOut} className="flex w-full items-center justify-center px-3 py-2 hover:bg-accent">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden px-6 pb-6 pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
