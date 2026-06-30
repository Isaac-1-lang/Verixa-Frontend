"use client";
import { useState } from 'react';
import { Upload } from 'lucide-react';
import ImportModal from '../common/ImportModal';
import toast from 'react-hot-toast';

/**
 * Example component showing how to use ImportModal
 * Can be integrated into Test Cases, Requirements, or other pages
 */
export default function ImportExample() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Handle import for test cases
  const handleImportTestCases = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically:
    // 1. Format the data according to your API requirements
    // 2. Make API call to bulk create test cases
    // 3. Handle response and update UI
    
    console.log('Importing test cases:', data);
    
    // Example of what you might do:
    // const response = await fetch('/api/test-cases/bulk-import', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ testCases: data })
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to import test cases');
    // }
    
    return data;
  };

  // Handle import for requirements
  const handleImportRequirements = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Importing requirements:', data);
    
    // Make your API call here
    return data;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white border border-navy/10 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-navy mb-4">Bulk Import Example</h2>
        <p className="text-navy/60 mb-6">
          Click the button below to open the import modal and bulk upload test cases or requirements.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy/90 transition-all shadow-lg"
          >
            <Upload size={20} />
            Import Test Cases
          </button>
          
          <button
            onClick={() => toast.info('Change type prop to "requirement" in ImportModal')}
            className="flex items-center gap-3 px-6 py-3 border-2 border-navy/20 text-navy rounded-xl font-bold hover:bg-navy/5 transition-all"
          >
            <Upload size={20} />
            Import Requirements
          </button>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportTestCases}
        type="testcase"
        title="Import Test Cases"
      />

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">How to Integrate:</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>1. Add to your page:</strong></p>
          <pre className="bg-blue-100 p-3 rounded-lg overflow-x-auto text-xs">
{`import ImportModal from '@/app/components/common/ImportModal';

const [isImportOpen, setIsImportOpen] = useState(false);

// In your JSX:
<button onClick={() => setIsImportOpen(true)}>
  Import
</button>

<ImportModal
  isOpen={isImportOpen}
  onClose={() => setIsImportOpen(false)}
  onImport={handleImport}
  type="testcase" // or "requirement"
  title="Import Test Cases"
/>`}
          </pre>
          
          <p className="mt-4"><strong>2. Implement the import handler:</strong></p>
          <pre className="bg-blue-100 p-3 rounded-lg overflow-x-auto text-xs">
{`const handleImport = async (data) => {
  try {
    const response = await fetch('/api/test-cases/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testCases: data })
    });
    
    if (!response.ok) throw new Error('Import failed');
    
    // Refresh your data list
    fetchTestCases();
  } catch (error) {
    throw error; // Modal will handle error display
  }
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
