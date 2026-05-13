"use client";
import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import DataTable from "../../components/common/DataTable";
import TestCaseModal from "../../components/testcases/TestCaseModal";
import { useGetTestCasesByProjectQuery } from "@/app/redux/api/TestCaseApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function TestCasesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  
  const { selectedProjectId } = useProject();

  const { data: testCasesData = [], isLoading, error } = useGetTestCasesByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId
  });

  // Filter out null/undefined items
  const testCases = Array.isArray(testCasesData) ? testCasesData.filter(item => item != null) : [];

  const columns = [
    {
      header: "Test Case",
      accessor: "tcNumber",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{row.tcNumber}</p>
            <p className="text-xs text-zinc-500">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      header: "App Reference",
      accessor: "appRef",
      cell: (row) => <span className="text-sm text-zinc-700">{row.appRef || "-"}</span>,
    },
    {
      header: "Requirement",
      accessor: "frId",
      cell: (row) => (
        <span className="text-sm text-zinc-600">
          {row.frId ? `FR-${row.frId}` : "-"}
        </span>
      ),
    },
    {
      header: "Steps",
      accessor: "steps",
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold">
          {row.steps?.length || 0} steps
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
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Test Cases</h1>
          <p className="text-sm text-zinc-600 mt-1">Create and manage test cases with detailed steps</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 w-fit bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={16} /> New Test Case
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading test cases...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading test cases: {error.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={testCases}
          searchPlaceholder="Search test cases..."
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
