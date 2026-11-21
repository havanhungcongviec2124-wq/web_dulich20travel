import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Upload,
  Check,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import {
  fetchCategories,
  fetchServices,
  createCategory,
  updateCategory,
  deleteCategory,
  createService,
  updateService,
  deleteService,
} from "../redux/slices/catalogSlice";
import { fetchConsultants } from "../redux/slices/consultantSlice";

const PAGE_SIZE = 6;

const sortLabels = {
  updated: "Mới cập nhật",
  priceAsc: "Giá tăng dần",
  priceDesc: "Giá giảm dần",
  nameAsc: "Tên A–Z",
};

const slugify = (str = "") =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `dich-vu-${Date.now()}`;

const formatDateLabel = (s) => {
  if (!s) return "—";
  if (s.updatedAtLabel) return s.updatedAtLabel;
  const d = s.updatedAt ? new Date(s.updatedAt) : null;
  if (d && !Number.isNaN(d.getTime())) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }
  return "—";
};

const collectServiceImages = (service = {}) => {
  const out = [];
  const add = (v) => {
    const s = typeof v === "string" ? v.trim() : "";
    if (s && !out.includes(s)) out.push(s);
  };
  add(service.image);
  add(service.secondaryImage);
  if (Array.isArray(service.gallery)) service.gallery.forEach(add);
  if (Array.isArray(service.images)) service.images.forEach(add);
  return out;
};

const normalizeServiceDraft = (service, categories) => {
  const cat = categories.find((c) => (c.key || c.id) === service.category) || null;
  const images = collectServiceImages(service);
  return {
    ...service,
    code: service.code || "",
    name: service.name || "",
    slug: service.slug || "",
    category: service.category || (categories[0]?.key || "hotel"),
    categoryName: service.categoryName || cat?.name || "",
    price: Number(service.price || 0),
    priceUnit: service.priceUnit || "phòng / đêm",
    status: service.status || (service.published === false ? "Bản nháp" : "Hiển thị"),
    consultant: service.consultant || "",
    featured: !!service.featured,
    image: images[0] || "",
    secondaryImage: images[1] || "",
    gallery: images.slice(1),
    images,
    address: service.address || "",
    description: service.description || service.summary || "",
    amenities: Array.isArray(service.amenities) ? service.amenities.map((a) => (typeof a === "string" ? a : a?.label)).filter(Boolean) : (service.tags || []),
    locationName: service.locationName || "",
    region: service.region || "",
  };
};

const blankService = (categories, consultants) => {
  const cat = categories[0];
  return {
    name: "Dịch vụ mới",
    slug: `dich-vu-moi-${Date.now()}`,
    code: `DV${Date.now().toString().slice(-4)}`,
    category: cat?.key || "hotel",
    categoryName: cat?.name || "Khách sạn",
    price: 0,
    priceUnit: "phòng / đêm",
    status: "Bản nháp",
    published: false,
    consultant: consultants[0]?.name || "",
    featured: false,
    image: "",
    secondaryImage: "",
    gallery: [],
    images: [],
    address: "",
    description: "",
    amenities: [],
    locationName: "",
    region: "",
  };
};

