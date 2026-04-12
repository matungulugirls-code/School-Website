import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const unisDir = path.join(process.cwd(), 'public', 'unis');
    const files = fs.readdirSync(unisDir);
    const images = files
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => `/unis/${f}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
