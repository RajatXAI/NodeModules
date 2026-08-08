import fs from 'fs';
import path from 'path';

import { getCategory } from './utils.js';

const downloadsPath = path.join(process.cwd(), "Downloads");

if (!fs.existsSync(downloadsPath)) {
  console.log("Downloads folder not found.");
  process.exit(1);
}

const files = fs.readdirSync(downloadsPath);

console.log(`Found ${files.length} items\n`);

for (const file of files) {
  const sourcePath = path.join(downloadsPath, file);

  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    continue;
  }

  const extension = path.extname(file);

  const category = getCategory(extension);

  const destinationFolder = path.join(downloadsPath, category);

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  const destinationPath = path.join(destinationFolder, file);

  fs.renameSync(sourcePath, destinationPath);

  console.log(`✔ ${file} → ${category}`);
}

console.log("\nOrganization Completed.");