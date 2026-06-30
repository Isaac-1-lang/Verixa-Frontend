# File Upload & Import System Documentation

## Overview

This documentation covers the file upload and bulk import functionality for uploading test cases, requirements, and other data through Excel, CSV, PDF, and text files.

## Components

### 1. FileUpload Component (`app/components/common/FileUpload.jsx`)

A reusable drag-and-drop file upload component with validation.

#### Features:
- ✅ Drag and drop support
- ✅ File type validation (.xlsx, .xls, .csv, .pdf, .txt)
- ✅ File size validation (configurable, default 10MB)
- ✅ Multiple file support (optional)
- ✅ Visual feedback and progress indicators
- ✅ Duplicate file prevention
- ✅ Error handling with toast notifications
- ✅ File preview with icons
- ✅ Base64 encoding for upload

#### Props:
```javascript
<FileUpload
  onFileUpload={(files) => handleFiles(files)}  // Callback with file data
  acceptedTypes={['.csv', '.xlsx']}             // File types allowed
  maxSizeMB={10}                                // Max file size in MB
  label="Upload File"                           // Label text
  description="Drag and drop..."               // Helper text
  multiple={false}                              // Allow multiple files
  disabled={false}                              // Disable component
/>
```

### 2. ImportModal Component (`app/components/common/ImportModal.jsx`)

A modal dialog for importing bulk data with preview and validation.

#### Features:
- ✅ File upload integration
- ✅ Data parsing and preview
- ✅ Field validation
- ✅ Error reporting
- ✅ Sample template download
- ✅ Data preview table (first 5 rows)
- ✅ Import confirmation

#### Props:
```javascript
<ImportModal
  isOpen={true}                                 // Modal visibility
  onClose={() => setOpen(false)}               // Close handler
  onImport={(data) => handleImport(data)}      // Import handler
  type="testcase"                              // 'testcase' or 'requirement'
  title="Import Test Cases"                    // Modal title
/>
```

### 3. File Parser Utilities (`app/utils/fileParser.js`)

Utility functions for parsing different file formats.

#### Functions:

##### `parseCSV(content)`
Parses CSV content into array of objects.
- Handles quoted values with commas
- Returns headers and data rows
- Error handling for malformed CSV

##### `parseTXT(content)`
Parses text files (supports tab-separated and pipe-separated formats).
- Detects structured vs. plain text
- Returns formatted data

##### `parseExcel(base64Content)` *(requires xlsx library)*
Placeholder for Excel parsing.
- Install: `npm install xlsx`
- Returns structured data

##### `parsePDF(base64Content)` *(requires pdf-parse library)*
Placeholder for PDF parsing.
- Install: `npm install pdf-parse`
- Extracts text content

##### `validateTestCaseData(data)`
Validates test case data structure.
- Required fields: title, description
- Returns validation errors

##### `validateRequirementData(data)`
Validates requirement data structure.
- Required fields: title, description, type
- Validates type against allowed values

##### `downloadTemplate(type)`
Downloads CSV template file.
- Types: 'testcase' or 'requirement'
- Pre-formatted headers and sample data

## Usage Examples

### Example 1: Basic File Upload

```javascript
import FileUpload from '@/app/components/common/FileUpload';

function MyComponent() {
  const handleUpload = async (files) => {
    console.log('Files uploaded:', files);
    // Process files here
  };

  return (
    <FileUpload
      onFileUpload={handleUpload}
      acceptedTypes={['.csv', '.xlsx']}
      maxSizeMB={5}
    />
  );
}
```

### Example 2: Import Modal Integration

```javascript
import { useState } from 'react';
import ImportModal from '@/app/components/common/ImportModal';

function TestCasesPage() {
  const [importOpen, setImportOpen] = useState(false);

  const handleImport = async (data) => {
    // Format data for your API
    const formattedData = data.map(row => ({
      title: row.title,
      description: row.description,
      priority: row.priority || 'Medium',
      type: row.type || 'Functional'
    }));

    // Call your API
    const response = await fetch('/api/test-cases/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testCases: formattedData })
    });

    if (!response.ok) {
      throw new Error('Failed to import test cases');
    }

    // Refresh your data
    fetchTestCases();
  };

  return (
    <>
      <button onClick={() => setImportOpen(true)}>
        Import Test Cases
      </button>

      <ImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        type="testcase"
        title="Import Test Cases"
      />
    </>
  );
}
```

