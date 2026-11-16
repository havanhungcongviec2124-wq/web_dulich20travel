import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Layers,
  Star,
  ChevronDown,
  X,
  ArrowRight,
  Filter,
} from "lucide-react";
import { services, categories } from "../data/mockData";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialLocation = searchParams.get("location") || "Hạ Long, Quảng Ninh";
  const initialDate = searchParams.get("date") || "20/11/2026";
  const initialCat = searchParams.get("category") || "all";

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [dateInput, setDateInput] = useState(initialDate);
  const [categoryInput, setCategoryInput] = useState(initialCat);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState(
    initialCat !== "all" ? [initialCat] : []
  );
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("relevant");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(5000000);
    setSelectedAmenities([]);
  };

  // Filter logic
  const filteredServices = services.filter((service) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(service.category)) {
      return false;
    }
    const effPrice = service.displayPrice || service.price;
    if (effPrice > maxPrice) return false;
    if (selectedAmenities.length > 0) {
      const matchAmenity = selectedAmenities.some((am) =>
        service.amenities.some((a) => a.toLowerCase().includes(am.toLowerCase()))
      );
      if (!matchAmenity) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fbfd] pb-20">
      {/* 1. TOP BREADCRUMB & SEARCH HEADER */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="container-page">
          <div className="text-xs text-slate-400 mb-2">
            <Link to="/home" className="hover:text-slate-600">
              Trang chủ
            </Link>{" "}
            / <span className="text-slate-600 font-medium">Tra cứu dịch vụ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#103d54] mb-6">
            Tìm chuyến đi dành cho bạn
          </h1>

          {/* Top Search bar */}
          <div className="bg-[#f8fbfd] rounded-2xl border border-slate-200/80 p-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            {/* Điểm đến */}
            <div className="bg-white rounded-xl px-4 py-2 border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Điểm đến
              </span>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Hạ Long, Quảng Ninh"
                className="w-full text-xs md:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent"
              />
            </div>

            {/* Ngày sử dụng */}
            <div className="bg-white rounded-xl px-4 py-2 border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ngày sử dụng
              </span>
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="20/11/2026"
                className="w-full text-xs md:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent"
              />
            </div>

            {/* Loại dịch vụ */}
            <div className="bg-white rounded-xl px-4 py-2 border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Loại dịch vụ
              </span>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full text-xs md:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="all">Tất cả dịch vụ</option>
                <option value="hotel">Khách sạn</option>
                <option value="cruise-day">Du thuyền ngày</option>
                <option value="cruise-night">Du thuyền đêm</option>
                <option value="ticket">Vé vui chơi</option>
                <option value="transport">Xe & dịch vụ khác</option>
              </select>
            </div>

            {/* Tra cứu giá button */}
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams();
                if (locationInput) params.set("location", locationInput);
                if (dateInput) params.set("date", dateInput);
                if (categoryInput && categoryInput !== "all") {
                  params.set("category", categoryInput);
                }
                setSearchParams(params);
              }}
              className="py-3 px-6 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white font-semibold text-sm tracking-wide transition text-center"
            >
              Tra cứu giá
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: FILTER SIDEBAR & RESULTS */}
      <div className="container-page pt-8">
        {/* Mobile filter toggle */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700"
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc nhu cầu</span>
          </button>
          <span className="text-xs font-medium text-slate-500">
            {filteredServices.length} dịch vụ tìm thấy
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* CỘT TRÁI: BỘ LỌC */}
          <aside
            className={`${
              mobileFilterOpen ? "block" : "hidden"
            } lg:block bg-white rounded-2xl p-6 border border-slate-100 shadow-xs h-fit space-y-6`}
          >
            {/* Header bộ lọc */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-sm font-black text-[#103d54]">Lọc theo nhu cầu</h2>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-[#087eab] hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* 1. Loại dịch vụ */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                LOẠI DỊCH VỤ
              </h3>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer hover:text-[#087eab]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded border-slate-300 text-[#087eab] focus:ring-[#087eab] h-4 w-4"
                      />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-slate-400">({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Khoảng giá */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                KHOẢNG GIÁ / ĐƠN VỊ
              </h3>
              <input
                type="range"
                min="0"
                max="5000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#087eab] cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2 mt-3">
                <div className="bg-[#f8fbfd] border border-slate-200 rounded-lg px-2.5 py-1.5 text-center flex-1">
                  <span className="block text-[10px] text-slate-400">Từ</span>
                  <span className="text-xs font-bold text-slate-700">0đ</span>
                </div>
                <div className="bg-[#f8fbfd] border border-slate-200 rounded-lg px-2.5 py-1.5 text-center flex-1">
                  <span className="block text-[10px] text-slate-400">Đến</span>
                  <span className="text-xs font-bold text-slate-700">
                    {new Intl.NumberFormat("vi-VN").format(maxPrice)}đ
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Tiện ích */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                TIỆN ÍCH
              </h3>
              <div className="space-y-2.5">
                {["Bể bơi", "Bao gồm ăn sáng", "Đưa đón tận nơi"].map((am) => (
                  <label
                    key={am}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-[#087eab]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(am)}
                      onChange={() => toggleAmenity(am)}
                      className="rounded border-slate-300 text-[#087eab] focus:ring-[#087eab] h-4 w-4"
                    />
                    <span>{am}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Button áp dụng */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* CỘT PHẢI: KẾT QUẢ TÌM KIẾM */}
          <main className="space-y-4">
            {/* Header kết quả */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#103d54]">
                  36 dịch vụ tại Hạ Long
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Giá cho ngày 20/11/2026 • Không cần đăng nhập
                </p>
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="relevant">Sắp xếp: Phù hợp nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filter tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf6f7] text-[#00877c] text-xs font-medium">
                <span>Hạ Long</span>
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" />
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf6f7] text-[#00877c] text-xs font-medium">
                <span>20/11/2026</span>
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" />
              </span>
            </div>

            {/* Danh sách dịch vụ - Horizontal Cards */}
            <div className="space-y-4 pt-2">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
                >
                  {/* Ảnh dịch vụ */}
                  <div className="relative w-full sm:w-60 md:w-64 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#103d54] shadow-xs">
                      {service.categoryName}
                    </span>
                  </div>

                  {/* Thông tin giữa */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#103d54] hover:text-[#087eab] transition">
                        <Link to={`/dich-vu/${service.id}`}>{service.name}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {service.location}
                      </p>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-2">
                        <span>★ {service.rating}</span>
                        <span className="text-slate-400 font-normal">
                          • Được khách hàng yêu thích
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium mt-2">
                        {service.amenities.join(" • ")}
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-400 mt-3 sm:mt-0 block">
                      Cập nhật {service.updatedAt}
                    </span>
                  </div>

                  {/* Cột giá & nút hành động bên phải */}
                  <div className="sm:border-l sm:border-slate-100 sm:pl-5 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">Giá từ</span>
                      <div className="text-xl font-black text-[#087eab] tracking-tight">
                        {new Intl.NumberFormat("vi-VN").format(service.displayPrice || service.price)}đ
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        / {service.priceUnit}
                      </span>
                    </div>

                    <Link
                      to={`/dich-vu/${service.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <div className="pt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                ←
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#087eab] text-white flex items-center justify-center text-xs font-bold shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                3
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                →
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

