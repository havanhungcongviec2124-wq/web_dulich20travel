import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, Phone, Check } from "lucide-react";
import SearchPanel from "../components/SearchPanel";
import ServiceCard from "../components/ServiceCard";
import { CategoryIcon } from "../lib/icons";
import { IMG } from "../lib/images";
import { toZaloAppLink } from "../lib/format";

const defaultCompany = {
  hotline: "036 271 5585",
  hotlineRaw: "0362715585",
};

const pickFeatured = (services) => {
  const preferredSlugs = ["vinpearl-resort-spa-ha-long", "ambassador-cruise-day", "sun-world-ha-long", "vinpearl-hl", "ambassador", "sunworld-hl"];
  const picked = [];
  for (const slug of preferredSlugs) {
    const found = services.find((s) => s.slug === slug || s.id === slug || s.code === slug);
    if (found && !picked.some((p) => p._id === found._id || p.slug === found.slug)) picked.push(found);
    if (picked.length === 3) break;
  }
  if (picked.length < 3) {
    for (const s of services) {
      if (s.featured && !picked.some((p) => p._id === s._id || p.slug === s.slug)) picked.push(s);
      if (picked.length === 3) break;
    }
  }
  if (picked.length < 3) {
    for (const s of services) {
      if (!picked.some((p) => p._id === s._id || p.slug === s.slug)) picked.push(s);
      if (picked.length === 3) break;
    }
  }
  return picked.slice(0, 3);
};

