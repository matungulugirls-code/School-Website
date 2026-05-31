require('dotenv').config({path:'.env.local'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.studentBulkUpload.findMany({take:1})
  .then(r => {
    console.log(JSON.stringify(r, null, 2));
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
