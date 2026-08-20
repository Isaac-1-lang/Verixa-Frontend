# Verixa - UAT Test Manager

<div align="center">
  <img src="public/logo.png" alt="Verixa Logo" width="120" height="120" />
  <h3>The Standard for Quality Excellence</h3>
  <p>Comprehensive UAT management platform for test case execution, defect tracking, and quality sign-off</p>
</div>

---

## 🎯 Overview

**Verixa** is a modern, full-featured User Acceptance Testing (UAT) management platform designed for QA teams and software organizations. It provides a unified solution for managing test cases, requirements, test runs, executions, and defect tracking with an intuitive interface and powerful features.

## Key Features

###  Authentication & User Management
- **Secure Authentication System**
  - User login with JWT tokens
  - Password reset functionality
  - OTP verification (email-based)
  - User profile management
  - Session management with automatic logout

###  Dashboard & Analytics
- **Comprehensive Dashboard**
  - Real-time analytics and metrics
  - Project statistics overview
  - Pass/fail rate tracking
  - Active runs monitoring
  - Quick action shortcuts
  - Recent activity timeline

### 📁 Project Management
- **Project Organization**
  - Create and manage multiple projects
  - Project status tracking (Ongoing, Completed)
  - Project categorization by field
  - Cover image upload
  - Team collaboration
  - Project-level statistics

### 📝 Requirements Management
- **Requirements Tracking**
  - Create, read, update, delete requirements
  - Requirement types (Functional, Non-Functional, Business, Technical)
  - Priority levels (Low, Medium, High)
  - Status tracking (Draft, Approved, Rejected)
  - Link requirements to test cases
  - Requirement traceability

###  Test Case Management
- **Comprehensive Test Cases**
  - Detailed test case creation
  - Test steps and expected results
  - Priority and type classification
  - Test case categories
  - Attachment support
  - Version history tracking
  - Test case reusability

### 🏃 Test Run Management
- **Test Execution Planning**
  - Create test runs
  - Assign test cases to runs
  - Test run scheduling
  - Run status tracking
  - Execution progress monitoring
  - Sign-off workflow

###  Test Execution
- **Execution Tracking**
  - Execute individual test cases
  - Record test results (Pass, Fail, Blocked, Skip)
  - Actual result documentation
  - Execution notes and comments
  - Evidence attachment
  - Execution history

### 🐛 Defect Management
- **Bug Tracking System**
  - Log defects with severity levels
  - Defect status tracking (Open, In Progress, Resolved, Closed)
  - Link defects to test executions
  - Attachment support (screenshots, logs)
  - Defect assignment
  - Resolution tracking

###  Bulk Import Functionality
- **File Upload & Import**
  - Import test cases from CSV, Excel, TXT files
  - Import requirements from structured files
  - Drag & drop file upload
  - File validation (type, size, format)
  - Data preview before import
  - Field validation with error reporting
  - Template download for easy import
  - Recent imports tracking
  - Support for UTF-8 and special characters
  - Maximum file size: 10MB (configurable)

### 📋 Data Management
- **Advanced Data Tables**
  - Searchable data tables
  - Sorting and filtering
  - Pagination
  - Export capabilities
  - Bulk operations
  - Column customization

###  User Interface
- **Modern & Responsive Design**
  - Clean, professional interface
  - Mobile-responsive layouts
  - Dark mode support (coming soon)
  - Accessibility compliant (WCAG)
  - Cross-browser compatible
  - Smooth animations and transitions
  - Toast notifications for feedback

### Search & Filter
- **Advanced Search**
  - Global search functionality
  - Filter by project, status, priority
  - Quick filters
  - Saved searches

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Lucide icons
- **State Management:** Redux Toolkit with RTK Query
- **Form Handling:** React Hook Form
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast
- **File Handling:** FileReader API, Base64 encoding

