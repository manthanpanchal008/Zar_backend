import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";
import { api } from "@/lib/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("@/lib/api", () => ({
  api: {
    post: jest.fn(),
  },
}));

describe("Login page", () => {
  test("validates required fields", async () => {
    render(<LoginPage />);

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test("submits login form to API", async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        token: "token-123",
        user: { id: 1, name: "Admin", email: "admin@example.com", role: "admin" },
      },
    });

    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText(/admin@example.com/i), "admin@example.com");
    await userEvent.type(screen.getByPlaceholderText(/enter password/i), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(api.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "admin@example.com",
      password: "secret123",
    });
  });
});
