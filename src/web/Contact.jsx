import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
} from "lucide-react";
import { company, consultants, faqs, priceTables } from "../data/fake.data";
import { cn } from "../lib/format";

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.25-1.5 1.55-1.5H16.7V4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.45-4 4.1V10H7.6v3h2.7v8h3.2Z" />
  </svg>
);

const quickContacts = [
  {
    id: "hotline",
    label: "Hotline tư vấn",
    value: company.hotline,
    note: "Mỗi ngày 8:00 – 22:00",
    href: `tel:${company.hotlineRaw}`,
    icon: Phone,
    cta: "Gọi ngay",
  },
  {
    id: "zalo",
    label: "Chat Zalo",
    value: "036 271 5585",
    note: "Phản hồi trong 5 phút",
    href: company.zalo,
    icon: MessageCircle,
    cta: "Nhắn Zalo",
  },
  {
    id: "facebook",
    label: "Facebook",
    value: "20 TRAVEL",
    note: "Cập nhật giá và ưu đãi",
    href: company.facebook,
    icon: FacebookIcon,
    cta: "Theo dõi",
  },
];

const steps = [
  {
    title: "Chọn điểm đến và ngày sử dụng",
    desc: "Nhập điểm đến, ngày đi và loại dịch vụ ở thanh tra cứu để xem giá đúng ngày.",
  },
  {
    title: "So sánh giá và tiện ích",
    desc: "Dùng bộ lọc loại dịch vụ, khoảng giá và sắp xếp để chọn lựa chọn phù hợp.",
  },
  {
    title: "Liên hệ xác nhận",
    desc: "Giá là tham khảo. Gọi hotline hoặc Chat Zalo để được giữ chỗ và xác nhận giá cuối cùng.",
  },
];

