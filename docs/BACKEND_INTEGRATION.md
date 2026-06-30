# Backend Integration Guide for Bulk Import

## Overview

This guide explains how to integrate the bulk import functionality with your backend API. The frontend is already set up with dummy data and ready for easy backend integration.

## Current Implementation

### Frontend Setup (Dashboard)

Located in: `app/dashboard/page.jsx`

```javascript
// Current dummy implementation
const handleBulkImport = async (data) => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`Importing ${importType}:`, data);
  
  // Adds to recent imports (local state)
  const newImport = {
    id: Date.now(),
    type: importType === 'testcase' ? 'Test Cases' : 'Requirements',
    count: data.length,
    date: new Date().toISOString().split('T')[0],
    status: 'success'
  };
  
  setRecentImports(prev => [newImport, ...prev.slice(0, 4)]);
  
  return data;
};
```

## Backend Integration Steps

### Step 1: Create API Endpoints

You need to create these endpoints in your backend:

#### 1. Bulk Import Test Cases
```
POST /api/test-cases/bulk-import
```

**Request Body:**
```json
{
  "projectId": "string (optional)",
  "testCases": [
    {
      "title": "string (required)",
      "description": "string (required)",
      "priority": "string (optional: Low, Medium, High)",
      "type": "string (optional: Functional, Non-Functional)",
      "expectedResult": "string (optional)",
      "steps": "string (optional)"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully imported 45 test cases",
  "imported": 45,
  "failed": 0,
  "errors": []
}
```

#### 2. Bulk Import Requirements
```
POST /api/requirements/bulk-import
```

**Request Body:**
```json
{
  "projectId": "string (optional)",
  "requirements": [
    {
      "title": "string (required)",
      "description": "string (required)",
      "type": "string (required: Functional, Non-Functional, Business, Technical)",
      "priority": "string (optional: Low, Medium, High)",
      "status": "string (optional: Draft, Approved, Rejected)"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully imported 23 requirements",
  "imported": 23,
  "failed": 0,
  "errors": []
}
```

#### 3. Get Recent Imports (Optional)
```
GET /api/imports/recent?limit=5
```

**Response:**
```json
{
  "imports": [
    {
      "id": "string",
      "type": "testcase | requirement",
      "count": 45,
      "date": "2024-01-15T10:30:00Z",
      "status": "success | failed",
      "userId": "string",
      "projectId": "string"
    }
  ]
}
```

### Step 2: Update Frontend Code

Replace the dummy implementation with actual API calls:

#### Update `app/dashboard/page.jsx`:

```javascript
// Import your API service or fetch utility
import { bulkImportTestCases, bulkImportRequirements } from '@/app/services/importService';

// Replace the handleBulkImport function
const handleBulkImport = async (data) => {
  try {
    let response;
    
    // Get current project ID from context if needed
    const projectId = selectedProject?.id || null;
    
    if (importType === 'testcase') {
      // Format data for test cases
      const formattedData = data.map(row => ({
        title: row.title,
        description: row.description,
        priority: row.priority || 'Medium',
        type: row.type || 'Functional',
        expectedResult: row.expectedResult || '',
        steps: row.steps || ''
      }));
      
      // Call API
      response = await bulkImportTestCases({
        projectId,
        testCases: formattedData
      });
      
    } else if (importType === 'requirement') {
      // Format data for requirements
      const formattedData = data.map(row => ({
        title: row.title,
        description: row.description,
        type: row.type,
        priority: row.priority || 'Medium',
        status: row.status || 'Draft'
      }));
      
      // Call API
      response = await bulkImportRequirements({
        projectId,
        requirements: formattedData
      });
    }
    
    if (!response.success) {
      throw new Error(response.message || 'Import failed');
    }
    
    // Update recent imports from API
    await fetchRecentImports();
    
    return response;
    
  } catch (error) {
    console.error('Import error:', error);
    throw error; // Modal will handle error display
  }
};

// Add function to fetch recent imports from API
const fetchRecentImports = async () => {
  try {
    const response = await fetch('/api/imports/recent?limit=5', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setRecentImports(data.imports.map(imp => ({
        id: imp.id,
        type: imp.type === 'testcase' ? 'Test Cases' : 'Requirements',
        count: imp.count,
        date: new Date(imp.date).toISOString().split('T')[0],
        status: imp.status
      })));
    }
  } catch (error) {
    console.error('Failed to fetch recent imports:', error);
  }
};

// Call on component mount
useEffect(() => {
  fetchRecentImports();
}, []);
```

### Step 3: Create API Service File

Create: `app/services/importService.js`

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * Bulk import test cases
 */
export const bulkImportTestCases = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-cases/bulk-import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to import test cases');
    }

    return await response.json();
  } catch (error) {
    console.error('Bulk import test cases error:', error);
    throw error;
  }
};

/**
 * Bulk import requirements
 */
export const bulkImportRequirements = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requirements/bulk-import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to import requirements');
    }

    return await response.json();
  } catch (error) {
    console.error('Bulk import requirements error:', error);
    throw error;
  }
};

/**
 * Get recent imports
 */
