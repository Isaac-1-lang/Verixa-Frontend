"use client";
<<<<<<< HEAD

import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
=======
import { AlertCircle, PlayCircle } from "lucide-react";
>>>>>>> Integration
import DataTable from "../../components/common/DataTable";
import { useGetDefectsByRunQuery } from "@/app/redux/api/DefectApiSlice";
import { useProject } from "@/app/context/ProjectContext";

export default function DefectsPage() {
  const { selectedRunId } = useProject();

  const { data: defectsData = [], isLoading, error } = useGetDefectsByRunQuery(selectedRunId, {
    skip: !selectedRunId
  });

  const defects = Array.isArray(defectsData) ? defectsData.filter(item => item != null) : [];

  const columns = [
    {
      header: "Defect Details",
      accessor: "title",
      cell: (row) => (
        <div className="flex items-center gap-6">
          <div className={`p-3 rounded-md border border-navy/5 bg-navy/5 ${
            row.severity === 'CRITICAL' || row.severity === 'Critical' ? 'text-navy' :
            row.severity === 'HIGH' || row.severity === 'High' ? 'text-navy/60' : 'text-navy/20'
          }`}>
            <AlertCircle 
              size={18} 
              strokeWidth={row.severity === 'CRITICAL' || row.severity === 'Critical' ? 2.5 : 1.5} 
              className={row.severity === 'CRITICAL' || row.severity === 'Critical' ? 'animate-pulse' : ''} 
            />
          </div>
          <div>
            <p className="font-bold text-navy text-sm group-hover:translate-x-1 transition-transform duration-300">{row.title}</p>
            <p className="text-xs text-navy/40 font-medium mt-1">Execution #{row.executionId}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Severity",
      accessor: "severity",
      cell: (row) => (
        <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${
          row.severity === 'CRITICAL' || row.severity === 'Critical' ? 'bg-navy text-white border-navy shadow-sm' :
          row.severity === 'HIGH' || row.severity === 'High' ? 'bg-navy/5 text-navy border-navy/10' :
          'bg-offwhite text-navy/40 border-navy/5'
        }`}>
          {row.severity}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-md ${
            row.status === 'OPEN' || row.status === 'Open' ? 'bg-navy animate-pulse' : 
            row.status === 'IN_PROGRESS' || row.status === 'In Progress' ? 'bg-navy/40' : 'bg-navy/10'
          }`} />
          <span className={`text-xs font-bold ${
            row.status === 'OPEN' || row.status === 'Open' ? 'text-navy' : 'text-navy/20'
          }`}>
            {row.status?.replace('_', ' ')}
          </span>
        </div>
      ),
    },
    {
      header: "Reporter",
      accessor: "reportedBy",
      cell: (row) => (
        <span className="text-sm font-bold text-navy/40">
          {row.reportedBy?.username || row.reportedBy || "-"}
        </span>
      ),
    },
    {
      header: "Log Date",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-xs font-bold text-navy/20">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-bold text-navy leading-tight mb-2">Defects</h1>
          <p className="text-navy/40 text-sm font-medium">Critical vulnerabilities and resolution streams</p>
        </div>
<<<<<<< HEAD
        <button 
          onClick={() => {
            setSelectedExecutionId(1);
            setIsModalOpen(true);
          }}
          disabled={!selectedRunId}
          className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-md font-bold text-sm shadow-xl shadow-navy/10 hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} strokeWidth={2.5} /> Log New Defect
        </button>
=======
>>>>>>> Integration
      </div>

      {!selectedRunId ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
          <PlayCircle className="mx-auto mb-4 text-zinc-300" size={48} />
          <p className="text-zinc-900 font-semibold mb-2">No Test Run Selected</p>
          <p className="text-zinc-600 text-sm">Select a test run from the top bar to view defects.</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">Loading defects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
<<<<<<< HEAD
          <p className="text-red-600">Error loading defects: {error.data?.message || "Unknown error"}</p>
=======
          <p className="text-red-600">Error loading defects.</p>
>>>>>>> Integration
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={defects}
          searchPlaceholder="Search defects..."
          emptyMessage="No defects found for this run."
        />
      )}
    </div>
  );
}
