import * as fs from 'fs';
import * as path from 'path';
import { loadChapters } from './chapters';
import { generatePdf } from './pdf';
import { generateCover } from './cover';
import { generateEpub } from './kindle';

const args = process.argv.slice(2);
const wantPdf    = args.includes('--pdf')    || args.includes('--all') || args.length === 0;
const wantKindle = args.includes('--kindle') || args.includes('--all') || args.length === 0;

const srcDir          = path.join(__dirname, '..', 'src');
const outputDir       = path.join(__dirname, '..', 'output');
const assetsDir       = path.join(__dirname, '..', 'assets');
const coverPath       = path.join(outputDir, 'cover.jpg');
const assetsCoverPath = path.join(assetsDir, 'cover.jpg');
const epubPath        = path.join(outputDir, 'what-we-become.epub');
const pdfPath         = path.join(outputDir, 'what-we-become.pdf');

async function main(): Promise<void> {
  console.log('Loading chapters from src/...');
  const chapters = loadChapters(srcDir);
  console.log(`  ${chapters.length} chapters found.\n`);

  if (wantKindle) {
    console.log('Generating cover image...');
    await generateCover(coverPath);
    // Keep assets/cover.jpg in sync for README display
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.copyFileSync(coverPath, assetsCoverPath);
    console.log(`  Cover written to: ${coverPath}`);

    console.log('Generating EPUB (Kindle)...');
    await generateEpub(chapters, coverPath, epubPath);
    console.log(`  EPUB written to:  ${epubPath}\n`);
  }

  if (wantPdf) {
    console.log('Generating PDF (with TOC)...');
    await generatePdf(chapters, assetsCoverPath, pdfPath);
    console.log(`  PDF written to:   ${pdfPath}\n`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
