"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  emptyMessage = "No data available"
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage] = useState(10);

  // Filter data based on search
  const filteredData = searchQuery
    ? data.filter(row =>
      columns.some(col => {
        const value = col.accessor ? row[col.accessor] : '';
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    )
    : data;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-navy/5 rounded-md p-8 shadow-sm">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-navy/5 rounded-md w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-navy/2 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-navy/10 rounded-md overflow-hidden shadow-lg shadow-navy/5">
      {/* Search Bar */}
      {searchable && (
        <div className="p-5 border-b border-navy/5 bg-offwhite">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-navy/60 transition-colors" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-navy/10 rounded-md text-sm font-bold text-navy focus:border-navy focus:ring-2 focus:ring-navy/5 outline-none transition-all placeholder:text-navy/20"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-offwhite border-b border-navy/5">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-5 py-4 text-left text-xs font-bold text-navy/40 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <p className="text-base font-bold text-navy/20">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-navy/2 transition-all duration-300 group ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((column, colIdx) => (
                    <td key={colIdx} className="px-5 py-4 text-base font-medium text-navy/70 group-hover:text-navy transition-colors">
                      {column.cell ? column.cell(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-navy/5 flex items-center justify-between bg-offwhite">
          <div className="text-sm font-bold text-navy/40">
            Showing <span className="text-navy/60">{startIndex + 1}</span> to <span className="text-navy/60">{Math.min(endIndex, filteredData.length)}</span> of <span className="text-navy/60">{filteredData.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-md border border-navy/10 bg-white hover:bg-navy/5 disabled:opacity-20 transition-all text-navy/40 hover:text-navy"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-md border border-navy/10 bg-white hover:bg-navy/5 disabled:opacity-20 transition-all text-navy/40 hover:text-navy"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-5 py-2 bg-navy/5 rounded-md text-sm font-bold text-navy">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-md border border-navy/10 bg-white hover:bg-navy/5 disabled:opacity-20 transition-all text-navy/40 hover:text-navy"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-md border border-navy/10 bg-white hover:bg-navy/5 disabled:opacity-20 transition-all text-navy/40 hover:text-navy"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
