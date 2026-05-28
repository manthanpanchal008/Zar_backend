import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

describe("RichTextEditor Component", () => {
  test("renders WYSIWYG mode and switches to HTML mode on click", async () => {
    const handleChange = jest.fn();
    render(<RichTextEditor value="<p>Hello World</p>" onChange={handleChange} placeholder="Write something..." />);

    // Verify WYSIWYG content area is shown initially
    const contentArea = screen.getByText("Hello World");
    expect(contentArea).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Edit HTML Source...")).not.toBeInTheDocument();

    // Click on HTML Toggle Code icon button
    const htmlModeButton = screen.getByTitle("Toggle HTML Source");
    await userEvent.click(htmlModeButton);

    // Verify textarea for HTML source is rendered
    const textarea = screen.getByPlaceholderText("Edit HTML Source...");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("<p>Hello World</p>");

    // Edit raw HTML source in textarea
    fireEvent.change(textarea, { target: { value: "<h1>New Title</h1>" } });
    expect(handleChange).toHaveBeenCalledWith("<h1>New Title</h1>");

    // Click on HTML Toggle button again to return to WYSIWYG
    await userEvent.click(htmlModeButton);

    // Verify WYSIWYG content is updated and textarea is hidden
    expect(screen.queryByPlaceholderText("Edit HTML Source...")).not.toBeInTheDocument();
  });
});
