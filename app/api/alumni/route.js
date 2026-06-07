import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import {
  SCHOOL_HUB_MAX_IMAGES,
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../libs/schoolContentUpload";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = new Set(["ALUMNI", "BOM", "PTA", "CURRENT_PRINCIPAL", "PAST_PRINCIPAL"]);
const LEGACY_CATEGORY_MAP = {
  PRINCIPAL_CURRENT: "CURRENT_PRINCIPAL",
  PRINCIPAL_PREVIOUS: "PAST_PRINCIPAL",
};

const normalizeCategoryType = (value) => {
  const category = (value || "").toString().trim();
  return LEGACY_CATEGORY_MAP[category] || category;
};

const decodeJwtPayload = (token) => {
  const payload = token.split(".")[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
};

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
      if (adminToken.split(".").length !== 3) {
        return { valid: false, reason: "invalid_admin_token_format", message: "Invalid admin token format" };
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
        adminPayload = decodeJwtPayload(adminToken);
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp && adminPayload.exp < currentTime) {
          return { valid: false, reason: "admin_token_expired", message: "Admin token has expired" };
        }

        const userRole = adminPayload.role || adminPayload.userRole || "";
        const validRoles = ["ADMIN", "SUPER_ADMIN", "ADMINISTRATOR", "PRINCIPAL", "TEACHER", "STAFF"];
        if (!validRoles.includes(userRole.toUpperCase())) {
          return {
            valid: false,
            reason: "invalid_role",
            message: "User does not have permission to manage alumni and leadership profiles",
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
      const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
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
          message: "Authentication required to manage alumni, BOM, and principal records.",
          details: validationResult.message,
        },
        { status: 401 }
      ),
    };
  }
  return { authenticated: true, user: validationResult.user };
};

const parseBoolean = (value, fallback = true) => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return value.toString() === "true" || value.toString() === "1";
};

const parseInteger = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
};

const parseAchievements = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value.toString());
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return value
      .toString()
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const normalizeProfileImages = (profile) => {
  const relationImages = Array.isArray(profile?.images)
    ? profile.images.map((image) => ({
        id: image.id,
        url: image.url,
        publicId: image.publicId || "",
        caption: image.caption || "",
        altText: image.altText || profile.name || "Profile image",
        displayOrder: image.displayOrder || 0,
      }))
    : [];

  const legacy = profile?.image
    ? [{ url: profile.image, publicId: "", caption: "", altText: profile.name || "Profile image", displayOrder: 0 }]
    : [];

  const seen = new Set();
  return [...relationImages, ...legacy].filter((image) => {
    if (!image?.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
};

const cleanProfileResponse = (profile) => {
  if (!profile) return null;
  return {
    ...profile,
    section: profile.categoryType,
    achievements: Array.isArray(profile.achievements) ? profile.achievements : parseAchievements(profile.achievements),
    images: normalizeProfileImages(profile),
  };
};

const groupProfiles = (profiles) =>
  profiles.reduce(
    (acc, profile) => {
      const key = profile.categoryType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(profile);
      return acc;
    },
    { ALUMNI: [], BOM: [], PTA: [], CURRENT_PRINCIPAL: [], PAST_PRINCIPAL: [] }
  );

const validateIncomingImages = (incomingFiles) => {
  if (incomingFiles.length > SCHOOL_HUB_MAX_IMAGES) {
    return `A profile can have up to ${SCHOOL_HUB_MAX_IMAGES} images.`;
  }

  for (const file of incomingFiles) {
    const validation = validateSchoolImage(file);
    if (!validation.valid) return validation.error;
  }

  return "";
};

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const categoryType = normalizeCategoryType(url.searchParams.get("categoryType") || url.searchParams.get("section"));
    const includeInactive = url.searchParams.get("includeInactive") === "1";

    let isAdmin = false;
    if (includeInactive) {
      const maybeAdminToken =
        req.headers.get("x-admin-token") ||
        req.headers.get("authorization")?.replace("Bearer ", "");
      const maybeDeviceToken = req.headers.get("x-device-token");
      if (maybeAdminToken && maybeDeviceToken) {
        isAdmin = DeviceTokenManager.validateTokensFromHeaders(req.headers).valid;
      }
    }

    const where = {};
    if (categoryType) {
      if (!VALID_CATEGORIES.has(categoryType)) {
        return NextResponse.json({ success: false, error: "Invalid categoryType" }, { status: 400 });
      }
      where.categoryType = categoryType;
    }
    if (!includeInactive || !isAdmin) {
      where.isActive = true;
      where.isPublished = true;
    }

    const records = await prisma.communityProfile.findMany({
      where,
      include: { images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
      orderBy: [{ categoryType: "asc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });

    const profiles = records.map(cleanProfileResponse);
    return NextResponse.json({
      success: true,
      profiles,
      records: profiles,
      profilesByCategory: groupProfiles(profiles),
      recordsBySection: groupProfiles(profiles),
      count: profiles.length,
    });
  } catch (error) {
    console.error("GET /api/alumni error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const formData = await req.formData();
    const name = (formData.get("name") || "").toString().trim();
    const categoryType = normalizeCategoryType(formData.get("categoryType") || formData.get("section"));

    if (!name || !categoryType) {
      return NextResponse.json(
        { success: false, error: "name and categoryType are required", authenticated: true },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.has(categoryType)) {
      return NextResponse.json(
        { success: false, error: "Invalid categoryType", authenticated: true },
        { status: 400 }
      );
    }

    const incomingFiles = [...formData.getAll("images"), formData.get("image")].filter(isFileUpload);
    const imageError = validateIncomingImages(incomingFiles);
    if (imageError) {
      return NextResponse.json({ success: false, error: imageError, authenticated: true }, { status: 400 });
    }

    const uploadedImages = await uploadSchoolImagesFromFormData(formData, "images", "community_profiles");
    const legacyImageFile = formData.get("image");
    if (isFileUpload(legacyImageFile)) {
      uploadedImages.push(...(await uploadSchoolImagesFromFormData(formData, "image", "community_profiles")));
    }

    const legacyImageUrl =
      typeof legacyImageFile === "string" && legacyImageFile.trim() ? legacyImageFile.trim() : null;
    const primaryImage = uploadedImages[0]?.url || legacyImageUrl || null;

    const profile = await prisma.$transaction(async (tx) => {
      if (categoryType === "CURRENT_PRINCIPAL") {
        await tx.communityProfile.updateMany({
          where: { categoryType: "CURRENT_PRINCIPAL" },
          data: { categoryType: "PAST_PRINCIPAL" },
        });
      }

      return tx.communityProfile.create({
        data: {
          name,
          position: (formData.get("position") || "").toString().trim() || null,
          description: (formData.get("description") || "").toString().trim() || null,
          categoryType,
          image: primaryImage,
          achievements: parseAchievements(formData.get("achievements")),
          yearsServed: (formData.get("yearsServed") || "").toString().trim() || null,
          displayOrder: parseInteger(formData.get("displayOrder"), 0),
          isActive: parseBoolean(formData.get("isActive"), true),
          isPublished: parseBoolean(formData.get("isPublished"), true),
          images: uploadedImages.length
            ? {
                create: uploadedImages.map((image, index) => ({
                  url: image.url,
                  publicId: image.publicId,
                  altText: image.altText || name,
                  caption: image.caption || null,
                  displayOrder: index,
                })),
              }
            : undefined,
        },
        include: { images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
      });
    });

    return NextResponse.json(
      { success: true, profile: cleanProfileResponse(profile), message: "Profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/alumni error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create profile", authenticated: true },
      { status: 500 }
    );
  }
}
