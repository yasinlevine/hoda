import React, { useState, useEffect } from 'react';

// Image assets
import heroModelImg from './assets/images/hero_calm_model_1791131706401.jpg';
import creamSwatchesImg from './assets/images/cream_swatches_1791131717732.jpg';
import creamRibbonTubeImg from './assets/images/cream_ribbon_tube_1791131730751.jpg';
import apothecaryPedestalImg from './assets/images/apothecary_pedestal_1791131741408.jpg';
import clinicInteriorImg from './assets/images/clinic_interior_sage_1791130976626.jpg';

// Modular types and data
import {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  ServiceItem,
  WeeklySlot,
  TestimonialItem,
  TherapistBio,
  DEFAULT_BIO,
  DEFAULT_SERVICES,
  DEFAULT_WEEKLY_SCHEDULE,
  DEFAULT_TESTIMONIALS
} from './types';

// Components
import { WeeklyScheduleSection } from './components/WeeklyScheduleSection';
import { AdminScheduleManager } from './components/AdminScheduleManager';
import { SlotBookingModal } from './components/SlotBookingModal';
import { EditorialHeroSection } from './components/EditorialHeroSection';
import { ClinicalDevicesSection } from './components/ClinicalDevicesSection';
import { ServiceCard } from './components/ServiceCard';

