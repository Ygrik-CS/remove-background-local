import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { execFile } from 'child_process';
import { randomUUID } from 'crypto';
import { promisify } from 'util';
import os from 'os';
import path from 'path';
import sharp from 'sharp';

export const runtime = 'nodejs';
const execFileAsync = promisify(execFile);

const runRembg = (inputPath, outputPath) =>
  execFileAsync(
    process.env.REMBG_CLI || 'rembg',
    ['i', inputPath, outputPath],
    { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
  );

  const safeUnlink = (filePath) => fs.unlink(filePath).catch(() => {});

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('image');
  const format = formData.get('format') || 'webp';

  
  const inputPath = path.join(os.tmpdir(), `rembg-input-${randomUUID()}`);
  const outputPath = path.join(os.tmpdir(), `rembg-output-${randomUUID()}.png`);

  try {
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

    await runRembg(inputPath, outputPath);

    const pngBuffer = await fs.readFile(outputPath);
    let finalBuffer;
    let mimeType;

    if (format === 'jpeg' || format === 'jpg') {
      finalBuffer = await sharp(pngBuffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 90 })
        .toBuffer();
      mimeType = 'image/jpeg';
    } else if (format === 'png') {
      finalBuffer = pngBuffer;
      mimeType = 'image/png';
    } else {
      finalBuffer = await sharp(pngBuffer).webp().toBuffer();
      mimeType = 'image/webp';
    }

    const base64Image = `data:${mimeType};base64,${finalBuffer.toString('base64')}`;

    return NextResponse.json({ 
      success: true, 
      resultUrl: base64Image, 
      format: format === 'jpg' ? 'jpeg' : format 
    });

  } catch (error) {
    console.error('Background removal failed:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обработки. Убедитесь, что rembg установлен и доступен в PATH.' },
      { status: 500 }
    );
  } finally {
    await Promise.all([safeUnlink(inputPath), safeUnlink(outputPath)]);
  }
}