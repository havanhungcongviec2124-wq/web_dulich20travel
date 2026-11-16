import { Link } from "react-router-dom";
import { cn } from "../lib/format";

/**
 * Logo chữ đúng thiết kế Figma: "20 TRAVEL" + tagline.
 * Không dùng icon để giữ đúng tỉ lệ 74–220px ở header 1440px.
 */
const Logo = ({ light = false, compact = false, showTagline = true, className }) => (
  <Link to="/home" aria-label="20 TRAVEL – Trang chủ" className={cn("inline-flex shrink-0 flex-col", className)}>
    <span className="flex items-baseline gap-[7px] leading-none">
      <span
        className={cn(
          "text-[27px] font-extrabold tracking-[-0.03em]",
          light ? "text-white" : "text-ocean-950"
        )}
      >
        20
      </span>
      <span
        className={cn(
          "text-[20px] font-semibold tracking-[0.02em]",
          light ? "text-white" : "text-ocean-950"
        )}
      >
        TRAVEL
      </span>
    </span>
    {showTagline && !compact && (
      <span
        className={cn(
          "mt-[5px] text-[9.5px] font-medium tracking-[0.01em]",
          light ? "text-white/55" : "text-ink-500"
        )}
      >
        Khám phá theo cách của bạn
      </span>
    )}
  </Link>
);

export default Logo;
