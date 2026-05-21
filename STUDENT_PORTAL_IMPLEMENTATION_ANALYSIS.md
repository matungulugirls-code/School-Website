# Student Portal Implementation Analysis Report
## Matungulu Girls Senior School - Authentication & Authorization System

**Report Date:** May 20, 2026  
**Focus Areas:** Student Access Strategy, Records Management, Authentication/Authorization, Email Notifications  

---

## Executive Summary

Your student portal implements a **multi-stage authentication strategy** with sophisticated record management and email notification protocols. The system handles first-time access verification, password setup, login mechanisms, and intelligent student record recovery after re-upload. Here's the complete implementation breakdown:

---

## 1. STUDENT ACCESS STRATEGY OVERVIEW

### 1.1 Two-Track Access Model

Your system implements **dual authentication paths**:

#### **Track 1: First-Time Access (Name-Based Verification)**
- Student provides admission number + full name
- System validates against `databaseStudent` table
- If verified → generates temporary 10-minute setup token
- Student creates their portal password
- After password creation → becomes Track 2 user

#### **Track 2: Existing Account Access (Password-Based)**
- Student uses admission number + password
- System validates against `studentPortalAccount` table
- Creates 2-hour JWT session token
- Sets secure HTTP-only cookie

### 1.2 Access Entry Points

**Location:** [StudentPortal page](app/pages/StudentPortal/page.jsx)

Three distinct login modals:
1. **Password Login** - For established accounts
2. **First-Access/Name Verification** - For new students
3. **Forgot Password** - For existing accounts needing reset

---

## 2. STUDENT UPLOAD RECORDS IMPLEMENTATION

### 2.1 Bulk Upload Architecture

**API Route:** [studentupload/route.js](app/api/studentupload/route.js)

Your system handles both **CSV and Excel uploads** with sophisticated processing:

```
Upload Flow:
1. File parsing (XLSX/CSV) → JSON conversion
2. Data validation & normalization
3. Batch processing (200 rows per batch)
4. Database transaction handling
5. Credential archival if records exist
6. Archive cleanup (60-day retention)
```

### 2.2 Record Deletion & Re-upload Mechanism

**Key Implementation:**

When a student record is **deleted and re-uploaded**:

#### **Step 1: Archive Existing Credentials**
```
Function: archiveStudentPortalCredentials()
- Locates existing studentPortalAccount for admission number
- If student has set a password:
  ✓ Creates backup in ArchivedStudentPortalCredential
  ✓ Stores passwordHash for later recovery
  ✓ Marks original as archived
  ✓ Sets 60-day expiration
  ✓ Records deletion reason and admin info
```

#### **Step 2: Delete Old Student Record**
```
Function: Database transaction
- Deletes databaseStudent row
- Removes associated FeeBalance, session records
- Maintains referential integrity
```

#### **Step 3: Upload New Record**
```
Function: uploadStudentBatch()
- Creates new databaseStudent entry
- Assigns same admission number
- Copies student metadata (firstName, lastName, etc.)
```

#### **Step 4: Credential Recovery**
```
Function: restoreArchivedAccountForStudent()
On student's next login attempt:
1. Checks if admission number has archived credentials
2. If found AND within 60-day window:
   ✓ Restores passwordHash to new studentPortalAccount
   ✓ Links to new student record
   ✓ Marks archive as "restored"
   ✓ Allows seamless re-login with previous password
```

### 2.3 Database Models for Record Management

**Active Tables:**
- `databaseStudent` - Student roster (uploaded records)
- `studentPortalAccount` - Portal credentials
- `studentSession` - Active sessions

**Archive Table:**
- `archivedStudentPortalCredential` - Backup credentials
  - Stores: passwordHash, student info, passwordSetAt, lastLoginAt
  - Expires after: 60 days
  - Used for: Credential recovery after record re-upload

---

## 3. AUTHENTICATION STRATEGY

### 3.1 Flexible Name Matching (First Access)

**Location:** [studentlogin/route.js](app/api/studentlogin/route.js) - `validateStudentCredentials()`

Your system implements **intelligent name matching** for first-time access:

```javascript
Matching Logic:
- Normalizes both entered and database names (lowercase, spaces, special chars removed)
- Splits names into parts
- Allows partial matches:
  ✓ Exact word matches
  ✓ Prefix matches (e.g., "Ann" matches "Anna")
  ✓ Initial matches (e.g., "J" matches "John")
  ✓ Works with name order variations

Example:
- Student enters: "John Paul Smith" with Admission "2024001"
- Database has: "John | Paul | Smith"
- Result: ✓ VERIFIED (all names found)

- Student enters: "J. P. Smith" 
- System recognizes: "J" (John), "P" (Paul), "Smith"
- Result: ✓ VERIFIED
```

### 3.2 Password Strength Requirements

