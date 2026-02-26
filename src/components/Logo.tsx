import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
}

const Logo = ({ size = "md", linkTo = "/" }: LogoProps) => {
  const scales = {
    sm: { 
      icon: "w-8 h-8", 
      title: "text-lg", 
      sub: "text-[9px]", 
      gap: "gap-2" 
    },
    md: { 
      icon: "w-12 h-12", 
      title: "text-2xl", 
      sub: "text-[11px]", 
      gap: "gap-3" 
    },
    lg: { 
      icon: "w-16 h-16 md:w-20 md:h-20", 
      title: "text-4xl", 
      sub: "text-xs", 
      gap: "gap-4" 
    },
  };

  const s = scales[size];

  const content = (
    <div className={`flex items-center ${s.gap} group select-none`}>
      {/* 1. The SVG Emblem - Canadian Trade Theme */}
      <div className={`relative ${s.icon} flex-shrink-0 transition-transform duration-500 ease-out group-hover:scale-110`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Outer Circle - Global Trade */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            className="fill-primary/5 stroke-primary" 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
          />
          
          {/* Inner Circle - Connectivity */}
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            className="fill-primary/10 stroke-primary/50" 
            strokeWidth="1.5"
          />

          {/* Stylized Maple Leaf - Canada */}
          <g className="origin-center group-hover:rotate-3 transition-transform duration-300">
            <path
              d="M50 20L58 40L78 40L62 52L70 72L50 60L30 72L38 52L22 40L42 40L50 20Z"
              className="fill-primary"
            />
            {/* Leaf Stem */}
            <rect x="48" y="60" width="4" height="15" className="fill-amber-700" rx="2" />
          </g>

          {/* Import/Export Arrows */}
          <g className="origin-center group-hover:scale-105 transition-transform duration-300">
            {/* Import Arrow (Incoming) */}
            <path
              d="M20 85L30 75L26 71L20 77L20 85Z"
              className="fill-amber-400"
            />
            <path
              d="M20 75L35 75"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Export Arrow (Outgoing) */}
            <path
              d="M80 25L70 35L74 39L80 33L80 25Z"
              className="fill-amber-400"
            />
            <path
              d="M80 35L65 35"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Globe Grid Lines */}
          <g stroke="white" strokeWidth="1.5" strokeOpacity="0.2">
            <circle cx="50" cy="50" r="25" fill="none" />
            <path d="M50 25L50 75" />
            <path d="M25 50L75 50" />
            <path d="M32 32L68 68" />
            <path d="M32 68L68 32" />
          </g>

          {/* Accent Elements - Trade Routes */}
          <path
            d="M20 20L35 35M80 80L65 65M20 80L35 65M80 20L65 35"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.15"
            strokeDasharray="4 4"
          />

          {/* Central Gold Accent */}
          <circle cx="50" cy="50" r="8" className="fill-amber-400" />
          <circle cx="50" cy="50" r="4" className="fill-white" />
        </svg>
      </div>

      {/* 2. Professional Typography */}
      <div className="flex flex-col justify-center border-l-2 border-primary/30 pl-3 md:pl-4">
        <div className="flex flex-col leading-[0.9]">
          <h1 className={`${s.title} font-black tracking-tight text-foreground flex items-baseline flex-wrap`}>
            <span className="opacity-90">Canadian</span>
            <span className="ml-1.5 bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent">
              Trade
            </span>
          </h1>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`${s.sub} font-bold uppercase tracking-wider text-muted-foreground/70`}>
              IMPORT
            </span>
            <span className="text-amber-400 text-xs">●</span>
            <span className={`${s.sub} font-bold uppercase tracking-wider text-muted-foreground/70`}>
              EXPORT
            </span>
          </div>
          <p className={`text-[8px] md:text-[10px] font-medium uppercase tracking-[0.35em] text-primary/60 mt-1`}>
            Global Logistics
          </p>
        </div>
      </div>
    </div>
  );

  return linkTo ? (
    <Link to={linkTo} className="inline-block no-underline active:scale-95 transition-transform">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;