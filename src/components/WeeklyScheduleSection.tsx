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
            <span className="w-2.5 h-2.5 rounded-full bg-[#a3b18a] animate-ping"></span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#a3b18a]">
              WEEKLY AVAILABLE SLOTS · SCHEDULE MATRIX
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#f1f5f9] tracking-tight">
            جدول سانس‌های هفتگی و ظرفیت‌های باز
          </h2>
          <p className="text-xs sm:text-sm text-[#e2e8f0]/75 mt-2.5 leading-relaxed">
            جهت حفظ کیفیت خدمات و اختصاص زمان کامل به هر مراجع، ویزیت‌ها در ۳ شیفت کاری ارائه می‌شوند. سانس‌های باز را انتخاب کنید تا مستقیماً در دایرکت اینستاگرام ثبت گردند.
          </p>
        </div>

        {/* Live Status Pill & Legend */}
        <div className="bg-[#242922] border border-[#363d33] p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center gap-3.5 sm:gap-4 text-xs shadow-lg self-start md:self-auto hover:border-[#a3b18a]/40 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#a3b18a] shadow-[0_0_8px_rgba(163,177,138,0.6)]"></span>
            <span className="text-[#f1f5f9] font-medium">زمان باز ({availableSlots} سانس)</span>
          </div>
          <span className="text-[#363d33] hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#363d33] border border-gray-600"></span>
            <span className="text-gray-400 font-medium">تکمیل شده ({bookedSlots} سانس)</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE-FIRST VIEW (< lg): INTUITIVE SINGLE-COLUMN OR SWIPEABLE CARDS */}
      {/* Specifically redesigned so mobile view is spacious and finger-friendly */}
      {/* ===================================================================== */}
      <div className="block lg:hidden space-y-5">
        
        {/* Mobile Horizontal Day Selector (Touch-friendly Pills) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] text-gray-400 font-medium">انتخاب روز هفته:</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                onClick={() => setMobileViewMode(mobileViewMode === 'single-day' ? 'all-days' : 'single-day')}
                className="text-[#a3b18a] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{mobileViewMode === 'single-day' ? 'نمایش کل روزها' : 'نمایش روزانه'}</span>
                <RepeatIcon className="w-3.5 h-3.5" />
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
                      ? 'bg-[#a3b18a] text-[#1e221b] shadow-lg shadow-[#a3b18a]/20 scale-102'
                      : 'bg-[#242922] text-gray-300 hover:text-white border border-[#363d33]'
                  }`}
                >
                  <span className="text-xs">{day.name}</span>
                  <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-[#1e221b]/80' : dayOpen > 0 ? 'text-[#a3b18a]' : 'text-gray-500'}`}>
                    {dayOpen > 0 ? `${dayOpen} باز` : 'تکمیل'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE MODE 1: SINGLE-DAY FOCUSED SPACIOUS CARD VIEW */}
        {mobileViewMode === 'single-day' && (
          <div className="bg-[#242922] border border-[#a3b18a]/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Day Header with Quick Arrows */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#363d33]">
              <button
                onClick={handlePrevDay}
                className="w-9 h-9 rounded-full bg-[#1e221b] border border-[#363d33] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                aria-label="Previous day"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="font-extrabold text-[#f1f5f9] text-lg">
                    روز {activeMobileDay.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#a3b18a] uppercase bg-[#1e221b] px-2 py-0.5 rounded-md border border-[#363d33]">
                    {activeMobileDay.enName}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  {activeMobileDayOpenCount > 0
                    ? `${activeMobileDayOpenCount} سانس باز و آماده رزرو`
                    : 'ظرفیت این روز تکمیل گردیده است'}
                </span>
              </div>

              <button
                onClick={handleNextDay}
                className="w-9 h-9 rounded-full bg-[#1e221b] border border-[#363d33] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
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
                      className="bg-[#1e221b] hover:bg-[#283124] border-2 border-[#a3b18a]/60 active:border-[#a3b18a] p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-[0_10px_25px_-5px_rgba(163,177,138,0.25)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between gap-3 active:scale-95"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-[#242922] text-[#a3b18a] flex items-center justify-center border border-[#363d33] group-hover:scale-105 transition-transform">
                            {renderShiftIcon(shiftConf.key, 'w-4 h-4')}
                          </span>
                          <div>
                            <span className="font-bold text-[#f1f5f9] text-sm block">
                              {shiftConf.name}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {shiftConf.timeRange}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#a3b18a]/15 text-[#a3b18a] px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#a3b18a]/30">
                          <span className="w-2 h-2 rounded-full bg-[#a3b18a] animate-pulse"></span>
                          <span>آماده رزرو</span>
                        </div>
                      </div>

                      {/* Prominent Large Touch-Target Action Button (Min 48px height) with Micro-Interaction */}
                      <button
                        type="button"
                        className="w-full min-h-[48px] bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                      >
                        <InstagramIcon className="w-4 h-4" />
                        <span>رزرو این سانس در دایرکت اینستاگرام</span>
                      </button>
                    </div>
                  );
                }

                // Booked Slot Card
                return (
                  <div
                    key={slot.id}
                    className="bg-[#1a1e17]/80 border border-[#363d33]/50 p-4 rounded-2xl opacity-65 flex items-center justify-between select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-[#171a15] text-gray-500 flex items-center justify-center border border-[#2b3127]">
                        {renderShiftIcon(shiftConf.key, 'w-4 h-4 text-gray-500')}
                      </span>
                      <div>
                        <span className="font-medium text-gray-400 text-sm block">
                          {shiftConf.name}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          {shiftConf.timeRange}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 bg-[#171a15] px-3 py-1.5 rounded-xl border border-[#2b3127] text-xs">
                      <LockIcon className="w-3.5 h-3.5 text-gray-500" />
                      <span>تکمیل شده</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Clinic Notice */}
            <div className="pt-3 border-t border-[#363d33]/50 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
              <LocationIcon className="w-3.5 h-3.5 text-[#a3b18a]" />
              <span>تهران، زعفرانیه (VIP) · محیط ایزوله و اختصاصی</span>
            </div>
          </div>
        )}

        {/* MOBILE MODE 2: ALL DAYS SWIPEABLE ACCORDION/LIST */}
        {mobileViewMode === 'all-days' && (
          <div className="space-y-4">
            {WEEK_DAYS.map((day) => {
              const daySlots = schedule.filter(s => s.dayKey === day.key);
              const dayOpen = daySlots.filter(s => s.status === 'available').length;

              return (
                <div
                  key={day.key}
                  className="bg-[#242922] border border-[#363d33] rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#363d33]">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#f1f5f9] text-base">{day.name}</h4>
                      <span className="text-[10px] font-mono text-gray-500">{day.enName}</span>
                    </div>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${dayOpen > 0 ? 'bg-[#a3b18a]/20 text-[#a3b18a]' : 'bg-[#1e221b] text-gray-500'}`}>
                      {dayOpen > 0 ? `${dayOpen} سانس باز` : 'تکمیل'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SHIFTS_CONFIG.map((shiftConf) => {
                      const slot = daySlots.find(s => s.shiftKey === shiftConf.key);
                      if (!slot) return null;
                      const isAvail = slot.status === 'available';

                      if (isAvail) {
                        return (
                          <button
                            key={slot.id}
                            onClick={() => onSelectSlot(slot)}
                            className="p-3 rounded-xl bg-[#1e221b] border border-[#a3b18a]/50 text-right hover:bg-[#283124] transition-all flex items-center justify-between cursor-pointer min-h-[44px]"
                          >
                            <div>
                              <span className="text-xs font-bold text-[#f1f5f9] block">{shiftConf.name}</span>
                              <span className="text-[10px] font-mono text-gray-400">{shiftConf.timeRange}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#a3b18a] bg-[#a3b18a]/10 px-2 py-1 rounded">
                              رزرو
                            </span>
                          </button>
                        );
                      }

                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-xl bg-[#1a1e17] border border-[#363d33]/40 text-right opacity-50 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs text-gray-400 block">{shiftConf.name}</span>
                            <span className="text-[10px] font-mono text-gray-600">{shiftConf.timeRange}</span>
                          </div>
                          <LockIcon className="w-3.5 h-3.5 text-gray-600" />
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
      <div className="hidden lg:block space-y-6">
        
        {/* Day Filter Pills for Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedDayFilter === 'all'
                ? 'bg-[#a3b18a] text-[#1e221b] font-bold shadow-md'
                : 'bg-[#242922] text-gray-400 hover:text-white border border-[#363d33]'
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
                    ? 'bg-[#a3b18a] text-[#1e221b] font-bold shadow-md'
                    : 'bg-[#242922] text-gray-300 hover:text-white border border-[#363d33]'
                }`}
              >
                <span>{day.name}</span>
                {hasOpen && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedDayFilter === day.key ? 'bg-[#1e221b]' : 'bg-[#a3b18a]'}`}></span>
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
                className="bg-[#242922] border border-[#363d33] rounded-2xl p-4 flex flex-col justify-between hover:border-[#a3b18a]/40 transition-colors shadow-xl"
              >
                {/* Day Header */}
                <div className="pb-3 border-b border-[#363d33] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#f1f5f9] text-base">
                      {day.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono uppercase block">
                      {day.enName}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      dayOpenCount > 0
                        ? 'bg-[#a3b18a]/20 text-[#a3b18a] border border-[#a3b18a]/40'
                        : 'bg-[#1e221b] text-gray-500 border border-[#363d33]'
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
                          className="group bg-[#1e221b] hover:bg-[#2b3327] border border-[#a3b18a]/40 hover:border-[#a3b18a] p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer shadow-md hover:shadow-[0_8px_20px_-3px_rgba(163,177,138,0.3)] hover:-translate-y-1 active:scale-95"
                        >
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-[#f1f5f9] group-hover:text-[#a3b18a] transition-colors flex items-center gap-1.5">
                              {renderShiftIcon(shiftConf.key, 'w-3.5 h-3.5 text-[#a3b18a] group-hover:scale-110 transition-transform')}
                              {shiftConf.name}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#a3b18a] animate-pulse"></span>
                          </div>

                          <div className="text-[11px] font-mono text-gray-400 mb-2">
                            {shiftConf.timeRange}
                          </div>

                          {/* Attractive Interactive Badge */}
                          <div className="bg-[#a3b18a]/15 group-hover:bg-[#a3b18a] group-hover:text-[#1e221b] text-[#a3b18a] border border-[#a3b18a]/50 py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:shadow-md">
                            <InstagramIcon className="w-3.5 h-3.5" />
                            <span>زمان باز / رزرو دایرکت</span>
                          </div>
                        </div>
                      );
                    }

                    // Booked / Closed Slot
                    return (
                      <div
                        key={slot.id}
                        className="bg-[#1b1f1a]/70 border border-[#363d33]/40 p-3 rounded-xl opacity-60 cursor-not-allowed select-none"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-gray-400 flex items-center gap-1.5">
                            {renderShiftIcon(shiftConf.key, 'w-3 h-3 text-gray-600')}
                            {shiftConf.name}
                          </span>
                          <LockIcon className="w-3.5 h-3.5 text-gray-600" />
                        </div>

                        <div className="text-[11px] font-mono text-gray-600 mb-2">
                          {shiftConf.timeRange}
                        </div>

                        <div className="bg-[#171a15] text-gray-500 border border-[#2b3127] py-1 px-2 rounded-lg text-[10px] text-center">
                          تکمیل شده / غیرفعال
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Day Footnote */}
                <div className="pt-2 border-t border-[#363d33]/50 text-[10px] text-gray-500 text-center">
                  زعفرانیه · محیط VIP
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Information Banner below Matrix */}
      <div className="mt-8 sm:mt-12 bg-gradient-to-r from-[#242922] via-[#2d3429] to-[#242922] border border-[#a3b18a]/30 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xl text-center sm:text-right">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1e221b] border border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center text-xl shrink-0">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#f1f5f9]">
              نیاز به سانس یا زمان اختصاصی دیگری دارید؟
            </h4>
            <p className="text-xs text-[#e2e8f0]/75 mt-1 leading-relaxed">
              در صورت تکمیل بودن سانس مورد نظرتان، شرایط و روز مد نظر خود را در دایرکت اینستاگرام ارسال فرمایید تا در لیست رزرو اضطراری یا VIP قرار گیرد.
            </p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/hodapezhman_skincare"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-6 py-3 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>استعلام در دایرکت اینستاگرام</span>
        </a>
      </div>

    </section>
  );
};
