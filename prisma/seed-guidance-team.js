const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedGuidanceTeam() {
  try {
    console.log('🌱 Seeding Guidance and Counselling Team...');

    // Clear existing team members (optional - set to false if you want to keep existing data)
    const shouldClear = false; // Change to true to clear existing data
    
    if (shouldClear) {
      await prisma.teamMember.deleteMany({
        where: {
          category: 'guidance'
        }
      });
      console.log('✅ Cleared existing guidance team members');
    }

    // School contact details
    const schoolEmail = 'info@matungulugirlshs.com';
    const schoolPhone = '+254723123456'; // Update with actual school phone

    // Guidance Team Data
    const guidanceTeamData = [
      {
        name: 'Isabella Musyoka',
        role: 'guidanceTeacher',
        title: 'Head of Guidance and Counselling',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Dedicated guidance and counselling professional with extensive experience in student support and academic guidance.',
        gender: 'female',
        category: 'guidance',
        image: '/Matungulu/female.png'
      },
      {
        name: 'Madam Kanana',
        role: 'nurse',
        title: 'School Nurse',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Experienced nurse providing health and wellness support to all students. Available for medical consultations and health education.',
        gender: 'female',
        category: 'guidance',
        image: '/Matungulu/female.png'
      },
      {
        name: 'Carol Philip',
        role: 'boardingHod',
        title: 'Head of Boarding',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Experienced boarding administrator ensuring student safety, comfort and discipline in the boarding facility.',
        gender: 'female',
        category: 'guidance',
        image: '/Matungulu/female.png'
      }
    ];

    // NTS (Non-Teaching Staff) - Matron Group
    const ntsData = [
      {
        name: 'NTS - Matron',
        role: 'matron',
        title: 'Matron (Non-Teaching Staff)',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Matron responsible for overseeing student welfare, meals and general boarding house management.',
        gender: 'female',
        category: 'nts',
        image: '/Matungulu/female.png'
      },
      {
        name: 'Secretary',
        role: 'secretary',
        title: 'School Secretary',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Administrative support and secretarial services for school operations and management.',
        gender: 'female',
        category: 'nts',
        image: '/Matungulu/female.png'
      },
      {
        name: 'Accounts Clerk',
        role: 'accountsClerk',
        title: 'Accounts and Finance Clerk',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Manages school finance records, invoicing and financial documentation.',
        gender: 'female',
        category: 'nts',
        image: '/Matungulu/female.png'
      },
      {
        name: 'Bursar',
        role: 'bursar',
        title: 'School Bursar',
        phone: schoolPhone,
        email: schoolEmail,
        bio: 'Oversees all school financial matters, budgeting and resource management.',
        gender: 'female',
        category: 'nts',
        image: '/Matungulu/female.png'
      }
    ];

    // Combine all data
    const allTeamMembers = [...guidanceTeamData, ...ntsData];

    // Create or update team members
    let createdCount = 0;
    for (const member of allTeamMembers) {
      const existing = await prisma.teamMember.findFirst({
        where: {
          name: member.name
        }
      });

      if (existing && !shouldClear) {
        // Update existing member
        await prisma.teamMember.update({
          where: { id: existing.id },
          data: member
        });
        console.log(`✏️  Updated: ${member.name} (${member.role})`);
      } else {
        // Create new member
        await prisma.teamMember.create({
          data: member
        });
        console.log(`✅ Created: ${member.name} (${member.role})`);
        createdCount++;
      }
    }

    console.log(`\n✅ Guidance team seeding complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Guidance Team: ${guidanceTeamData.length} members`);
    console.log(`   - Non-Teaching Staff (NTS): ${ntsData.length} members`);
    console.log(`   - Total: ${allTeamMembers.length} team members`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedGuidanceTeam().catch((e) => {
  console.error(e);
  process.exit(1);
});
