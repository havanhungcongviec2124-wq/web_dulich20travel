import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { adminStats } from "../data/mockData";

const recentPriceUpdates = [
  {
    service: "Vinpearl Resort & Spa",
    serviceFull: "Vinpearl Resort & Spa Hạ Long",
    date: "20/11/2026",
    price: "2.450.000đ",
    editor: "Minh Anh",
    status: "Đã xuất bản",
  },
  {
    service: "Du thuyền Ambassador",
    serviceFull: "Du thuyền Ambassador",
    date: "21/11/2026",
    price: "3.650.000đ",
    editor: "Hoàng Nam",
    status: "Đã xuất bản",
  },
  {
    service: "Sun World Hạ Long",
    serviceFull: "Sun World Hạ Long",
    date: "20/11/2026",
    price: "350.000đ",
    editor: "Minh Anh",
    status: "Đã xuất bản",
  },
];

const AdminOverview = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
            Một ngày tốt lành, Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Thứ Hai, 16/11/2026 • Dữ liệu minh họa
          </p>
        </div>

        {/* Dropdown month */}
        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <span>Tháng 11, 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. STAT CARDS (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Tổng dịch vụ</span>
          <div className="text-3xl sm:text-4xl font-black text-[#103d54] tracking-tight">
            {adminStats.totalServices}
          </div>
          <span className="text-[11px] font-semibold text-[#00877c] block pt-1">
            {adminStats.totalServicesChange}
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Bảng giá hiệu lực</span>
          <div className="text-3xl sm:text-4xl font-black text-[#103d54] tracking-tight">
            {adminStats.activePrices}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {adminStats.activePricesRatio}
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Cần cập nhật giá</span>
          <div className="text-3xl sm:text-4xl font-black text-[#b87a00] tracking-tight">
            {adminStats.needPriceUpdate}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {adminStats.needPriceUpdateNote}
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Nhân viên tư vấn</span>
          <div className="text-3xl sm:text-4xl font-black text-[#103d54] tracking-tight">
            {adminStats.totalConsultants}
          </div>
          <span className="text-[11px] text-[#00877c] font-semibold block pt-1">
            {adminStats.activeConsultants} đang hoạt động
          </span>
        </div>
      </div>

      {/* 3. CHARTS & CATEGORIES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#103d54]">Nhịp cập nhật bảng giá</h3>
            <p className="text-xs text-slate-400 mt-0.5">8 tuần gần đây</p>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {adminStats.weeklyTrend.map((item) => (
              <div key={item.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: `${(item.value / 100) * 100}%` }}
                  className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                    item.isMax ? "bg-[#00877c]" : "bg-[#a8ded9] hover:bg-[#71c8c1]"
                  }`}
                />
                <span className="text-[11px] font-bold text-slate-400">{item.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theo danh mục (Hidden on mobile overview to match tongquan_mobile.png) */}
        <div className="hidden lg:block bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#103d54]">Theo danh mục</h3>
          </div>

          <div className="space-y-4 pt-2">
            {adminStats.categoryBreakdown.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">{item.name}</span>
                  <span className="text-[#103d54]">{item.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${(item.count / item.max) * 100}%` }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. GIÁ VỪA CẬP NHẬT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#103d54]">Giá vừa cập nhật</h3>
          <Link
            to="/admin/lich-su"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#087eab] hover:underline"
          >
            <span>Xem lịch sử</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Cards (matches tongquan_mobile.png) */}
        <div className="sm:hidden space-y-3">
          {recentPriceUpdates.map((row, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-[#103d54]">{row.service}</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {row.date} • {row.editor}
                </p>
              </div>
              <div className="text-sm font-black text-[#087eab]">
                {row.price}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (matches tongquan_web.png) */}
        <div className="hidden sm:block bg-white rounded-2xl p-6 border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Dịch vụ</th>
                  <th className="pb-3 font-semibold">Ngày áp dụng</th>
                  <th className="pb-3 font-semibold">Giá mới</th>
                  <th className="pb-3 font-semibold">Người sửa</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentPriceUpdates.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-800">{row.serviceFull}</td>
                    <td className="py-3 text-slate-500">{row.date}</td>
                    <td className="py-3 font-bold text-slate-800">{row.price}</td>
                    <td className="py-3 text-slate-600">{row.editor}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eaf6f7] text-[#00877c] font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00877c]"></span>
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
