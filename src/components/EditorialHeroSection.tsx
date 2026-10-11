import React from 'react';
import { TherapistBio } from '../types';
import {
  CalendarCheckIcon,
  WandSparklesIcon,
  AwardIcon,
  ShieldCheckIcon,
  ZoomInIcon,
  SeedlingIcon,
  HistoryIcon
} from './Icons';

interface EditorialHeroSectionProps {
  bio: TherapistBio;
  heroThumbnails: {
    id: number;
    title: string;
    desc: string;
    img: string;
  }[];
  activeThumbnail: number;
  onSelectThumbnail: (index: number) => void;
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
  return (
    <section id="top" className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden pt-6 sm:pt-10 pb-8 sm:pb-12 font-vazir w-full max-w-full min-w-0 bg-gradient-to-b from-[#f3faf9] via-[#f8faf9] to-[#ffffff]">
      
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full min-w-0 max-w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 flex-1 my-auto">
        
        {/* Editorial Headline & Action CTAs */}
        <div className="lg:col-span-5 text-center lg:text-right space-y-4 sm:space-y-6 order-1 lg:order-1 w-full">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#7bc4bc]/40 text-[11px] sm:text-xs text-[#1d5750] shadow-sm backdrop-blur-md mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#7bc4bc] animate-pulse"></span>
            <span className="font-medium">{bio.title} · زعفرانیه</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] leading-[1.3] sm:leading-[1.25] tracking-tight">
            درمان علمی پوست و بازسازی بیولوژیک سد دفاعی
          </h1>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
            کلینیک تخصصی و پورتفولیو درماتولوژی هدی پژمان؛ ارائه پروتکل‌های پیشرفته کربوکسی‌تراپی، آکواپیل و جوانسازی بدون سوزن با استانداردهای بین‌المللی CIDESCO سوئیس.
          </p>

          {/* Action Buttons: Apple-Style with soft mint teal glow */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2 w-full max-w-md mx-auto lg:mx-0">
            <a
              href="#schedule"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(123,196,188,0.6)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 animate-glow-pulse"
            >
              <CalendarCheckIcon className="w-4 h-4 text-white" />
              <span>مشاهده سانس‌های هفتگی</span>
            </a>

            <a
              href="#skin-analysis"
              className="w-full sm:w-auto min-h-[48px] px-5 py-3.5 bg-white/90 hover:bg-white border border-[#7bc4bc]/40 hover:border-[#7bc4bc] text-[#134e48] font-semibold text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm shadow-sm hover:scale-105 active:scale-95"
            >
              <WandSparklesIcon className="w-4 h-4 text-[#7bc4bc]" />
              <span>آنالیز هوشمند پوست</span>
            </a>
          </div>

          {/* Mobile Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-[11px] text-[#64748b]">
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-[#7bc4bc]/25 shadow-xs">
              <AwardIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              بورد CIDESCO سوئیس
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-[#7bc4bc]/25 shadow-xs">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              محیط استریل VIP
            </span>
          </div>
        </div>

        {/* Central Artistic Arch Framing Container with High-Res Model Portrait */}
        <div className="lg:col-span-4 relative flex justify-center items-center order-2 lg:order-2 my-2 sm:my-0 w-full">
          
          {/* Luminous Mint Halo Behind Arch */}
          <div className="absolute inset-0 bg-[#7bc4bc]/20 rounded-full blur-3xl scale-95 pointer-events-none"></div>

          {/* Artistic Arch Frame with Frosted Glass Border */}
          <div className="relative z-10 w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px] aspect-[3.2/4] rounded-t-[130px] sm:rounded-t-[160px] lg:rounded-t-[190px] overflow-hidden border-t-2 border-x-2 border-[#7bc4bc]/60 shadow-[0_20px_50px_-15px_rgba(123,196,188,0.4)] group bg-white animate-portrait-float mx-auto">
            <img
              src={heroThumbnails[activeThumbnail].img}
              alt={heroThumbnails[activeThumbnail].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />

            {/* Seamless Bottom Gradient Fade into Page Background */}
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-[#f8faf9] via-[#f8faf9]/80 to-transparent"></div>

            {/* Active Tag Overlay at Base of Portrait (Apple Frosted Glass) */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 left-3 sm:right-4 sm:left-4 p-2.5 sm:p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#7bc4bc]/30 shadow-md flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#1d5750] block uppercase tracking-wider font-semibold">
                  HODA PEZHMAN · DERMA
                </span>
                <h3 className="text-[11px] sm:text-xs font-bold text-[#0f172a] truncate max-w-[160px] sm:max-w-none">
                  {heroThumbnails[activeThumbnail].title}
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

        {/* Left Flank (Desktop): Clinical Credentials & Floating Indicators */}
        <div className="lg:col-span-3 space-y-3.5 order-3 hidden lg:block">
          <div className="bg-white/85 border border-[#7bc4bc]/25 p-4 rounded-2xl backdrop-blur-md shadow-sm hover:border-[#7bc4bc]/60 transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] flex items-center justify-center text-xs">
                <AwardIcon className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-[#0f172a]">بورد CIDESCO سوئیس</h4>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              معتبرترین سرتیفیکیت درماتولوژی و استتیک بالینی بین‌المللی.
            </p>
          </div>

          <div className="bg-white/85 border border-[#7bc4bc]/25 p-4 rounded-2xl backdrop-blur-md shadow-sm hover:border-[#7bc4bc]/60 transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] flex items-center justify-center text-xs">
                <SeedlingIcon className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-[#0f172a]">فرمولاسیون بیومیمتیک</h4>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              سرامیدهای سازگار با ساختار طبیعی پوست و بدون ترکیبات خشن.
            </p>
          </div>

          <div className="bg-white/85 border border-[#7bc4bc]/25 p-4 rounded-2xl backdrop-blur-md shadow-sm hover:border-[#7bc4bc]/60 transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] flex items-center justify-center text-xs">
                <HistoryIcon className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-[#0f172a]">نوبت‌دهی اختصاصی</h4>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              هماهنگی و مشاوره مستقیم در اینستاگرام با بررسی دقیق عکس پوست.
            </p>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* LAYER 25: TOUCH-FRIENDLY THUMBNAIL SELECTOR STRIP (APPLE MINIMALIST) */}
      {/* ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full min-w-0 max-w-full mt-6 sm:mt-8 relative z-20">
        <div className="w-full min-w-0 max-w-full flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory justify-start sm:justify-center">
          {heroThumbnails.map((thumb) => (
            <button
              key={thumb.id}
              onClick={() => onSelectThumbnail(thumb.id)}
              className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl border transition-all shrink-0 cursor-pointer text-right snap-start min-h-[50px] sm:min-h-[52px] max-w-[240px] sm:max-w-none ${
                activeThumbnail === thumb.id
                  ? 'bg-white border-[#7bc4bc] shadow-md shadow-[#7bc4bc]/20 ring-2 ring-[#7bc4bc]/40'
                  : 'bg-white/70 border-[#7bc4bc]/20 hover:border-[#7bc4bc]/50 hover:bg-white text-slate-700'
              }`}
            >
              <img
                src={thumb.img}
                alt={thumb.title}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shrink-0 border border-[#7bc4bc]/20"
              />
              <div className="pr-1 pl-2.5 truncate">
                <span className="text-xs font-bold text-[#0f172a] block truncate">
                  {thumb.title}
                </span>
                <span className="text-[10px] text-[#64748b] block line-clamp-1">
                  {thumb.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};
