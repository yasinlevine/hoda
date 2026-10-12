import React, { useState, useEffect, useRef } from 'react';

// Image assets & modular data
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
  DEFAULT_TESTIMONIALS,
  heroMintPortrait,
  mintSerumStone,
  facialTherapyMint,
  mintCreamSwirl
} from './types';
import clinicInteriorImg from './assets/images/clinic_interior_sage_1791130976626.jpg';

// Components
import { WeeklyScheduleSection } from './components/WeeklyScheduleSection';
import { AdminScheduleManager } from './components/AdminScheduleManager';
import { SlotBookingModal } from './components/SlotBookingModal';
import { EditorialHeroSection } from './components/EditorialHeroSection';
import { ClinicalDevicesSection } from './components/ClinicalDevicesSection';
import { ServiceCard } from './components/ServiceCard';
import { SkinAnalysisSection } from './components/SkinAnalysisSection';

// Robust SVG Icons (Zero external CDN dependency)
import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
  SpaIcon,
  ShieldCheckIcon,
  ShieldIcon,
  CalendarCheckIcon,
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  CircleCheckIcon,
  StarIcon,
  LockIcon,
  GraduationCapIcon,
  AwardIcon,
  SlidersIcon,
  SearchIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  RotateCcwIcon,
  XIcon,
  MenuIcon,
  ArrowLeftIcon,
  CopyIcon,
  EyeIcon,
  CameraIcon,
  ImageIcon,
  SunIcon,
  MoonIcon,
  CloudSunIcon,
  WaveIcon,
  AtomIcon,
  WandSparklesIcon,
  MicrochipIcon,
  DropletIcon,
  QuoteIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  LocationIcon,
  CircleInfoIcon,
  RepeatIcon,
  LogOutIcon,
  SeedlingIcon,
  ZoomInIcon,
  CameraRotateIcon,
  CertificateIcon,
  CompassIcon,
  HistoryIcon,
  FeatherIcon,
  CrownIcon,
  MapPinIcon,
  DiplomaIcon,
  HandHeartIcon,
  MicroscopeIcon,
  SparklesIcon,
  MessageSquareIcon,
  UserCheckIcon,
  UploadIcon
} from './components/Icons';

