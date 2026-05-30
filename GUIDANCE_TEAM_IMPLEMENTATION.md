# Guidance Team & Non-Teaching Staff Restructure - Complete Implementation Guide

## Overview
This document outlines the complete restructure of the Guidance & Counselling team and integration of Non-Teaching Staff (NTS) in the MatG School Website.

## Changes Made ✅

### 1. Database Schema Update
**File:** `prisma/schema.prisma`

Added two new fields to the `TeamMember` model:
```prisma
gender    String? // "male" or "female"
category  String @default("guidance") // "guidance" or "nts"
```

### 2. API Enhancement
**File:** `app/api/guidanceteam/route.jsx`

**Updates:**
- Added `gender` and `category` field extraction from form data
- Implemented automatic image selection based on gender:
  - Female: `/Matungulu/female.png`
  - Male: `/Matungulu/male.png`
- Updated Prisma create payload to include gender and category

### 3. Guidance Component Redesign
**File:** `app/components/guidance/page.jsx`

**Role Updates:**
```javascript
// Updated role options now include:
- guidanceTeacher (Guidance & Counselling Teacher)
- nurse (School Nurse)
- boardingHod (Head of Boarding)
- matron (Matron - NTS)
- secretary (Secretary - NTS)
- accountsClerk (Accounts Clerk - NTS)
- bursar (Bursar - NTS)
```

**UI Additions:**
- Gender Selection: Female/Male toggle buttons
- Category Selection: Guidance Team/Non-Teaching Staff toggle buttons
- Updated all role configuration objects with new roles and colors
- Updated initial form data to include gender and category defaults

### 4. Staff Component Enhancement
**File:** `app/components/staff/page.jsx`

**Updates:**
- Added `ntsStaff` state to store Non-Teaching Staff data
- Created `fetchNtsStaff()` function to fetch members where `category === 'nts'`
- Added automatic call to fetch NTS staff on component mount

### 5. Seed Data Script
**File:** `prisma/seed-guidance-team.js` (NEW)

Creates initial team members:

**Guidance & Counselling Team (3 members):**
1. Isabella Musyoka - Head of Guidance & Counselling (Female, guidanceTeacher)
2. Madam Kanana - School Nurse (Female, nurse)
3. Carol Philip - Head of Boarding (Female, boardingHod)

**Non-Teaching Staff (4 members):**
1. NTS - Matron (Female, matron)
2. Secretary (Female, secretary)
3. Accounts Clerk (Female, accountsClerk)
4. Bursar (Female, bursar)

All use:
- School email: `info@matungulugirlshs.com`
- School phone: `+254723123456` (update if needed)
- Default images: `/Matungulu/female.png`

## Implementation Steps

### Step 1: Apply Database Migration
Once the database server is back online, run:
```bash
cd c:\Users\ADMIN\Desktop\templetes\MatG
npx prisma migrate dev --name add_gender_category_to_team_member
```

This will:
- Add `gender` and `category` columns to `team_members` table
- Set defaults for existing records
- Generate new Prisma Client types

### Step 2: Seed Initial Data
```bash
node prisma/seed-guidance-team.js
```

Output should show:
```
🌱 Seeding Guidance and Counselling Team...
✅ Created: Isabella Musyoka (guidanceTeacher)
✅ Created: Madam Kanana (nurse)
✅ Created: Carol Philip (boardingHod)
✅ Created: NTS - Matron (matron)
✅ Created: Secretary (secretary)
✅ Created: Accounts Clerk (accountsClerk)
✅ Created: Bursar (bursar)

✅ Guidance team seeding complete!
📊 Summary:
   - Guidance Team: 3 members
   - Non-Teaching Staff (NTS): 4 members
   - Total: 7 team members
```

### Step 3: Verify the Changes

#### Test Guidance Team Page
1. Navigate to the guidance team management page
2. You should see all 7 team members with:
   - Gender-based images (female.png for all initial data)
   - Color-coded role badges
   - Category indicators (Guidance vs NTS)

#### Test Staff Component
1. Navigate to the staff management page
2. You should see:
   - Regular teachers in the main staff section
   - NTS staff in a separate section/tab showing Secretary, Accounts Clerk, Bursar, Matron

### Step 4: Create More Team Members
The UI now supports:
- Adding new Guidance & Counselling team members
- Adding new Non-Teaching Staff members
- Selecting gender (with automatic image assignment)
- Selecting category (Guidance or NTS)

## Team Structure After Implementation

### Guidance & Counselling Team
| Name | Role | Gender | Status |
|------|------|--------|--------|
| Isabella Musyoka | Guidance Teacher | Female | Head |
| Madam Kanana | Nurse | Female | Active |
| Carol Philip | Head of Boarding | Female | Active |

### Non-Teaching Staff (NTS) Group
| Name | Role | Gender | Status |
|------|------|--------|--------|
| Matron | Matron | Female | Active |
| Secretary | Secretary | Female | Active |
| Accounts Clerk | Accounts Clerk | Female | Active |
| Bursar | Bursar | Female | Active |

## File Locations & References

### Images Used
- Female image: `/public/Matungulu/female.png`
- Male image: `/public/Matungulu/male.png`

*Ensure these images exist in the public folder before running the application.*

### API Endpoints
- Guidance team: `/api/guidanceteam`
- GET all members: `GET /api/guidanceteam`
- Create member: `POST /api/guidanceteam` (requires auth tokens)

### Key Files Modified
1. `prisma/schema.prisma` - Schema changes
2. `app/api/guidanceteam/route.jsx` - API logic
3. `app/components/guidance/page.jsx` - UI component
4. `app/components/staff/page.jsx` - Staff integration
5. `prisma/seed-guidance-team.js` - Seed script (NEW)

## Backward Compatibility

The implementation maintains backward compatibility:
- Old role values (teacher, patron, assistant) are still recognized
- Gender field defaults to "male"
- Category field defaults to "guidance"
- Existing records will work without modification

## Future Enhancements

1. **Frontend Display**
   - Add team member photos to student portal
   - Create team directory on home page
   - Add filtering by category in guidance component

2. **Additional NTS Roles**
   - Groundskeeper
   - Cook/Chef
   - Security Guard
   - Maintenance Staff

3. **Team Management**
   - Bulk import from CSV
   - Role hierarchy permissions
   - Team assignment workflows

## Troubleshooting

### Database Connection Issues
If you encounter connection issues:
```bash
# Check database connection
npx prisma db push

# View database status
npx prisma studio
```

### Migration Fails
If the migration fails:
```bash
# Check migration status
npx prisma migrate status

# Resolve migration conflicts
npx prisma migrate resolve --applied "migration_name"
```

### Seed Script Issues
If seed script fails:
```bash
# Run with verbose output
node --trace-warnings prisma/seed-guidance-team.js

# Reset and try again
npx prisma migrate reset
```

## Contact & Support

For issues or questions about this implementation, refer to:
- Guidance component: `app/components/guidance/page.jsx`
- Staff component: `app/components/staff/page.jsx`
- API route: `app/api/guidanceteam/route.jsx`
- Seed documentation: `prisma/seed-guidance-team.js`

---

**Status:** ✅ Code Complete, ⏳ Awaiting Database Connectivity

**Last Updated:** May 30, 2026
