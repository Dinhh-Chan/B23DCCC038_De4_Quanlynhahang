// Ảnh chụp món ăn (nguồn Pexels, xem CREDITS.md)
export const DISH_PHOTOS = {
  banhmi: require('./banhmi.jpg'),
  buncha: require('./buncha.jpg'),
  caphe: require('./caphe.jpg'),
  chagio: require('./chagio.jpg'),
  che: require('./che.jpg'),
  comtam: require('./comtam.jpg'),
  flan: require('./flan.jpg'),
  goicuon: require('./goicuon.jpg'),
  nuoccam: require('./nuoccam.jpg'),
  pho: require('./pho.jpg'),
  supcua: require('./supcua.jpg'),
  trada: require('./trada.jpg'),
};

export type DishPhotoKey = keyof typeof DISH_PHOTOS;
