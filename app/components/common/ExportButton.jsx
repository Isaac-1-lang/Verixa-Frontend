"use client";
import { useState } from 'react';
import { Download, FileText, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Export Button Component
 * Provides dropdown menu for exporting various reports
 */
export default function ExportButton({ 
  data,
  projectName = 'Project',
  variant = 'default', // 'default' | 'icon' | 'text'
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handle export with dynamic import (client-side only)
  const handleExport = async (type) => {
    setIsOpen(false);
    setIsExporting(true);

    try {
      // Dynamically import PDF generator (client-side only)
      const {
        generateProjectSummaryPDF,
        generateRequirementsReportPDF,
        generateTestCasesReportPDF,
        generateComprehensiveReportPDF,
        generateExecutionReportPDF
      } = await import('@/app/utils/pdfGenerator');

      switch (type) {
        case 'project':
          if (!data.project) {
            toast.error('Project data is required');
            return;
          }
          generateProjectSummaryPDF(data.project);
          toast.success('Project summary exported successfully!');
          break;

        case 'requirements':
          if (!data.requirements || data.requirements.length === 0) {
            toast.error('No requirements to export');
            return;
          }
          generateRequirementsReportPDF(data.requirements, projectName);
          toast.success('Requirements report exported successfully!');
          break;

        case 'testcases':
          if (!data.testCases || data.testCases.length === 0) {
            toast.error('No test cases to export');
            return;
          }
          generateTestCasesReportPDF(data.testCases, projectName);
          toast.success('Test cases report exported successfully!');
          break;

        case 'executions':
          if (!data.executions || data.executions.length === 0) {
            toast.error('No executions to export');
            return;
          }
          generateExecutionReportPDF(data.executions, projectName);
          toast.success('Execution report exported successfully!');
          break;

        case 'comprehensive':
          if (!data.project) {
            toast.error('Project data is required for comprehensive report');
            return;
          }
          generateComprehensiveReportPDF(data);
          toast.success('Comprehensive report exported successfully!');
          break;

        default:
          toast.error('Invalid export type');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Dropdown options
  const exportOptions = [
    { 
      id: 'comprehensive', 
      label: 'Comprehensive Report', 
      description: 'Complete project overview with all data',
      icon: <FileText size={16} />
    },
    { 
      id: 'project', 
      label: 'Project Summary', 
      description: 'Project information and statistics',
      icon: <FileText size={16} />
    },
    { 
      id: 'requirements', 
      label: 'Requirements Report', 
      description: 'All requirements with details',
      icon: <FileText size={16} />
    },
    { 
      id: 'testcases', 
      label: 'Test Cases Report', 
      description: 'All test cases with details',
      icon: <FileText size={16} />
    },
    { 
      id: 'executions', 
      label: 'Execution Report', 
      description: 'Test execution results',
      icon: <FileText size={16} />
    },
  ];

  // Render button based on variant
  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isExporting}
          className="p-2.5 bg-white border-2 border-navy/20 text-navy rounded-lg hover:bg-navy/5 hover:border-navy/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
        </button>
      );
    }

    if (variant === 'text') {
      return (
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isExporting}
          className="flex items-center gap-2 text-navy/70 hover:text-navy font-bold text-sm transition-colors disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download size={16} />
              Export PDF
              <ChevronDown size={14} />
            </>
          )}
        </button>
      );
    }

    // Default variant
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className="flex items-center gap-2 px-5 py-3 bg-navy text-white rounded-xl font-bold text-sm hover:bg-navy/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download size={18} />
            Export PDF
            <ChevronDown size={14} />
          </>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      {renderButton()}

      {/* Dropdown Menu */}
      {isOpen && !isExporting && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-navy/10 z-50 overflow-hidden">
            <div className="p-3 bg-navy/5 border-b border-navy/10">
              <p className="text-sm font-bold text-navy">Select Report Type</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {exportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-navy/5 transition-colors text-left border-b border-navy/5 last:border-b-0"
                >
                  <div className="mt-0.5 text-navy/60">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-navy mb-0.5">
                      {option.label}
                    </p>
                    <p className="text-xs text-navy/50">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-blue-50 border-t border-blue-100">
              <p className="text-xs text-blue-800 flex items-center gap-2">
                <FileText size={12} />
                PDFs will be downloaded to your device
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
