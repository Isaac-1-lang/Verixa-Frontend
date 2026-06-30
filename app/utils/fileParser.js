/**
 * File Parser Utilities
 * Handles parsing of Excel, CSV, PDF, and TXT files
 */

/**
 * Parse CSV content to array of objects
 */
export const parseCSV = (content) => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }

    return {
      success: true,
      data,
      headers,
      rowCount: data.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to parse CSV'
    };
  }
};

/**
 * Parse a single CSV line (handles quoted values with commas)
 */
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
};

/**
 * Parse TXT content (simple line-based parsing)
 */
export const parseTXT = (content) => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('Text file is empty');
    }

    // Try to detect if it's structured (tab or pipe separated)
    const firstLine = lines[0];
    let separator = null;
    
    if (firstLine.includes('\t')) {
      separator = '\t';
    } else if (firstLine.includes('|')) {
      separator = '|';
    }

    if (separator) {
      // Structured format
      const headers = firstLine.split(separator).map(h => h.trim());
      const data = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(separator).map(v => v.trim());
        if (values.length === headers.length) {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }

      return {
        success: true,
        data,
        headers,
        rowCount: data.length,
        format: 'structured'
      };
    } else {
      // Plain text format
      return {
        success: true,
        data: lines.map((line, index) => ({
          lineNumber: index + 1,
          content: line
        })),
        headers: ['lineNumber', 'content'],
        rowCount: lines.length,
        format: 'plain'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to parse text file'
    };
  }
};

/**
 * Parse Excel content (requires external library in real implementation)
 * This is a placeholder - you'll need to install 'xlsx' package
 */
export const parseExcel = async (base64Content) => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64Content.split(',')[1] || base64Content;
    
    // In a real implementation, you would:
    // 1. Install: npm install xlsx
    // 2. Import: import * as XLSX from 'xlsx';
    // 3. Parse the Excel file
    
    // Placeholder response
    return {
      success: true,
      message: 'Excel parsing requires xlsx library. Please install: npm install xlsx',
      data: [],
      headers: [],
      rowCount: 0,
      requiresLibrary: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to parse Excel file'
    };
  }
};

/**
 * Parse PDF content (requires external library)
 * This is a placeholder - you'll need pdf parsing library
 */
export const parsePDF = async (base64Content) => {
  try {
    // In a real implementation, you would:
    // 1. Install: npm install pdf-parse or pdfjs-dist
    // 2. Extract text from PDF
    
    return {
      success: true,
      message: 'PDF parsing requires pdf-parse library. Please install: npm install pdf-parse',
      data: [],
      requiresLibrary: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to parse PDF file'
    };
  }
};

/**
 * Main file parser - routes to appropriate parser based on extension
 */
export const parseFile = async (file) => {
  const { extension, content, name } = file;
  
  try {
    // Decode base64 content for text-based files
    let textContent = '';
    if (['csv', 'txt'].includes(extension)) {
      const base64Data = content.split(',')[1] || content;
      textContent = atob(base64Data);
    }

    switch (extension) {
      case 'csv':
        return parseCSV(textContent);
      
      case 'txt':
        return parseTXT(textContent);
      
      case 'xlsx':
      case 'xls':
        return await parseExcel(content);
      
      case 'pdf':
        return await parsePDF(content);
      
      default:
        return {
          success: false,
          error: `Unsupported file type: ${extension}`
        };
    }
  } catch (error) {
    return {
      success: false,
      error: `Error parsing ${name}: ${error.message}`
    };
  }
};

/**
 * Validate parsed data structure for test cases
 */
export const validateTestCaseData = (data) => {
  const requiredFields = ['title', 'description'];
  const errors = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate parsed data structure for requirements
 */
export const validateRequirementData = (data) => {
  const requiredFields = ['title', 'description', 'type'];
  const validTypes = ['Functional', 'Non-Functional', 'Business', 'Technical'];
  const errors = [];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
    });
    
    if (row.type && !validTypes.includes(row.type)) {
      errors.push(`Row ${index + 1}: Invalid type '${row.type}'. Must be one of: ${validTypes.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate sample CSV template
 */
export const generateCSVTemplate = (type = 'testcase') => {
  const templates = {
    testcase: `title,description,priority,type,expectedResult
"Login Test","Verify user can login with valid credentials","High","Functional","User successfully logged in"
"Password Reset","Test password reset functionality","Medium","Functional","Password reset email sent"`,
    
    requirement: `title,description,type,priority,status
"User Authentication","System shall allow users to authenticate","Functional","High","Approved"
"Performance Requirement","System shall respond within 2 seconds","Non-Functional","High","Draft"`
  };

  return templates[type] || templates.testcase;
};

/**
 * Download CSV template
 */
export const downloadTemplate = (type = 'testcase') => {
  const template = generateCSVTemplate(type);
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${type}_template.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
