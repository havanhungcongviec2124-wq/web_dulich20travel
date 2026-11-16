import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import SearchPanel from "../components/SearchPanel";
import { ServiceRow } from "../components/ServiceCard";
import { categories, locations } from "../data/fake.data";
import { filterServices, sortOptions } from "../lib/catalog";
import { formatCurrency, formatDate, cn } from "../lib/format";
import { getPriceForDate } from "../lib/pricing";

const PAGE_SIZE = 6;
const MAX_PRICE = 6000000;
const marketingCounts = { hotel: 128, "cruise-day": 36, "cruise-night": 42, ticket: 64, transport: 58, tour: 12 };
const amenityOptions = [
  { id: "pool", label: "Bể bơi", match: ["bể bơi", "hồ bơi"] },
  { id: "breakfast", label: "Bao gồm ăn sáng", match: ["ăn sáng", "buffet sáng"] },
  { id: "transfer", label: "Đưa đón tận nơi", match: ["đưa đón", "xe đưa đón", "đón trả"] },
];

const FilterCheck = ({ checked, onChange, label, count }) => (
  <label className="flex cursor-pointer items-center gap-3 text-[12px] text-ink-700">
    <span
      className={cn(
        "grid h-[17px] w-[17px] shrink-0 place-items-center rounded-[4px] border transition",
        checked ? "border-ocean-600 bg-ocean-600 text-white" : "border-ocean-200 bg-white"
      )}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
          <path d="M2 6.2 4.8 9 10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span className="flex-1">{label}</span>
    {count !== undefined && <span className="text-[11px] text-ink-500">({count})</span>}
  </label>
);

