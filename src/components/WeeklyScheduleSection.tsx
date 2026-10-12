import React, { useState } from 'react';
import { WeeklySlot, WEEK_DAYS, SHIFTS_CONFIG, DayKey } from '../types';
import {
  RepeatIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SunIcon,
  CloudSunIcon,
  MoonIcon,
  InstagramIcon,
  LockIcon,
  LocationIcon,
  HistoryIcon
} from './Icons';

interface WeeklyScheduleSectionProps {
  schedule: WeeklySlot[];
  onSelectSlot: (slot: WeeklySlot) => void;
}

export const WeeklyScheduleSection: React.FC<WeeklyScheduleSectionProps> = ({
  schedule,
  onSelectSlot
}) => {
  const renderShiftIcon = (key: string, className = 'w-4 h-4') => {
    switch (key) {
      case 'morning':
        return <SunIcon className={className} />;
      case 'afternoon':
        return <CloudSunIcon className={className} />;
      case 'evening':
        return <MoonIcon className={className} />;
      default:
        return <SunIcon className={className} />;
    }
  };
  // Active day selection for mobile single-column card view (defaults to Saturday)
  const [activeMobileDayKey, setActiveMobileDayKey] = useState<DayKey>('sat');
  
  // Filter for desktop (all or specific day)
  const [selectedDayFilter, setSelectedDayFilter] = useState<DayKey | 'all'>('all');

  // Mobile layout mode: 'single-day' (focused card) or 'all-days' (swipeable list)
  const [mobileViewMode, setMobileViewMode] = useState<'single-day' | 'all-days'>('single-day');

  // Stats calculation
  const totalSlots = schedule.length;
  const availableSlots = schedule.filter(s => s.status === 'available').length;
  const bookedSlots = schedule.filter(s => s.status === 'booked').length;

  const activeMobileDay = WEEK_DAYS.find(d => d.key === activeMobileDayKey) || WEEK_DAYS[0];
  const activeMobileDaySlots = schedule.filter(s => s.dayKey === activeMobileDayKey);
  const activeMobileDayOpenCount = activeMobileDaySlots.filter(s => s.status === 'available').length;

  // Day navigation helpers for mobile
  const currentDayIndex = WEEK_DAYS.findIndex(d => d.key === activeMobileDayKey);
  const handlePrevDay = () => {
    const prevIndex = (currentDayIndex - 1 + WEEK_DAYS.length) % WEEK_DAYS.length;
    setActiveMobileDayKey(WEEK_DAYS[prevIndex].key);
  };
  const handleNextDay = () => {
    const nextIndex = (currentDayIndex + 1) % WEEK_DAYS.length;
    setActiveMobileDayKey(WEEK_DAYS[nextIndex].key);
  };

  const filteredDays = selectedDayFilter === 'all'
    ? WEEK_DAYS
    : WEEK_DAYS.filter(d => d.key === selectedDayFilter);

  return (
    <section id="schedule" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 font-vazir relative">
      
      {/* Section Header */}
      <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="max-w-2xl text-right">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7bc4bc] animate-ping"></span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#1d5750] uppercase tracking-wider">
              WEEKLY AVAILABLE SLOTS · SCHEDULE MATRIX
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight">
            جدول سانس‌های هفتگی و ظرفیت‌های باز
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-2.5 leading-relaxed">
            جهت حفظ کیفیت خدمات و اختصاص زمان کامل به هر مراجع، ویزیت‌ها در ۳ شیفت کاری ارائه می‌شوند. سانس‌های باز را انتخاب کنید تا مستقیماً در دایرکت اینستاگرام ثبت گردند.
          </p>
        </div>

        {/* Live Status Pill & Legend */}
        <div className="bg-white border border-[#7bc4bc]/25 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center gap-3.5 sm:gap-4 text-xs shadow-xs self-start md:self-auto hover:border-[#7bc4bc] transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#7bc4bc] shadow-[0_0_8px_rgba(123,196,188,0.6)]"></span>
            <span className="text-[#0f172a] font-semibold">زمان باز ({availableSlots} سانس)</span>
          </div>
          <span className="text-slate-200 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span className="text-[#64748b] font-medium">تکمیل شده ({bookedSlots} سانس)</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE-FIRST VIEW (< lg): INTUITIVE SINGLE-COLUMN OR SWIPEABLE CARDS */}
      {/* ===================================================================== */}
      <div data-aos="fade-up" data-aos-duration="800" className="block lg:hidden space-y-5">
        
        {/* Mobile Horizontal Day Selector */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] text-[#64748b] font-medium">انتخاب روز هفته:</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                onClick={() => setMobileViewMode(mobileViewMode === 'single-day' ? 'all-days' : 'single-day')}
                className="text-[#134e48] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{mobileViewMode === 'single-day' ? 'نمایش کل روزها' : 'نمایش روزانه'}</span>
                <RepeatIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
            {WEEK_DAYS.map((day) => {
              const daySlots = schedule.filter(s => s.dayKey === day.key);
              const dayOpen = daySlots.filter(s => s.status === 'available').length;
              const isSelected = activeMobileDayKey === day.key;

              return (
                <button
                  key={day.key}
                  onClick={() => {
                    setActiveMobileDayKey(day.key);
                    if (mobileViewMode === 'all-days') setMobileViewMode('single-day');
                  }}
                  className={`min-h-[48px] px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer snap-start flex flex-col items-center justify-center min-w-[76px] ${
                    isSelected
                      ? 'bg-[#7bc4bc] text-white shadow-md shadow-[#7bc4bc]/25 scale-102'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <span className="text-xs">{day.name}</span>
                  <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-white/90' : dayOpen > 0 ? 'text-[#134e48]' : 'text-slate-400'}`}>
                    {dayOpen > 0 ? `${dayOpen} باز` : 'تکمیل'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE MODE 1: SINGLE-DAY FOCUSED SPACIOUS CARD VIEW */}
        {mobileViewMode === 'single-day' && (
          <div className="bg-white border border-[#7bc4bc]/30 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            
            {/* Day Header with Quick Arrows */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <button
                onClick={handlePrevDay}
                className="w-9 h-9 rounded-full bg-[#f8faf9] border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                aria-label="Previous day"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="font-extrabold text-[#0f172a] text-lg">
                    روز {activeMobileDay.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#134e48] uppercase bg-[#f0f9f8] px-2 py-0.5 rounded-md border border-[#7bc4bc]/30">
                    {activeMobileDay.enName}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748b] mt-0.5 block font-medium">
                  {activeMobileDayOpenCount > 0
                    ? `${activeMobileDayOpenCount} سانس باز و آماده رزرو`
                    : 'ظرفیت این روز تکمیل گردیده است'}
                </span>
              </div>

              <button
                onClick={handleNextDay}
                className="w-9 h-9 rounded-full bg-[#f8faf9] border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                aria-label="Next day"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Shifts Large Touch-Friendly Cards */}
            <div className="space-y-3 pt-1">
              {SHIFTS_CONFIG.map((shiftConf) => {
                const slot = activeMobileDaySlots.find(s => s.shiftKey === shiftConf.key);
                if (!slot) return null;

                const isAvail = slot.status === 'available';

                if (isAvail) {
                  return (
                    <div
                      key={slot.id}
                      onClick={() => onSelectSlot(slot)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectSlot(slot)}
                      className="bg-[#f0f9f8] hover:bg-[#e4f6f3] border-2 border-[#7bc4bc]/60 active:border-[#7bc4bc] p-4 rounded-2xl transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between gap-3 active:scale-95"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-white text-[#134e48] flex items-center justify-center border border-[#7bc4bc]/30 shadow-xs">
                            {renderShiftIcon(shiftConf.key, 'w-4 h-4 text-[#7bc4bc]')}
                          </span>
                          <div>
                            <span className="font-bold text-[#0f172a] text-sm block">
                              {shiftConf.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#64748b]">
                              {shiftConf.timeRange}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-white text-[#134e48] px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#7bc4bc]/40 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-[#7bc4bc] animate-pulse"></span>
                          <span>آماده رزرو</span>
                        </div>
                      </div>

                      {/* Prominent Large Touch-Target Action Button */}
                      <button
                        type="button"
                        className="w-full min-h-[48px] bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
                      >
                        <InstagramIcon className="w-4 h-4 text-white" />
                        <span>رزرو این سانس در دایرکت اینستاگرام</span>
                      </button>
                    </div>
                  );
                }

                // Closed / Booked slot
                return (
                  <div
                    key={slot.id}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between opacity-60 cursor-not-allowed select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        {renderShiftIcon(shiftConf.key, 'w-4 h-4 text-slate-400')}
                      </span>
                      <div>
                        <span className="font-medium text-slate-500 text-sm block">
                          {shiftConf.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {shiftConf.timeRange}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <LockIcon className="w-3.5 h-3.5" />
                      <span>تکمیل ظرفیت</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* MOBILE MODE 2: ALL DAYS LIST */}
        {mobileViewMode === 'all-days' && (
          <div className="space-y-4">
            {WEEK_DAYS.map((day) => {
              const daySlots = schedule.filter(s => s.dayKey === day.key);
              const dayOpen = daySlots.filter(s => s.status === 'available').length;

              return (
                <div
                  key={day.key}
                  className="bg-white border border-[#7bc4bc]/25 rounded-2xl p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0f172a] text-sm">{day.name}</span>
                      <span className="text-[10px] font-mono text-[#134e48] bg-[#f0f9f8] px-2 py-0.5 rounded border border-[#7bc4bc]/20">
                        {day.enName}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      dayOpen > 0 ? 'bg-[#f0f9f8] text-[#134e48] border border-[#7bc4bc]/30 font-bold' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {dayOpen > 0 ? `${dayOpen} سانس باز` : 'تکمیل'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {SHIFTS_CONFIG.map((shiftConf) => {
                      const slot = daySlots.find(s => s.shiftKey === shiftConf.key);
                      const isAvail = slot?.status === 'available';

                      if (!slot) return null;

                      if (isAvail) {
                        return (
                          <button
                            key={slot.id}
                            onClick={() => onSelectSlot(slot)}
                            className="p-3 bg-[#f0f9f8] hover:bg-[#e4f6f3] border border-[#7bc4bc]/50 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-right"
                          >
                            <div className="flex items-center gap-2">
                              {renderShiftIcon(shiftConf.key, 'w-3.5 h-3.5 text-[#7bc4bc]')}
                              <span className="text-xs font-bold text-[#0f172a]">{shiftConf.name}</span>
                              <span className="text-[10px] font-mono text-[#64748b]">({shiftConf.timeRange})</span>
                            </div>
                            <span className="text-[11px] font-bold text-[#134e48] bg-white px-2.5 py-1 rounded-lg border border-[#7bc4bc]/30">
                              رزرو
                            </span>
                          </button>
                        );
                      }

                      return (
                        <div
                          key={slot.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between opacity-60 text-right"
                        >
                          <div className="flex items-center gap-2 text-slate-400">
                            {renderShiftIcon(shiftConf.key, 'w-3.5 h-3.5 text-slate-400')}
                            <span className="text-xs">{shiftConf.name}</span>
                            <span className="text-[10px] font-mono">({shiftConf.timeRange})</span>
                          </div>
                          <span className="text-[10px] text-slate-400">تکمیل</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ===================================================================== */}
      {/* DESKTOP VIEW (>= lg): LUXURY 7-COLUMN MATRIX TABLE */}
      {/* ===================================================================== */}
      <div data-aos="fade-up" data-aos-duration="850" className="hidden lg:block space-y-6">
        
        {/* Day Filter Pills for Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedDayFilter === 'all'
                ? 'bg-[#7bc4bc] text-white font-bold shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            کل روزهای هفته (شنبه تا جمعه)
          </button>

          {WEEK_DAYS.map((day) => {
            const daySlots = schedule.filter(s => s.dayKey === day.key);
            const hasOpen = daySlots.some(s => s.status === 'available');

            return (
              <button
                key={day.key}
                onClick={() => setSelectedDayFilter(day.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedDayFilter === day.key
                    ? 'bg-[#7bc4bc] text-white font-bold shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{day.name}</span>
                {hasOpen && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedDayFilter === day.key ? 'bg-white' : 'bg-[#7bc4bc]'}`}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* 7 Columns Grid */}
        <div className="grid grid-cols-7 gap-4">
          {filteredDays.map((day) => {
            const daySlots = schedule.filter(s => s.dayKey === day.key);
            const dayOpenCount = daySlots.filter(s => s.status === 'available').length;

            return (
              <div
                key={day.key}
                className="bg-white border border-[#7bc4bc]/25 rounded-2xl p-4 flex flex-col justify-between hover:border-[#7bc4bc] transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md"
              >
                {/* Day Header */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-base">
                      {day.name}
                    </h3>
                    <span className="text-[10px] text-[#64748b] font-mono uppercase block">
                      {day.enName}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      dayOpenCount > 0
                        ? 'bg-[#f0f9f8] text-[#134e48] border border-[#7bc4bc]/40 font-bold'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {dayOpenCount > 0 ? `${dayOpenCount} باز` : 'تکمیل'}
                  </span>
                </div>

                {/* 3 Shifts List */}
                <div className="py-3 space-y-2.5 flex-1">
                  {SHIFTS_CONFIG.map((shiftConf) => {
                    const slot = daySlots.find(s => s.shiftKey === shiftConf.key);
                    const isAvailable = slot?.status === 'available';

                    if (!slot) return null;

                    if (isAvailable) {
                      return (
                        <div
                          key={slot.id}
                          onClick={() => onSelectSlot(slot)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && onSelectSlot(slot)}
                          className="group bg-[#f0f9f8] hover:bg-[#e4f6f3] border border-[#7bc4bc]/50 hover:border-[#7bc4bc] p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95"
                        >
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-[#0f172a] group-hover:text-[#134e48] transition-colors flex items-center gap-1.5">
                              {renderShiftIcon(shiftConf.key, 'w-3.5 h-3.5 text-[#7bc4bc]')}
                              {shiftConf.name}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#7bc4bc] animate-pulse"></span>
                          </div>

                          <div className="text-[11px] font-mono text-[#64748b] mb-2">
                            {shiftConf.timeRange}
                          </div>

                          {/* Attractive Interactive Badge */}
                          <div className="bg-white group-hover:bg-[#7bc4bc] group-hover:text-white text-[#134e48] border border-[#7bc4bc]/40 py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs">
                            <InstagramIcon className="w-3.5 h-3.5" />
                            <span>رزرو دایرکت</span>
                          </div>
                        </div>
                      );
                    }

                    // Booked / Closed Slot
                    return (
                      <div
                        key={slot.id}
                        className="bg-slate-50 border border-slate-200 p-3 rounded-xl opacity-60 cursor-not-allowed select-none"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-slate-400 flex items-center gap-1.5">
                            {renderShiftIcon(shiftConf.key, 'w-3 h-3 text-slate-400')}
                            {shiftConf.name}
                          </span>
                          <LockIcon className="w-3.5 h-3.5 text-slate-400" />
                        </div>

                        <div className="text-[11px] font-mono text-slate-400 mb-2">
                          {shiftConf.timeRange}
                        </div>

                        <div className="bg-slate-100 text-slate-400 py-1 px-2 rounded-lg text-[10px] text-center">
                          تکمیل شده
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Day Footnote */}
                <div className="pt-2 border-t border-slate-100 text-[10px] text-[#64748b] text-center font-medium">
                  زعفرانیه · محیط VIP
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Information Banner below Matrix */}
      <div data-aos="fade-up" data-aos-duration="800" className="mt-8 sm:mt-12 bg-gradient-to-r from-[#f0f9f8] via-[#e8f6f4] to-[#f0f9f8] border border-[#7bc4bc]/30 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs text-center sm:text-right">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#7bc4bc]/40 text-[#7bc4bc] flex items-center justify-center text-xl shrink-0 shadow-xs">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#0f172a]">
              نیاز به سانس یا زمان اختصاصی دیگری دارید؟
            </h4>
            <p className="text-xs text-[#475569] mt-1 leading-relaxed">
              در صورت تکمیل بودن سانس مورد نظرتان، شرایط و روز مد نظر خود را در دایرکت اینستاگرام ارسال فرمایید تا در لیست رزرو اضطراری یا VIP قرار گیرد.
            </p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/hodapezhman_skincare"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-6 py-3 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <InstagramIcon className="w-4 h-4 text-white" />
          <span>استعلام در دایرکت اینستاگرام</span>
        </a>
      </div>

    </section>
  );
};
