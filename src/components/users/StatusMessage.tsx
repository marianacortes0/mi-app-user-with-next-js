import { AlertCircle, CheckCircle2 } from "lucide-react";

type StatusMessageProps = {
  type: "error" | "success";
  message: string;
};

export function StatusMessage({ type, message }: StatusMessageProps) {
  // El mismo componente sirve para mensajes de error y éxito.
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      <Icon className="mt-0.5 shrink-0" size={18} />
      <span>{message}</span>
    </div>
  );
}
