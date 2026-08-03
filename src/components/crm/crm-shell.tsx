import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Home, Package, Scan, Landmark, MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

export function CrmShell({
  title,
  subtitle,
  action,
  children,
  backTo = "/m/crm",
  plain = false,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  backTo?: string;
  plain?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div
      className="relative -m-6 min-h-[calc(100vh-4rem)] overflow-hidden text-white"
    >

      <div className="mx-auto max-w-md md:max-w-6xl px-4 md:px-10 pb-28 md:pb-12 pt-5 md:pt-10">
        {/* Header — stacks on mobile so title never truncates behind action */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate({ to: backTo })}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-0.5 text-xs md:text-sm text-white/70">{subtitle}</p>
              )}
            </div>
          </div>
          {action && (
            <div className="flex w-full items-center gap-2 md:w-auto md:ml-auto md:shrink-0">
              {action}
            </div>
          )}
        </div>

        {/* Accent underline */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-amber-400/40 via-white/10 to-transparent" />

        <div className="mt-5 md:mt-8">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-black/40 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Stock" icon={Package} onClick={() => navigate({ to: "/m/inventory" })} />
          <BottomBtn label="Scan" icon={Scan} big onClick={() => navigate({ to: "/pos" })} />
          <BottomBtn label="Tax" icon={Landmark} onClick={() => navigate({ to: "/m/tax" })} />
          <BottomBtn label="More" icon={MoreHorizontal} onClick={() => navigate({ to: "/m/admin" })} />
        </div>
      </nav>
    </div>
  );
}

function BottomBtn({
  label, icon: Icon, big, onClick,
}: { label: string; icon: any; big?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span
        className={`grid place-items-center rounded-full transition ${
          big ? "h-14 w-14 -mt-6 shadow-lg shadow-amber-500/40 bg-amber-500 text-white" : "h-10 w-10 bg-white/10 text-white/70"
        }`}
      >
        <Icon className={big ? "h-6 w-6" : "h-5 w-5"} />
      </span>
      <span className="text-[10px] text-white/60">{label}</span>
    </button>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] ${className}`}>
      {children}
    </div>
  );
}
