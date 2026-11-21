import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { toZaloAppLink } from "../lib/format";

const defaultCompany = {
  brand: "20 TRAVEL",
  hotline: "036 271 5585",
  hotlineRaw: "0362715585",
  facebook: "http://facebook.com/hoangthiendll",
  facebookLabel: "facebook.com/hoangthiendll",
  zalo: "https://zalo.me/0362715585",
  zaloLabel: "zalo.me/0362715585",
  workingHours: "08:00 – 21:00 (T2 – CN)",
};

const exploreLinks = [
  { label: "Khách sạn", to: "/dich-vu?category=hotel" },
  { label: "Du thuyền ngày / đêm", to: "/dich-vu?category=cruise" },
  { label: "Vé vui chơi", to: "/dich-vu?category=ticket" },
  { label: "Xe & dịch vụ khác", to: "/dich-vu?category=transport" },
];

const aboutLinks = [
  { label: "Giới thiệu", to: "/lien-he" },
  { label: "Chính sách & điều khoản", to: "/lien-he#chinh-sach" },
  { label: "Hướng dẫn tra cứu", to: "/lien-he#huong-dan" },
  { label: "Liên hệ", to: "/lien-he" },
];

const columns = [
  { title: "Khám phá", links: exploreLinks },
  { title: "Về 20 TRAVEL", links: aboutLinks },
];

const Legal = ({ company }) => (
  <div className="space-y-1 text-[10.5px] leading-relaxed text-white/45">
    <p>© 2026 {company.brand || "20 TRAVEL"}. Dữ liệu và thông tin liên hệ minh họa.</p>
    <p>Giá tham khảo có thể thay đổi theo ngày và tình trạng dịch vụ.</p>
  </div>
);

const ContactLinks = ({ company }) => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/70">
    <a href={`tel:${company.hotlineRaw || "0362715585"}`} className="group inline-flex items-center gap-2">
      <span className="font-medium text-white/50">Hotline</span>
      <span className="font-semibold text-white">{company.hotline}</span>
    </a>
    <a href={company.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-white">
      <span className="text-white/35">+</span> Facebook
    </a>
    <a href={toZaloAppLink(company.zalo)} rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-white">
      <span className="text-white/35">+</span> Zalo
    </a>
  </div>
);

const Footer = ({ variant = "inner" }) => {
  const content = useSelector((s) => s.content?.data);
  const company = { ...defaultCompany, ...(content?.company || {}) };

  if (variant === "full") {
    return (
      <footer className="bg-ocean-950 text-white">
        {/* Mobile: footer gọn đúng Figma 390 (≈250px) */}
        <div className="container-page pt-[30px] pb-12 lg:hidden">
          <Logo light showTagline={false} />
          <p className="mt-[17px] text-[13px] font-semibold text-white">
            Tra cứu dễ dàng. Nghỉ dưỡng xứng đáng.
          </p>
          <p className="mt-[21px] flex flex-wrap items-center gap-x-1.5 text-[11.5px] text-white/60">
            {exploreLinks.slice(0, 3).map((link, index) => (
              <span key={link.label} className="inline-flex items-center gap-x-1.5">
                {index > 0 && <span className="text-white/30">-</span>}
                <Link to={link.to} className="transition hover:text-white">
                  {link.label.replace(" ngày / đêm", "")}
                </Link>
              </span>
            ))}
          </p>
          <p className="mt-[27px] text-[10.5px] text-white/45">
            © 2026 {company.brand} - Dữ liệu minh họa
          </p>
          <p className="mt-2 text-[10.5px] text-white/45">
            Giá và liên hệ cần xác nhận trước khi sử dụng.
          </p>
        </div>

        {/* Desktop */}
        <div className="container-page hidden pt-16 pb-[46px] lg:block">
          <div className="grid gap-10 lg:grid-cols-[1.75fr_0.75fr_0.85fr_0.8fr]">
            <div>
              <Logo light showTagline={false} />
              <p className="mt-4 text-[14px] font-semibold text-white">
                Tra cứu dễ dàng. Nghỉ dưỡng xứng đáng.
              </p>
              <p className="mt-2.5 max-w-[440px] text-[12px] leading-relaxed text-white/55">
                Nền tảng tham khảo giá du lịch dành cho mọi hành trình.
                <br />
                Không cần đăng nhập, tự do khám phá.
              </p>
            </div>

            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-semibold text-white">{column.title}</h3>
                <ul className="mt-4 space-y-3 text-[12px] text-white/55">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-[13px] font-semibold text-white">Kết nối</h3>
              <ul className="mt-4 space-y-3 text-[12px] text-white/55">
                <li>
                  <a href={`tel:${company.hotlineRaw || "0362715585"}`} className="inline-flex items-center gap-2 transition hover:text-white">
                    <span className="text-white/35">Hotline</span>
                    <span className="text-white">{company.hotline}</span>
                  </a>
                </li>
                <li>
                  <a href={company.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                    <span className="text-white/35">+</span> Facebook – {company.brand}
                  </a>
                </li>
                <li>
                  <a href={toZaloAppLink(company.zalo)} rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                    <span className="text-white/35">+</span> Zalo – Tư vấn du lịch
                  </a>
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="text-white/35">+</span> {company.workingHours || "8:00–22:00 mỗi ngày"}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-[106px]">
            <Legal company={company} />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-ocean-950 text-white">
      {/* Mobile: footer gọn đúng Figma 390 (frame16 ≈180px) */}
      <div className="container-page pt-[26px] pb-[46px] md:hidden">
        <Logo light showTagline={false} />
        <p className="mt-[22px] flex flex-wrap items-center gap-x-1.5 text-[11.5px] text-white/60">
          <a href={`tel:${company.hotlineRaw || "0362715585"}`} className="font-medium text-white">
            Hotline {company.hotline}
          </a>
          <span className="text-white/30">-</span>
          <a href={toZaloAppLink(company.zalo)} rel="noreferrer" className="transition hover:text-white">
            Zalo
          </a>
          <span className="text-white/30">-</span>
          <a href={company.facebook} target="_blank" rel="noreferrer" className="transition hover:text-white">
            Facebook
          </a>
        </p>
        <p className="mt-[24px] text-[10.5px] text-white/45">
          Dữ liệu và thông tin liên hệ minh họa.
        </p>
      </div>

      <div className="container-page hidden py-[29px] md:flex md:flex-row md:items-start md:justify-between">
        <div>
          <Logo light showTagline={false} />
          <p className="mt-3.5 text-[12.5px] font-medium text-white">
            Tra cứu dễ dàng. Nghỉ dưỡng xứng đáng.
          </p>
          <div className="mt-6">
            <Legal company={company} />
          </div>
        </div>

        <div className="md:max-w-[475px] md:text-left">
          <ContactLinks company={company} />
          <p className="mt-4 text-[10.5px] leading-relaxed text-white/45">
            Dữ liệu minh họa - Giá tham khảo, vui lòng liên hệ xác nhận.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
