import React, { useState } from 'react';
import { WeeklySlot, INSTAGRAM_URL, INSTAGRAM_DIRECT_URL, INSTAGRAM_HANDLE } from '../types';
import {
  XIcon,
  InstagramIcon,
  CalendarIcon,
  ClockIcon,
  CompassIcon,
  CopyIcon,
  MapPinIcon,
  ArrowLeftIcon
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md transition-all font-vazir">
      <div className="bg-white/95 backdrop-blur-2xl border border-[#7bc4bc]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative text-right space-y-6 animate-modal-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f9f8] border border-[#7bc4bc]/40 text-[#7bc4bc] flex items-center justify-center text-xl shrink-0 shadow-xs">
            <InstagramIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#1d5750] uppercase tracking-wider block font-semibold">
              INSTAGRAM DIRECT BOOKING · VIP
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mt-0.5">
              هماهنگی رزرو سانس {slot.dayName}
            </h3>
          </div>
        </div>

        {/* Selected Slot Badge Summary */}
        <div className="bg-[#f8faf9] border border-[#7bc4bc]/25 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#64748b] block text-[11px] mb-1">روز انتخابی:</span>
            <span className="text-[#0f172a] font-bold text-sm flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              {slot.dayName} ({slot.dayEn})
            </span>
          </div>
          <div>
            <span className="text-[#64748b] block text-[11px] mb-1">سانس و زمان:</span>
            <span className="text-[#134e48] font-mono font-bold text-xs flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              {slot.shiftName} · {slot.shiftTime}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-[#64748b] flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>لوکیشن: تهران، زعفرانیه (VIP)</span>
            </span>
            <span className="text-[#134e48] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#7bc4bc] animate-pulse"></span>
              ظرفیت باز و آماده هماهنگی
            </span>
          </div>
        </div>

        {/* Optional Service Selection */}
        <div>
          <label className="block text-xs text-[#334155] font-semibold mb-1.5">
            خدمت درخواستی خود را مشخص کنید:
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-[#f8faf9] border border-slate-200 text-[#0f172a] p-3 rounded-xl text-xs focus:outline-none focus:border-[#7bc4bc] focus:ring-2 focus:ring-[#7bc4bc]/20"
          >
            <option value="مشاوره تخصصی و آنالیز پوست">مشاوره تخصصی و آنالیز پوست</option>
            <option value="درمان تخصصی لک و هایپرپیگمانتاسیون">درمان تخصصی لک و هایپرپیگمانتاسیون</option>
            <option value="کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمیق">کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمیق</option>
            <option value="جوانسازی و کلاژن‌سازی بیولوژیک">جوانسازی و کلاژن‌سازی بیولوژیک</option>
            <option value="آکواپیل و پاکسازی عمقی هیدروفیشیال">آکواپیل و پاکسازی عمقی هیدروفیشیال</option>
            <option value="پکیج کنترل چربی و درمان آکنه">پکیج کنترل چربی و درمان آکنه</option>
            <option value="پکیج آبرسانی عمیق و شفاف‌سازی سد دفاعی">پکیج آبرسانی عمیق و شفاف‌سازی سد دفاعی</option>
          </select>
        </div>

        {/* Prepared Message Preview */}
        <div className="space-y-1.5">
          <label className="block text-xs text-[#64748b]">پیش‌نمایش پیام ارسالی به دایرکت:</label>
          <div className="p-3 bg-[#f8faf9] border border-slate-200 rounded-xl text-xs text-[#334155] leading-relaxed relative">
            <p>{prefilledMessage}</p>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <a
            href={INSTAGRAM_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCopyAndRedirect}
            className="w-full py-3.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-2xl transition-all duration-300 shadow-md shadow-[#7bc4bc]/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <InstagramIcon className="w-5 h-5" />
            <span>کپی پیام و باز کردن دایرکت اینستاگرام</span>
          </a>

          <div className="flex items-center justify-between text-xs text-[#64748b] px-1 pt-1">
            <button
              onClick={handleCopyHandle}
              className="hover:text-[#134e48] flex items-center gap-1 cursor-pointer font-medium"
            >
              <CopyIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>کپی آیدی پیج ({INSTAGRAM_HANDLE})</span>
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#134e48] flex items-center gap-1 font-medium"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>پروفایل اینستاگرام</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
