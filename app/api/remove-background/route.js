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
const pythonCommand = process.env.REMBG_PYTHON || 'python';
const rembgCliCommand = process.env.REMBG_CLI || 'rembg';

const runRembgModule = (command, inputPath, outputPath) =>
  execFileAsync(
    command,
    ['-m', 'rembg.cli', 'i', inputPath, outputPath],
    { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
  );

const runRembgCli = (command, inputPath, outputPath) =>
  execFileAsync(
    command,
    ['i', inputPath, outputPath],
    { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
  );

const safeUnlink = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.warn('Failed to remove temp file:', filePath, error);
    }
  }
};

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('image');

  if (!file || typeof file === 'string') {
    return NextResponse.json(
      { success: false, error: 'Image file is required.' },
      { status: 400 }
    );
  }

  const inputPath = path.join(os.tmpdir(), `rembg-input-${randomUUID()}`);
  const outputPath = path.join(os.tmpdir(), `rembg-output-${randomUUID()}.png`);

  try {
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(inputPath, Buffer.from(arrayBuffer));

    try {
      await runRembgCli(rembgCliCommand, inputPath, outputPath);
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }

      try {
        await runRembgModule(pythonCommand, inputPath, outputPath);
      } catch (fallbackError) {
        if (fallbackError?.code === 'ENOENT' && pythonCommand === 'python') {
          await runRembgModule('py', inputPath, outputPath);
        } else {
          throw fallbackError;
        }
      }
    }

    const pngBuffer = await fs.readFile(outputPath);
    const webpBuffer = await sharp(pngBuffer).webp().toBuffer();
    const base64Image = `data:image/webp;base64,${webpBuffer.toString('base64')}`;

    return NextResponse.json({ success: true, resultUrl: base64Image });
  } catch (error) {
    const stderr = error?.stderr ? error.stderr.toString().trim() : '';
    const details = stderr ? stderr.slice(0, 500) : '';
    const message =
      error?.code === 'ENOENT'
        ? 'Python/rembg not found. Install rembg, add Python Scripts to PATH, or set REMBG_CLI/REMBG_PYTHON.'
        : details
          ? `rembg error: ${details}`
          : 'Background removal failed.';
    console.error('Background removal failed:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  } finally {
    await Promise.all([safeUnlink(inputPath), safeUnlink(outputPath)]);
  }
}
