import React, { useState } from 'react';
import { WeeklySlot, INSTAGRAM_URL, INSTAGRAM_DIRECT_URL, INSTAGRAM_HANDLE } from '../types';
import {
  XIcon,
  InstagramIcon,
  CalendarIcon,
  ClockIcon,
  CompassIcon,
  CopyIcon
} from './Icons';

interface SlotBookingModalProps {
  slot: WeeklySlot;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  slot,
  onClose,
  onShowToast
}) => {
  const [selectedService, setSelectedService] = useState<string>('مشاوره تخصصی و تعیین پروتکل');
  const [copied, setCopied] = useState(false);

  const prefilledMessage = `سلام خانم هدی پژمان عزیز، وقت بخیر. درخواست رزرو نوبت برای ${slot.dayName} (${slot.shiftName} - ساعت ${slot.shiftTime}) جهت «${selectedService}» در کلینیک زعفرانیه را دارم.`;

  const handleCopyAndRedirect = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(prefilledMessage);
    }
    setCopied(true);
    onShowToast('متن درخواست کپی شد؛ در حال ورود به دایرکت اینستاگرام...');
  };

  const handleCopyHandle = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(INSTAGRAM_HANDLE);
    }
    onShowToast(`آیدی کپی شد: ${INSTAGRAM_HANDLE}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all font-vazir">
      <div className="bg-[#242922] border border-[#a3b18a]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-right space-y-6 animate-modal-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-[#1e221b] border border-[#363d33] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-[#363d33]">
          <div className="w-12 h-12 rounded-2xl bg-[#1e221b] border border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center text-xl shrink-0 shadow-inner">
            <InstagramIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#a3b18a] uppercase tracking-wider block">
              INSTAGRAM DIRECT BOOKING · VIP
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#f1f5f9] mt-0.5">
              هماهنگی رزرو سانس {slot.dayName}
            </h3>
          </div>
        </div>

        {/* Selected Slot Badge Summary */}
        <div className="bg-[#1e221b] border border-[#363d33] rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-400 block text-[11px] mb-1">روز انتخابی:</span>
            <span className="text-[#f1f5f9] font-bold text-sm flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#a3b18a]" />
              {slot.dayName} ({slot.dayEn})
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[11px] mb-1">سانس و زمان:</span>
            <span className="text-[#a3b18a] font-mono font-bold text-xs flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5" />
              {slot.shiftName} · {slot.shiftTime}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-[#363d33]/60 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">لوکیشن: تهران، زعفرانیه (VIP)</span>
            <span className="text-[#a3b18a] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#a3b18a] animate-pulse"></span>
              ظرفیت باز و آماده هماهنگی
            </span>
          </div>
        </div>

        {/* Optional Service Selection */}
        <div>
          <label className="block text-xs text-gray-300 font-medium mb-1.5">
            خدمت درخواستی خود را مشخص کنید:
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-[#1e221b] border border-[#363d33] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3b18a] cursor-pointer"
          >
            <option value="مشاوره تخصصی و تعیین پروتکل">مشاوره تخصصی و تعیین پروتکل اولیه</option>
            <option value="درمان تخصصی لک و هایپرپیگمانتاسیون">درمان تخصصی لک و هایپرپیگمانتاسیون</option>
            <option value="کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمیق">کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمیق</option>
            <option value="جوانسازی و کلاژن‌سازی بیولوژیک">جوانسازی و کلاژن‌سازی بیولوژیک</option>
            <option value="آکواپیل و پاکسازی عمقی هیدروفیشیال">آکواپیل و پاکسازی عمقی هیدروفیشیال</option>
            <option value="پکیج تخصصی کنترل چربی و درمان آکنه">پکیج تخصصی کنترل چربی و درمان آکنه</option>
            <option value="پکیج آبرسانی عمیق و شفاف‌سازی سد دفاعی">پکیج آبرسانی عمیق و شفاف‌سازی سد دفاعی</option>
          </select>
        </div>

        {/* Pre-formatted Message Box */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-300 font-medium">
              متن آماده جهت ارسال در دایرکت:
            </label>
            <span className="text-[10px] text-gray-500 font-mono">یک کلیک برای کپی</span>
          </div>
          <div className="bg-[#1e221b] border border-[#363d33] rounded-xl p-3.5 text-xs text-[#e2e8f0]/90 leading-relaxed font-sans relative">
            <p>{prefilledMessage}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={INSTAGRAM_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCopyAndRedirect}
            className="w-full min-h-[48px] py-3.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <InstagramIcon className="w-5 h-5" />
            <span>
              {copied ? 'متن کپی شد · ورود به دایرکت اینستاگرام' : 'کپی پیام و رزرو در دایرکت اینستاگرام'}
            </span>
          </a>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 bg-[#1e221b] hover:bg-[#363d33] border border-[#363d33] text-gray-300 hover:text-white rounded-xl text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CompassIcon className="w-3.5 h-3.5 text-[#a3b18a]" />
              <span>مشاهده پیج</span>
            </a>

            <button
              onClick={handleCopyHandle}
              className="py-2.5 bg-[#1e221b] hover:bg-[#363d33] border border-[#363d33] text-gray-300 hover:text-white rounded-xl text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CopyIcon className="w-3.5 h-3.5 text-[#a3b18a]" />
              <span className="font-mono text-[11px]">{INSTAGRAM_HANDLE}</span>
            </button>
          </div>
        </div>

        {/* Note */}
        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          نوبت‌ها پس از ارسال پیام در دایرکت و بررسی پرونده توسط خانم هدی پژمان نهایی و ثبت می‌گردند.
        </p>

      </div>
    </div>
  );
};
