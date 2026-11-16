import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
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
import { company, consultants, services } from "../data/fake.data";
import { cn, formatCurrency, formatDate, toISODate } from "../lib/format";
import { getPriceForDate } from "../lib/pricing";

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
  const service = useMemo(() => services.find((item) => item.slug === slug), [slug]);
  const [date, setDate] = useState(defaultDate);
  const [tab, setTab] = useState("overview");
  const [lightbox, setLightbox] = useState(false);
  const [guests, setGuests] = useState("2-0-1");

  if (!service) {
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

  const consultant = consultants.find((item) => item.id === "minh-anh") || consultants[0];
  const amenities = fallbackAmenities(service);
  const price = getPriceForDate(service, new Date(`${date}T00:00:00`));
  const unit = service.priceUnit ? `/ ${service.priceUnit}` : "";
  const gallery = [service.image, ...(service.gallery || [])].filter(Boolean).slice(0, 3);
  const categoryName = service.category.startsWith("cruise")
    ? "Du thuyền"
    : { hotel: "Khách sạn", ticket: "Vé vui chơi", transport: "Xe & dịch vụ" }[service.category] || "Dịch vụ";

  return (
    <main className="bg-[#F5F9FB]">
      {/* Thông tin & thư viện ảnh */}
      <section className="bg-white">
        <div className="container-page pt-6 pb-[28px] lg:pt-[24px] lg:pb-[50px]">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
            <Link to="/home" className="transition hover:text-ocean-800">Trang chủ</Link>
            <span className="text-ocean-200">/</span>
            <Link to={`/dich-vu?category=${service.category}`} className="transition hover:text-ocean-800">
              {categoryName}
            </Link>
            <span className="text-ocean-200">/</span>
            <span className="text-ocean-900">{service.locationName}</span>
          </nav>

          <div className="mt-[17px] flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h1 className="font-display text-[30px] leading-[1.1] font-medium tracking-[-0.01em] text-ocean-950 lg:text-[40px]">
                {service.name}
              </h1>
              <p className="mt-[13px] flex items-center gap-2 text-[12px] text-ink-500 lg:mt-[19px] lg:text-[12.5px]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-sea-600" />
                {service.address || `${service.locationName}, Quảng Ninh`}
              </p>
            </div>

            <span className="mt-1 hidden h-7 shrink-0 items-center gap-1.5 rounded-[7px] bg-sea-50 px-3 text-[11px] font-medium text-ocean-800 lg:inline-flex">
              <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
              {service.rating}
              <span className="text-ocean-300">·</span>
              {service.ratingLabel || "Được khách hàng yêu thích"}
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
                alt={service.name}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
              <span className="absolute top-3.5 left-3.5 inline-flex h-7 items-center gap-1.5 rounded-[7px] bg-sea-50 px-3 text-[10.5px] font-medium text-ocean-800 lg:hidden">
                <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
                {service.rating} · {service.ratingLabel || "Được yêu thích"}
              </span>
            </button>

            <div className="relative hidden overflow-hidden rounded-2xl lg:block">
              <img
                src={gallery[1] || gallery[0]}
                alt={`${service.name} – ảnh 2`}
                className="h-[342px] w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="absolute right-[25px] bottom-[24px] inline-flex h-[45px] w-[243px] items-center justify-center gap-2 rounded-[10px] bg-white/95 text-[12px] font-semibold text-ocean-900 shadow-[0_10px_30px_-18px_rgba(16,61,84,0.5)] backdrop-blur transition hover:bg-white"
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
      <div className="container-page pt-0 pb-[22px] lg:grid lg:grid-cols-[824fr_448fr] lg:gap-6 lg:pt-6 lg:pb-[26px]">
        {/* Cột trái */}
        <div className="min-w-0 lg:min-h-[1000px] lg:rounded-2xl lg:bg-white lg:p-[26px]">
          <div className="-mx-5 flex items-center gap-6 overflow-x-auto bg-white px-5 lg:mx-0 lg:gap-[22px] lg:bg-transparent lg:px-0">
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
                    "relative shrink-0 pb-[15px] text-[13px] font-medium whitespace-nowrap transition",
                    item.desktopOnly && "hidden lg:block",
                    active ? "text-ocean-950" : "text-ink-500 hover:text-ocean-900"
                  )}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-ocean-600" />}
                </button>
              );
            })}
          </div>

          {tab === "overview" && (
            <div className="mt-8 lg:mt-[27px]">
              <h2 className="font-display text-[25px] leading-[1.44] font-medium text-ocean-950 lg:text-[27px] lg:leading-tight">
                {service.overviewTitle || "Một khoảng riêng giữa lòng di sản"}
              </h2>
              <p className="mt-[14px] max-w-[740px] text-[12.5px] leading-[1.35] text-ink-600 lg:mt-3 lg:text-[13px] lg:leading-[1.54]">
                {service.summaryMobile && (
                  <span className="lg:hidden">{service.summaryMobile}</span>
                )}
                <span className={service.summaryMobile ? "hidden lg:inline" : undefined}>{service.summary}</span>
              </p>

              <div className="mt-[26px] flex flex-wrap gap-[11px] lg:mt-[23px] lg:grid lg:grid-cols-4 lg:gap-[15px]">
                {amenities.slice(0, 4).map((amenity, index) => {
                  const Icon = amenityIcons[amenity.icon] || Check;
                  const shortLabel = amenity.label.replace(/ (ngoài trời|riêng|buffet|miễn phí)$/i, "");
                  return (
                    <span
                      key={amenity.label}
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 rounded-[7px] bg-sea-50 px-[11px] text-[10.5px] font-medium whitespace-nowrap text-ocean-800 lg:px-3.5 lg:text-[11.5px]",
                        index === 3 && "hidden lg:inline-flex"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-sea-600" strokeWidth={1.7} />
                      <span className="lg:hidden">{shortLabel}</span>
                      <span className="hidden lg:inline">{amenity.label}</span>
                    </span>
                  );
                })}
              </div>

              <div className="mt-[31px] lg:mt-[40px]">
                <CalendarSection service={service} date={date} onChange={setDate} />
              </div>
            </div>
          )}

          {tab === "calendar" && (
            <div className="mt-8 lg:mt-[34px]">
              <CalendarSection service={service} date={date} onChange={setDate} />
            </div>
          )}

          {tab === "amenities" && (
            <div className="mt-8 lg:mt-[34px]">
              <h2 className="font-display text-[25px] font-medium lg:text-[27px]">Tiện ích & trải nghiệm</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity.icon] || Check;
                  return (
                    <span
                      key={amenity.label}
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
                {(service.highlights || []).map((item) => (
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
                    {(service.included || []).map((item) => (
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
                    {(service.excluded || []).map((item) => (
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
                {(service.notes || []).map((item) => (
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
          <aside className="rounded-xl bg-white p-[18px] lg:h-[510px] lg:px-[26px] lg:py-6">
            <p className="text-[10.5px] font-medium tracking-[0.02em] text-ink-500 uppercase">
              Giá ngày {formatDate(date)}
            </p>
            <p className="mt-[20px] text-[28px] leading-none font-bold tracking-[-0.01em] text-ocean-950 lg:mt-[27px]">
              {formatCurrency(price, "đ").replace(" đ", "đ")}
            </p>
            <p className="mt-[19px] text-[11.5px] text-ink-500 lg:mt-[23px]">
              {unit}
              <span className="text-ocean-300"> - </span>
              <span className="lg:hidden">Đã gồm ăn sáng</span>
              <span className="hidden lg:inline">{service.roomType || "Đã gồm ăn sáng"}</span>
            </p>

            <div className="mt-[26px] hidden lg:mt-[27px] lg:block lg:space-y-4">
              <InfoField label="Ngày sử dụng">
                <CalendarDays className="h-4 w-4 shrink-0 text-sea-600" />
                <input
                  type="date"
                  value={date}
                  min={toISODate(new Date())}
                  onChange={(event) => event.target.value && setDate(event.target.value)}
                  className="w-full cursor-pointer bg-transparent text-[12px] font-medium text-ocean-950 outline-none [color-scheme:light]"
                />
              </InfoField>

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
              href={consultant.zalo}
              target="_blank"
              rel="noreferrer"
              className="mt-[23px] flex h-12 items-center justify-center rounded-[10px] bg-ocean-600 text-[13px] font-semibold text-white transition hover:bg-ocean-700 lg:mt-[31px] lg:h-[46px]"
            >
              Liên hệ tư vấn giá
            </a>

            <div className="mt-3 hidden gap-2 lg:flex">
              <a
                href={consultant.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex h-[45px] w-1/2 items-center justify-center rounded-[10px] bg-white text-[12px] font-semibold text-ocean-900 ring-1 ring-ocean-100 transition hover:bg-ocean-50"
              >
                Chat Zalo
              </a>
              <a
                href={`tel:${company.hotlineRaw}`}
                className="flex h-[45px] w-1/2 items-center justify-center rounded-[10px] bg-white text-[12px] font-semibold text-ocean-900 ring-1 ring-ocean-100 transition hover:bg-ocean-50"
              >
                Gọi hotline
              </a>
            </div>

            <p className="mt-5 text-[10px] leading-[1.6] text-ink-500 lg:mt-[24px]">
              <span className="lg:hidden">Vui lòng liên hệ xác nhận giá và tình trạng phòng.</span>
              <span className="hidden lg:inline">
                Giá có thể thay đổi. Vui lòng liên hệ để xác nhận.
              </span>
            </p>
          </aside>

          <aside className="min-h-[215px] rounded-xl bg-white p-5 lg:flex lg:h-[209px] lg:min-h-0 lg:flex-col lg:p-6">
            <div className="flex items-start gap-[18px] lg:gap-[21px]">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="h-[76px] w-[62px] shrink-0 rounded-2xl object-cover lg:h-[80px] lg:w-[68px]"
              />
              <div className="min-w-0 pt-0.5 lg:pt-[7px]">
                <h3 className="font-display text-[19px] leading-none font-medium text-ocean-950 lg:text-[22px]">
                  {consultant.name}
                </h3>
                <span className="mt-3 inline-flex h-[30px] items-center gap-1.5 rounded-md bg-sea-50 px-2.5 text-[10px] font-medium text-ocean-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-sea-600" />
                  {consultant.status}
                </span>
              </div>
            </div>

            <p className="mt-4 hidden text-[11.5px] font-medium text-ocean-900 lg:mt-[27px] lg:block">
              {consultant.role}
            </p>

            <div className="mt-[35px] grid grid-cols-2 gap-4 lg:hidden">
              <a
                href={consultant.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center rounded-[10px] bg-ocean-600 text-[12px] font-semibold text-white"
              >
                Chat Zalo
              </a>
              <a
                href={`tel:${company.hotlineRaw}`}
                className="flex h-12 items-center justify-center rounded-[10px] bg-white text-[12px] font-semibold text-ocean-900 ring-1 ring-ocean-100"
              >
                Gọi hotline
              </a>
            </div>

            <div className="mt-5 hidden items-center gap-3 text-[10.5px] text-ink-500 lg:mt-[17px] lg:flex">
              <a href={consultant.zalo} target="_blank" rel="noreferrer" className="font-medium text-ocean-800 hover:text-ocean-950">
                Zalo
              </a>
              <span className="text-ocean-200">·</span>
              <a href={consultant.facebook} target="_blank" rel="noreferrer" className="font-medium text-ocean-800 hover:text-ocean-950">
                Facebook
              </a>
              <span className="text-ocean-200">·</span>
              <a href={`tel:${company.hotlineRaw}`} className="inline-flex items-center gap-1.5 font-medium text-ocean-800 hover:text-ocean-950">
                <Phone className="h-3 w-3" />
                {company.hotline}
              </a>
            </div>
          </aside>

          <aside className="hidden rounded-xl bg-white p-[26px] lg:block lg:h-[233px]">
            <h3 className="text-[13px] font-semibold text-ocean-950">Lưu ý trước chuyến đi</h3>
            <ul className="mt-[26px] space-y-[1px]">
              {(service.notes || []).map((item) => (
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
          className="fixed inset-0 z-[70] flex flex-col bg-ocean-950/90 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-white">
            <p className="text-[12px] font-medium">{service.name}</p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Đóng thư viện ảnh"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid flex-1 gap-3 overflow-auto sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${service.name} – ảnh ${index + 1}`}
                className="h-full max-h-[70vh] w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

const CalendarSection = ({ service, date, onChange }) => (
  <div className="rounded-xl bg-white px-3 pt-[22px] pb-[30px] lg:rounded-none lg:bg-transparent lg:p-0">
    <h3 className="text-[18px] font-semibold text-ocean-950 lg:text-[19px]">Tra cứu giá theo ngày</h3>
    <p className="mt-[15px] text-[10.5px] text-ink-500 lg:mt-[11px] lg:text-[11px]">
      Giá tham khảo cho 01 phòng {service.roomType?.replace("Phòng ", "") || "Deluxe"} · 02 người lớn
    </p>
    <div className="mt-[29px] lg:mt-[30px]">
      <PriceCalendar service={service} value={date} onChange={onChange} />
    </div>
  </div>
);

export default ServiceDetail;
