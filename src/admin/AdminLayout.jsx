import { useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import {
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  FolderTree,
  DollarSign,
  FileSpreadsheet,
  Users,
  Globe,
  History,
} from "lucide-react";

const adminNavItems = [
  { path: "/admin", label: "Tổng quan", num: "01", icon: LayoutDashboard, exact: true },
  { path: "/admin/dich-vu", label: "Danh mục & dịch vụ", num: "02", icon: FolderTree },
  { path: "/admin/bang-gia", label: "Bảng giá", num: "03", icon: DollarSign },
  { path: "/admin/excel", label: "Import / Export Excel", num: "04", icon: FileSpreadsheet },
  { path: "/admin/nhan-vien", label: "Nhân viên tư vấn", num: "05", icon: Users },
  { path: "/admin/noi-dung", label: "Nội dung website", num: "06", icon: Globe },
  { path: "/admin/lich-su", label: "Lịch sử hoạt động", num: "07", icon: History },
];

const AdminLayout = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Lấy breadcrumb label dựa trên path hiện tại
  const currentItem =
    adminNavItems.find((item) =>
      item.exact
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path)
    ) || adminNavItems[0];

  return (
    <div className="min-h-screen bg-[#f8fbfd] flex flex-col font-sans text-slate-800">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* Left: Mobile hamburger + Logo + Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="text-xl font-black tracking-tight text-[#103d54]">
            20 TRAVEL
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 pl-4 border-l border-slate-200">
            <span>Không gian quản trị</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{currentItem.label}</span>
          </div>
        </div>

        {/* Right: Xem website, Admin badge, Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/home"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#087eab] hover:underline"
          >
            <span>Xem website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <span className="px-3 py-1 rounded-full bg-[#eaf6f7] text-[#00877c] text-xs font-bold">
            Admin
          </span>

          <div className="flex items-center gap-1.5 cursor-pointer">
            <img
              src="/images/figma-consultant.jpg"
              alt="Admin Avatar"
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY: SIDEBAR + CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`${
            mobileSidebarOpen ? "block" : "hidden"
          } lg:block fixed lg:static inset-y-16 left-0 z-30 w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-5 overflow-y-auto shrink-0 shadow-lg lg:shadow-none`}
        >
          <div className="space-y-6">
            {/* Pill Workspace */}
            <div>
              <span className="inline-block px-3 py-1 rounded-lg bg-[#f0f4f8] text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                ADMIN WORKSPACE
              </span>
            </div>

            {/* Menu List */}
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                QUẢN TRỊ HỆ THỐNG
              </span>

              {adminNavItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-[#eaf6f7] text-[#00877c]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Bottom Sidebar: Help & Logout */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            {/* Help Card */}
            <div className="bg-[#f0f9fb] p-3.5 rounded-2xl border border-[#d8f0f4] space-y-1.5">
              <h4 className="text-xs font-bold text-[#103d54]">Cần trợ giúp?</h4>
              <p className="text-[11px] text-slate-500">Tài liệu hướng dẫn quản trị</p>
              <a
                href="#help"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087eab] hover:underline"
              >
                <span>Mở trung tâm hỗ trợ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Logout */}
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition px-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 z-20 lg:hidden"
          />
        )}

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Matches tongquan_mobile & banggia_mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 px-3 py-2 flex items-center justify-around text-xs">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl font-bold transition ${
              isActive ? "bg-[#eaf6f7] text-[#00877c]" : "text-slate-500"
            }`
          }
        >
          <span>Tổng quan</span>
        </NavLink>
        <NavLink
          to="/admin/dich-vu"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl font-bold transition ${
              isActive ? "bg-[#eaf6f7] text-[#00877c]" : "text-slate-500"
            }`
          }
        >
          <span>Dịch vụ</span>
        </NavLink>
        <NavLink
          to="/admin/bang-gia"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl font-bold transition ${
              isActive ? "bg-[#eaf6f7] text-[#00877c]" : "text-slate-500"
            }`
          }
        >
          <span>Bảng giá</span>
        </NavLink>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl font-bold text-slate-500"
        >
          <span>Khác</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminLayout;

