import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

export const dynamic = "force-dynamic";

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      // Extract tokens from headers
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      // Validate admin token format (basic check)
      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      // Validate device token
      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      // Parse admin token payload
      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        // Check expiration
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        // Check user role - only admins/SchoolTeam can manage staff
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage staff' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Staff management authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole
        },
        deviceInfo: deviceValid.payload
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { 
        valid: false, 
        reason: 'validation_error', 
        message: 'Authentication validation failed',
        error: error.message 
      };
    }
  }

  // Validate device token
  static validateDeviceToken(token) {
    try {
      // Handle base64 decoding safely
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      // Check age (30 days max)
      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: 'age_expired', payload, error: 'Device token is too old' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: 'invalid_format', error: error.message };
    }
  }
}

// Authentication middleware for protected requests
const authenticateRequest = (req) => {
  const headers = req.headers;
  
  // Validate tokens
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to manage staff.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.devInfo
  };
};

// Helper: Upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_staff",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};

// Helper: Delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

  try {
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return;
    
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
    // Silent fail - don't block operation if delete fails
  }
};

// ==================== STAFF VISIBILITY RULES ====================

const LEADERSHIP_ROLES = new Set([
  "Principal",
  "Deputy Principal",
  "Senior Teacher",
  "Head of Department",
  "Assistant Head of Department",
  "HOD",
  "AHOD",
]);

const LEADERSHIP_UPLOAD_ERROR =
  "Individual staff profiles are restricted to leadership roles only: Principal, Deputy Principal (Academics), Deputy Principal (Administration), Senior Teacher, HOD, and AHOD.";

const DEPUTY_POSITIONS = new Set([
  "Deputy Principal (Academics)",
  "Deputy Principal (Administration)",
]);

const isHodValue = (value = "") => {
  const normalized = value.toString().trim().toLowerCase();
  return (
    normalized === "hod" ||
    normalized === "ahod" ||
    normalized.includes("head of department") ||
    normalized.includes("assistant head of department")
  );
};

const isAllowedLeadershipRole = (role = "", position = "") => {
  const cleanRole = role.toString().trim();
  const cleanPosition = position?.toString().trim() || "";

  if (LEADERSHIP_ROLES.has(cleanRole)) return true;
  if (cleanPosition.toLowerCase().includes("senior teacher")) return true;
  if (isHodValue(cleanRole) || isHodValue(cleanPosition)) return true;

  return false;
};

const isLeadershipStaff = (staff) => {
  if (!staff) return false;
  if (staff.staffType === "Teacher" || staff.role === "Teacher") return false;
  const role = (staff.role || "").trim();
  const position = (staff.position || "").trim();
  const positionLower = position.toLowerCase();

  if (isAllowedLeadershipRole(role, position)) return true;
  if (positionLower.includes("senior teacher")) return true;

  if (role === "Deputy Principal") {
    if (!position) return true;
    const normalized = position.toLowerCase();
    return normalized.includes("academics") || normalized.includes("academic") || normalized.includes("admin");
  }

  return false;
};

const sanitizePublicStaff = (staff) => {
  const { email, phone, ...publicStaff } = staff;
  return publicStaff;
};

const STAFF_MODERN_SELECT = {
  id: true,
  name: true,
  role: true,
  staffType: true,
  position: true,
  department: true,
  departmentId: true,
  subjectOffered: true,
  education: true,
  experience: true,
  email: true,
  phone: true,
  bio: true,
  quote: true,
  gender: true,
  status: true,
  joinDate: true,
  responsibilities: true,
  expertise: true,
  achievements: true,
  image: true,
  createdAt: true,
  updatedAt: true,
};

const STAFF_LEGACY_SELECT = {
  id: true,
  name: true,
  role: true,
  position: true,
  department: true,
  education: true,
  experience: true,
  email: true,
  phone: true,
  bio: true,
  quote: true,
  responsibilities: true,
  expertise: true,
  achievements: true,
  image: true,
  createdAt: true,
  updatedAt: true,
};

const isSchemaCompatibilityError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return ["P2021", "P2022"].includes(error?.code) ||
    message.includes("column") ||
    message.includes("does not exist") ||
    message.includes("unknown field") ||
    message.includes("unknown column") ||
    message.includes("table");
};

const normalizeStaffRecord = (staff = {}) => ({
  ...staff,
  position: staff.position || staff.role || "",
  staffType: staff.staffType || (staff.role === "Teacher" ? "Teacher" : "Leadership"),
  departmentId: staff.departmentId ?? null,
  subjectOffered: staff.subjectOffered || "",
  gender: staff.gender || "male",
  status: staff.status || "active",
  joinDate: staff.joinDate || "",
});

