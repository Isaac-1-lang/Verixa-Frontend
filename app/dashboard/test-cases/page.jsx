"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import TestCaseModal from "../../components/testcases/TestCaseModal";
import { useSearchTestCasesQuery } from "@/app/redux/api/TestCaseApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function TestCasesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  
  const { selectedProjectId } = useProject();

  const { data, isLoading, error } = useSearchTestCasesQuery({
    projectId: selectedProjectId,
    q: search,
    page,
    size: 20
  }, {
    skip: !selectedProjectId
  });

  const testCases = data?.content || [];

  const columns = [
    {
      header: "Test Unit",
      accessor: "tcNumber",
      cell: (row) => (
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-navy/5 rounded-md flex items-center justify-center text-navy/40 group-hover:bg-navy group-hover:text-white transition-all border border-navy/5 group-hover:scale-105">
            <FileText size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-bold text-navy text-sm">{row.tcNumber}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      header: "App Reference",
      accessor: "appRef",
      cell: (row) => (
        <span className="text-sm font-bold text-navy/50">{row.appRef || "-"}</span>
      ),
    },
    {
      header: "Requirement",
      accessor: "frId",
      cell: (row) => (
        <span className="text-sm font-bold text-navy/50">
          {row.frId ? `FR-${row.frId}` : "-"}
        </span>
      ),
    },
    {
      header: "Steps",
      accessor: "steps",
      cell: (row) => (
        <span className="px-3 py-1.5 rounded-md text-xs font-bold border bg-navy/5 text-navy border-navy/10">
          {row.steps?.length || 0} Steps
        </span>
      ),
    },
  ];

  const handleRowClick = (row) => {
    setSelectedTestCase(row);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTestCase(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestCase(null);
  };

  if (!selectedProjectId) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <p className="text-zinc-600">Please select a project from the top bar to view test cases.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Test Cases</h1>
          <p className="text-navy/40 text-sm font-medium">Defined structural quality benchmarks</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all"
        >
          <Plus size={20} strokeWidth={2.5} /> Create Test Case
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading test cases...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading test cases: {error.data?.message || "Unknown error"}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={testCases}
          searchPlaceholder="Search test cases..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleRowClick}
          emptyMessage="No test cases found. Create your first test case to get started."
        />
      )}

      <TestCaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        projectId={selectedProjectId}
        testCase={selectedTestCase}
      />
    </div>
  );
}
