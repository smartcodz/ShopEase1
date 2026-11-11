import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// We don't use Vitest globals, so Testing Library can't register its own cleanup.
afterEach(() => {
  cleanup();
  localStorage.clear(); // every test starts with an empty browser
});
