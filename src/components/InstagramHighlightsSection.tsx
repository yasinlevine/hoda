import React, { useState } from 'react';
import {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  heroMintPortrait,
  mintSerumStone,
  facialTherapyMint,
  mintCreamSwirl
} from '../types';

export interface StoryHighlight {
  id: string;
  title: string;
  category: string;
  icon: string;
  image: string;
  description: string;
}

const HIGHLIGHT_STORIES: StoryHighlight[] = [
  {
    id: 'before-after',
    title: 'نتایج بالینی',
    category: 'قبل و بعد',
    icon: 'fa-wand-magic-sparkles',
    image: facialTherapyMint,
    description: 'درمان لک‌های هورمونی و ترمیم سد دفاعی پوست پس از ۳ جلسه پروتکل تلفیقی کربوکسی و پیلینگ لاملار بدون سوزن.'
  },
  {
    id: 'devices',
    title: 'تجهیزات VIP',
    category: 'فناوری‌های غیرتهاجمی',
    icon: 'fa-microchip',
    image: mintSerumStone,
    description: 'معرفی ۴ فناوری پیشرفته کلینیک شامل آکواپیل ورتکس، کربوکسی با اثر بوهر، اولتراسوند نانو و فتوتراپی کالیبره‌شده.'
  },
  {
    id: 'barrier-care',
    title: 'سد دفاعی',
    category: 'آموزش تخصصی',
    icon: 'fa-shield-halved',
    image: mintCreamSwirl,
    description: 'چرا محافظت از لیپیدهای بین‌سلولی و سرامیدها، مهم‌ترین فاکتور درخشندگی و عدم پیری زودرس پوست است؟'
  },
  {
    id: 'clinic-space',
    title: 'محیط کلینیک',
    category: 'فضای ایزوله زعفرانیه',
    icon: 'fa-spa',
    image: heroMintPortrait,
    description: 'محیطی آرام، لوکس و کاملاً استریل با استانداردهای بهداشتی بیمارستانی و پذیرش اختصاصی تک‌نفره در زعفرانیه.'
  },
  {
    id: 'client-reviews',
    title: 'رضایت مراجعین',
    category: 'پیام‌ها و بازخوردها',
    icon: 'fa-star',
    image: facialTherapyMint,
    description: 'پیام‌های صوتی و رضایت مراجعین عزیز از کاهش منافذ باز، شفافیت طبیعی پوست و احساس سبکی بعد از فیشیال.'
  },
  {
    id: 'faq-consult',
    title: 'پرسش و پاسخ',
    category: 'مشاوره آنلاین',
    icon: 'fa-circle-question',
    image: mintSerumStone,
    description: 'پاسخ به پرتکرارترین سوالات درباره مراقبت بعد از درمان، فاصله بین جلسات و انتخاب روتین متناسب با فصل.'
  }
];

interface InstagramHighlightsSectionProps {
  onOpenBookingModal: (title?: string) => void;
}

export const InstagramHighlightsSection: React.FC<InstagramHighlightsSectionProps> = ({
  onOpenBookingModal
}) => {
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-[#7bc4bc]/20 font-vazir relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7bc4bc] animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#1d5750] uppercase tracking-wider">
                COMMUNITY & LIVE STORIES
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              آخرین‌ها از اینستاگرام ({INSTAGRAM_HANDLE})
            </h2>
            <p className="text-xs text-[#64748b] mt-1">
              هایلایت‌های استوری، پرونده‌های درمانی و نتایج بالینی پوست مراجعین کلینیک
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto min-h-[40px] px-4 py-2 bg-[#f0f9f8] hover:bg-[#e4f6f3] text-[#134e48] border border-[#7bc4bc]/30 rounded-full text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-2xs"
          >
            <i className="fa-brands fa-instagram text-[#7bc4bc] text-sm"></i>
            <span>مشاهده صفحه اینستاگرام</span>
          </a>
        </div>

        {/* Modern Horizontal Highlight Story Bar */}
        <div className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-4 sm:gap-8 min-w-max justify-start sm:justify-center px-1">
            {HIGHLIGHT_STORIES.map((story) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="group flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none transition-transform duration-300"
              >
                {/* Circular Story Widget with Teal Gradient Border */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#7bc4bc] via-[#a8ded8] to-[#1d5750] shadow-sm group-hover:shadow-[0_8px_20px_-4px_rgba(123,196,188,0.5)] group-hover:scale-105 transition-all duration-300">
                  <div className="p-1 bg-white rounded-full">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#f0f9f8] flex items-center justify-center">
                      <img
                        src={story.image}
                        alt={story.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Frosted icon badge overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md text-[#134e48] flex items-center justify-center text-xs shadow-xs">
                          <i className={`fa-solid ${story.icon}`}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Label Below */}
                <div className="text-center">
                  <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#134e48] transition-colors block whitespace-nowrap">
                    {story.title}
                  </span>
                  <span className="text-[10px] text-[#64748b] font-medium block whitespace-nowrap">
                    {story.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-[#7bc4bc]/40 rounded-3xl max-w-sm sm:max-w-md w-full overflow-hidden shadow-2xl relative text-right animate-modal-in">
            
            {/* Top Instagram Story Progress Bar */}
            <div className="p-4 pb-2 bg-gradient-to-b from-black/60 to-transparent absolute top-0 inset-x-0 z-20 flex flex-col gap-2">
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full animate-pulse w-3/4"></div>
              </div>
              <div className="flex items-center justify-between text-white text-xs pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-[#7bc4bc] to-white">
                    <img
                      src={activeStory.image}
                      alt={activeStory.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold block leading-tight">{INSTAGRAM_HANDLE}</span>
                    <span className="text-[10px] text-white/80">{activeStory.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            </div>

            {/* Story Visual Feature */}
            <div className="relative h-80 sm:h-96 w-full bg-[#f0f9f8]">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-4 right-4 left-4 text-white space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#7bc4bc] text-white text-[11px] font-bold shadow-xs">
                  {activeStory.title}
                </span>
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow-md">
                  {activeStory.description}
                </p>
              </div>
            </div>

            {/* Story Action Bar */}
            <div className="p-4 sm:p-5 bg-white flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveStory(null);
                  onOpenBookingModal(activeStory.title);
                }}
                className="flex-1 py-3 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>رزرو نوبت مرتبط با این هایلایت</span>
              </button>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#f0f9f8] hover:bg-[#e4f6f3] text-[#134e48] border border-[#7bc4bc]/30 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="مشاهده در اینستاگرام"
              >
                <i className="fa-brands fa-instagram text-[#7bc4bc]"></i>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
