import { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Phone, X, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { cn } from "../lib/format";

const defaultCompany = {
  hotline: "036 271 5585",
  hotlineRaw: "0362715585",
  facebook: "http://facebook.com/hoangthiendll",
  zalo: "https://zalo.me/0362715585",
};

const defaultNavLinks = [
  { label: "Trang chủ", to: "/home" },
  { label: "Khách sạn", to: "/dich-vu?category=hotel" },
  { label: "Du thuyền", to: "/dich-vu?category=cruise" },
  { label: "Vé vui chơi", to: "/dich-vu?category=ticket" },
  { label: "Xe & dịch vụ", to: "/dich-vu?category=transport" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const content = useSelector((s) => s.content?.data);
  const categories = useSelector((s) => s.catalog?.categories || []);

  const company = { ...defaultCompany, ...(content?.company || {}) };
  const navLinks = content?.info?.navLinks?.length ? content.info.navLinks : defaultNavLinks;
  const menuCategories = useMemo(
    () => categories.filter((c) => c.status !== "Ẩn" && c.key !== "tour").slice(0, 5),
    [categories]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-300",
        scrolled && "shadow-[0_10px_30px_-26px_rgba(16,61,84,0.55)]"
      )}
    >
      <div className="container-page flex h-[80px] items-center lg:h-[88px]">
        <Logo />

        <nav className="ml-4 hidden items-center lg:flex xl:ml-[92px] min-[1400px]:ml-[108px]">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/home"}
              className={({ isActive }) =>
                cn(
                  "px-2 py-2 text-[13px] font-medium whitespace-nowrap transition-colors xl:px-[32px] xl:text-[13.5px] min-[1400px]:px-[38px]",
                  isActive ? "text-ocean-950" : "text-ink-600 hover:text-ocean-900"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 pl-4">
          <a href={`tel:${company.hotlineRaw}`} className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-sea-50 text-sea-600 transition group-hover:bg-sea-100 xl:h-10 xl:w-10">
              <Phone className="h-[17px] w-[17px]" />
            </span>
            <span className="hidden leading-tight xl:block">
              <span className="block text-[14.5px] font-semibold text-ocean-950">{company.hotline}</span>
              <span className="mt-0.5 block text-[10.5px] font-medium text-ink-500">Tư vấn mỗi ngày · 8:00–22:00</span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Mở menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ocean-100 bg-white text-ocean-900 transition hover:border-sea-300 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        ref={menuRef}
        className={cn(
          "overflow-hidden border-t border-ocean-100 bg-white transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[620px] opacity-100" : "max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="container-page space-y-1 py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                  isActive ? "bg-sea-50 text-sea-700" : "text-ocean-900 hover:bg-ocean-50"
                )
              }
            >
              {link.label}
              <span className="text-ocean-300">›</span>
            </NavLink>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <a href={`tel:${company.hotlineRaw}`} className="btn-primary !py-2.5 text-[13px]">
              <Phone className="h-4 w-4" /> Gọi ngay
            </a>
            <a href={company.zalo} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5 text-[13px]">
              <MessageCircle className="h-4 w-4" /> Chat Zalo
            </a>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-3">
            {menuCategories.map((category) => (
              <Link
                key={category.key || category.id}
                to={`/dich-vu?category=${category.key || category.id}`}
                className="chip"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
