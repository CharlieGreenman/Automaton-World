import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const COVER_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1600px;
    height: 2560px;
    overflow: hidden;
  }
  body {
    background: #0a0f1a;
    font-family: Georgia, 'Times New Roman', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Deep space gradient — the frontier beyond the map */
  body::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 100% 60% at 50% 10%, #0e1e3a 0%, transparent 55%),
      radial-gradient(ellipse 70% 50% at 80% 80%, #1a0a2e 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 20% 90%, #0a1a1a 0%, transparent 60%);
  }

  /* Faint star-field dots */
  body::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1px 1px at 34% 7%,  rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 58% 22%, rgba(255,255,255,0.30) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 11%, rgba(255,255,255,0.20) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 35%, rgba(255,255,255,0.28) 0%, transparent 100%),
      radial-gradient(1px 1px at 22% 45%, rgba(255,255,255,0.18) 0%, transparent 100%),
      radial-gradient(1px 1px at 64% 55%, rgba(255,255,255,0.22) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 78%, rgba(255,255,255,0.15) 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.20) 0%, transparent 100%);
  }

  .cover {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 160px;
    width: 100%;
    height: 100%;
  }

  .ornament {
    width: 80px;
    height: 1px;
    background: rgba(255,255,255,0.22);
    margin: 0 auto 80px;
  }

  .title {
    font-size: 112px;
    font-weight: normal;
    color: #ffffff;
    letter-spacing: 0.04em;
    line-height: 1.08;
    margin-bottom: 52px;
  }

  .subtitle {
    font-size: 36px;
    font-style: italic;
    color: rgba(255,255,255,0.55);
    line-height: 1.5;
    max-width: 1000px;
    margin-bottom: 100px;
  }

  .rule {
    width: 60px;
    height: 1px;
    background: rgba(255,255,255,0.28);
    margin: 0 auto 80px;
  }

  .author {
    font-size: 30px;
    color: rgba(255,255,255,0.72);
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .border {
    position: absolute;
    inset: 48px;
    border: 1px solid rgba(255,255,255,0.07);
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="border"></div>
    <div class="ornament"></div>
    <div class="title">What We<br>Become</div>
    <div class="subtitle">An Attempt at the Paragraph<br>That Cannot Be Written</div>
    <div class="rule"></div>
    <div class="author">Charlie Greenman</div>
  </div>
</body>
</html>`;

export async function generateCover(outputPath: string): Promise<void> {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 2560, deviceScaleFactor: 1 });
    await page.setContent(COVER_HTML, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: outputPath as `${string}.jpg`,
      type: 'jpeg',
      quality: 95,
      clip: { x: 0, y: 0, width: 1600, height: 2560 },
    });
  } finally {
    await browser.close();
  }
}