export default function App() {
  // ---------------------------------------------------------------------------
  // ROUTING & ADMIN AUTH STATE
  // ---------------------------------------------------------------------------
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('orya_admin_auth') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('orya_admin_pin') || '1234';
  });
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Hash router listener (#admin or #manager)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);

    // Initialize AOS (Animate on Scroll)
    const initAos = () => {
      if (typeof (window as any).AOS !== 'undefined') {
        (window as any).AOS.init({
          duration: 700,
          easing: 'ease-out',
          once: true,
          offset: 50,
        });
      }
    };
    initAos();
    const timer = setTimeout(initAos, 500);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timer);
    };
  }, []);

  const isAdminRoute = currentHash === '#admin' || currentHash === '#manager';

  // Logout & Exit Admin route
  const handleExitAdmin = () => {
    sessionStorage.removeItem('orya_admin_auth');
    setIsAdminAuthenticated(false);
    setEnteredPin('');
    setPinError(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPasscode.trim()) {
      sessionStorage.setItem('orya_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setEnteredPin('');
      setPinError(null);
      showToast('با موفقیت وارد پنل مدیریت شدید.');
    } else {
      setPinError('رمز عبور وارد شده نادرست است. (رمز پیش‌فرض: ۱۲۳۴)');
    }
  };

  // CHANGE PIN STATE
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPin !== adminPasscode) {
      showToast('رمز عبور فعلی نادرست است.');
      return;
    }
    if (newPin.length < 4) {
      showToast('رمز عبور جدید باید حداقل ۴ رقم باشد.');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('رمز عبور جدید با تکرار آن مطابقت ندارد.');
      return;
    }
    localStorage.setItem('orya_admin_pin', newPin);
    setAdminPasscode(newPin);
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    showToast('رمز عبور پنل مدیریت با موفقیت تغییر یافت.');
  };

  // ---------------------------------------------------------------------------
  // PORTFOLIO & SCHEDULE DATA STATES (WITH LOCALSTORAGE)
  // ---------------------------------------------------------------------------
  const [bio, setBio] = useState<TherapistBio>(() => {
    const saved = localStorage.getItem('hoda_bio_v3');
    return saved ? JSON.parse(saved) : DEFAULT_BIO;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('orya_services');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
  });

  // Weekly Schedule Grid State (Replaces Before & After completely)
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySlot[]>(() => {
    const saved = localStorage.getItem('hoda_weekly_schedule_v1');
    return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_SCHEDULE;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('orya_testimonials');
    return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hoda_bio_v3', JSON.stringify(bio));
  }, [bio]);

  useEffect(() => {
    localStorage.setItem('orya_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('hoda_weekly_schedule_v1', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  useEffect(() => {
    localStorage.setItem('orya_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Category filter
  const [serviceFilter, setServiceFilter] = useState<'all' | 'treatment' | 'package'>('all');

  // Hero interactive thumbnails
  const [activeThumbnail, setActiveThumbnail] = useState<number>(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);

  // Detail modals
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<WeeklySlot | null>(null);

  // Instagram Concierge modal
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState<boolean>(false);
  const [inquiredItemTitle, setInquiredItemTitle] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Admin Dashboard Active Tab
  const [adminTab, setAdminTab] = useState<'services' | 'schedule' | 'reviews' | 'bio' | 'security'>('services');

  // Editing items in Admin
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingReview, setEditingReview] = useState<TestimonialItem | null>(null);
  const [bioForm, setBioForm] = useState<TherapistBio>(bio);

  // Open general Instagram concierge
  const handleOpenInstagramBooking = (title?: string) => {
    setInquiredItemTitle(title || '');
    setIsInstagramModalOpen(true);
  };

  // Reset to default mock data
  const handleResetToDefaults = () => {
    if (window.confirm('آیا از بازنشانی داده‌های پیش‌فرض پورتفولیو و سانس‌های هفتگی اطمینان دارید؟')) {
      setBio(DEFAULT_BIO);
      setBioForm(DEFAULT_BIO);
      setServices(DEFAULT_SERVICES);
      setWeeklySchedule(DEFAULT_WEEKLY_SCHEDULE);
      setTestimonials(DEFAULT_TESTIMONIALS);
      localStorage.removeItem('hoda_bio_v3');
      localStorage.removeItem('orya_services');
      localStorage.removeItem('hoda_weekly_schedule_v1');
      localStorage.removeItem('orya_testimonials');
      showToast('داده‌های پیش‌فرض هدی پژمان با موفقیت بازنشانی شدند.');
    }
  };

  // Weekly Schedule Admin Actions
  const handleToggleSlotStatus = (slotId: string) => {
    setWeeklySchedule(prev =>
      prev.map(slot => {
        if (slot.id === slotId) {
          const nextStatus = slot.status === 'available' ? 'booked' : 'available';
          return {
            ...slot,
            status: nextStatus,
            note: nextStatus === 'available' ? 'قابل رزرو' : 'تکمیل ظرفیت'
          };
        }
        return slot;
      })
    );
    showToast('وضعیت سانس با موفقیت تغییر یافت.');
  };

  const handleResetWeekSchedule = () => {
    if (window.confirm('آیا مایلید تمام ۲۱ سانس هفته به حالت «باز / قابل رزرو» بازنشانی شوند؟')) {
      setWeeklySchedule(prev =>
        prev.map(slot => ({
          ...slot,
          status: 'available',
          note: 'قابل رزرو'
        }))
      );
      showToast('تمامی سانس‌های هفته باز و آماده رزرو شدند.');
    }
  };

  const handleCloseFriday = () => {
    setWeeklySchedule(prev =>
      prev.map(slot => {
        if (slot.dayKey === 'fri') {
          return {
            ...slot,
            status: 'booked',
            note: 'تعطیل / تکمیل'
          };
        }
        return slot;
      })
    );
    showToast('سانس‌های روز جمعه با موفقیت به حالت تعطیل/مسدود درآمدند.');
  };

  const handleUpdateSlotNote = (slotId: string, note: string) => {
    setWeeklySchedule(prev =>
      prev.map(slot => slot.id === slotId ? { ...slot, note } : slot)
    );
  };

  // Service CRUD
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (editingService.id) {
      setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
      showToast(`خدمت «${editingService.title}» ویرایش شد.`);
    } else {
      const newService: ServiceItem = {
        ...editingService,
        id: 'service-' + Date.now()
      };
      setServices(prev => [newService, ...prev]);
      showToast(`خدمت جدید «${newService.title}» اضافه شد.`);
    }
    setEditingService(null);
  };

  const handleDeleteService = (id: string, title: string) => {
    if (window.confirm(`آیا خدمت «${title}» حذف شود؟`)) {
      setServices(prev => prev.filter(s => s.id !== id));
      showToast(`خدمت «${title}» حذف گردید.`);
    }
  };

  // Review CRUD
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    if (editingReview.id) {
      setTestimonials(prev => prev.map(r => r.id === editingReview.id ? editingReview : r));
      showToast(`نظر مراجع ویرایش شد.`);
    } else {
      const newReview: TestimonialItem = {
        ...editingReview,
        id: 'review-' + Date.now()
      };
      setTestimonials(prev => [newReview, ...prev]);
      showToast(`نظر جدید اضافه شد.`);
    }
    setEditingReview(null);
  };

  const handleDeleteReview = (id: string, name: string) => {
    if (window.confirm(`آیا نظر مراجع «${name}» حذف شود؟`)) {
      setTestimonials(prev => prev.filter(r => r.id !== id));
      showToast(`نظر حذف گردید.`);
    }
  };

  // Bio Update
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setBio(bioForm);
    showToast('مشخصات بیوتی تراپیست و مدارک با موفقیت به‌روزرسانی شد.');
  };

  // Filtered services
  const filteredServices = serviceFilter === 'all'
    ? services
    : services.filter(s => s.category === serviceFilter);

  // Hero bottom thumbnails
  const heroThumbnails = [
    {
      id: 0,
      title: 'بافت‌های کرمی فیتوتراپی',
      desc: 'پالت بافت‌های آبرسان گیاهی و پاکسازی',
      img: creamSwatchesImg
    },
    {
      id: 1,
      title: 'آرامش سد دفاعی پوست',
      desc: 'تنفس عمیق و کلاژن‌سازی بیولوژیک',
      img: heroModelImg
    },
    {
      id: 2,
      title: 'ریبون چربی‌های لاملار',
      desc: 'امولسیون بازسازی سد دفاعی',
      img: creamRibbonTubeImg
    },
    {
      id: 3,
      title: 'فضای استریل و اتاق VIP کلینیک',
      desc: 'محیط ایزوله و آرامش‌بخش در زعفرانیه',
      img: clinicInteriorImg
    },
    {
      id: 4,
      title: 'لابراتوار درماتولوژی اوریا',
      desc: 'عصاره‌های خالص در شیشه‌های دارویی',
      img: apothecaryPedestalImg
    }
  ];

  // ===========================================================================
  // DEDICATED ADMIN ROUTE INTERCEPTION (#admin or #manager)
  // ===========================================================================
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      // 1. MINIMAL FULL-SCREEN PASSWORD PROMPT
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-[#1e221b] text-[#f1f5f9] flex items-center justify-center p-6 relative font-vazir selection:bg-[#a3b18a]/30"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#384334]/20 blur-3xl"></div>
          </div>

          <div className="bg-[#242922] border border-[#363d33] rounded-3xl max-w-md w-full p-8 sm:p-10 shadow-2xl relative z-10 text-center space-y-6 animate-modal-in">
            <div className="w-16 h-16 rounded-full bg-[#1e221b] border-2 border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-8 h-8 text-[#a3b18a] animate-emblem-spin" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="10" />
                <path d="M50 15 C45 30, 45 35, 50 40 C55 35, 55 30, 50 15 Z" />
                <path d="M50 85 C45 70, 45 65, 50 60 C55 65, 55 70, 50 85 Z" />
                <path d="M15 50 C30 45, 35 45, 40 50 C35 55, 30 55, 15 50 Z" />
                <path d="M85 50 C70 45, 65 45, 60 50 C65 55, 70 55, 85 50 Z" />
                <path d="M25 25 C38 35, 40 40, 43 43 C40 40, 35 38, 25 25 Z" />
                <path d="M75 75 C62 65, 60 60, 57 57 C60 60, 65 62, 75 75 Z" />
                <path d="M25 75 C38 65, 40 60, 43 57 C40 60, 35 62, 25 75 Z" />
                <path d="M75 25 C62 35, 60 40, 57 43 C60 40, 65 38, 75 25 Z" />
              </svg>
            </div>

            <div>
              <span className="text-[11px] font-mono text-[#a3b18a] uppercase tracking-wider">
                PORTFOLIO CMS · ADMIN PORTAL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] mt-1">
                ورود به پنل مدیریت هدی پژمان
              </h2>
              <p className="text-xs text-[#e2e8f0]/70 mt-1.5 leading-relaxed">
                لطفاً رمز عبور ۴ رقمی مدیریت را وارد نمایید.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  maxLength={12}
                  placeholder="رمز عبور (پیش‌فرض: 1234)"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    if (pinError) setPinError(null);
                  }}
                  className="w-full bg-[#1e221b] border border-[#363d33] rounded-xl px-4 py-3 text-center text-lg tracking-widest text-[#f1f5f9] font-mono focus:outline-none focus:border-[#a3b18a] transition-all"
                />

                {pinError && (
                  <p className="text-xs text-red-400 mt-2 animate-bounce">
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <i className="fa-solid fa-lock text-xs"></i>
                <span>ورود به پنل مدیریت</span>
              </button>
            </form>

            <div className="pt-2 border-t border-[#363d33]/60 flex items-center justify-between text-xs">
              <span className="text-gray-500 text-[11px]">رمز پیش‌فرض: ۱۲۳۴</span>
              <button
                onClick={handleExitAdmin}
                className="text-[#a3b18a] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>بازگشت به وب‌سایت</span>
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
              </button>
            </div>

          </div>
        </div>
      );
    }

    // 2. DEDICATED FULL-SCREEN ADMIN DASHBOARD VIEW
    return (
      <div dir="rtl" className="min-h-screen bg-[#1e221b] text-[#f1f5f9] font-vazir flex flex-col selection:bg-[#a3b18a]/30">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2d322b] border border-[#a3b18a]/60 text-[#f1f5f9] px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs animate-modal-in">
            <i className="fa-solid fa-check text-[#a3b18a]"></i>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#1e221b]/95 backdrop-blur-md border-b border-[#363d33] px-6 sm:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#242922] border border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center text-xs">
              <i className="fa-solid fa-sliders"></i>
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#f1f5f9]">
                پنل مدیریت پورتفولیو · {bio.name}
              </h2>
              <span className="text-[10px] text-[#a3b18a] font-mono">
                ADMIN CONSOLE ({currentHash})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-rotate-left text-[10px]"></i>
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <button
              onClick={handleExitAdmin}
              className="flex items-center gap-2 px-4 py-2 bg-[#242922] hover:bg-[#363d33] text-gray-300 hover:text-white border border-[#363d33] rounded-lg text-xs transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket text-xs text-[#a3b18a]"></i>
              <span>خروج و بازگشت به سایت</span>
            </button>
          </div>
        </header>

        {/* Admin Tabs */}
        <div className="bg-[#242922] border-b border-[#363d33] px-6 sm:px-12 flex overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'services', label: `منوی خدمات و پکیج‌ها (${services.length})` },
            { id: 'schedule', label: `برنامه و سانس‌های هفتگی (${weeklySchedule.filter(s => s.status === 'available').length} باز)` },
            { id: 'reviews', label: `نظرات مراجعین (${testimonials.length})` },
            { id: 'bio', label: 'اطلاعات متخصص و مدارک' },
            { id: 'security', label: 'تنظیمات رمز عبور' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setAdminTab(tab.id as any);
                setEditingService(null);
                setEditingReview(null);
              }}
              className={`py-3.5 px-5 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                adminTab === tab.id
                  ? 'border-[#a3b18a] text-[#a3b18a]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Admin Main Body */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-12">
          
          {/* TAB 1: SERVICES & PACKAGES */}
          {adminTab === 'services' && (
            <div className="space-y-6">
              {editingService ? (
                <form onSubmit={handleSaveService} className="bg-[#242922] p-6 sm:p-8 rounded-2xl border border-[#363d33] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#363d33]">
                    <h3 className="text-base font-bold text-[#f1f5f9]">
                      {editingService.id ? 'ویرایش خدمت / پکیج' : 'افزودن خدمت جدید'}
                    </h3>
                    <button type="button" onClick={() => setEditingService(null)} className="text-xs text-gray-400 hover:text-white">
                      انصراف
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-300 mb-1">عنوان خدمت: *</label>
                      <input
                        type="text"
                        required
                        value={editingService.title}
                        onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">دسته‌بندی: *</label>
                      <select
                        value={editingService.category}
                        onChange={e => setEditingService({
                          ...editingService,
                          category: e.target.value as any,
                          categoryLabel: e.target.value === 'treatment' ? 'درمان تخصصی' : 'پکیج تخصصی'
                        })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      >
                        <option value="treatment">درمان تخصصی (Treatment)</option>
                        <option value="package">پکیج تخصصی (Package)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">مدت زمان جلسه: *</label>
                      <input
                        type="text"
                        required
                        value={editingService.duration}
                        onChange={e => setEditingService({ ...editingService, duration: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">زیرعنوان لاتین:</label>
                      <input
                        type="text"
                        value={editingService.subtitle}
                        onChange={e => setEditingService({ ...editingService, subtitle: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>
                  </div>

                  <div className="text-xs space-y-3">
                    <div>
                      <label className="block text-gray-300 mb-1">تکنیک و روش اجرا: *</label>
                      <textarea
                        rows={2}
                        required
                        value={editingService.technique}
                        onChange={e => setEditingService({ ...editingService, technique: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded p-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">مزایا و فواید: *</label>
                      <textarea
                        rows={2}
                        required
                        value={editingService.benefits}
                        onChange={e => setEditingService({ ...editingService, benefits: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded p-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">مواد مؤثره کلیدی (با کاما جدا کنید):</label>
                      <input
                        type="text"
                        value={editingService.keyActives.join(', ')}
                        onChange={e => setEditingService({
                          ...editingService,
                          keyActives: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded text-xs text-gray-400 hover:text-white">
                      انصراف
                    </button>
                    <button type="submit" className="px-6 py-2 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded transition-colors cursor-pointer">
                      ذخیره خدمت
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-[#f1f5f9]">لیست خدمات و پکیج‌ها</h3>
                      <p className="text-xs text-gray-400">مدیریت درمان‌ها، تکنیک‌ها و مواد مؤثره</p>
                    </div>
                    <button
                      onClick={() => setEditingService({
                        id: '',
                        category: 'treatment',
                        categoryLabel: 'درمان تخصصی',
                        title: '',
                        subtitle: '',
                        technique: '',
                        benefits: '',
                        duration: '۶۰ دقیقه',
                        keyActives: [],
                        image: creamRibbonTubeImg
                      })}
                      className="px-4 py-2 bg-[#a3b18a] text-[#1e221b] font-bold text-xs rounded-xl hover:bg-[#b5c49b] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      <span>افزودن خدمت جدید</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(s => (
                      <div key={s.id} className="bg-[#242922] p-4 rounded-xl border border-[#363d33] flex flex-col justify-between text-xs space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] text-[#a3b18a] font-mono">{s.categoryLabel} · {s.duration}</span>
                            <h4 className="font-bold text-[#f1f5f9] text-sm mt-0.5">{s.title}</h4>
                            <p className="text-gray-400 text-[11px] mt-1 line-clamp-2">{s.technique}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#363d33]">
                          <button onClick={() => setEditingService(s)} className="px-3 py-1 bg-[#1e221b] hover:bg-[#363d33] text-[#a3b18a] rounded border border-[#363d33] transition-colors cursor-pointer">
                            <i className="fa-regular fa-pen-to-square ml-1"></i>
                            <span>ویرایش</span>
                          </button>
                          <button onClick={() => handleDeleteService(s.id, s.title)} className="px-3 py-1 bg-[#1e221b] hover:bg-red-950/40 text-red-400 rounded border border-[#363d33] transition-colors cursor-pointer">
                            <i className="fa-regular fa-trash-can ml-1"></i>
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WEEKLY SCHEDULE MATRIX (CRITICAL MODIFICATION) */}
          {adminTab === 'schedule' && (
            <AdminScheduleManager
              schedule={weeklySchedule}
              onToggleSlot={handleToggleSlotStatus}
              onResetWeek={handleResetWeekSchedule}
              onCloseFriday={handleCloseFriday}
              onUpdateSlotNote={handleUpdateSlotNote}
              onShowToast={showToast}
            />
          )}

          {/* TAB 3: TESTIMONIALS */}
          {adminTab === 'reviews' && (
            <div className="space-y-6">
              {editingReview ? (
                <form onSubmit={handleSaveReview} className="bg-[#242922] p-6 sm:p-8 rounded-2xl border border-[#363d33] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#363d33]">
                    <h3 className="text-base font-bold text-[#f1f5f9]">
                      {editingReview.id ? 'ویرایش نظر مراجع' : 'افزودن نظر جدید'}
                    </h3>
                    <button type="button" onClick={() => setEditingReview(null)} className="text-xs text-gray-400 hover:text-white">
                      انصراف
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-300 mb-1">نام مراجع: *</label>
                      <input
                        type="text"
                        required
                        value={editingReview.name}
                        onChange={e => setEditingReview({ ...editingReview, name: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">حوزه فعالیت / شغل:</label>
                      <input
                        type="text"
                        value={editingReview.role}
                        onChange={e => setEditingReview({ ...editingReview, role: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1">خدمت دریافت شده: *</label>
                      <input
                        type="text"
                        required
                        value={editingReview.treatmentUsed}
                        onChange={e => setEditingReview({ ...editingReview, treatmentUsed: e.target.value })}
                        className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-gray-300 mb-1">متن نظر: *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingReview.comment}
                      onChange={e => setEditingReview({ ...editingReview, comment: e.target.value })}
                      className="w-full bg-[#1e221b] border border-[#363d33] rounded p-2 text-white focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={() => setEditingReview(null)} className="px-4 py-2 rounded text-xs text-gray-400 hover:text-white">
                      انصراف
                    </button>
                    <button type="submit" className="px-6 py-2 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded transition-colors cursor-pointer">
                      ذخیره نظر
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-[#f1f5f9]">لیست نظرات و رضایت مراجعین</h3>
                      <p className="text-xs text-gray-400">دیدگاه‌های ثبت شده در پورتفولیو</p>
                    </div>
                    <button
                      onClick={() => setEditingReview({
                        id: '',
                        name: '',
                        role: '',
                        comment: '',
                        treatmentUsed: 'کربوکسی‌تراپی و پاکسازی عمیق',
                        rating: 5
                      })}
                      className="px-4 py-2 bg-[#a3b18a] text-[#1e221b] font-bold text-xs rounded-xl hover:bg-[#b5c49b] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                      <span>افزودن نظر جدید</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testimonials.map(r => (
                      <div key={r.id} className="bg-[#242922] p-4 rounded-xl border border-[#363d33] flex flex-col justify-between text-xs space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-[#a3b18a] text-[10px] mb-2">
                            {[...Array(r.rating)].map((_, i) => (
                              <i key={i} className="fa-solid fa-star"></i>
                            ))}
                          </div>
                          <p className="text-gray-300 italic line-clamp-3">«{r.comment}»</p>
                          <span className="text-[11px] font-bold text-white block mt-3">{r.name}</span>
                          <span className="text-[10px] text-gray-400 block">{r.role}</span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#363d33]">
                          <button onClick={() => setEditingReview(r)} className="px-3 py-1 bg-[#1e221b] hover:bg-[#363d33] text-[#a3b18a] rounded border border-[#363d33] transition-colors cursor-pointer">
                            <i className="fa-regular fa-pen-to-square ml-1"></i>
                            <span>ویرایش</span>
                          </button>
                          <button onClick={() => handleDeleteReview(r.id, r.name)} className="px-3 py-1 bg-[#1e221b] hover:bg-red-950/40 text-red-400 rounded border border-[#363d33] transition-colors cursor-pointer">
                            <i className="fa-regular fa-trash-can ml-1"></i>
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BIO & CREDENTIALS */}
          {adminTab === 'bio' && (
            <form onSubmit={handleSaveBio} className="bg-[#242922] p-6 sm:p-8 rounded-2xl border border-[#363d33] space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-[#f1f5f9]">مشخصات، بیوگرافی و مدارک بین‌المللی</h3>
                <p className="text-xs text-gray-400">اطلاعات نمایش‌یافته در بخش «درباره متخصص»</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">نام و نام خانوادگی: *</label>
                  <input
                    type="text"
                    required
                    value={bioForm.name}
                    onChange={e => setBioForm({ ...bioForm, name: e.target.value })}
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">عنوان حرفه‌ای: *</label>
                  <input
                    type="text"
                    required
                    value={bioForm.title}
                    onChange={e => setBioForm({ ...bioForm, title: e.target.value })}
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">آیدی اینستاگرام (نوبت‌دهی): *</label>
                  <input
                    type="text"
                    required
                    value={bioForm.instagramHandle}
                    onChange={e => setBioForm({ ...bioForm, instagramHandle: e.target.value })}
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">سابقه کاری:</label>
                  <input
                    type="text"
                    value={bioForm.experienceYears}
                    onChange={e => setBioForm({ ...bioForm, experienceYears: e.target.value })}
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>
              </div>

              <div className="text-xs space-y-3">
                <div>
                  <label className="block text-gray-300 mb-1">پیشینه علمی و آکادمیک: *</label>
                  <textarea
                    rows={2}
                    required
                    value={bioForm.academicBackground}
                    onChange={e => setBioForm({ ...bioForm, academicBackground: e.target.value })}
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded p-2 text-white focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">مدارک و گواهینامه‌های بین‌المللی (هر مدرک در یک سطر):</label>
                  <textarea
                    rows={4}
                    value={bioForm.certificates.join('\n')}
                    onChange={e => setBioForm({ ...bioForm, certificates: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded p-2 text-white focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">نشانی و لوکیشن کلینیک: *</label>
                    <input
                      type="text"
                      required
                      value={bioForm.location}
                      onChange={e => setBioForm({ ...bioForm, location: e.target.value })}
                      className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">محدوده تحت پوشش: *</label>
                    <input
                      type="text"
                      required
                      value={bioForm.serviceArea}
                      onChange={e => setBioForm({ ...bioForm, serviceArea: e.target.value })}
                      className="w-full bg-[#1e221b] border border-[#363d33] rounded px-3 py-2 text-white focus:outline-none focus:border-[#a3b18a]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md">
                  ذخیره تغییرات بیوگرافی
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: SECURITY & PASSCODE SETTINGS */}
          {adminTab === 'security' && (
            <div className="max-w-xl mx-auto bg-[#242922] p-6 sm:p-8 rounded-2xl border border-[#363d33] space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-[#f1f5f9] flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-[#a3b18a]"></i>
                  <span>تغییر رمز عبور ورود به پنل مدیریت (#admin)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  می‌توانید رمز ۴ رقمی ورود به این پنل را از حالت پیش‌فرض (۱۲۳۴) به رمز دلخواه خود تغییر دهید.
                </p>
              </div>

              <form onSubmit={handleChangePasscode} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">رمز عبور فعلی: *</label>
                  <input
                    type="password"
                    required
                    value={oldPin}
                    onChange={e => setOldPin(e.target.value)}
                    placeholder="رمز فعلی..."
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">رمز عبور جدید (حداقل ۴ کاراکتر): *</label>
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    placeholder="رمز عبور جدید..."
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">تکرار رمز عبور جدید: *</label>
                  <input
                    type="password"
                    required
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    placeholder="تکرار رمز جدید..."
                    className="w-full bg-[#1e221b] border border-[#363d33] rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#a3b18a]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
                  >
                    ثبت و ذخیره رمز جدید
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-xl bg-[#1e221b] border border-[#363d33] text-[11px] text-gray-400 leading-relaxed">
                <span className="text-[#a3b18a] font-bold block mb-1">نکته امنیتی:</span>
                این پنل فقط با وارد کردن پسوند <code className="text-[#f1f5f9] font-mono">/#admin</code> در نوار آدرس مرورگر قابل مشاهده است و هیچ دکمه‌ای در صفحه اصلی برای بازدیدکنندگان عمومی وجود ندارد.
              </div>
            </div>
          )}

        </main>

      </div>
    );
  }

  // ===========================================================================
  // PUBLIC PORTFOLIO LANDING PAGE (100% CLEAN - ZERO ADMIN ARTIFACTS)
  // ===========================================================================
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#1e221b] text-[#f1f5f9] relative selection:bg-[#a3b18a]/30 selection:text-white font-vazir"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2d322b]/95 border border-[#a3b18a]/60 text-[#f1f5f9] px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs tracking-wide animate-bounce">
          <i className="fa-brands fa-instagram text-[#a3b18a]"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR: 100% CLEAN & CLIENT-FOCUSED */}
      <header className="sticky top-0 z-40 bg-[#1e221b]/90 backdrop-blur-md border-b border-[#363d33]/50 px-4 sm:px-6 lg:px-12 py-3.5 sm:py-5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Zone 1: Desktop Navigation Links (hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm tracking-wider text-[#e2e8f0]/90">
            <a href="#bio" className="hover:text-[#a3b18a] transition-colors font-medium">
              درباره متخصص
            </a>
            <a href="#devices" className="hover:text-[#a3b18a] transition-colors font-medium">
              تجهیزات بالینی
            </a>
            <a href="#services" className="hover:text-[#a3b18a] transition-colors font-medium">
              منوی خدمات
            </a>
            <a href="#schedule" className="hover:text-[#a3b18a] transition-colors font-medium flex items-center gap-1.5">
              <span>سانس‌های هفتگی</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3b18a] animate-pulse"></span>
            </a>
            <a href="#reviews" className="hover:text-[#a3b18a] transition-colors font-medium">
              نظرات مراجعین
            </a>
          </nav>

          {/* Zone 1 (Mobile): Hamburger Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#242922] border border-[#363d33] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors active:scale-95"
              aria-label="Toggle navigation menu"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-sm text-[#a3b18a]`}></i>
            </button>
          </div>

          {/* Zone 2: Center Botanical Geometric Emblem & Brand Name */}
          <a href="#top" className="flex items-center gap-2 sm:gap-2.5 group" aria-label="Home">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-[#a3b18a] group-hover:rotate-45 transition-transform duration-700 animate-emblem-spin"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="10" />
              <path d="M50 15 C45 30, 45 35, 50 40 C55 35, 55 30, 50 15 Z" />
              <path d="M50 85 C45 70, 45 65, 50 60 C55 65, 55 70, 50 85 Z" />
              <path d="M15 50 C30 45, 35 45, 40 50 C35 55, 30 55, 15 50 Z" />
              <path d="M85 50 C70 45, 65 45, 60 50 C65 55, 70 55, 85 50 Z" />
              <path d="M25 25 C38 35, 40 40, 43 43 C40 40, 35 38, 25 25 Z" />
              <path d="M75 75 C62 65, 60 60, 57 57 C60 60, 65 62, 75 75 Z" />
              <path d="M25 75 C38 65, 40 60, 43 57 C40 60, 35 62, 25 75 Z" />
              <path d="M75 25 C62 35, 60 40, 57 43 C60 40, 65 38, 75 25 Z" />
            </svg>
            <div className="flex flex-col text-right">
              <span className="font-bold text-sm sm:text-base tracking-widest text-[#f1f5f9] group-hover:text-[#a3b18a] transition-colors">
                {bio.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#a3b18a] font-mono tracking-wider">
                SKINCARE & FACIAL
              </span>
            </div>
          </a>

          {/* Zone 3: Direct Instagram Booking CTA with Luxury Micro-Interactions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleOpenInstagramBooking()}
              className="min-h-[44px] px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-xs rounded-full transition-all duration-300 shadow-md flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:scale-105 active:scale-95 animate-luxury-shimmer"
            >
              <i className="fa-brands fa-instagram text-xs sm:text-sm"></i>
              <span className="hidden sm:inline">نوبت‌دهی دایرکت</span>
              <span className="sm:hidden text-[11px]">رزرو نوبت</span>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#363d33] space-y-2 animate-fade-in text-right">
            <a
              href="#bio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-[#242922] hover:bg-[#2e352b] text-[#f1f5f9] text-xs font-semibold flex items-center justify-between"
            >
              <span>درباره متخصص و مدارک CIDESCO</span>
              <i className="fa-solid fa-graduation-cap text-[#a3b18a]"></i>
            </a>
            <a
              href="#devices"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-[#242922] hover:bg-[#2e352b] text-[#f1f5f9] text-xs font-semibold flex items-center justify-between"
            >
              <span>تجهیزات و فناوری‌های بالینی</span>
              <i className="fa-solid fa-microchip text-[#a3b18a]"></i>
            </a>
            <a
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-[#242922] hover:bg-[#2e352b] text-[#f1f5f9] text-xs font-semibold flex items-center justify-between"
            >
              <span>منوی خدمات و پکیج‌های تخصصی</span>
              <i className="fa-solid fa-spa text-[#a3b18a]"></i>
            </a>
            <a
              href="#schedule"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-[#242922] hover:bg-[#2e352b] text-[#f1f5f9] text-xs font-semibold flex items-center justify-between border border-[#a3b18a]/30"
            >
              <div className="flex items-center gap-2">
                <span>جدول سانس‌های هفتگی</span>
                <span className="w-2 h-2 rounded-full bg-[#a3b18a] animate-pulse"></span>
              </div>
              <i className="fa-solid fa-calendar-check text-[#a3b18a]"></i>
            </a>
            <a
              href="#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-[#242922] hover:bg-[#2e352b] text-[#f1f5f9] text-xs font-semibold flex items-center justify-between"
            >
              <span>نظرات و رضایت مراجعین</span>
              <i className="fa-solid fa-star text-[#a3b18a]"></i>
            </a>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* EDITORIAL HERO SECTION (WITH 3D LAYERED TYPOGRAPHY & RADIANT PORTRAIT) */}
      {/* ========================================================================= */}
      <EditorialHeroSection
        bio={bio}
        heroThumbnails={heroThumbnails}
        activeThumbnail={activeThumbnail}
        onSelectThumbnail={(idx) => setActiveThumbnail(idx)}
        onOpenZoom={() => setIsZoomModalOpen(true)}
        onOpenInstagramModal={() => handleOpenInstagramBooking()}
      />

      {/* ========================================================================= */}
      {/* CLINICAL DEVICES & TECHNOLOGIES SECTION */}
      {/* ========================================================================= */}
      <ClinicalDevicesSection
        onInquireDevice={(deviceName) => handleOpenInstagramBooking(`مشاوره دستگاه ${deviceName}`)}
      />


      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL IDENTITY & BIO SECTION */}
      {/* ========================================================================= */}
      <section id="bio" className="py-24 bg-[#242922] border-t border-[#363d33] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div data-aos="fade-right" className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-gradient-to-b from-[#1e221b] via-[#242922] to-[#1e221b] border-2 border-[#a3b18a]/40 p-8 sm:p-10 shadow-2xl flex flex-col justify-between space-y-6 text-center hover:border-[#a3b18a]/70 hover:-translate-y-1 transition-all duration-300">
                
                {/* Prestige Seal & Monogram */}
                <div className="relative mx-auto">
                  <div className="w-20 h-20 rounded-full bg-[#1e221b] border-2 border-[#a3b18a] text-[#a3b18a] flex items-center justify-center text-3xl shadow-lg shadow-[#a3b18a]/10 mx-auto group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-certificate"></i>
                  </div>
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[#a3b18a]/15 text-[#a3b18a] border border-[#a3b18a]/30 text-[10px] font-mono tracking-wider">
                    CIDESCO SWITZERLAND ACCREDITED
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
                    {bio.name}
                  </h3>
                  <span className="text-xs text-[#a3b18a] font-medium block mt-1">
                    {bio.title}
                  </span>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">
                    سابقه کاری بالینی: {bio.experienceYears}
                  </p>
                </div>

                {/* Quote */}
                <div className="bg-[#1e221b] p-4 rounded-2xl border border-[#363d33] text-right">
                  <i className="fa-solid fa-quote-right text-[#a3b18a] text-xs mb-1 block"></i>
                  <p className="text-xs text-[#e2e8f0]/85 leading-relaxed italic">
                    «سلامت و پایداری سد دفاعی پوست، بنیان درخشش واقعی است. در پروتکل‌های کلینیک، ترمیم سلولی و آرامش پایدار جایگزین مواد آسیب‌رسان و خشن شده‌اند.»
                  </p>
                </div>

                {/* Clinical Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#363d33]/60">
                  <div className="bg-[#1e221b] p-2.5 rounded-xl border border-[#363d33] text-center hover:border-[#a3b18a]/40 transition-colors">
                    <span className="text-xs font-bold text-[#f1f5f9] block">۱۰۰٪ غیرتهاجمی</span>
                    <span className="text-[10px] text-gray-400">بدون سوزن و نقاهت</span>
                  </div>
                  <div className="bg-[#1e221b] p-2.5 rounded-xl border border-[#363d33] text-center hover:border-[#a3b18a]/40 transition-colors">
                    <span className="text-xs font-bold text-[#a3b18a] block">منطقه ۱ تهران</span>
                    <span className="text-[10px] text-gray-400">زعفرانیه · محیط VIP</span>
                  </div>
                </div>

              </div>
            </div>

            <div data-aos="fade-left" className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#a3b18a] block mb-2">
                  CERTIFIED BEAUTY THERAPIST · BIO
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
                  درباره هدی پژمان و استانداردهای کلینیک
                </h2>
                <p className="text-xs text-[#a3b18a] font-medium mt-1">
                  {bio.title}
                </p>
              </div>

              <div className="bg-[#1e221b] p-6 rounded-2xl border border-[#363d33] space-y-3 hover:border-[#a3b18a]/40 transition-colors">
                <h4 className="text-sm font-bold text-[#f1f5f9] flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-[#a3b18a]"></i>
                  <span>پیشینه علمی و رویکرد بیولوژیک</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#e2e8f0]/80 leading-relaxed">
                  {bio.academicBackground}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  مدارک و سرتیفیکیت‌های بین‌المللی:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {bio.certificates.map((cert, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1e221b] p-3.5 rounded-xl border border-[#363d33] flex items-start gap-2.5 hover:border-[#a3b18a]/50 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <i className="fa-solid fa-circle-check text-[#a3b18a] text-xs mt-0.5 shrink-0"></i>
                      <span className="text-[#e2e8f0]/90 leading-relaxed">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e221b] p-4 rounded-xl border border-[#363d33] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:border-[#a3b18a]/40 transition-colors">
                <div>
                  <span className="text-gray-400 block text-[11px]">موقعیت کلینیک:</span>
                  <strong className="text-[#f1f5f9]">{bio.location}</strong>
                  <p className="text-[10px] text-[#a3b18a] mt-0.5">{bio.serviceArea}</p>
                </div>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 hover:scale-105 active:scale-95"
                >
                  <i className="fa-brands fa-instagram text-xs"></i>
                  <span>مشاهده اینستاگرام {bio.instagramHandle}</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SPECIALIZED SERVICES & PACKAGES MENU */}
      {/* ========================================================================= */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="space-y-12">
          
          <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a3b18a] block mb-2">
                CLINICAL PORTFOLIO & TREATMENT MENU
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f1f5f9] tracking-tight">
                منوی خدمات و پکیج‌های تخصصی
              </h2>
              <p className="text-xs sm:text-sm text-[#e2e8f0]/75 mt-3 leading-relaxed">
                هر پروتکل درمانی با بررسی دقیق بیولوژیک سد دفاعی پوست و توسط هدی پژمان متناسب با نیاز بافت شما برنامه‌ریزی می‌شود.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#242922] p-1.5 rounded-2xl border border-[#363d33] text-xs self-start">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  serviceFilter === 'all'
                    ? 'bg-[#a3b18a] text-[#1e221b] font-bold shadow-md scale-102'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                همه ({services.length})
              </button>
              <button
                onClick={() => setServiceFilter('treatment')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  serviceFilter === 'treatment'
                    ? 'bg-[#a3b18a] text-[#1e221b] font-bold shadow-md scale-102'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                درمان‌های تخصصی
              </button>
              <button
                onClick={() => setServiceFilter('package')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  serviceFilter === 'package'
                    ? 'bg-[#a3b18a] text-[#1e221b] font-bold shadow-md scale-102'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                پکیج‌های ترکیبی
              </button>
            </div>
          </div>

          {/* Service Cards Grid with Staggered Intersection Observer Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onSelectService={(s) => setSelectedService(s)}
                onOpenInstagramBooking={(title) => handleOpenInstagramBooking(title)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WEEKLY AVAILABLE SLOTS & INTERACTIVE SCHEDULE GRID (CRITICAL MODIFICATION) */}
      {/* ========================================================================= */}
      <WeeklyScheduleSection
        schedule={weeklySchedule}
        onSelectSlot={(slot) => setSelectedSlotForBooking(slot)}
      />

      {/* ========================================================================= */}
      {/* 4. SOCIAL PROOF & TESTIMONIALS */}
      {/* ========================================================================= */}
      <section id="reviews" className="py-24 bg-[#242922] border-t border-[#363d33]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          <div data-aos="fade-up" className="max-w-xl mx-auto text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#a3b18a] block mb-2">
              CLIENT VOICES & FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
              تجربیات و بازخورد مراجعین
            </h2>
            <p className="text-xs sm:text-sm text-[#e2e8f0]/70 mt-2">
              نظرات واقعی مراجعین کلینیک درباره اثرات پروتکل‌های درمانی و استانداردهای بهداشتی.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((rev, idx) => (
              <div
                key={rev.id}
                data-aos="fade-up"
                data-aos-delay={idx * 120}
                className="bg-[#1e221b] border border-[#363d33] p-6 rounded-2xl relative flex flex-col justify-between shadow-xl hover:border-[#a3b18a]/60 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.7)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#a3b18a] text-xs mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#e2e8f0]/90 leading-relaxed italic">
                    {rev.comment}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#363d33]/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#f1f5f9]">{rev.name}</h4>
                      <span className="text-[11px] text-gray-400 block">{rev.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#a3b18a] font-mono block mt-2">
                    خدمت: {rev.treatmentUsed}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* INSTAGRAM SCHEDULING BANNER */}
      {/* ========================================================================= */}
      <section data-aos="fade-up" className="py-24 bg-gradient-to-t from-[#171a15] to-[#1e221b] border-t border-[#363d33]">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#2d322b] border border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center text-2xl mx-auto shadow-xl hover:scale-110 transition-transform duration-300">
            <i className="fa-brands fa-instagram"></i>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
            هماهنگی و مشاوره نوبت در دایرکت اینستاگرام
          </h2>

          <p className="text-xs sm:text-sm text-[#e2e8f0]/80 max-w-xl mx-auto leading-relaxed">
            تمامی وقت‌های مشاوره و جلسات درمانی به صورت اختصاصی در دایرکت اینستاگرام ({bio.instagramHandle}) با بررسی پرونده و عکس پوست هماهنگ می‌گردند.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-lg flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 animate-glow-pulse"
            >
              <i className="fa-brands fa-instagram text-base"></i>
              <span>ورود به دایرکت اینستاگرام ({bio.instagramHandle})</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(bio.instagramHandle);
                showToast(`آیدی کپی شد: ${bio.instagramHandle}`);
              }}
              className="px-6 py-3.5 bg-[#242922] hover:bg-[#363d33] border border-[#363d33] hover:border-[#a3b18a]/50 text-[#f1f5f9] font-medium text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <i className="fa-regular fa-copy text-[#a3b18a]"></i>
              <span className="font-mono">کپی آیدی {bio.instagramHandle}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER: 100% CLEAN - ZERO ADMIN ARTIFACTS */}
      {/* ========================================================================= */}
      <footer className="bg-[#171a15] border-t border-[#363d33] py-16 text-xs text-[#e2e8f0]/65">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border border-[#a3b18a]/60 flex items-center justify-center text-[#a3b18a]">
                <i className="fa-solid fa-spa text-xs"></i>
              </span>
              <span className="font-bold text-sm tracking-wider text-[#f1f5f9]">
                {bio.name} · {bio.title}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#e2e8f0]/70">
              کلینیک و پورتفولیو تخصصی اسکین‌کر و فیشیال ارگانیک؛ کربوکسی‌تراپی، آکواپیل و جوانسازی بیولوژیک در زعفرانیه.
            </p>
            <div className="text-[10px] font-mono text-[#a3b18a]">
              CIDESCO SWITZERLAND · CERTIFIED 2026
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#f1f5f9] tracking-wider uppercase mb-3">
              دسته‌بندی خدمات و تجهیزات
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#services" className="hover:text-[#a3b18a] transition-colors">درمان لک و هایپرپیگمانتاسیون</a></li>
              <li><a href="#services" className="hover:text-[#a3b18a] transition-colors">کربوکسی‌تراپی غیرتهاجمی بوهر</a></li>
              <li><a href="#services" className="hover:text-[#a3b18a] transition-colors">آکواپیل و پاکسازی عمیق گردابی</a></li>
              <li><a href="#devices" className="hover:text-[#a3b18a] transition-colors text-[#a3b18a]">مشاهده ۴ فناوری و دستگاه بالینی</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#f1f5f9] tracking-wider uppercase mb-3">
              برنامه کاری و سانس‌ها
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#schedule" className="hover:text-[#a3b18a] transition-colors">جدول سانس‌های هفتگی</a></li>
              <li><a href="#schedule" className="hover:text-[#a3b18a] transition-colors">شیفت صبح: ۱۰:۰۰ الی ۱۳:۰۰</a></li>
              <li><a href="#schedule" className="hover:text-[#a3b18a] transition-colors">شیفت عصر: ۱۴:۰۰ الی ۱۷:۰۰</a></li>
              <li><a href="#schedule" className="hover:text-[#a3b18a] transition-colors">شیفت غروب: ۱۷:۳۰ الی ۲۰:۳۰</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#f1f5f9] tracking-wider uppercase mb-3">
              کلینیک و موقعیت
            </h4>
            <p className="text-[11px] leading-relaxed mb-2 text-[#e2e8f0]/80">
              {bio.location}
            </p>
            <p className="text-[11px] font-mono text-[#a3b18a]">
              Instagram: {bio.instagramHandle}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              محدوده: {bio.serviceArea}
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-6 border-t border-[#363d33]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© ۱۴۰۵ پورتفولیو و کلینیک اسکین‌کر {bio.name}. تمامی حقوق محفوظ است.</span>
          <div className="flex items-center gap-6 text-sm text-[#a3b18a]">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#top" aria-label="Telegram" className="hover:text-white transition-colors"><i className="fa-brands fa-telegram"></i></a>
            <a href="#top" aria-label="WhatsApp" className="hover:text-white transition-colors"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* SLOT BOOKING INSTAGRAM MODAL (NEW) */}
      {/* ========================================================================= */}
      {selectedSlotForBooking && (
        <SlotBookingModal
          slot={selectedSlotForBooking}
          onClose={() => setSelectedSlotForBooking(null)}
          onShowToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* GENERAL INSTAGRAM BOOKING CONCIERGE MODAL */}
      {/* ========================================================================= */}
      {isInstagramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#242922] border border-[#a3b18a]/50 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-6 animate-modal-in">
            
            <button
              onClick={() => setIsInstagramModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e221b] border border-[#363d33] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>

            <div className="w-16 h-16 rounded-full bg-[#1e221b] border-2 border-[#a3b18a] text-[#a3b18a] flex items-center justify-center text-3xl mx-auto shadow-lg">
              <i className="fa-brands fa-instagram"></i>
            </div>

            <div>
              <span className="text-[11px] font-mono text-[#a3b18a] uppercase tracking-wider">
                INSTAGRAM CONCIERGE
              </span>
              <h3 className="text-xl font-bold text-[#f1f5f9] mt-1">
                هماهنگی نوبت و مشاوره در اینستاگرام
              </h3>
              {inquiredItemTitle && (
                <div className="mt-2 inline-block bg-[#1e221b] border border-[#363d33] px-3 py-1 rounded text-xs text-[#a3b18a]">
                  درخواست برای: {inquiredItemTitle}
                </div>
              )}
            </div>

            <div className="text-right text-xs space-y-3 bg-[#1e221b] p-4 rounded-xl border border-[#363d33]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#363d33] text-[#a3b18a] flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">۱</span>
                <span className="text-[#e2e8f0]/90 leading-relaxed">
                  در دایرکت اینستاگرام {bio.instagramHandle} پیام دهید و عکس واضح پوست بدون آرایش یا دغدغه خود را ارسال نمایید.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#363d33] text-[#a3b18a] flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">۲</span>
                <span className="text-[#e2e8f0]/90 leading-relaxed">
                  مشاور کلینیک شرایط پوست را با پروتکل‌های کربوکسی‌تراپی، آکواپیل، درمان لک یا جوانسازی تطبیق داده و زمان مناسب را پیشنهاد می‌دهد.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#363d33] text-[#a3b18a] flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">۳</span>
                <span className="text-[#e2e8f0]/90 leading-relaxed">
                  نوبت شما در محیط آرام و بهداشتی کلینیک در زعفرانیه قطعی شده و لوکیشن دقیق ارسال می‌گردد.
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
                <span>ورود به دایرکت اینستاگرام ({bio.instagramHandle})</span>
              </a>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(bio.instagramHandle);
                  showToast(`آیدی کپی شد: ${bio.instagramHandle}`);
                }}
                className="w-full py-2.5 bg-[#1e221b] hover:bg-[#363d33] border border-[#363d33] text-[#e2e8f0] font-medium text-xs rounded-xl transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
              >
                کپی نام کاربری ({bio.instagramHandle})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE DETAIL PROTOCOL MODAL */}
      {/* ========================================================================= */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#242922] border border-[#a3b18a]/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-modal-in">
            
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1e221b] border border-[#363d33] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>

            <div className="mb-6 pb-4 border-b border-[#363d33]">
              <span className="text-xs font-mono text-[#a3b18a] tracking-wider uppercase">
                {selectedService.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] mt-1">
                {selectedService.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#e2e8f0]/70 mt-2">
                <span>دسته‌بندی: <strong className="text-[#a3b18a]">{selectedService.categoryLabel}</strong></span>
                <span>·</span>
                <span>مدت جلسه: <strong className="text-[#f1f5f9] font-mono">{selectedService.duration}</strong></span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#e2e8f0]/90 leading-relaxed mb-6">
              <div className="bg-[#1e221b] p-4 rounded-xl border border-[#363d33]">
                <h4 className="text-[#a3b18a] font-bold mb-1">تکنیک و مکانیسم بیولوژیک اجرا:</h4>
                <p>{selectedService.technique}</p>
              </div>

              <div className="bg-[#1e221b] p-4 rounded-xl border border-[#363d33]">
                <h4 className="text-[#a3b18a] font-bold mb-1">مزایا و نتایج مورد انتظار:</h4>
                <p>{selectedService.benefits}</p>
              </div>

              <div className="bg-[#1e221b] p-4 rounded-xl border border-[#363d33]">
                <h4 className="text-[#a3b18a] font-bold mb-2">مواد مؤثره دارویی و گیاهی:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedService.keyActives.map((act, i) => (
                    <span key={i} className="text-xs text-[#f1f5f9] bg-[#242922] px-2.5 py-1 rounded border border-[#363d33]">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#363d33]">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                بستن
              </button>

              <button
                onClick={() => {
                  setSelectedService(null);
                  handleOpenInstagramBooking(selectedService.title);
                }}
                className="px-5 py-2.5 text-xs font-bold text-[#1e221b] bg-[#a3b18a] hover:bg-[#b5c49b] rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md"
              >
                <i className="fa-brands fa-instagram"></i>
                <span>رزرو این خدمت در اینستاگرام</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THUMBNAIL ZOOM / CAMPAIGN PREVIEW MODAL */}
      {/* ========================================================================= */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#242922] border border-[#a3b18a]/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-modal-in">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e221b] border border-[#363d33] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>

            <div className="rounded-xl overflow-hidden mb-4 h-80 sm:h-96 bg-[#1e221b]">
              <img
                src={heroThumbnails[activeThumbnail].img}
                alt={heroThumbnails[activeThumbnail].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#a3b18a] uppercase">{bio.name} ARCHIVE</span>
                <h3 className="text-base font-bold text-white">
                  {heroThumbnails[activeThumbnail].title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {heroThumbnails[activeThumbnail].desc}
                </p>
              </div>

              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="px-4 py-2 bg-[#a3b18a] text-[#1e221b] font-bold text-xs rounded"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
