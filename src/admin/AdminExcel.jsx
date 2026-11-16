import { useState } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileDown,
  RefreshCw,
} from "lucide-react";
import { excelImportSample } from "../data/mockData";

const AdminExcel = () => {
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [updateDuplicates, setUpdateDuplicates] = useState(true);

  const displayedRows = onlyErrors
    ? excelImportSample.rows.filter((r) => r.status === "error")
    : excelImportSample.rows;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#103d54]">
            Import / Export Excel
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Nhập bảng giá nhanh, kiểm tra dữ liệu trước khi lưu vào hệ thống.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-xs"
          >
            <span>Xuất dữ liệu</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. STEPPER */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
            1
          </span>
          <span>Tải dữ liệu lên</span>
        </div>
        <span className="w-8 h-px bg-slate-200"></span>
        <div className="flex items-center gap-2 text-xs font-bold text-[#087eab]">
          <span className="w-6 h-6 rounded-full bg-[#087eab] text-white flex items-center justify-center font-bold">
            2
          </span>
          <span>Kiểm tra & xem trước</span>
        </div>
        <span className="w-8 h-px bg-slate-200"></span>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
            3
          </span>
          <span>Xác nhận nhập</span>
        </div>
      </div>

      {/* 3. FILE CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#eaf6f7] flex items-center justify-center text-[#087eab] shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#103d54]">
              {excelImportSample.fileName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {excelImportSample.fileSize} • {excelImportSample.status}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">
              Định dạng .xlsx, .xls • Tối đa 10 MB
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Thay tệp
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <span>Tải file mẫu</span>
            <FileDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. STAT BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Tổng số dòng</span>
          <div className="text-3xl font-black text-[#103d54]">
            {excelImportSample.totalRows}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Hợp lệ</span>
          <div className="text-3xl font-black text-[#00877c]">
            {excelImportSample.validRows}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Cần xử lý</span>
          <div className="text-3xl font-black text-[#b87a00]">
            {excelImportSample.errorRows}
          </div>
        </div>
      </div>

      {/* 5. WARNING BANNER */}
      <div className="p-4 rounded-2xl bg-[#fff9ed] border border-[#faecd2] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          {excelImportSample.warningMessage}
        </p>
      </div>

      {/* 6. PREVIEW DATA TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-[#103d54]">Xem trước dữ liệu</h3>
          <button
            type="button"
            onClick={() => setOnlyErrors(!onlyErrors)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              onlyErrors
                ? "bg-[#b87a00] text-white border-[#b87a00]"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Chỉ dòng lỗi ({excelImportSample.errorRows})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-semibold">Dòng</th>
                <th className="pb-3 font-semibold">Mã dịch vụ</th>
                <th className="pb-3 font-semibold">Ngày áp dụng</th>
                <th className="pb-3 font-semibold">Giá (VNĐ)</th>
                <th className="pb-3 font-semibold">Kết quả kiểm tra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedRows.map((row) => (
                <tr key={row.row} className="hover:bg-slate-50/60">
                  <td className="py-3 font-semibold text-slate-500">{row.row}</td>
                  <td className="py-3 font-bold text-slate-800">{row.code}</td>
                  <td className="py-3 text-slate-600">{row.date}</td>
                  <td className="py-3 font-semibold text-slate-800">{row.price}</td>
                  <td className="py-3">
                    {row.status === "valid" ? (
                      <span className="inline-flex items-center gap-1.5 text-[#00877c] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ Hợp lệ</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#b87a00] font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>▲ {row.message}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. FOOTER ACTIONS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={updateDuplicates}
            onChange={(e) => setUpdateDuplicates(e.target.checked)}
            className="rounded border-slate-300 text-[#087eab] focus:ring-[#087eab] h-4 w-4"
          />
          <span>Cập nhật các bản ghi trùng mã dịch vụ và ngày áp dụng</span>
        </label>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Hủy nhập
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <span>Tải báo cáo lỗi</span>
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => alert("Đã hoàn tất nhập dữ liệu hợp lệ vào hệ thống!")}
            className="px-6 py-2.5 rounded-xl bg-[#087eab] hover:bg-[#0a6b90] text-white text-xs font-bold tracking-wide transition shadow-xs"
          >
            Nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminExcel;

