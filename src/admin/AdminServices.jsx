import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { services as initialServices, categories as initialCategories, consultants } from "../data/mockData";

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState("services"); // "services" | "categories"
  const [servicesList, setServicesList] = useState(initialServices);
  const [categoryList, setCategoryList] = useState(initialCategories);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStatCategory, setSelectedStatCategory] = useState("all");

  // Edit Service State (matches chinhsuadichvu_web.png)
  const [editingService, setEditingService] = useState(null);

  // Edit Category State (matches quanlydanhmuc_web.png)
  const [editingCategory, setEditingCategory] = useState(initialCategories[0]);

  // Handle Edit service modal
  const handleOpenEditService = (service) => {
    setEditingService({ ...service });
  };

  const handleSaveService = () => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === editingService.id ? editingService : s))
    );
    setEditingService(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. EDIT SERVICE MODAL VIEW (If open, renders chinhsuadichvu_web.png) */}
      {editingService ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
                Chỉnh sửa dịch vụ
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Dịch vụ / {editingService.code} • Cập nhật gần nhất bởi {editingService.consultant} lúc 09:42
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy thay đổi
              </button>
              <button
                type="button"
                onClick={handleSaveService}
                className="px-5 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs"
              >
                Lưu dịch vụ
              </button>
            </div>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#103d54]">Thông tin cơ bản</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tên dịch vụ *
                  </label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({ ...editingService, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#087eab]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Mã dịch vụ *
                    </label>
                    <input
                      type="text"
                      value={editingService.code}
                      onChange={(e) =>
                        setEditingService({ ...editingService, code: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Danh mục *
                    </label>
                    <select
                      value={editingService.category}
                      onChange={(e) =>
                        setEditingService({ ...editingService, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none bg-white"
                    >
                      <option value="hotel">Khách sạn</option>
                      <option value="cruise-day">Du thuyền ngày</option>
                      <option value="cruise-night">Du thuyền đêm</option>
                      <option value="ticket">Vé vui chơi</option>
                      <option value="transport">Xe & dịch vụ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Tỉnh / thành phố *
                    </label>
                    <input
                      type="text"
                      value="Quảng Ninh"
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Khu vực
                    </label>
                    <input
                      type="text"
                      value="Hạ Long"
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={editingService.address}
                    onChange={(e) =>
                      setEditingService({ ...editingService, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mô tả & tiện ích */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#103d54]">Mô tả & tiện ích</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Mô tả
                  </label>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 border border-b-0 border-slate-200 px-3 py-1.5 rounded-t-xl bg-slate-50">
                    <span>B</span>
                    <span>I</span>
                    <span>U</span>
                    <span>• Danh sách</span>
                    <span>🔗 Liên kết</span>
                  </div>
                  <textarea
                    rows={4}
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-b-xl border border-slate-200 text-xs text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-600 mb-2">
                    Tiện ích đã chọn
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Bể bơi", "Bãi biển riêng", "Ăn sáng", "Wi-Fi"].map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f9fb] text-[#087eab] text-xs font-bold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hình ảnh dịch vụ */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-[#103d54]">Hình ảnh dịch vụ</h3>
                <p className="text-[11px] text-slate-400">
                  Ảnh đầu tiên được dùng làm ảnh đại diện • Kéo thả để sắp xếp
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <img
                    src={editingService.image}
                    alt="Preview 1"
                    className="w-36 h-24 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                  <img
                    src={editingService.secondaryImage || "/images/ha-long.jpg"}
                    alt="Preview 2"
                    className="w-36 h-24 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div className="w-36 h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#087eab] flex flex-col items-center justify-center text-slate-400 hover:text-[#087eab] cursor-pointer transition">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-bold">+ Tải ảnh lên</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-6">
              {/* Trạng thái xuất bản */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#103d54]">Trạng thái xuất bản</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Hiển thị trên website
                  </label>
                  <select
                    value={editingService.status}
                    onChange={(e) =>
                      setEditingService({ ...editingService, status: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none bg-white"
                  >
                    <option value="Hiển thị">● Đang hiển thị</option>
                    <option value="Bản nháp">Bản nháp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nhân viên tư vấn
                  </label>
                  <select
                    value={editingService.consultant}
                    onChange={(e) =>
                      setEditingService({ ...editingService, consultant: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none bg-white"
                  >
                    {consultants.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingService.featured}
                    onChange={(e) =>
                      setEditingService({ ...editingService, featured: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#087eab] focus:ring-[#087eab] h-4 w-4"
                  />
                  <span>✓ Hiển thị trong dịch vụ nổi bật</span>
                </label>
              </div>

              {/* Giá & đơn vị tính */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-[#103d54]">Giá & đơn vị tính</h3>
                <div className="text-2xl font-black text-[#087eab]">
                  {new Intl.NumberFormat("vi-VN").format(editingService.price)}đ
                </div>
                <span className="text-xs text-slate-400 block">
                  Giá từ / {editingService.priceUnit}
                </span>

                <Link
                  to="/admin/bang-gia"
                  className="w-full mt-3 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                >
                  <span>Quản lý bảng giá</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Lưu trữ & xóa */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-[#103d54]">Lưu trữ & xóa</h3>
                <p className="text-[11px] text-slate-400">
                  Ẩn trước khi xóa để bảo toàn dữ liệu giá.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService({
                        ...editingService,
                        status: editingService.status === "Hiển thị" ? "Bản nháp" : "Hiển thị",
                      });
                    }}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Ẩn dịch vụ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
                        setServicesList((prev) =>
                          prev.filter((s) => s.id !== editingService.id)
                        );
                        setEditingService(null);
                      }
                    }}
                    className="py-2.5 px-3 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    Xóa dịch vụ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. MAIN SERVICES & CATEGORIES MANAGEMENT */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
                Danh mục & dịch vụ
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Tổ chức và quản lý toàn bộ dịch vụ trên website.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleOpenEditService({
                    id: `ks${Date.now()}`,
                    code: `KS00${servicesList.length + 1}`,
                    name: "Khách sạn mới",
                    category: "hotel",
                    categoryName: "Khách sạn",
                    location: "Hạ Long, Quảng Ninh",
                    address: "Bãi Cháy, Hạ Long",
                    rating: 5.0,
                    stars: 5,
                    price: 2000000,
                    priceUnit: "phòng / đêm",
                    updatedAt: "16/11/2026",
                    status: "Hiển thị",
                    consultant: "Minh Anh",
                    featured: false,
                    image: "/images/hotel.jpg",
                    amenities: ["Bể bơi", "Ăn sáng"],
                    amenitiesDetail: ["Bể bơi ngoài trời", "Ăn sáng buffet"],
                    description: "Mô tả dịch vụ mới",
                    intro: "Không gian nghỉ dưỡng lý tưởng",
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm dịch vụ</span>
              </button>
            </div>
          </div>

          {/* 5 Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { id: "all", name: "Tất cả dịch vụ", count: 328 },
              { id: "hotel", name: "Khách sạn", count: 128 },
              { id: "cruise", name: "Du thuyền", count: 78 },
              { id: "ticket", name: "Vé vui chơi", count: 64 },
              { id: "transport", name: "Xe & khác", count: 58 },
            ].map((stat) => (
              <div
                key={stat.id}
                onClick={() => setSelectedStatCategory(stat.id)}
                className={`p-4 rounded-2xl bg-white border cursor-pointer transition ${
                  selectedStatCategory === stat.id
                    ? "border-[#087eab] shadow-sm"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  {stat.name}
                </span>
                <span className="text-2xl font-black text-[#103d54]">
                  {stat.count}
                </span>
              </div>
            ))}
          </div>

          {/* TAB SWITCHER: Dịch vụ | Danh mục */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "services"
                    ? "bg-[#087eab] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Dịch vụ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "categories"
                    ? "bg-[#087eab] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Danh mục
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                + Thêm danh mục
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sắp xếp</span>
              </button>
            </div>
          </div>

          {/* CONTENT ACCORDING TO ACTIVE TAB */}
          {activeTab === "services" ? (
            /* TAB 1: DANH SÁCH DỊCH VỤ */
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs items-center">
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên, mã dịch vụ..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none bg-white"
                  >
                    <option value="all">Tất cả địa điểm</option>
                    <option value="halong">Hạ Long</option>
                    <option value="hanoi">Hà Nội</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none bg-white"
                  >
                    <option value="all">Trạng thái</option>
                    <option value="Hiển thị">Hiển thị</option>
                    <option value="Bản nháp">Bản nháp</option>
                  </select>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#087eab] text-white text-xs font-bold hover:bg-[#0a6b90]"
                  >
                    Lọc
                  </button>
                </div>
              </div>

              {/* Table of Services */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/50">
                        <th className="py-3.5 px-5 font-semibold">Mã / Tên dịch vụ</th>
                        <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                        <th className="py-3.5 px-4 font-semibold">Giá từ</th>
                        <th className="py-3.5 px-4 font-semibold">Cập nhật</th>
                        <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                        <th className="py-3.5 px-5 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {servicesList.map((service) => (
                        <tr key={service.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-5">
                            <span className="font-bold text-slate-800 block">
                              {service.code} • {service.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {service.categoryName}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {new Intl.NumberFormat("vi-VN").format(service.displayPrice || service.price)}đ
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {service.updatedAt}
                          </td>
                          <td className="py-3.5 px-4">
                            {service.status === "Hiển thị" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf6f7] text-[#00877c] font-bold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00877c]"></span>
                                <span>Hiển thị</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-[11px]">
                                <span>Bản nháp</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenEditService(service)}
                              className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                            >
                              Sửa •••
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Hiển thị 1–6 trên 328 dịch vụ</span>
                  <div className="flex items-center gap-1 self-center">
                    <button className="px-2 py-1 rounded border border-slate-200">←</button>
                    <button className="px-2 py-1 rounded bg-[#087eab] text-white font-bold">1</button>
                    <button className="px-2 py-1 rounded border border-slate-200">2</button>
                    <button className="px-2 py-1 rounded border border-slate-200">3</button>
                    <span className="px-1">...</span>
                    <button className="px-2 py-1 rounded border border-slate-200">55</button>
                    <button className="px-2 py-1 rounded border border-slate-200">→</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: QUẢN LÝ DANH MỤC (Matches quanlydanhmuc_web.png) */
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
              {/* Cột trái: Bảng danh mục */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#103d54]">
                  5 danh mục dịch vụ
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold">Tên danh mục</th>
                        <th className="pb-3 font-semibold">Dịch vụ</th>
                        <th className="pb-3 font-semibold">Hiển thị</th>
                        <th className="pb-3 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categoryList.map((cat) => (
                        <tr
                          key={cat.id}
                          onClick={() => setEditingCategory(cat)}
                          className={`cursor-pointer transition ${
                            editingCategory.id === cat.id ? "bg-[#f0f9fb]" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="py-3 font-bold text-slate-800">{cat.name}</td>
                          <td className="py-3 text-slate-600">{cat.count}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1 text-[#00877c] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00877c]"></span>
                              <span>Bật</span>
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <span className="text-slate-500 font-bold hover:text-[#087eab]">
                              Sửa •••
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cột phải: Chỉnh sửa danh mục */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4 h-fit">
                <h3 className="text-sm font-bold text-[#103d54]">
                  Chỉnh sửa danh mục
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Đường dẫn
                  </label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, slug: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      defaultValue="1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Trạng thái
                    </label>
                    <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none bg-white">
                      <option>Hiển thị</option>
                      <option>Ẩn</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Danh mục đang có {editingCategory.count} dịch vụ. Chuyển dịch vụ sang danh mục khác trước khi xóa.
                </p>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => alert("Đã lưu danh mục thành công!")}
                    className="px-5 py-2.5 rounded-xl bg-[#087eab] text-white text-xs font-bold hover:bg-[#0a6b90] transition"
                  >
                    Lưu danh mục
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Hủy
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    Xóa danh mục
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminServices;

