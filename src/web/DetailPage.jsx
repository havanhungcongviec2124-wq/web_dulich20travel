import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Calendar,
  Users,
  Check,
  ArrowLeft,
} from "lucide-react";
import { services, november2026Calendar, consultants, company } from "../data/mockData";

const DetailPage = () => {
  const { id } = useParams();
  const service = services.find((s) => s.id === id) || services[0];

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDay, setSelectedDay] = useState(20);
  const [currentMonth] = useState("Tháng 11, 2026");

  // Tìm ngày được chọn
  const dayData = november2026Calendar.find((d) => d.day === selectedDay) || {
    day: selectedDay,
    type: "weekday",
    price: service.price,
    display: "2.45tr",
  };

  const selectedConsultant =
    consultants.find((c) => c.name === service.consultant) ||
    consultants.find((c) => c.id === "hoang-thien") ||
    consultants[0];

  return (
    <div className="min-h-screen bg-[#f8fbfd] pb-24">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="bg-white border-b border-slate-100 py-3.5 sm:py-4">
        <div className="container-page">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Link to="/home" className="hover:text-slate-600 hidden sm:inline">
                Trang chủ /
              </Link>
              <Link to={`/tra-cuu?category=${service.category}`} className="hover:text-slate-600">
                {service.categoryName}
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Hạ Long</span>
            </div>
            <Link
              to="/tra-cuu"
              className="text-[#087eab] font-bold flex items-center gap-1 hover:underline text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </Link>
          </div>

          {/* Title & Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
                {service.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="text-amber-400 tracking-widest font-black">
                  ★★★★★
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {service.address}
                </span>
              </div>
            </div>

            {/* Rating badge */}
            <div className="self-start sm:self-auto hidden sm:block">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e8f7f5] text-[#00877c] text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-[#00877c] text-[#00877c]" />
                <span>{service.rating} • {service.tag}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PHOTO GALLERY */}
      <div className="container-page pt-4 sm:pt-6">
        <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 md:h-[420px] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Image */}
          <div className="md:col-span-2 relative h-full">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            {/* Tag badge on image for mobile (matches chitiet&lichgia_mobile.png) */}
            <span className="sm:hidden absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-[#00877c] shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#00877c] text-[#00877c]" />
              <span>{service.rating} • {service.tag}</span>
            </span>
          </div>

          {/* Secondary Image */}
          <div className="hidden md:block relative h-full">
            <img
              src={service.secondaryImage || "/images/ha-long.jpg"}
              alt="Hạ Long View"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-white/95 backdrop-blur text-xs font-bold text-[#103d54] hover:bg-white shadow-md transition"
            >
              Xem thư viện ảnh →
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="container-page pt-4 sm:pt-6">
        <div className="border-b border-slate-200 flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold">
          {[
            { id: "overview", label: "Tổng quan" },
            { id: "calendar", label: "Lịch giá" },
            { id: "policies", label: "Chính sách" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition relative ${
                activeTab === tab.id
                  ? "text-[#087eab]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#087eab] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN CONTENT & BOOKING SIDEBAR */}
      <div className="container-page pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* CỘT TRÁI: CHI TIẾT & LỊCH GIÁ */}
          <div className="space-y-6 sm:space-y-8">
            {/* Giới thiệu */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-100 shadow-xs space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#103d54]">
                {service.intro}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Tiện ích chips */}
              <div className="pt-1 flex flex-wrap gap-2">
                {service.amenitiesDetail.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f9fb] text-[#087eab] text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* TRA CỨU GIÁ THEO NGÀY (CALENDAR) */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-100 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#103d54]">
                    Tra cứu giá theo ngày
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Phòng Deluxe • 02 người lớn
                  </p>
                </div>

                {/* Chuyển tháng */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-700 min-w-28 text-center">
                    {currentMonth}
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div>
                {/* Ngày trong tuần */}
                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                  <span>CN</span>
                </div>

                {/* Days matrix */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                  {/* Empty offsets for day 1 (Sunday in Nov 2026 starts at col 7) */}
                  <div className="p-1 sm:p-2.5 rounded-xl"></div>
                  <div className="p-1 sm:p-2.5 rounded-xl"></div>
                  <div className="p-1 sm:p-2.5 rounded-xl"></div>
                  <div className="p-1 sm:p-2.5 rounded-xl"></div>
                  <div className="p-1 sm:p-2.5 rounded-xl"></div>
                  <div className="p-1 sm:p-2.5 rounded-xl"></div>

                  {november2026Calendar.map((item) => {
                    const isSelected = item.day === selectedDay;
                    const isWeekend = item.type === "weekend";

                    let bgClass = "bg-[#f8fbfd] text-slate-700 hover:bg-slate-100";
                    let priceClass = "text-slate-500";

                    if (isWeekend) {
                      bgClass = "bg-[#eaf6f7] text-[#00877c] hover:bg-[#d8f0f1]";
                      priceClass = "text-[#00877c] font-semibold";
                    }

                    if (isSelected) {
                      bgClass = "bg-[#087eab] text-white shadow-sm";
                      priceClass = "text-white/90 font-bold";
                    }

                    return (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => setSelectedDay(item.day)}
                        className={`p-1 sm:p-2.5 rounded-xl text-center transition flex flex-col items-center justify-center min-h-[54px] sm:min-h-[64px] cursor-pointer ${bgClass}`}
                      >
                        <span className="text-xs sm:text-sm font-bold leading-none mb-1">
                          {item.day}
                        </span>
                        <span className={`text-[10px] sm:text-[11px] leading-tight ${priceClass}`}>
                          {item.display}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Chú thích màu & ghi chú */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                        <span>Ngày thường</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00877c]"></span>
                        <span>Cuối tuần</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#087eab]"></span>
                        <span>Đang chọn</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Giá / phòng / đêm • "tr" = triệu VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BOOKING CARD & CONSULTANT */}
          <div className="space-y-5">
            {/* Card 1: Giá & Đặt chỗ */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
              <div>
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  GIÁ NGÀY {selectedDay}/11/2026
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#087eab] tracking-tight mt-1">
                  {new Intl.NumberFormat("vi-VN").format(dayData.price)}đ
                </div>
                <span className="text-xs text-slate-400 block mt-0.5">
                  / phòng / đêm • Đã gồm ăn sáng
                </span>
              </div>

              {/* Form chọn ngày & khách (Desktop) */}
              <div className="hidden sm:block space-y-3 pt-2">
                <div className="bg-[#f8fbfd] border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Ngày sử dụng
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {selectedDay}/11/2026
                    </span>
                  </div>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>

                <div className="bg-[#f8fbfd] border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Số khách
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      02 người lớn • 01 phòng
                    </span>
                  </div>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Nút Liên hệ tư vấn giá */}
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white font-bold text-sm tracking-wide transition shadow-xs"
              >
                Liên hệ tư vấn giá
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Vui lòng liên hệ xác nhận giá và tình trạng phòng.
              </p>
            </div>

            {/* Card 2: Nhân viên tư vấn */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedConsultant.avatar}
                  alt={selectedConsultant.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-[#103d54]">
                    {selectedConsultant.name}
                  </h4>
                  <span className="text-[11px] font-bold text-[#00877c] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00877c]"></span>
                    Sẵn sàng hỗ trợ
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {selectedConsultant.specialty}
                  </p>
                </div>
              </div>

              {/* Nút Chat Zalo & Hotline */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <a
                  href={selectedConsultant.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#087eab] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Zalo</span>
                </a>
                <a
                  href={`tel:${company.hotlineRaw}`}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00877c]" />
                  <span>Gọi hotline</span>
                </a>
              </div>
            </div>

            {/* Card 3: Lưu ý trước chuyến đi */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-3">
              <h4 className="text-sm font-black text-[#103d54]">
                Lưu ý trước chuyến đi
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
                <li>• Nhận phòng từ 14:00, trả phòng trước 12:00.</li>
                <li>• Phụ thu trẻ em theo độ tuổi và thời điểm.</li>
                <li>• Chính sách hủy theo từng gói dịch vụ.</li>
                <li>• Liên hệ để xác nhận phòng và giá cuối cùng.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
