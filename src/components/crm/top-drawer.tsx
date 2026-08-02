import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function TopDrawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`absolute inset-x-0 top-0 mx-auto flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-b-3xl border border-white/20 bg-neutral-900/95 text-white shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-white/10 bg-black/30 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-amber-400/60 focus:bg-white/15";
