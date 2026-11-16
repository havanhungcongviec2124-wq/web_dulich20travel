import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@20travel.vn");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển hướng tới trang tổng quan Admin
    navigate("/admin");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* CỘT TRÁI: HÌNH ẢNH BANNER VỊNH HẠ LONG & THÔNG ĐIỆP */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#0c2f42] text-white">
        <img
          src="/images/figma-hero.jpg"
          alt="20 Travel Admin"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f42]/90 via-[#0c2f42]/60 to-[#0c2f42]/30" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/home" className="text-2xl font-black tracking-wider text-white">
            20 TRAVEL
          </Link>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 space-y-4 max-w-lg mb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur border border-white/20 text-xs font-semibold tracking-wider uppercase">
            KHÔNG GIAN QUẢN TRỊ
          </div>

          <h2 className="text-4xl font-black leading-tight text-white">
            Vận hành tinh gọn.
            <br />
            Hành trình trọn vẹn.
          </h2>

          <p className="text-sm text-white/80 leading-relaxed font-normal">
            Quản lý dịch vụ và bảng giá trên một nền tảng.
            <br />
            Dữ liệu rõ ràng, cập nhật dễ dàng.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <span className="text-2xl font-black tracking-tight text-[#103d54]">
              20 TRAVEL
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
              Chào mừng trở lại
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Đăng nhập để quản lý 20 TRAVEL.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Email quản trị
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@20travel.vn"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#087eab] focus:ring-2 focus:ring-[#087eab]/15"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#087eab] focus:ring-2 focus:ring-[#087eab]/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-[#087eab] focus:ring-[#087eab] h-4 w-4"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <span className="text-[#087eab] hover:underline cursor-pointer">
                Quên mật khẩu?
              </span>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white font-bold text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Đăng nhập quản trị</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Info notification */}
            <div className="p-3 rounded-xl bg-[#f0f9fb] border border-[#d8f0f4] text-center text-[11px] text-[#087eab] font-medium">
              Chỉ tài khoản Admin được cấp quyền truy cập.
            </div>

            {/* Link back to website */}
            <div className="text-center pt-4">
              <Link
                to="/home"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay về website khách hàng</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

