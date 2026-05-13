import * as fs from 'fs';
import * as path from 'path';

export function assetToBase64(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}
