import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import {
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../libs/schoolContentUpload";

export const dynamic = "force-dynamic";

/**
 * GET /api/staff/cbe-pathways
 * Get all CBE pathways with their tracks and images
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const where = type ? { type } : {};

    const pathways = await prisma.cBEPathway.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        tracks: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
          orderBy: { displayOrder: "asc" },
        },
        staff: {
          where: { status: "active" },
          include: {
            cbeTrack: true,
          },
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
      data: pathways,
      count: pathways.length,
    });
  } catch (error) {
    console.error("Error fetching CBE pathways:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/staff/cbe-pathways
 * Create CBE pathway with images
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = (formData.get("name") || "").toString().trim();
    const type = (formData.get("type") || "").toString().trim();
    const description = (formData.get("description") || "").toString().trim();

    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: "Name and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ["STEM", "ARTS_SPORT_SCIENCE", "SOCIAL_SCIENCES"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid pathway type" },
        { status: 400 }
      );
    }

    // Get images
    const files = formData.getAll("images");

    let uploadedImages = [];
    if (files && files.length > 0) {
      if (files.length > 3) {
        return NextResponse.json(
          { success: false, error: "Maximum 3 images allowed per pathway" },
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
        "cbe_pathways"
      );
    }

    const pathway = await prisma.cBEPathway.create({
      data: {
        name,
        type,
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
        tracks: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "CBE pathway created successfully",
        data: pathway,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating CBE pathway:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/staff/cbe-pathways
 * Update CBE pathway
 */
export async function PUT(req) {
  try {
    const formData = await req.formData();

    const pathwayIdStr = formData.get("pathwayId");
    const name = (formData.get("name") || "").toString().trim();
    const description = (formData.get("description") || "").toString().trim();

    if (!pathwayIdStr) {
      return NextResponse.json(
        { success: false, error: "Pathway ID is required" },
        { status: 400 }
      );
    }

    const pathwayId = parseInt(pathwayIdStr);

    const pathway = await prisma.cBEPathway.findUnique({
      where: { id: pathwayId },
      include: { images: true },
    });

    if (!pathway) {
      return NextResponse.json(
        { success: false, error: "Pathway not found" },
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

      const totalImages = pathway.images.length + files.length;
      if (totalImages > 3) {
        return NextResponse.json(
          {
            success: false,
            error: `Already has ${pathway.images.length} images. Maximum total is 3.`,
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
        "cbe_pathways"
      );

      updateData.images = {
        create: uploadedImages.map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          caption: `${name || pathway.name} - Image ${pathway.images.length + index + 1}`,
          altText: image.altText || name || pathway.name,
          displayOrder: pathway.images.length + index,
        })),
      };

      if (!updateData.image && uploadedImages.length > 0) {
        updateData.image = uploadedImages[0].url;
      }
    }

    const updated = await prisma.cBEPathway.update({
      where: { id: pathwayId },
      data: updateData,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        tracks: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pathway updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating pathway:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/cbe-pathways
 * Delete pathway image
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

    await prisma.cBEPathwayImage.delete({
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
