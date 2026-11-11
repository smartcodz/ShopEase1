import { RotateCcw, TriangleAlert } from "lucide-react";
import Button from "./Button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-5">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
