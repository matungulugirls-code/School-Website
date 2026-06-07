import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import {
  SCHOOL_HUB_MAX_IMAGES,
  deleteSchoolImages,
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../libs/schoolContentUpload";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = new Set(["ALUMNI", "BOM", "CURRENT_PRINCIPAL", "PAST_PRINCIPAL"]);

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

      if (!adminToken) return { valid: false, message: "Admin token is required" };
      if (!deviceToken) return { valid: false, message: "Device token is required" };
      if (adminToken.split(".").length !== 3) {
        return { valid: false, message: "Invalid admin token format" };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { valid: false, message: `Device token ${deviceValid.reason}: ${deviceValid.error || ""}` };
      }

      let adminPayload;
      try {
        adminPayload = decodeJwtPayload(adminToken);
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp && adminPayload.exp < currentTime) {
          return { valid: false, message: "Admin token has expired" };
        }

        const userRole = adminPayload.role || adminPayload.userRole || "";
        const validRoles = ["ADMIN", "SUPER_ADMIN", "ADMINISTRATOR", "PRINCIPAL", "TEACHER", "STAFF"];
        if (!validRoles.includes(userRole.toUpperCase())) {
          return { valid: false, message: "User does not have permission to manage profiles" };
        }
      } catch {
        return { valid: false, message: "Invalid admin token" };
      }

      return {
        valid: true,
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole,
        },
      };
    } catch (error) {
      return { valid: false, message: error.message || "Authentication failed" };
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

const cleanProfileResponse = (profile) =>
  profile
    ? {
        ...profile,
        achievements: Array.isArray(profile.achievements) ? profile.achievements : parseAchievements(profile.achievements),
        images: normalizeProfileImages(profile),
      }
    : null;

const parseRemovalList = (formData) => {
  const values = formData.getAll("imagesToRemove");
  const urls = [];

  values.forEach((value) => {
    const text = value?.toString?.() || "";
    if (!text) return;
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) urls.push(...parsed);
      else urls.push(text);
    } catch {
      urls.push(text);
    }
  });

  return [...new Set(urls.filter(Boolean))];
};

