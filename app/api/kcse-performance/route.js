import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const defaultStats = {
  meanScore: 8.14,
  lastYearMean: 7.85,
  targetMean: 8.5,
  slogan: 'Committed to Excellence',
  sloganDescription: 'Every learner, every subject, every term moving with purpose.',
  sloganAuthor: 'Matungulu Girls Senior School',
};

const normalizeDocument = (document) => ({
  id: document.id,
  url: document.url,
  name: document.name || 'KCSE results.pdf',
  title: document.title || 'KCSE Results',
  size: document.size || null,
  uploadDate: document.uploadDate || null,
  description: document.description || 'Official KCSE performance document.',
  year: document.year || null,
  term: document.term || null,
  source: 'school-documents',
});

// Fetch KCSE document from schooldocuments API
const getKcseDocumentFromAPI = async () => {
  try {
    const schoolDocument = await prisma.schoolDocument.findFirst();

    if (!schoolDocument || !schoolDocument.kcseResultsPdf) {
      return [];
    }

    // Return only KCSE document from school documents
    return [
      normalizeDocument({
        id: `school-document-${schoolDocument.id}`,
        url: schoolDocument.kcseResultsPdf,
        name: schoolDocument.kcsePdfName || 'KCSE results.pdf',
        title: schoolDocument.kcseYear ? `${schoolDocument.kcseYear} KCSE Results` : 'Latest KCSE Results',
        size: schoolDocument.kcsePdfSize,
        uploadDate: schoolDocument.kcseUploadDate || schoolDocument.updatedAt,
        description: schoolDocument.kcseDescription || 'Official KCSE results document from the school.',
        year: schoolDocument.kcseYear,
        term: schoolDocument.kcseTerm,
      }),
    ];
  } catch (error) {
    console.warn('⚠️ KCSE document fetch failed:', error.message);
    return [];
  }
};

// Fetch school statistics
const getSchoolStats = async () => {
  try {
    const schoolStats = await prisma.schoolStats.findFirst();
    return schoolStats ? { ...defaultStats, ...schoolStats } : defaultStats;
  } catch (error) {
    console.warn('⚠️ School stats fetch failed:', error.message);
    return defaultStats;
  }
};

export async function GET() {
  try {
    const [documents, stats] = await Promise.all([
      getKcseDocumentFromAPI(),
      getSchoolStats(),
    ]);

    return NextResponse.json({
      success: true,
      stats: stats || defaultStats,
      documents: documents,
      latestDocument: documents[0] || null,
      generatedAt: new Date().toISOString(),
      message: documents.length === 0 ? 'No KCSE documents found' : `Found ${documents.length} KCSE document(s)`,
    });
  } catch (error) {
    console.error('❌ KCSE Performance API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch KCSE performance data',
        stats: defaultStats,
        documents: [],
      },
      { status: 500 }
    );
  }
}
