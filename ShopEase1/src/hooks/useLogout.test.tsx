import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createTestQueryClient, createWrapper } from "../test/wrappers";
import type { AuthSession, User } from "../types/auth";
import { useAuth } from "./useAuth";
import { useLogout } from "./useLogout";

const ada: User = { id: 1, name: "Ada Obi", email: "ada@example.com" };
const adaSession: AuthSession = { user: ada, accessToken: "test-token" };

describe("useLogout", () => {
  it("signs the user out and empties the query cache", () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(["products", "list", {}], ["cached"]);

    // Two hooks in one test: render them together so they share the same providers.
    const { result } = renderHook(
      () => ({ auth: useAuth(), logout: useLogout() }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    act(() => result.current.auth.signIn(adaSession));
    expect(result.current.auth.user).toEqual(ada);

    act(() => result.current.logout());

    expect(result.current.auth.user).toBeNull();
    expect(queryClient.getQueryData(["products", "list", {}])).toBeUndefined();
  });
});
