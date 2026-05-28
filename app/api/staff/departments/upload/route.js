import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma";
import cloudinary from "../../../../../libs/cloudinary";

export const dynamic = "force-dynamic";

/**
 * POST /api/staff/departments/upload-images
 * Upload 1-3 images for a CBE department
 * Accepts multipart/form-data with:
 * - departmentId: int
 * - images: File[] (1-3 files)
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const departmentId = parseInt(formData.get("departmentId"));
    const files = formData.getAll("images");

    if (!departmentId) {
      return NextResponse.json(
        { success: false, error: "Department ID is required" },
        { status: 400 }
      );
    }

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

    // Verify department exists and get current image count
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

    const totalImages = department.images.length + files.length;
    if (totalImages > 3) {
      return NextResponse.json(
        { success: false, error: `Department already has ${department.images.length} images. Maximum total is 3.` },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    // Upload each file to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const dataURI = `data:${file.type};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: `matungulu/departments/${departmentId}`,
        resource_type: "auto",
        public_id: `image_${Date.now()}_${i}`,
      });

      // Create database record
      const imageRecord = await prisma.staffDepartmentImage.create({
        data: {
          staffDepartmentId: departmentId,
          url: result.secure_url,
          publicId: result.public_id,
          caption: `Department image ${department.images.length + i + 1}`,
          displayOrder: department.images.length + i,
        },
      });

      uploadedImages.push(imageRecord);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading department images:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/departments/delete-image
 * Delete a specific department image
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
    console.error("Error deleting department image:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
