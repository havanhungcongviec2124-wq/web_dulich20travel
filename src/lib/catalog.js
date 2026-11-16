import { services } from "../data/fake.data";
import { getPriceForDate } from "./pricing";

export const priceBands = [
  { id: "", label: "Mọi mức giá" },
  { id: "0-1000000", label: "Dưới 1 triệu" },
  { id: "1000000-2000000", label: "1 – 2 triệu" },
  { id: "2000000-4000000", label: "2 – 4 triệu" },
  { id: "4000000-999999999", label: "Trên 4 triệu" },
];

export const sortOptions = [
  { id: "featured", label: "Nổi bật" },
  { id: "price-asc", label: "Giá thấp đến cao" },
  { id: "price-desc", label: "Giá cao đến thấp" },
  { id: "rating", label: "Đánh giá cao" },
];

const inBand = (price, band) => {
  if (!band) return true;
  const [min, max] = band.split("-").map(Number);
  return price >= min && price < max;
};

export const filterServices = (params, date) => {
  const location = params.get("location") || "";
  const category = params.get("category") || "";
  const q = (params.get("q") || "").trim().toLowerCase();
  const band = params.get("price") || "";
  const sort = params.get("sort") || "featured";

  const priced = services.map((service) => ({
    service,
    quote: date ? getPriceForDate(service, date) : service.price,
  }));

  const filtered = priced.filter(({ service, quote }) => {
    if (location && service.locationSlug !== location) return false;
    if (category) {
      const matched = category === "cruise" ? service.category.startsWith("cruise") : service.category === category;
      if (!matched) return false;
    }
    if (!inBand(quote, band)) return false;
    if (!q) return true;
    const haystack = `${service.name} ${service.subtitle || ""} ${service.locationName} ${service.code} ${(service.tags || []).join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });

  filtered.sort((a, b) => {
    if (sort === "price-asc") return a.quote - b.quote;
    if (sort === "price-desc") return b.quote - a.quote;
    if (sort === "rating") return b.service.rating - a.service.rating || b.service.reviews - a.service.reviews;
    return Number(b.service.featured) - Number(a.service.featured) || a.quote - b.quote;
  });

  return filtered;
};

export const relatedServices = (service, limit = 3) =>
  services
    .filter((item) => item.id !== service.id && (item.locationSlug === service.locationSlug || item.category === service.category))
    .slice(0, limit);
