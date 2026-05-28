import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma";
import cloudinary from "../../../../../libs/cloudinary";
import {
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../../libs/schoolContentUpload";

export const dynamic = "force-dynamic";

/**
 * GET /api/staff/departments/cbe
 * Get all CBE departments with their pathways and tracks
 * Query params: pathwayType, trackType
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pathwayType = searchParams.get("pathwayType");
    const trackType = searchParams.get("trackType");

    const where = { category: "CBE" };

    if (pathwayType) {
      where.cbePathway = { type: pathwayType };
    }

    if (trackType) {
      where.cbeTrack = { type: trackType };
    }

    const departments = await prisma.staffDepartment.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        cbePathway: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            tracks: {
              include: {
                images: { orderBy: { displayOrder: "asc" } },
              },
              orderBy: { displayOrder: "asc" },
            },
          },
        },
        cbeTrack: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            pathway: {
              include: {
                images: { orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
        teachers: {
          where: { status: "active" },
          include: {
            cbePathway: true,
            cbeTrack: true,
          },
          orderBy: [{ cbeRoleType: "asc" }, { name: "asc" }],
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: departments,
      count: departments.length,
    });
  } catch (error) {
    console.error("Error fetching CBE departments:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/staff/departments/cbe
 * Create or update CBE department with 1-3 images per pathway/track
 * 
 * Required fields:
 * - departmentName: string
 * - pathwayId: int
 * - trackId: int (optional)
 * - images: File[] (1-3 files for the department)
 * - headName: string (HOT - Head of Track)
 * - coHeadName: string (HOP - Head of Pathway, optional)
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const departmentName = (formData.get("departmentName") || "").toString().trim();
    const pathwayIdStr = formData.get("pathwayId");
    const trackIdStr = formData.get("trackId");
    const headName = (formData.get("headName") || "").toString().trim(); // HOT
    const coHeadName = (formData.get("coHeadName") || "").toString().trim(); // HOP
    const description = (formData.get("description") || "").toString().trim();

    if (!departmentName || !pathwayIdStr) {
      return NextResponse.json(
        { success: false, error: "Department name and pathway ID are required" },
        { status: 400 }
      );
    }

    const pathwayId = parseInt(pathwayIdStr);
    const trackId = trackIdStr ? parseInt(trackIdStr) : null;

    if (!Number.isFinite(pathwayId)) {
      return NextResponse.json(
        { success: false, error: "Invalid pathway ID" },
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

    // Verify track exists if provided
    let track = null;
    if (trackId) {
      track = await prisma.cBETrack.findUnique({
        where: { id: trackId },
      });

      if (!track || track.pathwayId !== pathwayId) {
        return NextResponse.json(
          { success: false, error: "Track not found or doesn't belong to this pathway" },
          { status: 404 }
        );
      }
    }

    // Get images
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (files.length > 3) {
      return NextResponse.json(
        { success: false, error: "Maximum 3 images allowed per department" },
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

    // Upload images
    const uploadedImages = await uploadSchoolImagesFromFormData(
      formData,
      "images",
      `cbe_departments/${pathwayId}`
    );

    if (!uploadedImages || uploadedImages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to upload images" },
        { status: 400 }
      );
    }

    // Create or update department
    const departmentData = {
      name: departmentName,
      category: "CBE",
      description: description || null,
      headName: headName || null,
      assistantHeadName: coHeadName || null,
      cbePathwayId: pathwayId,
      cbeTrackId: trackId,
      displayOrder: 0,
      isActive: true,
      image: uploadedImages[0]?.url || null,
      images: {
        create: uploadedImages.map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          caption: `${departmentName} - Image ${index + 1}`,
          altText: image.altText || departmentName,
          displayOrder: index,
        })),
      },
    };

    const department = await prisma.staffDepartment.create({
      data: departmentData,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        cbePathway: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            tracks: {
              include: {
                images: { orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
        cbeTrack: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
        teachers: {
          include: {
            cbePathway: true,
            cbeTrack: true,
          },
          orderBy: [{ cbeRoleType: "asc" }, { name: "asc" }],
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `CBE department created successfully with ${uploadedImages.length} image(s)`,
        data: department,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating CBE department:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/staff/departments/cbe
 * Update CBE department
 */
export async function PUT(req) {
  try {
    const formData = await req.formData();

    const departmentIdStr = formData.get("departmentId");
    const departmentName = (formData.get("departmentName") || "").toString().trim();
    const headName = (formData.get("headName") || "").toString().trim();
    const coHeadName = (formData.get("coHeadName") || "").toString().trim();
    const description = (formData.get("description") || "").toString().trim();

    if (!departmentIdStr) {
      return NextResponse.json(
        { success: false, error: "Department ID is required" },
        { status: 400 }
      );
    }

    const departmentId = parseInt(departmentIdStr);

    // Verify department exists
    const department = await prisma.staffDepartment.findUnique({
      where: { id: departmentId },
      include: { images: true },
    });

    if (!department) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      );
    }

    const updateData = {};

    if (departmentName) updateData.name = departmentName;
    if (description) updateData.description = description;
    if (headName) updateData.headName = headName;
    if (coHeadName) updateData.assistantHeadName = coHeadName;

    // Handle new images
    const files = formData.getAll("images");
    if (files && files.length > 0) {
      if (files.length > 3) {
        return NextResponse.json(
          { success: false, error: "Maximum 3 images allowed per department" },
          { status: 400 }
        );
      }

      const totalImages = department.images.length + files.length;
      if (totalImages > 3) {
        return NextResponse.json(
          {
            success: false,
            error: `Department already has ${department.images.length} images. Maximum total is 3.`,
          },
          { status: 400 }
        );
      }

      // Validate and upload images
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
        `cbe_departments/${departmentId}`
      );

      updateData.images = {
        create: uploadedImages.map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          caption: `${departmentName || department.name} - Image ${
            department.images.length + index + 1
          }`,
          altText: image.altText || departmentName || department.name,
          displayOrder: department.images.length + index,
        })),
      };

      if (!updateData.image && uploadedImages.length > 0) {
        updateData.image = uploadedImages[0].url;
      }
    }

    const updated = await prisma.staffDepartment.update({
      where: { id: departmentId },
      data: updateData,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        cbePathway: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            tracks: {
              include: {
                images: { orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
        cbeTrack: {
          include: {
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
        teachers: {
          include: {
            cbePathway: true,
            cbeTrack: true,
          },
          orderBy: [{ cbeRoleType: "asc" }, { name: "asc" }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "CBE department updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating CBE department:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/departments/cbe
 * Delete CBE department image
 * Query params: imageId, publicId
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = parseInt(searchParams.get("imageId"));
    const publicId = searchParams.get("publicId");

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete from database
    await prisma.staffDepartmentImage.delete({
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
