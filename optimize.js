const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/assets');
const imgDir = path.join(__dirname, 'public/assets/images');

async function processDir(directory) {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  for (const file of files) {
    const input = path.join(directory, file);
    const output = path.join(directory, file.replace(/\.(jpg|jpeg)$/, '.webp'));
    console.log(`Processing ${input}...`);
    await sharp(input)
      .webp({ quality: 75 })
      .toFile(output);
    fs.unlinkSync(input); 
  }
}

async function run() {
  await processDir(dir);
  await processDir(imgDir);
  console.log('Optimization complete.');
}

run().catch(console.error);
