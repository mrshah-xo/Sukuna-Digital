import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/Raj kumar shah/Downloads/sukuna-app-fixed/sukuna-fixed/apps/web/src/components/dashboard';

// Create figma directory and ImageWithFallback
const figmaDir = path.join(dir, 'figma');
if (!fs.existsSync(figmaDir)) fs.mkdirSync(figmaDir);

fs.writeFileSync(path.join(figmaDir, 'ImageWithFallback.tsx'), `
import React from 'react';
export function ImageWithFallback({ src, alt, className, style }: any) {
  return <img src={src || 'https://ui-avatars.com/api/?name=User'} alt={alt} className={className} style={style} onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User'; }} />;
}
`);

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let changed = false;
  if (content.includes("from '../App'")) {
    content = content.replace(/from '\.\.\/App'/g, "from '@/contexts/ProfileContext'");
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in ${file}`);
  }
}
