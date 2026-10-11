import React, { useState } from 'react';
import { WeeklySlot, WEEK_DAYS, SHIFTS_CONFIG, DayKey } from '../types';
import {
  CalendarCheckIcon,
  RotateCcwIcon,
  LockIcon,
  CircleCheckIcon,
  CheckIcon,
  XIcon,
  EditIcon,
  CircleInfoIcon,
  SunIcon,
  CloudSunIcon,
  MoonIcon
} from './Icons';

interface AdminScheduleManagerProps {
  schedule: WeeklySlot[];
  onToggleSlot: (slotId: string) => void;
  onUpdateSlotNote: (slotId: string, note: string) => void;
  onResetWeek: () => void;
  onCloseFriday: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminScheduleManager: React.FC<AdminScheduleManagerProps> = ({
  schedule,
  onToggleSlot,
  onUpdateSlotNote,
  onResetWeek,
  onCloseFriday,
  onShowToast
}) => {
  const [editingNoteSlotId, setEditingNoteSlotId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  const totalSlots = schedule.length;
  const availableCount = schedule.filter(s => s.status === 'available').length;
  const bookedCount = totalSlots - availableCount;

  const startEditNote = (slot: WeeklySlot) => {
    setEditingNoteSlotId(slot.id);
    setTempNote(slot.note || '');
  };

  const saveNote = (slotId: string) => {
    onUpdateSlotNote(slotId, tempNote);
    setEditingNoteSlotId(null);
    onShowToast('یادداشت سانس به‌روزرسانی شد.');
  };

  const getShiftIcon = (key: string, isAvail: boolean) => {
    const colorClass = isAvail ? 'text-[#7bc4bc]' : 'text-gray-500';
    if (key === 'morning') return <SunIcon className={`w-3.5 h-3.5 ${colorClass}`} />;
    if (key === 'afternoon') return <CloudSunIcon className={`w-3.5 h-3.5 ${colorClass}`} />;
    return <MoonIcon className={`w-3.5 h-3.5 ${colorClass}`} />;
  };

  return (
    <div className="space-y-8 font-vazir text-right">
      
      {/* Top Header & Quick Action Buttons */}
      <div className="bg-[#242922] p-6 rounded-2xl border border-[#363d33] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7bc4bc] uppercase tracking-wider mb-1">
            <CalendarCheckIcon className="w-4 h-4 text-[#7bc4bc]" />
            <span>SCHEDULE MATRIX CONTROL PANEL</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#f1f5f9]">
            مدیریت زمان‌ها و سانس‌های هفتگی
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            با یک کلیک روی هر سانس، وضعیت آن بین <strong className="text-[#7bc4bc]">«باز / قابل رزرو»</strong> و <strong className="text-red-400">«تکمیل شده / غیرفعال»</strong> تغییر می‌یابد و فوراً در سایت عمومی اعمال می‌شود.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onResetWeek}
            className="px-4 py-2.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <RotateCcwIcon className="w-3.5 h-3.5 text-white" />
            <span>بازنشانی کل هفته (همه سانس‌ها باز)</span>
          </button>

          <button
            onClick={onCloseFriday}
            className="px-3.5 py-2.5 bg-[#1e221b] hover:bg-[#363d33] text-gray-300 hover:text-white border border-[#363d33] text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LockIcon className="w-3.5 h-3.5 text-red-400" />
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
          <span className="text-xl font-bold text-[#7bc4bc] font-mono">{availableCount} سانس</span>
          <span className="text-[10px] text-[#7bc4bc] block mt-1">آماده دریافت مراجع</span>
        </div>

        <div className="bg-[#242922] p-4 rounded-xl border border-[#363d33]">
          <span className="text-gray-400 block text-[11px] mb-1">سانس‌های تکمیل‌شده:</span>
          <span className="text-xl font-bold text-red-400 font-mono">{bookedCount} سانس</span>
          <span className="text-[10px] text-gray-500 block mt-1">رزرو یا غیرفعال</span>
        </div>

        <div className="bg-[#242922] p-4 rounded-xl border border-[#363d33]">
          <span className="text-gray-400 block text-[11px] mb-1">نرخ ظرفیت تکمیل:</span>
          <span className="text-xl font-bold text-amber-300 font-mono">
            {totalSlots > 0 ? Math.round((bookedCount / totalSlots) * 100) : 0}٪
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">اشغال هفتگی کلینیک</span>
        </div>
      </div>

      {/* 7 Days Schedule Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {WEEK_DAYS.map((day) => {
          const daySlots = schedule.filter(s => s.dayKey === day.key);
          const dayOpen = daySlots.filter(s => s.status === 'available').length;

          return (
            <div
              key={day.key}
              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                day.key === 'fri'
                  ? 'bg-[#1e221b]/80 border-[#363d33]'
                  : 'bg-[#242922] border-[#363d33]'
              }`}
            >
              {/* Day Header */}
              <div className="border-b border-[#363d33]/60 pb-3 mb-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#f1f5f9]">{day.name}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    dayOpen > 0
                      ? 'bg-[#7bc4bc]/20 text-[#7bc4bc] border border-[#7bc4bc]/30'
                      : 'bg-red-950/40 text-red-400 border border-red-900/40'
                  }`}>
                    {dayOpen > 0 ? `${dayOpen} باز` : 'تکمیل'}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{day.enName}</span>
              </div>

              {/* 3 Shifts per day */}
              <div className="space-y-3 flex-1 mb-3">
                {SHIFTS_CONFIG.map((shiftConf) => {
                  const slot = daySlots.find(s => s.shiftKey === shiftConf.key);
                  if (!slot) return null;

                  const isAvail = slot.status === 'available';

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        isAvail
                          ? 'bg-[#1e241c] border-[#7bc4bc]/50 shadow-sm'
                          : 'bg-[#1a1e17] border-[#363d33]/50 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#f1f5f9] flex items-center gap-1.5">
                          {getShiftIcon(shiftConf.key, isAvail)}
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
                            ? 'bg-[#7bc4bc] hover:bg-[#68b5ac] text-white shadow-md shadow-[#7bc4bc]/20'
                            : 'bg-[#2a2f26] hover:bg-[#363d33] text-gray-400 border border-[#363d33]'
                        }`}
                        title="برای تغییر وضعیت کلیک کنید"
                      >
                        {isAvail ? (
                          <>
                            <CircleCheckIcon className="w-3.5 h-3.5 text-white" />
                            <span>باز / قابل رزرو</span>
                          </>
                        ) : (
                          <>
                            <LockIcon className="w-3.5 h-3.5 text-red-400" />
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
                              className="w-full bg-[#171a15] border border-[#7bc4bc] rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none"
                              onKeyDown={(e) => e.key === 'Enter' && saveNote(slot.id)}
                            />
                            <button
                              onClick={() => saveNote(slot.id)}
                              className="text-[#7bc4bc] px-1 hover:text-white"
                            >
                              <CheckIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingNoteSlotId(null)}
                              className="text-gray-500 px-1 hover:text-white"
                            >
                              <XIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-gray-400 truncate max-w-[110px]" title={slot.note}>
                              {slot.note || (isAvail ? 'ظرفیت باز' : 'تکمیل')}
                            </span>
                            <button
                              onClick={() => startEditNote(slot)}
                              className="text-gray-500 hover:text-[#7bc4bc] transition-colors p-1"
                              title="ویرایش برچسب یا یادداشت این سانس"
                            >
                              <EditIcon className="w-3 h-3" />
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
        <CircleInfoIcon className="w-4 h-4 text-[#7bc4bc] shrink-0 mt-0.5" />
        <div>
          <span className="text-[#7bc4bc] font-bold block mb-1">
            راهنمای همگام‌سازی خودکار با وب‌سایت عمومی:
          </span>
          هر تغییری که در این جدول اعمال کنید بلافاصله در حافظه محلی ذخیره شده و جدول صفحه اصلی وب‌سایت برای مراجعین به‌صورت آنی به‌روزرسانی می‌شود. با کلیک بر روی دکمه «خروج و بازگشت به سایت» در بالا، می‌توانید جدول عمومی را مشاهده فرمایید.
        </div>
      </div>

    </div>
  );
};