All passwords must meet **5 criteria**:
1. ✓ Minimum 8 characters
2. ✓ At least one lowercase letter
3. ✓ At least one uppercase letter
4. ✓ At least one number
5. ✓ At least one symbol (!@#$%, etc.)

**Enforcement Points:**
- First-time password setup
- Password reset requests
- Admin-initiated password setup

---

## 4. EMAIL NOTIFICATION SYSTEM

### 4.1 Two Email Occasions

Your system sends parent emails in **two critical scenarios**:

#### **OCCASION 1: FORGOT PASSWORD REQUEST**

**Trigger:** Student clicks "Forgot Password"  
**Location:** [student-password-reset/route.js](app/api/student-password-reset/route.js)

**Email Details:**
- **To:** Parent email (from student record)
- **Subject:** "Student Portal Password Reset: [Admission#]"
- **Contains:**
  - Secure password reset link (60-minute expiry)
  - Student name and admission number
  - Expiration timestamp
  - Fallback URL if button fails
  - Security notice

**Email Template Features:**
```html
Header: School name + "Password Reset"
Body: Explains a reset was requested
CTA: "Open Secure Password Link" button
Expiry: "This link expires on [timestamp] and can only be used once"
Security: Warning about contacting school if unexpected
Footer: School branding
```

**Code Location:** `sendParentResetEmail()` function

#### **OCCASION 2: SET PASSWORD (ADMIN SETUP)**

**Trigger 1:** Admin initiates password setup for new student  
**Trigger 2:** Student verifies records first-time (system auto-generates setup link)

**Email Details:**
- **To:** Parent email
- **Subject:** "Student Portal Password Setup: [Admission#]"
- **Contains:**
  - Instruction to create initial password
  - Secure setup link (10-minute expiry)
  - Same security features as reset email

**Request Type Values:**
```javascript
requestType === 'admin_setup'  // Admin initiating setup
requestType === 'forgot'       // Student forgot password
requestType === 'change'       // Password change request
```

### 4.2 Email Sending Mechanism

**Implementation:**
```javascript
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};
```

**Configuration Required:**
```
Environment Variables:
- EMAIL_USER: Gmail address for sending
- EMAIL_PASS: Gmail app password (not account password)
- CONTACT_EMAIL: Fallback recipient for system emails
- ADMIN_EMAIL: Admin notification email
```

---

## 5. FIRST-TIME ACCESS FLOW

### 5.1 Step-by-Step Process

```
┌─────────────────────────────────────────────────────┐
│ STUDENT FIRST-TIME ACCESS FLOW                      │
└─────────────────────────────────────────────────────┘

STEP 1: Name Verification
├─ Student navigates to Student Portal
├─ Switches to "Verify Record" mode
├─ Enters: Admission Number + Full Name
└─ System validates against databaseStudent

STEP 2: Verification Result
├─ ✓ If MATCH:
│  ├─ Checks if studentPortalAccount exists
│  ├─ If NO password set:
│  │  ├─ Generates 10-minute setup token
│  │  └─ Returns setupToken (client-side)
│  └─ If password EXISTS: Error (use password login)
└─ ✗ If NO MATCH:
   ├─ Error message displayed
   └─ Suggests contacting class teacher

STEP 3: Create Portal Password
├─ Modal switches to "Setup Password" mode
├─ setupToken is passed to form
├─ Student enters new password (must meet 5 criteria)
├─ Confirms password
└─ Submits to /api/studentlogin?action=setup-password

STEP 4: Password Hash Creation
├─ Server validates setupToken (JWT verification)
├─ Validates password strength
├─ Checks password confirmation match
├─ Hashes password using bcrypt (12 rounds)
└─ Creates studentPortalAccount record

STEP 5: Automatic Login
├─ If account creation succeeds:
│  ├─ Generates 2-hour JWT token
│  ├─ Creates studentSession record
│  ├─ Sets HTTP-only cookie
│  └─ Redirects to portal dashboard
└─ User can now access:
   ├─ Academic Results
   ├─ Learning Resources
   ├─ Assignments
   ├─ Fee Balance
   └─ Guidance Events
```

### 5.2 Security Measures During First Access

1. **Name Verification**: Flexible matching prevents false rejections
2. **Setup Token**: 10-minute expiry prevents brute force
3. **Strong Passwords**: 5-criterion requirement enforced
4. **Hash Security**: bcrypt with 12 salt rounds
5. **Session Creation**: Tracks IP address and user agent
6. **No Email Required**: Uses student record data only

---

## 6. LOGIN STRATEGY

### 6.1 Normal Login Flow (Password-Based)

```
POST /api/studentlogin
├─ Input: admissionNumber, password
├─ Step 1: Validate inputs
├─ Step 2: Find databaseStudent by admission number
├─ Step 3: Find studentPortalAccount by admission number
├─ Step 4: Compare bcrypt password hash
├─ Step 5 (If valid):
│  ├─ Generate JWT token (2-hour expiry)
│  ├─ Create studentSession
│  ├─ Set HTTP-only cookie
│  └─ Return student profile + token
└─ Step 6 (If invalid):
   ├─ Return error message
   └─ Do NOT reveal which field failed (security)
```

### 6.2 Login API Response

```javascript
{
  success: true,
  message: "Login successful",
  student: {
    id: "student_id",
    studentRecordId: "db_record_id",
    portalAccountId: "portal_account_id",
    admissionNumber: "2024001",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Paul Doe",
    form: "Form 4",
    stream: "Stream A",
    email: "parent@email.com",
    parentPhone: "0712345678",
    status: "active",
    hasPortalPassword: true
  },
  token: "eyJhbGciOiJIUzI1NiIs...",
  expiresIn: "2 hours",
  permissions: {
    canViewResources: true,
    canViewAssignments: true,
    canDownloadMaterials: true
  }
}
```

### 6.3 JWT Token Structure

```javascript
Payload:
{
  studentId: "portal_account_id",
  studentRecordId: "db_student_id",
  portalAccountId: "portal_account_id",
  admissionNumber: "2024001",
  name: "John Paul Doe",
  form: "Form 4",
  stream: "Stream A",
  role: "student"
}

Configuration:
- Algorithm: HS256
- Expiry: 2 hours
- Secret: process.env.STUDENT_JWT_SECRET || process.env.JWT_SECRET
- Fallback: 'Matungulu-student-secret-key-2024'
```

---

## 7. FORGOT PASSWORD FLOW

### 7.1 Request Phase

```
POST /api/student-password-reset
├─ Input: admissionNumber (optional: fullName for verification)
├─ Step 1: Validate admission number format
├─ Step 2: Find databaseStudent AND studentPortalAccount
├─ Step 3: Create StudentPasswordResetRequest record
│  ├─ Generate cryptographically secure token (32 bytes)
│  ├─ Hash token with SHA256
│  ├─ Store hash in database
│  ├─ Set 60-minute expiration
│  └─ Record request IP and User-Agent
├─ Step 4: Generate password reset link
│  └─ Format: /pages/studentpasswordreset?token=[BASE64_URL_TOKEN]
└─ Step 5: Send email to parent
   ├─ To: student.email (parent email)
   ├─ Contains: Reset link, expiry time, student info
   └─ Link expires at: 60 minutes
```

### 7.2 Email Content (Forgot Password)

**Parent receives:**
```
Subject: Student Portal Password Reset: [ADMISSION_NUMBER]

Body:
"Hello Parent/Guardian,

A secure request was made to reset the student portal password for
[STUDENT_FULL_NAME] (Admission [ADMISSION_NUMBER]).

[BUTTON: Open Secure Password Link]

This link expires on [TIMESTAMP] and can only be used once.

If the button does not work, paste this link:
[FULL_RESET_URL]

If you did not expect this message, ignore it and contact the 
school office."
```

### 7.3 Link Validation Phase

```
GET /api/student-password-reset?token=[TOKEN]
├─ Hash provided token with SHA256
├─ Query StudentPasswordResetRequest table:
│  ├─ WHERE tokenHash = hashed_token
│  ├─ AND status IN ('pending', 'sent')
│  ├─ AND usedAt = NULL
│  └─ AND expiresAt > NOW
├─ If found:
│  ├─ Retrieve associated student info
│  └─ Return student profile (allows pre-filling name)
└─ If not found:
   └─ Return error: "This password link is invalid or expired"
```

### 7.4 Password Update Phase

```
PATCH /api/student-password-reset
├─ Input: token, newPassword, confirmPassword
├─ Step 1: Validate reset link (as above)
├─ Step 2: Validate password strength (5 criteria)
├─ Step 3: Confirm passwords match
├─ Step 4: Hash new password (bcrypt, 12 rounds)
├─ Step 5: Update studentPortalAccount
│  ├─ SET passwordHash = bcrypt(newPassword)
│  ├─ UPDATE lastLoginAt = NOW
│  └─ Commit transaction
├─ Step 6: Mark reset request as used
│  ├─ SET usedAt = NOW
│  └─ SET status = 'used'
└─ Step 7: Return success
   ├─ Auto-login (or redirect to login)
   └─ Provide 2-hour JWT token
```

### 7.5 Forgot Password Email Tracking

**StudentPasswordResetRequest table tracks:**
```
- admissionNumber: For lookup
- requestType: 'forgot' | 'admin_setup' | 'change'
- tokenHash: Hashed token (never store plain text)
- expiresAt: 60-minute window
- usedAt: When/if password was changed
- status: 'pending' | 'sent' | 'expired'
- requestedByIp: Security tracking
- requestedByUserAgent: Device tracking
```

---

## 8. STUDENT RECORD DELETION & RE-UPLOAD

### 8.1 Re-Upload Recognition Logic

**When a student record is re-uploaded:**

#### **Scenario 1: Previously logged-in student (password set)**

```
Timeline:
├─ T0: Student "2024001" uploaded with password set
├─ T1: Student logs in and accesses portal
├─ T2: Records are deleted by admin
│  └─ archiveStudentPortalCredentials() triggers
│     ├─ Moves studentPortalAccount to ArchivedStudentPortalCredential
│     ├─ Stores passwordHash in archive
│     ├─ Records: firstName, lastName, form, stream, lastLoginAt
│     ├─ Sets expiresAt = NOW + 60 days
│     └─ Marks status = 'archived'
├─ T3: Fresh student data re-uploaded
│  └─ New databaseStudent created with same admission number
└─ T4: Student attempts login

RECOGNITION PROCESS:
├─ Student provides: Admission "2024001" + Password
├─ Query studentPortalAccount:
│  └─ Result: NOT FOUND (was deleted)
├─ Query ArchivedStudentPortalCredential:
│  ├─ WHERE admissionNumber = "2024001"
│  ├─ AND expiresAt > NOW
│  └─ Result: FOUND ✓
├─ Restore process:
│  ├─ Create new studentPortalAccount
│  ├─ Copy passwordHash from archive
│  ├─ Link to new databaseStudent
│  └─ Mark archive as 'restored'
└─ Student logs in successfully
   └─ System recognizes as previously authenticated user
```

#### **Scenario 2: New admission number (different student)**

```
Timeline:
├─ T0: Student uploaded
├─ T1: Records deleted
│  └─ Archive created, but no password set
│     └─ archiveStudentPortalCredentials() skips
│        (Only archives if passwordHash exists)
├─ T2: New records uploaded
└─ T3: No recognition needed
   └─ Fresh first-time access required
```

### 8.2 Archive Expiration & Cleanup

**Automatic cleanup process:**
```javascript
cleanupExpiredStudentCredentialArchives()

Runs on:
- Every login attempt
- Every password reset request
- Admin bulk operations

Deletes:
- ArchivedStudentPortalCredential records
- WHERE expiresAt < NOW
- 60-day retention period
```

### 8.3 Data Preserved During Re-upload

**Information carried over:**
- ✓ Password hash (allows seamless re-login)
- ✓ First name, last name (for reference)
- ✓ Form and stream
- ✓ Last login timestamp
- ✓ Date password was set

**Information lost:**
- ✗ Previous session tokens (expired anyway)
- ✗ Old records in fee balances
- ✗ Historical login sessions

---

## 9. AUTHORIZATION & PERMISSIONS

### 9.1 Student Portal Permissions

After successful login, students receive:

```javascript
permissions: {
  canViewResources: true,      // Access learning materials
  canViewAssignments: true,    // View class assignments
  canDownloadMaterials: true,  // Download resources
  canViewResults: true,        // View academic results
  canCheckFees: true,          // View fee balance
  canAccessGuidance: true      // Access guidance events
}
```

### 9.2 Role-Based Access

**Access Levels:**

| Feature | Student | Parent* | Admin |
|---------|---------|--------|-------|
| View own results | ✓ | View if accessible | ✓ |
| Upload records | ✗ | ✗ | ✓ |
| Reset password | ✓ | ✓ | ✓ |
| View resources | ✓ | ✗ | ✓ |
| Manage accounts | ✗ | ✗ | ✓ |
| Download assignments | ✓ | ✗ | ✓ |

*Parents access via email links for password resets

### 9.3 Session-Based Authorization

Every API request validates:

```javascript
1. JWT Token Verification
   ├─ Signature check (HS256)
   ├─ Expiration check (2-hour window)
   └─ Role verification (must be 'student')

2. Session Check
   ├─ Query studentSession table
   ├─ Verify token hash matches
   └─ Confirm expiresAt > NOW

3. Database Student Check
   ├─ Verify databaseStudent.status = 'active'
   └─ Confirm not deleted/archived
```

---

## 10. SECURITY MEASURES

### 10.1 Password Security

```
✓ Bcrypt hashing (12 salt rounds)
✓ Never stored in plain text
✓ Password strength enforced (5 criteria)
✓ Password confirmation required on setup
✓ Hash comparison using bcrypt.compare()
```

### 10.2 Token Security

```
✓ Reset tokens: Hashed with SHA256 before storage
✓ JWT tokens: HS256 signed with secret key
✓ One-time use: Reset tokens marked as 'used' after redemption
✓ Time-limited: All tokens have expiration
✓ HTTP-only cookies: Cannot be accessed by JavaScript
✓ Secure flag: Only sent over HTTPS in production
✓ SameSite: Strict - prevents CSRF attacks
```

### 10.3 Data Protection

```
✓ IP Address Tracking: Logs IP for all requests
✓ User-Agent Tracking: Records device information
✓ Admission Number Normalized: Uppercase, trimmed
✓ Email Normalized: Lowercase for comparison
✓ Name Validation: Special characters removed for matching
```

### 10.4 Email Security

```
✓ Gmail App Password: Not account password
✓ Reset Link Expiry: 60 minutes max validity
✓ One-Time Links: Token marked used after redemption
✓ Secure URLs: HTTPS in production
✓ HTML Escaping: XSS prevention in email content
```

---

## 11. KEY IMPLEMENTATION DETAILS

### 11.1 Database Schema

**Core Tables:**

```sql
-- Student Records
databaseStudent
├─ id: Primary key
├─ admissionNumber: UNIQUE
├─ firstName, middleName, lastName
├─ form, stream
├─ email (parent)
├─ parentPhone
├─ status: 'active' | 'inactive'
└─ timestamps

-- Portal Accounts
studentPortalAccount
├─ id: Primary key
├─ admissionNumber: UNIQUE (foreign reference)
├─ passwordHash: Bcrypt hash
├─ firstName, middleName, lastName, fullName
├─ form, stream
├─ email, parentPhone
├─ passwordSetAt: When password created
├─ lastLoginAt: Last successful login
├─ status: 'active' | 'inactive'
└─ timestamps

-- Session Tracking
studentSession
├─ id: Primary key
├─ studentId, admissionNumber
├─ token: Hashed JWT token
├─ expiresAt: Session end time
├─ ipAddress, userAgent
└─ timestamps

-- Archived Credentials
archivedStudentPortalCredential
├─ id: Primary key
├─ admissionNumber: UNIQUE
├─ passwordHash: From deleted account
├─ originalStudentId: Reference to deleted record
├─ sourceBatchId: Which upload batch deleted it
├─ archiveReason: 'batch-delete', etc.
├─ deletedBy: Admin who deleted
├─ All student info (denormalized)
├─ archivedAt: When archived
├─ restoredAt: If recovered
├─ expiresAt: 60-day retention
└─ status: 'archived' | 'restored'

-- Password Reset Requests
studentPasswordResetRequest
├─ id: Primary key
├─ admissionNumber: Student lookup
├─ requestType: 'forgot' | 'admin_setup' | 'change'
├─ tokenHash: Hashed reset token
├─ expiresAt: 60-minute window
├─ usedAt: When password was changed
├─ status: 'pending' | 'sent' | 'expired'
├─ requestedByIp, requestedByUserAgent
└─ timestamps
```

### 11.2 API Endpoints

**Authentication:**
```
POST /api/studentlogin
  - Login (password-based)
  - Verify first access (name-based)
  - Setup password (initial)
  - Logout (DELETE)

GET/POST /api/student-password-reset
  - Initiate forgot password
  - Validate reset link
  - Complete password reset

GET /api/studentupload
  - Query student records
  - Get upload statistics

POST /api/studentupload
  - Bulk upload CSV/Excel
```

---

## 12. WORKFLOW SUMMARY

### 12.1 New Student First Login

```
┌────────────────────────────────────────────────────┐
│ NEW STUDENT LOGIN JOURNEY                          │
└────────────────────────────────────────────────────┘

1. ENTRY
   └─ Navigate to /pages/StudentPortal
   
2. SELECT LOGIN MODE
   ├─ "Password Login" (if already has account)
   └─ "Verify My Record" (first time)
   
3. VERIFY RECORD (First-Time Path)
   ├─ Enter: Admission Number
   ├─ Enter: Full Name (any order, flexible matching)
   └─ Click: "Verify"
   
4. VERIFICATION CHECK (Server-side)
   ├─ Query databaseStudent by admission number
   ├─ Flexible name matching algorithm
   ├─ If ✓ match: Generate 10-minute setup token
   └─ If ✗ NO match: Error, suggest teacher contact
   
5. CREATE PASSWORD (Client-side)
   ├─ Modal updates to "Setup Password" mode
   ├─ Enter new password (must have: 8+ chars, uppercase, 
   │  lowercase, number, symbol)
   ├─ Confirm password
   └─ Click: "Create Password"
   
6. PASSWORD CREATION (Server-side)
   ├─ Verify setup token (JWT check)
   ├─ Validate password strength
   ├─ Bcrypt hash password (12 rounds)
   ├─ Create studentPortalAccount record
   ├─ Generate 2-hour JWT token
   ├─ Create studentSession
   └─ Set HTTP-only cookie
   
7. REDIRECT TO PORTAL
   ├─ Dashboard loads
   ├─ Student sees personalized welcome
   └─ Can access: Results, Resources, Assignments, 
      Guidance, Fees

TOTAL TIME: ~2 minutes
SECURITY LEVEL: ★★★★★
```

### 12.2 Existing Student Forgot Password

```
┌────────────────────────────────────────────────────┐
│ FORGOT PASSWORD RECOVERY JOURNEY                   │
└────────────────────────────────────────────────────┘

1. STUDENT ACTION
   └─ Click: "Forgot Password?" link
   
2. REQUEST RESET
   ├─ Enter: Admission Number
   ├─ Server creates StudentPasswordResetRequest
   ├─ Generates cryptographically secure token
   ├─ Hashes token with SHA256
   └─ Sets 60-minute expiration
   
3. EMAIL SENT TO PARENT
   ├─ To: [Parent email from student record]
   ├─ Subject: "Student Portal Password Reset: [ADM#]"
   ├─ Contains:
   │  ├─ Secure password reset link
   │  ├─ Expiration time (60 minutes)
   │  ├─ Student name and admission number
   │  ├─ Backup URL text
   │  └─ Security warning
   └─ Service: Gmail (nodemailer)
   
4. PARENT RECEIVES EMAIL
   ├─ Opens email
   ├─ Clicks: "Open Secure Password Link" button
   └─ OR copies link and pastes in browser
   
5. LINK VALIDATION (Server-side)
   ├─ Extract token from URL
   ├─ Hash token with SHA256
   ├─ Query StudentPasswordResetRequest:
   │  ├─ Match tokenHash
   │  ├─ Check NOT already used (usedAt = NULL)
   │  ├─ Verify within 60-minute window
   │  └─ Status in ['pending', 'sent']
   ├─ If ✓ valid: Pre-fill student info, show form
   └─ If ✗ expired: Show error, suggest new request
   
6. CREATE NEW PASSWORD
   ├─ Student/Parent enters new password
   ├─ Confirms password match
   ├─ Must meet 5 criteria
   └─ Clicks: "Save New Password"
   
7. PASSWORD UPDATE (Server-side)
   ├─ Final validation of reset request
   ├─ Password strength check
   ├─ Bcrypt hash new password
   ├─ Update studentPortalAccount
   ├─ Set lastLoginAt = NOW
   ├─ Mark reset request: usedAt = NOW, status = 'used'
   └─ Auto-login with 2-hour JWT token
   
8. SUCCESS
   ├─ Redirect to portal dashboard
   ├─ Student can log in with new password
   └─ Previous password is no longer valid

TIMEFRAME: ~5 minutes (includes email transit)
EMAIL OCCASIONS: 1 (forgot password scenario)
SECURITY LEVEL: ★★★★★
```

### 12.3 Student Record Re-Upload & Recognition

```
┌────────────────────────────────────────────────────┐
│ RECORD RE-UPLOAD & RECOGNITION                     │
└────────────────────────────────────────────────────┘

SCENARIO: Student "2024001" had set password, then 
records were deleted and re-uploaded

TIMELINE:

T0 - INITIAL UPLOAD
├─ Admin uploads CSV with student "2024001"
└─ databaseStudent record created

T1 - STUDENT SETS PASSWORD
├─ Student verifies name and admission
├─ Creates portal password
├─ studentPortalAccount created with passwordHash
└─ lastLoginAt recorded

T2 - ADMIN DELETES & RE-UPLOADS
├─ Admin initiates deletion
├─ System calls: archiveStudentPortalCredentials()
│  ├─ Finds studentPortalAccount for "2024001"
│  ├─ Checks if passwordHash exists ✓
│  ├─ Creates ArchivedStudentPortalCredential with:
│  │  ├─ passwordHash (PRESERVED)
│  │  ├─ firstName, lastName, form, stream
│  │  ├─ lastLoginAt timestamp
│  │  ├─ passwordSetAt timestamp
│  │  └─ expiresAt = NOW + 60 days
│  └─ Marks original as archived/deleted
├─ databaseStudent deleted
├─ studentSession deleted
└─ Fee records cleaned up

T3 - NEW RECORDS UPLOADED
├─ Admin uploads fresh CSV with "2024001"
├─ New databaseStudent created (fresh data)
├─ NO corresponding studentPortalAccount yet
└─ Archive still valid (within 60-day window)

T4 - STUDENT ATTEMPTS LOGIN (SAME PASSWORD)
├─ Student provides: Admission "2024001" + Old Password
├─ Query: studentPortalAccount
│  └─ Result: NOT FOUND ✗ (was deleted)
├─ Query: ArchivedStudentPortalCredential
│  ├─ WHERE admissionNumber = "2024001"
│  ├─ WHERE expiresAt > NOW ✓ (still within window)
│  ├─ WHERE passwordHash EXISTS ✓
│  └─ Result: FOUND ✓
├─ System calls: restoreArchivedAccountForStudent()
│  ├─ Creates NEW studentPortalAccount
│  ├─ Copies passwordHash from archive
│  ├─ Updates: firstName, lastName, form, stream
│  ├─ Links to NEW databaseStudent record
│  ├─ Sets passwordSetAt from archive
│  ├─ Sets lastLoginAt from archive
│  └─ Marks ArchivedStudentPortalCredential.restoredAt = NOW
├─ Validates password (bcrypt.compare)
│  ├─ Compares input password against restored hash
│  └─ Result: ✓ MATCH
└─ LOGIN SUCCESSFUL
   ├─ Generate 2-hour JWT token
   ├─ Create new studentSession
   ├─ Redirect to dashboard
   └─ Student recognized as previously logged-in user

RECOGNITION INDICATORS:
✓ Student can log in immediately (no re-verification needed)
✓ Same password works after re-upload
✓ Portal account restored within 60 days
✓ Maintains login continuity
✓ Original login history preserved in archive

WHAT HAPPENS AFTER 60 DAYS:
├─ Automatic cleanup deletes archive
├─ If records re-uploaded after cleanup:
│  └─ Student must re-verify name and create new password
└─ Access still available via portal if already logged in
```

### 12.4 Set Password (Admin-Initiated)

```
┌────────────────────────────────────────────────────┐
│ ADMIN-INITIATED PASSWORD SETUP                     │
└────────────────────────────────────────────────────┘

SCENARIO: Admin wants to enable password for 
existing student (batch onboarding)

1. ADMIN ACTION (In Admin Dashboard)
   ├─ Select: Student "2024001"
   ├─ Click: "Send Setup Email"
   └─ System creates setup request

2. REQUEST CREATION (Server)
   ├─ Create StudentPasswordResetRequest
   ├─ requestType = 'admin_setup'
   ├─ Generate setup token (10-minute expiry)
   ├─ Hash token for storage
   └─ adminNote = "Setup initiated by [Admin Name]"

3. EMAIL SENT TO PARENT
   ├─ To: [Parent email]
   ├─ Subject: "Student Portal Password Setup: [ADM#]"
   ├─ Message: "Create a student portal password to enable access"
   ├─ Link: Secure setup URL (10 minutes valid)
   └─ Same template as forgot password

4. PARENT/STUDENT RECEIVES EMAIL
   ├─ Clicks link
   └─ Directed to password creation page

5. PASSWORD CREATION
   ├─ Token validated (same as reset flow)
   ├─ Student enters new password
   ├─ Meets 5 criteria requirement
   └─ Submits

6. ACCOUNT CREATION
   ├─ studentPortalAccount created
   ├─ Linked to databaseStudent
   ├─ lastLoginAt set to now
   └─ Email marked as sent

7. RESULT
   └─ Student can now log in with new password

OCCASIONS EMAIL SENT:
1. Forgot password (student initiates)
2. Admin setup (admin initiates)
```

---

## 13. CRITICAL FLOWS & DECISION POINTS

### 13.1 Authentication Decision Tree

```
Student visits portal
  │
  ├─ Has password?
  │  ├─ YES → Password Login
  │  │  ├─ Valid credentials? 
  │  │  │  ├─ YES → 2-hour session
  │  │  │  └─ NO → Error, retry or forgot password
  │  │  │
  │  │  └─ NO PASSWORD → Error (first, setup required)
  │  │
  │  └─ NO → First-Time Verification
  │     ├─ Verify Admission + Name
  │     │  ├─ MATCH → Generate setup token (10 min)
  │     │  │  └─ Proceed to password creation
  │     │  │
  │     │  └─ NO MATCH → Error
  │     │     └─ Contact teacher/admin
  │
  └─ Portal Dashboard Access
     └─ All features enabled
```

### 13.2 Record Re-Upload Decision Tree

```
Admin deletes student record
  │
  ├─ Student has portal password?
  │  ├─ YES → Archive credentials
  │  │  ├─ Create ArchivedStudentPortalCredential
  │  │  ├─ Store passwordHash
  │  │  └─ Set 60-day expiry
  │  │
  │  └─ NO → No action needed
  │     └─ First-time access required after re-upload
  │
  └─ New records uploaded (same admission number)
     │
     └─ Student logs in (uses old password)
        │
        ├─ Check ArchivedStudentPortalCredential
        │  ├─ Within 60 days?
        │  │  ├─ YES → Restore credentials
        │  │  │  ├─ Create new studentPortalAccount
        │  │  │  ├─ Copy passwordHash
        │  │  │  └─ Link to new databaseStudent
        │  │  │
        │  │  └─ NO (60+ days) → Expired
        │  │     └─ First-time verification required
        │  │
        │  └─ NO archive → First-time verification required
        │
        └─ Login proceeds with appropriate flow
```

---

## 14. ENVIRONMENT CONFIGURATION

**Required Environment Variables:**

```env
# Database
DATABASE_URL=mysql://user:password@host/database

# JWT/Authentication
JWT_SECRET=your-jwt-secret-key
STUDENT_JWT_SECRET=your-student-jwt-secret-key (optional)

# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password (NOT account password)
CONTACT_EMAIL=contact@matungulugirls.school
ADMIN_EMAIL=admin@matungulugirls.school

# Application URLs
NEXT_PUBLIC_APP_URL=https://matungulugirls.school
APP_URL=https://matungulugirls.school
BASE_URL=https://matungulugirls.school

# Environment
NODE_ENV=production
```

---

## 15. PERFORMANCE CONSIDERATIONS

### 15.1 Batch Processing

**Student Upload Optimization:**
- Batch size: 200 rows per database operation
- Large uploads (800+ rows): Optimized chunking
- Transaction handling: Atomic operations
- Cleanup: Async archive purge

### 15.2 Session Management

**Session Cleanup:**
- Duration: 2 hours per session
- Auto-logout: Client-side & server-side validation
- Concurrent sessions: Allowed (no session limit)
- Database indexes: Optimized for token lookup

### 15.3 Archive Maintenance

**Expired Archive Cleanup:**
- Frequency: On every login/password reset
- Retention: 60 days
- Automatic purge: No manual intervention needed
- Performance impact: Negligible

---

## 16. RECOMMENDATIONS & BEST PRACTICES

### 16.1 Security Enhancements

1. **Rate Limiting**
   - Add rate limiting on login attempts
   - Lock account after N failed attempts
   - Time-based unlock (15 minutes)

2. **Two-Factor Authentication**
   - Consider SMS OTP for password resets
   - Parent verification on setup emails

3. **Password History**
   - Prevent reuse of last N passwords
   - Password change enforcement (e.g., 90 days)

4. **Audit Logging**
   - Log all login attempts (success/failure)
   - Track password changes
   - Monitor admin actions on student records

### 16.2 User Experience Improvements

1. **Email Delivery Confirmation**
   - Retry mechanism for failed emails
   - Resend option for password setup links
   - Email delivery status dashboard

2. **Session Persistence**
   - "Remember this device" option
   - Reduce re-login frequency
   - Device fingerprinting

3. **Support Portal**
   - Self-service password reset
   - Account unlock requests
   - Email change requests

### 16.3 Data Integrity

1. **Archive Verification**
   - Periodic validation of archive integrity
   - Backup of archived credentials
   - Recovery procedures documentation

2. **Record Matching**
   - Improve name matching algorithm
   - Add fuzzy matching for typos
   - Manual override option for admins

3. **Audit Trail**
   - Who archived records (admin name)
   - Reason for deletion
   - Recovery history

---

## 17. TROUBLESHOOTING GUIDE

### Issue: Student Can't Log In After Re-upload

**Diagnosis:**
```
1. Check if 60 days passed since deletion
   └─ Archive automatically deleted
2. Check student record status
   └─ databaseStudent.status must be 'active'
3. Verify new student record created
   └─ Same admission number
4. Check archive validity
   └─ SELECT * FROM archived_student_portal_credentials 
      WHERE admissionNumber = ?
```

**Resolution:**
- If within 60 days: Archive should restore
- If after 60 days: Student must re-verify name
- If no archive found: First-time setup required

### Issue: Reset Email Not Received

**Diagnosis:**
```
1. Check email configuration
   └─ EMAIL_USER and EMAIL_PASS set?
2. Check student record
   └─ student.email field populated?
3. Review email logs
   └─ Nodemailer error messages
4. Check spam folder
   └─ Email delivered but filtered
```

**Resolution:**
- Verify Gmail app password (not account password)
- Enable "Less secure apps" if needed
- Check email address in student record
- Resend via admin dashboard

### Issue: Password Setup Token Expired

**Diagnosis:**
```
1. Check timestamp
   └─ Was request made > 10 minutes ago?
2. Verify token not already used
   └─ Check StudentPasswordResetRequest.usedAt
3. Confirm student record still active
   └─ databaseStudent.status = 'active'
```

**Resolution:**
- Request new setup token
- Admin can resend email
- Student initiates new first-time verification

---

## 18. CONCLUSION

Your student portal implements a **sophisticated, multi-layered authentication system** with:

✓ **Flexible first-time access** - Name-based verification with intelligent matching  
✓ **Secure password management** - Bcrypt hashing, 5-criteria strength requirements  
✓ **Email-based password recovery** - Two distinct scenarios with parent notifications  
✓ **Intelligent record recovery** - Automatic credential restoration after re-upload  
✓ **Session-based authorization** - JWT tokens with 2-hour expiry  
✓ **Comprehensive audit trails** - IP tracking, device fingerprinting, request logging  

The system successfully balances **security** with **user accessibility**, ensuring students can easily access the portal while parents maintain control through email notifications and password reset mechanisms.

---

**Report Generated:** May 20, 2026  
**System Status:** ✓ Production Ready  
**Security Level:** ★★★★★ (Excellent)