const formValue = (formData, key) => {
  const value = formData.get(key);
  return value === null ? undefined : value.toString();
};

const fetchSingleStaffRecord = async (id) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id },
      select: STAFF_MODERN_SELECT,
    });
    return staff ? normalizeStaffRecord(staff) : null;
  } catch (error) {
    if (!isSchemaCompatibilityError(error)) {
      throw error;
    }

    console.warn("Falling back to legacy single-staff query shape:", error.message);
    const legacyStaff = await prisma.staff.findUnique({
      where: { id },
      select: STAFF_LEGACY_SELECT,
    });
    return legacyStaff ? normalizeStaffRecord(legacyStaff) : null;
  }
};

const syncDepartmentStaffCount = async (departmentId) => {
  const normalizedDepartmentId = Number(departmentId);
  if (!Number.isFinite(normalizedDepartmentId)) return;

  try {
    const activeTeacherCount = await prisma.staff.count({
      where: {
        departmentId: normalizedDepartmentId,
        staffType: "Teacher",
        status: "active",
      },
    });

    await prisma.staffDepartment.update({
      where: { id: normalizedDepartmentId },
      data: { staffCount: activeTeacherCount },
    });
  } catch (error) {
    console.warn(`Unable to sync staff count for department ${normalizedDepartmentId}:`, error.message);
  }
};

// 🔹 Check principal/deputy principal limits
async function checkRoleLimits(role, staffId = null, position = null) {
  if (role === "Principal") {
    const existingPrincipal = await prisma.staff.findFirst({
      where: { 
        role: "Principal",
        ...(staffId && { id: { not: staffId } }) // Exclude current staff if updating
      }
    });
    
    if (existingPrincipal) {
      throw new Error("A principal already exists. There can only be one principal.");
    }
  } 
  
  else if (role === "Deputy Principal") {
    const existingDeputies = await prisma.staff.findMany({
      where: { 
        role: "Deputy Principal",
        ...(staffId && { id: { not: staffId } }) // Exclude current staff if updating
      }
    });
    
    // Hard limit: Exactly 2 Deputy Principals maximum
    if (existingDeputies.length >= 2) {
      throw new Error(
        "Maximum of two deputy principals allowed.\n" +
        "✓ One Deputy Principal (Academics)\n" +
        "✓ One Deputy Principal (Administration)"
      );
    }

    // If position is provided, check for duplicates based on position type
    if (position && existingDeputies.length > 0) {
      const positionLower = position.toLowerCase();

      // Check if trying to add a second Academic Deputy
      if (positionLower.includes('academics') || positionLower.includes('academic')) {
        const academicExists = existingDeputies.some(deputy => 
          deputy.position?.toLowerCase().includes('academics') || 
          deputy.position?.toLowerCase().includes('academic')
        );
        
        if (academicExists) {
          throw new Error("Deputy Principal (Academics) already exists.");
        }
      }
      
      // Check if trying to add a second Administration Deputy
      if (positionLower.includes('admin')) {
        const adminExists = existingDeputies.some(deputy => 
          deputy.position?.toLowerCase().includes('admin') ||
          deputy.position?.toLowerCase().includes('administration')
        );
        
        if (adminExists) {
          throw new Error("Deputy Principal (Administration) already exists.");
        }
      }
    }
  }
}

