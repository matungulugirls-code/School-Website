import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/staff/cbe
 * Get all staff members with CBE information (pathways and tracks)
 * Query params: pathwayType, trackType, roleType
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pathwayType = searchParams.get("pathwayType");
    const trackType = searchParams.get("trackType");
    const roleType = searchParams.get("roleType");

    const filters = {};

    if (pathwayType) {
      filters.cbePathway = { type: pathwayType };
    }

    if (trackType) {
      filters.cbeTrack = { type: trackType };
    }

    if (roleType) {
      filters.cbeRoleType = roleType;
    }

    const staff = await prisma.staff.findMany({
      where: filters,
      include: {
        cbePathway: true,
        cbeTrack: true,
        departmentRecord: {
          include: {
            images: {
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: [
        { cbeRoleType: "asc" }, // HOT first, then HOP, then TEACHER
        { name: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: staff,
      count: staff.length,
    });
  } catch (error) {
    console.error("Error fetching CBE staff:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/staff/cbe
 * Create or update staff member with CBE information
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      role,
      position,
      email,
      phone,
      cbePathwayId,
      cbeTrackId,
      cbeRoleType, // HOT, HOP, TEACHER
      image,
      department,
      subjectOffered,
      bio,
      gender,
      status,
      joinDate,
      education,
      experience,
    } = body;

    // Validate required fields
    if (!name || !cbeRoleType) {
      return NextResponse.json(
        { success: false, error: "Name and CBE role type are required" },
        { status: 400 }
      );
    }

    // Validate CBE role type
    const validRoles = ["HOT", "HOP", "TEACHER"];
    if (!validRoles.includes(cbeRoleType)) {
      return NextResponse.json(
        { success: false, error: `Invalid CBE role type. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // For HOT and HOP, at least one pathway/track must be specified
    if ((cbeRoleType === "HOT" || cbeRoleType === "HOP") && !cbePathwayId) {
      return NextResponse.json(
        { success: false, error: "HOT and HOP roles must have a CBE pathway assigned" },
        { status: 400 }
      );
    }

    let staff;

    if (id) {
      // Update existing
      staff = await prisma.staff.update({
        where: { id: parseInt(id) },
        data: {
          name,
          role,
          position,
          email,
          phone,
          cbePathwayId: cbePathwayId ? parseInt(cbePathwayId) : null,
          cbeTrackId: cbeTrackId ? parseInt(cbeTrackId) : null,
          cbeRoleType,
          image,
          department,
          subjectOffered,
          bio,
          gender,
          status,
          joinDate,
          education,
          experience,
        },
        include: {
          cbePathway: true,
          cbeTrack: true,
        },
      });
    } else {
      // Create new
      staff = await prisma.staff.create({
        data: {
          name,
          role,
          position,
          email,
          phone,
          cbePathwayId: cbePathwayId ? parseInt(cbePathwayId) : null,
          cbeTrackId: cbeTrackId ? parseInt(cbeTrackId) : null,
          cbeRoleType,
          image,
          department,
          subjectOffered,
          bio,
          gender,
          status,
          joinDate,
          education,
          experience,
        },
        include: {
          cbePathway: true,
          cbeTrack: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: id ? "Staff updated successfully" : "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Error creating/updating CBE staff:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/cbe/[id]
 * Delete a staff member
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required" },
        { status: 400 }
      );
    }

    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
