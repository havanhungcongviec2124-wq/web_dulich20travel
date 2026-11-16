import { useState } from "react";
import { Upload, Eye, Check } from "lucide-react";
import { websiteBanner } from "../data/mockData";

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("banner"); // "banner" | "info" | "policy"
  const [banner, setBanner] = useState(websiteBanner);

  // General info state
  const [siteName, setSiteName] = useState("20 TRAVEL");
  const [hotline, setHotline] = useState("036 271 5585");
  const [facebook, setFacebook] = useState("facebook.com/20travel");
  const [zalo, setZalo] = useState("zalo.me/0362715585");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
            Nội dung website
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Giữ cho website luôn mới mẻ và nhất quán với thương hiệu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            Xem trước
          </button>
          <button
            type="button"
            onClick={() => alert("Đã xuất bản nội dung website thành công!")}
            className="px-6 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs"
          >
            Xuất bản
          </button>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex items-center gap-2">
        {[
          { id: "banner", label: "Banner trang chủ" },
          { id: "info", label: "Thông tin website" },
          { id: "policy", label: "Chính sách" },
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

      {/* 3. MAIN CONTENT: 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* CỘT TRÁI */}
        <div className="space-y-6">
          {/* Card: Banner đang hiển thị */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103d54]">Banner đang hiển thị</h3>

            {/* Banner preview card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={banner.image}
                alt="Banner preview"
                className="w-full h-56 object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[11px] font-bold text-[#00877c] flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00877c]"></span>
                <span>{banner.status}</span>
              </span>
            </div>

            <div>
              <h4 className="text-base font-black text-[#103d54]">{banner.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{banner.dimension}</p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Thay hình ảnh
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Ẩn banner
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
              >
                Xóa
              </button>
            </div>
          </div>

          {/* Card: Thông tin chung & liên hệ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103d54]">Thông tin chung & liên hệ</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tên website
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Hotline
                </label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Zalo
                </label>
                <input
                  type="text"
                  value={zalo}
                  onChange={(e) => setZalo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Thông tin liên hệ minh họa • Cập nhật theo thông tin chính thức trước khi xuất bản.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          {/* Card: Nội dung banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#103d54]">Nội dung banner</h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tiêu đề
              </label>
              <textarea
                rows={2}
                value={banner.title}
                onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Mô tả
              </label>
              <textarea
                rows={3}
                value={banner.desc}
                onChange={(e) => setBanner({ ...banner, desc: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Nhãn nút
              </label>
              <input
                type="text"
                value={banner.buttonLabel}
                onChange={(e) => setBanner({ ...banner, buttonLabel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Liên kết
              </label>
              <input
                type="text"
                value={banner.buttonLink}
                onChange={(e) => setBanner({ ...banner, buttonLink: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Card: Thêm banner mới */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#103d54]">+ Thêm banner mới</h3>
            <p className="text-[11px] text-slate-400">
              Hỗ trợ JPG, PNG, WebP • Khuyến nghị ảnh ngang, tối đa 5 MB.
            </p>
            <div className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#087eab] flex items-center justify-center text-slate-500 hover:text-[#087eab] cursor-pointer transition text-xs font-bold">
              Tải ảnh lên
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;

