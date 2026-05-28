import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardCards } from "@/components/dashboard/DashboardCards";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock framer-motion because layout animations can interfere with JSDOM testing
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockStats = {
  products: 15,
  categories: 8,
  collectionTypes: 5,
  goldTypes: 3,
  users: 4,
  orders: 12,
  events: 6,
  testimonials: 20,
  careers: 2,
};

describe("DashboardCards Component", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test("renders skeletons when loading is true", () => {
    const { container } = render(<DashboardCards stats={null} loading={true} />);
    
    // We should check that the cards are rendered with animate-pulse class
    const skeletonElements = container.getElementsByClassName("animate-pulse");
    expect(skeletonElements.length).toBeGreaterThan(0);
    
    // Should not render numbers/stats
    expect(screen.queryByText("15")).not.toBeInTheDocument();
  });

  test("renders dashboard cards when stats are provided", () => {
    render(<DashboardCards stats={mockStats} loading={false} />);

    // Verify card titles are present
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Testimonials")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    expect(screen.getByText("Collection Types")).toBeInTheDocument();
    
    // Verify count values are printed correctly
    expect(screen.getByText("15")).toBeInTheDocument(); // Products
    expect(screen.getByText("6")).toBeInTheDocument();  // Events
    expect(screen.getByText("20")).toBeInTheDocument(); // Testimonials
    expect(screen.getByText("2")).toBeInTheDocument();  // Careers
  });

  test("redirects to correct route when card is clicked", async () => {
    render(<DashboardCards stats={mockStats} loading={false} />);

    // Click on Products card
    const productsCard = screen.getByText("Products").closest(".cursor-pointer");
    expect(productsCard).toBeInTheDocument();
    await userEvent.click(productsCard!);

    expect(mockPush).toHaveBeenCalledWith("/products");

    // Click on Events card
    const eventsCard = screen.getByText("Events").closest(".cursor-pointer");
    expect(eventsCard).toBeInTheDocument();
    await userEvent.click(eventsCard!);

    expect(mockPush).toHaveBeenCalledWith("/events");
  });
});