// ---------------------------------------------------------------------------
// SAFE BROWSER STORAGE UTILITY (Prevents crashing in private browsing/sandboxes)
// ---------------------------------------------------------------------------
const safeStorage = {
  getItem: (key: string, fallback = ''): string => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  getSessionItem: (key: string, fallback = ''): string => {
    try {
      return sessionStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  setSessionItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  removeSessionItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
  getJson: <T,>(key: string, fallback: T): T => {
    try {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  },
  setJson: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }
};

export default function App() {
  // ---------------------------------------------------------------------------
  // ROUTING & ADMIN AUTH STATE
  // ---------------------------------------------------------------------------
  const [currentHash, setCurrentHash] = useState<string>(() => {
    try {
      return window.location.hash;
    } catch {
      return '';
    }
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return safeStorage.getSessionItem('orya_admin_auth') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return safeStorage.getItem('orya_admin_pin', '1234') || '1234';
  });
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Hash router listener (#admin or #manager)
  useEffect(() => {
    const handleHashChange = () => {
      try {
        setCurrentHash(window.location.hash);
      } catch {
        // ignore
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Initialize AOS (Animate on Scroll)
    const initAos = () => {
      try {
        if (typeof (window as any).AOS !== 'undefined') {
          (window as any).AOS.init({
            duration: 700,
            easing: 'ease-out',
            once: true,
            offset: 50,
            disable: 'mobile',
          });
        }
      } catch {
        // ignore
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
    safeStorage.removeSessionItem('orya_admin_auth');
    setIsAdminAuthenticated(false);
    setEnteredPin('');
    setPinError(null);
    try {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPasscode.trim()) {
      safeStorage.setSessionItem('orya_admin_auth', 'true');
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
    safeStorage.setItem('orya_admin_pin', newPin);
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
    return safeStorage.getJson<TherapistBio>('hoda_bio_v3', DEFAULT_BIO);
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    return safeStorage.getJson<ServiceItem[]>('orya_services', DEFAULT_SERVICES);
  });

  // Weekly Schedule Grid State (Replaces Before & After completely)
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySlot[]>(() => {
    return safeStorage.getJson<WeeklySlot[]>('hoda_weekly_schedule_v1', DEFAULT_WEEKLY_SCHEDULE);
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    return safeStorage.getJson<TestimonialItem[]>('orya_testimonials', DEFAULT_TESTIMONIALS);
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist to localStorage
  useEffect(() => {
    safeStorage.setJson('hoda_bio_v3', bio);
  }, [bio]);

  useEffect(() => {
    safeStorage.setJson('orya_services', services);
  }, [services]);

  useEffect(() => {
    safeStorage.setJson('hoda_weekly_schedule_v1', weeklySchedule);
  }, [weeklySchedule]);

  useEffect(() => {
    safeStorage.setJson('orya_testimonials', testimonials);
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

  // Circular Back to Top Button state & scroll listener
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      try {
        if (window.scrollY > 350) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // fallback
      window.scrollTo(0, 0);
    }
  };

  // Admin Dashboard Active Tab & Drawer Menu
  const [adminTab, setAdminTab] = useState<'services' | 'schedule' | 'reviews' | 'bio' | 'security'>('services');
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState<boolean>(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');

  // Editing items in Admin
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const serviceImageInputRef = useRef<HTMLInputElement>(null);
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

  // Hero bottom thumbnails (Apple pastel mint visual theme)
  const heroThumbnails = [
    {
      id: 0,
      title: 'درمان علمی و بازسازی سد دفاعی',
      desc: 'پرتره بالینی و آرامش پایدار پوست',
      img: heroMintPortrait
    },
    {
      id: 1,
      title: 'بافت‌های کرمی فیتوتراپی',
      desc: 'امولسیون بازسازی سد دفاعی لاملار',
      img: mintCreamSwirl
    },
    {
      id: 2,
      title: 'تراپی فیشیال با سنگ یشم',
      desc: 'درناژ لنفاوی و ماساژ آرامش‌بخش',
      img: facialTherapyMint
    },
    {
      id: 3,
      title: 'سرم‌های خالص بیولوژیک',
      desc: 'سرامیدهای سازگار با ساختار پوست',
      img: mintSerumStone
    },
    {
      id: 4,
      title: 'فضای استریل و VIP کلینیک',
      desc: 'محیط ایزوله و آرامش‌بخش در زعفرانیه',
      img: clinicInteriorImg
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
                className="w-full py-3 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <LockIcon className="w-4 h-4 text-white" />
                <span>ورود به پنل مدیریت</span>
              </button>
            </form>

            <div className="pt-2 border-t border-[#363d33]/60 flex items-center justify-between text-xs">
              <span className="text-gray-500 text-[11px]">رمز پیش‌فرض: ۱۲۳۴</span>
              <button
                onClick={handleExitAdmin}
                className="text-[#7bc4bc] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>بازگشت به وب‌سایت</span>
                <ArrowLeftIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              </button>
            </div>

          </div>
        </div>
      );
    }

    // 2. DEDICATED FULL-SCREEN ADMIN DASHBOARD VIEW
    return (
      <div dir="rtl" className="min-h-screen bg-[#1e221b] text-[#f1f5f9] font-vazir flex flex-col selection:bg-[#7bc4bc]/30">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2d322b] border border-[#7bc4bc]/60 text-[#f1f5f9] px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs animate-modal-in">
            <CheckIcon className="w-4 h-4 text-[#7bc4bc]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Navigation Bar with Creative Hamburger Button */}
        <header className="sticky top-0 z-40 bg-[#1e221b]/95 backdrop-blur-md border-b border-[#363d33] px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Creative Animated Hamburger Button */}
            <button
              onClick={() => setIsAdminDrawerOpen(!isAdminDrawerOpen)}
              className="p-2.5 rounded-xl bg-[#242922] hover:bg-[#2d332a] border border-[#7bc4bc]/40 text-[#7bc4bc] hover:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 active:scale-95 group shadow-sm"
              aria-label="منوی همبرگری مدیریت"
              title="منوی همبرگری مدیریت"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-right ${isAdminDrawerOpen ? '-rotate-45 translate-x-0.5' : ''}`}></span>
                <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 ${isAdminDrawerOpen ? 'opacity-0 translate-x-2' : ''}`}></span>
                <span className={`h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-right ${isAdminDrawerOpen ? 'rotate-45 translate-x-0.5' : ''}`}></span>
              </div>
              <span className="hidden sm:inline text-xs font-semibold">منو</span>
            </button>

            <span className="w-9 h-9 rounded-full bg-[#242922] border border-[#7bc4bc]/40 text-[#7bc4bc] flex items-center justify-center text-sm shadow-inner">
              <SlidersIcon className="w-4 h-4 text-[#7bc4bc]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#f1f5f9]">
                  پنل مدیریت پورتفولیو · {bio.name}
                </h2>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>آنلاین</span>
                </span>
              </div>
              <span className="text-[10px] text-[#7bc4bc] font-mono block">
                ADMIN CONSOLE ({currentHash || '#admin'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleResetToDefaults}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs text-red-300 bg-[#242922] border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
              title="بازنشانی اطلاعات به حالت پیش‌فرض"
            >
              <RotateCcwIcon className="w-3.5 h-3.5 text-red-400" />
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <button
              onClick={handleExitAdmin}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#242922] hover:bg-[#363d33] text-gray-300 hover:text-white border border-[#363d33] hover:border-[#7bc4bc]/40 rounded-xl text-xs transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <LogOutIcon className="w-4 h-4 text-[#7bc4bc]" />
              <span className="hidden sm:inline">خروج و بازگشت به سایت</span>
              <span className="sm:hidden">خروج</span>
            </button>
          </div>
        </header>

        {/* CREATIVE SLIDING DRAWER MENU (منوی همبرگری جذاب مدیریت) */}
        {isAdminDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              onClick={() => setIsAdminDrawerOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
            ></div>

            {/* Sliding Drawer Panel */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#1e221b] border-r border-[#363d33] shadow-2xl flex flex-col h-full animate-slide-left">
              {/* Drawer Header */}
              <div className="p-6 bg-[#242922] border-b border-[#363d33] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1e221b] border border-[#7bc4bc]/50 text-[#7bc4bc] flex items-center justify-center text-lg shadow-md">
                    <SpaIcon className="w-5 h-5 text-[#7bc4bc]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#f1f5f9]">{bio.name}</h3>
                    <p className="text-[11px] text-[#7bc4bc]">پنل مدیریت و تنظیمات کلینیک</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl bg-[#1e221b] border border-[#363d33] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="بستن منو"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 px-2 block mb-2">
                  بخش‌های مدیریتی
                </span>

                {[
                  {
                    id: 'services',
                    title: 'منوی خدمات و پکیج‌ها',
                    desc: 'درمان‌های تخصصی و پکیج‌های فیشال',
                    badge: `${services.length} خدمت`,
                    iconNode: <SpaIcon className="w-4 h-4 text-[#7bc4bc]" />,
                    color: 'text-[#7bc4bc]'
                  },
                  {
                    id: 'schedule',
                    title: 'برنامه و سانس‌های هفتگی',
                    desc: '۲۱ سانس هفتگی نوبت‌دهی زعفرانیه',
                    badge: `${weeklySchedule.filter(s => s.status === 'available').length} سانس باز`,
                    iconNode: <CalendarCheckIcon className="w-4 h-4 text-emerald-400" />,
                    color: 'text-emerald-400'
                  },
                  {
                    id: 'reviews',
                    title: 'نظرات و فیدبک مراجعین',
                    desc: 'دیدگاه‌ها و امتیازهای ثبت‌شده',
                    badge: `${testimonials.length} نظر`,
                    iconNode: <StarIcon className="w-4 h-4 text-amber-400" />,
                    color: 'text-amber-400'
                  },
                  {
                    id: 'bio',
                    title: 'اطلاعات متخصص و مدارک',
                    desc: 'بیوگرافی، مدارک CIDESCO و لوکیشن',
                    badge: 'زعفرانیه',
                    iconNode: <GraduationCapIcon className="w-4 h-4 text-sky-400" />,
                    color: 'text-sky-400'
                  },
                  {
                    id: 'security',
                    title: 'امنیت و تنظیمات رمز عبور',
                    desc: 'تغییر پین‌کد ۴ رقمی ورود به پنل',
                    badge: 'فعال',
                    iconNode: <ShieldCheckIcon className="w-4 h-4 text-purple-400" />,
                    color: 'text-purple-400'
                  }
                ].map(item => {
                  const isActive = adminTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAdminTab(item.id as any);
                        setEditingService(null);
                        setEditingReview(null);
                        setIsAdminDrawerOpen(false);
                      }}
                      className={`w-full p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-right cursor-pointer ${
                        isActive
                          ? 'bg-[#242922] border-[#7bc4bc] shadow-lg shadow-[#7bc4bc]/5'
                          : 'bg-[#1e221b] hover:bg-[#242922] border-[#363d33] hover:border-[#7bc4bc]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl bg-[#1e221b] border border-[#363d33] flex items-center justify-center text-sm ${item.color}`}>
                          {item.iconNode}
                        </span>
                        <div>
                          <h4 className={`text-xs font-bold ${isActive ? 'text-[#7bc4bc]' : 'text-[#f1f5f9]'}`}>
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-[#7bc4bc]/20 border-[#7bc4bc]/50 text-[#7bc4bc]'
                          : 'bg-[#242922] border-[#363d33] text-gray-400'
                      }`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 sm:p-6 bg-[#242922] border-t border-[#363d33] space-y-2">
                <button
                  onClick={() => {
                    setIsAdminDrawerOpen(false);
                    handleExitAdmin();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <EyeIcon className="w-4 h-4 text-white" />
                  <span>مشاهده و بازگشت به وب‌سایت</span>
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleResetToDefaults}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#1e221b] border border-red-500/20 text-red-300 hover:bg-red-500/10 text-[11px] transition-colors cursor-pointer text-center"
                  >
                    بازنشانی پیش‌فرض
                  </button>

                  <button
                    onClick={handleExitAdmin}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#1e221b] border border-[#363d33] text-gray-300 hover:text-white text-[11px] transition-colors cursor-pointer text-center"
                  >
                    خروج از پنل
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Horizontal Tab Bar for Fast Navigation */}
        <div className="bg-[#242922] border-b border-[#363d33] px-4 sm:px-8 lg:px-12 flex items-center justify-between overflow-x-auto no-scrollbar text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'services', label: 'خدمات و پکیج‌ها', iconNode: <SpaIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />, count: services.length },
              { id: 'schedule', label: 'برنامه سانس‌ها', iconNode: <CalendarCheckIcon className="w-3.5 h-3.5 text-emerald-400" />, count: weeklySchedule.filter(s => s.status === 'available').length },
              { id: 'reviews', label: 'نظرات مراجعین', iconNode: <StarIcon className="w-3.5 h-3.5 text-amber-400" />, count: testimonials.length },
              { id: 'bio', label: 'اطلاعات متخصص', iconNode: <GraduationCapIcon className="w-3.5 h-3.5 text-sky-400" /> },
              { id: 'security', label: 'امنیت و رمز', iconNode: <ShieldCheckIcon className="w-3.5 h-3.5 text-purple-400" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setAdminTab(tab.id as any);
                  setEditingService(null);
                  setEditingReview(null);
                }}
                className={`py-3.5 px-3 sm:px-4 font-semibold border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === tab.id
                    ? 'border-[#7bc4bc] text-[#7bc4bc] bg-[#1e221b]/40'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-[#363d33]'
                }`}
              >
                {tab.iconNode}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    adminTab === tab.id ? 'bg-[#7bc4bc]/20 text-[#7bc4bc]' : 'bg-[#1e221b] text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center text-[11px] text-[#a3b18a] font-mono">
            <span>کلینیک پوست و فیشال زعفرانیه</span>
          </div>
        </div>

        {/* Admin Main Body */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 lg:p-10 space-y-6">
          
          {/* TOP SUMMARY STAT WIDGETS (کارت‌های آمار جذاب و ساده) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Widget 1: Services */}
            <div
              onClick={() => setAdminTab('services')}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                adminTab === 'services'
                  ? 'bg-[#242922] border-[#a3b18a] shadow-lg shadow-[#a3b18a]/5'
                  : 'bg-[#242922]/70 hover:bg-[#242922] border-[#363d33] hover:border-[#a3b18a]/40'
              }`}
            >
              <div className="flex items-center justify-between text-[#a3b18a] mb-2">
                <span className="text-[11px] font-semibold text-gray-300">خدمات و پکیج‌ها</span>
                <span className="w-7 h-7 rounded-lg bg-[#1e221b] flex items-center justify-center text-xs">
                  <SpaIcon className="w-4 h-4 text-[#a3b18a]" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#f1f5f9]">{services.length}</span>
                <span className="text-[10px] text-gray-400">مورد فعال</span>
              </div>
              <span className="text-[10px] text-[#a3b18a] block mt-1">مدیریت قیمت‌ها و پروتکل‌ها ←</span>
            </div>

            {/* Widget 2: Weekly Schedule */}
            <div
              onClick={() => setAdminTab('schedule')}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                adminTab === 'schedule'
                  ? 'bg-[#242922] border-[#a3b18a] shadow-lg shadow-[#a3b18a]/5'
                  : 'bg-[#242922]/70 hover:bg-[#242922] border-[#363d33] hover:border-[#a3b18a]/40'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <span className="text-[11px] font-semibold text-gray-300">ظرفیت این هفته</span>
                <span className="w-7 h-7 rounded-lg bg-[#1e221b] flex items-center justify-center text-xs">
                  <CalendarCheckIcon className="w-4 h-4 text-emerald-400" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {weeklySchedule.filter(s => s.status === 'available').length}
                </span>
                <span className="text-[10px] text-gray-400">سانس باز از ۲۱</span>
              </div>
              <span className="text-[10px] text-emerald-400 block mt-1">کنترل رزروهای هفتگی ←</span>
            </div>

            {/* Widget 3: Reviews */}
            <div
              onClick={() => setAdminTab('reviews')}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                adminTab === 'reviews'
                  ? 'bg-[#242922] border-[#a3b18a] shadow-lg shadow-[#a3b18a]/5'
                  : 'bg-[#242922]/70 hover:bg-[#242922] border-[#363d33] hover:border-[#a3b18a]/40'
              }`}
            >
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <span className="text-[11px] font-semibold text-gray-300">نظرات مراجعین</span>
                <span className="w-7 h-7 rounded-lg bg-[#1e221b] flex items-center justify-center text-xs">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#f1f5f9]">{testimonials.length}</span>
                <span className="text-[10px] text-amber-400 font-semibold">★ ۵.۰ رضایت</span>
              </div>
              <span className="text-[10px] text-amber-400/90 block mt-1">دیدگاه‌ها و تجربیات ←</span>
            </div>

            {/* Widget 4: Security */}
            <div
              onClick={() => setAdminTab('security')}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                adminTab === 'security'
                  ? 'bg-[#242922] border-[#a3b18a] shadow-lg shadow-[#a3b18a]/5'
                  : 'bg-[#242922]/70 hover:bg-[#242922] border-[#363d33] hover:border-[#a3b18a]/40'
              }`}
            >
              <div className="flex items-center justify-between text-purple-400 mb-2">
                <span className="text-[11px] font-semibold text-gray-300">امنیت پنل</span>
                <span className="w-7 h-7 rounded-lg bg-[#1e221b] flex items-center justify-center text-xs">
                  <LockIcon className="w-4 h-4 text-purple-400" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-purple-300">محافظت‌شده</span>
              </div>
              <span className="text-[10px] text-purple-300 block mt-1">تغییر پین‌کد ورود ←</span>
            </div>
          </div>

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

                  {/* Image Management Section */}
                    <div className="bg-[#1e221b] p-4 rounded-xl border border-[#363d33] space-y-3 text-xs">
                    <label className="block text-gray-300 font-bold">تصویر خدمت یا پکیج:</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={editingService.image || mintCreamSwirl}
                        alt="پیش‌نمایش تصویر خدمت"
                        className="w-20 h-20 rounded-xl object-cover border border-[#7bc4bc]/40 shadow-md shrink-0"
                      />
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="file"
                            ref={serviceImageInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditingService({ ...editingService, image: reader.result as string });
                                  showToast('تصویر جدید با موفقیت بارگذاری شد.');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => serviceImageInputRef.current?.click()}
                            className="px-3.5 py-2 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <UploadIcon className="w-4 h-4" />
                            <span>آپلود عکس جدید از دستگاه</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingService({ ...editingService, image: mintCreamSwirl });
                              showToast('تصویر به حالت پیش‌فرض بازنشانی شد.');
                            }}
                            className="px-3 py-2 bg-[#242922] hover:bg-[#363d33] text-gray-300 rounded-lg border border-[#363d33] transition-colors cursor-pointer"
                          >
                            حذف و بازگشت به پیش‌فرض
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          می‌توانید تصویر دلخواه خود را آپلود کنید یا از گالری تصاویر کلینیک انتخاب کنید:
                        </p>
                        <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                          {[
                            { name: 'بافت کرم فیتوتراپی', url: mintCreamSwirl },
                            { name: 'سرم بیوتکنولوژی', url: mintSerumStone },
                            { name: 'ماساژ و فیشیال جید', url: facialTherapyMint },
                            { name: 'فضای کلینیک', url: clinicInteriorImg },
                            { name: 'پرتره مدل سد دفاعی', url: heroMintPortrait }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditingService({ ...editingService, image: preset.url })}
                              className={`w-10 h-10 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                                editingService.image === preset.url ? 'border-[#a3b18a] ring-2 ring-[#a3b18a]/30' : 'border-[#363d33] opacity-70 hover:opacity-100'
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#f1f5f9]">لیست خدمات و پکیج‌ها</h3>
                      <p className="text-xs text-gray-400">مدیریت درمان‌ها، پروتکل‌ها و مواد مؤثره</p>
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
                        image: mintCreamSwirl
                      })}
                      className="px-4 py-2.5 bg-[#a3b18a] text-[#1e221b] font-bold text-xs rounded-xl hover:bg-[#b5c49b] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-102 active:scale-98 shrink-0"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>افزودن خدمت جدید</span>
                    </button>
                  </div>

                  {/* Search and Category Filter */}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <SearchIcon className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={serviceSearchQuery}
                        onChange={e => setServiceSearchQuery(e.target.value)}
                        placeholder="جستجو در نام خدمت، تکنیک یا مواد مؤثره..."
                        className="w-full bg-[#242922] border border-[#363d33] focus:border-[#a3b18a] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                      />
                      {serviceSearchQuery && (
                        <button
                          onClick={() => setServiceSearchQuery('')}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Service Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services
                      .filter(s => {
                        if (!serviceSearchQuery.trim()) return true;
                        const q = serviceSearchQuery.toLowerCase();
                        return (
                          s.title.toLowerCase().includes(q) ||
                          s.technique.toLowerCase().includes(q) ||
                          s.subtitle.toLowerCase().includes(q) ||
                          s.keyActives.some(a => a.toLowerCase().includes(q))
                        );
                      })
                      .map(s => (
                        <div key={s.id} className="bg-[#242922] p-4.5 rounded-2xl border border-[#363d33] hover:border-[#a3b18a]/40 transition-all flex flex-col justify-between text-xs space-y-3 group shadow-sm">
                          <div className="flex items-start gap-3">
                            <img
                              src={s.image}
                              alt={s.title}
                              className="w-16 h-16 rounded-xl object-cover border border-[#363d33] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                  s.category === 'treatment'
                                    ? 'bg-[#a3b18a]/15 text-[#a3b18a] border-[#a3b18a]/30'
                                    : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                                }`}>
                                  {s.categoryLabel}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {s.duration}
                                </span>
                              </div>
                              <h4 className="font-bold text-[#f1f5f9] text-sm mt-1 truncate">{s.title}</h4>
                              <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">{s.technique}</p>
                            </div>
                          </div>

                          {s.keyActives.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {s.keyActives.slice(0, 3).map((act, i) => (
                                <span key={i} className="text-[10px] bg-[#1e221b] text-gray-300 px-2 py-0.5 rounded-md border border-[#363d33]/80">
                                  {act}
                                </span>
                              ))}
                              {s.keyActives.length > 3 && (
                                <span className="text-[10px] text-[#a3b18a]">+{s.keyActives.length - 3} مورد دیگر</span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-[#363d33]">
                            <button
                              onClick={() => setEditingService(s)}
                              className="px-3 py-1.5 bg-[#1e221b] hover:bg-[#363d33] text-[#a3b18a] rounded-lg border border-[#363d33] transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <EditIcon className="w-3 h-3" />
                              <span>ویرایش</span>
                            </button>
                            <button
                              onClick={() => handleDeleteService(s.id, s.title)}
                              className="px-3 py-1.5 bg-[#1e221b] hover:bg-red-950/40 text-red-400 rounded-lg border border-[#363d33] transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <TrashIcon className="w-3 h-3" />
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
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>افزودن نظر جدید</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testimonials.map(r => (
                      <div key={r.id} className="bg-[#242922] p-4 rounded-xl border border-[#363d33] flex flex-col justify-between text-xs space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-[#a3b18a] mb-2">
                            {[...Array(r.rating)].map((_, i) => (
                              <StarIcon key={i} className="w-3 h-3 text-[#a3b18a] fill-[#a3b18a]" />
                            ))}
                          </div>
                          <p className="text-gray-300 italic line-clamp-3">«{r.comment}»</p>
                          <span className="text-[11px] font-bold text-white block mt-3">{r.name}</span>
                          <span className="text-[10px] text-gray-400 block">{r.role}</span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#363d33]">
                          <button onClick={() => setEditingReview(r)} className="px-3 py-1 bg-[#1e221b] hover:bg-[#363d33] text-[#a3b18a] rounded border border-[#363d33] transition-colors cursor-pointer flex items-center gap-1">
                            <EditIcon className="w-3 h-3" />
                            <span>ویرایش</span>
                          </button>
                          <button onClick={() => handleDeleteReview(r.id, r.name)} className="px-3 py-1 bg-[#1e221b] hover:bg-red-950/40 text-red-400 rounded border border-[#363d33] transition-colors cursor-pointer flex items-center gap-1">
                            <TrashIcon className="w-3 h-3" />
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
                  <ShieldCheckIcon className="w-4 h-4 text-[#a3b18a]" />
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
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8faf9] text-[#1e293b] relative selection:bg-[#7bc4bc]/30 selection:text-[#134e48] font-vazir"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 border border-[#7bc4bc]/50 text-[#0f172a] px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs tracking-wide animate-bounce">
          <InstagramIcon className="w-4 h-4 text-[#7bc4bc]" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR: APPLE-STYLE SLEEK STICKY BAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#7bc4bc]/20 px-4 sm:px-6 lg:px-12 py-3.5 sm:py-4 transition-all shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto grid grid-cols-3 lg:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 relative">
          
          {/* Zone 1 (Right side in RTL): Hamburger on Mobile / Nav Links on Desktop */}
          <div className="flex items-center justify-start">
            {/* Zone 1 (Mobile): Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-2xl bg-[#f0f9f8] border border-[#7bc4bc]/30 text-[#134e48] hover:text-[#0f172a] flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-2xs"
              aria-label="منوی ناوبری"
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-5 h-5 text-[#134e48]" />
              ) : (
                <MenuIcon className="w-5 h-5 text-[#134e48]" />
              )}
            </button>

            {/* Zone 1 (Desktop): Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs sm:text-sm tracking-normal text-[#334155]">
              <a href="#bio" className="hover:text-[#134e48] transition-colors font-medium flex items-center gap-1.5">
                <CertificateIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>درباره متخصص</span>
              </a>
              <a href="#schedule" className="hover:text-[#134e48] transition-colors font-medium flex items-center gap-1.5">
                <CalendarCheckIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>سانس‌های هفتگی</span>
              </a>
              <a href="#skin-analysis" className="hover:text-[#134e48] transition-colors font-medium text-[#1d5750] flex items-center gap-1.5">
                <CameraRotateIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>آنالیز آنلاین</span>
              </a>
              <a href="#services" className="hover:text-[#134e48] transition-colors font-medium flex items-center gap-1.5">
                <SpaIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>منوی خدمات</span>
              </a>
              <a href="#devices" className="hover:text-[#134e48] transition-colors font-medium flex items-center gap-1.5">
                <MicrochipIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>تجهیزات بالینی</span>
              </a>
              <a href="#reviews" className="hover:text-[#134e48] transition-colors font-medium flex items-center gap-1.5">
                <StarIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>نظرات</span>
              </a>
            </nav>
          </div>

          {/* Zone 2 (Center): Exact Centered Botanical Geometric Emblem & Brand Name */}
          <div className="flex items-center justify-center">
            <a
              href="#top"
              className="flex items-center justify-center gap-2 sm:gap-2.5 group transition-transform hover:scale-105"
              aria-label="صفحه اصلی هدی پژمان"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#7bc4bc] group-hover:rotate-45 transition-transform duration-700 animate-emblem-spin shrink-0"
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
              <div className="flex flex-col text-right leading-tight">
                <span className="font-bold text-xs sm:text-sm lg:text-base tracking-wide text-[#0f172a] group-hover:text-[#134e48] transition-colors whitespace-nowrap">
                  {bio.name}
                </span>
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] text-[#134e48] font-mono tracking-wider whitespace-nowrap font-semibold">
                  SKINCARE & FACIAL
                </span>
              </div>
            </a>
          </div>

          {/* Zone 3 (Left side in RTL): Prominent High-End CTA Button ("ثبت نوبت") with soft glow */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => handleOpenInstagramBooking()}
              className="min-h-[44px] px-4 sm:px-6 py-2 sm:py-2.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(123,196,188,0.45)] border border-white/40 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer hover:scale-105 active:scale-95 animate-luxury-shimmer"
            >
              <CalendarCheckIcon className="w-4 h-4 text-white" />
              <span>ثبت نوبت</span>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 space-y-2 animate-mobile-menu text-right bg-white/95 p-3.5 rounded-3xl border border-[#7bc4bc]/30 shadow-xl backdrop-blur-xl">
            <a
              href="#bio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#f8faf9] hover:bg-[#f0f9f8] text-[#0f172a] text-xs font-semibold flex items-center justify-between"
            >
              <span>درباره متخصص و مدارک CIDESCO</span>
              <DiplomaIcon className="w-4 h-4 text-[#7bc4bc]" />
            </a>
            <a
              href="#schedule"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#f0f9f8] hover:bg-[#e4f6f3] text-[#134e48] text-xs font-semibold flex items-center justify-between border border-[#7bc4bc]/30"
            >
              <span>جدول سانس‌های هفتگی</span>
              <CalendarCheckIcon className="w-4 h-4 text-[#7bc4bc]" />
            </a>
            <a
              href="#skin-analysis"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#f0f9f8] hover:bg-[#e4f6f3] text-[#134e48] text-xs font-semibold flex items-center justify-between border border-[#7bc4bc]/30"
            >
              <span>آنالیز آنلاین پوست و روتین</span>
              <CameraRotateIcon className="w-4 h-4 text-[#7bc4bc]" />
            </a>
            <a
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#f8faf9] hover:bg-[#f0f9f8] text-[#0f172a] text-xs font-semibold flex items-center justify-between"
            >
              <span>منوی خدمات و پکیج‌های تخصصی</span>
              <SpaIcon className="w-4 h-4 text-[#7bc4bc]" />
            </a>
            <a
              href="#devices"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#f8faf9] hover:bg-[#f0f9f8] text-[#0f172a] text-xs font-semibold flex items-center justify-between"
            >
              <span>تجهیزات و فناوری‌های بالینی</span>
              <MicrochipIcon className="w-4 h-4 text-[#7bc4bc]" />
            </a>
            <a
              href="#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#f8faf9] hover:bg-[#f0f9f8] text-[#0f172a] text-xs font-semibold flex items-center justify-between"
            >
              <span>نظرات و رضایت مراجعین</span>
              <StarIcon className="w-4 h-4 text-[#7bc4bc]" />
            </a>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* EDITORIAL HERO SECTION (CENTERED ARCH, RADIANT PORTRAIT, PERSIAN TYPO) */}
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
      {/* 1. PROFESSIONAL IDENTITY & BIO SECTION */}
      {/* ========================================================================= */}
      <section id="bio" className="py-20 sm:py-24 bg-gradient-to-b from-[#f8faf9] via-[#f0f9f8]/40 to-white border-t border-[#7bc4bc]/20 relative font-vazir overflow-visible">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 overflow-visible">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-visible">
            
            <div data-aos="fade-up" className="lg:col-span-5 relative pt-2 -mt-2 overflow-visible w-full max-w-[466.328px]">
              <div className="relative rounded-3xl bg-white border-2 border-[#7bc4bc]/40 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between space-y-6 text-center hover:border-[#7bc4bc] hover:shadow-[0_12px_36px_rgb(123,196,188,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-visible min-h-[555px]" style={{ minHeight: '555px' }}>
                
                {/* Prestige Seal & Monogram */}
                <div className="relative mx-auto">
                  <div className="w-20 h-20 rounded-full bg-[#f0f9f8] border-2 border-[#7bc4bc] text-[#7bc4bc] flex items-center justify-center shadow-xs mx-auto group-hover:scale-105 transition-transform">
                    <CertificateIcon className="w-9 h-9 text-[#7bc4bc]" />
                  </div>
                  <span className="inline-block mt-3 px-3.5 py-1 rounded-full bg-[#f0f9f8] text-[#134e48] border border-[#7bc4bc]/30 text-[10px] font-mono tracking-wider font-semibold">
                    CIDESCO SWITZERLAND ACCREDITED
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                    {bio.name}
                  </h3>
                  <span className="text-xs text-[#134e48] font-semibold block mt-1">
                    {bio.title}
                  </span>
                  <p className="text-[11px] font-mono text-[#64748b] mt-1">
                    سابقه کاری بالینی: {bio.experienceYears}
                  </p>
                </div>

                {/* Quote */}
                <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200 text-right">
                  <QuoteIcon className="w-4 h-4 text-[#7bc4bc] mb-1.5 block" />
                  <p className="text-xs text-[#475569] leading-relaxed italic">
                    «سلامت و پایداری سد دفاعی پوست، بنیان درخشش واقعی است. در پروتکل‌های کلینیک، ترمیم سلولی و آرامش پایدار جایگزین مواد آسیب‌رسان و خشن شده‌اند.»
                  </p>
                </div>

                {/* Clinical Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-slate-200 text-center hover:border-[#7bc4bc]/40 transition-colors">
                    <FeatherIcon className="w-4 h-4 text-[#7bc4bc] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#0f172a] block">۱۰۰٪ غیرتهاجمی</span>
                    <span className="text-[10px] text-[#64748b]">بدون سوزن و نقاهت</span>
                  </div>
                  <div className="bg-[#f8faf9] p-2.5 rounded-xl border border-slate-200 text-center hover:border-[#7bc4bc]/40 transition-colors">
                    <CrownIcon className="w-4 h-4 text-[#7bc4bc] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#134e48] block">منطقه ۱ تهران</span>
                    <span className="text-[10px] text-[#64748b]">زعفرانیه · محیط VIP</span>
                  </div>
                </div>

              </div>
            </div>

            <div data-aos="fade-up" className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#1d5750] block mb-2 font-semibold">
                  CERTIFIED BEAUTY THERAPIST · BIO
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
                  درباره هدی پژمان و استانداردهای کلینیک
                </h2>
                <p className="text-xs text-[#134e48] font-semibold mt-1">
                  {bio.title}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#7bc4bc]/25 space-y-3 hover:border-[#7bc4bc] shadow-2xs transition-colors">
                <h4 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <MicroscopeIcon className="w-4 h-4 text-[#7bc4bc]" />
                  <span>پیشینه علمی و رویکرد بیولوژیک</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {bio.academicBackground}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
                  <DiplomaIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                  <span>مدارک و سرتیفیکیت‌های بین‌المللی:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {bio.certificates.map((cert, idx) => {
                    const certIcons = [
                      <DiplomaIcon key="0" className="w-4 h-4 text-[#7bc4bc] mt-0.5 shrink-0" />,
                      <GraduationCapIcon key="1" className="w-4 h-4 text-[#7bc4bc] mt-0.5 shrink-0" />,
                      <SparklesIcon key="2" className="w-4 h-4 text-[#7bc4bc] mt-0.5 shrink-0" />,
                      <HandHeartIcon key="3" className="w-4 h-4 text-[#7bc4bc] mt-0.5 shrink-0" />
                    ];
                    return (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 flex items-start gap-2.5 hover:border-[#7bc4bc] hover:-translate-y-0.5 transition-all duration-300 shadow-2xs"
                      >
                        {certIcons[idx % certIcons.length]}
                        <span className="text-[#334155] leading-relaxed">{cert}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:border-[#7bc4bc]/40 transition-colors shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon className="w-4 h-4 text-[#7bc4bc]" />
                  </span>
                  <div>
                    <span className="text-[#64748b] block text-[11px]">موقعیت کلینیک:</span>
                    <strong className="text-[#0f172a]">{bio.location}</strong>
                    <p className="text-[10px] text-[#134e48] mt-0.5 font-medium">{bio.serviceArea}</p>
                  </div>
                </div>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0 hover:scale-105 active:scale-95"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>مشاهده اینستاگرام {bio.instagramHandle}</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WEEKLY AVAILABLE SLOTS & INTERACTIVE SCHEDULE GRID */}
      {/* ========================================================================= */}
      <WeeklyScheduleSection
        schedule={weeklySchedule}
        onSelectSlot={(slot) => setSelectedSlotForBooking(slot)}
      />

      {/* ========================================================================= */}
      {/* 3. SMART SKIN ANALYSIS & ROUTINE CONSULTATION */}
      {/* ========================================================================= */}
      <SkinAnalysisSection
        instagramHandle={bio.instagramHandle}
        onShowToast={showToast}
      />

      {/* ========================================================================= */}
      {/* 4. SPECIALIZED SERVICES & PACKAGES MENU */}
      {/* ========================================================================= */}
      <section id="services" className="py-20 sm:py-24 max-w-7xl mx-auto px-6 sm:px-12 font-vazir">
        <div className="space-y-12">
          
          <div data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl text-right">
              <span className="text-xs font-mono uppercase tracking-widest text-[#1d5750] block mb-2 font-semibold">
                CLINICAL PORTFOLIO & TREATMENT MENU
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight">
                منوی خدمات و پکیج‌های تخصصی
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-3 leading-relaxed">
                هر پروتکل درمانی با بررسی دقیق بیولوژیک سد دفاعی پوست و توسط هدی پژمان متناسب با نیاز بافت شما برنامه‌ریزی می‌شود.
              </p>
            </div>

            {/* Filter Tabs (Apple Segmented Style) */}
            <div className="flex items-center gap-2 bg-[#f0f9f8] p-1.5 rounded-2xl border border-[#7bc4bc]/30 text-xs self-start">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  serviceFilter === 'all'
                    ? 'bg-[#7bc4bc] text-white font-bold shadow-xs scale-102'
                    : 'text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                <SlidersIcon className="w-3.5 h-3.5" />
                <span>همه ({services.length})</span>
              </button>
              <button
                onClick={() => setServiceFilter('treatment')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  serviceFilter === 'treatment'
                    ? 'bg-[#7bc4bc] text-white font-bold shadow-xs scale-102'
                    : 'text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>درمان‌های تخصصی</span>
              </button>
              <button
                onClick={() => setServiceFilter('package')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  serviceFilter === 'package'
                    ? 'bg-[#7bc4bc] text-white font-bold shadow-xs scale-102'
                    : 'text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                <SpaIcon className="w-3.5 h-3.5" />
                <span>پکیج‌های ترکیبی</span>
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
      {/* 5. CLINICAL DEVICES & TECHNOLOGIES SECTION */}
      {/* ========================================================================= */}
      <ClinicalDevicesSection
        onInquireDevice={(deviceName) => handleOpenInstagramBooking(`مشاوره دستگاه ${deviceName}`)}
      />

      {/* ========================================================================= */}
      {/* 4. SOCIAL PROOF & TESTIMONIALS (APPLE LUXURY) */}
      {/* ========================================================================= */}
      <section id="reviews" className="py-20 sm:py-24 bg-white border-t border-[#7bc4bc]/20 font-vazir">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          <div data-aos="fade-up" className="max-w-xl mx-auto text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1d5750] block mb-2 font-semibold">
              CLIENT VOICES & FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
              تجربیات و بازخورد مراجعین
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2">
              نظرات واقعی مراجعین کلینیک درباره اثرات پروتکل‌های درمانی و استانداردهای بهداشتی.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((rev, idx) => (
              <div
                key={rev.id}
                data-aos="fade-up"
                data-aos-delay={idx * 120}
                className="bg-[#f8faf9] border border-slate-200/90 hover:border-[#7bc4bc] p-6 rounded-3xl relative flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#7bc4bc] text-xs mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5 text-[#7bc4bc]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed italic">
                    {rev.comment}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#0f172a]">{rev.name}</h4>
                        <CircleCheckIcon className="w-3.5 h-3.5 text-[#7bc4bc]" title="مراجع تأییدشده" />
                      </div>
                      <span className="text-[11px] text-[#64748b] block">{rev.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#134e48] font-mono mt-2 font-medium">
                    <SparklesIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" />
                    <span>خدمت: {rev.treatmentUsed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* INSTAGRAM SCHEDULING BANNER (MINT TEAL GRADIENT) */}
      {/* ========================================================================= */}
      <section data-aos="fade-up" className="py-20 sm:py-24 bg-gradient-to-t from-[#e6f4f2] to-[#f8faf9] border-t border-[#7bc4bc]/30 font-vazir">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white border border-[#7bc4bc]/40 text-[#7bc4bc] flex items-center justify-center text-2xl mx-auto shadow-md hover:scale-110 transition-transform duration-300">
            <InstagramIcon className="w-8 h-8 text-[#7bc4bc]" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            هماهنگی و مشاوره نوبت در دایرکت اینستاگرام
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto leading-relaxed">
            تمامی وقت‌های مشاوره و جلسات درمانی به صورت اختصاصی در دایرکت اینستاگرام ({bio.instagramHandle}) با بررسی پرونده و عکس پوست هماهنگ می‌گردند.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-[0_6px_20px_rgba(123,196,188,0.5)] flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 animate-glow-pulse"
            >
              <InstagramIcon className="w-4 h-4 text-white" />
              <span>ورود به دایرکت اینستاگرام ({bio.instagramHandle})</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(bio.instagramHandle);
                showToast(`آیدی کپی شد: ${bio.instagramHandle}`);
              }}
              className="px-6 py-3.5 bg-white hover:bg-[#f0f9f8] border border-[#7bc4bc]/40 text-[#134e48] font-semibold text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
            >
              <CopyIcon className="w-4 h-4 text-[#7bc4bc]" />
              <span className="font-mono">کپی آیدی {bio.instagramHandle}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER: APPLE MINIMALIST */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 py-16 text-xs text-[#64748b] font-vazir">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border border-[#7bc4bc]/60 flex items-center justify-center text-[#7bc4bc] bg-[#f0f9f8]">
                <SpaIcon className="w-4 h-4 text-[#7bc4bc]" />
              </span>
              <span className="font-bold text-sm tracking-wider text-[#0f172a]">
                {bio.name} · {bio.title}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#475569]">
              کلینیک و پورتفولیو تخصصی اسکین‌کر و فیشیال ارگانیک؛ کربوکسی‌تراپی، آکواپیل و جوانسازی بیولوژیک در زعفرانیه.
            </p>
            <div className="text-[10px] font-mono text-[#134e48] font-semibold flex items-center gap-1.5">
              <CertificateIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>CIDESCO SWITZERLAND · CERTIFIED 2026</span>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-xs font-bold text-[#0f172a] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <SpaIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>دسته‌بندی خدمات و تجهیزات</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5"><SparklesIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#services" className="hover:text-[#134e48] transition-colors">درمان لک و هایپرپیگمانتاسیون</a></li>
              <li className="flex items-center gap-1.5"><SparklesIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#services" className="hover:text-[#134e48] transition-colors">کربوکسی‌تراپی غیرتهاجمی بوهر</a></li>
              <li className="flex items-center gap-1.5"><SparklesIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#services" className="hover:text-[#134e48] transition-colors">آکواپیل و پاکسازی عمیق گردابی</a></li>
              <li className="flex items-center gap-1.5"><MicrochipIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#devices" className="hover:text-[#134e48] transition-colors text-[#134e48] font-medium">مشاهده ۴ فناوری و دستگاه بالینی</a></li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="text-xs font-bold text-[#0f172a] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <CalendarCheckIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>برنامه کاری و سانس‌ها</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5"><CalendarIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#schedule" className="hover:text-[#134e48] transition-colors">جدول سانس‌های هفتگی</a></li>
              <li className="flex items-center gap-1.5"><SunIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#schedule" className="hover:text-[#134e48] transition-colors">شیفت صبح: ۱۰:۰۰ الی ۱۳:۰۰</a></li>
              <li className="flex items-center gap-1.5"><CloudSunIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#schedule" className="hover:text-[#134e48] transition-colors">شیفت عصر: ۱۴:۰۰ الی ۱۷:۰۰</a></li>
              <li className="flex items-center gap-1.5"><MoonIcon className="w-3 h-3 text-[#7bc4bc] shrink-0" /><a href="#schedule" className="hover:text-[#134e48] transition-colors">شیفت غروب: ۱۷:۳۰ الی ۲۰:۳۰</a></li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="text-xs font-bold text-[#0f172a] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
              <span>کلینیک و موقعیت</span>
            </h4>
            <p className="text-[11px] leading-relaxed mb-2 text-[#334155] flex items-start gap-1.5">
              <LocationIcon className="w-3.5 h-3.5 text-[#7bc4bc] shrink-0 mt-0.5" />
              <span>{bio.location}</span>
            </p>
            <p className="text-[11px] font-mono text-[#134e48] font-semibold flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-[#7bc4bc] shrink-0" />
              <span>Instagram: {bio.instagramHandle}</span>
            </p>
            <p className="text-[11px] text-[#64748b] mt-1 flex items-center gap-1.5">
              <CrownIcon className="w-3.5 h-3.5 text-[#7bc4bc] shrink-0" />
              <span>محدوده: {bio.serviceArea}</span>
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© ۱۴۰۵ پورتفولیو و کلینیک اسکین‌کر {bio.name}. تمامی حقوق محفوظ است.</span>
          <div className="flex items-center gap-6 text-sm text-[#7bc4bc]">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#134e48] transition-colors"><InstagramIcon className="w-4 h-4" /></a>
            <a href="#top" aria-label="Telegram" className="hover:text-[#134e48] transition-colors"><TelegramIcon className="w-4 h-4" /></a>
            <a href="#top" aria-label="WhatsApp" className="hover:text-[#134e48] transition-colors"><WhatsAppIcon className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* SLOT BOOKING INSTAGRAM MODAL */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="bg-white border border-[#7bc4bc]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-6 animate-modal-in">
            
            <button
              onClick={() => setIsInstagramModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-[#f0f9f8] border border-[#7bc4bc]/40 text-[#7bc4bc] flex items-center justify-center text-3xl mx-auto shadow-xs">
              <InstagramIcon className="w-8 h-8 text-[#7bc4bc]" />
            </div>

            <div>
              <span className="text-[11px] font-mono text-[#1d5750] uppercase tracking-wider font-semibold">
                INSTAGRAM CONCIERGE
              </span>
              <h3 className="text-xl font-bold text-[#0f172a] mt-1">
                هماهنگی نوبت و مشاوره در اینستاگرام
              </h3>
              {inquiredItemTitle && (
                <div className="mt-2 inline-block bg-[#f0f9f8] border border-[#7bc4bc]/30 px-3 py-1 rounded-full text-xs text-[#134e48] font-medium">
                  درخواست برای: {inquiredItemTitle}
                </div>
              )}
            </div>

            <div className="text-right text-xs space-y-3 bg-[#f8faf9] p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] border border-[#7bc4bc]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquareIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#0f172a] block text-[11px]">مرحله اول: ارسال پیام و تصویر</span>
                  <p className="text-[#475569] leading-relaxed mt-0.5">
                    در دایرکت اینستاگرام {bio.instagramHandle} پیام دهید و عکس واضح پوست بدون آرایش یا دغدغه خود را ارسال نمایید.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] border border-[#7bc4bc]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <MicroscopeIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#0f172a] block text-[11px]">مرحله دوم: آنالیز و پیشنهاد پروتکل</span>
                  <p className="text-[#475569] leading-relaxed mt-0.5">
                    مشاور کلینیک شرایط پوست را با پروتکل‌های کربوکسی‌تراپی، آکواپیل، درمان لک یا جوانسازی تطبیق داده و زمان مناسب را پیشنهاد می‌دهد.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#f0f9f8] text-[#7bc4bc] border border-[#7bc4bc]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPinIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#0f172a] block text-[11px]">مرحله سوم: رزرو سانس در زعفرانیه</span>
                  <p className="text-[#475569] leading-relaxed mt-0.5">
                    نوبت شما در محیط آرام و بهداشتی کلینیک در زعفرانیه قطعی شده و لوکیشن دقیق ارسال می‌گردد.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#7bc4bc] hover:bg-[#68b5ac] text-white font-bold text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>ورود به دایرکت اینستاگرام ({bio.instagramHandle})</span>
              </a>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(bio.instagramHandle);
                  showToast(`آیدی کپی شد: ${bio.instagramHandle}`);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <CopyIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                <span>کپی نام کاربری ({bio.instagramHandle})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE DETAIL PROTOCOL MODAL */}
      {/* ========================================================================= */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="bg-white border border-[#7bc4bc]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-modal-in text-right">
            
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-mono text-[#1d5750] tracking-wider uppercase font-semibold">
                {selectedService.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
                {selectedService.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-[#64748b] mt-2">
                <span className="flex items-center gap-1">
                  <SpaIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                  <span>دسته‌بندی: <strong className="text-[#134e48]">{selectedService.categoryLabel}</strong></span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                  <span>مدت جلسه: <strong className="text-[#0f172a] font-mono">{selectedService.duration}</strong></span>
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#334155] leading-relaxed mb-6">
              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-[#7bc4bc]/20">
                <h4 className="text-[#134e48] font-bold mb-1 flex items-center gap-1.5">
                  <MicroscopeIcon className="w-4 h-4 text-[#7bc4bc]" />
                  <span>تکنیک و مکانیسم بیولوژیک اجرا:</span>
                </h4>
                <p>{selectedService.technique}</p>
              </div>

              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-[#7bc4bc]/20">
                <h4 className="text-[#134e48] font-bold mb-1 flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-[#7bc4bc]" />
                  <span>مزایا و نتایج مورد انتظار:</span>
                </h4>
                <p>{selectedService.benefits}</p>
              </div>

              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-[#7bc4bc]/20">
                <h4 className="text-[#134e48] font-bold mb-2 flex items-center gap-1.5">
                  <SeedlingIcon className="w-4 h-4 text-[#7bc4bc]" />
                  <span>مواد مؤثره دارویی و گیاهی:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedService.keyActives.map((act, i) => (
                    <span key={i} className="text-xs text-[#134e48] bg-white px-2.5 py-1 rounded-lg border border-[#7bc4bc]/30 font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                بستن
              </button>

              <button
                onClick={() => {
                  setSelectedService(null);
                  handleOpenInstagramBooking(selectedService.title);
                }}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#7bc4bc] hover:bg-[#68b5ac] rounded-2xl transition-all duration-300 cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95 shadow-sm"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-[#7bc4bc]/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-modal-in text-right">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden mb-4 h-80 sm:h-96 bg-[#f0f9f8]">
              <img
                src={heroThumbnails[activeThumbnail]?.img || heroThumbnails[0]?.img || ''}
                alt={heroThumbnails[activeThumbnail]?.title || heroThumbnails[0]?.title || ''}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#1d5750] uppercase font-semibold">{bio.name} ARCHIVE</span>
                <h3 className="text-base font-bold text-[#0f172a]">
                  {heroThumbnails[activeThumbnail]?.title || heroThumbnails[0]?.title || ''}
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {heroThumbnails[activeThumbnail]?.desc || heroThumbnails[0]?.desc || ''}
                </p>
              </div>

              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="px-4 py-2 bg-[#7bc4bc] text-white font-bold text-xs rounded-xl"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ELEGANT CIRCULAR 'BACK TO TOP' BUTTON (MINT-TEAL BRAND THEME) */}
      {/* ========================================================================= */}
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="بازگشت به ابتدای صفحه"
        title="بازگشت به بالای صفحه"
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-out focus:outline-none ${
          showBackToTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto shadow-[0_8px_28px_rgba(123,196,188,0.45)] hover:shadow-[0_14px_36px_rgba(123,196,188,0.6)] ring-4 ring-[#7bc4bc]/20'
            : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
        } bg-white/90 backdrop-blur-xl border border-[#7bc4bc]/50 text-[#134e48] hover:bg-[#7bc4bc] hover:text-white hover:border-[#7bc4bc] hover:-translate-y-1 active:scale-90`}
      >
        {/* Soft decorative glow ring */}
        <span className="absolute inset-0 rounded-full border border-[#7bc4bc]/30 group-hover:border-white/50 transition-colors pointer-events-none"></span>

        {/* Crisp up arrow with hover lift micro-interaction */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 group-hover:-translate-y-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

    </div>
  );
}
