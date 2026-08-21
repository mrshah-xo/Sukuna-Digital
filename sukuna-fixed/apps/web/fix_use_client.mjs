import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/Raj kumar shah/Downloads/sukuna-app-fixed/sukuna-fixed/apps/web/src/components/dashboard';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all existing 'use client'; lines
  content = content.replace(/'use client';\r?\n?/g, '');
  content = content.replace(/"use client";\r?\n?/g, '');
  
  // Add it to the very top
  content = "'use client';\n" + content;
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
}
