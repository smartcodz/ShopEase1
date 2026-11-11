type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

function Spinner({ size = "md", label = "Loading" }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <span
        aria-hidden="true"
        className={[
          "inline-block animate-spin rounded-full border-indigo-200 border-t-indigo-600",
          sizeClasses[size],
        ].join(" ")}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
