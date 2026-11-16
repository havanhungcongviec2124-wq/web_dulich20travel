import { useState } from "react";
import { Download, Plus, ChevronDown, Edit3 } from "lucide-react";
import { pricingRules } from "../data/mockData";

const dailyPrices = [
  {
    date: "20/11/2026 • Thứ Sáu",
    type: "Ngày thường",
    basePrice: "2.450.000",
    adjust: "0",
    finalPrice: "2.450.000đ",
  },
  {
    date: "21/11/2026 • Thứ Bảy",
    type: "Cuối tuần",
    basePrice: "2.850.000",
    adjust: "0",
    finalPrice: "2.850.000đ",
  },
  {
    date: "22/11/2026 • Chủ Nhật",
    type: "Cuối tuần",
    basePrice: "2.850.000",
    adjust: "0",
    finalPrice: "2.850.000đ",
  },
  {
    date: "23/11/2026 • Thứ Hai",
    type: "Ngày thường",
    basePrice: "2.450.000",
    adjust: "0",
    finalPrice: "2.450.000đ",
  },
];

const AdminPricing = () => {
  const [selectedService, setSelectedService] = useState("KS001");
  const [selectedPackage, setSelectedPackage] = useState("Deluxe");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
            Quản lý bảng giá
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Áp dụng theo ngày, mùa và loại dịch vụ. Tất cả giá tính bằng VNĐ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Xuất Excel
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bảng giá</span>
          </button>
        </div>
      </div>

      {/* 2. SELECT SERVICE & PACKAGE ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Dịch vụ
          </label>
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 appearance-none bg-white focus:outline-none focus:border-[#087eab]"
            >
              <option value="KS001">KS001 - Vinpearl Resort & Spa Hạ Long</option>
              <option value="DT002">DT002 - Du thuyền Ambassador</option>
              <option value="VV003">VV003 - Sun World Hạ Long</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            Gói / Loại phòng
          </label>
          <div className="relative">
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 appearance-none bg-white focus:outline-none focus:border-[#087eab]"
            >
              <option value="Deluxe">Deluxe - 02 người lớn</option>
              <option value="Suite">Suite Ocean View - 02 người lớn</option>
              <option value="Family">Family Villa - 04 người lớn</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. QUY TẮC GIÁ HIỆN HÀNH */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#103d54]">
            Quy tắc giá hiện hành
          </h2>
          <span className="text-xs font-bold text-[#087eab] hover:underline cursor-pointer">
            Chỉnh sửa quy tắc →
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ngày thường */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {pricingRules.weekday.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#103d54] tracking-tight">
              {new Intl.NumberFormat("vi-VN").format(pricingRules.weekday.price)}đ
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">
              {pricingRules.weekday.sub}
            </span>
          </div>

          {/* Cuối tuần */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {pricingRules.weekend.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#103d54] tracking-tight">
              {new Intl.NumberFormat("vi-VN").format(pricingRules.weekend.price)}đ
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">
              {pricingRules.weekend.sub}
            </span>
          </div>

          {/* Thấp điểm */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-slate-500">
              {pricingRules.lowSeason.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#103d54] tracking-tight">
              {new Intl.NumberFormat("vi-VN").format(pricingRules.lowSeason.price)}đ
            </div>
            <span className="text-[11px] text-slate-400 block pt-1">
              {pricingRules.lowSeason.sub}
            </span>
          </div>

          {/* Lễ / Tết */}
          <div className="bg-[#fff9ed] rounded-2xl p-5 border border-[#faecd2] shadow-xs space-y-1">
            <span className="text-xs font-semibold text-amber-700">
              {pricingRules.holiday.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#b87a00] tracking-tight">
              {new Intl.NumberFormat("vi-VN").format(pricingRules.holiday.price)}đ
            </div>
            <span className="text-[11px] text-amber-600 block pt-1">
              {pricingRules.holiday.sub}
            </span>
          </div>
        </div>
      </div>

      {/* 4. LỊCH GIÁ THEO NGÀY (TABLE) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h3 className="text-base font-black text-[#103d54]">
            Lịch giá theo ngày
          </h3>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <span>Tháng 11, 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-semibold">Ngày áp dụng</th>
                <th className="pb-3 font-semibold">Loại ngày</th>
                <th className="pb-3 font-semibold">Giá cơ bản</th>
                <th className="pb-3 font-semibold">Điều chỉnh</th>
                <th className="pb-3 font-semibold">Giá cuối</th>
                <th className="pb-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailyPrices.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 font-bold text-slate-800">{row.date}</td>
                  <td className="py-3.5 text-slate-600">{row.type}</td>
                  <td className="py-3.5 text-slate-600">{row.basePrice}</td>
                  <td className="py-3.5 text-slate-400">{row.adjust}</td>
                  <td className="py-3.5 font-bold text-slate-800">{row.finalPrice}</td>
                  <td className="py-3.5 text-right">
                    <button className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition">
                      Sửa •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FOOTNOTE & PRIORITY */}
      <div className="bg-[#f0f9fb] rounded-2xl p-4 sm:p-5 border border-[#d8f0f4] space-y-1 text-xs">
        <p className="font-bold text-[#00877c]">
          {pricingRules.priorityNote}
        </p>
        <p className="text-slate-500">
          Giá đang xem là dữ liệu minh họa. Kiểm tra ngày hiệu lực và đơn vị trước khi xuất bản.
        </p>
      </div>
    </div>
  );
};

export default AdminPricing;

