import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/cbe
 * Get all CBE pathways with their tracks
 */
export async function GET(req) {
  try {
    const pathways = await prisma.cBEPathway.findMany({
      where: { isActive: true },
      include: {
        tracks: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: pathways,
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
 * POST /api/cbe/seed
 * Seed initial CBE pathways and tracks
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "seed") {
      // Clear existing data
      await prisma.cBETrack.deleteMany({});
      await prisma.cBEPathway.deleteMany({});

      // Seed CBE Pathways
      const stem = await prisma.cBEPathway.create({
        data: {
          name: "Science, Technology, Engineering & Mathematics",
          type: "STEM",
          description:
            "Pathway for science, technology, engineering and mathematics excellence",
          displayOrder: 1,
          isActive: true,
          tracks: {
            create: [
              {
                name: "Applied STEM",
                type: "APPLIED",
                description: "Applied science and technology focus",
                displayOrder: 1,
                isActive: true,
              },
              {
                name: "Technical STEM",
                type: "TECHNICAL",
                description: "Technical engineering and mechanics focus",
                displayOrder: 2,
                isActive: true,
              },
            ],
          },
        },
        include: { tracks: true },
      });

      const arts = await prisma.cBEPathway.create({
        data: {
          name: "Arts & Sport Science",
          type: "ARTS_SPORT_SCIENCE",
          description: "Creative arts, performing arts and athletic excellence",
          displayOrder: 2,
          isActive: true,
          tracks: {
            create: [
              {
                name: "Performance Arts",
                type: "PERFORMANCE",
                description: "Performing arts and music focus",
                displayOrder: 1,
                isActive: true,
              },
              {
                name: "Visual & Sport Arts",
                type: "TECHNICAL",
                description: "Visual arts and sports focus",
                displayOrder: 2,
                isActive: true,
              },
            ],
          },
        },
        include: { tracks: true },
      });

      const social = await prisma.cBEPathway.create({
        data: {
          name: "Social Sciences",
          type: "SOCIAL_SCIENCES",
          description: "Humanities, languages, and civic education",
          displayOrder: 3,
          isActive: true,
          tracks: {
            create: [
              {
                name: "Humanities Track",
                type: "HUMANITIES",
                description: "History, literature, and social studies focus",
                displayOrder: 1,
                isActive: true,
              },
              {
                name: "Language & Business Track",
                type: "LANGUAGE_BUSINESS",
                description: "Languages, business studies and commerce",
                displayOrder: 2,
                isActive: true,
              },
            ],
          },
        },
        include: { tracks: true },
      });

      return NextResponse.json({
        success: true,
        message: "CBE structure seeded successfully",
        data: { stem, arts, social },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error seeding CBE data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
