import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ArrowRight } from "lucide-react";
import { fetchAdminStats } from "../redux/slices/adminSlice";
import { fetchServices } from "../redux/slices/catalogSlice";

const formatNumber = (n) => (n == null ? "—" : Number(n).toLocaleString("vi-VN"));
const formatPrice = (n) => (n == null ? "—" : `${Number(n).toLocaleString("vi-VN")}đ`);

const statusBadge = (s) => {
  if (!s) return "bg-slate-100 text-slate-500";
  if (String(s).includes("xuất bản") || String(s).includes("Hiển thị") || String(s).includes("published") || String(s).includes("Hợp lệ"))
    return "bg-[#e5f5f6] text-[#008478]";
  if (String(s).includes("lưu trữ") || String(s).includes("Ẩn") || String(s).includes("Tạm"))
    return "bg-slate-100 text-slate-500";
  return "bg-[#fff4d8] text-[#a56d00]";
};

const AdminOverview = () => {
  const dispatch = useDispatch();
  const stats = useSelector((s) => s.admin?.stats);
  const services = useSelector((s) => s.catalog?.services || []);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchServices({ limit: 20, sort: "updated" })).catch(() => dispatch(fetchServices({ limit: 20 })));
  }, [dispatch]);

  const totals = stats?.totals || {};
  const statCards = [
    { label: "DỊCH VỤ ĐANG QUẢN LÝ", value: formatNumber(totals.services ?? stats?.totalServices), note: "Khách sạn, du thuyền, vé vui chơi", path: "/admin/dich-vu" },
    { label: "DANH MỤC", value: String(totals.categories ?? 0).padStart(2, "0"), note: `${totals.categories ?? 0} danh mục đang hoạt động`, path: "/admin/dich-vu" },
    { label: "CẦN CẬP NHẬT GIÁ", value: String(stats?.needPriceUpdate ?? 0).padStart(2, "0"), note: stats?.needPriceUpdateNote || "Ưu tiên kiểm tra trước cuối tuần", path: "/admin/bang-gia" },
    { label: "NHÂN VIÊN TƯ VẤN", value: String(totals.activeConsultants ?? stats?.activeConsultants ?? totals.consultants ?? 0).padStart(2, "0"), note: "Đang hiển thị trên website", path: "/admin/nhan-vien" },
  ];

  const barData = useMemo(() => {
    const breakdown = stats?.categoryBreakdown || [];
    if (breakdown.length) {
      return breakdown.slice(0, 5).map((b) => ({
        key: b.key || b.name,
        label: b.name || b.key,
        value: b.count || 0,
        max: b.max || Math.max(1, ...breakdown.map((x) => x.count || 0)),
        note: `${b.count || 0} dịch vụ`,
      }));
    }
    // fallback from loaded services
    const map = new Map();
    services.forEach((s) => {
      const k = s.category || "khác";
      map.set(k, (map.get(k) || 0) + 1);
    });
    const arr = Array.from(map.entries()).map(([k, v]) => ({ key: k, label: k, value: v }));
    const max = Math.max(1, ...arr.map((a) => a.value));
    return arr.slice(0, 5).map((a) => ({ ...a, max, note: `${a.value} dịch vụ` }));
  }, [stats, services]);

  const chartData = useMemo(() => {
    const trend = stats?.weeklyTrend;
    if (Array.isArray(trend) && trend.length) return trend;
    return [
      { week: "T1", value: 4 }, { week: "T2", value: 6 }, { week: "T3", value: 5 },
      { week: "T4", value: 7 }, { week: "T5", value: 6 }, { week: "T6", value: 8 },
      { week: "T7", value: 9 }, { week: "T8", value: 7, isMax: true },
    ].map((w, i, arr) => ({ ...w, isMax: w.value === Math.max(...arr.map((x) => x.value)) }));
  }, [stats]);
  const chartMax = Math.max(...chartData.map((c) => c.value || 0), 1);
  const chartTotal = chartData.reduce((sum, c) => sum + (c.value || 0), 0);

  const serviceOptions = useMemo(() => {
    const names = Array.from(new Set((services || []).map((s) => s.name).filter(Boolean)));
    return names.slice(0, 20);
  }, [services]);

  const recentUpdates = useMemo(() => {
    let rows = (services || []).map((s) => {
      const dateStr = s.updatedAtLabel || (s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("vi-VN") : "");
      const m = String(dateStr).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      const month = m ? m[2] : "";
      return {
        id: s._id || s.slug,
        service: s.name,
        date: dateStr,
        month,
        price: formatPrice(s.price),
        editor: s.consultant || s.updatedBy || "Hệ thống",
        status: s.status || (s.published === false ? "Ẩn" : "Đã xuất bản"),
      };
    });
    if (serviceFilter !== "all") rows = rows.filter((r) => r.service === serviceFilter);
    if (monthFilter !== "all") rows = rows.filter((r) => r.month === monthFilter);
    return rows.slice(0, 8);
  }, [services, serviceFilter, monthFilter]);

  const monthsAvailable = useMemo(() => {
    const ms = new Set();
    (services || []).forEach((s) => {
      const dateStr = s.updatedAtLabel || (s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("vi-VN") : "");
      const m = String(dateStr).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (m) ms.add(m[2]);
    });
    return Array.from(ms).sort();
  }, [services]);

  return (
    <div>
      {/* TOP BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-tight font-extrabold text-[#023648]">
            Tổng quan vận hành
          </h1>
          <p className="mt-1 text-[12px] text-slate-400">
            Nắm nhanh tình trạng dịch vụ, giá và nội dung trong ngày.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-[#f0f9fb] px-3.5 py-1.5 text-[11.5px] font-semibold text-[#00749d]">
            Hôm nay: {new Date().toLocaleDateString("vi-VN")}
          </span>
          <Link
            to="/admin/dich-vu"
            className="rounded-md bg-[#00749d] px-5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#006688]"
          >
            + Thêm dịch vụ
          </Link>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="group block rounded-xl border border-[#e6eef2] bg-white px-5 py-4 transition hover:shadow-sm"
          >
            <p className="text-[9.5px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
              {stat.label}
            </p>
            <p className="mt-2.5 text-[28px] leading-none font-extrabold text-[#023648]">
              {stat.value}
            </p>
            <p className="mt-2 text-[11px] text-slate-500">{stat.note}</p>
            <span className="mt-2.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#00749d] opacity-0 transition group-hover:opacity-100">
              Xem chi tiết <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      {/* 2 CỘT: BAR + CHART */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-[#e6eef2] bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-extrabold text-[#023648]">Dịch vụ theo danh mục</h2>
              <p className="mt-0.5 text-[11px] text-slate-400">Phân bổ số lượng dịch vụ đang hiển thị</p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-[#00749d]">Dữ liệu hệ thống</span>
          </div>

          <div className="mt-5 space-y-4">
            {barData.map((item) => (
              <div key={item.key || item.label}>
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#023648]">{item.label}</span>
                  <span className="text-[11px] text-slate-400">{item.note}</span>
                </div>
                <div className="h-[6px] w-full rounded-full bg-[#e5f5f6]">
                  <div
                    className="h-full rounded-full bg-[#008478]"
                    style={{ width: `${Math.min(100, ((item.value || 0) / (item.max || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {barData.length === 0 && <p className="text-[12px] text-slate-400">Chưa có dữ liệu.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-[#e6eef2] bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-extrabold text-[#023648]">Hoạt động cập nhật</h2>
              <p className="mt-0.5 text-[11px] text-slate-400">Số lượt chỉnh sửa theo thời gian</p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-slate-400">8 tuần gần đây</span>
          </div>

          <div className="mt-5 flex h-[190px] items-end justify-between gap-2 px-1">
            {chartData.map((item, idx) => {
              const height = 18 + ((item.value || 0) / chartMax) * 130;
              return (
                <div key={item.week || idx} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full max-w-[28px] rounded-t-[6px] ${item.isMax ? "bg-[#008478]" : "bg-[#cfe9eb]"}`}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-[10px] font-medium text-slate-400">{item.week}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 border-t border-[#f1f6f8] pt-3 text-[11px] text-slate-400">
            Tổng cộng <span className="font-bold text-[#023648]">{chartTotal} lượt</span> chỉnh sửa trong giai đoạn này.
          </div>
        </div>
      </div>

      {/* BẢNG CẬP NHẬT GẦN ĐÂY */}
      <div className="mt-4 rounded-xl border border-[#e6eef2] bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[14px] font-extrabold text-[#023648]">Cập nhật giá gần đây</h2>
            <p className="mt-0.5 text-[11px] text-slate-400">Lịch sử thay đổi giá dịch vụ trong hệ thống</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="appearance-none rounded-md border border-[#e6eef2] bg-white py-1.5 pr-7 pl-3 text-[11px] font-medium text-[#31434e] outline-none"
              >
                <option value="all">Dịch vụ</option>
                {serviceOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="appearance-none rounded-md border border-[#e6eef2] bg-white py-1.5 pr-7 pl-3 text-[11px] font-medium text-[#31434e] outline-none"
              >
                <option value="all">Tháng</option>
                {monthsAvailable.map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#edf3f5] text-[10.5px] font-semibold text-slate-400">
                <th className="py-2.5 pr-3 font-semibold">Dịch vụ</th>
                <th className="py-2.5 pr-3 font-semibold">Ngày áp dụng</th>
                <th className="py-2.5 pr-3 font-semibold">Giá (VNĐ)</th>
                <th className="py-2.5 pr-3 font-semibold">Người chỉnh sửa</th>
                <th className="py-2.5 pr-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentUpdates.map((row) => (
                <tr key={row.id} className="border-b border-[#f4f8fa] text-[#31434e] last:border-0">
                  <td className="py-3 pr-3 font-semibold text-[#023648]">{row.service}</td>
                  <td className="py-3 pr-3 text-slate-500">{row.date || "—"}</td>
                  <td className="py-3 pr-3 font-semibold">{row.price}</td>
                  <td className="py-3 pr-3 text-slate-600">{row.editor}</td>
                  <td className="py-3 pr-3">
                    <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-semibold ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentUpdates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[12px] text-slate-400">Chưa có dữ liệu cập nhật.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link
          to="/admin/lich-su"
          className="mt-4 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#00749d] hover:underline"
        >
          Xem lịch sử chi tiết <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default AdminOverview;