export const getRecentImports = async (limit = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/imports/recent?limit=${limit}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent imports');
    }

    return await response.json();
  } catch (error) {
    console.error('Get recent imports error:', error);
    return { imports: [] };
  }
};
```

### Step 4: Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
# or your production URL
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Backend Implementation Examples

### Node.js/Express Example

```javascript
// routes/testCases.js
router.post('/bulk-import', authenticate, async (req, res) => {
  try {
    const { projectId, testCases } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Test cases array is required'
      });
    }
    
    // Validate each test case
    const errors = [];
    testCases.forEach((tc, index) => {
      if (!tc.title || !tc.description) {
        errors.push(`Row ${index + 1}: Missing required fields`);
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Bulk insert (using transaction for safety)
    const transaction = await db.sequelize.transaction();
    
    try {
      const imported = await TestCase.bulkCreate(
        testCases.map(tc => ({
          ...tc,
          projectId,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        { transaction, validate: true }
      );
      
      // Log import activity
      await ImportLog.create({
        userId,
        type: 'testcase',
        count: imported.length,
        projectId,
        status: 'success'
      }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: `Successfully imported ${imported.length} test cases`,
        imported: imported.length,
        failed: 0,
        errors: []
      });
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import test cases',
      error: error.message
    });
  }
});
```

### Spring Boot/Java Example

```java
@RestController
@RequestMapping("/api/test-cases")
public class TestCaseController {
    
    @Autowired
    private TestCaseService testCaseService;
    
    @PostMapping("/bulk-import")
    public ResponseEntity<BulkImportResponse> bulkImport(
            @RequestBody BulkImportRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // Validate input
            if (request.getTestCases() == null || request.getTestCases().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new BulkImportResponse(false, "Test cases array is required"));
            }
            
            // Perform bulk import
            BulkImportResult result = testCaseService.bulkImport(
                request.getProjectId(),
                request.getTestCases(),
                userDetails.getUsername()
            );
            
            return ResponseEntity.ok(new BulkImportResponse(
                true,
                String.format("Successfully imported %d test cases", result.getImported()),
                result.getImported(),
                result.getFailed(),
                result.getErrors()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new BulkImportResponse(false, "Failed to import test cases"));
        }
    }
}
```

### Python/Django Example

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_import_test_cases(request):
    try:
        project_id = request.data.get('projectId')
        test_cases_data = request.data.get('testCases', [])
        
        # Validate input
        if not test_cases_data:
            return Response({
                'success': False,
                'message': 'Test cases array is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate each test case
        errors = []
        for idx, tc in enumerate(test_cases_data):
            if not tc.get('title') or not tc.get('description'):
                errors.append(f'Row {idx + 1}: Missing required fields')
        
        if errors:
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Bulk create with transaction
        with transaction.atomic():
            test_cases = [
                TestCase(
                    title=tc.get('title'),
                    description=tc.get('description'),
                    priority=tc.get('priority', 'Medium'),
                    type=tc.get('type', 'Functional'),
                    expected_result=tc.get('expectedResult', ''),
                    project_id=project_id,
                    created_by=request.user
                )
                for tc in test_cases_data
            ]
            
            TestCase.objects.bulk_create(test_cases)
            
            # Log import
            ImportLog.objects.create(
                user=request.user,
                type='testcase',
                count=len(test_cases),
                project_id=project_id,
                status='success'
            )
        
        return Response({
            'success': True,
            'message': f'Successfully imported {len(test_cases)} test cases',
            'imported': len(test_cases),
            'failed': 0,
            'errors': []
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Failed to import test cases',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

## Testing Integration

### Test with Postman/Thunder Client

1. **Import Test Cases:**
```bash
POST http://localhost:8080/api/test-cases/bulk-import
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "projectId": "proj-123",
  "testCases": [
    {
      "title": "Login Test",
      "description": "Verify login functionality",
      "priority": "High",
      "type": "Functional"
    }
  ]
}
```

2. **Import Requirements:**
```bash
POST http://localhost:8080/api/requirements/bulk-import
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "projectId": "proj-123",
  "requirements": [
    {
      "title": "User Authentication",
      "description": "System shall authenticate users",
      "type": "Functional",
      "priority": "High"
    }
  ]
}
```

## Checklist for Integration

- [ ] Backend endpoints created
- [ ] Authentication/authorization implemented
- [ ] Input validation added
- [ ] Database models/tables ready
- [ ] Transaction support for bulk operations
- [ ] Error handling implemented
- [ ] Frontend service file created
- [ ] Environment variables configured
- [ ] API calls tested with Postman
- [ ] Frontend integrated and tested
- [ ] Import logging implemented
- [ ] Recent imports endpoint working

## Troubleshooting

**CORS Issues:**
```javascript
// Add to your backend
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

**401 Unauthorized:**
- Check if token is being sent in headers
- Verify token is valid and not expired
- Check backend authentication middleware

**Validation Errors:**
- Ensure CSV template matches expected format
- Check required fields are present
- Verify data types match backend expectations

## Next Steps

1. Implement the backend endpoints
2. Update the frontend service file
3. Test the integration thoroughly
4. Add error logging and monitoring
5. Implement retry logic for failed imports
6. Add progress tracking for large imports
7. Implement import history page

For questions or issues, refer to the FILE_UPLOAD_GUIDE.md documentation.
