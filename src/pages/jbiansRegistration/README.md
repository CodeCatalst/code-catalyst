# Dance Society Registration System

This folder contains the registration system for JBIANS Dance Society.

## Components

### 1. DanceSocietyRegistration.jsx
Student registration form with the following fields:
- **Name**: Full name of the student
- **WhatsApp Number**: 10-digit mobile number (without country code)
- **ERP**: Student ERP number
- **QR Code**: Payment confirmation screenshot upload (max 5MB)

**Features:**
- Client-side validation
- Image preview before submission
- Form reset after successful submission
- Toast notifications for user feedback
- Mobile-responsive design

**Route:** `/dance-society/register`

### 2. DanceSocietyAdmin.jsx
Admin panel for managing registrations (restricted to JBIANS DANCE ADMIN role)

**Features:**
- View all registrations in a table format
- Search by name, ERP, or phone number
- View detailed information including QR code images
- Download registrations as Excel/CSV file
- Delete registrations
- Refresh data
- WhatsApp direct links to contact students
- Access control (only JBIANS DANCE ADMIN role)

**Route:** `/dance-society/admin` (Protected)

## Role Required

### Admin Access
To access the admin panel, users must have the role:
- **Role Name:** `JBIANS DANCE ADMIN`
- **Permissions:** View and manage only Dance Society registrations

## API Endpoints Required

The frontend expects these backend endpoints:

### 1. Submit Registration
```
POST /api/jbians/dance-registration
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- name (string)
- whatsappNo (string)
- erp (string)
- qrCode (file)
- society (string - "Dance Society")
- submittedAt (ISO date string)
```

### 2. Get All Registrations
```
GET /api/jbians/dance-registration
Authorization: Bearer <token>

Response:
[
  {
    _id: string,
    name: string,
    whatsappNo: string,
    erp: string,
    qrCodeUrl: string,
    submittedAt: string (ISO date),
    society: string
  }
]
```

### 3. Delete Registration
```
DELETE /api/jbians/dance-registration/:id
Authorization: Bearer <token>
```

## Setup Instructions

### 1. Backend Setup
1. Create the API endpoints listed above
2. Implement file upload handling (multer/cloudinary)
3. Add role-based access control for JBIANS DANCE ADMIN
4. Store registration data in MongoDB
5. Implement authorization middleware

### 2. Frontend Integration
Routes are already added to `App.jsx`:
- Public: `/dance-society/register`
- Protected: `/dance-society/admin`

### 3. Role Assignment
To assign the admin role to users:
1. Go to Admin Dashboard → Role Management
2. Add role: `JBIANS DANCE ADMIN`
3. Assign this role to authorized users

## Excel Download

The Excel download feature generates a CSV file with columns:
- Name
- WhatsApp No.
- ERP
- Submitted At

File naming format: `dance_society_registrations_YYYY-MM-DD.csv`

## Security Features

1. **Authentication Required:** Both registration and admin pages require login
2. **Role-Based Access:** Admin panel only accessible to JBIANS DANCE ADMIN role
3. **File Validation:** 
   - Maximum file size: 5MB
   - Only image files accepted
   - Client-side validation before upload
4. **Authorization Headers:** All API calls include JWT token

## Mobile Responsiveness

Both components are fully responsive:
- Mobile-first design approach
- Touch-friendly buttons and inputs
- Responsive tables with horizontal scroll on mobile
- Optimized form layout for small screens

## Error Handling

- Toast notifications for all actions
- Form validation with helpful error messages
- Loading states during API calls
- Graceful error recovery
- Access denied screen for unauthorized users

## Future Enhancements

Potential improvements:
- Email notifications on registration
- Bulk upload from Excel
- Registration status tracking
- Payment verification workflow
- Analytics dashboard
- Export to multiple formats (PDF, Excel)
- Filter by date range
- Registration approval system
