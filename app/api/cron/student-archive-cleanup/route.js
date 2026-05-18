import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma';

export const dynamic = 'force-dynamic';

const isAuthorizedCleanupRequest = (request) => {
  const cronSecret = process.env.CRON_SECRET || process.env.STUDENT_ARCHIVE_CLEANUP_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  const authHeader = request.headers.get('authorization') || '';
  const headerSecret = request.headers.get('x-cron-secret') || '';

  return authHeader === `Bearer ${cronSecret}` || headerSecret === cronSecret;
};

const cleanupExpiredArchives = async () => {
  const result = await prisma.archivedStudentPortalCredential.deleteMany({
    where: {
      expiresAt: { lte: new Date() }
    }
  });

  return result?.count || 0;
};

export async function GET(request) {
  if (!isAuthorizedCleanupRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized cleanup request' },
      { status: 401 }
    );
  }

  const deletedCount = await cleanupExpiredArchives();

  return NextResponse.json({
    success: true,
    deletedCount,
    message: `Deleted ${deletedCount} expired archived student credential record${deletedCount === 1 ? '' : 's'}.`
  });
}

export async function POST(request) {
  return GET(request);
}
