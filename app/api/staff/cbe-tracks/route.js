import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import {
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../libs/schoolContentUpload";

export const dynamic = "force-dynamic";

/**
 * GET /api/staff/cbe-tracks
 * Get all CBE tracks with their images and staff
 * Query params: pathwayId, type
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pathwayIdStr = searchParams.get("pathwayId");
    const type = searchParams.get("type");

    const where = {};

    if (pathwayIdStr) {
      where.pathwayId = parseInt(pathwayIdStr);
    }

    if (type) {
      where.type = type;
    }

    const tracks = await prisma.cBETrack.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        pathway: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
        staff: {
          where: { status: "active" },
          orderBy: [{ cbeRoleType: "asc" }, { name: "asc" }],
        },
        departments: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: tracks,
      count: tracks.length,
    });
  } catch (error) {
    console.error("Error fetching CBE tracks:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/staff/cbe-tracks
 * Create CBE track with images
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = (formData.get("name") || "").toString().trim();
    const type = (formData.get("type") || "").toString().trim();
    const pathwayIdStr = formData.get("pathwayId");
    const description = (formData.get("description") || "").toString().trim();

    if (!name || !type || !pathwayIdStr) {
      return NextResponse.json(
        { success: false, error: "Name, type, and pathway ID are required" },
        { status: 400 }
      );
    }

    const pathwayId = parseInt(pathwayIdStr);

    // Validate type
    const validTypes = ["APPLIED", "TECHNICAL", "PERFORMANCE", "HUMANITIES", "LANGUAGE_BUSINESS"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid track type" },
        { status: 400 }
      );
    }

    // Verify pathway exists
    const pathway = await prisma.cBEPathway.findUnique({
      where: { id: pathwayId },
    });

    if (!pathway) {
      return NextResponse.json(
        { success: false, error: "Pathway not found" },
        { status: 404 }
      );
    }

    // Get images
    const files = formData.getAll("images");

    let uploadedImages = [];
    if (files && files.length > 0) {
      if (files.length > 3) {
        return NextResponse.json(
          { success: false, error: "Maximum 3 images allowed per track" },
          { status: 400 }
        );
      }

      // Validate images
      for (const file of files.filter(isFileUpload)) {
        const validation = validateSchoolImage(file);
        if (!validation.valid) {
          return NextResponse.json(
            { success: false, error: validation.error },
            { status: 400 }
          );
        }
      }

      uploadedImages = await uploadSchoolImagesFromFormData(
        formData,
        "images",
        `cbe_tracks/${pathwayId}`
      );
    }

    const track = await prisma.cBETrack.create({
      data: {
        name,
        type,
        pathwayId,
        description: description || null,
        image: uploadedImages.length > 0 ? uploadedImages[0].url : null,
        images: uploadedImages.length
          ? {
              create: uploadedImages.map((image, index) => ({
                url: image.url,
                publicId: image.publicId,
                caption: `${name} - Image ${index + 1}`,
                altText: image.altText || name,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        pathway: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "CBE track created successfully",
        data: track,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating CBE track:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/staff/cbe-tracks
 * Update CBE track
 */
export async function PUT(req) {
  try {
    const formData = await req.formData();

    const trackIdStr = formData.get("trackId");
    const name = (formData.get("name") || "").toString().trim();
    const description = (formData.get("description") || "").toString().trim();

    if (!trackIdStr) {
      return NextResponse.json(
        { success: false, error: "Track ID is required" },
        { status: 400 }
      );
    }

    const trackId = parseInt(trackIdStr);

    const track = await prisma.cBETrack.findUnique({
      where: { id: trackId },
      include: { images: true },
    });

    if (!track) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 }
      );
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;

    // Handle new images
    const files = formData.getAll("images");
    if (files && files.length > 0) {
      if (files.length > 3) {
        return NextResponse.json(
          { success: false, error: "Maximum 3 images allowed" },
          { status: 400 }
        );
      }

      const totalImages = track.images.length + files.length;
      if (totalImages > 3) {
        return NextResponse.json(
          {
            success: false,
            error: `Already has ${track.images.length} images. Maximum total is 3.`,
          },
          { status: 400 }
        );
      }

      // Validate and upload
      for (const file of files.filter(isFileUpload)) {
        const validation = validateSchoolImage(file);
        if (!validation.valid) {
          return NextResponse.json(
            { success: false, error: validation.error },
            { status: 400 }
          );
        }
      }

      const uploadedImages = await uploadSchoolImagesFromFormData(
        formData,
        "images",
        `cbe_tracks/${track.pathwayId}`
      );

      updateData.images = {
        create: uploadedImages.map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          caption: `${name || track.name} - Image ${track.images.length + index + 1}`,
          altText: image.altText || name || track.name,
          displayOrder: track.images.length + index,
        })),
      };

      if (!updateData.image && uploadedImages.length > 0) {
        updateData.image = uploadedImages[0].url;
      }
    }

    const updated = await prisma.cBETrack.update({
      where: { id: trackId },
      data: updateData,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        pathway: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Track updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating track:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/cbe-tracks
 * Delete track image
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = parseInt(searchParams.get("imageId"));

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    await prisma.cBETrackImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
