export const formatCurrency = (value, suffix = "đ") => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value < 0 ? "-" : "";
  return `${sign}${new Intl.NumberFormat("vi-VN").format(Math.abs(value))}${suffix ? ` ${suffix}` : ""}`;
};

export const formatCompact = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)} triệu`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
};

export const formatDate = (date, opts = {}) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...opts,
  }).format(d);
};

export const formatDateLong = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
};

export const toISODate = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const money = (n) => Math.round(n / 1000) * 1000;

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const slugify = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const initials = (name = "") =>
  name
    .replace(/^(Mr|Mrs|Ms|Anh|Chị)\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
