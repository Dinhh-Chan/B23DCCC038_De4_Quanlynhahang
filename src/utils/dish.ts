import { ImageSourcePropType } from 'react-native';
import { DISH_PHOTOS, DishPhotoKey } from '../assets/dishes';
import { normalizeText } from './text';

// Ghép ảnh theo từ khoá trong tên món (đã bỏ dấu)
const KEYWORD_PHOTOS: [string, DishPhotoKey][] = [
  ['banh mi', 'banhmi'],
  ['bun cha', 'buncha'],
  ['pho', 'pho'],
  ['com tam', 'comtam'],
  ['goi cuon', 'goicuon'],
  ['cha gio', 'chagio'],
  ['nem ran', 'chagio'],
  ['sup cua', 'supcua'],
  ['che', 'che'],
  ['flan', 'flan'],
  ['tra da', 'trada'],
  ['ca phe', 'caphe'],
  ['cafe', 'caphe'],
  ['nuoc cam', 'nuoccam'],
  ['cam ep', 'nuoccam'],
];

// Trả về null nếu không có ảnh phù hợp (hiển thị khung icon thay thế)
export function getDishPhoto(name: string): ImageSourcePropType | null {
  const words = ` ${normalizeText(name)} `;
  const match = KEYWORD_PHOTOS.find(([keyword]) =>
    words.includes(` ${keyword} `),
  );
  return match ? DISH_PHOTOS[match[1]] : null;
}
