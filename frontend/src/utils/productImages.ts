export type ProductImageLike =
  | string
  | File
  | { url?: string; src?: string; path?: string }
  | null
  | undefined;

const isFile = (v: unknown): v is File =>
  typeof File !== 'undefined' && v instanceof File;

const toUrlString = (v: unknown): string | null => {
  if (!v) return null;

  // 1) строка url/путь/base64
  if (typeof v === 'string') {
    const s = v.trim();
    return s.length ? s : null;
  }

  // 2) File (после upload/select)
  if (isFile(v)) {
    return URL.createObjectURL(v);
  }

  // 3) объект вида {url/src/path}
  if (typeof v === 'object') {
    const obj = v as any;
    const candidate = obj.url ?? obj.src ?? obj.path;
    if (typeof candidate === 'string' && candidate.trim().length) return candidate.trim();
  }

  return null;
};

/**
 * Возвращает нормализованный массив url строк (без null), сохраняя порядок.
 * Важно: если внутри были File -> создаются blob: url.
 */
export const normalizeProductImageUrls = (images: unknown): string[] => {
  if (!images) return [];

  const arr = Array.isArray(images) ? images : [images];
  const urls: string[] = [];

  for (const item of arr) {
    const u = toUrlString(item);
    if (u) urls.push(u);
  }

  return urls;
};

/** Миниатюра: первый валидный url, иначе null */
export const getProductThumbUrl = (images: unknown): string | null => {
  const urls = normalizeProductImageUrls(images);
  return urls.length ? urls[0] : null;
};