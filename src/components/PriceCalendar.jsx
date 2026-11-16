import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDayType, getMonthMatrix, getPriceForDate } from "../lib/pricing";
import { formatCurrency, cn, toISODate } from "../lib/format";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const monthLabel = (date) => `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

const compactPrice = (value) => {
  const millions = value / 1000000;
  if (millions >= 1) return `${millions.toFixed(2).replace(/\.?0+$/, "").replace(".", ",")}tr`;
  return `${Math.round(value / 1000)}k`;
};

const LegendDot = ({ className }) => (
  <span className={cn("inline-block h-2.5 w-2.5 rounded-[3px]", className)} />
);

/** Lịch giá đúng Figma: ô 103×61 desktop, 43×45 mobile, gap 7/4. */
const PriceCalendar = ({ service, value, onChange }) => {
  const selectedDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [cursor, setCursor] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const weeks = useMemo(() => getMonthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const shift = (delta) =>
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

  const prevLabel = monthLabel(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const nextLabel = monthLabel(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <button
          type="button"
          aria-label={`Xem ${prevLabel}`}
          onClick={() => shift(-1)}
          className="grid h-[47px] w-[43px] place-items-center rounded-[6px] bg-ocean-50 text-ocean-800 transition hover:bg-ocean-100 lg:h-[45px] lg:w-[42px]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-ocean-950">
          {monthLabel(cursor)}
        </p>

        <button
          type="button"
          aria-label={`Xem ${nextLabel}`}
          onClick={() => shift(1)}
          className="grid h-[47px] w-[43px] place-items-center rounded-[6px] bg-ocean-50 text-ocean-800 transition hover:bg-ocean-100 lg:h-[45px] lg:w-[42px]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-[20px] grid grid-cols-7 gap-1 lg:mt-[26px] lg:gap-[7px]">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-ink-500 md:text-[11.5px]">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-[19px] grid grid-cols-7 gap-x-1 gap-y-[6px] lg:mt-[17px] lg:gap-x-[7px] lg:gap-y-2">
        {weeks.flat().map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-[45px] rounded-lg md:h-[61px]" />;
          }
          const iso = toISODate(date);
          const type = getDayType(date);
          const price = getPriceForDate(service, date);
          const active = value === iso;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              aria-pressed={active}
              className={cn(
                "flex h-[45px] flex-col items-start justify-between rounded-lg px-[7px] py-[5px] text-left transition md:h-[61px] md:px-[9px] md:py-[6px]",
                type.id === "weekend" ? "bg-sea-50" : "bg-ocean-50",
                active && "bg-ocean-600",
                !active && "hover:bg-ocean-100/70"
              )}
            >
              <span
                className={cn(
                  "text-[10.5px] leading-none font-semibold md:text-[12.5px]",
                  active ? "text-white" : "text-ocean-950"
                )}
              >
                {date.getDate()}
              </span>
              <span
                className={cn(
                  "text-[8.5px] leading-none font-medium md:text-[11.5px]",
                  active ? "text-white" : "text-ink-600"
                )}
              >
                <span className="md:hidden">{compactPrice(price)}</span>
                <span className="hidden md:inline">{formatCurrency(price, "")}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-[21px] text-[10.5px] leading-relaxed text-ink-500 md:hidden">
        Giá / phòng / đêm - “tr” = triệu VND
      </p>

      <div className="mt-[19px] flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-ink-600 md:mt-[34px] md:text-[11.5px]">
        <span className="inline-flex items-center gap-2">
          <LegendDot className="bg-ocean-50 ring-1 ring-ocean-100" /> Ngày thường
        </span>
        <span className="inline-flex items-center gap-2">
          <LegendDot className="bg-sea-50 ring-1 ring-sea-100" /> Cuối tuần
        </span>
        <span className="inline-flex items-center gap-2">
          <LegendDot className="bg-ocean-600" /> Ngày đang chọn
        </span>
      </div>

      <p className="mt-[23px] hidden text-[10.5px] leading-relaxed text-ink-500 md:block md:text-[11.5px]">
        Giá / phòng / đêm - Đã gồm ăn sáng - Dữ liệu minh họa
      </p>
    </div>
  );
};

export default PriceCalendar;
