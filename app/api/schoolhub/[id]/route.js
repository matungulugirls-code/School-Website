import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

// ==================== AUTHENTICATION UTILITIES ====================

class DeviceTokenManager {
  static validateTokensFromHeaders(headers) {
    try {
      const adminToken =
        headers.get("x-admin-token") ||
        headers.get("authorization")?.replace("Bearer ", "");
      const deviceToken = headers.get("x-device-token");

      if (!adminToken) {
        return { valid: false, reason: "no_admin_token", message: "Admin token is required" };
      }

      if (!deviceToken) {
        return { valid: false, reason: "no_device_token", message: "Device token is required" };
      }

      const adminParts = adminToken.split(".");
      if (adminParts.length !== 3) {
        return {
          valid: false,
          reason: "invalid_admin_token_format",
          message: "Invalid admin token format",
        };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return {
          valid: false,
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ""}`,
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));

        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: "admin_token_expired", message: "Admin token has expired" };
        }

        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = [
          "ADMIN",
          "SUPER_ADMIN",
          "administrator",
          "PRINCIPAL",
          "STAFF",
          "HR_MANAGER",
        ];

        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return {
            valid: false,
            reason: "invalid_role",
            message: "User does not have permission to manage School Hub items",
          };
        }
      } catch {
        return { valid: false, reason: "invalid_admin_token", message: "Invalid admin token" };
      }

      return {
        valid: true,
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole,
        },
        deviceInfo: deviceValid.payload,
      };
    } catch (error) {
      return {
        valid: false,
        reason: "validation_error",
        message: "Authentication validation failed",
        error: error.message,
      };
    }
  }

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, "base64").toString("utf-8");
      const payload = JSON.parse(payloadStr);

      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: "expired", payload, error: "Device token has expired" };
      }

      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: "age_expired", payload, error: "Device token is too old" };
      }

      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: "invalid_format", error: error.message };
    }
  }
}

const authenticateWriteRequest = (req) => {
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(req.headers);
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access Denied",
          message: "Authentication required to manage School Hub items.",
          details: validationResult.message,
        },
        { status: 401 }
      ),
    };
  }
  return { authenticated: true, user: validationResult.user };
};

// ==================== CLOUDINARY HELPERS ====================

const uploadImageToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_hub",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [{ width: 1200, height: 675, crop: "fill" }, { quality: "auto:good" }],
        },
        (error, res) => {
          if (error) reject(error);
          else resolve(res);
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

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;

  try {
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) return;

    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join("/");
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
  }
};

const VALID_TYPES = new Set(["CLUB", "SOCIETY", "FARM", "BOARDING", "SECURITY"]);

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const includeInactive = new URL(req.url).searchParams.get("includeInactive") === "1";
    let isAdmin = false;

    if (includeInactive) {
      const maybeAdminToken =
        req?.headers?.get("x-admin-token") ||
        req?.headers?.get("authorization")?.replace("Bearer ", "");
      const maybeDeviceToken = req?.headers?.get("x-device-token");
      if (maybeAdminToken && maybeDeviceToken) {
        const validation = DeviceTokenManager.validateTokensFromHeaders(req.headers);
        isAdmin = validation.valid;
      }
    }

    const item = await prisma.schoolHubItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    if (!item.isActive && !isAdmin) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("❌ GET SchoolHub Item Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id", authenticated: true },
        { status: 400 }
      );
    }

    const existing = await prisma.schoolHubItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Item not found", authenticated: true },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const data = {};

    const type = formData.get("type");
    if (type !== null) {
      const t = type.toString().trim();
      if (!VALID_TYPES.has(t)) {
        return NextResponse.json(
          { success: false, error: "Invalid School Hub type", authenticated: true },
          { status: 400 }
        );
      }
      data.type = t;
    }

    const title = formData.get("title");
    if (title !== null) {
      const trimmed = title.toString().trim();
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "title cannot be empty", authenticated: true },
          { status: 400 }
        );
      }
      data.title = trimmed;
    }

    const shortDescription = formData.get("shortDescription");
    if (shortDescription !== null) data.shortDescription = shortDescription.toString().trim() || null;

    const description = formData.get("description");
    if (description !== null) data.description = description.toString().trim() || null;

    const contactName = formData.get("contactName");
    if (contactName !== null) data.contactName = contactName.toString().trim() || null;

    const contactPhone = formData.get("contactPhone");
    if (contactPhone !== null) data.contactPhone = contactPhone.toString().trim() || null;

    const contactEmail = formData.get("contactEmail");
    if (contactEmail !== null) data.contactEmail = contactEmail.toString().trim() || null;

    const isActiveRaw = formData.get("isActive");
    if (isActiveRaw !== null) data.isActive = isActiveRaw === "true" || isActiveRaw === "1";

    const displayOrderRaw = formData.get("displayOrder");
    if (displayOrderRaw !== null) {
      const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
      if (!Number.isFinite(displayOrder)) {
        return NextResponse.json(
          { success: false, error: "displayOrder must be a valid number", authenticated: true },
          { status: 400 }
        );
      }
      data.displayOrder = Math.floor(displayOrder);
    }

    const detailsStr = formData.get("details");
    if (detailsStr !== null) {
      try {
        data.details = detailsStr ? JSON.parse(detailsStr) : [];
      } catch {
        data.details = [];
      }
    }

    const imageFile = formData.get("image");
    if (imageFile) {
      if (typeof imageFile === "string" && imageFile.trim() !== "") {
        data.image = imageFile.trim();
      } else if (typeof imageFile !== "string" && imageFile.size > 0) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { success: false, error: "Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed.", authenticated: true },
            { status: 400 }
          );
        }
        const maxSize = 8 * 1024 * 1024;
        if (imageFile.size > maxSize) {
          return NextResponse.json(
            { success: false, error: "Image size too large. Maximum size is 8MB.", authenticated: true },
            { status: 400 }
          );
        }

        const uploadedUrl = await uploadImageToCloudinary(imageFile);
        if (!uploadedUrl) {
          return NextResponse.json(
            { success: false, error: "Failed to upload image", authenticated: true },
            { status: 500 }
          );
        }
        data.image = uploadedUrl;

        if (existing.image && existing.image !== uploadedUrl) {
          await deleteImageFromCloudinary(existing.image);
        }
      }
    }

    const item = await prisma.schoolHubItem.update({ where: { id }, data });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("❌ PUT SchoolHub Item Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update item", authenticated: true },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id", authenticated: true },
        { status: 400 }
      );
    }

    const existing = await prisma.schoolHubItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Item not found", authenticated: true },
        { status: 404 }
      );
    }

    await prisma.schoolHubItem.delete({ where: { id } });

    if (existing.image) {
      await deleteImageFromCloudinary(existing.image);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE SchoolHub Item Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete item", authenticated: true },
      { status: 500 }
    );
  }
}

