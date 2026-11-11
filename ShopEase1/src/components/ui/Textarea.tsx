import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { getFieldClasses } from "../../lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

function Textarea({
  label,
  error,
  hint,
  id,
  required,
  className = "",
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const showHint = Boolean(hint) && !error;
  const describedBy = error ? errorId : showHint ? hintId : undefined;

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <textarea
        id={textareaId}
        rows={4}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${getFieldClasses(Boolean(error))} ${className}`}
        {...rest}
      />
      {showHint && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Textarea;