const Search = () => {
  const [params, setParams] = useSearchParams();
  const location = params.get("location") || "";
  const date = params.get("date") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "featured";
  const page = Math.max(1, Number(params.get("page") || 1));
  const [maxPrice, setMaxPrice] = useState(Number(params.get("maxPrice") || MAX_PRICE));
  const [minPrice, setMinPrice] = useState(Number(params.get("minPrice") || 0));
  const [amenities, setAmenities] = useState((params.get("amenity") || "").split(",").filter(Boolean));

  const activeDate = date ? new Date(`${date}T00:00:00`) : new Date();
  const priceParam = `${minPrice}-${Math.max(minPrice + 100000, maxPrice)}`;

  const results = useMemo(() => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("price", priceParam);
    const base = filterServices(nextParams, activeDate);
    const filtered = base.filter(({ service }) => {
      if (!amenities.length) return true;
      const tags = (service.tags || []).join(" ").toLowerCase();
      return amenities.every((id) => {
        const option = amenityOptions.find((a) => a.id === id);
        return option ? option.match.some((keyword) => tags.includes(keyword)) : true;
      });
    });
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.quote - b.quote);
    if (sort === "price-desc") sorted.sort((a, b) => b.quote - a.quote);
    if (sort === "rating") sorted.sort((a, b) => b.service.rating - a.service.rating);
    if (sort === "featured") {
      sorted.sort((a, b) => Number(b.service.featured) - Number(a.service.featured) || a.quote - b.quote);
    }
    return sorted;
  }, [params, activeDate, priceParam, amenities, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const locationName = locations.find((l) => l.slug === location)?.name;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setParams(next);
  };

  const applyFilters = () => {
    const next = new URLSearchParams(params);
    next.set("minPrice", String(minPrice));
    next.set("maxPrice", String(maxPrice));
    if (amenities.length) next.set("amenity", amenities.join(","));
    else next.delete("amenity");
    next.delete("page");
    setParams(next);
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setAmenities([]);
    const next = new URLSearchParams(params);
    next.delete("category");
    next.delete("minPrice");
    next.delete("maxPrice");
    next.delete("amenity");
    next.delete("page");
    setParams(next);
  };

  const toggleAmenity = (id) =>
    setAmenities((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]));

  const chips = [];
  if (locationName) chips.push({ key: "location", label: locationName, clear: () => updateParam("location", "") });
  if (date) chips.push({ key: "date", label: formatDate(date), clear: () => updateParam("date", "") });
  if (category) {
    const label = category === "cruise" ? "Du thuyền" : categories.find((c) => c.id === category)?.name;
    if (label) chips.push({ key: "category", label, clear: () => updateParam("category", "") });
  }

  const sliderLeft = (minPrice / MAX_PRICE) * 100;
  const sliderRight = (maxPrice / MAX_PRICE) * 100;

  return (
    <main className="min-h-screen bg-ocean-50">
      {/* Search header */}
      <section className="bg-white">
        <div className="container-page pt-7 pb-8">
          <nav className="flex items-center gap-2 text-[11px] text-ink-500">
            <Link to="/home" className="transition hover:text-ocean-800">Trang chủ</Link>
            <span>/</span>
            <span className="text-ocean-900">Tra cứu dịch vụ</span>
          </nav>

          <h1 className="mt-4 font-display text-[27px] leading-tight font-medium text-ocean-950 lg:mt-[15px] lg:text-[34px]">
            Tìm chuyến đi dành cho bạn
          </h1>

          <SearchPanel
            variant="page"
            initial={{ location, date, category }}
            className="mt-5 lg:mt-[19px]"
          />
        </div>
      </section>

      <div className="container-page pb-14 pt-8 lg:pb-10">
        <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-[32px]">
          {/* Filters */}
          <aside className="mb-8 lg:mb-0">
            <div className="rounded-xl bg-white p-6 lg:sticky lg:top-[108px] lg:min-h-[713px]">
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-semibold text-ocean-950">Lọc theo nhu cầu</h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Xóa bộ lọc"
                  className="text-ink-500 transition hover:text-ocean-800"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-ink-500 uppercase">Loại dịch vụ</p>
                <div className="mt-4 space-y-[18px]">
                  {["hotel", "cruise-day", "cruise-night", "ticket", "transport"].map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    return (
                      <FilterCheck
                        key={id}
                        label={cat?.name}
                        count={marketingCounts[id]}
                        checked={category === id}
                        onChange={() => updateParam("category", category === id ? "" : id)}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-ink-500 uppercase">Khoảng giá / đơn vị</p>

                <div className="relative mt-8 h-4">
                  <div className="absolute top-1/2 right-0 left-0 h-[3px] -translate-y-1/2 rounded-full bg-ocean-100" />
                  <div
                    className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ocean-600"
                    style={{ left: `${sliderLeft}%`, right: `${100 - sliderRight}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ocean-600 bg-white"
                    style={{ left: `${sliderLeft}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ocean-600 bg-white"
                    style={{ left: `${sliderRight}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={100000}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100000))}
                    aria-label="Giá thấp nhất"
                    className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent opacity-0"
                  />
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100000))}
                    aria-label="Giá cao nhất"
                    className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent opacity-0"
                  />
                </div>

                <div className="mt-4 flex justify-between text-[10px] text-ink-500">
                  <span>Từ</span>
                  <span>Đến</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span className="flex h-[47px] items-center rounded-xl border border-ocean-100 px-4 text-[11.5px] font-medium text-ocean-900">
                    {formatCurrency(minPrice)}
                  </span>
                  <span className="flex h-[47px] items-center justify-center rounded-xl border border-ocean-100 px-2 text-[11.5px] font-medium text-ocean-900">
                    {formatCurrency(maxPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-ink-500 uppercase">Tiện ích</p>
                <div className="mt-4 space-y-[18px]">
                  {amenityOptions.map((option) => (
                    <FilterCheck
                      key={option.id}
                      label={option.label}
                      checked={amenities.includes(option.id)}
                      onChange={() => toggleAmenity(option.id)}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={applyFilters}
                className="mt-6 flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-ocean-600 text-[12.5px] font-semibold text-white transition hover:bg-ocean-700"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* Results */}
          <section className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-display text-[22px] font-medium text-ocean-950 lg:text-[24px]">
                  {results.length} dịch vụ {locationName ? `tại ${locationName}` : "cho bạn"}
                </h2>
                <p className="mt-1.5 text-[11.5px] text-ink-500">
                  Giá cho ngày {formatDate(activeDate)} · Không cần đăng nhập
                </p>
              </div>

              <label className="relative flex h-[45px] w-full items-center gap-2 rounded-[10px] border border-ocean-100 bg-white px-4 text-[11.5px] text-ink-500 sm:w-[275px]">
                <span className="whitespace-nowrap">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-[12px] font-medium text-ocean-900 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.id === "featured" ? "Phù hợp nhất" : option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-ink-500" />
              </label>
            </div>

            {chips.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex h-7 items-center gap-1.5 rounded-[7px] bg-sea-50 px-2.5 text-[11px] font-medium text-ocean-800"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-[22px]">
              {visible.map(({ service, quote }) => (
                <ServiceRow key={service.id} service={service} displayPrice={quote} />
              ))}
              {visible.length === 0 && (
                <div className="rounded-xl bg-white p-10 text-center">
                  <p className="text-[15px] font-semibold text-ocean-950">Chưa có dịch vụ phù hợp</p>
                  <p className="mt-2 text-[12px] text-ink-500">Thử bỏ bớt bộ lọc hoặc chọn ngày khác.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-[10px] bg-ocean-600 px-6 text-[12.5px] font-semibold text-white"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>

            {pages > 1 && (
              <div className="mt-11 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => updateParam("page", String(page - 1))}
                  className="grid h-[45px] w-[47px] place-items-center rounded-[10px] border border-ocean-100 bg-white text-ocean-800 disabled:opacity-40"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(pages, 5) }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => updateParam("page", String(number))}
                    className={cn(
                      "h-[45px] w-[47px] rounded-[10px] text-[12px] font-medium transition",
                      page === number
                        ? "bg-ocean-600 text-white"
                        : "border border-ocean-100 bg-white text-ocean-800 hover:border-ocean-200"
                    )}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === pages}
                  onClick={() => updateParam("page", String(page + 1))}
                  className="grid h-[45px] w-[47px] place-items-center rounded-[10px] border border-ocean-100 bg-white text-ocean-800 disabled:opacity-40"
                  aria-label="Trang sau"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Search;
