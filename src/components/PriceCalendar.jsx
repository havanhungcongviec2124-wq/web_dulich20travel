import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDayType, getMonthMatrix, getPriceForDate, computePriceForDate } from "../lib/pricing";
import { formatCurrency, cn, toISODate } from "../lib/format";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const monthLabel = (date) => `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const compactPrice = (value) => {
  const millions = Number(value || 0) / 1000000;
  if (millions >= 1) return `${millions.toFixed(2).replace(/\.?0+$/, "").replace(".", ",")}tr`;
  return `${Math.round(Number(value || 0) / 1000)}k`;
};

const LegendDot = ({ className }) => (
  <span className={cn("inline-block h-2.5 w-2.5 rounded-[3px]", className)} />
);

/** Lịch giá: chọn 1 ngày hoặc chọn khoảng (nhận phòng – trả phòng) theo số đêm. */
const PriceCalendar = ({ service, value, endDate, rangeMode, onChange, pricing, onMonthChange }) => {
  const selectedDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [cursor, setCursor] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  useEffect(() => {
    if (value) {
      const d = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(d.getTime())) {
        setCursor((prev) => (prev.getFullYear() === d.getFullYear() && prev.getMonth() === d.getMonth() ? prev : new Date(d.getFullYear(), d.getMonth(), 1)));
      }
    }
  }, [value]);

  useEffect(() => {
    onMonthChange?.(monthKey(cursor));
  }, [cursor, onMonthChange]);

  const weeks = useMemo(() => getMonthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const shift = (delta) =>
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

  const prevLabel = monthLabel(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const nextLabel = monthLabel(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  const rule = pricing?.rule || null;
  const priceOf = (date) => (pricing ? computePriceForDate(service, date, pricing) : getPriceForDate(service, date, rule));

  const hasRange = rangeMode && value && endDate && endDate > value;

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <button
          type="button"
          aria-label={`Xem ${prevLabel}`}
          onClick={() => shift(-1)}
          className="grid h-11.75 w-10.75 place-items-center rounded-md bg-ocean-50 text-ocean-800 transition hover:bg-ocean-100 lg:h-[45px] lg:w-[42px]"
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
          const type = getDayType(date, rule);
          const price = priceOf(date);

          const isStart = value === iso;
          const isEnd = rangeMode && endDate === iso;
          const inStay = hasRange && iso >= value && iso < endDate;
          const active = rangeMode ? (isStart || inStay) : isStart;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              aria-pressed={active || isEnd}
              title={rangeMode ? (isStart ? "Nhận phòng" : isEnd ? "Trả phòng" : inStay ? "Đêm lưu trú" : undefined) : undefined}
              className={cn(
                "flex h-11.25 flex-col cursor-pointer items-start justify-between rounded-lg px-1.75 py-1.25 text-left transition md:h-15.25 md:px-2.25 md:py-1.5",
                !active && !isEnd && (type.id === "weekend" ? "border-2 border-ocean-600" : type.id === "holiday" ? "bg-amber-50" : type.id === "otherDays" ? "bg-sky-50" : "bg-ocean-50"),
                active && "bg-ocean-600",
                !active && isEnd && "bg-ocean-500 ring-2 ring-ocean-600/60",
                !active && !isEnd && "hover:bg-ocean-100/70",
                inStay && !isStart && "ring-1 ring-ocean-500/30"
              )}
            >
              <span
                className={cn(
                  "text-[10.5px] leading-none font-semibold md:text-[12.5px]",
                  active || isEnd ? "text-white" : "text-ocean-950"
                )}
              >
                {date.getDate()}
              </span>
              <span
                className={cn(
                  "text-[8.5px] leading-none font-medium md:text-[11.5px]",
                  active || isEnd ? "text-white" : "text-ink-600"
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
        {rangeMode ? "Chọn ngày nhận phòng, sau đó chọn ngày trả phòng · Giá / phòng / đêm" : "Giá / phòng / đêm - “tr” = triệu VND"}
      </p>

      <div className="mt-[19px] flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-ink-600 md:mt-[34px] md:text-[11.5px]">
        <span className="inline-flex items-center gap-2">
          <LegendDot className="bg-ocean-50 ring-1 ring-ocean-100" /> Ngày thường
        </span>
        <span className="inline-flex items-center gap-2">
          <LegendDot className="border-2 border-ocean-600 ring-1 ring-sea-100" /> Cuối tuần
        </span>
        {rangeMode ? (
          <>
            <span className="inline-flex items-center gap-2">
              <LegendDot className="bg-ocean-600" /> Đêm lưu trú (tính tiền)
            </span>
            <span className="inline-flex items-center gap-2">
              <LegendDot className="bg-ocean-400 ring-2 ring-ocean-600/50" /> Trả phòng
            </span>
          </>
        ) : (
          <span className="inline-flex items-center gap-2">
            <LegendDot className="bg-ocean-600" /> Ngày đang chọn
          </span>
        )}
      </div>

      <p className="mt-[23px] hidden text-[10.5px] leading-relaxed text-ink-500 md:block md:text-[11.5px]">
        {rangeMode
          ? "Bấm 1 lần chọn nhận phòng, bấm lần 2 chọn trả phòng (có thể chọn ở tháng khác). Tổng tiền = cộng giá các đêm lưu trú."
          : "Giá / phòng / đêm - Đã gồm ăn sáng - Dữ liệu minh họa"}
      </p>
    </div>
  );
};

export default PriceCalendar;
