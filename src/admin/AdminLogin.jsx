import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { loginAdmin, fetchMe } from "../redux/slices/authSlice";
import { forgotPasswordApi } from "../redux/Api/authApi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, status, error: authError, initialized } = useSelector((s) => s.auth);

  const [email, setEmail] = useState(() => localStorage.getItem("20travel_admin_email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem("20travel_admin_remember") === "1");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (token && !user && !initialized) {
      dispatch(fetchMe());
    }
  }, [dispatch, token, user, initialized]);

  if (token && user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Email không đúng định dạng.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }

    try {
      const result = await dispatch(loginAdmin({ email: email.trim(), password })).unwrap();
      if (remember) {
        localStorage.setItem("20travel_admin_remember", "1");
        localStorage.setItem("20travel_admin_email", email.trim());
      } else {
        localStorage.removeItem("20travel_admin_remember");
        localStorage.removeItem("20travel_admin_email");
      }
      if (result?.user || result?.token) navigate("/admin", { replace: true });
    } catch (err) {
      setError(err || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setError("Vui lòng nhập email quản trị hợp lệ.");
      return;
    }
    setError("");
    try {
      setResetLoading(true);
      await forgotPasswordApi({ email: resetEmail.trim() });
      setResetSent(true);
    } catch {
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  };

  const backToLogin = () => {
    setMode("login");
    setError("");
    setResetSent(false);
  };

  const loading = status === "loading";

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      {/* LEFT: BANNER */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0c2f42] p-10 text-white lg:flex">
        <img
          src="/images/figma-hero.jpg"
          alt="20 Travel Admin"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2f42]/90 via-[#0c2f42]/55 to-[#0c2f42]/25" />

        <div className="relative z-10">
          <Link to="/home" className="text-[22px] font-extrabold tracking-wider text-white">
            20 TRAVEL
          </Link>
        </div>

        <div className="relative z-10 mb-6 max-w-[460px] space-y-3.5">
          <span className="inline-block rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10.5px] font-semibold tracking-wider uppercase backdrop-blur">
            Không gian quản trị
          </span>

          <h2 className="text-[34px] leading-[1.15] font-extrabold text-white">
            Vận hành tinh gọn.
            <br />
            Hành trình trọn vẹn.
          </h2>

          <p className="text-[12.5px] leading-relaxed font-normal text-white/80">
            Quản lý dịch vụ và bảng giá trên một nền tảng.
            <br />
            Dữ liệu rõ ràng, cập nhật dễ dàng.
          </p>
        </div>
      </div>

      {/* RIGHT: FORM */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-6 text-center lg:hidden">
            <span className="text-[22px] font-extrabold tracking-tight text-[#00749d]">
              20 TRAVEL
            </span>
          </div>

          {mode === "login" ? (
            <>
              <div>
                <h1 className="text-[26px] leading-tight font-extrabold text-[#023648]">
                  Chào mừng trở lại
                </h1>
                <p className="mt-1.5 text-[12px] text-slate-500">
                  Đăng nhập để quản lý 20 TRAVEL.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-[11.5px] font-semibold text-[#546f7c]">
                    Email quản trị
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Hãy nhập email quản trị"
                    className="w-full rounded-lg border border-[#e6eef2] px-3.5 py-2.5 text-[12.5px] font-medium text-[#31434e] outline-none transition focus:border-[#00749d] focus:ring-2 focus:ring-[#00749d]/15"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11.5px] font-semibold text-[#546f7c]">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Nhập mật khẩu"
                      className="w-full rounded-lg border border-[#e6eef2] px-3.5 py-2.5 pr-10 text-[12.5px] font-medium text-[#31434e] outline-none transition focus:border-[#00749d] focus:ring-2 focus:ring-[#00749d]/15"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {(error || authError) && (
                  <div className="rounded-lg border border-[#f0dfc2] bg-[#fdf7ec] px-3 py-2 text-[11px] font-medium text-[#8e5c21]">
                    {error || authError}
                  </div>
                )}

                <div className="flex items-center justify-between pt-0.5 text-[11.5px]">
                  <label className="flex cursor-pointer items-center gap-2 text-[#546f7c]">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-[#00749d]"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setResetEmail(email);
                      setError("");
                      setResetSent(false);
                    }}
                    className="font-semibold text-[#00749d] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00749d] px-6 py-3 text-[12.5px] font-semibold tracking-wide text-white transition hover:bg-[#006688] disabled:opacity-60"
                >
                  <span>{loading ? "Đang đăng nhập..." : "Đăng nhập quản trị"}</span>
                  {!loading && <ArrowRight className="h-3.5 w-3.5" />}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/home"
                    className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 transition hover:text-slate-800"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Quay về website khách hàng</span>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf6f7] text-[#00749d]">
                  <Mail className="h-5 w-5" />
                </div>
                <h1 className="text-[24px] leading-tight font-extrabold text-[#023648]">
                  Đặt lại mật khẩu
                </h1>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                  Nhập email quản trị, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                </p>
              </div>

              {resetSent ? (
                <div className="mt-5 rounded-lg border border-[#cdeae6] bg-[#eaf6f7] p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold text-[#008478]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Đã gửi liên kết đặt lại mật khẩu</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-[#4d8b93]">
                    Kiểm tra hộp thư <b>{resetEmail}</b> và làm theo hướng dẫn. Liên kết có hiệu lực
                    trong 30 phút.
                  </p>
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#00749d] px-3.5 py-2 text-[11.5px] font-semibold text-white transition hover:bg-[#006688]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Về trang đăng nhập
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="mt-5 space-y-3.5">
                  <div>
                    <label className="mb-1.5 block text-[11.5px] font-semibold text-[#546f7c]">
                      Email quản trị
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="admin@20travel.vn"
                      className="w-full rounded-lg border border-[#e6eef2] px-3.5 py-2.5 text-[12.5px] font-medium text-[#31434e] outline-none transition focus:border-[#00749d] focus:ring-2 focus:ring-[#00749d]/15"
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-[#f0dfc2] bg-[#fdf7ec] px-3 py-2 text-[11px] font-medium text-[#8e5c21]">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00749d] px-6 py-3 text-[12.5px] font-semibold text-white transition hover:bg-[#006688] disabled:opacity-60"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{resetLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={backToLogin}
                    className="flex w-full items-center justify-center gap-1.5 py-1 text-[11.5px] font-semibold text-slate-500 transition hover:text-[#023648]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Quay lại đăng nhập
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
