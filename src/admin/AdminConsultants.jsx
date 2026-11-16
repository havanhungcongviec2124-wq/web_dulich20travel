import { useState } from "react";
import { Search, Plus, Upload, Trash2 } from "lucide-react";
import { consultants as initialConsultants } from "../data/mockData";

const AdminConsultants = () => {
  const [consultantList, setConsultantList] = useState(initialConsultants);
  const [selectedConsultant, setSelectedConsultant] = useState(initialConsultants[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConsultants = consultantList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleSave = () => {
    setConsultantList((prev) =>
      prev.map((c) => (c.id === selectedConsultant.id ? selectedConsultant : c))
    );
    alert("Đã lưu thông tin nhân viên!");
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      const nextList = consultantList.filter((c) => c.id !== selectedConsultant.id);
      setConsultantList(nextList);
      if (nextList.length > 0) setSelectedConsultant(nextList[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
            Nhân viên tư vấn
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý thông tin liên hệ và người đồng hành cùng khách hàng.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              const newConsultant = {
                id: `nv${Date.now()}`,
                name: "Nhân viên mới",
                role: "Khách sạn",
                specialty: "Tư vấn tour & khách sạn",
                phone: "0900 000 000",
                zalo: "https://zalo.me",
                facebook: "facebook.com/20travel",
                status: "Hoạt động",
                avatar: "/images/figma-consultant.jpg",
              };
              setConsultantList([newConsultant, ...consultantList]);
              setSelectedConsultant(newConsultant);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhân viên</span>
          </button>
        </div>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Tổng nhân viên</span>
          <div className="text-3xl font-black text-[#103d54]">
            {consultantList.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Đang hoạt động</span>
          <div className="text-3xl font-black text-[#00877c]">
            {consultantList.filter((c) => c.status === "Hoạt động").length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Tạm ẩn</span>
          <div className="text-3xl font-black text-slate-400">
            {consultantList.filter((c) => c.status !== "Hoạt động").length}
          </div>
        </div>
      </div>

      {/* 3. SEARCH BAR */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs relative max-w-lg">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm tên hoặc số điện thoại..."
          className="w-full pl-10 pr-4 py-1 text-xs font-medium text-slate-800 focus:outline-none"
        />
      </div>

      {/* 4. MAIN CONTENT: TABLE & EDIT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Cột trái: Bảng nhân viên */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3.5 px-5 font-semibold">Nhân viên</th>
                  <th className="py-3.5 px-4 font-semibold">Phụ trách</th>
                  <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConsultants.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedConsultant(c)}
                    className={`cursor-pointer transition ${
                      selectedConsultant?.id === c.id ? "bg-[#f0f9fb]" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-800">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.role}</td>
                    <td className="py-3.5 px-4">
                      {c.status === "Hoạt động" ? (
                        <span className="inline-flex items-center gap-1.5 text-[#00877c] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00877c]"></span>
                          <span>Hoạt động</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Tạm ẩn</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="text-slate-500 font-bold hover:text-[#087eab]">
                        Sửa •••
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hiển thị 1–{filteredConsultants.length} trên {consultantList.length} nhân viên</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded border border-slate-200">←</button>
              <button className="px-2 py-1 rounded bg-[#087eab] text-white font-bold">1</button>
              <button className="px-2 py-1 rounded border border-slate-200">2</button>
              <button className="px-2 py-1 rounded border border-slate-200">→</button>
            </div>
          </div>
        </div>

        {/* Cột phải: Form chỉnh sửa nhân viên */}
        {selectedConsultant && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-[#103d54]">
              Chỉnh sửa nhân viên
            </h3>

            {/* Avatar & Thay ảnh */}
            <div className="flex items-center gap-4 pt-1">
              <img
                src={selectedConsultant.avatar}
                alt={selectedConsultant.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Thay ảnh
              </button>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                value={selectedConsultant.name}
                onChange={(e) =>
                  setSelectedConsultant({ ...selectedConsultant, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Chuyên môn
              </label>
              <input
                type="text"
                value={selectedConsultant.specialty || "Nghỉ dưỡng & du thuyền"}
                onChange={(e) =>
                  setSelectedConsultant({ ...selectedConsultant, specialty: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Số điện thoại / Zalo *
              </label>
              <input
                type="text"
                value={selectedConsultant.phone}
                onChange={(e) =>
                  setSelectedConsultant({ ...selectedConsultant, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Facebook
              </label>
              <input
                type="text"
                value={selectedConsultant.facebook || "facebook.com/20travel.tuvan"}
                onChange={(e) =>
                  setSelectedConsultant({ ...selectedConsultant, facebook: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Trạng thái
              </label>
              <select
                value={selectedConsultant.status}
                onChange={(e) =>
                  setSelectedConsultant({ ...selectedConsultant, status: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none bg-white"
              >
                <option value="Hoạt động">Đang hoạt động</option>
                <option value="Tạm ẩn">Tạm ẩn</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-[#087eab] text-white text-xs font-bold hover:bg-[#0a6b90] transition"
              >
                Lưu thông tin
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
              >
                Xóa
              </button>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Thông tin liên hệ minh họa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsultants;

