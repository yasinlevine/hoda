import React from 'react';
import { TherapistBio, mintCreamSwirl } from '../types';
import {
  CalendarCheckIcon,
  WandSparklesIcon,
  AwardIcon,
  ShieldCheckIcon,
  ZoomInIcon
} from './Icons';

interface EditorialHeroSectionProps {
  bio: TherapistBio;
  heroThumbnails?: {
    id: number;
    title: string;
    desc: string;
    img: string;
  }[];
  activeThumbnail?: number;
  onSelectThumbnail?: (index: number) => void;
  onOpenZoom: () => void;
  onOpenInstagramModal: () => void;
}

export const EditorialHeroSection: React.FC<EditorialHeroSectionProps> = ({
  bio,
  heroThumbnails,
  activeThumbnail,
  onSelectThumbnail,
  onOpenZoom,
  onOpenInstagramModal,
}) => {
  const currentHero = {
    id: 1,
    title: 'امولسیون بازسازی سد دفاعی پوست',
    desc: 'بافت کرمی فیتوتراپی و آرامش پایدار سلولی',
    img: mintCreamSwirl
  };

  return (
    <section id="top" className="relative min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-center overflow-hidden py-10 sm:py-16 lg:py-20 font-vazir w-full max-w-full min-w-0 bg-gradient-to-b from-[#f3faf9] via-[#f8faf9] to-[#ffffff]">
      
      {/* ===================================================================== */}
      {/* LAYER 0: LUMINOUS AMBIENT GLOW & SUBTLE BACKDROP (APPLE LIGHT THEME) */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Soft Ambient Pastel Mint Glow */}
        <div className="absolute w-[600px] lg:w-[850px] h-[600px] lg:h-[850px] rounded-full bg-[#7bc4bc]/15 blur-[120px] -top-20 -right-20 animate-shadow-drift"></div>
        <div className="absolute w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full bg-[#a8ded8]/20 blur-[110px] bottom-10 left-10"></div>
        
        {/* Light Architectural Halo */}
        <div className="hidden lg:block absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] rounded-[100%] bg-gradient-to-r from-[#7bc4bc]/0 via-[#7bc4bc]/10 to-[#7bc4bc]/0 rotate-[-6deg] blur-3xl"></div>

        {/* 3D Giant Persian Light Typography (Layered behind model on desktop) */}
        <div className="hidden lg:flex w-full text-center absolute inset-0 z-0 flex-col items-center justify-center opacity-40">
          <span className="text-[10vw] font-black tracking-tight text-[#7bc4bc]/25 whitespace-nowrap leading-none font-vazir block transform -translate-y-6">
            آرامش سد دفاعی پوست
          </span>
          <span className="text-[3.5vw] font-bold tracking-[0.25em] text-[#7bc4bc]/30 uppercase font-syne whitespace-nowrap block mt-[-2vw]">
            SCIENCE · CALM · SKIN
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 10: MAIN FOREGROUND CONTENT & ADAPTIVE RESPONSIVE LAYOUT */}
      {/* ===================================================================== */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 w-full min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10 flex-1 my-auto">
        
        {/* Editorial Headline & Action CTAs - Placed below image on mobile (order-2) and primary on desktop (lg:order-1) */}
        <div data-aos="fade-up" data-aos-duration="850" className="flex flex-col items-center lg:items-start text-center lg:text-right space-y-5 sm:space-y-6 order-2 lg:order-1 w-full lg:pr-6 xl:pr-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#7bc4bc]/40 text-xs text-[#1d5750] shadow-xs backdrop-blur-md mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#7bc4bc] animate-pulse"></span>
            <span className="font-medium">{bio.title} · زعفرانیه</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold text-[#0f172a] leading-[1.35] sm:leading-[1.25] tracking-tight">
            درمان علمی پوست و بازسازی بیولوژیک سد دفاعی
          </h1>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
            کلینیک تخصصی و پورتفولیو درماتولوژی هدی پژمان؛ ارائه پروتکل‌های پیشرفته کربوکسی‌تراپی، آکواپیل و جوانسازی بدون سوزن با استانداردهای بین‌المللی CIDESCO سوئیس.
          </p>

          {/* Action Buttons: Apple-Style with soft mint teal glow */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2 w-full max-w-md mx-auto lg:mx-0">
            <a
              href="#schedule"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(123,196,188,0.6)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 animate-glow-pulse"
            >
              <CalendarCheckIcon className="w-4 h-4 text-white" />
              <span>مشاهده سانس‌های هفتگی</span>
            </a>

            <a
              href="#skin-analysis"
              className="w-full sm:w-auto min-h-[48px] px-5 py-3.5 bg-white/90 hover:bg-white border border-[#7bc4bc]/40 hover:border-[#7bc4bc] text-[#134e48] font-semibold text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm shadow-xs hover:scale-105 active:scale-95"
            >
              <WandSparklesIcon className="w-4 h-4 text-[#7bc4bc]" />
              <span>آنالیز هوشمند پوست</span>
            </a>
          </div>

          {/* Mobile Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-xs text-[#64748b]">
            <span className="flex items-center gap-1.5 bg-white/85 px-3.5 py-1.5 rounded-full border border-[#7bc4bc]/25 shadow-xs">
              <AwardIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              بورد CIDESCO سوئیس
            </span>
            <span className="flex items-center gap-1.5 bg-white/85 px-3.5 py-1.5 rounded-full border border-[#7bc4bc]/25 shadow-xs">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              محیط استریل VIP
            </span>
          </div>
        </div>

        {/* Central Artistic Arch Framing Container with High-Res Model Portrait - Placed on top on mobile (order-1) and secondary on desktop (lg:order-2) */}
        <div data-aos="fade-up" data-aos-duration="900" data-aos-delay="150" className="relative flex justify-center items-center order-1 lg:order-2 my-2 sm:my-0 w-full">
          
          {/* Luminous Mint Halo Behind Arch */}
          <div className="absolute inset-0 bg-[#7bc4bc]/20 rounded-full blur-3xl scale-95 pointer-events-none"></div>

          {/* Artistic Arch Frame with Frosted Glass Border */}
          <div className="relative z-10 w-full max-w-[280px] sm:max-w-[330px] lg:max-w-[360px] aspect-[3.2/4] rounded-t-[140px] sm:rounded-t-[165px] lg:rounded-t-[180px] overflow-hidden border-2 border-[#7bc4bc]/50 shadow-[0_20px_50px_-15px_rgba(123,196,188,0.4)] group bg-white animate-portrait-float mx-auto">
            {currentHero.img && (
              <img
                src={currentHero.img}
                alt={currentHero.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            )}

            {/* Seamless Bottom Gradient Fade into Page Background */}
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-[#f8faf9] via-[#f8faf9]/80 to-transparent"></div>

            {/* Active Tag Overlay at Base of Portrait (Apple Frosted Glass) */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 left-3 sm:right-4 sm:left-4 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#7bc4bc]/30 shadow-md flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#1d5750] block uppercase tracking-wider font-semibold">
                  HODA PEZHMAN · DERMA
                </span>
                <h3 className="text-xs font-bold text-[#0f172a] truncate max-w-[160px] sm:max-w-[190px]">
                  {currentHero.title}
                </h3>
              </div>
              <button
                onClick={onOpenZoom}
                className="w-8 h-8 rounded-full bg-[#f0f9f8] border border-[#7bc4bc]/40 text-[#134e48] flex items-center justify-center cursor-pointer hover:bg-[#7bc4bc] hover:text-white transition-colors shrink-0 shadow-xs"
                title="مشاهده بزرگنمایی"
                aria-label="Zoom"
              >
                <ZoomInIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
