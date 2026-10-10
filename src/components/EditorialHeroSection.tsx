import React from 'react';
import { TherapistBio } from '../types';
import {
  CalendarCheckIcon,
  MicrochipIcon,
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
    <section id="top" className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden pt-6 sm:pt-8 pb-8 sm:pb-10 font-vazir">
      
      {/* ===================================================================== */}
      {/* LAYER 0: 3D TYPOGRAPHY BEHIND CENTRAL MODEL (DESKTOP ONLY) */}
      {/* On mobile: Hidden to prevent cramped/squeezed overlapping layout */}
      {/* ===================================================================== */}
      <div className="hidden lg:flex absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex-col items-center justify-center">
        {/* Soft Ambient Dappled Sunlight Shadows */}
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#384334]/25 blur-[120px] -top-32 -right-32 animate-shadow-drift"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#a3b18a]/10 blur-[100px] bottom-10 left-10"></div>

        {/* Large Organic Brushstroke Graphic arching behind the head */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] rounded-[100%] bg-gradient-to-r from-[#2f372a]/0 via-[#3a4535]/40 to-[#2f372a]/0 rotate-[-8deg] blur-2xl animate-brush-float"></div>

        {/* 3D Giant Persian Display Typography LAYERED BEHIND the central image */}
        <div className="w-full text-center relative z-0 flex flex-col items-center justify-center opacity-85">
          <span className="text-[10.5vw] font-black tracking-tight text-[#343e30]/65 whitespace-nowrap leading-none font-vazir block transform -translate-y-6">
            آرامش سد دفاعی پوست
          </span>
          <span className="text-[4vw] font-extrabold tracking-[0.25em] text-[#2c3427]/70 uppercase font-syne whitespace-nowrap block mt-[-2vw]">
            SCIENCE · CALM · SKIN
          </span>
        </div>
      </div>

      {/* Subtle Mobile Atmosphere Glow */}
      <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#a3b18a]/15 blur-3xl"></div>
        <div className="absolute bottom-10 right-0 w-60 h-60 rounded-full bg-[#384334]/20 blur-2xl"></div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 10: MAIN FOREGROUND CONTENT & ADAPTIVE RESPONSIVE LAYOUT */}
      {/* ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10 flex-1 my-auto">
        
        {/* Editorial Headline & Action CTAs */}
        <div className="lg:col-span-4 text-center lg:text-right space-y-4 sm:space-y-6 order-2 lg:order-1">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#242922]/90 border border-[#a3b18a]/40 text-[11px] sm:text-xs text-[#a3b18a] backdrop-blur-md shadow-sm mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#a3b18a] animate-pulse"></span>
            <span>{bio.title} · زعفرانیه</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#f1f5f9] leading-[1.3] sm:leading-[1.25] tracking-tight">
            درمان علمی پوست و بازسازی بیولوژیک سد دفاعی
          </h1>

          <p className="text-xs sm:text-sm text-[#e2e8f0]/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
            کلینیک تخصصی و پورتفولیو درماتولوژی هدی پژمان؛ ارائه پروتکل‌های پیشرفته کربوکسی‌تراپی، آکواپیل و جوانسازی بدون سوزن با استانداردهای CIDESCO سوئیس.
          </p>

          {/* Action Buttons: Spacious & Touch-friendly (Min 48px height) with Luxury Micro-Interactions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href="#schedule"
              className="min-h-[48px] px-6 py-3.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 animate-glow-pulse"
            >
              <CalendarCheckIcon className="w-4 h-4" />
              <span>مشاهده سانس‌های هفتگی</span>
            </a>

            <a
              href="#devices"
              className="min-h-[48px] px-5 py-3.5 bg-[#242922]/90 hover:bg-[#363d33] border border-[#363d33] hover:border-[#a3b18a]/50 text-[#f1f5f9] font-medium text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <MicrochipIcon className="w-4 h-4 text-[#a3b18a]" />
              <span>تجهیزات کلینیکی</span>
            </a>
          </div>

          {/* Mobile Trust Badges Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5 bg-[#242922]/60 px-3 py-1.5 rounded-full border border-[#363d33] hover:border-[#a3b18a]/40 transition-colors">
              <AwardIcon className="w-3.5 h-3.5 text-[#a3b18a]" />
              بورد CIDESCO سوئیس
            </span>
            <span className="flex items-center gap-1.5 bg-[#242922]/60 px-3 py-1.5 rounded-full border border-[#363d33] hover:border-[#a3b18a]/40 transition-colors">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#a3b18a]" />
              محیط استریل VIP
            </span>
          </div>
        </div>

        {/* Central Cutout Portrait of Woman with Headwrap & 3D Slow Float */}
        <div className="lg:col-span-5 relative flex justify-center items-center order-1 lg:order-2 my-2 sm:my-0">
          
          {/* Subtle Organic Halo Glow */}
          <div className="absolute inset-0 bg-[#a3b18a]/15 rounded-full blur-3xl scale-95 pointer-events-none"></div>

          {/* Central Portrait Architecture with Arch Mask & Subtle Slow Float */}
          <div className="relative z-10 w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px] aspect-[3.2/4] rounded-t-[130px] sm:rounded-t-[170px] lg:rounded-t-[200px] overflow-hidden border-t-2 border-x-2 border-[#a3b18a]/40 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] group bg-[#1e221b] animate-portrait-float">
            <img
              src={heroThumbnails[activeThumbnail].img}
              alt={heroThumbnails[activeThumbnail].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />

            {/* Seamless Bottom Gradient Fade into Page Background */}
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-[#1e221b] via-[#1e221b]/80 to-transparent"></div>

            {/* Active Tag Overlay at Base of Portrait */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 left-3 sm:right-4 sm:left-4 p-2.5 sm:p-3 rounded-xl bg-[#242922]/90 backdrop-blur-md border border-[#363d33] flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#a3b18a] block uppercase tracking-wider">
                  HODA PEZHMAN · DERMA
                </span>
                <h3 className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[160px] sm:max-w-none">
                  {heroThumbnails[activeThumbnail].title}
                </h3>
              </div>
              <button
                onClick={onOpenZoom}
                className="w-8 h-8 rounded-full bg-[#1e221b] border border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center cursor-pointer hover:bg-[#a3b18a] hover:text-[#1e221b] transition-colors shrink-0"
                title="مشاهده بزرگنمایی"
                aria-label="Zoom"
              >
                <ZoomInIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Left Flank (Desktop): Clinical Credentials & Floating Indicators */}
        <div className="lg:col-span-3 space-y-3 order-3 hidden lg:block">
          <div className="bg-[#242922]/80 border border-[#363d33] p-4 rounded-2xl backdrop-blur-md hover:border-[#a3b18a]/40 transition-colors">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#1e221b] text-[#a3b18a] flex items-center justify-center text-xs">
                <AwardIcon className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-bold text-[#f1f5f9]">بورد CIDESCO سوئیس</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              معتبرترین سرتیفیکیت درماتولوژی و استتیک بالینی بین‌المللی.
            </p>
          </div>

          <div className="bg-[#242922]/80 border border-[#363d33] p-4 rounded-2xl backdrop-blur-md hover:border-[#a3b18a]/40 transition-colors">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#1e221b] text-[#a3b18a] flex items-center justify-center text-xs">
                <SeedlingIcon className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-bold text-[#f1f5f9]">فرمولاسیون بیومیمتیک</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              سرامیدهای سازگار با ساختار طبیعی پوست و بدون ترکیبات خشن.
            </p>
          </div>

          <div className="bg-[#242922]/80 border border-[#363d33] p-4 rounded-2xl backdrop-blur-md hover:border-[#a3b18a]/40 transition-colors">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#1e221b] text-[#a3b18a] flex items-center justify-center text-xs">
                <HistoryIcon className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-bold text-[#f1f5f9]">نوبت‌دهی اختصاصی</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              هماهنگی و مشاوره مستقیم در اینستاگرام با بررسی عکس پوست.
            </p>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* LAYER 25: TOUCH-FRIENDLY THUMBNAIL SELECTOR STRIP */}
      {/* ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-6 relative z-20">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory">
          {heroThumbnails.map((thumb) => (
            <button
              key={thumb.id}
              onClick={() => onSelectThumbnail(thumb.id)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all shrink-0 cursor-pointer text-right snap-start min-h-[52px] ${
                activeThumbnail === thumb.id
                  ? 'bg-[#242922] border-[#a3b18a] shadow-lg shadow-[#a3b18a]/10'
                  : 'bg-[#1e221b]/80 border-[#363d33] hover:border-gray-500'
              }`}
            >
              <img
                src={thumb.img}
                alt={thumb.title}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="pr-1 pl-3">
                <span className="text-xs font-bold text-[#f1f5f9] block">
                  {thumb.title}
                </span>
                <span className="text-[10px] text-gray-400 block line-clamp-1">
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