### Example 3: Custom File Parser

```javascript
import { parseFile } from '@/app/utils/fileParser';

async function handleCustomParsing(file) {
  const result = await parseFile(file);
  
  if (!result.success) {
    console.error('Parse error:', result.error);
    return;
  }

  console.log('Parsed data:', result.data);
  console.log('Row count:', result.rowCount);
  console.log('Headers:', result.headers);
}
```

## CSV Template Formats

### Test Case Template
```csv
title,description,priority,type,expectedResult
"Login Test","Verify user can login with valid credentials","High","Functional","User successfully logged in"
"Password Reset","Test password reset functionality","Medium","Functional","Password reset email sent"
```

### Requirement Template
```csv
title,description,type,priority,status
"User Authentication","System shall allow users to authenticate","Functional","High","Approved"
"Performance Requirement","System shall respond within 2 seconds","Non-Functional","High","Draft"
```

## Error Handling

### File Validation Errors
- **Invalid file type**: "File type not supported. Accepted: .csv, .xlsx, .txt"
- **File too large**: "File exceeds maximum size of 10MB"
- **Duplicate file**: "File already added"

### Parse Errors
- **Empty file**: "File is empty"
- **Malformed CSV**: "Failed to parse CSV: invalid format"
- **Missing required fields**: "Row 3: Missing required field 'title'"

### Import Errors
- **Validation failed**: "Fix X validation errors before importing"
- **API error**: "Failed to import data: [error message]"

## Security Considerations

### File Size Limits
- Default: 10MB per file
- Configurable via `maxSizeMB` prop
- Prevents memory overflow attacks

### File Type Restrictions
- Whitelist approach (only specified extensions allowed)
- Client-side and server-side validation recommended
- MIME type checking on server

### Content Validation
- Sanitize input data before database insertion
- Validate field lengths
- Escape special characters
- Use parameterized queries

### Best Practices
1. Always validate on both client and server
2. Implement rate limiting for bulk imports
3. Log import activities for audit trails
4. Use transactions for bulk operations
5. Provide rollback capability for failed imports

## Performance Optimization

### Large File Handling
```javascript
// For files > 5MB, consider chunked processing
const CHUNK_SIZE = 1000; // rows per chunk

async function importInChunks(data) {
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    await importChunk(chunk);
  }
}
```

### Memory Management
- Parse files in streams for very large files
- Clear data after successful import
- Use pagination for preview

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

### Features Used:
- FileReader API
- Drag and Drop API
- Base64 encoding
- Modern JavaScript (ES6+)

## Future Enhancements

### Planned Features:
- [ ] Excel parsing implementation (install xlsx library)
- [ ] PDF text extraction (install pdf-parse library)
- [ ] Column mapping interface
- [ ] Data transformation rules
- [ ] Import scheduling
- [ ] Import history tracking
- [ ] Duplicate detection during import
- [ ] Undo/rollback functionality

### Installation for Full Features:

```bash
# For Excel support
npm install xlsx

# For PDF support
npm install pdf-parse

# Then update fileParser.js with actual implementations
```

## Troubleshooting

### Common Issues:

**Q: Files won't upload**
- Check file size (under 10MB)
- Verify file extension is allowed
- Check browser console for errors

**Q: Validation always fails**
- Verify CSV headers match template
- Check for empty required fields
- Ensure data types are correct

**Q: Import hangs or times out**
- Reduce file size
- Check network connection
- Verify API endpoint is responding

**Q: Special characters appear incorrect**
- Ensure file is UTF-8 encoded
- Check `charset` in CSV export settings

## Support

For issues or questions:
1. Check this documentation
2. Review example component
3. Check browser console for errors
4. Contact development team

## Version History

- **v1.0.0** (Current): Initial implementation
  - File upload component
  - Import modal
  - CSV and TXT parsing
  - Validation system
  - Template generation
