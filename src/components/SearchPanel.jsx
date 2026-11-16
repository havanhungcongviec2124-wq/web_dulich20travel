import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Compass, Search, ChevronDown } from "lucide-react";
import { categories, locations } from "../data/fake.data";
import { toISODate, cn } from "../lib/format";

const todayISO = toISODate(new Date());

const options = [
  { value: "", label: "Tất cả dịch vụ" },
  ...categories.map((c) => ({ value: c.id, label: c.name })),
];

/**
 * Thanh tra cứu.
 * - variant="hero": panel nổi 1296×98 trên trang chủ (đúng Figma desktop),
 *   mobile chuyển thành form 3 ô + nút full width.
 * - variant="page": hàng field viền trắng trên trang kết quả (label phía trên).
 */
const SearchPanel = ({ initial = {}, className, variant = "hero" }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initial.location || "");
  const [date, setDate] = useState(initial.date || "");
  const [category, setCategory] = useState(initial.category || "");

  const onSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (category) params.set("category", category);
    navigate(`/dich-vu${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const selectClass =
    "w-full cursor-pointer appearance-none truncate bg-transparent text-[14.5px] font-medium text-ocean-950 outline-none [color-scheme:light]";

  if (variant === "page") {
    return (
      <form onSubmit={onSubmit} className={cn("grid gap-3 md:grid-cols-[339fr_269fr_359fr_266px] md:gap-5", className)}>
        <label className="block">
          <span className="mb-2.5 block text-[11px] font-medium text-ink-500">Điểm đến</span>
          <span className="relative flex h-[47px] items-center gap-2.5 rounded-xl border border-ocean-100 bg-white px-4">
            <MapPin className="h-4 w-4 shrink-0 text-sea-600" />
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
              <option value="">Tất cả điểm đến</option>
              {locations.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-500" />
          </span>
        </label>

        <label className="block">
          <span className="mb-2.5 block text-[11px] font-medium text-ink-500">Ngày sử dụng</span>
          <span className="relative flex h-[47px] items-center gap-2.5 rounded-xl border border-ocean-100 bg-white px-4">
            <CalendarDays className="h-4 w-4 shrink-0 text-sea-600" />
            <input
              type="date"
              min={todayISO}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-[14.5px] font-medium text-ocean-950 outline-none [color-scheme:light]"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2.5 block text-[11px] font-medium text-ink-500">Loại dịch vụ</span>
          <span className="relative flex h-[47px] items-center gap-2.5 rounded-xl border border-ocean-100 bg-white px-4">
            <Compass className="h-4 w-4 shrink-0 text-sea-600" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              {options.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-500" />
          </span>
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-ocean-600 text-[14px] font-semibold text-white transition hover:bg-ocean-700"
          >
            <Search className="h-4 w-4" strokeWidth={2.4} />
            Tra cứu giá
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      {/* Mobile: label ngoài + field 48px đúng Figma 390 */}
      <div className="lg:hidden">
        <p className="text-[15px] font-semibold text-ocean-950">Bạn muốn đi đâu?</p>

        <label className="mt-3 block">
          <span className="mb-2.5 block text-[11px] font-medium text-ink-600">Điểm đến</span>
          <span className="relative flex h-12 items-center gap-2.5 rounded-xl border border-ocean-100 bg-white px-4">
            <MapPin className="h-4 w-4 shrink-0 text-sea-600" />
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
              <option value="">Hạ Long, Quảng Ninh</option>
              {locations.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-500" />
          </span>
        </label>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <label className="block">
            <span className="mb-2.5 block text-[11px] font-medium text-ink-600">Ngày sử dụng</span>
            <span className="relative flex h-12 items-center gap-2 rounded-xl border border-ocean-100 bg-white px-3">
              <CalendarDays className="h-4 w-4 shrink-0 text-sea-600" />
              <span className="relative flex w-full items-center">
                {!date && (
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[13px] font-medium text-ocean-950">
                    Chọn ngày
                  </span>
                )}
                <input
                  type="date"
                  min={todayISO}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={cn(
                    "w-full bg-transparent text-[13px] font-medium text-ocean-950 outline-none [color-scheme:light]",
                    !date && "text-transparent"
                  )}
                />
              </span>
            </span>
          </label>

          <label className="block">
            <span className="mb-2.5 block text-[11px] font-medium text-ink-600">Loại dịch vụ</span>
            <span className="relative flex h-12 items-center gap-2.5 rounded-xl border border-ocean-100 bg-white px-4">
              <Compass className="h-4 w-4 shrink-0 text-sea-600" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                {options.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-500" />
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-[34px] flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-ocean-600 text-[14px] font-semibold text-white transition hover:bg-ocean-700"
        >
          <Search className="h-4 w-4" strokeWidth={2.4} />
          Khám phá dịch vụ
        </button>
      </div>

      {/* Desktop: panel 1296×98 */}
      <div className="hidden rounded-2xl bg-white lg:flex lg:h-[98px] lg:items-center lg:shadow-[0_18px_45px_-30px_rgba(16,61,84,0.45)] lg:ring-1 lg:ring-ocean-100/70">
        <label className="flex h-full cursor-pointer flex-col justify-center lg:w-[350px] lg:gap-[3px] lg:pl-7">
          <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink-500">
            <MapPin className="h-3.5 w-3.5 text-sea-600" />
            Điểm đến
          </span>
          <span className="relative flex items-center">
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
              <option value="">Bạn muốn đi đâu?</option>
              {locations.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex h-full cursor-pointer flex-col justify-center lg:w-[302px] lg:gap-[3px] lg:pl-7">
          <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink-500">
            <CalendarDays className="h-3.5 w-3.5 text-sea-600" />
            Ngày sử dụng
          </span>
          <span className="relative flex items-center">
            {!date && (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[14.5px] font-medium text-ocean-950">
                Chọn ngày
              </span>
            )}
            <input
              type="date"
              min={todayISO}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(selectClass, "text-[14.5px]", !date && "text-transparent")}
            />
          </span>
        </label>

        <label className="flex h-full cursor-pointer flex-col justify-center lg:w-[398px] lg:gap-[3px] lg:pl-7">
          <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink-500">
            <Compass className="h-3.5 w-3.5 text-sea-600" />
            Loại dịch vụ
          </span>
          <span className="relative flex items-center">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              {options.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </span>
        </label>

        <div className="ml-2 pr-6">
          <button
            type="submit"
            className="flex h-12 w-[184px] items-center justify-center gap-2 rounded-[10px] bg-ocean-600 text-[14px] font-semibold text-white transition hover:bg-ocean-700"
          >
            <Search className="h-4 w-4" strokeWidth={2.4} />
            Tra cứu giá
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchPanel;
