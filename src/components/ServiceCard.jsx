import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { formatCurrency, cn, formatDate } from "../lib/format";

const unitLabel = (service) => (service.priceUnit ? `/ ${service.priceUnit}` : "");

export const CategoryPill = ({ categoryId, className }) => {
  const categories = useSelector((s) => s.catalog?.categories || []);
  const cat = categories.find((c) => c.key === categoryId || c.id === categoryId);
  if (!cat) return null;
  return (
    <span
      className={cn(
        "inline-flex h-[30px] items-center rounded-lg bg-sea-50 px-3 text-[11px] font-medium text-ocean-800",
        className
      )}
    >
      {cat.name}
    </span>
  );
};

const updatedText = (service) =>
  service.updatedAt ? `Cập nhật ${formatDate(service.updatedAt)}` : "";

/** Card dọc 416×375 – dùng cho "Chuyến đi đáng mong chờ" */
export const ServiceCard = ({ service, displayPrice, className }) => (
  <article
    className={cn(
      "group flex min-h-[345px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-24px_rgba(16,61,84,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-26px_rgba(16,61,84,0.4)] lg:min-h-[375px]",
      className
    )}
  >
    <Link to={`/dich-vu/${service.slug}`} className="relative block h-[155px] shrink-0 overflow-hidden rounded-t-2xl lg:h-[176px]">
      <img
        src={service.image}
        alt={service.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <CategoryPill categoryId={service.category} className="absolute top-3.5 left-3.5 bg-sea-50/95 backdrop-blur" />
    </Link>

    <div className="flex flex-1 flex-col px-4 pt-[22px] pb-[6px] lg:px-5 lg:pt-[24px]">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/dich-vu/${service.slug}`} className="min-w-0">
          <h3 className="line-clamp-1 text-[16px] leading-snug font-semibold text-ocean-950 transition group-hover:text-ocean-700 lg:text-[16.5px]">
            {service.name}
          </h3>
        </Link>
        <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-ink-700">
          <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
          {service.rating}
        </span>
      </div>

      <p className="mt-[10px] flex items-center gap-1 text-[11.5px] text-ink-500">
        <MapPin className="h-3 w-3 text-sea-600" />
        {service.locationName}, Quảng Ninh
      </p>

      <p className="mt-3 line-clamp-1 text-[11.5px] text-ink-600">
        {(service.tags || []).slice(0, 3).join(" · ")}
      </p>

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[18px] leading-none font-bold tracking-[-0.01em] text-ocean-950">
            {formatCurrency(displayPrice ?? service.price, "đ").replace(" đ", "đ")}
          </span>
          <span className="text-[10.5px] text-ink-500">{unitLabel(service)}</span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="text-[10px] text-ink-500">{updatedText(service)}</span>
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-700 transition group-hover:bg-ocean-600 group-hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  </article>
);

/** Hàng kết quả 983×229 – dùng cho trang tra cứu */
export const ServiceRow = ({ service, displayPrice }) => (
  <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_8px_26px_-24px_rgba(16,61,84,0.45)] transition hover:shadow-[0_18px_40px_-26px_rgba(16,61,84,0.45)] md:flex-row md:gap-0 md:p-3">
    <Link
      to={`/dich-vu/${service.slug}`}
      className="relative block h-44 shrink-0 overflow-hidden rounded-t-xl md:h-[206px] md:w-[265px] md:rounded-xl"
    >
      <img
        src={service.image}
        alt={service.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <CategoryPill categoryId={service.category} className="absolute top-2.5 left-2.5 bg-sea-50/95 backdrop-blur" />
    </Link>

    <div className="flex min-w-0 flex-1 gap-4 px-4 pt-4 pb-4 md:px-[22px] md:py-2.5">
      <div className="flex min-w-0 flex-1 flex-col">
        <Link to={`/dich-vu/${service.slug}`}>
          <h3 className="line-clamp-1 text-[18px] leading-snug font-semibold text-ocean-950 transition group-hover:text-ocean-700 md:text-[20px]">
            {service.name}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-500">
          <MapPin className="h-3.5 w-3.5 text-sea-600" />
          {service.locationName}, Quảng Ninh
        </p>

        <div className="mt-2.5 flex items-center gap-2 text-[11.5px] text-ink-600">
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3 w-3 fill-sand-400 text-sand-400" />
            {service.rating}
          </span>
          <span className="text-ocean-200">·</span>
          <span>Được khách hàng yêu thích</span>
        </div>

        <p className="mt-3 line-clamp-1 text-[11.5px] text-ink-600">
          {(service.tags || []).slice(0, 3).join(" · ")}
        </p>

        <span className="mt-auto pt-3 text-[10.5px] text-ink-500">{updatedText(service)}</span>
      </div>

      <div className="hidden w-[223px] shrink-0 flex-col items-end justify-between md:flex">
        <div className="text-right">
          <span className="block text-[10px] text-ink-500">Giá từ</span>
          <span className="mt-1.5 block text-[18px] leading-none font-bold text-ocean-950">
            {formatCurrency(displayPrice ?? service.price, "đ").replace(" đ", "đ")}
          </span>
          <span className="mt-1.5 block text-[10.5px] text-ink-500">{unitLabel(service)}</span>
        </div>
        <Link
          to={`/dich-vu/${service.slug}`}
          className="flex h-[46px] w-[194px] shrink-0 items-center justify-center rounded-[10px] bg-ocean-600 text-[13px] font-semibold text-white transition hover:bg-ocean-700"
        >
          Xem chi tiết
        </Link>
      </div>

      <div className="flex w-[110px] shrink-0 flex-col items-end justify-between md:hidden">
        <div className="text-right">
          <span className="block text-[9px] text-ink-500">Giá từ</span>
          <span className="mt-0.5 block text-[15px] leading-none font-bold text-ocean-950">
            {formatCurrency(displayPrice ?? service.price, "đ").replace(" đ", "đ")}
          </span>
          <span className="mt-0.5 block text-[9px] text-ink-500">{unitLabel(service)}</span>
        </div>
      </div>
    </div>

    <Link
      to={`/dich-vu/${service.slug}`}
      className="mx-4 mb-4 flex h-11 items-center justify-center rounded-[10px] bg-ocean-600 text-[13px] font-semibold text-white md:hidden"
    >
      Xem chi tiết
    </Link>
  </article>
);

export default ServiceCard;
