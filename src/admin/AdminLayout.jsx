import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FolderTree,
  DollarSign,
  FileSpreadsheet,
  Users,
  Globe,
  History,
} from "lucide-react";
import { logout, fetchMe } from "../redux/slices/authSlice";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, initialized, status } = useSelector((s) => s.auth);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, token, user]);

  const adminEmail = user?.email || localStorage.getItem("20travel_admin_email") || "admin@20travel.vn";
  const displayName = user?.name || "Quản trị viên";
  const avatar = user?.avatar || "/images/figma-consultant.jpg";

  const handleLogout = () => {
    setAccountOpen(false);
    dispatch(logout());
    navigate("/admin/login", { replace: true });
  };

  const currentItem =
    adminNavItems.find((item) =>
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    ) || adminNavItems[0];

  const isActiveItem = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  if (!token && initialized) {
    return <Navigate to="/admin/login" replace />;
  }
  if (token && !user && !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f8fa] text-[13px] text-slate-500">
        Đang xác thực phiên đăng nhập...
      </div>
    );
  }
  if (!user && initialized) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f3f8fa] font-sans text-[#023648]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 flex h-[54px] items-center bg-white">
        <div className="flex w-[178px] shrink-0 items-center pl-5">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="mr-3 p-0.5 text-slate-500 lg:hidden"
            aria-label="Mở menu quản trị"
          >
            {mobileSidebarOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
          <Link
            to="/admin"
            className="text-[17px] leading-none font-extrabold tracking-[0.01em] text-[#00749d]"
          >
            20 TRAVEL
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-1.5 px-6 text-[11px] sm:flex">
          <span className="text-slate-400">Không gian quản trị</span>
          <span className="text-slate-300">/</span>
          <span className="truncate font-semibold text-[#023648]">{currentItem.label}</span>
        </div>
        <div className="flex-1 sm:hidden" />

        <div className="flex items-center gap-4 pr-5">
          <Link
            to="/home"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-[11px] font-semibold text-[#00749d] hover:underline sm:flex"
          >
            <span>Xem website</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <span className="hidden rounded-full bg-[#e5f5f6] px-3 py-[3px] text-[10.5px] font-bold text-[#008478] sm:inline-block">
            Admin
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-1.5 text-slate-400"
              aria-label="Tài khoản quản trị"
            >
              <img
                src={avatar}
                alt={displayName}
                className="h-6 w-6 rounded-full border border-slate-200 object-cover"
              />
              <ChevronDown
                className={`hidden h-3 w-3 transition sm:block ${accountOpen ? "rotate-180" : ""}`}
              />
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-[220px] overflow-hidden rounded-lg border border-[#e6eef2] bg-white shadow-lg">
                  <div className="border-b border-[#f1f6f8] px-3 py-2.5">
                    <p className="text-[11.5px] font-bold text-[#023648]">{displayName}</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">{adminEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      alert(`Tài khoản: ${adminEmail}\nVai trò: Quản trị viên\nTrạng thái: Đang hoạt động`);
                    }}
                    className="block w-full px-3 py-2 text-left text-[11px] font-medium text-[#31434e] transition hover:bg-[#f7fbfc]"
                  >
                    Thông tin tài khoản
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      navigate("/admin/login");
                    }}
                    className="block w-full px-3 py-2 text-left text-[11px] font-medium text-[#31434e] transition hover:bg-[#f7fbfc]"
                  >
                    Đổi mật khẩu
                  </button>
                  <Link
                    to="/home"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setAccountOpen(false)}
                    className="block px-3 py-2 text-[11px] font-medium text-[#31434e] transition hover:bg-[#f7fbfc]"
                  >
                    Xem website
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full border-t border-[#f1f6f8] px-3 py-2 text-left text-[11px] font-semibold text-[#00749d] transition hover:bg-[#f7fbfc]"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`${
            mobileSidebarOpen ? "flex" : "hidden"
          } fixed top-[54px] bottom-0 left-0 z-30 w-[220px] flex-col justify-between overflow-y-auto bg-white px-2.5 pt-3 pb-5 lg:sticky lg:top-[54px] lg:flex lg:h-[calc(100vh-54px)] lg:w-[178px] lg:shrink-0 lg:shadow-none ${
            mobileSidebarOpen ? "shadow-xl" : ""
          }`}
        >
          <div>
            <div className="ml-2.5 inline-block rounded-lg bg-[#eff7fa] px-2 py-1 text-[9px] font-semibold tracking-[0.1em] text-[#6b8a99] uppercase">
              Admin Workspace
            </div>

            <div className="mt-7 ml-2.5 text-[9px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
              Quản trị hệ thống
            </div>

            <nav className="mt-2.5 space-y-2">
              {adminNavItems.map((item) => {
                const isActive = isActiveItem(item);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex h-8 items-center rounded-lg px-2.5 text-[11px] transition ${
                      isActive
                        ? "bg-[#e5f5f6] font-semibold text-[#008478]"
                        : "font-medium text-[#546f7c] hover:bg-[#f4fafb] hover:text-[#023648]"
                    }`}
                  >
                    <span
                      className={`w-[22px] shrink-0 text-[10px] ${
                        isActive ? "font-semibold text-[#008478]" : "text-slate-400"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="mx-1 rounded-xl bg-[#eff7fa] px-3.5 py-3">
              <h4 className="text-[11px] font-bold text-[#023648]">Cần trợ giúp?</h4>
              <p className="mt-2 text-[10px] text-slate-500">Tài liệu hướng dẫn quản trị</p>
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#00749d] hover:underline"
              >
                <span>Mở trung tâm hỗ trợ</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 ml-3 inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition hover:text-[#00749d]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/20 lg:hidden"
          />
        )}

        {/* CONTENT */}
        <main className="min-h-[calc(100vh-54px)] min-w-0 flex-1 px-4 pt-5 pb-24 sm:px-6 sm:pt-6 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-slate-100 bg-white px-2 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] lg:hidden">
        {[
          { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
          { to: "/admin/dich-vu", label: "Dịch vụ", icon: FolderTree },
          { to: "/admin/bang-gia", label: "Bảng giá", icon: DollarSign },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1 text-[10px] ${
                isActive ? "font-semibold text-[#008478]" : "font-medium text-slate-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-6 w-9 items-center justify-center rounded-lg ${
                    isActive ? "bg-[#e5f5f6]" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1 text-[10px] font-medium text-slate-500"
        >
          <span className="flex h-6 w-9 items-center justify-center">
            <Menu className="h-4 w-4" />
          </span>
          <span>Khác</span>
        </button>
      </nav>

      {/* HELP MODAL */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#032f42]/50 p-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#023648]">Trung tâm hỗ trợ</h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  Tài liệu hướng dẫn quản trị 20 TRAVEL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="text-slate-400 transition hover:text-[#023648]"
                aria-label="Đóng trợ giúp"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 space-y-2 text-[11.5px] leading-relaxed text-[#546f7c]">
              <li>
                <b className="text-[#023648]">Quản lý dịch vụ:</b> thêm, sửa, ẩn/hiện và sắp xếp
                danh mục tại mục 02.
              </li>
              <li>
                <b className="text-[#023648]">Bảng giá:</b> cập nhật giá ngày thường, cuối tuần,
                thấp điểm và lễ Tết tại mục 03.
              </li>
              <li>
                <b className="text-[#023648]">Import Excel:</b> tải file mẫu, kiểm tra lỗi và xác
                nhận nhập tại mục 04.
              </li>
            </ul>

            <div className="mt-3 rounded-lg bg-[#eff7fa] px-3 py-2 text-[11px] text-[#546f7c]">
              Hotline hỗ trợ: <b className="text-[#00749d]">036 271 5585</b>
              <br />
              Email: <b className="text-[#00749d]">hello@20travel.vn</b>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Link
                to="/lien-he"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#e6eef2] px-3 py-2 text-[11.5px] font-semibold text-[#31434e] transition hover:bg-slate-50"
              >
                Liên hệ hỗ trợ
              </Link>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-md bg-[#00749d] px-4 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#006688]"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
