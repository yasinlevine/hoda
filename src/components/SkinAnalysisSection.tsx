import React, { useState, useRef } from 'react';
import {
  CameraIcon,
  ImageIcon,
  InstagramIcon,
  CheckIcon,
  CircleCheckIcon,
  SunIcon,
  MoonIcon,
  RotateCcwIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ShieldIcon,
  DropletIcon,
  WandSparklesIcon,
  SpaIcon
} from './Icons';

interface SkinAnalysisSectionProps {
  instagramHandle: string;
  onShowToast: (msg: string) => void;
}

type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';

interface SkinConcern {
  id: string;
  label: string;
  desc: string;
}

const SKIN_CONCERNS: SkinConcern[] = [
  { id: 'barrier', label: 'آسیب سد دفاعی و قرمزی', desc: 'سوزش، پوسته ریزی و حساسیت مداوم' },
  { id: 'spots', label: 'لک و تیرگی (پیگمنتیشن)', desc: 'لک‌های آفتاب، جای جوش یا ملاسما' },
  { id: 'dehydration', label: 'دهیدراتگی و خطوط ریز', desc: 'احساس کشیدگی و کدر شدن بافت پوست' },
  { id: 'acne_pores', label: 'منافذ باز و جوش‌های فعال', desc: 'جوش‌های سرسیاه و ترشح بیش از حد سبوم' },
  { id: 'firmness', label: 'افتادگی و کاهش الاستیسیته', desc: 'کاهش کلاژن‌سازی و شلی فرم صورت' }
];

interface RoutineResult {
  skinTypeLabel: string;
  clinicTreatment: string;
  morningSteps: string[];
  nightSteps: string[];
  keyActives: string[];
  clinicalNote: string;
}

