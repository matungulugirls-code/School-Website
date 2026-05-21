import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
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

const examResultsDirectory = path.join(process.cwd(), 'public', 'infomation', 'pdfs', 'exam-results');
const publicExamResultsPath = '/infomation/pdfs/exam-results';
const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);

const titleCase = (value) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const upperWord = word.toUpperCase();
      if (['KCSE', 'PDF', 'DOC', 'DOCX'].includes(upperWord)) return upperWord;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

const cleanFileTitle = (fileName) => {
  const extension = path.extname(fileName);
  const withoutExtension = fileName.slice(0, -extension.length);
  const withoutTimestamp = withoutExtension.replace(/^\d+[_-]?/, '');
  const cleaned = withoutTimestamp
    .replace(/kcse/gi, 'KCSE')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return titleCase(cleaned || 'KCSE Results');
};

const extractYear = (fileName, fallbackDate) => {
  const explicitYear = fileName.match(/(?:^|[^0-9])(20\d{2})(?:[^0-9]|$)/);
  if (explicitYear) return Number(explicitYear[1]);

  const timestamp = fileName.match(/^(\d{12,})/);
  if (timestamp) {
    const date = new Date(Number(timestamp[1]));
    if (!Number.isNaN(date.getTime())) return date.getFullYear();
  }

  return fallbackDate ? new Date(fallbackDate).getFullYear() : null;
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
  source: document.source || 'school-documents',
});

const getLocalKcseDocuments = async () => {
  try {
    const entries = await readdir(examResultsDirectory);
    const kcseFiles = entries.filter((fileName) => {
      const extension = path.extname(fileName).toLowerCase();
      return allowedExtensions.has(extension) && fileName.toLowerCase().includes('kcse');
    });

    const documents = await Promise.all(
      kcseFiles.map(async (fileName) => {
        const filePath = path.join(examResultsDirectory, fileName);
        const fileStat = await stat(filePath);
        const uploadDate = fileStat.mtime?.toISOString();

        return normalizeDocument({
          id: `local-${fileName}`,
          url: `${publicExamResultsPath}/${encodeURIComponent(fileName)}`,
          name: fileName,
          title: cleanFileTitle(fileName),
          size: fileStat.size,
          uploadDate,
          description: 'KCSE archive file available from the school public results folder.',
          year: extractYear(fileName, uploadDate),
          term: null,
          source: 'local-archive',
        });
      })
    );

    return documents;
  } catch (error) {
    console.warn('KCSE local archive scan failed:', error.message);
    return [];
  }
};

const getSchoolDocumentData = async () => {
  try {
    const [schoolDocument, schoolStats] = await Promise.all([
      prisma.schoolDocument.findFirst(),
      prisma.schoolStats.findFirst(),
    ]);

    const databaseDocuments = schoolDocument?.kcseResultsPdf
      ? [
          normalizeDocument({
            id: `school-document-${schoolDocument.id}`,
            url: schoolDocument.kcseResultsPdf,
            name: schoolDocument.kcsePdfName || 'KCSE results.pdf',
            title: schoolDocument.kcseYear ? `${schoolDocument.kcseYear} KCSE Results` : 'Latest KCSE Results',
            size: schoolDocument.kcsePdfSize,
            uploadDate: schoolDocument.kcseUploadDate || schoolDocument.updatedAt,
            description: schoolDocument.kcseDescription || 'Latest official KCSE results document.',
            year: schoolDocument.kcseYear,
            term: schoolDocument.kcseTerm,
            source: 'school-documents',
          }),
        ]
      : [];

    return {
      stats: schoolStats ? { ...defaultStats, ...schoolStats } : defaultStats,
      documents: databaseDocuments,
    };
  } catch (error) {
    console.warn('KCSE database lookup failed:', error.message);
    return {
      stats: defaultStats,
      documents: [],
    };
  }
};

export async function GET() {
  const [schoolData, localDocuments] = await Promise.all([
    getSchoolDocumentData(),
    getLocalKcseDocuments(),
  ]);

  const seenUrls = new Set();
  const documents = [...schoolData.documents, ...localDocuments]
    .filter((document) => {
      if (!document?.url || seenUrls.has(document.url)) return false;
      seenUrls.add(document.url);
      return true;
    })
    .sort((a, b) => {
      const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
      const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
      return dateB - dateA;
    });

  return NextResponse.json({
    success: true,
    stats: schoolData.stats || defaultStats,
    documents,
    latestDocument: documents[0] || null,
    generatedAt: new Date().toISOString(),
  });
}
