import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, Search } from "lucide-react";
import { fetchActivityLogsApi } from "../redux/Api/adminApi";

const PAGE_SIZE = 10;

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const AdminHistory = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (activeTab !== "all") params.action = activeTab;
      if (selectedAdmin !== "all") params.admin = selectedAdmin;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      params.page = page;
      params.limit = PAGE_SIZE;
      const res = await fetchActivityLogsApi(params);
      const data = Array.isArray(res) ? res : (res?.data || []);
      setLogs(data);
      setTotal(res?.total ?? data.length);
    } catch (err) {
      setError(err?.message || "Không thể tải lịch sử hoạt động.");
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedAdmin, fromDate, toDate, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedAdmin, fromDate, toDate, searchQuery]);

  const admins = useMemo(() => {
    const set = new Set(logs.map((l) => l.admin).filter(Boolean));
    return Array.from(set);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((l) =>
      [l.action, l.target, l.targetName, l.admin, l.reason, l.dateApplied, l.packageInfo]
        .some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [logs, searchQuery]);

  const totalPages = Math.max(1, Math.ceil((total || filteredLogs.length) / PAGE_SIZE));

  const exportCsv = () => {
    const header = ["Thời gian", "Người thực hiện", "Hành động", "Đối tượng", "Tên", "Ngày áp dụng", "Gói", "Giá trước", "Giá sau", "Lý do"];
    const lines = [header.map(csvCell).join(",")];
    filteredLogs.forEach((l) => {
      lines.push([
        l.time || l.timestamp || l.createdAt || "",
        l.admin || "",
        l.action || "",
        l.target || "",
        l.targetName || "",
        l.dateApplied || "",
        l.packageInfo || "",
        l.priceBefore || "",
        l.priceAfter || "",
        l.reason || "",
      ].map(csvCell).join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lich-su-hoat-dong-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const actionBadge = (action) => {
    const a = String(action || "").toLowerCase();
    if (a.includes("tạo") || a.includes("thêm") || a.includes("import")) return "bg-[#e5f5f6] text-[#008478]";
    if (a.includes("xóa")) return "bg-red-50 text-red-600";
    if (a.includes("cập nhật") || a.includes("sửa") || a.includes("giá")) return "bg-[#fff4d8] text-[#a56d00]";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-tight font-extrabold text-[#023648]">Lịch sử hoạt động</h1>
          <p className="mt-1 text-[12px] text-slate-400">Theo dõi các thay đổi và thao tác trong hệ thống quản trị.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-md border border-[#e6eef2] bg-white px-4 py-2 text-[12px] font-semibold text-[#31434e] transition hover:bg-[#f7fbfc]"
        >
          <Download className="h-4 w-4" /> Xuất CSV
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-[#e6eef2] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tất cả" },
              { id: "Cập nhật giá", label: "Cập nhật giá" },
              { id: "Tạo dịch vụ", label: "Tạo dịch vụ" },
              { id: "Cập nhật dịch vụ", label: "Cập nhật dịch vụ" },
              { id: "Import Excel", label: "Import Excel" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-[11.5px] font-semibold transition ${activeTab === tab.id ? "bg-[#00749d] text-white" : "bg-[#f3f8fa] text-[#546f7c] hover:bg-[#e8f2f5]"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
                placeholder="Tìm kiếm..."
                className="h-9 w-[220px] rounded-md border border-[#e6eef2] pr-3 pl-9 text-[11.5px] text-[#31434e] outline-none focus:border-[#00749d]"
              />
            </div>
            <div className="relative">
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="h-9 appearance-none rounded-md border border-[#e6eef2] bg-white pr-7 pl-3 text-[11.5px] font-medium text-[#31434e] outline-none"
              >
                <option value="all">Người thực hiện</option>
                {admins.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-9 rounded-md border border-[#e6eef2] px-2 text-[11.5px] text-[#31434e] outline-none" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-9 rounded-md border border-[#e6eef2] px-2 text-[11.5px] text-[#31434e] outline-none" />
            <button type="button" onClick={fetchLogs} className="h-9 rounded-md bg-[#00749d] px-3 text-[11.5px] font-semibold text-white hover:bg-[#006688]">Lọc</button>
          </div>
        </div>

        {error && <p className="mt-3 text-[12px] text-red-600">{error}</p>}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#edf3f5] text-[10.5px] font-semibold text-slate-400">
                <th className="py-2.5 pr-3 font-semibold">Thời gian</th>
                <th className="py-2.5 pr-3 font-semibold">Người thực hiện</th>
                <th className="py-2.5 pr-3 font-semibold">Hành động</th>
                <th className="py-2.5 pr-3 font-semibold">Đối tượng</th>
                <th className="py-2.5 pr-3 font-semibold">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-[12px] text-slate-400">Đang tải...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-[12px] text-slate-400">Không có lịch sử phù hợp.</td></tr>
              ) : (
                filteredLogs.map((log) => {
                  const id = log._id || log.id || `${log.timestamp}-${log.action}-${log.targetName}`;
                  const open = expandedId === id;
                  return (
                    <FragmentRow key={id} log={log} open={open} onToggle={() => setExpandedId(open ? null : id)} actionBadge={actionBadge} />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-2">
            {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" onClick={() => setPage(n)} className={`h-8 min-w-8 rounded-md px-2 text-[11px] font-semibold ${page === n ? "bg-[#00749d] text-white" : "border border-[#e6eef2] text-[#31434e] hover:bg-[#f7fbfc]"}`}>
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FragmentRow = ({ log, open, onToggle, actionBadge }) => (
  <>
    <tr className="border-b border-[#f4f8fa] text-[#31434e]">
      <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{log.time || (log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN") : "—")}</td>
      <td className="py-3 pr-3 font-medium text-[#023648]">{log.admin || "—"}</td>
      <td className="py-3 pr-3">
        <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-semibold ${actionBadge(log.action)}`}>{log.action || "—"}</span>
      </td>
      <td className="py-3 pr-3">
        <div className="font-medium text-[#023648]">{log.target || "—"}</div>
        <div className="text-[10.5px] text-slate-400">{log.targetName || ""}</div>
      </td>
      <td className="py-3 pr-3">
        <button type="button" onClick={onToggle} className="text-[11px] font-semibold text-[#00749d] hover:underline">
          {open ? "Ẩn" : "Xem"}
        </button>
      </td>
    </tr>
    {open && (
      <tr className="border-b border-[#f4f8fa] bg-[#fafcfd]">
        <td colSpan={5} className="px-3 py-3">
          <div className="grid grid-cols-1 gap-2 text-[11.5px] text-[#546f7c] sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Ngày áp dụng" value={log.dateApplied || "—"} />
            <Info label="Gói/Thông tin" value={log.packageInfo || "—"} />
            <Info label="Giá trước" value={log.priceBefore || "—"} />
            <Info label="Giá sau" value={log.priceAfter || "—"} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Info label="Lý do/Ghi chú" value={log.reason || "—"} />
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
);

const Info = ({ label, value }) => (
  <div>
    <span className="text-slate-400">{label}: </span>
    <span className="font-medium text-[#31434e]">{value}</span>
  </div>
);

export default AdminHistory;
