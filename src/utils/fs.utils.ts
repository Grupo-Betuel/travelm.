import fs from 'fs';
import { BaseEntity } from '@shared/entities/BaseEntity';
import * as path from 'path';
import * as os from 'os';

const tmpDir = os.tmpdir();

export type CachedResourceType = 'companies' | 'products' | 'categories';
export const getCachePath = (
  id: string,
  type: CachedResourceType,
) => path.join(tmpDir, `data/${type}/${id}.json`);

export async function setCachedResource<T>(
  product: T & BaseEntity,
  type: CachedResourceType,
  id?: string,
) {
  product && await fs.writeFileSync(getCachePath(id || product._id, type), JSON.stringify(product));
}
export async function getCachedResources<T>(id: string, type: CachedResourceType) {
  if (!id) return;
  if (await fs.existsSync(getCachePath(id, type))) {
    const data = JSON.parse((await fs.readFileSync(getCachePath(id, type), 'utf8')) || '{}') as T;
    return JSON.stringify(data) === '{}' ? undefined : data;
  }
}
