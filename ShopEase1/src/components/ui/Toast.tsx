import { CircleAlert, CircleCheck, X } from "lucide-react";

type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

const variantClasses: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

function Toast({ message, variant = "success", onClose }: ToastProps) {
  const Icon = variant === "success" ? CircleCheck : CircleAlert;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="fixed inset-x-4 top-20 z-50 sm:inset-x-auto sm:right-6 sm:w-96"
    >
      <div
        className={[
          "flex items-start gap-3 rounded-xl border p-4 shadow-lg",
          variantClasses[variant],
        ].join(" ")}
      >
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="rounded p-0.5 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
