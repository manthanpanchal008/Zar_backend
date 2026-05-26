import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/ui/DataTable";

describe("DataTable component", () => {
  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "status", label: "Status" },
  ];

  const data = [
    { id: 1, name: "Gold Ring", status: "available" },
    { id: 2, name: "Silver Bracelet", status: "sold" },
    { id: 3, name: "Diamond Necklace", status: "available" },
  ];

  test("renders headers and initial data", () => {
    render(<DataTable columns={columns} data={data} />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    expect(screen.getByText("Gold Ring")).toBeInTheDocument();
    expect(screen.getByText("Silver Bracelet")).toBeInTheDocument();
    expect(screen.getByText("Diamond Necklace")).toBeInTheDocument();
  });

  test("searches items by query", () => {
    render(<DataTable columns={columns} data={data} searchKeys={["name"]} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "ring" } });

    expect(screen.getByText("Gold Ring")).toBeInTheDocument();
    expect(screen.queryByText("Silver Bracelet")).not.toBeInTheDocument();
    expect(screen.queryByText("Diamond Necklace")).not.toBeInTheDocument();
  });

  test("filters items by select option", () => {
    const filters = [
      {
        key: "status",
        label: "Status",
        options: [
          { label: "Available", value: "available" },
          { label: "Sold", value: "sold" },
        ],
      },
    ];

    render(<DataTable columns={columns} data={data} filters={filters} />);

    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "sold" } });

    expect(screen.getByText("Silver Bracelet")).toBeInTheDocument();
    expect(screen.queryByText("Gold Ring")).not.toBeInTheDocument();
  });
});
