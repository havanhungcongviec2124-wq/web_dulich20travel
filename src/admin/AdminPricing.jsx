import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ArrowRight, Plus, Download, X } from "lucide-react";
import { fetchServices } from "../redux/slices/catalogSlice";
import { fetchPricingRules, fetchDailyPrices, upsertPricingRule, upsertDailyPrice } from "../redux/slices/pricingSlice";

const fmt = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

const pad2 = (n) => String(n).padStart(2, "0");
const currentYear = new Date().getFullYear();
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const m = i + 1;
  return { value: `${currentYear}-${pad2(m)}`, label: `Tháng ${m}, ${currentYear}` };
});

const WEEKDAY_NAMES = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const DAY_OPTIONS = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 0, label: "Chủ nhật" },
];

const dayTypeLabel = (iso) => {
  if (!iso) return "Ngày thường";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "Ngày thường";
  const dow = d.getDay();
  return dow === 0 || dow === 6 ? "Cuối tuần" : "Ngày thường";
};

const pickRulePrice = (part) => {
  if (part == null) return 0;
  if (typeof part === "number") return part;
  const n = part.price ?? part.finalPrice ?? part.basePrice ?? part.value ?? part.amount;
  return Number(n || 0);
};

const DEFAULT_RULE_DAYS = {
  weekday: [1, 2, 3, 4, 5],
  weekend: [6, 0],
  otherDays: [],
};

const normalizeDays = (days) => {
  if (!Array.isArray(days)) return null;
  const out = days.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  return Array.from(new Set(out));
};

const daysToRange = (days, fallbackKey) => {
  const arr = normalizeDays(days);
  const effective = arr && arr.length ? arr : (DEFAULT_RULE_DAYS[fallbackKey] || []);
  if (!effective.length) return { from: 1, to: 5 };
  const orderedValues = DAY_OPTIONS.map((o) => o.value);
  const indices = effective
    .map((v) => orderedValues.indexOf(v))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  if (!indices.length) return { from: 1, to: 5 };
  return { from: orderedValues[indices[0]], to: orderedValues[indices[indices.length - 1]] };
};

const rangeToDays = (from, to) => {
  const orderedValues = DAY_OPTIONS.map((o) => o.value);
  let start = orderedValues.indexOf(Number(from));
  let end = orderedValues.indexOf(Number(to));
  if (start < 0) start = 0;
  if (end < 0) end = orderedValues.length - 1;
  if (start <= end) return orderedValues.slice(start, end + 1);
  return [...orderedValues.slice(start), ...orderedValues.slice(0, end + 1)];
};

const dayRangeLabel = (days, fallbackKey) => {
  const arr = normalizeDays(days);
  const effective = arr && arr.length ? arr : (DEFAULT_RULE_DAYS[fallbackKey] || []);
  if (!effective.length) return "Chưa chọn ngày";
  const r = daysToRange(effective, fallbackKey);
  const fromLabel = DAY_OPTIONS.find((o) => o.value === r.from)?.label || "";
  const toLabel = DAY_OPTIONS.find((o) => o.value === r.to)?.label || "";
  return fromLabel && toLabel ? `${fromLabel} – ${toLabel}` : "Theo ngày đã chọn";
};

const ruleLabel = {
  weekday: { label: "Ngày thường", bg: "bg-[#eff7fa]", priceColor: "text-[#00749d]" },
  weekend: { label: "Cuối tuần", bg: "bg-[#e5f5f6]", priceColor: "text-[#00749d]" },
  otherDays: { label: "Các ngày khác trong tuần", bg: "bg-[#eef8ff]", priceColor: "text-[#00749d]" },
  lowSeason: { label: "Thấp điểm", bg: "bg-[#eff7fa]", priceColor: "text-[#00749d]" },
  holiday: { label: "Lễ / Tết", bg: "bg-[#fef6e7]", priceColor: "text-[#8e5c21]" },
};

const priceInput =
  "w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]";
const selectInput =
  "w-full appearance-none rounded-lg border border-[#e6eef2] bg-white px-3 py-2 pr-7 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]";

