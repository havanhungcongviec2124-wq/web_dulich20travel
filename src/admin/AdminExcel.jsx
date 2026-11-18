import { useRef, useState } from "react";
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { exportExcelApi, importExcelApi } from "../redux/Api/adminApi";

const typeOptions = [
  { value: "daily-prices", label: "Giá theo ngày (daily-prices)" },
  { value: "services", label: "Dịch vụ (services)" },
  { value: "pricing-rules", label: "Quy tắc giá (pricing-rules)" },
];

const AdminExcel = () => {
  const [type, setType] = useState("daily-prices");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const exportExcel = async () => {
    try {
      setExporting(true);
      setError("");
      setMessage("");
      const { blob, contentDisposition } = await exportExcelApi(type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const m = contentDisposition.match(/filename="?([^"]+)"?/i);
      a.download = m?.[1] || `${type}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage("Đã tải file export thành công.");
    } catch (err) {
      setError(err.message || "Không thể export file.");
    } finally {
      setExporting(false);
    }
  };

  const runImport = async (commit) => {
    if (!file) {
      setError("Vui lòng chọn file Excel để import.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      const data = await importExcelApi({ type, file, commit });
      setPreview(data);
      setMessage(commit ? "Đã xác nhận import dữ liệu thành công." : "Đã kiểm tra file. Xem kết quả preview bên dưới.");
    } catch (err) {
      setError(err.message || "Không thể import file.");
    } finally {
      setLoading(false);
    }
  };

  const rows = preview?.rows || [];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-tight font-extrabold text-[#023648]">Import / Export Excel</h1>
          <p className="mt-1 text-[12px] text-slate-400">Xuất dữ liệu ra Excel hoặc nhập dữ liệu hàng loạt vào hệ thống.</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-[#e6eef2] bg-white p-5">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Export dữ liệu</h2>
          <p className="mt-1 text-[11.5px] text-slate-500">Tải file Excel theo loại dữ liệu đang quản lý.</p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#546f7c]">Loại dữ liệu</span>
              <select
                value={type}
                onChange={(e) => { setType(e.target.value); setPreview(null); setMessage(""); setError(""); }}
                className="h-10 w-full rounded-lg border border-[#e6eef2] px-3 text-[12px] text-[#31434e] outline-none focus:border-[#00749d]"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={exportExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-md bg-[#00749d] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#006688] disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {exporting ? "Đang xuất..." : "Export Excel"}
            </button>
          </div>

          <div className="mt-5 rounded-lg bg-[#f3f8fa] p-4 text-[11.5px] leading-relaxed text-[#546f7c]">
            <p className="font-semibold text-[#023648]">Gợi ý</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li><b>daily-prices:</b> cột thường dùng <code>serviceCode, packageId, date, type, basePrice, finalPrice, note</code>.</li>
              <li><b>services:</b> cột <code>name, slug/code, category, price, locationName, priceUnit, status</code>.</li>
              <li>Export file hiện tại để dùng làm mẫu, sau đó chỉnh sửa và import lại.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-[#e6eef2] bg-white p-5">
          <h2 className="text-[14px] font-extrabold text-[#023648]">Import dữ liệu</h2>
          <p className="mt-1 text-[11.5px] text-slate-500">Tải file lên để kiểm tra (preview) trước khi xác nhận ghi vào hệ thống.</p>

          <div className="mt-4 space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => { setFile(e.target.files?.[0] || null); setPreview(null); setMessage(""); setError(""); }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#cfe0e7] bg-[#f7fbfc] px-4 py-6 text-[12px] font-medium text-[#546f7c] transition hover:border-[#00749d] hover:text-[#00749d]"
            >
              <FileSpreadsheet className="h-5 w-5" />
              {file ? file.name : "Chọn file Excel (.xlsx, .xls, .csv)"}
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => runImport(false)}
                disabled={loading || !file}
                className="inline-flex items-center gap-2 rounded-md border border-[#00749d] px-4 py-2.5 text-[12px] font-semibold text-[#00749d] transition hover:bg-[#f0f9fb] disabled:opacity-50"
              >
                <Upload className="h-4 w-4" /> {loading ? "Đang xử lý..." : "Kiểm tra (Preview)"}
              </button>
              <button
                type="button"
                onClick={() => runImport(true)}
                disabled={loading || !file}
                className="inline-flex items-center gap-2 rounded-md bg-[#008478] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#006f65] disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Xác nhận import
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#eaf6f7] px-3 py-2.5 text-[11.5px] text-[#008478]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-[11.5px] text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>
      </div>

      {preview && (
        <section className="mt-4 rounded-xl border border-[#e6eef2] bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[14px] font-extrabold text-[#023648]">Kết quả kiểm tra</h2>
              <p className="mt-0.5 text-[11.5px] text-slate-500">
                File: <b>{preview.fileName || file?.name || "—"}</b> · Loại: <b>{preview.type || type}</b> · Trạng thái: {preview.committed ? <span className="font-semibold text-[#008478]">Đã import</span> : <span className="font-semibold text-[#a56d00]">Preview</span>}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11.5px]">
              <span className="rounded-md bg-[#f3f8fa] px-3 py-1.5 font-semibold text-[#31434e]">Tổng: {preview.totalRows ?? rows.length}</span>
              <span className="rounded-md bg-[#e5f5f6] px-3 py-1.5 font-semibold text-[#008478]">Hợp lệ: {preview.validRows ?? 0}</span>
              <span className="rounded-md bg-red-50 px-3 py-1.5 font-semibold text-red-600">Lỗi: {preview.errorRows ?? 0}</span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#edf3f5] text-[10.5px] font-semibold text-slate-400">
                  <th className="py-2.5 pr-3 font-semibold">Dòng</th>
                  <th className="py-2.5 pr-3 font-semibold">Dữ liệu</th>
                  <th className="py-2.5 pr-3 font-semibold">Trạng thái</th>
                  <th className="py-2.5 pr-3 font-semibold">Thông báo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx} className="border-b border-[#f4f8fa] align-top last:border-0">
                    <td className="py-3 pr-3 text-slate-500">{r.row ?? idx + 2}</td>
                    <td className="py-3 pr-3 text-[#31434e]">
                      <code className="block max-w-[520px] overflow-hidden text-ellipsis whitespace-nowrap text-[10.5px] text-slate-600">
                        {JSON.stringify(
                          Object.fromEntries(Object.entries(r).filter(([k]) => !["row", "status", "message"].includes(k)))
                        )}
                      </code>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-semibold ${r.status === "error" ? "bg-red-50 text-red-600" : "bg-[#e5f5f6] text-[#008478]"}`}>
                        {r.status === "error" ? "Lỗi" : "Hợp lệ"}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{r.message || "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-[12px] text-slate-400">Không có dòng dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminExcel;
