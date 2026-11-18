import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent, updateContent } from "../redux/slices/contentSlice";

const emptyBanner = () => ({
  id: `BN${Date.now()}`,
  title: "",
  desc: "",
  buttonLabel: "Xem chi tiết",
  buttonLink: "/dich-vu",
  image: "/images/figma-hero.jpg",
  dimension: "Desktop 1440 x 490",
  status: "Hiển thị",
});

const emptyPolicy = () => ({ id: `pl${Date.now()}`, title: "", content: "" });
const emptyFaq = () => ({ q: "", a: "" });

const AdminContent = () => {
  const dispatch = useDispatch();
  const content = useSelector((s) => s.content?.data);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState({});
  const [banners, setBanners] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [info, setInfo] = useState({});
  const consultantAvatarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  useEffect(() => {
    if (!content) return;
    setCompany(content.company || {});
    setBanners(Array.isArray(content.banners) ? content.banners : []);
    setPolicies(Array.isArray(content.policies) ? content.policies : []);
    setFaqs(Array.isArray(content.info?.faqs) ? content.info.faqs : []);
    setInfo(content.info || {});
  }, [content]);

  const saveAll = async () => {
    try {
      setSaving(true);
      await dispatch(
        updateContent({
          company,
          banners,
          policies,
          info: { ...info, faqs },
        })
      ).unwrap();
      alert("Đã lưu nội dung website.");
    } catch (err) {
      alert(err || "Không thể lưu nội dung.");
    } finally {
      setSaving(false);
    }
  };

  const setCompanyField = (k, v) => setCompany((c) => ({ ...c, [k]: v }));
  const setInfoField = (k, v) => setInfo((i) => ({ ...i, [k]: v }));

  const updateBanner = (idx, patch) => setBanners((arr) => arr.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  const updatePolicy = (idx, patch) => setPolicies((arr) => arr.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  const updateFaq = (idx, patch) => setFaqs((arr) => arr.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const handleConsultantAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCompany((c) => ({ ...c, consultantAvatar: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-tight font-extrabold text-[#023648]">Nội dung website</h1>
          <p className="mt-1 text-[12px] text-slate-400">Cập nhật thông tin công ty, banner, chính sách và câu hỏi thường gặp.</p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="rounded-md bg-[#00749d] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#006688] disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-[#e6eef2] bg-white p-5">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Thông tin công ty</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Tên thương hiệu" value={company.brand || ""} onChange={(v) => setCompanyField("brand", v)} />
            <Field label="Hotline" value={company.hotline || ""} onChange={(v) => setCompanyField("hotline", v)} />
            <Field label="Hotline (số)" value={company.hotlineRaw || ""} onChange={(v) => setCompanyField("hotlineRaw", v)} />
            <Field label="Hotline văn phòng" value={company.officeHotline || ""} onChange={(v) => setCompanyField("officeHotline", v)} />
            <Field label="Email" value={company.email || ""} onChange={(v) => setCompanyField("email", v)} />
            <Field label="Giờ làm việc" value={company.workingHours || ""} onChange={(v) => setCompanyField("workingHours", v)} />
            <Field label="Facebook" value={company.facebook || ""} onChange={(v) => setCompanyField("facebook", v)} />
            <Field label="Zalo" value={company.zalo || ""} onChange={(v) => setCompanyField("zalo", v)} />
            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Ảnh đại diện tư vấn</span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {company.consultantAvatar ? (
                    <img
                      src={company.consultantAvatar}
                      alt="Ảnh đại diện tư vấn"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover border border-[#e6eef2]"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-xl border border-dashed border-[#cfe0e7] bg-[#f7fbfc]" />
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={consultantAvatarRef}
                      type="file"
                      accept="image/*"
                      onChange={handleConsultantAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => consultantAvatarRef.current?.click()}
                      className="rounded-md border border-[#e6eef2] px-3 py-2 text-[11.5px] font-semibold text-[#31434e] transition hover:bg-[#f7fbfc]"
                    >
                      Chọn ảnh từ máy
                    </button>
                    {company.consultantAvatar && (
                      <button
                        type="button"
                        onClick={() => setCompanyField("consultantAvatar", "")}
                        className="rounded-md px-3 py-2 text-[11.5px] font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                </div>
                <input
                  value={company.consultantAvatar || ""}
                  onChange={(e) => setCompanyField("consultantAvatar", e.target.value)}
                  placeholder="Hoặc dán URL ảnh..."
                  className="mt-2 h-10 w-full rounded-lg border border-[#e6eef2] px-3 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]"
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <Field label="Địa chỉ" value={company.address || ""} onChange={(v) => setCompanyField("address", v)} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Tên pháp lý" value={company.legalName || ""} onChange={(v) => setCompanyField("legalName", v)} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Ghi chú thanh toán" value={company.paymentNote || ""} onChange={(v) => setCompanyField("paymentNote", v)} />
            </div>
            <Field label="Ngày cập nhật giá" value={company.priceUpdatedAt || ""} onChange={(v) => setCompanyField("priceUpdatedAt", v)} />
          </div>
        </section>

        <section className="rounded-xl border border-[#e6eef2] bg-white p-5">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Thông tin hiển thị</h2>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <Field label="Tên website" value={info.siteName || ""} onChange={(v) => setInfoField("siteName", v)} />
            <Field label="Tagline" value={info.tagline || ""} onChange={(v) => setInfoField("tagline", v)} />
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Ngày lễ (mỗi dòng: YYYY-MM-DD | Tên)</span>
              <textarea
                rows={6}
                value={(info.holidays || []).map((h) => `${h.date} | ${h.name}`).join("\n")}
                onChange={(e) => {
                  const holidays = e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [date, ...rest] = line.split("|");
                      return { date: (date || "").trim(), name: rest.join("|").trim() || "Ngày lễ" };
                    })
                    .filter((h) => h.date);
                  setInfoField("holidays", holidays);
                }}
                className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]"
              />
            </label>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-[#e6eef2] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Banner trang chủ</h2>
          <button type="button" onClick={() => setBanners((b) => [...b, emptyBanner()])} className="text-[11.5px] font-semibold text-[#00749d] hover:underline">+ Thêm banner</button>
        </div>
        <div className="mt-4 space-y-4">
          {banners.map((banner, idx) => (
            <div key={banner.id || idx} className="rounded-lg border border-[#e6eef2] p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Tiêu đề" value={banner.title || ""} onChange={(v) => updateBanner(idx, { title: v })} />
                <Field label="Nút (label)" value={banner.buttonLabel || ""} onChange={(v) => updateBanner(idx, { buttonLabel: v })} />
                <Field label="Liên kết nút" value={banner.buttonLink || ""} onChange={(v) => updateBanner(idx, { buttonLink: v })} />
                <Field label="Ảnh (URL)" value={banner.image || ""} onChange={(v) => updateBanner(idx, { image: v })} />
                <Field label="Kích thước/ghi chú" value={banner.dimension || ""} onChange={(v) => updateBanner(idx, { dimension: v })} />
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Trạng thái</span>
                  <select value={banner.status || "Hiển thị"} onChange={(e) => updateBanner(idx, { status: e.target.value })} className="h-10 w-full rounded-lg border border-[#e6eef2] px-3 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]">
                    <option>Hiển thị</option>
                    <option>Đang ẩn</option>
                  </select>
                </label>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Mô tả</span>
                    <textarea rows={2} value={banner.desc || ""} onChange={(e) => updateBanner(idx, { desc: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]" />
                  </label>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => setBanners((arr) => arr.filter((_, i) => i !== idx))} className="text-[11px] font-semibold text-red-600 hover:underline">Xóa banner</button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-[12px] text-slate-400">Chưa có banner.</p>}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-[#e6eef2] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Chính sách</h2>
          <button type="button" onClick={() => setPolicies((p) => [...p, emptyPolicy()])} className="text-[11.5px] font-semibold text-[#00749d] hover:underline">+ Thêm chính sách</button>
        </div>
        <div className="mt-4 space-y-4">
          {policies.map((policy, idx) => (
            <div key={policy.id || idx} className="rounded-lg border border-[#e6eef2] p-4">
              <div className="grid grid-cols-1 gap-3">
                <Field label="Tiêu đề" value={policy.title || ""} onChange={(v) => updatePolicy(idx, { title: v })} />
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Nội dung</span>
                  <textarea rows={3} value={policy.content || ""} onChange={(e) => updatePolicy(idx, { content: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]" />
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => setPolicies((arr) => arr.filter((_, i) => i !== idx))} className="text-[11px] font-semibold text-red-600 hover:underline">Xóa</button>
              </div>
            </div>
          ))}
          {policies.length === 0 && <p className="text-[12px] text-slate-400">Chưa có chính sách.</p>}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-[#e6eef2] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Câu hỏi thường gặp (FAQ)</h2>
          <button type="button" onClick={() => setFaqs((f) => [...f, emptyFaq()])} className="text-[11.5px] font-semibold text-[#00749d] hover:underline">+ Thêm câu hỏi</button>
        </div>
        <div className="mt-4 space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-lg border border-[#e6eef2] p-4">
              <div className="grid grid-cols-1 gap-3">
                <Field label="Câu hỏi" value={faq.q || ""} onChange={(v) => updateFaq(idx, { q: v })} />
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Trả lời</span>
                  <textarea rows={2} value={faq.a || ""} onChange={(e) => updateFaq(idx, { a: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]" />
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => setFaqs((arr) => arr.filter((_, i) => i !== idx))} className="text-[11px] font-semibold text-red-600 hover:underline">Xóa</button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-[12px] text-slate-400">Chưa có FAQ.</p>}
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-lg border border-[#e6eef2] px-3 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]"
    />
  </label>
);

export default AdminContent;