const Contact = () => {
  const [open, setOpen] = useState(0);
  const team = consultants.slice(0, 4);

  return (
    <main className="bg-[#F5F9FB]">
      <section className="bg-white">
        <div className="container-page pt-6 pb-10 lg:pt-[27px] lg:pb-12">
          <nav className="flex items-center gap-2 text-[11px] text-ink-500">
            <Link to="/home" className="transition hover:text-ocean-800">Trang chủ</Link>
            <span className="text-ocean-200">/</span>
            <span className="text-ocean-900">Liên hệ</span>
          </nav>

          <div className="mt-5 max-w-[720px] lg:mt-7">
            <h1 className="font-display text-[32px] leading-[1.15] font-medium tracking-[-0.01em] text-ocean-950 lg:text-[42px]">
              Liên hệ 20 TRAVEL
            </h1>
            <p className="mt-3.5 text-[13px] leading-[1.7] text-ink-600 lg:text-[14px]">
              Đội ngũ tư vấn luôn sẵn sàng giúp bạn chọn đúng dịch vụ, đúng ngày và đúng ngân sách.
              Không cần đăng nhập – chỉ cần một cuộc gọi hoặc tin nhắn.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {quickContacts.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.id === "hotline" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="group flex flex-col rounded-2xl bg-ocean-50 p-5 transition hover:bg-sea-50 lg:p-6"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sea-600 shadow-[0_10px_24px_-18px_rgba(16,61,84,0.5)]">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="mt-4 text-[10.5px] font-medium tracking-[0.04em] text-ink-500 uppercase">
                    {item.label}
                  </span>
                  <span className="mt-1.5 text-[19px] font-semibold text-ocean-950">{item.value}</span>
                  <span className="mt-1 text-[11px] text-ink-500">{item.note}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ocean-700 transition group-hover:text-ocean-900">
                    {item.cta}
                    <Send className="h-3 w-3" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_448px]">
          <div className="rounded-2xl bg-white p-6 lg:p-8">
            <h2 className="font-display text-[24px] font-medium lg:text-[27px]">Thông tin công ty</h2>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3.5">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-sea-600" />
                <div>
                  <p className="text-[10.5px] font-medium tracking-[0.04em] text-ink-500 uppercase">Đơn vị vận hành</p>
                  <p className="mt-1 text-[12.5px] font-medium text-ocean-900">{company.legalName}</p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sea-600" />
                <div>
                  <p className="text-[10.5px] font-medium tracking-[0.04em] text-ink-500 uppercase">Địa chỉ</p>
                  <p className="mt-1 text-[12.5px] text-ink-700">{company.address}</p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sea-600" />
                <div>
                  <p className="text-[10.5px] font-medium tracking-[0.04em] text-ink-500 uppercase">Email</p>
                  <a href={`mailto:${company.email}`} className="mt-1 block text-[12.5px] text-ink-700 hover:text-ocean-800">
                    {company.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-3.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sea-600" />
                <div>
                  <p className="text-[10.5px] font-medium tracking-[0.04em] text-ink-500 uppercase">Giờ làm việc</p>
                  <p className="mt-1 text-[12.5px] text-ink-700">{company.workingHours} · Hotline hoạt động mỗi ngày</p>
                </div>
              </div>
            </div>

            <div className="mt-7 overflow-hidden rounded-xl bg-ocean-50">
              <div className="relative h-[190px] lg:h-[210px]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#e4f1f4_0%,#d2eeec_45%,#eaf6f7_100%)]" />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #9ec2d3 1px, transparent 1px), linear-gradient(to bottom, #9ec2d3 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                  }}
                />
                <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ocean-600 text-white shadow-[0_16px_30px_-16px_rgba(8,126,171,0.8)]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="mt-2.5 rounded-lg bg-white/90 px-3 py-1.5 text-[10.5px] font-medium text-ocean-900 backdrop-blur">
                    Bồ Đề, Long Biên, Hà Nội
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-ink-500">Bản đồ minh họa – vui lòng liên hệ trước khi đến văn phòng.</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 lg:p-7">
              <h2 className="text-[15px] font-semibold text-ocean-950">Gọi cho chúng tôi</h2>
              <a
                href={`tel:${company.hotlineRaw}`}
                className="mt-4 flex items-center gap-3 rounded-xl bg-ocean-600 px-5 py-4 text-white transition hover:bg-ocean-700"
              >
                <Phone className="h-5 w-5" />
                <span className="text-[20px] font-bold tracking-tight">{company.hotline}</span>
              </a>
              <p className="mt-3 text-[10.5px] leading-relaxed text-ink-500">
                Hỗ trợ miễn phí mỗi ngày 8:00 – 22:00. Hotline văn phòng: {company.officeHotline}.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <a
                  href={company.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[45px] items-center justify-center gap-2 rounded-[10px] bg-sea-50 text-[12px] font-semibold text-ocean-800 transition hover:bg-sea-100"
                >
                  <MessageCircle className="h-4 w-4" /> Zalo
                </a>
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[45px] items-center justify-center gap-2 rounded-[10px] bg-ocean-50 text-[12px] font-semibold text-ocean-800 transition hover:bg-ocean-100"
                >
                  <FacebookIcon className="h-4 w-4" /> Facebook
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 lg:p-7">
              <h2 className="text-[15px] font-semibold text-ocean-950">Thông tin thanh toán</h2>
              <div className="mt-4 space-y-4">
                {priceTables.bank.map((bank) => (
                  <div key={bank.number} className="rounded-xl bg-ocean-50 px-4 py-3.5">
                    <p className="text-[10.5px] text-ink-500">{bank.note}</p>
                    <p className="mt-1 text-[12px] font-semibold text-ocean-900">{bank.name}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-600">
                      {bank.bank} · <span className="font-medium text-ocean-900">{bank.number}</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-ink-500">{company.paymentNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-10 lg:py-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-sea-700 uppercase">Đội ngũ tư vấn</p>
              <h2 className="mt-2 font-display text-[27px] font-medium lg:text-[30px]">Người đồng hành của bạn</h2>
            </div>
            <p className="text-[12px] text-ink-500">Chọn đúng người – đúng nhu cầu – nhanh hơn.</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {team.map((person) => (
              <article key={person.id} className="flex flex-col rounded-2xl bg-ocean-50 p-5">
                {person.image ? (
                  <img src={person.image} alt={person.name} className="h-[112px] w-[92px] rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-[92px] w-[92px] place-items-center rounded-2xl bg-white text-[24px] font-semibold text-sea-600">
                    {person.initials}
                  </span>
                )}
                <h3 className="mt-4 text-[16px] font-semibold text-ocean-950">{person.name}</h3>
                <p className="mt-1 text-[11px] text-ink-500">{person.role}</p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <a
                    href={`tel:${person.phone.replace(/\s/g, "")}`}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white text-[11px] font-semibold text-ocean-800 ring-1 ring-ocean-100 transition hover:bg-sea-50"
                  >
                    <Phone className="h-3.5 w-3.5" /> Gọi
                  </a>
                  <a
                    href={person.zalo}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-ocean-600 text-white transition hover:bg-ocean-700"
                    aria-label={`Chat Zalo ${person.name}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="huong-dan" className="container-page scroll-mt-[110px] py-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_448px]">
          <div className="rounded-2xl bg-white p-6 lg:p-8">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-sea-700 uppercase">Hướng dẫn tra cứu</p>
            <h2 className="mt-2 font-display text-[24px] font-medium lg:text-[27px]">Ba bước để có giá đúng ngày</h2>

            <ol className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea-50 text-[12px] font-semibold text-sea-700">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-[13px] font-semibold text-ocean-950">{step.title}</h3>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-ink-600">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              to="/dich-vu"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-ocean-600 px-5 text-[12px] font-semibold text-white transition hover:bg-ocean-700"
            >
              <Search className="h-4 w-4" />
              Bắt đầu tra cứu
            </Link>
          </div>

          <div id="chinh-sach" className="scroll-mt-[110px] rounded-2xl bg-white p-6 lg:p-7">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-sea-700 uppercase">Chính sách & điều khoản</p>
            <h2 className="mt-2 font-display text-[24px] font-medium">Minh bạch từ giá đến xác nhận</h2>
            <ul className="mt-5 space-y-3 text-[11.5px] leading-relaxed text-ink-600">
              <li>Giá hiển thị là giá tham khảo theo ngày, chưa gồm VAT 8% và chi phí cá nhân.</li>
              <li>Giá có thể thay đổi theo tình trạng phòng, tàu và thời điểm đặt.</li>
              <li>Dữ liệu minh họa phục vụ tra cứu; vui lòng liên hệ xác nhận trước khi sử dụng.</li>
              <li>Thông tin cá nhân chỉ dùng để liên hệ và xác nhận dịch vụ.</li>
            </ul>
            <p className="mt-4 text-[10px] text-ink-500">Cập nhật giá gần nhất: {company.priceUpdatedAt}</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-10 lg:py-12">
          <div className="max-w-[720px]">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-sea-700 uppercase">Câu hỏi thường gặp</p>
            <h2 className="mt-2 font-display text-[27px] font-medium lg:text-[30px]">Bạn cần biết trước khi đặt</h2>
          </div>

          <div className="mt-6 divide-y divide-ocean-100 rounded-2xl bg-ocean-50/60 px-5 lg:px-7">
            {faqs.map((faq, index) => {
              const active = open === index;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(active ? -1 : index)}
                    aria-expanded={active}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className={cn("text-[12.5px] font-semibold", active ? "text-ocean-950" : "text-ocean-900")}>
                      {faq.q}
                    </span>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-ocean-700">
                      {active ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {active && (
                    <p className="pb-4 text-[11.5px] leading-[1.75] text-ink-600">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
