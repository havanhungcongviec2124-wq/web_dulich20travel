import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Images,
  MapPin,
  Phone,
  Star,
  Umbrella,
  Waves,
  Wifi,
  X,
} from "lucide-react";
import PriceCalendar from "../components/PriceCalendar";
import { cn, formatCurrency, formatDate, toISODate, toZaloAppLink } from "../lib/format";
import { computePriceForDate, getDailyPriceMap } from "../lib/pricing";
import { fetchServiceBySlug, clearSelectedService } from "../redux/slices/catalogSlice";
import { fetchCalendar } from "../redux/slices/pricingSlice";

const defaultCompany = {
  hotline: "036 271 5585",
  hotlineRaw: "0362715585",
  zalo: "https://zalo.me/0362715585",
  facebook: "http://facebook.com/hoangthiendll",
};

const amenityIcons = {
  pool: Waves,
  beach: Umbrella,
  breakfast: Coffee,
  wifi: Wifi,
};

const defaultDate = "2026-11-20";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "calendar", label: "Lịch giá" },
  { id: "amenities", label: "Tiện ích", desktopOnly: true },
  { id: "policy", label: "Chính sách" },
];

const fallbackAmenities = (service) =>
  (service.amenities || service.tags || []).map((item, index) =>
    typeof item === "string"
      ? { icon: ["pool", "beach", "breakfast", "wifi"][index % 4], label: item }
      : item
  );

const addDaysISO = (iso, days) => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

const diffNights = (checkIn, checkOut) => {
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 1;
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / 86400000));
};

const isNightlyService = (service) => {
  if (!service) return false;
  const unit = String(service.priceUnit || "").toLowerCase();
  if (unit.includes("đêm") || unit.includes("night")) return true;
  const cat = String(service.category || service.categoryId || service.categoryKey || "").toLowerCase();
  if (cat === "hotel" || cat === "cruise-night" || cat === "cruise_night") return true;
  return false;
};

const InfoField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[11px] font-medium text-ink-500">{label}</span>
    <span className="relative flex h-[47px] items-center gap-2 rounded-xl border border-ocean-100 bg-white px-4">
      {children}
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-ink-500" />
    </span>
  </label>
);

const ServiceDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const service = useSelector((s) => s.catalog?.selectedService);
  const serviceStatus = useSelector((s) => s.catalog?.serviceStatus);
  const services = useSelector((s) => s.catalog?.services || []);
  const consultants = useSelector((s) => s.consultants?.items || []);
  const content = useSelector((s) => s.content?.data);
  const calendars = useSelector((s) => s.pricing?.calendars || {});
  const company = { ...defaultCompany, ...(content?.company || {}) };

  const [date, setDate] = useState(defaultDate);
  const [checkOut, setCheckOut] = useState(() => addDaysISO(defaultDate, 1));
  const [pickingCheckout, setPickingCheckout] = useState(false);
  const [tab, setTab] = useState("overview");
  const [lightbox, setLightbox] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [guests, setGuests] = useState("2-0-1");
  const [calendarMonth, setCalendarMonth] = useState(() => (defaultDate || "").slice(0, 7));

  useEffect(() => {
    if (slug) dispatch(fetchServiceBySlug(slug));
    return () => {
      dispatch(clearSelectedService());
    };
  }, [dispatch, slug]);

  const resolvedService = useMemo(() => {
    if (service && service.slug === slug) return service;
    return services.find((item) => item.slug === slug) || null;
  }, [service, services, slug]);

  const serviceCode = resolvedService?.code || resolvedService?.slug || "";

  useEffect(() => {
    if (date) setCalendarMonth((prev) => (prev === date.slice(0, 7) ? prev : date.slice(0, 7)));
  }, [date]);

  const nightly = isNightlyService(resolvedService);
  const nights = nightly ? diffNights(date, checkOut) : 1;
  const stayMonths = useMemo(() => {
    if (!nightly) return date ? [date.slice(0, 7)] : [];
    const months = new Set();
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return date ? [date.slice(0, 7)] : [];
    const cur = new Date(start);
    while (cur < end) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
      months.add(key);
      cur.setDate(cur.getDate() + 1);
    }
    if (months.size === 0 && date) months.add(date.slice(0, 7));
    return Array.from(months);
  }, [nightly, date, checkOut]);

  useEffect(() => {
    if (!serviceCode) return;
    const months = nightly ? Array.from(new Set([calendarMonth, ...stayMonths].filter(Boolean))) : [calendarMonth].filter(Boolean);
    months.forEach((m) => dispatch(fetchCalendar({ serviceCode, month: m, packageId: "default" })));
  }, [dispatch, serviceCode, calendarMonth, nightly, stayMonths]);

  const handleDateChange = (nextDate) => {
    if (!nextDate) return;
    if (!nightly) {
      setDate(nextDate);
      return;
    }
    if (!pickingCheckout) {
      setDate(nextDate);
      setCheckOut(addDaysISO(nextDate, 1));
      setPickingCheckout(true);
      return;
    }
    const start = new Date(`${date}T00:00:00`);
    const picked = new Date(`${nextDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(picked.getTime())) return;
    if (picked <= start) {
      setDate(nextDate);
      setCheckOut(addDaysISO(nextDate, 1));
      setPickingCheckout(true);
      return;
    }
    setCheckOut(nextDate);
    setPickingCheckout(false);
  };

  const handleCheckInInput = (nextDate) => {
    if (!nextDate) return;
    setDate(nextDate);
    setPickingCheckout(true);
    setCheckOut((prev) => {
      const minOut = addDaysISO(nextDate, 1);
      if (!prev) return minOut;
      return new Date(`${prev}T00:00:00`) > new Date(`${nextDate}T00:00:00`) ? prev : minOut;
    });
  };

  const handleCheckOutChange = (nextOut) => {
    if (!nextOut) return;
    const minOut = addDaysISO(date, 1);
    setCheckOut(new Date(`${nextOut}T00:00:00`) <= new Date(`${date}T00:00:00`) ? minOut : nextOut);
    setPickingCheckout(false);
  };

  const pricingFor = useCallback(
    (isoDate) => {
      if (!serviceCode || !isoDate) return null;
      const month = String(isoDate).slice(0, 7);
      const cal = calendars[`${serviceCode}|default|${month}`];
      if (!cal) return null;
      return { rule: cal.rule || null, dailyMap: getDailyPriceMap(cal.daily || []) };
    },
    [calendars, serviceCode]
  );

  const calendarData = useMemo(() => {
    if (!serviceCode || !calendarMonth) return null;
    return calendars[`${serviceCode}|default|${calendarMonth}`] || null;
  }, [calendars, serviceCode, calendarMonth]);

  const pricingForMonth = useMemo(() => {
    if (!calendarData) return null;
    return { rule: calendarData.rule || null, dailyMap: getDailyPriceMap(calendarData.daily || []) };
  }, [calendarData]);

  const onMonthChange = useCallback((m) => {
    if (m) setCalendarMonth((prev) => (prev === m ? prev : m));
  }, []);

  if (serviceStatus === "loading" && !resolvedService) {
    return (
      <main className="container-page flex min-h-[60vh] items-center justify-center py-20 text-center">
        <p className="text-[13px] text-ink-500">Đang tải thông tin dịch vụ...</p>
      </main>
    );
  }

  if (!resolvedService) {
    return (
      <main className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-sea-700 uppercase">Không tìm thấy</p>
        <h1 className="mt-3 font-display text-[30px] font-medium">Dịch vụ không tồn tại</h1>
        <p className="mt-3 text-[13px] text-ink-500">Dịch vụ có thể đã được cập nhật hoặc thay đổi đường dẫn.</p>
        <Link
          to="/dich-vu"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ocean-600 px-6 text-[13px] font-semibold text-white transition hover:bg-ocean-700"
        >
          Xem tất cả dịch vụ
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    );
  }

  const consultant =
    consultants.find((item) => item.key === resolvedService.consultantKey || item.id === resolvedService.consultantKey) ||
    consultants.find((item) => item.key === "minh-anh" || item.id === "minh-anh") ||
    consultants.find((c) => c.active !== false && c.status !== "Tạm ẩn") ||
    consultants[0] ||
    { name: "Tư vấn viên 20 TRAVEL", role: "Tư vấn viên", status: "Sẵn sàng tư vấn", image: "", zalo: company.zalo, facebook: company.facebook };

  const amenities = fallbackAmenities(resolvedService);
  const selectedDateObj = new Date(`${date}T00:00:00`);
  const price = pricingForMonth
    ? computePriceForDate(resolvedService, selectedDateObj, pricingForMonth)
    : computePriceForDate(resolvedService, selectedDateObj);

  const nightDetails = nightly
    ? (() => {
        const details = [];
        const start = new Date(`${date}T00:00:00`);
        const end = new Date(`${checkOut}T00:00:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
          const p = pricingFor(date);
          return [{ date, price: p ? computePriceForDate(resolvedService, start, p) : computePriceForDate(resolvedService, start) }];
        }
        const cur = new Date(start);
        while (cur < end) {
          const iso = toISODate(cur);
          const p = pricingFor(iso);
          details.push({
            date: iso,
            price: p ? computePriceForDate(resolvedService, new Date(cur), p) : computePriceForDate(resolvedService, new Date(cur)),
          });
          cur.setDate(cur.getDate() + 1);
        }
        return details.length ? details : [{ date, price }];
      })()
    : [];
  const totalPrice = nightly ? nightDetails.reduce((sum, n) => sum + (Number(n.price) || 0), 0) : price;

  const unit = resolvedService.priceUnit ? `/ ${resolvedService.priceUnit}` : "";
  const gallery = [...new Set([resolvedService.image, resolvedService.secondaryImage, ...(resolvedService.gallery || [])].filter(Boolean))];
  const categoryName = String(resolvedService.category || "").startsWith("cruise")
    ? "Du thuyền"
    : { hotel: "Khách sạn", ticket: "Vé vui chơi", transport: "Xe & dịch vụ", tour: "Tour du lịch" }[resolvedService.category] || "Dịch vụ";

  return (
    <main className="bg-[#F5F9FB]">
      {/* Thông tin & thư viện ảnh */}
      <section className="bg-white">
        <div className="container-page pt-6 pb-[28px] lg:pt-[24px] lg:pb-[50px]">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
            <Link to="/home" className="transition hover:text-ocean-800">Trang chủ</Link>
            <span className="text-ocean-200">/</span>
            <Link to={`/dich-vu?category=${resolvedService.category || ""}`} className="transition hover:text-ocean-800">
              {categoryName}
            </Link>
            <span className="text-ocean-200">/</span>
            <span className="text-ocean-900">{resolvedService.locationName || "Chi tiết"}</span>
          </nav>

          <div className="mt-[17px] flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h1 className="font-display text-[30px] leading-[1.1] font-medium tracking-[-0.01em] text-ocean-950 lg:text-[40px]">
                {resolvedService.name}
              </h1>
              <p className="mt-[13px] flex items-center gap-2 text-[12px] text-ink-500 lg:mt-[19px] lg:text-[12.5px]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-sea-600" />
                {resolvedService.address || `${resolvedService.locationName || ""}${resolvedService.region ? `, ${resolvedService.region}` : ""}`}
              </p>
            </div>

            <span className="mt-1 hidden h-7 shrink-0 items-center gap-1.5 rounded-[7px] bg-sea-50 px-3 text-[11px] font-medium text-ocean-800 lg:inline-flex">
              <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
              {resolvedService.rating || 4.8}
              <span className="text-ocean-300">·</span>
              {resolvedService.ratingLabel || "Được khách hàng yêu thích"}
            </span>
          </div>

          <div className="mt-[27px] grid gap-4 lg:mt-[29px] lg:grid-cols-[824fr_456fr]">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="relative block h-[214px] overflow-hidden rounded-2xl lg:h-[342px]"
            >
              <img
                src={gallery[0]}
                alt={resolvedService.name}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
              <span className="absolute top-3.5 left-3.5 inline-flex h-7 items-center gap-1.5 rounded-[7px] bg-sea-50 px-3 text-[10.5px] font-medium text-ocean-800 lg:hidden">
                <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
                {resolvedService.rating || 4.8} · {resolvedService.ratingLabel || "Được yêu thích"}
              </span>
            </button>

            <div className="relative hidden overflow-hidden rounded-2xl lg:block">
              <img
                src={gallery[1] || gallery[0]}
                alt={`${resolvedService.name} – ảnh 2`}
                className="h-85.5 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="absolute cursor-pointer right-6.25 bottom-6 inline-flex h-11.25 w-60.75 items-center justify-center gap-2 rounded-[10px] bg-white/95 text-[12px] font-semibold text-ocean-900 shadow-[0_10px_30px_-18px_rgba(16,61,84,0.5)] backdrop-blur transition hover:bg-white"
              >
                <Images className="h-4 w-4 text-sea-600" />
                Xem thư viện ảnh
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nội dung & đặt giá */}
      <div className="container-page pt-0 pb-5.5 lg:grid lg:grid-cols-[824fr_448fr] lg:gap-6 lg:pt-6 lg:pb-6.5">
        {/* Cột trái */}
        <div className="min-w-0 lg:min-h-250 lg:rounded-2xl lg:bg-white lg:p-6.5">
          <div className="-mx-5 flex items-center gap-6 overflow-x-auto bg-white px-5 lg:mx-0 lg:gap-5.5 lg:bg-transparent lg:px-0">
            {tabs.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "relative shrink-0 pb-3.75 text-[13px] font-medium whitespace-nowrap transition",
                    item.desktopOnly && "hidden lg:block",
                    active ? "text-ocean-950" : "text-ink-500 hover:text-ocean-900"
                  )}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-0 bottom-0 h-0.75 rounded-full bg-ocean-600" />}
                </button>
              );
            })}
          </div>

          {tab === "overview" && (
            <div className="mt-8 lg:mt-6.75">
              <h2 className="font-display text-[25px] leading-[1.44] font-medium text-ocean-950 lg:text-[27px] lg:leading-tight">
                {resolvedService.overviewTitle || "Một khoảng riêng giữa lòng di sản"}
              </h2>
              <p className="mt-3.5 max-w-185 text-[12.5px] leading-[1.35] text-ink-600 lg:mt-3 lg:text-[13px] lg:leading-[1.54]">
                {resolvedService.summaryMobile && (
                  <span className="lg:hidden">{resolvedService.summaryMobile}</span>
                )}
                <span className={resolvedService.summaryMobile ? "hidden lg:inline" : undefined}>{resolvedService.summary}</span>
              </p>

              <div className="mt-6.5 flex flex-wrap gap-2.75 lg:mt-5.75 lg:gap-3.75">
                {amenities.slice(0, 4).map((amenity, index) => {
                  const Icon = amenityIcons[amenity.icon] || Check;
                  const shortLabel = String(amenity.label || "").replace(/ (ngoài trời|riêng|buffet|miễn phí)$/i, "");
                  return (
                    <span
                      key={`${amenity.label}-${index}`}
                      className={cn(
                        "inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-[7px] bg-sea-50 px-2.75 py-1 text-[10.5px] font-medium text-ocean-800 lg:px-3.5 lg:text-[11.5px]",
                        index === 3 && "hidden lg:inline-flex"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-sea-600" strokeWidth={1.7} />
                      <span className="truncate lg:hidden">{shortLabel}</span>
                      <span className="hidden truncate lg:inline">{amenity.label}</span>
                    </span>
                  );
                })}
              </div>

              <div className="mt-7.75 lg:mt-10">
                <CalendarSection service={resolvedService} date={date} checkOut={nightly ? checkOut : null} rangeMode={nightly} onChange={handleDateChange} pricing={pricingForMonth} onMonthChange={onMonthChange} />
              </div>
            </div>
          )}

          {tab === "calendar" && (
            <div className="mt-8 lg:mt-8.5">
              <CalendarSection service={resolvedService} date={date} checkOut={nightly ? checkOut : null} rangeMode={nightly} onChange={handleDateChange} pricing={pricingForMonth} onMonthChange={onMonthChange} />
            </div>
          )}

          {tab === "amenities" && (
            <div className="mt-8 lg:mt-[34px]">
              <h2 className="font-display text-[25px] font-medium lg:text-[27px]">Tiện ích & trải nghiệm</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity.icon] || Check;
                  return (
                    <span
                      key={`${amenity.label}-${index}`}
                      className="flex items-center gap-3 rounded-xl bg-ocean-50 px-4 py-3.5 text-[12px] font-medium text-ocean-900"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-sea-600" strokeWidth={1.7} />
                      {amenity.label}
                    </span>
                  );
                })}
              </div>

              <h3 className="mt-8 text-[15px] font-semibold text-ocean-950">Điểm nhấn hành trình</h3>
              <ul className="mt-4 space-y-2.5">
                {(resolvedService.highlights || []).map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12.5px] text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sea-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "policy" && (
            <div className="mt-8 lg:mt-[34px]">
              <h2 className="font-display text-[25px] font-medium lg:text-[27px]">Chính sách dịch vụ</h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-[13px] font-semibold text-ocean-950">Bao gồm</h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {(resolvedService.included || []).map((item) => (
                      <li key={item} className="flex gap-2.5 text-[12px] text-ink-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sea-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-ocean-950">Không bao gồm</h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {(resolvedService.excluded || []).map((item) => (
                      <li key={item} className="flex gap-2.5 text-[12px] text-ink-600">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-ocean-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 className="mt-8 text-[13px] font-semibold text-ocean-950">Lưu ý trước chuyến đi</h3>
              <ul className="mt-3.5 space-y-2">
                {(resolvedService.notes || []).map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12px] leading-[1.6] text-ink-600">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-sea-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Cột phải */}
        <div className="mt-5 flex flex-col gap-5 lg:mt-0 lg:block lg:space-y-6">
          <aside className="rounded-xl bg-white p-[18px] lg:min-h-[510px] lg:px-[26px] lg:py-6">
            <p className="text-[10.5px] font-medium tracking-[0.02em] text-ink-500 uppercase">
              {nightly ? `Tổng cộng (${nights} đêm)` : `Giá ngày ${formatDate(date)}`}
            </p>
            <p className="mt-[20px] text-[28px] leading-none font-bold tracking-[-0.01em] text-ocean-950 lg:mt-[27px]">
              {formatCurrency(nightly ? totalPrice : price, "đ").replace(" đ", "đ")}
            </p>
            <p className="mt-4.75 text-[11.5px] text-ink-500 lg:mt-5.75">
              {nightly ? (
                <>
                  {nights} đêm · {formatDate(date)} – {formatDate(checkOut)}
                </>
              ) : (
                <>
                  {unit}
                  <span className="text-ocean-300"> - </span>
                  <span className="lg:hidden">Đã gồm ăn sáng</span>
                  <span className="hidden lg:inline">{resolvedService.roomType || "Đã gồm ăn sáng"}</span>
                </>
              )}
            </p>
            {nightly && nights > 1 && (
              <p className="mt-1.5 text-[10.5px] text-ink-500">
                Trung bình {formatCurrency(Math.round(totalPrice / nights), "đ").replace(" đ", "đ")} / đêm
              </p>
            )}

            <div className="mt-6.5 space-y-4 lg:mt-6.75">
              {nightly ? (
                <>
                  <InfoField label="Nhận phòng">
                    <CalendarDays className="h-4 w-4 shrink-0 text-sea-600" />
                    <input
                      type="date"
                      value={date}
                      min={toISODate(new Date())}
                      onChange={(event) => event.target.value && handleCheckInInput(event.target.value)}
                      className="w-full cursor-pointer bg-transparent text-[12px] font-medium text-ocean-950 outline-none scheme-light"
                    />
                  </InfoField>
                  <InfoField label="Trả phòng">
                    <CalendarDays className="h-4 w-4 shrink-0 text-sea-600" />
                    <input
                      type="date"
                      value={checkOut}
                      min={addDaysISO(date, 1)}
                      onChange={(event) => event.target.value && handleCheckOutChange(event.target.value)}
                      className="w-full cursor-pointer bg-transparent text-[12px] font-medium text-ocean-950 outline-none scheme-light"
                    />
                  </InfoField>
                  <div className="rounded-xl bg-ocean-50 px-4 py-3 text-[12px] text-ocean-900">
                    <div className="flex items-center justify-between font-medium">
                      <span>Số đêm</span>
                      <span>{nights} đêm</span>
                    </div>
                    {nightDetails.length > 0 && (
                      <div className="mt-2 space-y-1 text-[11px] text-ink-600">
                        {nightDetails.map((n) => (
                          <div key={n.date} className="flex items-center justify-between gap-3">
                            <span>{formatDate(n.date)}</span>
                            <span className="font-medium text-ocean-950">
                              {formatCurrency(n.price, "đ").replace(" đ", "đ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden lg:block">
                  <InfoField label="Ngày sử dụng">
                    <CalendarDays className="h-4 w-4 shrink-0 text-sea-600" />
                    <input
                      type="date"
                      value={date}
                      min={toISODate(new Date())}
                      onChange={(event) => event.target.value && handleDateChange(event.target.value)}
                      className="w-full cursor-pointer bg-transparent text-[12px] font-medium text-ocean-950 outline-none scheme-light"
                    />
                  </InfoField>
                </div>
              )}

              <InfoField label="Số khách">
                <select
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  className="w-full cursor-pointer appearance-none bg-transparent text-[12px] font-medium text-ocean-950 outline-none"
                >
                  <option value="2-0-1">02 người lớn - 01 phòng</option>
                  <option value="1-0-1">01 người lớn - 01 phòng</option>
                  <option value="2-2-1">02 người lớn, 02 trẻ em - 01 phòng</option>
                  <option value="2-0-2">02 người lớn - 02 phòng</option>
                </select>
              </InfoField>
            </div>

            <a
              href={toZaloAppLink(company.zalo || consultant.zalo)}
              rel="noreferrer"
              className="mt-5.75 flex h-12 items-center justify-center rounded-[10px] bg-ocean-600 text-[13px] font-semibold text-white transition hover:bg-ocean-700 lg:mt-7.75 lg:h-11.5"
            >
              Liên hệ tư vấn giá
            </a>

            <div className="mt-3 hidden gap-2 lg:flex">
              <a
                href={toZaloAppLink(company.zalo || consultant.zalo)}
                rel="noreferrer"
                className="flex h-11.25 w-1/2 items-center justify-center rounded-[10px] bg-white text-[12px] font-semibold text-ocean-900 ring-1 ring-ocean-100 transition hover:bg-ocean-50"
              >
                Chat Zalo
              </a>
              <a
                href={`tel:${company.hotlineRaw || "0362715585"}`}
                className="flex h-[45px] w-1/2 items-center justify-center rounded-[10px] bg-white text-[12px] font-semibold text-ocean-900 ring-1 ring-ocean-100 transition hover:bg-ocean-50"
              >
                Gọi hotline
              </a>
            </div>

            <p className="mt-5 text-[10px] leading-[1.6] text-ink-500 lg:mt-6">
              <span className="lg:hidden">Vui lòng liên hệ xác nhận giá và tình trạng phòng.</span>
              <span className="hidden lg:inline">
                Giá có thể thay đổi. Vui lòng liên hệ để xác nhận.
              </span>
            </p>
          </aside>

          <aside className="min-h-53.75 rounded-xl bg-white p-5 lg:flex lg:h-52.25 lg:min-h-0 lg:flex-col lg:p-6">
            <div className="flex items-start gap-4.5 lg:gap-5.25">
              <img
                src={company.consultantAvatar || consultant.image || consultant.avatar}
                alt={consultant.name}
                className="h-19 w-15.5 shrink-0 rounded-2xl object-cover lg:h-20 lg:w-17"
              />
              <div className="min-w-0 pt-0.5 lg:pt-1.75">
                <h3 className="font-display text-[19px] leading-none font-medium text-ocean-950 lg:text-[22px]">
                  {consultant.name}
                </h3>
                <span className="mt-3 inline-flex h-7.5 items-center gap-1.5 rounded-md bg-sea-50 px-2.5 text-[10px] font-medium text-ocean-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-sea-600" />
                  {consultant.status || "Sẵn sàng tư vấn"}
                </span>
              </div>
            </div>

            <p className="mt-4 hidden text-[11.5px] font-medium text-ocean-900 lg:mt-6.75 lg:block">
              {consultant.role}
            </p>

            <div className="mt-[35px] grid grid-cols-2 gap-4 lg:hidden">
              <a
                href={toZaloAppLink(company.zalo || consultant.zalo)}
                rel="noreferrer"
                className="flex h-12 items-center justify-center rounded-[10px] bg-ocean-600 text-[12px] font-semibold text-white"
              >
                Chat Zalo
              </a>
              <a
                href={`tel:${company.hotlineRaw || "0362715585"}`}
                className="flex h-12 items-center justify-center rounded-[10px] bg-white text-[12px] font-semibold text-ocean-900 ring-1 ring-ocean-100"
              >
                Gọi hotline
              </a>
            </div>

            <div className="mt-5 hidden items-center gap-3 text-[10.5px] text-ink-500 lg:mt-[17px] lg:flex">
              <a href={toZaloAppLink(company.zalo || consultant.zalo)} rel="noreferrer" className="font-medium text-ocean-800 hover:text-ocean-950">
                Zalo
              </a>
              <span className="text-ocean-200">·</span>
              <a href={company.facebook || consultant.facebook} target="_blank" rel="noreferrer" className="font-medium text-ocean-800 hover:text-ocean-950">
                Facebook
              </a>
              <span className="text-ocean-200">·</span>
              <a href={`tel:${company.hotlineRaw || "0362715585"}`} className="inline-flex items-center gap-1.5 font-medium text-ocean-800 hover:text-ocean-950">
                <Phone className="h-3 w-3" />
                {company.hotline}
              </a>
            </div>
          </aside>

          <aside className="hidden rounded-xl bg-white p-[26px] lg:block lg:h-[233px]">
            <h3 className="text-[13px] font-semibold text-ocean-950">Lưu ý trước chuyến đi</h3>
            <ul className="mt-[26px] space-y-[1px]">
              {(resolvedService.notes || []).map((item) => (
                <li key={item} className="flex gap-2.5 text-[10.5px] leading-[1.6] text-ink-600">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-sea-500" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thư viện ảnh"
          className="fixed inset-0 z-[70] flex flex-col bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-white">
            <p className="text-[12px] font-medium">
              {resolvedService.name}
              <span className="ml-2 text-white/70">({gallery.length} ảnh)</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setLightbox(false);
                setViewerIndex(null);
              }}
              aria-label="Đóng thư viện ảnh"
              className="grid h-10 cursor-pointer w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid flex-1 grid-cols-2 content-start gap-3 overflow-auto sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setViewerIndex(index)}
                className="group overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <img
                  src={image}
                  alt={`${resolvedService.name} – ảnh ${index + 1}`}
                  className="aspect-[4/3] cursor-pointer w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>

          {viewerIndex !== null && gallery[viewerIndex] && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-ocean-950/95 p-4"
              onClick={() => setViewerIndex(null)}
              role="dialog"
              aria-modal="true"
              aria-label="Xem ảnh toàn cảnh"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerIndex(null);
                }}
                aria-label="Đóng xem ảnh"
                className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewerIndex((i) => (i - 1 + gallery.length) % gallery.length);
                  }}
                  aria-label="Ảnh trước"
                  className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <img
                src={gallery[viewerIndex]}
                alt={`${resolvedService.name} – ảnh ${viewerIndex + 1}`}
                className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewerIndex((i) => (i + 1) % gallery.length);
                  }}
                  aria-label="Ảnh tiếp"
                  className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              <p className="absolute bottom-5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white">
                {viewerIndex + 1} / {gallery.length}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

const CalendarSection = ({ service, date, checkOut, rangeMode, onChange, pricing, onMonthChange }) => (
  <div className="rounded-xl bg-white px-3 pt-5.5 pb-7.5 lg:rounded-none lg:bg-transparent lg:p-0">
    <h3 className="text-[18px] font-semibold text-ocean-950 lg:text-[19px]">Tra cứu giá theo ngày</h3>
    <p className="mt-3.75 text-[10.5px] text-ink-500 lg:mt-2.75 lg:text-[11px]">
      {rangeMode
        ? "Chọn ngày nhận phòng rồi chọn ngày trả phòng trên lịch để tính tổng theo số đêm"
        : `Giá tham khảo cho 01 phòng ${service.roomType?.replace("Phòng ", "") || "Deluxe"} · 02 người lớn`}
    </p>
    <div className="mt-7.25 lg:mt-7.5">
      <PriceCalendar service={service} value={date} endDate={checkOut} rangeMode={rangeMode} onChange={onChange} pricing={pricing} onMonthChange={onMonthChange} />
    </div>
  </div>
);

export default ServiceDetail;