const AdminPricing = () => {
  const dispatch = useDispatch();
  const services = useSelector((s) => s.catalog?.services || []);
  const rules = useSelector((s) => s.pricing?.rules || []);
  const daily = useSelector((s) => s.pricing?.daily || []);

  const [selectedServiceCode, setSelectedServiceCode] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("default");
  const [month, setMonth] = useState(() => `${currentYear}-${pad2(new Date().getMonth() + 1)}`);
  const [monthOpen, setMonthOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!services.length) dispatch(fetchServices({ limit: 500 }));
  }, [dispatch, services.length]);

  const serviceOptions = useMemo(() => {
    const list = (services || []).map((s) => {
      const code = s.code || s.slug || s._id;
      return { code, name: s.name || code, label: `${code}${s.name ? ` - ${s.name}` : ""}`, raw: s };
    });
    // dedupe by code
    const seen = new Set();
    return list.filter((o) => {
      if (!o.code || seen.has(o.code)) return false;
      seen.add(o.code);
      return true;
    });
  }, [services]);

  useEffect(() => {
    if (!selectedServiceCode && serviceOptions.length) {
      setSelectedServiceCode(serviceOptions[0].code);
    } else if (selectedServiceCode && serviceOptions.length && !serviceOptions.some((o) => o.code === selectedServiceCode)) {
      setSelectedServiceCode(serviceOptions[0].code);
    }
  }, [serviceOptions, selectedServiceCode]);

  useEffect(() => {
    if (!selectedServiceCode) return;
    dispatch(fetchPricingRules({ serviceCode: selectedServiceCode, packageId: selectedPackage }));
    dispatch(fetchDailyPrices({ serviceCode: selectedServiceCode, packageId: selectedPackage, month }));
  }, [dispatch, selectedServiceCode, selectedPackage, month]);

  const currentRule = useMemo(() => {
    return (
      rules.find((r) => r.serviceCode === selectedServiceCode && (r.packageId || "default") === selectedPackage) ||
      rules.find((r) => r.serviceCode === selectedServiceCode) ||
      null
    );
  }, [rules, selectedServiceCode, selectedPackage]);

  const dailyRows = useMemo(() => {
    const list = daily.filter(
      (d) => d.serviceCode === selectedServiceCode && (d.packageId || "default") === selectedPackage && String(d.date || "").startsWith(month)
    );
    return [...list].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [daily, selectedServiceCode, selectedPackage, month]);

  const packageOptions = useMemo(() => {
    const fromRules = rules
      .filter((r) => r.serviceCode === selectedServiceCode)
      .map((r) => ({ id: r.packageId || "default", label: r.packageName || r.packageId || "Mặc định" }));
    const map = new Map([["default", { id: "default", label: "Mặc định" }]]);
    fromRules.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [rules, selectedServiceCode]);

  const monthLabel = monthOptions.find((m) => m.value === month)?.label || month;

  const reload = async () => {
    if (!selectedServiceCode) return;
    await Promise.all([
      dispatch(fetchPricingRules({ serviceCode: selectedServiceCode, packageId: selectedPackage })),
      dispatch(fetchDailyPrices({ serviceCode: selectedServiceCode, packageId: selectedPackage, month })),
    ]);
  };

  const openRules = () => {
    const wRange = daysToRange(currentRule?.weekday?.days, "weekday");
    const weRange = daysToRange(currentRule?.weekend?.days, "weekend");
    const oRange = daysToRange(currentRule?.otherDays?.days ?? currentRule?.other?.days, "otherDays");
    setForm({
      weekday: pickRulePrice(currentRule?.weekday),
      weekend: pickRulePrice(currentRule?.weekend),
      otherDays: pickRulePrice(currentRule?.otherDays ?? currentRule?.other),
      lowSeason: pickRulePrice(currentRule?.lowSeason ?? currentRule?.low),
      holiday: pickRulePrice(currentRule?.holiday),
      weekdayFrom: wRange.from,
      weekdayTo: wRange.to,
      weekendFrom: weRange.from,
      weekendTo: weRange.to,
      otherFrom: oRange.from,
      otherTo: oRange.to,
      priorityNote: currentRule?.priorityNote || "",
      packageName: currentRule?.packageName || "",
    });
    setModal("rules");
  };

  const saveRules = async () => {
    if (!selectedServiceCode) return;
    try {
      setSaving(true);
      const svc = serviceOptions.find((o) => o.code === selectedServiceCode);
      const payload = {
        ...(currentRule?._id ? { _id: currentRule._id } : {}),
        serviceCode: selectedServiceCode,
        serviceName: svc?.name || selectedServiceCode,
        packageId: selectedPackage || "default",
        packageName: form.packageName || currentRule?.packageName || "",
        weekday: {
          ...(currentRule?.weekday && typeof currentRule.weekday === "object" ? currentRule.weekday : {}),
          price: Number(form.weekday || 0),
          days: rangeToDays(form.weekdayFrom ?? 1, form.weekdayTo ?? 5),
        },
        weekend: {
          ...(currentRule?.weekend && typeof currentRule.weekend === "object" ? currentRule.weekend : {}),
          price: Number(form.weekend || 0),
          days: rangeToDays(form.weekendFrom ?? 6, form.weekendTo ?? 0),
        },
        otherDays: {
          ...(currentRule?.otherDays && typeof currentRule.otherDays === "object" ? currentRule.otherDays : {}),
          price: Number(form.otherDays || 0),
          days: rangeToDays(form.otherFrom ?? 1, form.otherTo ?? 5),
        },
        lowSeason: {
          ...(currentRule?.lowSeason && typeof currentRule.lowSeason === "object" ? currentRule.lowSeason : {}),
          price: Number(form.lowSeason || 0),
        },
        holiday: {
          ...(currentRule?.holiday && typeof currentRule.holiday === "object" ? currentRule.holiday : {}),
          price: Number(form.holiday || 0),
        },
        priorityNote: form.priorityNote || "",
      };
      await dispatch(upsertPricingRule(payload)).unwrap();
      await reload();
      setModal(null);
    } catch (err) {
      alert(err || "Không thể lưu quy tắc giá.");
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const defaultDate = todayIso.startsWith(month) ? todayIso : `${month}-01`;
    setForm({
      date: defaultDate,
      dateTo: defaultDate,
      applyDayFrom: 1,
      applyDayTo: 0,
      finalPrice: pickRulePrice(currentRule?.weekday) || 0,
      basePrice: pickRulePrice(currentRule?.weekday) || 0,
      note: "",
      type: dayTypeLabel(defaultDate),
    });
    setModal("add");
  };

  const openRowEdit = (row) => {
    setForm({
      _id: row._id,
      date: row.date,
      finalPrice: row.finalPrice ?? row.basePrice ?? 0,
      basePrice: row.basePrice ?? row.finalPrice ?? 0,
      note: row.note || "",
      type: row.type || dayTypeLabel(row.date),
    });
    setModal("row");
  };

  const saveDaily = async () => {
    if (!selectedServiceCode) return;
    if (!form.date) { alert("Vui lòng chọn ngày áp dụng."); return; }

    const basePrice = Number(form.basePrice || 0);
    const finalPrice = Number(form.finalPrice || form.basePrice || 0);
    const adjust = finalPrice - basePrice;

    try {
      setSaving(true);

      if (modal === "row") {
        const payload = {
          serviceCode: selectedServiceCode,
          packageId: selectedPackage || "default",
          date: form.date,
          type: form.type || dayTypeLabel(form.date),
          basePrice,
          finalPrice,
          adjust,
          note: form.note || "",
        };
        await dispatch(upsertDailyPrice(payload)).unwrap();
      } else {
        const startStr = form.date;
        const endStr = form.dateTo && form.dateTo >= form.date ? form.dateTo : form.date;
        const allowedDays = new Set(rangeToDays(form.applyDayFrom ?? 1, form.applyDayTo ?? 0));
        const items = [];
        let cursor = new Date(`${startStr}T00:00:00`);
        const end = new Date(`${endStr}T00:00:00`);
        if (Number.isNaN(cursor.getTime()) || Number.isNaN(end.getTime())) {
          alert("Ngày áp dụng không hợp lệ.");
          setSaving(false);
          return;
        }
        let guard = 0;
        while (cursor <= end && guard < 366) {
          const iso = `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-${pad2(cursor.getDate())}`;
          if (allowedDays.has(cursor.getDay())) {
            items.push({
              serviceCode: selectedServiceCode,
              packageId: selectedPackage || "default",
              date: iso,
              type: dayTypeLabel(iso),
              basePrice,
              finalPrice,
              adjust,
              note: form.note || "",
            });
          }
          cursor.setDate(cursor.getDate() + 1);
          guard += 1;
        }
        if (!items.length) {
          alert("Không có ngày nào phù hợp với khoảng ngày và khoảng thứ đã chọn.");
          setSaving(false);
          return;
        }
        await dispatch(upsertDailyPrice({ items })).unwrap();
      }

      const targetMonth = String((modal === "row" ? form.date : (form.dateTo || form.date)) || month).slice(0, 7);
      if (targetMonth && targetMonth !== month) setMonth(targetMonth);
      await dispatch(fetchDailyPrices({ serviceCode: selectedServiceCode, packageId: selectedPackage, month: targetMonth || month }));
      setModal(null);
    } catch (err) {
      alert(err || "Không thể lưu giá theo ngày.");
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = () => {
    const header = ["Ngày áp dụng", "Loại ngày", "Giá cơ bản", "Điều chỉnh", "Giá cuối", "Ghi chú"];
    const lines = [header.map((c) => `"${c}"`).join(",")];
    dailyRows.forEach((row) => {
      const base = Number(row.basePrice || 0);
      const finalP = Number(row.finalPrice ?? row.basePrice ?? 0);
      const adjust = Number(row.adjust ?? (finalP - base));
      const d = row.date ? new Date(`${row.date}T00:00:00`) : null;
      const label = row.date && d && !Number.isNaN(d.getTime())
        ? `${row.date} • ${WEEKDAY_NAMES[d.getDay()]}`
        : (row.date || "");
      lines.push([label, row.type || dayTypeLabel(row.date), base, adjust, finalP, row.note || ""].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bang-gia-${selectedServiceCode || "dich-vu"}-${month}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const MonthButton = ({ className = "" }) => (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setMonthOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#e6eef2] bg-white px-3.5 py-[7px] text-[11px] font-semibold text-[#31434e]"
      >
        <span>{monthLabel}</span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition ${monthOpen ? "rotate-180" : ""}`} />
      </button>
      {monthOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMonthOpen(false)} />
          <ul className="absolute right-0 z-20 mt-1 max-h-[260px] w-[170px] overflow-auto rounded-lg border border-[#e6eef2] bg-white py-1 shadow-lg">
            {monthOptions.map((m) => (
              <li key={m.value}>
                <button
                  type="button"
                  onClick={() => { setMonth(m.value); setMonthOpen(false); }}
                  className={`block w-full px-3 py-1.5 text-left text-[11px] transition ${m.value === month ? "bg-[#e5f5f6] font-semibold text-[#008478]" : "font-medium text-[#31434e] hover:bg-slate-50"}`}
                >
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const ruleBuckets = ["weekday", "weekend", "otherDays"];
  const fixedBuckets = ["lowSeason", "holiday"];

  return (
    <div className="space-y-4 pb-2">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[24px] leading-tight font-extrabold tracking-[-0.02em] text-[#023648] sm:text-[26px]">Quản lý bảng giá</h1>
          <p className="mt-1.5 text-[11px] text-slate-400">
            <span className="hidden sm:inline">Áp dụng theo ngày, mùa và loại dịch vụ. Tất cả giá tính bằng VNĐ.</span>
            <span className="sm:hidden">Giá theo ngày, mùa và dịp lễ/Tết.</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button type="button" onClick={exportExcel} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e6eef2] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#31434e] transition hover:bg-slate-50 sm:flex-none">
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Xuất Excel</span>
          </button>
          <button type="button" onClick={openAdd} disabled={!selectedServiceCode} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#00749d] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#006688] disabled:opacity-50 sm:flex-none">
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm bảng giá</span>
          </button>
        </div>
      </div>

      {/* CHỌN DỊCH VỤ / GÓI */}
      <section className="rounded-2xl bg-white px-4 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr] sm:gap-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Dịch vụ</label>
            <div className="relative">
              <select
                value={selectedServiceCode}
                onChange={(e) => { setSelectedServiceCode(e.target.value); setSelectedPackage("default"); }}
                className="h-[34px] w-full appearance-none rounded-lg border border-[#e6eef2] bg-white px-3 pr-8 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]"
              >
                {serviceOptions.length === 0 && <option value="">Đang tải dịch vụ...</option>}
                {serviceOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="hidden sm:block">
            <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Gói / Loại phòng</label>
            <div className="relative">
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="h-[34px] w-full appearance-none rounded-lg border border-[#e6eef2] bg-white px-3 pr-8 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]"
              >
                {packageOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-[11px] text-slate-400 sm:hidden">
          {packageOptions.find((p) => p.id === selectedPackage)?.label || "Mặc định"}
        </p>
      </section>

      {/* QUY TẮC GIÁ */}
      <section className="rounded-2xl bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-bold text-[#023648]">
            <span className="hidden sm:inline">Quy tắc giá hiện hành</span>
            <span className="sm:hidden">Quy tắc giá</span>
          </h2>
          <button type="button" onClick={openRules} disabled={!selectedServiceCode} className="hidden items-center gap-1 text-[11px] font-semibold text-[#00749d] hover:underline disabled:opacity-50 sm:inline-flex">
            <span>Chỉnh sửa quy tắc</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-5">
          {([...ruleBuckets, ...fixedBuckets]).map((key) => {
            const meta = ruleLabel[key];
            const raw = currentRule?.[key] ?? (key === "lowSeason" ? currentRule?.low : null) ?? (key === "otherDays" ? currentRule?.other : null);
            const val = pickRulePrice(raw);
            const sub = ruleBuckets.includes(key)
              ? dayRangeLabel(raw?.days, key)
              : (key === "lowSeason" ? "Mùa thấp điểm" : "Ngày lễ, cao điểm");
            return (
              <div key={key} className={`rounded-xl px-3.5 py-3 ${meta.bg}`}>
                <span className="block text-[10.5px] font-medium text-slate-500">{meta.label}</span>
                <span className={`mt-1.5 block text-[19px] leading-none font-extrabold tracking-tight sm:text-[22px] ${meta.priceColor}`}>
                  {val ? `${fmt(val)}đ` : "—"}
                </span>
                <span className="mt-1.5 block text-[10px] text-slate-400">{sub}</span>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={openRules} disabled={!selectedServiceCode} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e6eef2] bg-white py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50 disabled:opacity-50 sm:hidden">
          <span>Chỉnh sửa quy tắc</span>
        </button>
      </section>

      {/* GIÁ THEO NGÀY */}
      <div className="pt-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-extrabold text-[#023648]">
            <span className="hidden sm:inline">Lịch giá theo ngày</span>
            <span className="sm:hidden">Giá theo ngày</span>
          </h3>
          <MonthButton className="hidden w-[170px] sm:block" />
        </div>

        <MonthButton className="mt-3 sm:hidden" />

        {/* MOBILE ROWS */}
        <div className="mt-3 space-y-2.5 sm:hidden">
          {dailyRows.slice(0, 8).map((item) => {
            const finalP = Number(item.finalPrice ?? item.basePrice ?? 0);
            const d = item.date ? new Date(`${item.date}T00:00:00`) : null;
            const shortDate = d && !Number.isNaN(d.getTime()) ? `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)} - ${WEEKDAY_NAMES[d.getDay()]}` : (item.date || "");
            return (
              <div key={item._id || item.date} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5">
                <div>
                  <span className="block text-[11.5px] font-bold text-[#023648]">{shortDate}</span>
                  <span className="mt-1 block text-[10.5px] text-slate-400">{item.type || dayTypeLabel(item.date)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[13px] font-extrabold text-[#00749d]">{fmt(finalP)}đ</span>
                  <button type="button" onClick={() => openRowEdit(item)} className="mt-1 inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-[#00749d]">
                    <span>Chỉnh sửa</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
          {dailyRows.length === 0 && (
            <div className="rounded-2xl bg-white px-4 py-6 text-center text-[11px] text-slate-400">Chưa có giá theo ngày cho tháng này.</div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl bg-white sm:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#eff7fa]">
                <tr className="text-[10.5px] text-slate-500">
                  <th className="px-3 py-[11px] font-semibold">Ngày áp dụng</th>
                  <th className="px-3 py-[11px] font-semibold">Loại ngày</th>
                  <th className="px-3 py-[11px] font-semibold">Giá cơ bản</th>
                  <th className="px-3 py-[11px] font-semibold">Điều chỉnh</th>
                  <th className="px-3 py-[11px] font-semibold">Giá cuối</th>
                  <th className="px-3 py-[11px] text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dailyRows.map((row) => {
                  const base = Number(row.basePrice || 0);
                  const finalP = Number(row.finalPrice ?? row.basePrice ?? 0);
                  const adjust = Number(row.adjust ?? (finalP - base));
                  const d = row.date ? new Date(`${row.date}T00:00:00`) : null;
                  const dateLabel = d && !Number.isNaN(d.getTime()) ? `${row.date} • ${WEEKDAY_NAMES[d.getDay()]}` : (row.date || "");
                  return (
                    <tr key={row._id || row.date} className="border-t border-[#f1f6f8]">
                      <td className="px-3 py-[14px] text-[11px] font-semibold text-[#023648]">{dateLabel}</td>
                      <td className="px-3 py-[14px] text-[11px] text-[#546f7c]">{row.type || dayTypeLabel(row.date)}</td>
                      <td className="px-3 py-[14px] text-[11px] text-[#546f7c]">{fmt(base)}</td>
                      <td className={`px-3 py-[14px] text-[11px] ${adjust > 0 ? "font-semibold text-[#b87a00]" : adjust < 0 ? "font-semibold text-[#008478]" : "text-slate-400"}`}>
                        {adjust > 0 ? `+${fmt(adjust)}` : adjust < 0 ? fmt(adjust) : "0"}
                      </td>
                      <td className="px-3 py-[14px] text-[11px] font-semibold text-[#023648]">{fmt(finalP)}đ</td>
                      <td className="px-3 py-[14px] text-right">
                        <button type="button" onClick={() => openRowEdit(row)} className="inline-flex items-center gap-1 rounded-md border border-[#e6eef2] px-2 py-1 text-[10.5px] font-semibold text-[#31434e] hover:bg-slate-50">
                          <span>Sửa</span>
                          <span className="text-slate-400">•••</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {dailyRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-[11px] text-slate-400">Chưa có giá theo ngày cho tháng này. Nhấn "Thêm bảng giá" để tạo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GHI CHÚ ƯU TIÊN */}
      <div className="rounded-2xl bg-[#e5f5f6] px-5 py-[22px]">
        <p className="text-[11px] font-bold text-[#008478]">Ưu tiên giá: Ngày lễ &gt; Thấp điểm &gt; Các ngày khác trong tuần / Cuối tuần / Ngày thường &gt; Giá mặc định</p>
        <p className="mt-1.5 text-[11px] text-[#768f99]">
          {currentRule?.priorityNote || "Kiểm tra ngày hiệu lực và đơn vị trước khi xuất bản."}
        </p>
      </div>

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#032f42]/50 p-4">
          <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-xl bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-extrabold text-[#023648]">
                {modal === "rules" ? "Chỉnh sửa quy tắc giá" : modal === "add" ? "Thêm bảng giá" : "Chỉnh sửa giá theo ngày"}
              </h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-[#023648]" aria-label="Đóng">
                <X className="h-4 w-4" />
              </button>
            </div>

            {modal === "rules" && (
              <div className="mt-4 space-y-4">
                {ruleBuckets.map((key) => {
                  const label = ruleLabel[key].label;
                  const fromKey = key === "weekday" ? "weekdayFrom" : key === "weekend" ? "weekendFrom" : "otherFrom";
                  const toKey = key === "weekday" ? "weekdayTo" : key === "weekend" ? "weekendTo" : "otherTo";
                  return (
                    <div key={key} className="rounded-lg border border-[#e6eef2] p-3">
                      <p className="text-[11.5px] font-bold text-[#023648]">{label}</p>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <label className="block sm:col-span-1">
                          <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Giá (VNĐ)</span>
                          <input type="number" min="0" step="50000" value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={priceInput} />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Từ thứ</span>
                          <div className="relative">
                            <select value={form[fromKey] ?? 1} onChange={(e) => setForm({ ...form, [fromKey]: Number(e.target.value) })} className={selectInput}>
                              {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          </div>
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Đến thứ</span>
                          <div className="relative">
                            <select value={form[toKey] ?? 5} onChange={(e) => setForm({ ...form, [toKey]: Number(e.target.value) })} className={selectInput}>
                              {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {fixedBuckets.map((key) => (
                    <label key={key} className="block">
                      <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">{ruleLabel[key].label} (VNĐ)</span>
                      <input type="number" min="0" step="50000" value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={priceInput} />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Ghi chú ưu tiên</span>
                  <input type="text" value={form.priorityNote || ""} onChange={(e) => setForm({ ...form, priorityNote: e.target.value })} className={priceInput} />
                </label>
              </div>
            )}

            {(modal === "add" || modal === "row") && (
              <div className="mt-4 space-y-3">
                {modal === "row" ? (
                  <div className="rounded-lg bg-[#eff7fa] px-3 py-2 text-[11px] text-[#546f7c]">
                    <p className="font-semibold text-[#023648]">{form.date}</p>
                    <p className="mt-0.5">Loại ngày: {form.type || dayTypeLabel(form.date)}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Từ ngày</span>
                      <input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value, dateTo: form.dateTo && form.dateTo < e.target.value ? e.target.value : (form.dateTo || e.target.value), type: dayTypeLabel(e.target.value) })} className={priceInput} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Đến ngày</span>
                      <input type="date" value={form.dateTo || form.date || ""} min={form.date || undefined} onChange={(e) => setForm({ ...form, dateTo: e.target.value })} className={priceInput} />
                    </label>
                  </div>
                )}

                {modal === "row" ? (
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Ngày áp dụng</span>
                    <input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value, type: dayTypeLabel(e.target.value) })} className={priceInput} />
                  </label>
                ) : (
                  <div className="rounded-lg border border-[#e6eef2] p-3">
                    <p className="text-[11px] font-semibold text-[#546f7c]">Áp dụng cho các ngày trong tuần (từ thứ đến thứ)</p>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Từ thứ</span>
                        <div className="relative">
                          <select value={form.applyDayFrom ?? 1} onChange={(e) => setForm({ ...form, applyDayFrom: Number(e.target.value) })} className={selectInput}>
                            {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        </div>
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Đến thứ</span>
                        <div className="relative">
                          <select value={form.applyDayTo ?? 0} onChange={(e) => setForm({ ...form, applyDayTo: Number(e.target.value) })} className={selectInput}>
                            {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        </div>
                      </label>
                    </div>
                    <p className="mt-1.5 text-[10.5px] text-slate-400">Chỉ các ngày trong khoảng ngày thuộc các thứ đã chọn sẽ được tạo/cập nhật (mặc định Thứ 2 đến Chủ nhật).</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Giá cơ bản (VNĐ)</span>
                    <input type="number" min="0" step="50000" value={form.basePrice ?? ""} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className={priceInput} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Giá cuối (VNĐ)</span>
                    <input type="number" min="0" step="50000" value={form.finalPrice ?? ""} onChange={(e) => setForm({ ...form, finalPrice: e.target.value })} className={priceInput} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-[#546f7c]">Ghi chú</span>
                  <input type="text" value={form.note || ""} onChange={(e) => setForm({ ...form, note: e.target.value })} className={priceInput} />
                </label>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-[#e6eef2] px-3.5 py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50">Hủy</button>
              <button
                type="button"
                disabled={saving}
                onClick={modal === "rules" ? saveRules : saveDaily}
                className="rounded-lg bg-[#00749d] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#006688] disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : modal === "rules" ? "Lưu quy tắc" : "Lưu giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
