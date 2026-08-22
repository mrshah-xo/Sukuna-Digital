interface SukunaLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const sizes = {
  sm: { height: 28, textSize: "13px" },
  md: { height: 34, textSize: "15px" },
  lg: { height: 44, textSize: "20px" },
};

export function SukunaLogo({ size = "md", variant = "light" }: SukunaLogoProps) {
  const s = sizes[size];
  const ink = variant === "dark" ? "#ffffff" : "#1d1d1f";
  const muted = variant === "dark" ? "rgba(255,255,255,0.5)" : "#7a7a7a";
  const blue = "#0066cc";

  return (
    <div className="flex items-center gap-2 select-none" style={{ height: s.height }}>
      <svg width={s.height} height={s.height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="22" height="22" rx="7" fill={blue} opacity="0.18" />
        <rect x="4" y="4" width="22" height="22" rx="7" fill={blue} />
        <path
          d="M13.5 13.5C13.5 12.12 14.62 11 16 11H20C21.38 11 22.5 12.12 22.5 13.5V14C22.5 15.38 21.38 16.5 20 16.5H16C14.62 16.5 13.5 17.62 13.5 19V19.5C13.5 20.88 14.62 22 16 22H20C21.38 22 22.5 20.88 22.5 19.5"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", fontSize: s.textSize, fontWeight: 600, color: ink, letterSpacing: "-0.3px", lineHeight: 1.1 }}>
          Sukuna
        </span>
        <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: `calc(${s.textSize} * 0.72)`, fontWeight: 400, color: muted, letterSpacing: "0.6px", textTransform: "uppercase" as const, lineHeight: 1.1, marginTop: "2px" }}>
          Digital
        </span>
      </div>
    </div>
  );
}
