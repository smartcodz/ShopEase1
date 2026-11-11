import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: if `value` changes before the timer ends, cancel the old timer.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