### Fonts & Typography
- **Primary:** Afacad (Google Fonts)
- **Monospace:** JetBrains Mono
- **Extended character support** (Latin, Latin Extended)
- **Font display:** Swap for optimal performance

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/verixa.git
cd verixa
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Verixa
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE_MB=10
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
verixa/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   ├── signup/             # Registration page
│   │   ├── forgot-password/    # Password reset
│   │   └── profile-setup/      # User profile setup
│   ├── dashboard/              # Main dashboard
│   │   ├── projects/           # Project management
│   │   ├── test-cases/         # Test case management
│   │   ├── requirements/       # Requirements management
│   │   ├── runs/               # Test runs
│   │   ├── executions/         # Test executions
│   │   ├── defects/            # Defect tracking
│   │   └── profile/            # User profile
│   ├── components/             # Reusable components
│   │   ├── auth/               # Auth components
│   │   ├── common/             # Common UI components
│   │   │   ├── DataTable.jsx   # Data table component
│   │   │   ├── FileUpload.jsx  # File upload component
│   │   │   ├── ImportModal.jsx # Import modal
│   │   │   ├── FormInput.jsx   # Form input
│   │   │   └── FormSelect.jsx  # Form select
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components
│   │   │   ├── Sidebar.jsx     # Sidebar navigation
│   │   │   └── TopBar.jsx      # Top navigation bar
│   │   └── examples/           # Example components
│   ├── context/                # React context providers
│   ├── redux/                  # Redux store & slices
│   │   └── api/                # RTK Query API slices
│   ├── utils/                  # Utility functions
│   │   └── fileParser.js       # File parsing utilities
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── docs/                       # Documentation
│   ├── FILE_UPLOAD_GUIDE.md    # File upload documentation
│   └── BACKEND_INTEGRATION.md  # Backend integration guide
├── public/                     # Static assets
│   ├── logo.png                # App logo
│   ├── image.png               # Landing page images
│   └── manifest.json           # PWA manifest
└── README.md                   # This file
```

## 🔧 Configuration

### Tailwind CSS Configuration

The application uses a custom Tailwind configuration with:
- Custom color palette (Navy blue primary)
- Custom fonts (Afacad, JetBrains Mono)
- Extended theme with design tokens
- Responsive breakpoints
- Custom animations

### Font Configuration

```javascript
// Fonts are configured in app/layout.tsx
- Afacad: Primary font with Latin & Latin Extended support
- JetBrains Mono: Monospace font for code
- Font display: swap (for better performance)
- Fallback fonts: system-ui, -apple-system, Segoe UI, etc.
```

### Character Encoding

- UTF-8 encoding throughout
- Support for special characters and emojis
- Extended Latin character support
- RTL language support ready
- Unicode character range support

## Using Bulk Import

### Import Test Cases

1. Navigate to Dashboard
2. Click "Import Test Cases" in the Bulk Import section
3. Download the CSV template (optional)
4. Prepare your CSV file with columns:
   - title (required)
   - description (required)
   - priority (optional: Low, Medium, High)
   - type (optional: Functional, Non-Functional)
   - expectedResult (optional)
5. Upload your file (drag & drop or click to browse)
6. Preview and validate the data
7. Click "Import" to complete

### Import Requirements

1. Navigate to Dashboard
2. Click "Import Requirements" in the Bulk Import section
3. Download the CSV template (optional)
4. Prepare your CSV file with columns:
   - title (required)
   - description (required)
   - type (required: Functional, Non-Functional, Business, Technical)
   - priority (optional: Low, Medium, High)
   - status (optional: Draft, Approved, Rejected)
5. Upload your file
6. Preview and validate
7. Click "Import"

### Supported File Formats

- **CSV** (.csv) - Comma-separated values
- **Excel** (.xlsx, .xls) - Requires xlsx library
- **Text** (.txt) - Tab or pipe-separated values
- **PDF** (.pdf) - Requires pdf-parse library

For detailed documentation, see [docs/FILE_UPLOAD_GUIDE.md](docs/FILE_UPLOAD_GUIDE.md)

## Backend Integration

The frontend is ready for backend integration with clearly marked integration points.

### API Endpoints Required

```
# Authentication
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/forgot-password
POST   /api/auth/verify-otp
POST   /api/auth/reset-password

# Dashboard
GET    /api/dashboard/analytics

# Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

# Test Cases
GET    /api/test-cases
POST   /api/test-cases
GET    /api/test-cases/:id
PUT    /api/test-cases/:id
DELETE /api/test-cases/:id
POST   /api/test-cases/bulk-import

# Requirements
GET    /api/requirements
POST   /api/requirements
GET    /api/requirements/:id
PUT    /api/requirements/:id
DELETE /api/requirements/:id
POST   /api/requirements/bulk-import

# Test Runs
GET    /api/runs
POST   /api/runs
GET    /api/runs/:id
PUT    /api/runs/:id
DELETE /api/runs/:id

# Executions
GET    /api/executions
POST   /api/executions
GET    /api/executions/:id
PUT    /api/executions/:id
DELETE /api/executions/:id

# Defects
GET    /api/defects
POST   /api/defects
GET    /api/defects/:id
PUT    /api/defects/:id
DELETE /api/defects/:id

# Imports
GET    /api/imports/recent
```

For detailed backend integration instructions, see [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)

## Customization

### Colors

The application uses a custom color palette defined in `globals.css`:

```css
:root {
  --primary: #1A264A;        /* Navy blue */
  --bg: #FFFFFF;             /* White background */
  --text: #1A264A;           /* Navy text */
  --emerald: #10b981;        /* Success green */
  --red: #ef4444;            /* Error red */
  --amber: #f59e0b;          /* Warning amber */
}
```

### Typography

Font sizes are responsive and increase on larger screens:
- Mobile: Base sizes
- Tablet: 1.1x scaling
- Desktop: 1.2x scaling

##  Testing

```bash
# Run tests (when configured)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Performance Optimization

- **Code Splitting:** Automatic code splitting by Next.js
- **Image Optimization:** Next.js Image component
- **Font Optimization:** Font subsetting and preloading
- **Lazy Loading:** Components loaded on demand
- **Memoization:** React.memo and useMemo for expensive operations
- **API Caching:** RTK Query caching strategies

##  Security Features

- **Authentication:** JWT token-based authentication
- **Authorization:** Role-based access control (RBAC) ready
- **Input Validation:** Client-side and server-side validation
- **File Upload Security:**
  - File type whitelist
  - File size limits (10MB default)
  - Content validation
  - XSS prevention
- **CSRF Protection:** Token-based protection
- **Secure Headers:** Content Security Policy ready

##  Known Issues & Limitations

- Excel file parsing requires `xlsx` library installation
- PDF parsing requires `pdf-parse` library installation
- Import functionality currently uses dummy data (backend integration pending)
- Dark mode feature is planned but not yet implemented
- Real-time collaboration features are planned for future releases

##  To-Do List

- [ ] Add Excel parsing (install xlsx library)
- [ ] Add PDF text extraction (install pdf-parse library)
- [ ] Implement dark mode
- [ ] Add real-time notifications
- [ ] Implement advanced reporting
- [ ] Add data export functionality
- [ ] Implement team collaboration features
- [ ] Add email notifications
- [ ] Implement audit logging
- [ ] Add two-factor authentication (2FA)

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

- **Development Team:** [Your Team Name]
- **Project Lead:** [Your Name]
- **Contact:** [your.email@domain.com]

##  Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- All open-source contributors

## Support

For support, please:
1. Check the documentation in the `docs/` folder
2. Search existing issues on GitHub
3. Open a new issue with detailed information
4. Contact the development team



---