// 🔹 GET single staff by ID
// - Public: leadership only (privacy)
// - Admin (auth headers present + valid): any staff record
export async function GET(req, { params }) {
  try {
    let isAdmin = false;

    const maybeAdminToken = req?.headers?.get('x-admin-token') || req?.headers?.get('authorization')?.replace('Bearer ', '');
    const maybeDeviceToken = req?.headers?.get('x-device-token');

    if (maybeAdminToken && maybeDeviceToken) {
      const validation = DeviceTokenManager.validateTokensFromHeaders(req.headers);
      isAdmin = validation.valid;
    }

    const staff = await fetchSingleStaffRecord(Number(params.id));

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    if (!isAdmin && !isLeadershipStaff(staff)) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, staff: isAdmin ? staff : sanitizePublicStaff(staff) });
  } catch (error) {
    console.error("❌ GET Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// 🔹 UPDATE staff by ID (PROTECTED - authentication required)
export async function PUT(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📝 Staff update request from: ${auth.user.name} (${auth.user.role})`);

    const id = Number(params.id);
    const formData = await req.formData();
    const data = {};

    // Fetch existing staff (for image cleanup and role checks)
    const existingStaff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!existingStaff) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Staff not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Check if role or position is being changed
    const newRole = formData.get("role");
    const newPosition = formData.get("position");
    const newStaffType = formData.get("staffType");
    const isTeacherRequest =
      newStaffType === "Teacher" ||
      newRole === "Teacher" ||
      existingStaff.staffType === "Teacher" ||
      existingStaff.role === "Teacher";

    // 🔹 Restrict updates to leadership profiles only
    const effectiveRole = newRole || existingStaff.role;
    const effectivePosition = newPosition || existingStaff.position;
    if (!isTeacherRequest && (newRole || newPosition) && !isAllowedLeadershipRole(effectiveRole, effectivePosition)) {
      return NextResponse.json(
        {
          success: false,
          error: LEADERSHIP_UPLOAD_ERROR,
          authenticated: true,
        },
        { status: 400 }
      );
    }
    
    // Validate Deputy Principal has position when role is Deputy Principal
    if (!isTeacherRequest && newRole === "Deputy Principal" && !newPosition) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Deputy Principal must have a position: 'Deputy Principal (Academics)' or 'Deputy Principal (Administration)'",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Enforce Deputy Principal type (Academics/Admin)
    if (!isTeacherRequest && newRole === "Deputy Principal" && newPosition && !DEPUTY_POSITIONS.has(newPosition)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deputy Principal position must be 'Deputy Principal (Academics)' or 'Deputy Principal (Administration)'.",
          authenticated: true,
        },
        { status: 400 }
      );
    }

    // If role isn't provided but we're updating a Deputy Principal, still validate the position
    if (!isTeacherRequest && !newRole && existingStaff.role === "Deputy Principal" && newPosition && !DEPUTY_POSITIONS.has(newPosition)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Deputy Principal position must be 'Deputy Principal (Academics)' or 'Deputy Principal (Administration)'.",
          authenticated: true,
        },
        { status: 400 }
      );
    }

    // Check role limits if role is being changed OR if position is being updated for Deputy Principal
    if (!isTeacherRequest && newRole && newRole !== existingStaff.role) {
      try {
        await checkRoleLimits(newRole, id, newPosition);
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message,
            authenticated: true
          },
          { status: 400 }
        );
      }
    } 
    // Special case: Updating Deputy Principal position (e.g., from Academics to Administration)
    else if (!isTeacherRequest && existingStaff.role === "Deputy Principal" && 
             newPosition && 
             newPosition !== existingStaff.position) {
      
      // Check if the target position is already taken
      const existingDeputies = await prisma.staff.findMany({
        where: { 
          role: "Deputy Principal",
          id: { not: id } // Exclude current staff
        }
      });
      
      const positionLower = newPosition.toLowerCase();
      
      if (positionLower.includes('academics') || positionLower.includes('academic')) {
        const academicExists = existingDeputies.some(deputy => 
          deputy.position?.toLowerCase().includes('academics') || 
          deputy.position?.toLowerCase().includes('academic')
        );
        
        if (academicExists) {
          throw new Error("Deputy Principal (Academics) already exists. Cannot change to this position.");
        }
      }
      
      if (positionLower.includes('admin')) {
        const adminExists = existingDeputies.some(deputy => 
          deputy.position?.toLowerCase().includes('admin') ||
          deputy.position?.toLowerCase().includes('administration')
        );
        
        if (adminExists) {
          throw new Error("Deputy Principal (Administration) already exists. Cannot change to this position.");
        }
      }
    }

    // Include submitted fields from the Prisma schema, including intentional clears.
    const submittedName = formValue(formData, "name");
    if (submittedName !== undefined) {
      const trimmedName = submittedName.trim();
      if (!trimmedName) {
        return NextResponse.json(
          { success: false, error: "Staff name cannot be empty", authenticated: true },
          { status: 400 }
        );
      }
      data.name = trimmedName;
    }

    if (isTeacherRequest) {
      data.role = "Teacher";
      data.staffType = "Teacher";
      data.position = "Teacher";

      const subjectOffered = (formData.get("subjectOffered") || "").toString().trim();
      if (!subjectOffered) {
        return NextResponse.json(
          {
            success: false,
            error: "Subject offered is required for teacher records.",
            authenticated: true
          },
          { status: 400 }
        );
      }
      data.subjectOffered = subjectOffered;

      const departmentId = Number(formData.get("departmentId") || existingStaff.departmentId);
      if (!Number.isFinite(departmentId)) {
        return NextResponse.json(
          {
            success: false,
            error: "Please select a valid department for this teacher.",
            authenticated: true
          },
          { status: 400 }
        );
      }

      const selectedDepartment = await prisma.staffDepartment.findFirst({
        where: { id: departmentId, isActive: true },
        select: { id: true, name: true }
      });

      if (!selectedDepartment) {
        return NextResponse.json(
          {
            success: false,
            error: "Selected department was not found or is hidden.",
            authenticated: true
          },
          { status: 400 }
        );
      }

      data.departmentId = selectedDepartment.id;
      data.department = selectedDepartment.name;
    } else {
      const submittedRole = formValue(formData, "role");
      const submittedPosition = formValue(formData, "position");
      const submittedDepartment = formValue(formData, "department");

      if (submittedRole !== undefined) data.role = submittedRole.trim();
      data.staffType = "Leadership";
      if (submittedPosition !== undefined) data.position = submittedPosition.trim() || null;
      if (submittedDepartment !== undefined) data.department = submittedDepartment.trim() || null;
      data.departmentId = null;
      data.subjectOffered = null;
    }

    [
      "email",
      "phone",
      "bio",
      "quote",
      "education",
      "experience",
      "gender",
      "status",
      "joinDate",
    ].forEach((field) => {
      const value = formValue(formData, field);
      if (value !== undefined) {
        data[field] = value.trim() || null;
      }
    });

    // JSON fields (safe parsing)
    if (formData.get("responsibilities") !== null) {
      try {
        data.responsibilities = JSON.parse(formData.get("responsibilities") || "[]");
      } catch (e) {
        console.error("Error parsing responsibilities:", e);
        data.responsibilities = [];
      }
    }

    if (formData.get("expertise") !== null) {
      try {
        data.expertise = JSON.parse(formData.get("expertise") || "[]");
      } catch (e) {
        console.error("Error parsing expertise:", e);
        data.expertise = [];
      }
    }

    if (formData.get("achievements") !== null) {
      try {
        data.achievements = JSON.parse(formData.get("achievements") || "[]");
      } catch (e) {
        console.error("Error parsing achievements:", e);
        data.achievements = [];
      }
    }

    // Optional image upload (replace old one)
    const file = formData.get("image");
    
    // Check if it's an actual file upload
    if (file && typeof file !== "string" && file.size > 0) {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed.",
            authenticated: true
          },
          { status: 400 }
        );
      }
      
      // Validate image size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Image size too large. Maximum size is 5MB.",
            authenticated: true
          },
          { status: 400 }
        );
      }
      
      // Remove old image from Cloudinary if it exists
      if (existingStaff.image) {
        await deleteImageFromCloudinary(existingStaff.image);
      }

      // Upload new image to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file);
      if (!cloudinaryUrl) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Failed to upload image",
            authenticated: true
          },
          { status: 500 }
        );
      }
      data.image = cloudinaryUrl;
    } else if (typeof file === "string" && file.trim() !== "") {
      // It's a string (either existing Cloudinary URL or default)
      data.image = file;
    }
    // If file is null/undefined, keep existing image

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data,
    });

    const departmentIdsToSync = Array.from(
      new Set(
        [existingStaff.departmentId, updatedStaff.departmentId]
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value))
      )
    );

    await Promise.all(departmentIdsToSync.map(syncDepartmentStaffCount));

    console.log(`✅ Staff member updated by ${auth.user.name}: ${updatedStaff.name} (${updatedStaff.role}${updatedStaff.position ? ' - ' + updatedStaff.position : ''})`);

    return NextResponse.json({ 
      success: true, 
      staff: updatedStaff,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ PUT Staff Error:", error);
    
    // Handle role limit errors
    if (error.message.includes("principal") || 
        error.message.includes("deputy") || 
        error.message.includes("Deputy")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Handle unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json(
        {
          success: false,
          error: `A staff member with this ${field} already exists`,
          authenticated: true
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to update staff",
        authenticated: true
      },
      { status: 500 }
    );
  }
}

// 🔹 DELETE staff by ID (PROTECTED - authentication required)
export async function DELETE(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`🗑️ Staff delete request from: ${auth.user.name} (${auth.user.role})`);

    const id = Number(params.id);

    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Staff not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Remove image from Cloudinary
    if (staff.image) {
      await deleteImageFromCloudinary(staff.image);
    }

    await prisma.staff.delete({
      where: { id },
    });

    await syncDepartmentStaffCount(staff.departmentId);

    console.log(`✅ Staff member deleted by ${auth.user.name}: ${staff.name}`);

    return NextResponse.json({
      success: true,
      message: "Staff deleted successfully",
      deletedStaff: staff.name,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ DELETE Staff Error:", error);
    
    // Handle foreign key constraint errors
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cannot delete staff member because they are referenced in other records",
          authenticated: true
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to delete staff",
        authenticated: true
      },
      { status: 500 }
    );
  }
}
