const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCBE() {
  try {
    console.log('🌱 Seeding CBE pathways and tracks...');

    // Clear existing data
    await prisma.CBETrack.deleteMany({});
    await prisma.CBEPathway.deleteMany({});

    // Seed CBE Pathways
    const stem = await prisma.CBEPathway.create({
      data: {
        name: "Science, Technology, Engineering & Mathematics",
        type: "STEM",
        description: "Pathway for science, technology, engineering and mathematics excellence",
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

    const arts = await prisma.CBEPathway.create({
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

    const social = await prisma.CBEPathway.create({
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

    console.log('✅ STEM pathway created:', stem.name);
    console.log('✅ Arts & Sport Science pathway created:', arts.name);
    console.log('✅ Social Sciences pathway created:', social.name);
    console.log('\n🎉 CBE structure seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding CBE data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCBE();
