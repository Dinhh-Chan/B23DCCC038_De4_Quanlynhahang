# giuaki

App React Native CLI (RN 0.87.1) cho bài kiểm tra giữa kì.

## Chạy

```bash
npm start            # terminal 1: Metro
npm run android      # terminal 2: build + cài lên máy/emulator
```

## Thư viện có sẵn

- `@react-navigation/native`, `native-stack`, `bottom-tabs`
- `react-native-safe-area-context`, `react-native-screens`
- `react-native-svg`, `lucide-react-native` (icon)

## Cấu trúc

```
App.tsx
src/
  navigation/   RootNavigator, types
  screens/      các màn hình
  components/   component dùng lại
  commons/      data, theme, utils
  contexts/     Context API
```
