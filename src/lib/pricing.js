import { holidays } from "../data/fake.data";
import { money, toISODate } from "./format";

const holidayMap = new Map(holidays.map((h) => [h.date, h.name]));

/* Hash ổn định để giá "fake" không đổi giữa các lần render */
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

export const LOW_SEASON_MONTHS = [4, 5, 8, 9]; // tháng 5, 6, 9, 10 (index 0-based)

export const getHolidayName = (date) => holidayMap.get(toISODate(date)) || null;

export const getDayType = (date) => {
  const iso = toISODate(date);
  if (holidayMap.has(iso)) return { id: "holiday", label: "Lễ / Tết", name: holidayMap.get(iso) };
  const dow = date.getDay(); // 0 = CN
  if (dow === 0 || dow === 6) return { id: "weekend", label: "Cuối tuần" };
  if (LOW_SEASON_MONTHS.includes(date.getMonth())) return { id: "low", label: "Thấp điểm" };
  return { id: "weekday", label: "Ngày thường" };
};

const factor = {
  weekday: 1,
  weekend: 1.12,
  low: 0.94,
  holiday: 1.35,
};

export const getPriceForDate = (service, date) => {
  if (!service) return 0;
  const type = getDayType(date);
  const base = service.price || 0;
  if (service.fixedPrices) {
    if (type.id === "weekend") return service.weekendPrice ?? Math.round(base * 1.12);
    if (type.id === "holiday") return service.holidayPrice ?? Math.round(base * 1.35);
    return base;
  }
  const jitter = ((hash(`${service.id}-${toISODate(date)}`) % 5) - 2) / 100; // -2% .. +2%
  const value = base * factor[type.id] * (1 + jitter);
  return money(Math.max(value, base * 0.5));
};

/** Gói thay thế (cùng bậc giá) thay base; phụ thu / giảm giá thì cộng thêm. */
export const quoteWithOption = (service, date, option) => {
  const dayPrice = getPriceForDate(service, date);
  if (!option) return dayPrice;
  const alt = option.price > 0 && option.price >= service.price * 0.45;
  if (!alt) return money(dayPrice + option.price);
  return getPriceForDate({ ...service, id: `${service.id}::${option.name}`, price: option.price }, date);
};

export const getPriceRange = (service, year, month) => {
  const days = new Date(year, month + 1, 0).getDate();
  let min = Infinity;
  let max = 0;
  for (let d = 1; d <= days; d += 1) {
    const p = getPriceForDate(service, new Date(year, month, d));
    min = Math.min(min, p);
    max = Math.max(max, p);
  }
  return { min, max };
};

export const getMonthMatrix = (year, month) => {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // tuần bắt đầu thứ 2
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const availabilityFor = (service, date) => {
  const h = hash(`${service.id}-slot-${toISODate(date)}`);
  return 3 + (h % 12);
};
