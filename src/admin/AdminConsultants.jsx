import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import {
  fetchConsultants,
  createConsultant,
  updateConsultant,
  deleteConsultant,
} from "../redux/slices/consultantSlice";

const PAGE_SIZE = 6;

const statusOf = (c) => (c?.status === "Hoạt động" || c?.active ? "Hoạt động" : "Tạm ẩn");

const blankConsultant = () => ({
  name: "Nhân viên mới",
  role: "Khách sạn",
  specialty: "Tư vấn dịch vụ du lịch",
  phone: "0900 000 000",
  zalo: "https://zalo.me/0362715585",
  facebook: "facebook.com/hoangthiendll",
  status: "Hoạt động",
  active: true,
  avatar: "/images/figma-consultant.jpg",
});

const AdminConsultants = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.consultants?.items || []);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConsultants());
  }, [dispatch]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId(null);
      setDraft(null);
      return;
    }
    const current = items.find((c) => c._id === selectedId) || items[0];
    if (!selectedId || !items.some((c) => c._id === selectedId)) {
      setSelectedId(current._id);
      setDraft({ ...current });
    }
  }, [items, selectedId]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((c) => statusOf(c) === "Hoạt động").length,
      hidden: items.filter((c) => statusOf(c) !== "Hoạt động").length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      [c.name, c.role, c.phone, c.specialty, c.status].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const selectConsultant = (c) => {
    setSelectedId(c._id);
    setDraft({ ...c });
  };

  const handleDraftChange = (field, value) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      setSaving(true);
      const payload = {
        ...draft,
        active: statusOf(draft) === "Hoạt động",
      };
      if (draft._id) {
        await dispatch(updateConsultant({ id: draft._id, data: payload })).unwrap();
      } else {
        const created = await dispatch(createConsultant(payload)).unwrap();
        if (created?._id) {
          setSelectedId(created._id);
          setDraft({ ...created });
        }
      }
      await dispatch(fetchConsultants());
    } catch (err) {
      alert(err || "Không thể lưu nhân viên tư vấn.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    try {
      setSaving(true);
      const created = await dispatch(createConsultant(blankConsultant())).unwrap();
      await dispatch(fetchConsultants());
      if (created?._id) {
        setSelectedId(created._id);
        setDraft({ ...created });
      }
      setPage(1);
      setSearch("");
    } catch (err) {
      alert(err || "Không thể thêm nhân viên.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft?._id) return;
    if (!window.confirm("Bạn có chắc muốn xóa nhân viên tư vấn này?")) return;
    try {
      setSaving(true);
      await dispatch(deleteConsultant(draft._id)).unwrap();
      await dispatch(fetchConsultants());
      setDraft(null);
      setSelectedId(null);
    } catch (err) {
      alert(err || "Không thể xóa nhân viên.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, avatar: String(reader.result || d?.avatar || "") }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-tight font-extrabold text-[#023648]">Nhân viên tư vấn</h1>
          <p className="mt-1 text-[12px] text-slate-400">Quản lý danh sách và thông tin người phụ trách tư vấn khách hàng.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-[#00749d] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#006688] disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Thêm nhân viên
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e6eef2] bg-white p-4">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">Tổng nhân viên</p>
          <p className="mt-2 text-[26px] font-extrabold text-[#023648]">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-[#e6eef2] bg-white p-4">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">Đang hoạt động</p>
          <p className="mt-2 text-[26px] font-extrabold text-[#008478]">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-[#e6eef2] bg-white p-4">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase">Tạm ẩn</p>
          <p className="mt-2 text-[26px] font-extrabold text-slate-500">{stats.hidden}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-xl border border-[#e6eef2] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[14px] font-extrabold text-[#023648]">Danh sách tư vấn viên</h2>
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm theo tên, vai trò, SĐT..."
                className="h-10 w-full rounded-lg border border-[#e6eef2] pr-3 pl-9 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#edf3f5] text-[10.5px] font-semibold text-slate-400">
                  <th className="py-2.5 pr-3 font-semibold">Nhân viên</th>
                  <th className="py-2.5 pr-3 font-semibold">Vai trò</th>
                  <th className="py-2.5 pr-3 font-semibold">Liên hệ</th>
                  <th className="py-2.5 pr-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => {
                  const active = c._id === selectedId;
                  return (
                    <tr
                      key={c._id}
                      onClick={() => selectConsultant(c)}
                      className={`cursor-pointer border-b border-[#f4f8fa] last:border-0 ${active ? "bg-[#f0f9fb]" : "hover:bg-[#fafcfd]"}`}
                    >
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <img src={c.avatar || c.image || "/images/figma-consultant.jpg"} alt={c.name} className="h-9 w-9 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-[#023648]">{c.name}</p>
                            <p className="text-[10.5px] text-slate-400">{c.specialty || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-slate-600">{c.role || "—"}</td>
                      <td className="py-3 pr-3 text-slate-600">{c.phone || "—"}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-semibold ${statusOf(c) === "Hoạt động" ? "bg-[#e5f5f6] text-[#008478]" : "bg-slate-100 text-slate-500"}`}>
                          {statusOf(c)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[12px] text-slate-400">Không tìm thấy nhân viên phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 rounded-md px-2 text-[11px] font-semibold ${page === n ? "bg-[#00749d] text-white" : "border border-[#e6eef2] text-[#31434e] hover:bg-[#f7fbfc]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#e6eef2] bg-white p-4 sm:p-5">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Thông tin chi tiết</h2>
          {!draft ? (
            <p className="mt-4 text-[12px] text-slate-400">Chọn một nhân viên để xem và chỉnh sửa.</p>
          ) : (
            <div className="mt-4 space-y-3.5">
              <div className="flex items-center gap-3">
                <img src={draft.avatar || draft.image || "/images/figma-consultant.jpg"} alt={draft.name || "avatar"} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-md border border-[#e6eef2] px-3 py-1.5 text-[11px] font-semibold text-[#31434e] hover:bg-[#f7fbfc]"
                  >
                    Đổi ảnh đại diện
                  </button>
                </div>
              </div>

              <Field label="Họ và tên" value={draft.name || ""} onChange={(v) => handleDraftChange("name", v)} />
              <Field label="Vai trò" value={draft.role || ""} onChange={(v) => handleDraftChange("role", v)} />
              <Field label="Chuyên môn" value={draft.specialty || ""} onChange={(v) => handleDraftChange("specialty", v)} />
              <Field label="Số điện thoại" value={draft.phone || ""} onChange={(v) => handleDraftChange("phone", v)} />
              <Field label="Zalo" value={draft.zalo || ""} onChange={(v) => handleDraftChange("zalo", v)} />
              <Field label="Facebook" value={draft.facebook || ""} onChange={(v) => handleDraftChange("facebook", v)} />

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Trạng thái</span>
                <select
                  value={statusOf(draft)}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleDraftChange("status", val);
                    handleDraftChange("active", val === "Hoạt động");
                  }}
                  className="h-10 w-full rounded-lg border border-[#e6eef2] px-3 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm ẩn">Tạm ẩn</option>
                </select>
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-md bg-[#00749d] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#006688] disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                {draft._id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-md border border-red-200 px-4 py-2.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
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

export default AdminConsultants;
