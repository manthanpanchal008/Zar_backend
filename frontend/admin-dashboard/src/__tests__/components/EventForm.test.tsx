import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventForm } from "@/components/events/EventForm";
import { api } from "@/lib/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/api", () => ({
  api: {
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    put: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
  uploadConfig: () => ({ headers: { "Content-Type": "multipart/form-data" } }),
  API_BASE_URL: "http://localhost:5001",
}));

describe("EventForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates required event title", async () => {
    render(<EventForm />);

    await userEvent.click(screen.getByRole("button", { name: /save event/i }));

    expect(await screen.findByText(/^event title is required$/i)).toBeInTheDocument();
  });

  test("validates that end date cannot be earlier than start date", async () => {
    render(<EventForm />);

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(endDateInput, { target: { value: "2026-05-25" } });
    fireEvent.change(startDateInput, { target: { value: "2026-05-26" } });

    await userEvent.click(screen.getByRole("button", { name: /save event/i }));

    expect(await screen.findByText(/end date cannot be earlier than start date/i)).toBeInTheDocument();
  });

  test("submits form successfully when dates are valid", async () => {
    render(<EventForm />);

    await userEvent.type(screen.getByLabelText(/event title \*/i), "Exhibition");
    
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(startDateInput, { target: { value: "2026-05-26" } });
    fireEvent.change(endDateInput, { target: { value: "2026-05-28" } });

    await userEvent.click(screen.getByRole("button", { name: /save event/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/admin/events", expect.any(FormData), expect.any(Object));
    });
  });
});
