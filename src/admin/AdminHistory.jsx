import { useState } from "react";
import { Download, Search, ChevronDown, CheckCircle2 } from "lucide-react";
import { activityLogs } from "../data/mockData";

const AdminHistory = () => {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pricing" | "auth"
  const [selectedLog, setSelectedLog] = useState(activityLogs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("all");

  const filteredLogs = activityLogs.filter((log) => {
    if (activeTab === "pricing" && log.action !== "Cập nhật giá") return false;
    if (
      activeTab === "auth" &&
      log.action !== "Import Excel" &&
      log.action !== "Đăng nhập"
    )
      return false;
    if (searchQuery && !log.target.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    if (selectedAdmin !== "all" && log.admin !== selectedAdmin) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
            Lịch sử hoạt động
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi ai đã thay đổi điều gì, vào thời điểm nào.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-xs"
          >
            <span>Xuất nhật ký</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex items-center gap-2">
        {[
          { id: "all", label: "Tất cả hoạt động" },
          { id: "pricing", label: "Thay đổi giá" },
          { id: "auth", label: "Đăng nhập & hệ thống" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? "bg-[#087eab] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. FILTERS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm mã hoặc tên dịch vụ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none bg-white"
          >
            <option value="all">Tất cả Admin</option>
            <option value="Minh Anh">Minh Anh</option>
            <option value="Hoàng Nam">Hoàng Nam</option>
          </select>
        </div>

        <div>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <span>01/11 – 16/11/2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT: TABLE & DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Cột trái: Bảng lịch sử */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3.5 px-5 font-semibold">Thời gian</th>
                  <th className="py-3.5 px-4 font-semibold">Admin</th>
                  <th className="py-3.5 px-4 font-semibold">Hoạt động</th>
                  <th className="py-3.5 px-5 font-semibold">Đối tượng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`cursor-pointer transition ${
                      selectedLog?.id === log.id ? "bg-[#f0f9fb]" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-800">{log.time}</td>
                    <td className="py-3.5 px-4 text-slate-600">{log.admin}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{log.action}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-500">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>Hiển thị 1–{filteredLogs.length} trên 248 hoạt động • Nhật ký chỉ đọc</span>
            <div className="flex items-center gap-1 self-center">
              <button className="px-2 py-1 rounded border border-slate-200">←</button>
              <button className="px-2 py-1 rounded bg-[#087eab] text-white font-bold">1</button>
              <button className="px-2 py-1 rounded border border-slate-200">2</button>
              <button className="px-2 py-1 rounded border border-slate-200">3</button>
              <span className="px-1">...</span>
              <button className="px-2 py-1 rounded border border-slate-200">→</button>
            </div>
          </div>
        </div>

        {/* Cột phải: Chi tiết thay đổi */}
        {selectedLog && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-[#103d54]">
              Chi tiết thay đổi
            </h3>

            {/* Badge */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#eaf6f7] text-[#00877c] text-xs font-bold">
                {selectedLog.action}
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-[#103d54]">
                {selectedLog.targetName}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Ngày áp dụng: {selectedLog.dateApplied}
              </p>
              <p className="text-xs text-slate-400">
                {selectedLog.packageInfo}
              </p>
            </div>

            {/* Before / After cards */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  TRƯỚC
                </span>
                <span className="text-2xl font-black text-slate-500">
                  {selectedLog.priceBefore}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#eaf6f7] border border-[#d2eeec] space-y-1">
                <span className="text-[10px] font-bold text-[#00877c] tracking-wider uppercase block">
                  SAU
                </span>
                <span className="text-2xl font-black text-[#087eab]">
                  {selectedLog.priceAfter}
                </span>
              </div>
            </div>

            {/* Metadata info */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
              <p>Bởi {selectedLog.admin} • {selectedLog.timestamp}</p>
              <p className="text-slate-600 font-medium">Lý do: {selectedLog.reason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistory;

