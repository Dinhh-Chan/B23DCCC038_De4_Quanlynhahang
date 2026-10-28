const DIACRITICS: [RegExp, string][] = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a'],
  [/[èéẹẻẽêềếệểễ]/g, 'e'],
  [/[ìíịỉĩ]/g, 'i'],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o'],
  [/[ùúụủũưừứựửữ]/g, 'u'],
  [/[ỳýỵỷỹ]/g, 'y'],
  [/đ/g, 'd'],
];

// "Phở Bò  tái!" -> "pho bo tai" (chữ thường, bỏ dấu, bỏ ký tự đặc biệt)
export function normalizeText(text: string): string {
  let result = text.toLowerCase();
  DIACRITICS.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  return result.replace(/[^a-z0-9]+/g, ' ').trim();
}