const validateIncomingImages = (incomingFiles, existingCount = 0) => {
  if (existingCount + incomingFiles.length > SCHOOL_HUB_MAX_IMAGES) {
    return `A profile can have up to ${SCHOOL_HUB_MAX_IMAGES} images. Remove older images before adding more.`;
  }

  for (const file of incomingFiles) {
    const validation = validateSchoolImage(file);
    if (!validation.valid) return validation.error;
  }

  return "";
};

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
        req.headers.get("x-admin-token") ||
        req.headers.get("authorization")?.replace("Bearer ", "");
      const maybeDeviceToken = req.headers.get("x-device-token");
      if (maybeAdminToken && maybeDeviceToken) {
        isAdmin = DeviceTokenManager.validateTokensFromHeaders(req.headers).valid;
      }
    }

    const profile = await prisma.communityProfile.findUnique({
      where: { id },
      include: { images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
    });

    if (!profile || ((!profile.isActive || !profile.isPublished) && !isAdmin)) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: cleanProfileResponse(profile) });
  } catch (error) {
    console.error("GET /api/alumni/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ success: false, error: "Invalid id", authenticated: true }, { status: 400 });
    }

    const existing = await prisma.communityProfile.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Profile not found", authenticated: true }, { status: 404 });
    }

    const formData = await req.formData();
    const data = {};

    const name = formData.get("name");
    if (name !== null) {
      const trimmed = name.toString().trim();
      if (!trimmed) {
        return NextResponse.json({ success: false, error: "name cannot be empty", authenticated: true }, { status: 400 });
      }
      data.name = trimmed;
    }

    const categoryType = formData.get("categoryType");
    if (categoryType !== null) {
      const category = categoryType.toString().trim();
      if (!VALID_CATEGORIES.has(category)) {
        return NextResponse.json({ success: false, error: "Invalid categoryType", authenticated: true }, { status: 400 });
      }
      data.categoryType = category;
    }

    const textFields = ["position", "description", "yearsServed"];
    textFields.forEach((field) => {
      if (formData.get(field) !== null) data[field] = formData.get(field).toString().trim() || null;
    });

    if (formData.get("achievements") !== null) data.achievements = parseAchievements(formData.get("achievements"));
    if (formData.get("displayOrder") !== null) data.displayOrder = parseInteger(formData.get("displayOrder"), 0);
    if (formData.get("isActive") !== null) data.isActive = parseBoolean(formData.get("isActive"), true);
    if (formData.get("isPublished") !== null) data.isPublished = parseBoolean(formData.get("isPublished"), true);

    const imagesToRemove = parseRemovalList(formData);
    const matchingImagesToRemove = existing.images.filter((image) => imagesToRemove.includes(image.url));
    const remainingImages = existing.images.filter(
      (image) => !matchingImagesToRemove.some((removed) => removed.id === image.id)
    );
    const incomingFiles = [...formData.getAll("images"), formData.get("image")].filter(isFileUpload);
    const imageError = validateIncomingImages(incomingFiles, remainingImages.length);
    if (imageError) {
      return NextResponse.json({ success: false, error: imageError, authenticated: true }, { status: 400 });
    }

    const legacyImageFile = formData.get("image");
    const uploadedImages = await uploadSchoolImagesFromFormData(formData, "images", "community_profiles");
    if (isFileUpload(legacyImageFile)) {
      uploadedImages.push(...(await uploadSchoolImagesFromFormData(formData, "image", "community_profiles")));
    } else if (typeof legacyImageFile === "string" && legacyImageFile.trim()) {
      data.image = legacyImageFile.trim();
    }

    const updatedProfile = await prisma.$transaction(async (tx) => {
      if (data.categoryType === "CURRENT_PRINCIPAL") {
        await tx.communityProfile.updateMany({
          where: { categoryType: "CURRENT_PRINCIPAL", id: { not: id } },
          data: { categoryType: "PAST_PRINCIPAL" },
        });
      }

      if (matchingImagesToRemove.length > 0) {
        await tx.communityProfileImage.deleteMany({
          where: { id: { in: matchingImagesToRemove.map((image) => image.id) } },
        });
      }

      if (existing.image && imagesToRemove.includes(existing.image)) {
        data.image = null;
      }

      if (uploadedImages.length > 0) {
        await tx.communityProfileImage.createMany({
          data: uploadedImages.map((image, index) => ({
            communityProfileId: id,
            url: image.url,
            publicId: image.publicId,
            altText: image.altText || data.name || existing.name,
            caption: image.caption || null,
            displayOrder: remainingImages.length + index,
          })),
        });

        data.image = data.image || uploadedImages[0].url;
      }

      if (!data.image && (matchingImagesToRemove.length > 0 || uploadedImages.length > 0)) {
        data.image = remainingImages[0]?.url || uploadedImages[0]?.url || null;
      }

      return tx.communityProfile.update({
        where: { id },
        data,
        include: { images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] } },
      });
    });

    await deleteSchoolImages([...matchingImagesToRemove, existing.image && imagesToRemove.includes(existing.image) ? existing.image : null].filter(Boolean));

    return NextResponse.json({
      success: true,
      profile: cleanProfileResponse(updatedProfile),
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/alumni/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile", authenticated: true },
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
      return NextResponse.json({ success: false, error: "Invalid id", authenticated: true }, { status: 400 });
    }

    const existing = await prisma.communityProfile.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Profile not found", authenticated: true }, { status: 404 });
    }

    await prisma.communityProfile.delete({ where: { id } });
    await deleteSchoolImages([...(existing.images || []), existing.image].filter(Boolean));

    return NextResponse.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/alumni/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete profile", authenticated: true },
      { status: 500 }
    );
  }
}
