# PDF Export Feature Documentation

## Overview

The PDF export feature allows users to generate professional PDF reports containing project information, requirements, test cases, executions, and defects. Reports can be customized and downloaded directly from the dashboard.

## Installation

### Required Dependencies

Install the necessary PDF generation libraries:

```bash
npm install jspdf jspdf-autotable
# or
yarn add jspdf jspdf-autotable
# or
pnpm add jspdf jspdf-autotable
```

## Features

### Available Report Types

1. **Comprehensive Report**
   - Complete project overview
   - All requirements, test cases, executions, and defects
   - Executive summary with key metrics
   - Recommendations section

2. **Project Summary**
   - Project information
   - Project description
   - Project statistics
   - Status overview

3. **Requirements Report**
   - All requirements with details
   - Requirements categorized by type
   - Priority levels
   - Status tracking

4. **Test Cases Report**
   - Complete test case list
   - Detailed test case information
   - Test steps and expected results
   - Priority and type classification

5. **Execution Report**
   - Test execution results
   - Pass/fail statistics
   - Execution timeline
   - Executed by information

## Usage

### In Dashboard

The export button is located in the top-right corner of the dashboard:

```javascript
import ExportButton from '@/app/components/common/ExportButton';

<ExportButton 
  data={exportData}
  projectName="Your Project Name"
  variant="default" // 'default' | 'icon' | 'text'
  disabled={false}
/>
```

### Component Props

```typescript
interface ExportButtonProps {
  data: {
    project?: ProjectData;
    requirements?: RequirementData[];
    testCases?: TestCaseData[];
    executions?: ExecutionData[];
    defects?: DefectData[];
    statistics?: StatisticsData;
  };
  projectName?: string;
  variant?: 'default' | 'icon' | 'text';
  disabled?: boolean;
}
```

### Data Structure

#### Project Data
```javascript
{
  title: string;
  projectStatus: string;
  field: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  statistics: {
    totalRequirements: number;
    totalTestCases: number;
    totalRuns: number;
    totalExecutions: number;
    openDefects: number;
    passRate: number;
  };
}
```

#### Requirements Data
```javascript
[
  {
    id: string | number;
    title: string;
    type: 'Functional' | 'Non-Functional' | 'Business' | 'Technical';
    priority: 'Low' | 'Medium' | 'High';
    status: 'Draft' | 'Approved' | 'Rejected';
    description: string;
  }
]
```

#### Test Cases Data
```javascript
[
  {
    id: string | number;
    title: string;
    priority: 'Low' | 'Medium' | 'High';
    type: 'Functional' | 'Non-Functional';
    description: string;
    preconditions?: string;
    steps?: string;
    expectedResult: string;
    status?: string;
  }
]
```

#### Executions Data
```javascript
[
  {
    id: string | number;
    testCaseTitle: string;
    result: 'Pass' | 'Fail' | 'Blocked' | 'Skip';
    executedBy: string;
    executedAt: Date;
  }
]
```

#### Defects Data
```javascript
[
  {
    id: string | number;
    title: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  }
]
```

## Customization

### PDF Styling

The PDF generator uses consistent branding with Verixa colors:

- **Primary Color:** Navy Blue (#1A264A)
- **Text Color:** Dark Gray (#3C3C3C)
- **Accent Color:** White (#FFFFFF)

### Modifying Styles

Edit `app/utils/pdfGenerator.js` to customize:

```javascript
// Change header color
doc.setFillColor(26, 38, 74); // Navy

// Change font sizes
doc.setFontSize(24); // Title
doc.setFontSize(16); // Section headers
doc.setFontSize(10); // Body text

// Change table styles
headStyles: { 
  fillColor: [26, 38, 74], // Header background
  textColor: [255, 255, 255] // Header text
}
```

### Adding Logo

To add your company logo:

```javascript
// In addHeader function
doc.addImage(logoData, 'PNG', 15, 10, 30, 30);
```

Convert your logo to base64:
```javascript
const logoData = 'data:image/png;base64,YOUR_BASE64_STRING';
```

## API Integration

### Fetching Data for Export

Replace dummy data with actual API calls:

```javascript
// In your dashboard page
useEffect(() => {
  const fetchExportData = async () => {
    try {
      const [project, requirements, testCases, executions, defects] = 
        await Promise.all([
          fetch('/api/projects/current').then(r => r.json()),
          fetch('/api/requirements').then(r => r.json()),
          fetch('/api/test-cases').then(r => r.json()),
          fetch('/api/executions').then(r => r.json()),
          fetch('/api/defects').then(r => r.json()),
        ]);

      setExportData({
        project,
        requirements,
        testCases,
        executions,
        defects,
        statistics: project.statistics
      });
    } catch (error) {
      console.error('Failed to fetch export data:', error);
    }
  };

  fetchExportData();
}, []);
```

### Project-Specific Exports

For project detail pages:

```javascript
// In project detail page
const projectId = params.id;

const exportData = {
  project: projectData,
  requirements: projectRequirements,
  testCases: projectTestCases,
  executions: projectExecutions,
  defects: projectDefects,
};

<ExportButton 
  data={exportData}
  projectName={projectData.title}
/>
```

## Examples

### Basic Export Button

```javascript
import ExportButton from '@/app/components/common/ExportButton';

export default function MyPage() {
  const data = {
    project: { /* project data */ },
    testCases: [ /* test cases */ ],
    requirements: [ /* requirements */ ]
  };

  return (
    <ExportButton 
      data={data}
      projectName="My Project"
    />
  );
}
```

### Icon-Only Button

```javascript
<ExportButton 
  data={exportData}
  variant="icon"
  projectName="My Project"
/>
```

### Text Button

```javascript
<ExportButton 
  data={exportData}
  variant="text"
  projectName="My Project"
/>
```

### With Custom Handling

```javascript
const handleExportComplete = () => {
  toast.success('Report downloaded successfully!');
  // Track analytics
  logEvent('pdf_exported', { reportType: 'comprehensive' });
};

<ExportButton 
  data={exportData}
  onComplete={handleExportComplete}
/>
```

## PDF Structure

### Comprehensive Report Structure

1. **Cover Page**
   - Title
   - Project name
   - Generation date

2. **Table of Contents**
   - Section links

3. **Executive Summary**
   - Key metrics
   - Overview

4. **Project Information**
   - Details
   - Description
   - Metadata

5. **Requirements Overview**
   - Summary table
   - Details

6. **Test Cases Overview**
   - Summary table
   - Detailed specifications

7. **Test Execution Summary**
   - Pass/fail statistics
   - Execution timeline

8. **Defects Summary**
   - Open defects
   - Severity breakdown

9. **Recommendations**
   - Action items
   - Improvement suggestions

## Performance Optimization

### Large Data Sets

For projects with many test cases or requirements:

```javascript
// Limit data in preview
const limitedTestCases = testCases.slice(0, 100);

// Add note in PDF
doc.text(
  `Showing first 100 of ${testCases.length} test cases`,
  15,
  yPosition
);
```

### Async Generation

For very large reports:

```javascript
const generateLargeReport = async () => {
  toast.info('Generating report... This may take a moment.');
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  generateComprehensiveReportPDF(data);
  
  toast.success('Report generated!');
};
```

## Troubleshooting

### Common Issues

**Issue:** "Cannot find module 'jspdf'"
**Solution:** Install dependencies: `npm install jspdf jspdf-autotable`

**Issue:** PDF not downloading
**Solution:** Check browser popup blocker settings

**Issue:** Large PDFs causing browser slowdown
**Solution:** Limit data size or generate in chunks

**Issue:** Fonts not rendering correctly
**Solution:** jsPDF uses standard fonts. Custom fonts require additional setup.

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer (not supported)

## Security Considerations

### Data Privacy

- PDFs are generated client-side (no server upload)
- Data never leaves the user's browser
- PDFs are downloaded directly to user's device

### Sensitive Information

Be cautious when exporting:
- User credentials
- API keys
- Sensitive business data

Consider adding:
- Watermarks for confidential reports
- Export permissions/restrictions
- Audit logging for exports

## Advanced Features

### Adding Watermarks

```javascript
// In pdfGenerator.js
const addWatermark = (doc) => {
  const totalPages = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(40);
    doc.text('CONFIDENTIAL', 105, 150, {
      align: 'center',
      angle: 45
    });
  }
};
```

### Custom Branding

```javascript
// Company colors
const brandColors = {
  primary: [26, 38, 74],
  secondary: [16, 185, 129],
  accent: [239, 68, 68]
};

// Use throughout PDF
headStyles: { fillColor: brandColors.primary }
```

### Multi-language Support

```javascript
const translations = {
  en: { title: 'Project Report', date: 'Generated' },
  es: { title: 'Informe del Proyecto', date: 'Generado' },
  fr: { title: 'Rapport de Projet', date: 'Généré' }
};

const t = translations[currentLanguage];
doc.text(t.title, 50, 25);
```

## Best Practices

1. **Data Validation**
   - Validate data before PDF generation
   - Handle null/undefined values
   - Provide fallback values

2. **User Feedback**
   - Show loading indicator during generation
   - Display success/error messages
   - Provide download progress for large files

3. **File Naming**
   - Use descriptive names: `ProjectName_Report_2024-01-15.pdf`
   - Include timestamp to avoid overwrites
   - Sanitize special characters

4. **Testing**
   - Test with various data sizes
   - Verify PDF renders correctly
   - Check cross-browser compatibility

## Future Enhancements

- [ ] Email PDF reports
- [ ] Schedule automatic report generation
- [ ] Custom report templates
- [ ] Interactive PDF forms
- [ ] Digital signatures
- [ ] Report comparison (diff)
- [ ] Export to Word/Excel formats
- [ ] Cloud storage integration

## Support

For issues or questions:
- Check this documentation
- Review example code
- Contact development team

## Version History

- **v1.0.0**: Initial implementation
  - Basic PDF generation
  - 5 report types
  - Export button component
  - Dummy data support