const AdminServices = () => {
  const dispatch = useDispatch();
  const servicesFromStore = useSelector((s) => s.catalog?.services || []);
  const categoriesFromStore = useSelector((s) => s.catalog?.categories || []);
  const consultants = useSelector((s) => s.consultants?.items || []);

  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStatCategory, setSelectedStatCategory] = useState("all");

  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("updated");
  const [sortOpen, setSortOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchServices({ limit: 500, full: true }));
    dispatch(fetchCategories());
    dispatch(fetchConsultants());
  }, [dispatch]);

  useEffect(() => {
    if (categoriesFromStore.length && !editingCategory) {
      setEditingCategory({ ...categoriesFromStore[0] });
    } else if (editingCategory) {
      const fresh = categoriesFromStore.find((c) => c._id === editingCategory._id || c.key === editingCategory.key);
      if (fresh && fresh !== editingCategory) setEditingCategory((prev) => ({ ...fresh, ...(prev?._isNew ? prev : {}) }));
    }
  }, [categoriesFromStore]); // eslint-disable-line react-hooks/exhaustive-deps

  const reloadAll = async () => {
    await Promise.all([dispatch(fetchServices({ limit: 500, full: true })), dispatch(fetchCategories())]);
  };

  const statTiles = useMemo(() => {
    const allCount = servicesFromStore.length;
    const byCat = (key) => {
      if (key === "cruise") return servicesFromStore.filter((s) => String(s.category || "").startsWith("cruise")).length;
      return servicesFromStore.filter((s) => s.category === key).length;
    };
    const tiles = [
      { id: "all", name: "Tất cả dịch vụ", count: allCount },
      { id: "hotel", name: "Khách sạn", count: byCat("hotel") },
      { id: "cruise", name: "Du thuyền", count: byCat("cruise") },
      { id: "ticket", name: "Vé vui chơi", count: byCat("ticket") },
      { id: "transport", name: "Xe & khác", count: byCat("transport") },
    ];
    return tiles;
  }, [servicesFromStore]);

  const openEditService = (service) => {
    setEditingService(normalizeServiceDraft(service, categoriesFromStore));
  };

  const saveService = async () => {
    if (!editingService) return;
    if (!editingService.name?.trim()) { alert("Vui lòng nhập tên dịch vụ."); return; }
    const images = Array.isArray(editingService.images)
      ? editingService.images.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean)
      : collectServiceImages(editingService);
    const payload = {
      ...editingService,
      name: editingService.name.trim(),
      slug: editingService.slug?.trim() || slugify(editingService.name),
      category: editingService.category,
      categoryName: editingService.categoryName || categoriesFromStore.find((c) => c.key === editingService.category)?.name || "",
      price: Number(editingService.price || 0),
      published: editingService.status === "Hiển thị",
      amenities: Array.isArray(editingService.amenities) ? editingService.amenities : [],
      image: images[0] || "",
      secondaryImage: images[1] || "",
      gallery: images.slice(1),
    };
    delete payload.images;
    try {
      setSaving(true);
      if (editingService._id) {
        await dispatch(updateService({ id: editingService._id, data: payload })).unwrap();
      } else {
        await dispatch(createService(payload)).unwrap();
      }
      await reloadAll();
      setEditingService(null);
      alert("Đã lưu dịch vụ.");
    } catch (err) {
      alert(err || "Không thể lưu dịch vụ.");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    const draft = {
      _isNew: true,
      key: `dm_${Date.now().toString().slice(-6)}`,
      name: "Danh mục mới",
      slug: "/danh-muc-moi",
      count: 0,
      unit: "lựa chọn",
      icon: "hotel",
      status: "Bật",
      order: categoriesFromStore.length + 1,
    };
    setEditingCategory(draft);
    setActiveTab("categories");
  };

  const saveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name?.trim()) { alert("Vui lòng nhập tên danh mục."); return; }
    const payload = {
      key: editingCategory.key || slugify(editingCategory.name),
      name: editingCategory.name.trim(),
      slug: editingCategory.slug || "",
      unit: editingCategory.unit || "dịch vụ",
      icon: editingCategory.icon || "",
      status: editingCategory.status || "Bật",
      order: Number(editingCategory.order || 0),
      count: editingCategory.count || 0,
    };
    try {
      setSaving(true);
      if (editingCategory._id && !editingCategory._isNew) {
        await dispatch(updateCategory({ id: editingCategory._id, data: payload })).unwrap();
      } else {
        const created = await dispatch(createCategory(payload)).unwrap();
        setEditingCategory(created || null);
      }
      await dispatch(fetchCategories());
      alert("Đã lưu danh mục.");
    } catch (err) {
      alert(err || "Không thể lưu danh mục.");
    } finally {
      setSaving(false);
    }
  };

  const cancelCategory = () => {
    if (editingCategory?._isNew) {
      setEditingCategory(categoriesFromStore[0] || null);
      return;
    }
    const saved = categoriesFromStore.find((c) => c._id === editingCategory?._id);
    if (saved) setEditingCategory({ ...saved });
  };

  const deleteCategoryAction = async () => {
    if (!editingCategory?._id) {
      setEditingCategory(categoriesFromStore[0] || null);
      return;
    }
    if ((editingCategory.count || 0) > 0) {
      alert(`Danh mục "${editingCategory.name}" còn ${editingCategory.count} dịch vụ. Hãy chuyển dịch vụ sang danh mục khác trước khi xóa.`);
      return;
    }
    if (!confirm(`Xóa danh mục "${editingCategory.name}"?`)) return;
    try {
      setSaving(true);
      await dispatch(deleteCategory(editingCategory._id)).unwrap();
      await dispatch(fetchCategories());
      setEditingCategory(null);
    } catch (err) {
      alert(err || "Không thể xóa danh mục.");
    } finally {
      setSaving(false);
    }
  };

  const handleServiceImagesUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const readers = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
          })
      )
    );
    const added = readers.filter(Boolean);
    if (added.length) {
      setEditingService((prev) => {
        if (!prev) return prev;
        const current = Array.isArray(prev.images) ? prev.images : collectServiceImages(prev);
        return { ...prev, images: [...current, ...added] };
      });
    }
    event.target.value = "";
  };

  const addServiceImageUrl = () => {
    const url = String(editingService?.imageUrlInput || "").trim();
    if (!url) return;
    setEditingService((prev) => {
      if (!prev) return prev;
      const current = Array.isArray(prev.images) ? prev.images : collectServiceImages(prev);
      if (current.includes(url)) return { ...prev, imageUrlInput: "" };
      return { ...prev, images: [...current, url], imageUrlInput: "" };
    });
  };

  const removeServiceImage = (idx) => {
    setEditingService((prev) => {
      if (!prev) return prev;
      const current = Array.isArray(prev.images) ? prev.images : collectServiceImages(prev);
      return { ...prev, images: current.filter((_, i) => i !== idx) };
    });
  };

  const filteredServices = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const list = servicesFromStore.filter((service) => {
      const codeName = `${service.code || ""} ${service.name || ""}`.toLowerCase();
      const matchesSearch = !searchQuery || codeName.includes(searchQuery.toLowerCase());
      const status = service.status || (service.published === false ? "Bản nháp" : "Hiển thị");
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const addr = `${service.address || ""} ${service.locationName || ""} ${service.region || ""}`;
      const matchesLocation =
        locationFilter === "all" ||
        (locationFilter === "halong" && /hạ long|ha long|quảng ninh/i.test(addr)) ||
        (locationFilter === "hanoi" && /hà nội|ha noi|nội bài/i.test(addr));
      const matchesCategory =
        selectedStatCategory === "all" ||
        (selectedStatCategory === "cruise"
          ? String(service.category || "").startsWith("cruise")
          : service.category === selectedStatCategory);
      const p = Number(service.price || 0);
      const matchesPrice = (min === null || p >= min) && (max === null || p <= max);
      const matchesFeatured = !featuredOnly || service.featured;
      return matchesSearch && matchesStatus && matchesLocation && matchesCategory && matchesPrice && matchesFeatured;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "priceAsc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceDesc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "nameAsc") return String(a.name || "").localeCompare(String(b.name || ""), "vi");
      const da = new Date(a.updatedAt || 0).getTime();
      const db = new Date(b.updatedAt || 0).getTime();
      return db - da;
    });
  }, [servicesFromStore, searchQuery, statusFilter, locationFilter, selectedStatCategory, minPrice, maxPrice, featuredOnly, sortBy]);

  useEffect(() => { setPage(1); }, [searchQuery, statusFilter, locationFilter, selectedStatCategory, minPrice, maxPrice, featuredOnly]);

  const pageCount = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedServices = filteredServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* ───────────── EDIT SERVICE ───────────── */
  if (editingService) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[24px] leading-tight font-extrabold tracking-[-0.02em] text-[#023648] sm:text-[26px]">Chỉnh sửa dịch vụ</h1>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Dịch vụ / {editingService.code || editingService.slug || "mới"} • {editingService._id ? "Cập nhật thông tin" : "Tạo dịch vụ mới"}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => setEditingService(null)} className="rounded-lg border border-[#e6eef2] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50">Hủy thay đổi</button>
            <button type="button" disabled={saving} onClick={saveService} className="rounded-lg bg-[#00749d] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#006688] disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.9fr_1fr]">
          {/* LEFT */}
          <div className="space-y-4">
            <section className="rounded-2xl bg-white p-5">
              <h3 className="text-[13px] font-bold text-[#023648]">Thông tin cơ bản</h3>
              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Tên dịch vụ <span className="text-[#b87a00]">*</span></label>
                <input type="text" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value, slug: editingService._id ? editingService.slug : slugify(e.target.value) })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Mã dịch vụ</label>
                  <input type="text" value={editingService.code || ""} onChange={(e) => setEditingService({ ...editingService, code: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] bg-[#f7fafb] px-3 py-2 text-[11px] font-medium text-slate-500 outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Slug</label>
                  <input type="text" value={editingService.slug || ""} onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Danh mục</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => {
                      const key = e.target.value;
                      const cat = categoriesFromStore.find((c) => c.key === key);
                      setEditingService({ ...editingService, category: key, categoryName: cat?.name || editingService.categoryName });
                    }}
                    className="w-full rounded-lg border border-[#e6eef2] bg-white px-3 py-2 text-[11px] font-medium text-[#023648] outline-none"
                  >
                    {categoriesFromStore.map((c) => <option key={c.key || c._id} value={c.key || c.id}>{c.name}</option>)}
                    {!categoriesFromStore.length && <option value={editingService.category}>{editingService.category}</option>}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Đơn vị giá</label>
                  <input type="text" value={editingService.priceUnit || ""} onChange={(e) => setEditingService({ ...editingService, priceUnit: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Tỉnh / thành phố</label>
                  <input type="text" value={editingService.region || ""} onChange={(e) => setEditingService({ ...editingService, region: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Khu vực</label>
                  <input type="text" value={editingService.locationName || ""} onChange={(e) => setEditingService({ ...editingService, locationName: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none" />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Địa chỉ</label>
                <input type="text" value={editingService.address || ""} onChange={(e) => setEditingService({ ...editingService, address: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5">
              <h3 className="text-[13px] font-bold text-[#023648]">Mô tả & tiện ích</h3>
              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Mô tả</label>
                <textarea rows={4} value={editingService.description || ""} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2.5 text-[11px] leading-relaxed text-[#31434e] outline-none focus:border-[#00749d]" />
              </div>
              <div className="mt-3">
                <span className="mb-2 block text-[11px] font-semibold text-[#31434e]">Tiện ích (phân tách bằng dấu phẩy)</span>
                <input type="text" value={(editingService.amenities || []).join(", ")} onChange={(e) => setEditingService({ ...editingService, amenities: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(editingService.amenities || []).map((amenity) => (
                    <span key={amenity} className="inline-flex items-center gap-1 rounded-full bg-[#eff7fa] px-2.5 py-1 text-[10px] font-semibold text-[#00749d]">
                      <Check className="h-3 w-3" /><span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5">
              <h3 className="text-[13px] font-bold text-[#023648]">Hình ảnh dịch vụ</h3>
              <p className="mt-1 text-[10.5px] text-slate-400">Ảnh đại diện và ảnh phụ (URL hoặc tải lên). Có thể thêm một hoặc nhiều ảnh. Ảnh đầu tiên là ảnh đại diện.</p>

              <div className="mt-3 flex flex-wrap gap-3">
                {(editingService.images || []).length === 0 ? (
                  <div className="flex h-[88px] w-full items-center justify-center rounded-lg border border-dashed border-[#d7e3e9] text-[11px] text-slate-400 sm:w-[260px]">
                    Chưa có ảnh
                  </div>
                ) : (
                  (editingService.images || []).map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative">
                      <img
                        src={img}
                        alt={`Ảnh ${idx + 1}`}
                        className="h-[88px] w-[132px] rounded-lg border border-[#e6eef2] object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute left-1.5 top-1.5 rounded bg-[#023648]/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">Ảnh đại diện</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeServiceImage(idx)}
                        className="absolute right-1.5 top-1.5 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 shadow-sm hover:bg-white"
                        title="Xóa ảnh"
                      >
                        Xóa
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-semibold text-[#31434e] transition hover:border-[#00749d] hover:text-[#00749d]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Tải ảnh lên (1 hoặc nhiều)</span>
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleServiceImagesUpload}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={editingService.imageUrlInput || ""}
                  onChange={(e) => setEditingService({ ...editingService, imageUrlInput: e.target.value })}
                  placeholder="Dán URL ảnh rồi nhấn Thêm URL"
                  className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] outline-none focus:border-[#00749d]"
                />
                <button
                  type="button"
                  onClick={addServiceImageUrl}
                  className="shrink-0 rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50"
                >
                  Thêm URL
                </button>
              </div>
              <p className="mt-2 text-[10.5px] text-slate-400">Có thể xóa ảnh để dịch vụ không có ảnh (đặc biệt khi thêm dịch vụ mới).</p>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <section className="rounded-2xl bg-white p-5">
              <h3 className="text-[13px] font-bold text-[#023648]">Trạng thái xuất bản</h3>
              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Hiển thị trên website</label>
                <select value={editingService.status} onChange={(e) => setEditingService({ ...editingService, status: e.target.value, published: e.target.value === "Hiển thị" })} className="w-full rounded-lg border border-[#e6eef2] bg-white px-3 py-2 text-[11px] font-medium text-[#023648] outline-none">
                  <option value="Hiển thị">● Đang hiển thị</option>
                  <option value="Bản nháp">Bản nháp</option>
                </select>
              </div>
              <div className="mt-3">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Nhân viên tư vấn</label>
                <select value={editingService.consultant || ""} onChange={(e) => setEditingService({ ...editingService, consultant: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] bg-white px-3 py-2 text-[11px] font-medium text-[#023648] outline-none">
                  <option value="">— Chọn —</option>
                  {consultants.map((c) => <option key={c._id || c.key || c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-[11px] font-medium text-[#31434e]">
                <input type="checkbox" checked={!!editingService.featured} onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })} className="h-3.5 w-3.5 rounded border-slate-300 accent-[#00749d]" />
                <span>Hiển thị trong dịch vụ nổi bật</span>
              </label>
            </section>

            <section className="rounded-2xl bg-white p-5">
              <h3 className="text-[13px] font-bold text-[#023648]">Giá & đơn vị tính</h3>
              <div className="mt-3">
                <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Giá từ (VNĐ)</label>
                <input type="number" min="0" step="10000" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
              </div>
              <div className="mt-2 text-[22px] leading-none font-extrabold text-[#00749d]">{new Intl.NumberFormat("vi-VN").format(Number(editingService.price || 0))}đ</div>
              <span className="mt-2 block text-[10.5px] text-slate-400">Giá từ / {editingService.priceUnit || "—"}</span>
              <Link to="/admin/bang-gia" className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e6eef2] py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50">
                <span>Quản lý bảng giá</span><ArrowRight className="h-3 w-3" />
              </Link>
            </section>

            <section className="rounded-2xl bg-white p-5">
              <h3 className="text-[13px] font-bold text-[#023648]">Lưu trữ & xóa</h3>
              <p className="mt-1 text-[10.5px] text-slate-400">Ẩn trước khi xóa để bảo toàn dữ liệu giá.</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button type="button" onClick={() => setEditingService({ ...editingService, status: editingService.status === "Hiển thị" ? "Bản nháp" : "Hiển thị", published: editingService.status !== "Hiển thị" })} className="flex items-center justify-center gap-1.5 rounded-lg border border-[#e6eef2] py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50">
                  <Eye className="h-3 w-3" /><span>{editingService.status === "Hiển thị" ? "Ẩn dịch vụ" : "Hiển thị"}</span>
                </button>
                <button
                  type="button"
                  disabled={!editingService._id || saving}
                  onClick={async () => {
                    if (!editingService._id) return;
                    if (!confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
                    try {
                      setSaving(true);
                      await dispatch(deleteService(editingService._id)).unwrap();
                      await reloadAll();
                      setEditingService(null);
                    } catch (err) {
                      alert(err || "Không thể xóa dịch vụ.");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="rounded-lg border border-[#f0dfc4] py-2 text-[11px] font-semibold text-[#b87a00] hover:bg-[#fff9ed] disabled:opacity-50"
                >
                  Xóa dịch vụ
                </button>
              </div>
            </section>
          </div>
        </div>

        <p className="text-[10px] text-slate-400">* Trường bắt buộc • Mọi thay đổi được ghi lại trong lịch sử hoạt động.</p>
      </div>
    );
  }

  const isCategories = activeTab === "categories";

  /* ───────────── LIST ───────────── */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[24px] leading-tight font-extrabold tracking-[-0.02em] text-[#023648] sm:text-[26px]">{isCategories ? "Quản lý danh mục" : "Danh mục & dịch vụ"}</h1>
          <p className="mt-1.5 text-[11px] text-slate-400">{isCategories ? "Tổ chức nhóm dịch vụ và thứ tự hiển thị trên website." : "Tổ chức và quản lý toàn bộ dịch vụ trên website."}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {isCategories ? (
            <button type="button" onClick={addCategory} className="flex items-center gap-1.5 rounded-lg bg-[#00749d] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#006688]">
              <Plus className="h-3.5 w-3.5" /><span>Thêm danh mục</span>
            </button>
          ) : (
            <button type="button" onClick={() => openEditService(blankService(categoriesFromStore, consultants))} className="flex items-center gap-1.5 rounded-lg bg-[#00749d] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#006688]">
              <Plus className="h-3.5 w-3.5" /><span>Thêm dịch vụ</span>
            </button>
          )}
        </div>
      </div>

      {/* STAT TILES */}
      {!isCategories && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statTiles.map((stat) => {
            const selected = selectedStatCategory === stat.id;
            return (
              <button key={stat.id} type="button" onClick={() => setSelectedStatCategory(stat.id)} className={`rounded-2xl px-3.5 py-3 text-left transition ${selected ? "bg-[#e5f5f6]" : "bg-white hover:bg-[#fbfdfe]"}`}>
                <span className={`block text-[10.5px] font-medium ${selected ? "text-[#008478]" : "text-slate-500"}`}>{stat.name}</span>
                <span className={`mt-1.5 block text-[21px] leading-none font-extrabold ${selected ? "text-[#008478]" : "text-[#023648]"}`}>{stat.count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* TABS + ACTIONS */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setActiveTab("services")} className={`rounded-lg px-4 py-2 text-[11px] font-semibold transition ${!isCategories ? "bg-[#00749d] text-white" : "bg-white text-[#546f7c] hover:bg-slate-50"}`}>Dịch vụ</button>
          <button type="button" onClick={() => setActiveTab("categories")} className={`rounded-lg px-4 py-2 text-[11px] font-semibold transition ${isCategories ? "bg-[#00749d] text-white" : "border border-[#e6eef2] bg-white text-[#546f7c] hover:bg-slate-50"}`}>Danh mục</button>
        </div>
        <div className="flex items-center gap-2">
          {!isCategories && (
            <button type="button" onClick={() => setActiveTab("categories")} className="flex items-center gap-1.5 rounded-lg border border-[#e6eef2] bg-white px-3 py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50">
              <Plus className="h-3 w-3" /><span>Thêm danh mục</span>
            </button>
          )}
          <div className="relative">
            <button type="button" onClick={() => setSortOpen((v) => !v)} className="flex items-center gap-1.5 rounded-lg border border-[#e6eef2] bg-white px-3 py-2 text-[11px] font-semibold text-[#31434e] hover:bg-slate-50">
              <SlidersHorizontal className="h-3 w-3" /><span>{sortLabels[sortBy]}</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <ul className="absolute right-0 z-20 mt-1 w-[160px] overflow-hidden rounded-lg border border-[#e6eef2] bg-white py-1 shadow-lg">
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <li key={value}>
                      <button type="button" onClick={() => { setSortBy(value); setSortOpen(false); }} className={`block w-full px-3 py-1.5 text-left text-[11px] transition ${sortBy === value ? "bg-[#e5f5f6] font-semibold text-[#008478]" : "font-medium text-[#31434e] hover:bg-slate-50"}`}>{label}</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {!isCategories ? (
        <>
          {/* FILTERS */}
          <div className="flex flex-col gap-2.5 rounded-2xl bg-white p-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm tên, mã dịch vụ..." className="w-full rounded-lg border border-[#e6eef2] py-2 pr-3 pl-9 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
            </div>
            <div className="relative lg:w-[190px]">
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full appearance-none rounded-lg border border-[#e6eef2] bg-white px-3 py-2 pr-8 text-[11px] font-medium text-[#546f7c] outline-none">
                <option value="all">Tất cả địa điểm</option>
                <option value="halong">Hạ Long</option>
                <option value="hanoi">Hà Nội</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-2.5 right-2.5 h-3 w-3 text-slate-400" />
            </div>
            <div className="relative lg:w-[160px]">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none rounded-lg border border-[#e6eef2] bg-white px-3 py-2 pr-8 text-[11px] font-medium text-[#546f7c] outline-none">
                <option value="all">Trạng thái</option>
                <option value="Hiển thị">Hiển thị</option>
                <option value="Bản nháp">Bản nháp</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-2.5 right-2.5 h-3 w-3 text-slate-400" />
            </div>
            <button type="button" onClick={() => setShowAdvanced((v) => !v)} className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${showAdvanced ? "border-[#00749d] bg-[#e5f5f6] text-[#008478]" : "border-[#e6eef2] text-[#00749d] hover:bg-[#f7fbfc]"}`}>
              <SlidersHorizontal className="h-3 w-3" /><span>{showAdvanced ? "Ẩn lọc" : "Lọc"}</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-2">
                <span className="shrink-0 text-[11px] font-semibold text-[#546f7c]">Khoảng giá</span>
                <input type="number" min="0" step="50000" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Từ (VNĐ)" className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
                <span className="text-slate-300">–</span>
                <input type="number" min="0" step="50000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Đến (VNĐ)" className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-[#31434e]">
                <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300 accent-[#00749d]" />
                <span>Chỉ dịch vụ nổi bật</span>
              </label>
              <button type="button" onClick={() => { setMinPrice(""); setMaxPrice(""); setFeaturedOnly(false); setSearchQuery(""); setLocationFilter("all"); setStatusFilter("all"); setSelectedStatCategory("all"); }} className="rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-semibold text-[#546f7c] hover:bg-slate-50">Xóa bộ lọc</button>
            </div>
          )}

          {/* SERVICES TABLE */}
          <div className="overflow-hidden rounded-2xl bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-[#eff7fa]">
                  <tr className="text-[10.5px] text-slate-500">
                    <th className="px-3.5 py-3 font-semibold">Mã / Tên dịch vụ</th>
                    <th className="px-3.5 py-3 font-semibold">Danh mục</th>
                    <th className="px-3.5 py-3 font-semibold">Giá từ</th>
                    <th className="px-3.5 py-3 font-semibold">Cập nhật</th>
                    <th className="px-3.5 py-3 font-semibold">Trạng thái</th>
                    <th className="px-3.5 py-3 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedServices.map((service) => {
                    const status = service.status || (service.published === false ? "Bản nháp" : "Hiển thị");
                    const catName = service.categoryName || categoriesFromStore.find((c) => c.key === service.category)?.name || service.category || "—";
                    return (
                      <tr key={service._id || service.slug} className="border-t border-[#f1f6f8] hover:bg-[#fbfdfe]">
                        <td className="px-3.5 py-[15px] text-[11px] font-bold text-[#023648]">{service.code ? `${service.code} - ` : ""}{service.name}</td>
                        <td className="px-3.5 py-[15px] text-[11px] text-[#546f7c]">{catName}</td>
                        <td className="px-3.5 py-[15px] text-[11px] font-semibold text-[#023648]">{new Intl.NumberFormat("vi-VN").format(Number(service.price || 0))}đ</td>
                        <td className="px-3.5 py-[15px] text-[11px] text-slate-400">{formatDateLabel(service)}</td>
                        <td className="px-3.5 py-[15px]">
                          {status === "Hiển thị" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f5f6] px-2 py-0.5 text-[10px] font-semibold text-[#008478]"><Check className="h-2.5 w-2.5" /><span>Hiển thị</span></span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf3e3] px-2 py-0.5 text-[10px] font-semibold text-[#b87a00]"><span>Bản nháp</span></span>
                          )}
                        </td>
                        <td className="px-3.5 py-[15px] text-right">
                          <button type="button" onClick={() => openEditService(service)} className="inline-flex items-center gap-1 rounded-md border border-[#e6eef2] px-2 py-1 text-[10.5px] font-semibold text-[#31434e] hover:bg-slate-50">
                            <span>Sửa</span><MoreHorizontal className="h-3 w-3 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pagedServices.length === 0 && (
                    <tr><td colSpan={6} className="px-3.5 py-10 text-center text-[11px] text-slate-400">Không có dịch vụ phù hợp.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#f1f6f8] px-4 py-3 text-[10.5px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Hiển thị {filteredServices.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredServices.length)} trên {filteredServices.length} dịch vụ
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-6 w-6 rounded border border-[#e6eef2] text-[10px] disabled:cursor-not-allowed disabled:opacity-40">‹</button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" onClick={() => setPage(p)} className={`h-6 w-6 rounded text-[10px] font-bold ${p === currentPage ? "bg-[#00749d] text-white" : "border border-[#e6eef2] text-slate-500"}`}>{p}</button>
                ))}
                <button type="button" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount} className="h-6 w-6 rounded border border-[#e6eef2] text-[10px] disabled:cursor-not-allowed disabled:opacity-40">›</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* CATEGORIES TAB */
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl bg-white p-5">
            <h3 className="text-[13px] font-bold text-[#023648]">{categoriesFromStore.length} danh mục dịch vụ</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#f1f6f8] text-[10.5px] text-slate-500">
                    <th className="pb-2.5 font-semibold">Tên danh mục</th>
                    <th className="pb-2.5 font-semibold">Dịch vụ</th>
                    <th className="pb-2.5 font-semibold">Hiển thị</th>
                    <th className="pb-2.5 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesFromStore.map((cat) => (
                    <tr key={cat._id || cat.key} onClick={() => setEditingCategory({ ...cat })} className={`cursor-pointer border-b border-[#f7fafb] transition ${(editingCategory?._id || editingCategory?.key) === (cat._id || cat.key) ? "bg-[#f7fbfc]" : "hover:bg-[#fbfdfe]"}`}>
                      <td className="py-3 text-[11px] font-bold text-[#023648]">{cat.name}</td>
                      <td className="py-3 text-[11px] text-[#546f7c]">{cat.count ?? 0}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.status === "Ẩn" ? "bg-slate-100 text-slate-500" : "bg-[#e5f5f6] text-[#008478]"}`}>
                          <span className={`h-1 w-1 rounded-full ${cat.status === "Ẩn" ? "bg-slate-400" : "bg-[#008478]"}`} />
                          <span>{cat.status === "Ẩn" ? "Ẩn" : "Bật"}</span>
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#546f7c]"><span>Sửa</span><MoreHorizontal className="h-3 w-3 text-slate-400" /></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-fit rounded-2xl bg-white p-5">
            <h3 className="text-[13px] font-bold text-[#023648]">Chỉnh sửa danh mục</h3>
            {editingCategory ? (
              <>
                <div className="mt-4">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Tên danh mục <span className="text-[#b87a00]">*</span></label>
                  <input type="text" value={editingCategory.name || ""} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
                </div>
                <div className="mt-3">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Mã (key)</label>
                  <input type="text" value={editingCategory.key || ""} onChange={(e) => setEditingCategory({ ...editingCategory, key: e.target.value })} disabled={!!editingCategory._id && !editingCategory._isNew} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d] disabled:bg-[#f7fafb] disabled:text-slate-400" />
                </div>
                <div className="mt-3">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Đường dẫn</label>
                  <input type="text" value={editingCategory.slug || ""} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none focus:border-[#00749d]" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Thứ tự hiển thị</label>
                    <input type="number" min="1" value={editingCategory.order ?? 1} onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })} className="w-full rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-medium text-[#023648] outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-[#31434e]">Trạng thái</label>
                    <select value={editingCategory.status || "Bật"} onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value })} className="w-full rounded-lg border border-[#e6eef2] bg-white px-3 py-2 text-[11px] font-medium text-[#023648] outline-none">
                      <option value="Bật">Hiển thị</option>
                      <option value="Ẩn">Ẩn</option>
                    </select>
                  </div>
                </div>
                <p className="mt-3 text-[10.5px] leading-relaxed text-slate-400">Danh mục đang có {editingCategory.count || 0} dịch vụ. Chuyển dịch vụ sang danh mục khác trước khi xóa.</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <button type="button" disabled={saving} onClick={saveCategory} className="rounded-lg bg-[#00749d] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#006688] disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu danh mục"}</button>
                  <button type="button" onClick={cancelCategory} className="rounded-lg border border-[#e6eef2] px-3 py-2 text-[11px] font-semibold text-[#546f7c] hover:bg-slate-50">Hủy</button>
                </div>
                <button type="button" onClick={deleteCategoryAction} className="mt-4 text-[10.5px] font-semibold text-[#b87a00] hover:underline">Xóa danh mục</button>
              </>
            ) : (
              <p className="mt-4 text-[11px] text-slate-400">Chọn một danh mục để chỉnh sửa.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;