import { toISODate } from "./format";

let holidayMap = new Map();

export const setHolidays = (list = []) => {
  holidayMap = new Map((list || []).map((h) => [h.date, h.name]));
};

/* Hash ổn định để giá fallback không đổi giữa các lần render */
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

const DEFAULT_RULE_DAYS = {
  weekday: [1, 2, 3, 4, 5],
  weekend: [6, 0],
  otherDays: [],
};

const normalizeDays = (days) => {
  if (!Array.isArray(days)) return null;
  const out = days
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  return Array.from(new Set(out));
};

const getRuleDays = (rule, key) => {
  const part = rule?.[key];
  if (part && typeof part === "object") {
    const days = normalizeDays(part.days);
    if (days && days.length) return days;
  }
  return DEFAULT_RULE_DAYS[key] || [];
};

const matchCustomDayBucket = (rule, date) => {
  if (!rule) return null;
  const dow = date.getDay();
  const keys = ["otherDays", "weekend", "weekday"];
  for (const key of keys) {
    const days = getRuleDays(rule, key);
    if (days.includes(dow)) return key;
  }
  return null;
};

export const getDayType = (date, rule = null) => {
  const iso = toISODate(date);
  if (holidayMap.has(iso)) return { id: "holiday", label: "Lễ / Tết", name: holidayMap.get(iso) };
  const dow = date.getDay(); // 0 = CN

  if (rule) {
    // Ưu tiên thấp điểm theo tháng nếu có cấu hình giá, sau đó xét nhóm ngày trong tuần (bao gồm "các ngày khác")
    if (LOW_SEASON_MONTHS.includes(date.getMonth()) && pickRulePrice(rule.lowSeason ?? rule.low, null) != null) {
      return { id: "low", label: "Thấp điểm" };
    }
    const bucket = matchCustomDayBucket(rule, date);
    if (bucket === "otherDays") return { id: "otherDays", label: "Các ngày khác trong tuần" };
    if (bucket === "weekend") return { id: "weekend", label: "Cuối tuần" };
    if (bucket === "weekday") return { id: "weekday", label: "Ngày thường" };
  }

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

const moneyRound = (v) => Math.round(Number(v || 0) / 10000) * 10000;

const pickRulePrice = (rulePart, fallback) => {
  if (rulePart == null) return fallback;
  if (typeof rulePart === "number") return rulePart;
  const candidates = [rulePart.price, rulePart.finalPrice, rulePart.basePrice, rulePart.value, rulePart.amount];
  for (const c of candidates) {
    if (c !== undefined && c !== null && c !== "") {
      const n = Number(c);
      if (!Number.isNaN(n)) return n;
    }
  }
  return fallback;
};

export const getDailyPriceMap = (daily = []) => {
  const map = new Map();
  (Array.isArray(daily) ? daily : []).forEach((d) => {
    if (!d) return;
    const date = d.date || d.iso || d.day;
    if (!date) return;
    map.set(String(date).slice(0, 10), d);
  });
  return map;
};

export const getPriceForDate = (service, date, rule = null) => {
  if (!service) return 0;
  const type = getDayType(date, rule);
  const base = Number(service.price || service.basePrice || service.displayPrice || 0);
  if (service.fixedPrices) {
    if (type.id === "weekend") return service.weekendPrice ?? moneyRound(base * 1.12);
    if (type.id === "holiday") return service.holidayPrice ?? moneyRound(base * 1.35);
    return base;
  }
  if (service.baseWeekday && service.baseWeekend) {
    if (type.id === "weekend") return service.baseWeekend;
    if (type.id === "holiday") return moneyRound(service.baseWeekend * 1.25);
    if (type.id === "low") return moneyRound(service.baseWeekday * 0.94);
    return service.baseWeekday;
  }
  const jitter = ((hash(`${service.id || service._id || service.slug || service.code || ""}-${toISODate(date)}`) % 5) - 2) / 100; // -2% .. +2%
  const value = base * (factor[type.id] || 1) * (1 + jitter);
  return moneyRound(Math.max(value, base * 0.5));
};

export const computePriceForDate = (service, date, pricing = {}) => {
  if (!service) return 0;
  const iso = toISODate(date);
  const dailyMap = pricing.dailyMap instanceof Map ? pricing.dailyMap : getDailyPriceMap(pricing.daily);
  const daily = dailyMap.get(iso);
  if (daily) {
    const p = daily.finalPrice ?? daily.price ?? daily.basePrice ?? daily.amount;
    if (p !== undefined && p !== null && p !== "") return Number(p) || 0;
  }

  const rule = pricing.rule;
  if (rule) {
    const type = getDayType(date, rule);
    const base = Number(service.price || service.basePrice || service.displayPrice || 0);
    if (type.id === "holiday") {
      const v = pickRulePrice(rule.holiday, null);
      if (v != null) return Number(v) || 0;
    } else if (type.id === "low") {
      const v = pickRulePrice(rule.lowSeason ?? rule.low, null);
      if (v != null) return Number(v) || 0;
    } else if (type.id === "weekend") {
      const v = pickRulePrice(rule.weekend, null);
      if (v != null) return Number(v) || 0;
    } else if (type.id === "otherDays") {
      const v = pickRulePrice(rule.otherDays ?? rule.other, null);
      if (v != null) return Number(v) || 0;
    } else {
      const v = pickRulePrice(rule.weekday, null);
      if (v != null) return Number(v) || 0;
    }
    // if rule exists but missing specific type, fall through to service-based calc with base hint
    if (base) return getPriceForDate(service, date, rule);
  }

  return getPriceForDate(service, date, rule);
};

/** Gói thay thế (cùng bậc giá) thay base; phụ thu / giảm giá thì cộng thêm. */
export const quoteWithOption = (service, date, option) => {
  const dayPrice = getPriceForDate(service, date);
  if (!option) return dayPrice;
  const alt = option.price > 0 && option.price >= (service.price || 0) * 0.45;
  if (!alt) return moneyRound(dayPrice + (option.price || 0));
  return getPriceForDate({ ...service, id: `${service.id || service._id || service.slug}::${option.name}`, price: option.price }, date);
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
  return { min: min === Infinity ? 0 : min, max };
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
  const h = hash(`${service.id || service._id || service.slug || service.code || ""}-slot-${toISODate(date)}`);
  return 3 + (h % 12);
};
