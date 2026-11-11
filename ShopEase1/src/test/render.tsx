import type { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import { createTestQueryClient, createWrapper } from "./wrappers";

interface RenderAppOptions {
  route?: string; // the fake URL the app starts on
  queryClient?: QueryClient;
  fakeTimers?: boolean; // set true when the test calls vi.useFakeTimers()
}

// Renders a component like the real app does: router + providers, plus a ready user.
export function renderApp(ui: ReactElement, options: RenderAppOptions = {}) {
  const {
    route = "/",
    queryClient = createTestQueryClient(),
    fakeTimers = false,
  } = options;
  const Providers = createWrapper(queryClient);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <Providers>{children}</Providers>
      </MemoryRouter>
    );
  }

  const user = userEvent.setup(
    fakeTimers ? { advanceTimers: vi.advanceTimersByTime } : undefined,
  );

  return { user, queryClient, ...render(ui, { wrapper: Wrapper }) };
}
