import { api } from "@/lib/api";

describe("Axios API instance", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test("attaches bearer token from session storage", async () => {
    window.sessionStorage.setItem("zar_admin_token", "token-123");
    const handlers = (api.interceptors.request as any).handlers;
    const config = await handlers[0].fulfilled({ headers: {} });

    expect(config?.headers.Authorization).toBe("Bearer token-123");
  });
});
