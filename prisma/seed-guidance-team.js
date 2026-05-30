const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CATEGORIES = {
  GUIDANCE: 'guidance',
  NTS: 'nts',
};

const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
};

const DEFAULT_IMAGES = {
  [GENDERS.MALE]: '/male.png',
  [GENDERS.FEMALE]: '/female.png',
};

const schoolContact = {
  email: 'matunguluguirls@gmail.com',
  phone: '+254723123456',
};

const guidanceTeamMembers = [
  {
    name: 'Isabella Musyoka',
    role: 'guidanceTeacher',
    title: 'Head of Guidance and Counselling',
    bio: 'Dedicated guidance and counselling professional with extensive experience in student support and academic guidance.',
    gender: GENDERS.FEMALE,
    category: CATEGORIES.GUIDANCE,
  },
  {
    name: 'Faith Njeri',
    role: 'careerCounsellor',
    title: 'Career Counsellor',
    bio: 'Provides career guidance, university application support, and personal counselling to students.',
    gender: GENDERS.FEMALE,
    category: CATEGORIES.GUIDANCE,
  },
  {
    name: 'David Mwangi',
    role: 'studentSupportOfficer',
    title: 'Student Support Officer',
    bio: 'Supports student wellbeing, academic interventions, and guidance programmes at the school.',
    gender: GENDERS.MALE,
    category: CATEGORIES.GUIDANCE,
  },
];

const nonTeachingDepartment = {
  name: 'Non Teaching',
  departmentCode: 'NT',
  description: 'Non-teaching staff department for administrative and support services.',
  image: '/female.png',
};

const nonTeachingStaff = [
  {
    name: 'Mary',
    role: 'secretary',
    position: 'School Secretary',
    bio: 'Administrative support and secretarial services for school operations and management.',
    gender: GENDERS.FEMALE,
    status: 'active',
  },
  {
    name: 'Winny',
    role: 'accountsClerk',
    position: 'Accounts and Finance Clerk',
    bio: 'Manages school finance records, invoicing and financial documentation.',
    gender: GENDERS.FEMALE,
    status: 'active',
  },
  {
    name: 'Kelvin',
    role: 'bursar',
    position: 'School Bursar',
    bio: 'Oversees all school financial matters, budgeting and resource management.',
    gender: GENDERS.MALE,
    status: 'active',
  },
];

async function seedGuidanceTeam() {
  try {
    console.log('🌱 Seeding Guidance and Counselling Team...');

    const shouldClear = false; // Set to true to clear existing guidance and NTS records before seeding

    if (shouldClear) {
      await prisma.teamMember.deleteMany({
        where: {
          category: CATEGORIES.GUIDANCE,
        },
      });
      console.log('✅ Cleared existing guidance team members');

      await prisma.staff.deleteMany({
        where: {
          department: 'Non Teaching',
        },
      });
      console.log('✅ Cleared existing non-teaching staff members');

      await prisma.staffDepartment.deleteMany({
        where: {
          name: 'Non Teaching',
        },
      });
      console.log('✅ Cleared existing Non Teaching department');
    }

    const preparedGuidanceMembers = guidanceTeamMembers.map((member) => ({
      ...member,
      phone: schoolContact.phone,
      email: schoolContact.email,
      image: member.image || DEFAULT_IMAGES[member.gender] || DEFAULT_IMAGES[GENDERS.FEMALE],
    }));

    let createdGuidance = 0;
    let updatedGuidance = 0;

    for (const member of preparedGuidanceMembers) {
      const existing = await prisma.teamMember.findFirst({
        where: { name: member.name },
      });

      if (existing && !shouldClear) {
        await prisma.teamMember.update({
          where: { id: existing.id },
          data: member,
        });
        console.log(`✏️  Updated guidance member: ${member.name}`);
        updatedGuidance += 1;
      } else {
        await prisma.teamMember.create({
          data: member,
        });
        console.log(`✅ Created guidance member: ${member.name}`);
        createdGuidance += 1;
      }
    }

    let department = await prisma.staffDepartment.findFirst({
      where: { name: nonTeachingDepartment.name },
    });

    if (!department) {
      department = await prisma.staffDepartment.create({
        data: {
          name: nonTeachingDepartment.name,
          category: 'SUPPORT',
          description: nonTeachingDepartment.description,
          image: nonTeachingDepartment.image,
        },
      });
      console.log(`✅ Created department: ${department.name}`);
    } else {
      department = await prisma.staffDepartment.update({
        where: { id: department.id },
        data: {
          description: nonTeachingDepartment.description,
          image: nonTeachingDepartment.image,
          category: 'SUPPORT',
        },
      });
      console.log(`✏️  Updated department: ${department.name}`);
    }

    let createdStaff = 0;
    let updatedStaff = 0;

    for (const staff of nonTeachingStaff) {
      const existingStaff = await prisma.staff.findFirst({
        where: { name: staff.name },
      });

      const staffData = {
        ...staff,
        phone: schoolContact.phone,
        email: schoolContact.email,
        image: staff.image || DEFAULT_IMAGES[staff.gender] || DEFAULT_IMAGES[GENDERS.FEMALE],
        department: department.name,
        departmentRecord: {
          connect: { id: department.id },
        },
      };

      if (existingStaff && !shouldClear) {
        await prisma.staff.update({
          where: { id: existingStaff.id },
          data: staffData,
        });
        console.log(`✏️  Updated non-teaching staff: ${staff.name}`);
        updatedStaff += 1;
      } else {
        await prisma.staff.create({
          data: staffData,
        });
        console.log(`✅ Created non-teaching staff: ${staff.name}`);
        createdStaff += 1;
      }
    }

    const guidanceCount = preparedGuidanceMembers.length;
    const ntsCount = nonTeachingStaff.length;

    console.log('\n✅ Seeding complete!');
    console.log('📊 Summary:');
    console.log(`   - Guidance Team: ${guidanceCount} members`);
    console.log(`   - Non Teaching Department: 1 department`);
    console.log(`   - Non Teaching Staff: ${ntsCount} members`);
    console.log(`   - Guidance Created: ${createdGuidance}`);
    console.log(`   - Guidance Updated: ${updatedGuidance}`);
    console.log(`   - Staff Created: ${createdStaff}`);
    console.log(`   - Staff Updated: ${updatedStaff}`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedGuidanceTeam().catch((e) => {
  console.error(e);
  process.exit(1);
});
