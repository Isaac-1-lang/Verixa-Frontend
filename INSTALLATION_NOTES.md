# Installation Notes for PDF Export Feature

## Quick Setup

To enable PDF export functionality, install the required dependencies:

```bash
npm install jspdf jspdf-autotable
```

## What Gets Installed

- **jspdf** (v2.5.1+): Core PDF generation library
- **jspdf-autotable** (v3.8.0+): Table generation plugin for jsPDF

## Verification

After installation, verify the packages are installed:

```bash
npm list jspdf jspdf-autotable
```

Expected output:
```
├── jspdf@2.5.1
└── jspdf-autotable@3.8.0
```

## Usage

Once installed, the PDF export feature will work automatically. The export button on the dashboard will be fully functional.

### Features Available After Installation

✅ Project Summary PDF Export
✅ Requirements Report PDF Export
✅ Test Cases Report PDF Export  
✅ Execution Report PDF Export
✅ Comprehensive Report PDF Export

## Testing

Test the feature by:

1. Navigate to the dashboard
2. Click "Export PDF" button in the top-right
3. Select a report type
4. PDF should download automatically

## Troubleshooting

If you encounter issues:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. Check browser console for errors

4. Ensure your browser allows downloads

## Alternative Installation Methods

### Using Yarn
```bash
yarn add jspdf jspdf-autotable
```

### Using PNPM
```bash
pnpm add jspdf jspdf-autotable
```

### Using Bun
```bash
bun add jspdf jspdf-autotable
```

## Next Steps

After installation:

1. Review the PDF Export Guide: `docs/PDF_EXPORT_GUIDE.md`
2. Customize PDF styling if needed
3. Integrate with your backend API
4. Test with real project data

## Notes

- PDF generation happens client-side (in the browser)
- No server configuration needed
- Works offline after initial load
- No external API calls for PDF generation
- Data privacy: PDFs never leave the user's browser

For detailed documentation, see:
- `docs/PDF_EXPORT_GUIDE.md` - Complete feature guide
- `app/utils/pdfGenerator.js` - PDF generation utilities
- `app/components/common/ExportButton.jsx` - Export button component
