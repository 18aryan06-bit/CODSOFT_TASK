import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Alert({ type = "error", children }) {
  if (!children) return null;
  const success = type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;
  return <div role={success ? "status" : "alert"} className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
    <Icon size={18} className="mt-0.5 shrink-0" />
    <span>{children}</span>
  </div>;
}
