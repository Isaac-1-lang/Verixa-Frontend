"use client";
import { useState } from 'react';
import { X, Download, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import FileUpload from './FileUpload';
import { parseFile, validateTestCaseData, validateRequirementData, downloadTemplate } from '@/app/utils/fileParser';
import toast from 'react-hot-toast';

/**
 * Import Modal Component
 * Handles bulk import of test cases, requirements, etc.
 */
export default function ImportModal({ 
  isOpen, 
  onClose, 
  onImport,
  type = 'testcase', // 'testcase' or 'requirement'
  title = "Import Data"
}) {
  const [parsedData, setParsedData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [importing, setImporting] = useState(false);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    try {
      const file = files[0]; // Take first file only
      
      // Parse file
      const result = await parseFile(file);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to parse file');
        return;
      }

      if (result.requiresLibrary) {
        toast.error(result.message);
        return;
      }

      setParsedData(result);

      // Validate data
      let validation;
      if (type === 'testcase') {
        validation = validateTestCaseData(result.data);
      } else if (type === 'requirement') {
        validation = validateRequirementData(result.data);
      }

      setValidationResult(validation);

      if (validation.isValid) {
        toast.success(`File parsed successfully! ${result.rowCount} rows found.`);
      } else {
        toast.error(`Validation failed: ${validation.errors.length} error(s) found`);
      }
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process file');
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!parsedData || !validationResult?.isValid) {
      toast.error('Please fix validation errors before importing');
      return;
    }

    setImporting(true);
    
    try {
      await onImport(parsedData.data);
      toast.success(`Successfully imported ${parsedData.data.length} items!`);
      handleClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setParsedData(null);
    setValidationResult(null);
    setImporting(false);
    onClose();
  };

  // Download template
  const handleDownloadTemplate = () => {
    downloadTemplate(type);
    toast.success('Template downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy/10 flex items-center justify-between bg-navy/5">
          <div>
            <h2 className="text-2xl font-bold text-navy">{title}</h2>
            <p className="text-sm text-navy/60 mt-1">
              Upload and import data in bulk from CSV, Excel, or text files
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={importing}
            className="p-2 hover:bg-navy/10 rounded-lg transition-colors text-navy/60 hover:text-navy disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-blue-600" />
              <div>
                <p className="text-sm font-bold text-blue-900">Need a template?</p>
                <p className="text-xs text-blue-700">Download our CSV template to get started</p>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Download Template
            </button>
          </div>

          {/* File Upload */}
          <FileUpload
            onFileUpload={handleFileUpload}
            acceptedTypes={['.csv', '.txt', '.xlsx', '.xls']}
            maxSizeMB={10}
            label="Upload Your File"
            description="Drag and drop or click to browse"
            multiple={false}
          />

          {/* Data Preview */}
          {parsedData && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-navy/5 rounded-xl border border-navy/10">
                  <p className="text-sm font-bold text-navy/60 mb-1">Total Rows</p>
                  <p className="text-2xl font-bold text-navy">{parsedData.rowCount}</p>
                </div>
                <div className="p-4 bg-navy/5 rounded-xl border border-navy/10">
                  <p className="text-sm font-bold text-navy/60 mb-1">Columns</p>
                  <p className="text-2xl font-bold text-navy">{parsedData.headers?.length || 0}</p>
                </div>
                <div className="p-4 bg-navy/5 rounded-xl border border-navy/10">
                  <p className="text-sm font-bold text-navy/60 mb-1">Status</p>
                  <p className={`text-2xl font-bold ${validationResult?.isValid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {validationResult?.isValid ? 'Valid' : 'Errors'}
                  </p>
                </div>
              </div>

              {/* Validation Results */}
              {validationResult && (
                <div className={`p-4 rounded-xl border-2 ${
                  validationResult.isValid 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {validationResult.isValid ? (
                      <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold text-base mb-2 ${
                        validationResult.isValid ? 'text-emerald-900' : 'text-red-900'
                      }`}>
                        {validationResult.isValid 
                          ? 'Validation Passed' 
                          : `${validationResult.errors.length} Validation Error(s)`}
                      </p>
                      {!validationResult.isValid && (
                        <ul className="space-y-1 text-sm text-red-800 max-h-40 overflow-y-auto">
                          {validationResult.errors.map((error, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-600">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Data Preview Table */}
              <div className="border border-navy/10 rounded-xl overflow-hidden">
                <div className="bg-navy/5 px-4 py-3 border-b border-navy/10">
                  <p className="font-bold text-navy">Data Preview (First 5 rows)</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10">
                        {parsedData.headers?.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-3 text-left text-xs font-bold text-navy/60 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {parsedData.data?.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-navy/2">
                          {parsedData.headers?.map((header, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-4 py-3 text-sm text-navy/70"
                            >
                              {row[header] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy/10 bg-navy/5 flex items-center justify-between">
          <button
            onClick={handleClose}
            disabled={importing}
            className="px-6 py-3 border-2 border-navy/20 text-navy font-bold rounded-xl hover:bg-navy/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          
          {parsedData && (
            <button
              onClick={handleImport}
              disabled={!validationResult?.isValid || importing}
              className="px-8 py-3 bg-navy text-white font-bold rounded-xl hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {importing ? 'Importing...' : `Import ${parsedData.rowCount} Items`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