const Home = () => {
  const categories = useSelector((s) => s.catalog?.categories || []);
  const services = useSelector((s) => s.catalog?.services || []);
  const consultants = useSelector((s) => s.consultants?.items || []);
  const content = useSelector((s) => s.content?.data);

  const company = { ...defaultCompany, ...(content?.company || {}) };
  const homeCategories = useMemo(
    () => categories.filter((c) => c.status !== "Ẩn" && c.key !== "tour" && c.id !== "tour"),
    [categories]
  );
  const featured = useMemo(() => pickFeatured(services), [services]);
  const homeConsultant = useMemo(() => {
    return (
      consultants.find((c) => c.key === "hoang-thien" || c.id === "hoang-thien") ||
      consultants.find((c) => c.active !== false && c.status !== "Tạm ẩn") ||
      consultants[0] ||
      {
        name: "Hoàng Thiện",
        role: "Chuyên viên tư vấn du lịch",
        status: "Sẵn sàng tư vấn",
        tagline: "Luôn lắng nghe để gợi ý hành trình phù hợp nhất.",
        image: IMG.figmaConsultant,
        zalo: company.zalo || "https://zalo.me/0362715585",
        facebook: company.facebook || "http://facebook.com/hoangthiendll",
      }
    );
  }, [consultants, company]);

  return (
    <main>
      {/* HERO */}
      <section className="relative h-[390px] overflow-hidden bg-ocean-950 lg:h-[490px]">
        <img
          src={IMG.figmaHero}
          alt="Vịnh Hạ Long nhìn từ trên cao"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,62,88,0.9)_0%,rgba(6,62,88,0.72)_34%,rgba(6,62,88,0.28)_58%,rgba(6,62,88,0)_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,62,88,0.15)_0%,rgba(6,62,88,0)_35%,rgba(6,62,88,0.12)_100%)]" />

        <div className="container-page relative flex h-full flex-col pt-[35px] lg:pt-[59px]">
          <span className="inline-flex w-fit items-center rounded-lg bg-sea-50 px-3.5 py-1.5 text-[9px] font-semibold tracking-[0.16em] text-ocean-900 uppercase lg:py-[9px] lg:text-[10px]">
            <span className="lg:hidden">Chạm đến những hành trình mới</span>
            <span className="hidden lg:inline">Cảm hứng cho chuyến đi tiếp theo</span>
          </span>

          <h1 className="mt-[31px] max-w-[720px] font-display text-[43px] leading-[1.07] font-medium tracking-[-0.02em] text-white lg:mt-[36px] lg:text-[56px] lg:leading-[1.13]">
            Chạm vào bình yên.
            <br />
            Khám phá muôn nơi.
          </h1>

          <p className="mt-5 max-w-[520px] text-[13px] leading-[1.55] text-white/80 lg:mt-[27px] lg:text-[15px] lg:leading-[1.6]">
            <span className="lg:hidden">
              Tra cứu giá du lịch dễ dàng.
              <br />
              Tận hưởng chuyến đi theo cách của bạn.
            </span>
            <span className="hidden lg:inline">
              Tra cứu giá khách sạn, du thuyền và trải nghiệm du lịch.
              <br />
              Thông tin rõ ràng, hành trình thanh thơi.
            </span>
          </p>

          <Link
            to="/dich-vu"
            className="mt-[35px] inline-flex h-12 w-[200px] items-center justify-center gap-2.5 rounded-xl bg-ocean-600 text-[13.5px] font-semibold text-white transition hover:bg-ocean-700 lg:mt-[45px] lg:w-[194px] lg:text-[14px]"
          >
            Khám phá ngay
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </section>

      {/* SEARCH + CATEGORIES */}
      <section className="bg-white">
        <div className="container-page pt-8 lg:pt-[26px]">
          <SearchPanel variant="hero" />

          <h2 className="mt-14 text-[20px] leading-tight font-semibold text-ocean-950 lg:hidden">
            Khám phá dịch vụ
          </h2>

          <div className="mt-5 grid grid-cols-3 gap-x-2.5 gap-y-3 pb-[38px] lg:mt-[88px] lg:grid-cols-5 lg:gap-[19px] lg:pb-8">
            {homeCategories.map((category) => {
              const key = category.key || category.id;
              return (
                <Link
                  key={key}
                  to={`/dich-vu?category=${key}`}
                  className="group flex h-[100px] flex-col items-start justify-center gap-2 rounded-xl bg-ocean-50 px-4 transition hover:bg-ocean-100/70 lg:h-[96px] lg:flex-row lg:items-center lg:gap-4 lg:px-6"
                >
                  <CategoryIcon
                    name={category.icon}
                    className="h-6 w-6 shrink-0 text-ocean-700 transition group-hover:text-ocean-600 lg:h-7 lg:w-7"
                    strokeWidth={1.6}
                  />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] leading-tight font-semibold text-ocean-950 lg:text-[13px]">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-[10px] text-ink-500 lg:text-[10.5px]">
                      {category.count ?? 0} {category.unit || "dịch vụ"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-ocean-50 pb-[78px] lg:pb-[42px]">
        <div className="container-page pt-7 lg:pt-[38px]">
          <p className="hidden text-[10px] font-semibold tracking-[0.2em] text-sea-700 uppercase lg:block">
            Được yêu thích
          </p>

          <div className="mt-0 flex items-end justify-between gap-4 lg:mt-[13px]">
            <div>
              <h2 className="font-display text-[28px] leading-tight font-medium tracking-[-0.01em] text-ocean-950 lg:text-[32px]">
                Chuyến đi đáng mong chờ
              </h2>
              <p className="mt-2 text-[12.5px] text-ink-600 lg:mt-2.5 lg:text-[13.5px]">
                <span className="lg:hidden">Lựa chọn nghỉ dưỡng được yêu thích.</span>
                <span className="hidden lg:inline">Những lựa chọn nghỉ dưỡng dành riêng cho bạn.</span>
              </p>
            </div>
            <Link
              to="/dich-vu"
              className="mb-1 hidden items-center gap-1.5 text-[12px] font-semibold whitespace-nowrap text-ocean-700 transition hover:text-ocean-900 lg:inline-flex"
            >
              Xem tất cả dịch vụ
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-[22px] grid gap-[18px] lg:mt-[27px] lg:grid-cols-3 lg:gap-6">
            {featured.map((service) => (
              <ServiceCard
                key={service._id || service.slug || service.id}
                service={service}
                displayPrice={service.price}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTANT */}
      <section className="bg-white">
        <div className="container-page pt-8 pb-[52px] lg:pt-0 lg:pb-[50px]">
          <div className="grid items-start gap-9 lg:grid-cols-[740px_1fr] lg:gap-0">
            <div className="lg:pt-[56px]">
              <h2 className="font-display text-[27px] leading-tight font-medium text-ocean-950 lg:text-[34px] lg:leading-[1.35]">
                Luôn có người đồng hành
              </h2>
              <p className="mt-2 hidden text-[12.5px] text-ink-600 lg:mt-0 lg:block lg:text-[14px] lg:leading-normal">
                Bạn chọn điểm đến. Chúng tôi giúp bạn chọn trải nghiệm.
              </p>

              <div className="mt-[21px] flex items-start gap-6 lg:mt-[27px] lg:gap-[28px]">
                <img
                  src={company.consultantAvatar || homeConsultant.image || homeConsultant.avatar || IMG.figmaConsultant}
                  alt={homeConsultant.name}
                  className="h-[90px] w-[74px] shrink-0 rounded-2xl object-cover lg:h-[220px] lg:w-[192px]"
                />

                <div className="min-w-0 pt-1 lg:pt-[20px]">
                  <h3 className="font-display text-[24px] leading-none font-medium text-ocean-950 lg:text-[26px]">
                    {homeConsultant.name}
                  </h3>
                  <span className="mt-3 inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-sea-50 px-3 text-[10.5px] font-medium text-ocean-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sea-600" />
                    {homeConsultant.status || "Sẵn sàng tư vấn"}
                  </span>
                  <p className="mt-[41px] text-[12px] font-medium text-ocean-900 lg:mt-[21px] lg:text-[13px]">
                    {homeConsultant.role}
                  </p>
                  <p className="mt-1.5 hidden text-[11.5px] text-ink-500 lg:block lg:text-[12px]">
                    {homeConsultant.tagline || homeConsultant.specialty || ""}
                  </p>

                  <div className="mt-[20px] hidden flex-wrap gap-3 lg:flex">
                    <a
                      href={toZaloAppLink(company.zalo || homeConsultant.zalo)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-[142px] items-center justify-center rounded-xl bg-ocean-600 text-[12.5px] font-semibold text-white transition hover:bg-ocean-700"
                    >
                      Chat Zalo
                    </a>
                    <a
                      href={company.facebook || homeConsultant.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-[47px] w-[141px] items-center justify-center rounded-xl bg-white text-[12.5px] font-semibold text-ocean-900 ring-1 ring-ocean-100 transition hover:bg-ocean-50"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-[29px] grid grid-cols-2 gap-[18px] lg:hidden">
                <a
                  href={toZaloAppLink(company.zalo || homeConsultant.zalo)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center rounded-xl bg-ocean-600 text-[12.5px] font-semibold text-white transition hover:bg-ocean-700"
                >
                  Chat Zalo
                </a>
                <a
                  href={company.facebook || homeConsultant.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center rounded-xl bg-white text-[12.5px] font-semibold text-ocean-900 ring-1 ring-ocean-100 transition hover:bg-ocean-50"
                >
                  Facebook
                </a>
              </div>

              <a
                href={`tel:${company.hotlineRaw || "0362715585"}`}
                className="mt-[29px] inline-flex items-center gap-2 text-[11.5px] font-medium text-ink-600 lg:hidden"
              >
                <Phone className="h-3.5 w-3.5 text-sea-600" /> Hotline {company.hotline}
              </a>
            </div>

            <aside className="hidden rounded-[20px] bg-sea-50 lg:mt-[48px] lg:block lg:h-[320px] lg:w-[556px] lg:px-[34px] lg:py-[41px]">
              <h2 className="font-display text-[30px] leading-[1.42] font-medium text-ocean-950 lg:text-[32px]">
                Một cuộc gọi,
                <br />
                trọn vẹn hành trình.
              </h2>
              <p className="mt-[22px] flex items-center gap-2 text-[12px] text-ink-600">
                <Check className="h-3.5 w-3.5 text-sea-600" />
                Hỗ trợ miễn phí – Mỗi ngày 8:00–22:00
              </p>
              <a
                href={`tel:${company.hotlineRaw || "0362715585"}`}
                className="mt-[18px] text-sea-600 inline-flex items-center gap-3 text-[26px] font-bold tracking-tight"
              >
                <Phone className="h-5 w-5 text-sea-600" />
                {company.hotline}
              </a>
              <p className="mt-[30px] text-[12px] text-ink-500">
                Thông tin liên hệ trong bản thiết kế là minh họa.
              </p>
            </aside>
          </div>
        </div>
      </section> 
    </main>
  );
};

export default Home;
