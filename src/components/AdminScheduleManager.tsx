import React, { useState } from 'react';
import { WeeklySlot, WEEK_DAYS, SHIFTS_CONFIG } from '../types';

interface AdminScheduleManagerProps {
  schedule: WeeklySlot[];
  onToggleSlot: (slotId: string) => void;
  onResetWeek: () => void;
  onCloseFriday: () => void;
  onUpdateSlotNote: (slotId: string, note: string) => void;
  onShowToast: (msg: string) => void;
}

export const AdminScheduleManager: React.FC<AdminScheduleManagerProps> = ({
  schedule,
  onToggleSlot,
  onResetWeek,
  onCloseFriday,
  onUpdateSlotNote,
  onShowToast,
}) => {
  const [editingNoteSlotId, setEditingNoteSlotId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  const totalSlots = schedule.length;
  const availableCount = schedule.filter(s => s.status === 'available').length;
  const bookedCount = schedule.filter(s => s.status === 'booked').length;
  const bookedPercentage = Math.round((bookedCount / totalSlots) * 100);

  const startEditNote = (slot: WeeklySlot) => {
    setEditingNoteSlotId(slot.id);
    setTempNote(slot.note || '');
  };

  const saveNote = (slotId: string) => {
    onUpdateSlotNote(slotId, tempNote);
    setEditingNoteSlotId(null);
    onShowToast('یادداشت سانس به‌روزرسانی شد.');
  };

  return (
    <div className="space-y-8 font-vazir text-right">
      
      {/* Top Header & Quick Action Buttons */}
      <div className="bg-[#242922] p-6 rounded-2xl border border-[#363d33] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#a3b18a] uppercase tracking-wider mb-1">
            <i className="fa-solid fa-calendar-check"></i>
            <span>SCHEDULE MATRIX CONTROL PANEL</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#f1f5f9]">
            مدیریت زمان‌ها و سانس‌های هفتگی
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            با یک کلیک روی هر سانس، وضعیت آن بین <strong className="text-[#a3b18a]">«باز / قابل رزرو»</strong> و <strong className="text-red-400">«تکمیل شده / غیرفعال»</strong> تغییر می‌یابد و فوراً در سایت عمومی اعمال می‌شود.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onResetWeek}
            className="px-4 py-2.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrows-rotate text-xs"></i>
            <span>بازنشانی کل هفته (همه سانس‌ها باز)</span>
          </button>

          <button
            onClick={onCloseFriday}
            className="px-3.5 py-2.5 bg-[#1e221b] hover:bg-[#363d33] text-gray-300 hover:text-white border border-[#363d33] text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-ban text-red-400 text-xs"></i>
            <span>بستن جمعه‌ها (تعطیل)</span>
          </button>
        </div>
      </div>

      {/* Live Metrics Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#242922] p-4 rounded-xl border border-[#363d33]">
          <span className="text-gray-400 block text-[11px] mb-1">کل سانس‌های هفتگی:</span>
          <span className="text-xl font-bold text-[#f1f5f9] font-mono">{totalSlots} سانس</span>
          <span className="text-[10px] text-gray-500 block mt-1">۷ روز × ۳ شیفت</span>
        </div>

        <div className="bg-[#242922] p-4 rounded-xl border border-[#363d33]">
          <span className="text-gray-400 block text-[11px] mb-1">سانس‌های باز و در دسترس:</span>
          <span className="text-xl font-bold text-[#a3b18a] font-mono">{availableCount} سانس</span>
          <span className="text-[10px] text-[#a3b18a] block mt-1">آماده دریافت مراجع</span>
        </div>

        <div className="bg-[#242922] p-4 rounded-xl border border-[#363d33]">
          <span className="text-gray-400 block text-[11px] mb-1">سانس‌های پر شده / مسدود:</span>
          <span className="text-xl font-bold text-amber-400 font-mono">{bookedCount} سانس</span>
          <span className="text-[10px] text-gray-500 block mt-1">رزرو قطعی یا بسته</span>
        </div>

        <div className="bg-[#242922] p-4 rounded-xl border border-[#363d33]">
          <span className="text-gray-400 block text-[11px] mb-1">درصد تکمیل ظرفیت:</span>
          <span className="text-xl font-bold text-[#f1f5f9] font-mono">{bookedPercentage}%</span>
          <div className="w-full bg-[#1e221b] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#a3b18a] h-full transition-all duration-500"
              style={{ width: `${bookedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Visual Interactive Matrix (7 Days Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {WEEK_DAYS.map((day) => {
          const daySlots = schedule.filter(s => s.dayKey === day.key);
          const dayOpen = daySlots.filter(s => s.status === 'available').length;

          return (
            <div
              key={day.key}
              className="bg-[#242922] border border-[#363d33] rounded-2xl p-4 flex flex-col justify-between shadow-lg"
            >
              {/* Day Header */}
              <div className="pb-3 border-b border-[#363d33] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#f1f5f9] text-base">{day.name}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{day.enName}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    dayOpen > 0 ? 'bg-[#a3b18a]/20 text-[#a3b18a]' : 'bg-[#1e221b] text-gray-500'
                  }`}
                >
                  {dayOpen} باز
                </span>
              </div>

              {/* 3 Shifts */}
              <div className="py-3 space-y-3 flex-1">
                {SHIFTS_CONFIG.map((shiftConf) => {
                  const slot = daySlots.find(s => s.shiftKey === shiftConf.key);
                  if (!slot) return null;

                  const isAvail = slot.status === 'available';

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        isAvail
                          ? 'bg-[#1e241c] border-[#a3b18a]/50 shadow-sm'
                          : 'bg-[#1a1e17] border-[#363d33]/50 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#f1f5f9] flex items-center gap-1.5">
                          <i className={`fa-solid ${shiftConf.icon} text-[10px] ${isAvail ? 'text-[#a3b18a]' : 'text-gray-500'}`}></i>
                          {shiftConf.name}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {shiftConf.timeRange}
                        </span>
                      </div>

                      {/* Status Toggle Button with Quick Transformation Animation */}
                      <button
                        onClick={() => onToggleSlot(slot.id)}
                        className={`w-full mt-2 py-2 px-2.5 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.03] active:scale-95 ${
                          isAvail
                            ? 'bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] shadow-md shadow-[#a3b18a]/20'
                            : 'bg-[#2a2f26] hover:bg-[#363d33] text-gray-400 border border-[#363d33]'
                        }`}
                        title="برای تغییر وضعیت کلیک کنید"
                      >
                        {isAvail ? (
                          <>
                            <i className="fa-solid fa-circle-check text-xs"></i>
                            <span>باز / قابل رزرو</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-lock text-xs text-red-400"></i>
                            <span>تکمیل / مسدود</span>
                          </>
                        )}
                      </button>

                      {/* Optional Slot Note */}
                      <div className="mt-2 pt-2 border-t border-[#363d33]/50 flex items-center justify-between text-[10px]">
                        {editingNoteSlotId === slot.id ? (
                          <div className="flex items-center gap-1 w-full">
                            <input
                              type="text"
                              autoFocus
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="یادداشت..."
                              className="w-full bg-[#171a15] border border-[#a3b18a] rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none"
                              onKeyDown={(e) => e.key === 'Enter' && saveNote(slot.id)}
                            />
                            <button
                              onClick={() => saveNote(slot.id)}
                              className="text-[#a3b18a] px-1 hover:text-white"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button
                              onClick={() => setEditingNoteSlotId(null)}
                              className="text-gray-500 px-1 hover:text-white"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-gray-400 truncate max-w-[110px]" title={slot.note}>
                              {slot.note || (isAvail ? 'ظرفیت باز' : 'تکمیل')}
                            </span>
                            <button
                              onClick={() => startEditNote(slot)}
                              className="text-gray-500 hover:text-[#a3b18a] transition-colors p-1"
                              title="ویرایش برچسب یا یادداشت این سانس"
                            >
                              <i className="fa-regular fa-pen-to-square text-[10px]"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day Bottom Info */}
              <div className="pt-2 border-t border-[#363d33]/50 flex justify-between items-center text-[10px] text-gray-500">
                <span>۳ سانس</span>
                <span className="font-mono">{dayOpen}/3 باز</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Note Box */}
      <div className="p-4 rounded-xl bg-[#1e221b] border border-[#363d33] text-xs text-gray-400 leading-relaxed flex items-start gap-3">
        <i className="fa-solid fa-circle-info text-[#a3b18a] text-sm mt-0.5 shrink-0"></i>
        <div>
          <span className="text-[#a3b18a] font-bold block mb-1">
            راهنمای همگام‌سازی خودکار با وب‌سایت عمومی:
          </span>
          هر تغییری که در این جدول اعمال کنید بلافاصله در حافظه محلی ذخیره شده و جدول صفحه اصلی وب‌سایت برای مراجعین به‌صورت آنی به‌روزرسانی می‌شود. با کلیک بر روی دکمه «خروج و بازگشت به سایت» در بالا، می‌توانید جدول عمومی را مشاهده فرمایید.
        </div>
      </div>

    </div>
  );
};
