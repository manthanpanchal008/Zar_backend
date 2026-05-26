"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type Filter = {
  key: string;
  label: string;
  options: FilterOption[];
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: Filter[];
  emptyMessage?: string;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKeys = [],
  searchPlaceholder = "Search...",
  filters = [],
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Reset pagination on search or filter change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, val: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtered & Searched Data
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const keysToSearch = searchKeys.length > 0 ? searchKeys : columns.map((col) => col.key);
        return keysToSearch.some((key) => {
          const val = item[key];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // 2. Column Filters
    Object.entries(activeFilters).forEach(([key, val]) => {
      if (val) {
        result = result.filter((item) => {
          const itemVal = item[key];
          if (itemVal === undefined || itemVal === null) return false;
          return String(itemVal).toLowerCase() === val.toLowerCase();
        });
      }
    });

    // 3. Sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (valA === undefined || valA === null) valA = "";
        if (valB === undefined || valB === null) valB = "";

        // Parse numerical values if they look like numbers
        const numA = Number(valA);
        const numB = Number(valB);
        if (!Number.isNaN(numA) && !Number.isNaN(numB) && typeof valA !== "boolean" && typeof valB !== "boolean") {
          return direction === "asc" ? numA - numB : numB - numA;
        }

        // Compare strings
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return direction === "asc" ? -1 : 1;
        if (strA > strB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, activeFilters, sortConfig, searchKeys, columns]);

  // Paginated Data
  const totalEntries = processedData.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  return (
    <div className="space-y-4">
      {/* Search & Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative min-w-[260px] max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-zar-muted pointer-events-none">
            <Search size={18} className="text-zar-muted" />
          </span>
          <input
            type="text"
            className="w-full h-10 pl-10 pr-4 text-sm text-black bg-white border border-[#e7dfd3] rounded-lg focus:border-zar-gold focus:outline-none focus:ring-2 focus:ring-zar-gold/20 transition-all placeholder-zar-muted"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <select
                key={f.key}
                className="h-10 min-w-[140px] px-3 text-sm text-black bg-white border border-[#e7dfd3] rounded-lg focus:border-zar-gold focus:outline-none focus:ring-2 focus:ring-zar-gold/20 transition-all cursor-pointer"
                value={activeFilters[f.key] || ""}
                onChange={(e) => handleFilterChange(f.key, e.target.value)}
              >
                <option value="">All {f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Page Size Selection Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zar-muted">
          <span>Show</span>
          <select
            className="h-10 w-20 px-2 text-center text-sm text-black bg-white border border-[#e7dfd3] rounded-lg focus:border-zar-gold focus:outline-none focus:ring-2 focus:ring-zar-gold/20 transition-all cursor-pointer"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 30, 40].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-[#eee7dd] bg-white">
        <table className="admin-table w-full text-left border-collapse">
          <thead>
            <tr className="bg-zar-bg">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`select-none ${col.sortable ? "cursor-pointer hover:bg-[#eee7dd]" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-zar-muted">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIdx) => (
                <tr key={item.id || rowIdx} className="hover:bg-zar-bg/50 transition">
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(item) : (item[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-zar-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-zar-muted">
        <div>
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-[#eee7dd] bg-white px-3 py-1.5 font-semibold text-black hover:bg-zar-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-9 w-9 rounded-lg border font-semibold transition ${
                  currentPage === pageNum
                    ? "border-zar-gold bg-zar-gold text-black"
                    : "border-[#eee7dd] bg-white text-black hover:bg-zar-bg"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-[#eee7dd] bg-white px-3 py-1.5 font-semibold text-black hover:bg-zar-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