export const SkinAnalysisSection: React.FC<SkinAnalysisSectionProps> = ({
  instagramHandle,
  onShowToast
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [sunscreenUsage, setSunscreenUsage] = useState<string>('daily');
  const [ageGroup, setAgeGroup] = useState<string>('25-35');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Capture / Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        onShowToast('تصویر پوست با موفقیت بارگذاری شد.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleConcern = (id: string) => {
    setSelectedConcerns(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Generate Personalized Scientific Skincare Routine
  const generateRoutine = (): RoutineResult => {
    let skinTypeLabel = 'مختلط';
    if (selectedSkinType === 'dry') skinTypeLabel = 'خشک و دهیدراته';
    if (selectedSkinType === 'oily') skinTypeLabel = 'چرب و مستعد آکنه';
    if (selectedSkinType === 'sensitive') skinTypeLabel = 'حساس و دارای قرمزی مویرگی';
    if (selectedSkinType === 'normal') skinTypeLabel = 'نرمال و متعادل';

    // Tailored Clinic Recommendation
    let clinicTreatment = 'پروتکل فیتوتراپی و تقویت سد دفاعی لاملار';
    if (selectedConcerns.includes('spots')) {
      clinicTreatment = 'پروتکل کربوکسی‌تراپی و اسیدتراپی تخصصی روشن‌کننده';
    } else if (selectedConcerns.includes('acne_pores')) {
      clinicTreatment = 'فیشال آکواپیل عمیق و تخلیه کمدون‌های مسدود';
    } else if (selectedConcerns.includes('dehydration') || selectedSkinType === 'dry') {
      clinicTreatment = 'هیدراتاسیون چندلایه‌ای با سرم‌های بیولوژیک و ماسک جلبک';
    } else if (selectedConcerns.includes('firmness')) {
      clinicTreatment = 'کلاژن‌سازی غیرتهاجمی و ماساژ لیفتینگ لنفاوی';
    }

    // Morning Routine
    const morningSteps: string[] = [
      selectedSkinType === 'dry' ? 'شستشو با آب ولرم یا پاک‌کننده کرمی بسیار ملایم' : 'ژل شستشوی ملایم بدون سولفات',
      selectedConcerns.includes('spots')
        ? 'سرم ویتامین C پایدار یا نیاسینامید ۴٪'
        : 'سرم آبرسان هیالورونیک اسید با وزن مولکولی چندگانه',
      'کرم مرطوب‌کننده بر پایه سد دفاعی (حاوی سرامید و اسکوالن)',
      'ضدآفتاب ضد اشعه وسیع‌الطیف (SPF 50+) هر ۳ ساعت تمدید'
    ];

    // Night Routine
    const nightSteps: string[] = [
      'میسلار واتر یا بالم روغنی جهت پاکسازی کامل ضدآفتاب و آلودگی شهری',
      selectedSkinType === 'oily'
        ? 'فوم شوینده تنظیم‌کننده سبوم و ضد باکتری'
        : 'شوینده آب‌رسان آرامش‌بخش سد دفاعی',
      selectedConcerns.includes('barrier')
        ? 'سرم ترمیم‌کننده سنتلا آسیاتیکا و پپتیدهای زیست‌سازگار'
        : selectedConcerns.includes('spots')
        ? 'سرم ضدلک ترانگزامیک اسید یا آزلائیک اسید ۱۰٪'
        : 'سرم آبرسان شبانه و روغن فیتو ارگانیک',
      'کرم بازسازی‌کننده شب با بافت لاملار جهت ترمیم لیپیدهای پوستی'
    ];

    // Key Actives
    const keyActives: string[] = [
      'سرامید NP',
      selectedConcerns.includes('spots') ? 'آربوتین و ویتامین C' : 'سنتلا آسیاتیکا',
      selectedSkinType === 'oily' ? 'زینک PCA' : 'اسکوالن گیاهی',
      'پپتیدهای مس'
    ];

    const clinicalNote = selectedConcerns.includes('barrier')
      ? 'سد دفاعی پوست شما نیازمند توقف مصرف هرگونه اسید لایه‌بردار قوی و تمرکز بر بازسازی سد لیپیدی است.'
      : 'برای تثبیت نتایج، انجام دوره درمان کربوکسی‌تراپی و پاکسازی دوره‌ای در کلینیک پیشنهاد می‌گردد.';

    return {
      skinTypeLabel,
      clinicTreatment,
      morningSteps,
      nightSteps,
      keyActives,
      clinicalNote
    };
  };

  const routine = generateRoutine();

  // Create Formatted Text for Instagram Direct
  const handleSendToInstagram = () => {
    const concernsText = selectedConcerns.length > 0
      ? selectedConcerns.map(c => SKIN_CONCERNS.find(sc => sc.id === c)?.label).join('، ')
      : 'سلامت عمومی و پیشگیری';

    const textToCopy = `سلام خانم هدی پژمان عزیز،
من از طریق وب‌سایت آنالیز آنلاین پوست شما را انجام دادم. خلاصه وضعیت پوست من:

• نوع پوست: ${routine.skinTypeLabel}
• سن: ${ageGroup}
• دغدغه‌های اصلی: ${concernsText}
• درمان پیشنهادی سایت: ${routine.clinicTreatment}
• سابقه تصویر پوست: ${userImage ? 'تصویر پوست را در همین پیام ارسال می‌کنم' : 'تصویر را بعد از مشورت ارسال خواهم کرد'}

ممنون می‌شوم در صورت امکان نوبت مشاوره حضوری یا بررسی این روتین را با من هماهنگ بفرمایید.`;

    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
      }
    } catch {
      // ignore
    }

    setIsCopied(true);
    onShowToast('خلاصه آنالیز کپی شد! در حال انتقال به دایرکت اینستاگرام هدی پژمان...');

    setTimeout(() => {
      window.open(`https://www.instagram.com/${instagramHandle}/`, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setUserImage(null);
    setSelectedSkinType(null);
    setSelectedConcerns([]);
    setIsCopied(false);
  };

  return (
    <section id="skin-analysis" className="py-16 sm:py-24 bg-[#1e221b] border-t border-[#363d33] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-semibold text-[#a3b18a] bg-[#a3b18a]/10 border border-[#a3b18a]/30 px-3.5 py-1.5 rounded-full inline-block mb-3">
            آنالیز آنلاین بیوتی‌تراپی
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
            آنالیز هوشمند پوست و تجویز روتین اختصاصی
          </h2>
          <p className="text-xs sm:text-sm text-[#e2e8f0]/80 mt-3 leading-relaxed">
            با تکمیل این ارزیابی بالینی و ارسال تصویر، توصیه‌های اختصاصی مراقبت صبح و شب را دریافت کرده و با یک کلیک برای هدی پژمان در دایرکت اینستاگرام ارسال نمایید.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#242922] border border-[#a3b18a]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Step Progress Indicator (Steps 1 to 4) */}
          {currentStep > 0 && currentStep < 5 && (
            <div className="mb-8 pb-6 border-b border-[#363d33]">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2.5">
                <span>مرحله {currentStep} از ۴</span>
                <span className="text-[#a3b18a] font-medium">
                  {currentStep === 1 && 'تصویر پوست (اختیاری)'}
                  {currentStep === 2 && 'نوع پوست و ترشح چربی'}
                  {currentStep === 3 && 'دغدغه‌ها و نیازهای بالینی'}
                  {currentStep === 4 && 'سبک زندگی و سابقه'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#1e221b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#a3b18a] transition-all duration-500 rounded-full"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 0: WELCOME & START SCREEN */}
          {/* ================================================================= */}
          {currentStep === 0 && (
            <div className="text-center py-6 sm:py-10 space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-[#1e221b] border-2 border-[#a3b18a]/50 text-[#a3b18a] flex items-center justify-center text-3xl mx-auto shadow-xl">
                <CameraIcon className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
                  مشاوره هوشمند پوست در کمتر از ۲ دقیقه
                </h3>
                <p className="text-xs sm:text-sm text-[#e2e8f0]/80 mt-2.5 leading-relaxed">
                  بر اساس استانداردهای بین‌المللی مراقبت از پوست و متدهای بالینی هدی پژمان در زعفرانیه، روتین متناسب با فیزیولوژی چهره خود را دریافت کنید.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right text-xs text-[#e2e8f0]/90 pt-2">
                <div className="bg-[#1e221b] p-3.5 rounded-2xl border border-[#363d33]">
                  <CameraIcon className="w-5 h-5 text-[#a3b18a] mb-1.5" />
                  <span className="font-bold block text-[#f1f5f9]">۱. تصویر پوست</span>
                  <span className="text-[11px] text-gray-400">آپلود یا دوربین (اختیاری)</span>
                </div>
                <div className="bg-[#1e221b] p-3.5 rounded-2xl border border-[#363d33]">
                  <ShieldCheckIcon className="w-5 h-5 text-[#a3b18a] mb-1.5" />
                  <span className="font-bold block text-[#f1f5f9]">۲. پرسشنامه بالینی</span>
                  <span className="text-[11px] text-gray-400">تشخیص نوع و آسیب سد دفاعی</span>
                </div>
                <div className="bg-[#1e221b] p-3.5 rounded-2xl border border-[#363d33]">
                  <InstagramIcon className="w-5 h-5 text-[#a3b18a] mb-1.5" />
                  <span className="font-bold block text-[#f1f5f9]">۳. ارسال به دایرکت</span>
                  <span className="text-[11px] text-gray-400">هماهنگی نوبت با هدی پژمان</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-2xl transition-all duration-300 shadow-lg cursor-pointer hover:scale-102 active:scale-98 flex items-center justify-center gap-2 mx-auto"
                >
                  <span>شروع آنالیز آنلاین پوست</span>
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 1: CAMERA / IMAGE UPLOAD (OPTIONAL) */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-lg font-bold text-[#f1f5f9]">
                  مرحله ۱: تصویر بدون آرایش پوست (اختیاری)
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  ارسال یک تصویر واضح از صورت در نور طبیعی، به تشخیص دقیق‌تر منافذ، لک‌ها و خشکی پوست کمک شایانی می‌کند.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="user"
                onChange={handleImageChange}
                className="hidden"
              />

              {userImage ? (
                <div className="bg-[#1e221b] p-4 rounded-2xl border border-[#a3b18a]/40 flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={userImage}
                    alt="Skin preview"
                    className="w-28 h-28 object-cover rounded-xl border border-[#363d33] shadow-md"
                  />
                  <div className="flex-1 text-center sm:text-right space-y-2">
                    <span className="text-xs text-[#a3b18a] font-bold flex items-center justify-center sm:justify-start gap-1.5">
                      <CircleCheckIcon className="w-4 h-4 text-[#a3b18a]" />
                      تصویر شما با موفقیت ثبت شد
                    </span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      این تصویر تنها روی مرورگر شما پردازش می‌شود و در دایرکت اینستاگرام قابل ارسال خواهد بود.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#a3b18a] hover:underline cursor-pointer"
                      >
                        تغییر تصویر
                      </button>
                      <button
                        onClick={() => setUserImage(null)}
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        حذف تصویر
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Camera Option */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-2xl bg-[#1e221b] hover:bg-[#282e25] border-2 border-dashed border-[#a3b18a]/40 hover:border-[#a3b18a] transition-all flex flex-col items-center justify-center gap-3 cursor-pointer text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#242922] text-[#a3b18a] group-hover:scale-110 flex items-center justify-center text-xl transition-transform shadow-inner">
                      <CameraIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#f1f5f9] block">استفاده از دوربین سلفی</span>
                      <span className="text-[11px] text-gray-400">عکس زنده از پوست بدون آرایش</span>
                    </div>
                  </button>

                  {/* Upload from Gallery Option */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-2xl bg-[#1e221b] hover:bg-[#282e25] border border-[#363d33] hover:border-[#a3b18a]/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#242922] text-gray-300 group-hover:text-[#a3b18a] group-hover:scale-110 flex items-center justify-center text-xl transition-transform shadow-inner">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#f1f5f9] block">انتخاب از گالری گوشی</span>
                      <span className="text-[11px] text-gray-400">فایل تصویر از حافظه دستگاه</span>
                    </div>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#363d33]">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  بازگشت
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-[#a3b18a] cursor-pointer"
                  >
                    رد کردن این مرحله (بدون عکس)
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    مرحله بعد
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: SKIN TYPE SELECTION */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-lg font-bold text-[#f1f5f9]">
                  مرحله ۲: بافت و میزان ترشح چربی پوست شما چگونه است؟
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  نزدیک‌ترین وضعیت پوست خود را پس از چند ساعت از شستشو انتخاب کنید.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'oily',
                    title: 'پوست چرب و براق',
                    desc: 'ترشح چربی در کل صورت، منافذ مشهود و تمایل به جوش',
                    iconComp: <DropletIcon className="w-4 h-4" />
                  },
                  {
                    id: 'combination',
                    title: 'پوست مختلط (T-Zone)',
                    desc: 'چربی روی بینی و پیشانی، اما خشکی یا تعادل روی گونه‌ها',
                    iconComp: <SpaIcon className="w-4 h-4" />
                  },
                  {
                    id: 'dry',
                    title: 'پوست خشک و دهیدراته',
                    desc: 'احساس کشیدگی مداوم، زبری، پوسته ریزی و کمبود لطافت',
                    iconComp: <SunIcon className="w-4 h-4" />
                  },
                  {
                    id: 'sensitive',
                    title: 'پوست حساس و واکنشی',
                    desc: 'سوزش، خارش، قرمزی سریع در برابر سرما، گرما یا محصولات',
                    iconComp: <ShieldIcon className="w-4 h-4" />
                  },
                  {
                    id: 'normal',
                    title: 'پوست نرمال و متعادل',
                    desc: 'بافت یکنواخت، بدون کشیدگی یا چربی اضافه، منافذ کنترل‌شده',
                    iconComp: <WandSparklesIcon className="w-4 h-4" />
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSkinType(item.id as SkinType)}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      selectedSkinType === item.id
                        ? 'bg-[#283025] border-[#a3b18a] shadow-lg shadow-[#a3b18a]/10 ring-1 ring-[#a3b18a]'
                        : 'bg-[#1e221b] border-[#363d33] hover:border-[#a3b18a]/40 hover:bg-[#222820]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                          selectedSkinType === item.id ? 'bg-[#a3b18a] text-[#1e221b]' : 'bg-[#242922] text-[#a3b18a]'
                        }`}>
                          {item.iconComp}
                        </span>
                        {selectedSkinType === item.id && (
                          <CircleCheckIcon className="w-4 h-4 text-[#a3b18a]" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#f1f5f9]">{item.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#363d33]">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  بازگشت
                </button>
                <button
                  disabled={!selectedSkinType}
                  onClick={() => setCurrentStep(3)}
                  className={`px-6 py-2.5 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer ${
                    selectedSkinType
                      ? 'bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b]'
                      : 'bg-[#363d33] text-gray-500 cursor-not-allowed'
                  }`}
                >
                  مرحله بعد
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: SKIN CONCERNS MULTI-SELECT */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-lg font-bold text-[#f1f5f9]">
                  مرحله ۳: چه دغدغه‌هایی را مایلید در اولویت درمان قرار دهید؟
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  می‌توانید یک یا چند مورد از اهداف بالینی خود را انتخاب نمایید.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SKIN_CONCERNS.map(item => {
                  const isChecked = selectedConcerns.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleConcern(item.id)}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-[#283025] border-[#a3b18a] ring-1 ring-[#a3b18a]'
                          : 'bg-[#1e221b] border-[#363d33] hover:border-[#a3b18a]/40'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                        isChecked ? 'bg-[#a3b18a] border-[#a3b18a] text-[#1e221b]' : 'border-gray-500 bg-[#242922]'
                      }`}>
                        {isChecked && <CheckIcon className="w-3.5 h-3.5" />}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-[#f1f5f9]">{item.label}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#363d33]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  بازگشت
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  مرحله بعد
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: HABITS & AGE GROUP */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-lg font-bold text-[#f1f5f9]">
                  مرحله ۴: سبک زندگی و محدوده سنی
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  اطلاعات نهایی جهت تطبیق پپتیدها و آنتی‌اکسیدان‌های مورد نیاز
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">رده سنی شما:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['زیر ۲۵ سال', '۲۵ تا ۳۵ سال', '۳۵ تا ۴۵ سال', 'بالای ۴۵ سال'].map((age, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAgeGroup(age)}
                        className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                          ageGroup === age
                            ? 'bg-[#a3b18a] text-[#1e221b] border-[#a3b18a]'
                            : 'bg-[#1e221b] text-gray-300 border-[#363d33] hover:border-[#a3b18a]/40'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">میزان استفاده روزانه از ضدآفتاب:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'daily', label: 'هر روز و تمدید منظم' },
                      { id: 'sometimes', label: 'گاهی اوقات هنگام خروج از منزل' },
                      { id: 'rarely', label: 'به ندرت یا اصلاً استفاده نمی‌کنم' }
                    ].map(sun => (
                      <button
                        key={sun.id}
                        type="button"
                        onClick={() => setSunscreenUsage(sun.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                          sunscreenUsage === sun.id
                            ? 'bg-[#a3b18a] text-[#1e221b] border-[#a3b18a]'
                            : 'bg-[#1e221b] text-gray-300 border-[#363d33] hover:border-[#a3b18a]/40'
                        }`}
                      >
                        {sun.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#363d33]">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  بازگشت
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-3 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98 flex items-center gap-1.5"
                >
                  <WandSparklesIcon className="w-4 h-4 ml-1" />
                  <span>مشاهده نتایج و روتین پیشنهادی</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: FINAL ROUTINE REPORT & INSTAGRAM CONCIERGE */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6 text-right animate-fade-in">
              
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#363d33]">
                <div>
                  <span className="text-[11px] font-semibold text-[#a3b18a] bg-[#a3b18a]/10 px-3 py-1 rounded-full border border-[#a3b18a]/30">
                    گزارش بالینی شخصی‌سازی شده
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] mt-2">
                    روتین تجویزی و پروتکل کلینیکی هدی پژمان
                  </h3>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcwIcon className="w-3.5 h-3.5" />
                  <span>شروع مجدد آنالیز</span>
                </button>
              </div>

              {/* Photo & Diagnostic Summary */}
              <div className="bg-[#1e221b] p-5 rounded-2xl border border-[#363d33] flex flex-col sm:flex-row items-center gap-4">
                {userImage && (
                  <img
                    src={userImage}
                    alt="Analyzed skin"
                    className="w-20 h-20 rounded-xl object-cover border border-[#a3b18a]/40 shrink-0"
                  />
                )}
                <div className="space-y-1.5 text-xs text-gray-300">
                  <div>
                    <span className="text-gray-400">تیپ پوستی تشخیص‌داده‌شده: </span>
                    <strong className="text-[#a3b18a] font-bold text-sm">{routine.skinTypeLabel}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">درمان تخصصی پیشنهادی داخل کلینیک: </span>
                    <strong className="text-white font-bold">{routine.clinicTreatment}</strong>
                  </div>
                  <p className="text-[11px] text-[#e2e8f0]/70 pt-1 leading-relaxed">
                    {routine.clinicalNote}
                  </p>
                </div>
              </div>

              {/* Key Actives Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#a3b18a] block">مواد مؤثره کلیدی در این نسخه:</span>
                <div className="flex flex-wrap gap-2">
                  {routine.keyActives.map((act, i) => (
                    <span key={i} className="text-xs bg-[#1e221b] text-[#f1f5f9] px-3 py-1.5 rounded-xl border border-[#363d33]">
                      🌿 {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Morning vs Night Routine Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Morning */}
                <div className="bg-[#1e221b] p-5 rounded-2xl border border-[#363d33] space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold border-b border-[#363d33] pb-2.5">
                    <SunIcon className="w-4 h-4 text-amber-300" />
                    <span>روتین صبحگاهی (محافظت و آبرسانی)</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-[#e2e8f0]/90">
                    {routine.morningSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#242922] text-[#a3b18a] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Night */}
                <div className="bg-[#1e221b] p-5 rounded-2xl border border-[#363d33] space-y-3">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-bold border-b border-[#363d33] pb-2.5">
                    <MoonIcon className="w-4 h-4 text-sky-300" />
                    <span>روتین شبانگاهی (بازسازی سد دفاعی)</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-[#e2e8f0]/90">
                    {routine.nightSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#242922] text-[#a3b18a] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Send to Instagram Direct */}
              <div className="bg-[#2a3026] border border-[#a3b18a]/50 p-6 rounded-2xl text-center space-y-4 shadow-xl">
                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="text-sm font-bold text-white">
                    ارسال نتایج به دایرکت اینستاگرام هدی پژمان
                  </h4>
                  <p className="text-[11px] text-[#e2e8f0]/80 leading-relaxed">
                    با زدن دکمه زیر، خلاصه این نسخه در کلیپ‌بورد کپی شده و صفحه دایرکت اینستاگرام برای هماهنگی وقت کلینیک باز می‌شود.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <button
                    onClick={handleSendToInstagram}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#a3b18a] hover:bg-[#b5c49b] text-[#1e221b] font-bold text-xs sm:text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  >
                    <InstagramIcon className="w-5 h-5" />
                    <span>
                      {isCopied ? 'کپی شد! در حال انتقال به دایرکت...' : `ارسال خلاصه روتین به دایرکت (${instagramHandle})`}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
