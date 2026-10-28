// 45000 -> "45.000 đ"
export function formatPrice(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}${digits} đ`;
}

const pad = (n: number) => n.toString().padStart(2, '0');

// Định dạng hh:mm dd/mm/yyyy
export function formatDateTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(
    date.getDate(),
  )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
}

// Chỉ giữ lại chữ số trong chuỗi nhập tiền
export function onlyDigits(text: string): string {
  return text.replace(/[^0-9]/g, '');
}
