import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
  showTagline?: boolean;
  variant?: "full" | "icon" | "text";
  imagePath?: string; // Prop for custom image path
}

const Logo = ({
  size = "md",
  linkTo = "/",
  showTagline = true,
  variant = "full",
  imagePath = "/src/assets/logo.png", // Default path - update this to your actual image name
}: LogoProps) => {
  /* -------------------------------------------------------------------------- */
  /*                               BRAND COLORS                                 */
  /* -------------------------------------------------------------------------- */

  const BRAND = {
    yellow: "#F5B301",
    yellowLight: "#FFE5A3",
    black: "#0F0F0F",
    navy: "#1C2E4A",
    navyLight: "#2C4A7A",
    white: "#FFFFFF",
    gray: "#b8c4da",
    gradientStart: "#1C2E4A",
    gradientEnd: "#b0f75f",
  };

  /* -------------------------------------------------------------------------- */
  /*                               SIZE SYSTEM                                  */
  /* -------------------------------------------------------------------------- */

  const sizes = {
    sm: {
      icon: "w-10 h-10 sm:w-12 sm:h-12", // Increased from w-8/h-8 to w-10/h-10
      title: "text-sm sm:text-base",
      sub: "text-[6px] sm:text-[8px]",
      taglineSpacing: "gap-0.5 sm:gap-1",
      dot: "text-[4px] sm:text-xs",
      globalText: "text-[5px] sm:text-[8px]",
    },
    md: {
      icon: "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20", // Increased from w-10/h-10 to w-14/h-14
      title: "text-base sm:text-xl lg:text-2xl",
      sub: "text-[8px] sm:text-[10px]",
      taglineSpacing: "gap-1 sm:gap-2",
      dot: "text-[6px] sm:text-xs",
      globalText: "text-[7px] sm:text-[10px]",
    },
    lg: {
      icon: "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24", // Increased from w-12/h-12 to w-16/h-16
      title: "text-lg sm:text-2xl lg:text-4xl",
      sub: "text-[9px] sm:text-xs",
      taglineSpacing: "gap-1.5 sm:gap-2",
      dot: "text-[7px] sm:text-sm",
      globalText: "text-[8px] sm:text-xs",
    },
  };

  const s = sizes[size];

  /* -------------------------------------------------------------------------- */
  /*                               CUSTOM IMAGE                                 */
  /* -------------------------------------------------------------------------- */

  const LogoImage = () => (
    <img
      src={imagePath}
      alt="Canadian Trading Logo"
      className={`${s.icon} transition-all duration-500 group-hover:scale-105 flex-shrink-0 object-contain rounded-full`}
      onError={(e) => {
        // Fallback in case image doesn't load
        console.error('Logo image failed to load:', imagePath);
        e.currentTarget.style.display = 'none';
      }}
    />
  );

  /* -------------------------------------------------------------------------- */
  /*                               MODERN TEXT BLOCK                           */
  /* -------------------------------------------------------------------------- */

  const LogoText = () => (
    <div className="flex flex-col leading-tight min-w-0">
      <h1
        className={`${s.title} font-black tracking-tight whitespace-nowrap relative`}
      >
        <span 
          className="relative inline-block"
          style={{ color: BRAND.yellow }}
        >
          Canadian
          <span 
            className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            style={{ opacity: 0.3 }}
          />
        </span>{" "}
        <span 
          className="relative inline-block"
          style={{ color: BRAND.gray }}
        >
          Trading
          <span 
            className="absolute -inset-1 bg-yellow-400 rounded-lg opacity-10 blur-sm"
          />
        </span>
      </h1>

      {showTagline && (
        <>
          <div className={`flex items-center flex-wrap ${s.taglineSpacing} mt-0.5 sm:mt-1`}>
            <span
              className={`${s.sub} font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full`}
              style={{ 
                color: BRAND.white,
                background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Import
            </span>

            <span
              className={s.dot}
              style={{ color: BRAND.yellow }}
            >
              ●
            </span>

            <span
              className={`${s.sub} font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full`}
              style={{ 
                color: BRAND.white,
                background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Export
            </span>
          </div>

          <p
            className={`${s.globalText} uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-0.5 sm:mt-1 font-semibold relative`}
            style={{ color: BRAND.gray }}
          >
            <span className="relative z-10">Global Trade Solutions</span>
            <span 
              className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
              style={{ opacity: 0.3 }}
            />
          </p>
        </>
      )}
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /*                               ICON ONLY VARIANT                           */
  /* -------------------------------------------------------------------------- */

  const IconOnly = () => (
    <div className="group select-none transition-all duration-300">
      <LogoImage />
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /*                               TEXT ONLY VARIANT                           */
  /* -------------------------------------------------------------------------- */

  const TextOnly = () => (
    <div className="group select-none transition-all duration-300">
      <LogoText />
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /*                              FULL VARIANT                                 */
  /* -------------------------------------------------------------------------- */

  const FullLogo = () => (
    <div
      className="
        flex 
        flex-row
        items-center 
        gap-2 sm:gap-4
        group 
        select-none 
        transition-all duration-300
        hover:scale-105
      "
    >
      <LogoImage />

      <div className="pl-2 sm:pl-4 border-l border-gray-300 relative">
        <LogoText />
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------- */
  /*                              RENDER BASED ON VARIANT                      */
  /* -------------------------------------------------------------------------- */

  const getContent = () => {
    switch(variant) {
      case "icon":
        return <IconOnly />;
      case "text":
        return <TextOnly />;
      default:
        return <FullLogo />;
    }
  };

  const content = getContent();

  return linkTo ? (
    <Link
      to={linkTo}
      className="inline-flex items-center active:scale-95 transition-transform duration-200"
    >
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;