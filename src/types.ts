// Image assets for luxury facial clinic
import heroModelImg from './assets/images/hero_calm_model_1791131706401.jpg';
import creamSwatchesImg from './assets/images/cream_swatches_1791131717732.jpg';
import creamRibbonTubeImg from './assets/images/cream_ribbon_tube_1791131730751.jpg';
import apothecaryPedestalImg from './assets/images/apothecary_pedestal_1791131741408.jpg';
import clinicInteriorImg from './assets/images/clinic_interior_sage_1791130976626.jpg';
import botanicalSerumImg from './assets/images/botanical_serum_stone_1791130988275.jpg';

export const INSTAGRAM_URL = 'https://www.instagram.com/hodapezhman_skincare';
export const INSTAGRAM_DIRECT_URL = 'https://ig.me/m/hodapezhman_skincare';
export const INSTAGRAM_HANDLE = '@hodapezhman_skincare';

export interface ServiceItem {
  id: string;
  category: 'treatment' | 'package';
  categoryLabel: string;
  title: string;
  subtitle: string;
  technique: string;
  benefits: string;
  duration: string;
  keyActives: string[];
  image: string;
}

export type DayKey = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
export type ShiftKey = 'morning' | 'afternoon' | 'evening';

export interface WeeklySlot {
  id: string; // e.g. "sat-morning"
  dayKey: DayKey;
  dayName: string; // "شنبه"
  dayEn: string; // "Saturday"
  shiftKey: ShiftKey;
  shiftName: string; // "سانس صبح"
  shiftTime: string; // "۱۰:۰۰ الی ۱۳:۰۰"
  status: 'available' | 'booked';
  note?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  comment: string;
  treatmentUsed: string;
  rating: number;
}

export interface TherapistBio {
  name: string;
  title: string;
  academicBackground: string;
  certificates: string[];
  location: string;
  serviceArea: string;
  instagramHandle: string;
  experienceYears: string;
}

export const WEEK_DAYS: { key: DayKey; name: string; enName: string }[] = [
  { key: 'sat', name: 'شنبه', enName: 'Saturday' },
  { key: 'sun', name: 'یکشنبه', enName: 'Sunday' },
  { key: 'mon', name: 'دوشنبه', enName: 'Monday' },
  { key: 'tue', name: 'سه‌شنبه', enName: 'Tuesday' },
  { key: 'wed', name: 'چهارشنبه', enName: 'Wednesday' },
  { key: 'thu', name: 'پنج‌شنبه', enName: 'Thursday' },
  { key: 'fri', name: 'جمعه', enName: 'Friday' },
];

export const SHIFTS_CONFIG: {
  key: ShiftKey;
  name: string;
  timeRange: string;
  icon: string;
  subtitle: string;
}[] = [
  { key: 'morning', name: 'سانس صبح', timeRange: '۱۰:۰۰ الی ۱۳:۰۰', icon: 'fa-sun', subtitle: 'شیفت اول' },
  { key: 'afternoon', name: 'سانس عصر', timeRange: '۱۴:۰۰ الی ۱۷:۰۰', icon: 'fa-cloud-sun', subtitle: 'شیفت دوم' },
  { key: 'evening', name: 'سانس غروب', timeRange: '۱۷:۳۰ الی ۲۰:۳۰', icon: 'fa-moon', subtitle: 'شیفت سوم' },
];

export const DEFAULT_BIO: TherapistBio = {
  name: 'هدی پژمان',
  title: 'بیوتی تراپیست / متخصص اسکین‌کر',
  academicBackground: 'دانش‌آموخته زیست‌شناسی سلولی و مولکولی و پژوهشگر سد دفاعی پوست با بیش از ۱۰ سال فعالیت بالینی در حوزه فیشیال، کربوکسی‌تراپی و زیبایی‌شناسی غیرتهاجمی.',
  certificates: [
    'گواهینامه بین‌المللی استتیک و اسکین‌کر از آکادمی CIDESCO سوئیس',
    'مدرک مستری و مهارت تخصصی فیشیال پیشرفته از سازمان فنی و حرفه‌ای کشور',
    'سرتیفیکیت دوره‌های تخصصی کربوکسی‌تراپی و اکسیژن‌تراپی از بارسلون اسپانیا',
    'گواهینامه تکنیک‌های تخصصی ماساژ درناژ لنفاوی دستی (Vodder) از مونیخ آلمان'
  ],
  location: 'تهران، منطقه ۱، زعفرانیه، خیابان مقدس اردبیلی',
  serviceArea: 'پوشش تخصصی مناطق زعفرانیه، الهیه، فرشته، محمودیه و ولنجک در محیط استریل و VIP',
  instagramHandle: '@hodapezhman_skincare',
  experienceYears: '۱۰+ سال'
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'dark-spot-treatment',
    category: 'treatment',
    categoryLabel: 'درمان تخصصی',
    title: 'درمان تخصصی لک و هایپرپیگمانتاسیون',
    subtitle: 'Advanced Dark Spot & Melasma Control',
    technique: 'تلفیق پیلینگ ملایم با کوکتل‌های مهارکننده تیروزیناز (ترانگزامیک اسید و گلوتاتیون) همراه با فوتوتراپی هدفمند.',
    benefits: 'کاهش لک‌های ناشی از آفتاب و ملاسما، مهار لک‌های هورمونی و روشن‌سازی یکنواخت تنالیته چهره بدون سوختگی یا تیرگی برگشتی.',
    duration: '۷۵ دقیقه',
    keyActives: ['ترانگزامیک اسید ۳٪', 'آلفا آربوتین', 'گلوتاتیون خالص', 'نیاسینامید ۵٪'],
    image: creamRibbonTubeImg
  },
  {
    id: 'carboxytherapy',
    category: 'treatment',
    categoryLabel: 'درمان تخصصی',
    title: 'کربوکسی‌تراپی غیرتهاجمی و اکسیژن‌رسانی عمیق',
    subtitle: 'Non-Invasive CO2 Carboxytherapy',
    technique: 'استفاده از ژل فرموله شده با CO2 فعال و ماسک فعال‌کننده که با اثر بوهر (Bohr Effect) اکسیژن را از خون به بافت منتقل می‌کند.',
    benefits: 'بهبود فوری خونرسانی مویرگی، دفع سموم بافت، کاهش تیرگی دور چشم و لیفتینگ طبیعی پوست از طریق تحریک موضعی نئوکلاژنز.',
    duration: '۶۰ دقیقه',
    keyActives: ['دی‌اکسید کربن فعال دارویی', 'عصاره چای سبز', 'اسیدهای آمینه ضروری', 'هیالورونات سدیم'],
    image: clinicInteriorImg
  },
  {
    id: 'rejuvenation',
    category: 'treatment',
    categoryLabel: 'درمان تخصصی',
    title: 'جوانسازی و کلاژن‌سازی بیولوژیک',
    subtitle: 'Bio-Cellular Rejuvenation & Peptides',
    technique: 'تزریق بدون سوزن (نانوکانالینگ) فاکتورهای رشد گیاهی، الیگوپپتیدهای مس و محرک‌های بیوسنتز الاستین در درم میانی.',
    benefits: 'پر شدن خطوط ریز پنجه‌کلاغی، بازگشت الاستیسیته بافت پوستی و سفتی قابل لمس گونه‌ها با تحریک فیبروبلاست‌های خود پوست.',
    duration: '۸۰ دقیقه',
    keyActives: ['پپتید مس GHK-Cu', 'ماتریکسیل ۳۰۰۰', 'الاستین دریایی', 'عصاره سلول بنیادی رازیانه کوهی'],
    image: heroModelImg
  },
  {
    id: 'aquapeel',
    category: 'treatment',
    categoryLabel: 'درمان تخصصی',
    title: 'آکواپیل و پاکسازی عمقی هیدروفیشیال',
    subtitle: 'Hydro-Dermabrasion & Aquapeel Matrix',
    technique: 'لایه‌برداری گردابی وکیوم با محلول‌های سالیسیلیک اسید و گلیکولیک گیاهی همراه با آبرسانی پرفشار سرم‌های آنتی‌اکسیدان.',
    benefits: 'تخلیه کامل جوش‌های سرسیاه و کمدون‌های بسته بدون ایجاد درد یا اسکار، جمع‌شدن منافذ باز و ایجاد سطحی صاف و درخشان.',
    duration: '۶۰ دقیقه',
    keyActives: ['AHA طبیعی نیشکر', 'BHA بید سفید', 'عصاره سنتلا آسیاتیکا', 'آب معدنی ایزوتونیک'],
    image: apothecaryPedestalImg
  },
  {
    id: 'acne-sebum-package',
    category: 'package',
    categoryLabel: 'پکیج تخصصی',
    title: 'پکیج تخصصی کنترل چربی و درمان آکنه',
    subtitle: 'Targeted Sebum Regulation & Acne Defense',
    technique: 'پروتکل ۳ مرحله‌ای شامل سم‌زدایی آنزیمی، هایفرکوئنسی آنتی‌باکتریال جهت مهار باکتری P.acnes و ماسک خاک رس کائولن دارویی.',
    benefits: 'متعادل‌سازی ترشح چربی غدد سباسه، خشک‌کردن جوش‌های التهابی فعال و مهار لک‌های قرمز پس از آکنه (PIE) بدون نازک‌شدن سد دفاعی.',
    duration: '۹۰ دقیقه',
    keyActives: ['زینک PCA ۲٪', 'نیاسینامید دارویی', 'روغن درخت چای با درجه پزشکی', 'خاک رس سبز کائولن'],
    image: creamSwatchesImg
  },
  {
    id: 'hydration-brightening-package',
    category: 'package',
    categoryLabel: 'پکیج تخصصی',
    title: 'پکیج آبرسانی عمیق و شفاف‌سازی سد دفاعی',
    subtitle: 'Deep Dermal Hydration & Luminous Shield',
    technique: 'تلفیق سرم‌های سرامیدی ۳وزنی با اولتراسوند درمانی، ماساژ گواشا با سنگ یشم طبیعی و ماسک جلبک اسپیرولینا خنک‌کننده.',
    benefits: 'درمان کامل خشکی مزمن و کشیدگی پوست، قفل شدن رطوبت تا ۷۲ ساعت و درخشش طبیعی پوست بر پایه تقویت سرامیدهای سد دفاعی.',
    duration: '۸۵ دقیقه',
    keyActives: ['سرامیدهای بیومیمتیک ۱ و ۳', 'اسکوالن ۱۰۰٪ نیشکر', 'هیالورونیک اسید با ۳ وزن مولکولی', 'ویتامین B5'],
    image: botanicalSerumImg
  }
];

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySlot[] = [
  // شنبه (Saturday)
  { id: 'sat-morning', dayKey: 'sat', dayName: 'شنبه', dayEn: 'Saturday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'sat-afternoon', dayKey: 'sat', dayName: 'شنبه', dayEn: 'Saturday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'booked', note: 'تکمیل ظرفیت' },
  { id: 'sat-evening', dayKey: 'sat', dayName: 'شنبه', dayEn: 'Saturday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'available', note: 'قابل رزرو' },

  // یکشنبه (Sunday)
  { id: 'sun-morning', dayKey: 'sun', dayName: 'یکشنبه', dayEn: 'Sunday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'sun-afternoon', dayKey: 'sun', dayName: 'یکشنبه', dayEn: 'Sunday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'sun-evening', dayKey: 'sun', dayName: 'یکشنبه', dayEn: 'Sunday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'booked', note: 'تکمیل ظرفیت' },

  // دوشنبه (Monday)
  { id: 'mon-morning', dayKey: 'mon', dayName: 'دوشنبه', dayEn: 'Monday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'booked', note: 'تکمیل ظرفیت' },
  { id: 'mon-afternoon', dayKey: 'mon', dayName: 'دوشنبه', dayEn: 'Monday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'mon-evening', dayKey: 'mon', dayName: 'دوشنبه', dayEn: 'Monday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'available', note: 'قابل رزرو' },

  // سه‌شنبه (Tuesday)
  { id: 'tue-morning', dayKey: 'tue', dayName: 'سه‌شنبه', dayEn: 'Tuesday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'tue-afternoon', dayKey: 'tue', dayName: 'سه‌شنبه', dayEn: 'Tuesday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'booked', note: 'تکمیل ظرفیت' },
  { id: 'tue-evening', dayKey: 'tue', dayName: 'سه‌شنبه', dayEn: 'Tuesday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'available', note: 'قابل رزرو' },

  // چهارشنبه (Wednesday)
  { id: 'wed-morning', dayKey: 'wed', dayName: 'چهارشنبه', dayEn: 'Wednesday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'wed-afternoon', dayKey: 'wed', dayName: 'چهارشنبه', dayEn: 'Wednesday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'wed-evening', dayKey: 'wed', dayName: 'چهارشنبه', dayEn: 'Wednesday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'booked', note: 'تکمیل ظرفیت' },

  // پنج‌شنبه (Thursday)
  { id: 'thu-morning', dayKey: 'thu', dayName: 'پنج‌شنبه', dayEn: 'Thursday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'thu-afternoon', dayKey: 'thu', dayName: 'پنج‌شنبه', dayEn: 'Thursday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'available', note: 'قابل رزرو' },
  { id: 'thu-evening', dayKey: 'thu', dayName: 'پنج‌شنبه', dayEn: 'Thursday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'booked', note: 'تکمیل ظرفیت' },

  // جمعه (Friday)
  { id: 'fri-morning', dayKey: 'fri', dayName: 'جمعه', dayEn: 'Friday', shiftKey: 'morning', shiftName: 'سانس صبح', shiftTime: '۱۰:۰۰ الی ۱۳:۰۰', status: 'booked', note: 'تعطیل / تکمیل' },
  { id: 'fri-afternoon', dayKey: 'fri', dayName: 'جمعه', dayEn: 'Friday', shiftKey: 'afternoon', shiftName: 'سانس عصر', shiftTime: '۱۴:۰۰ الی ۱۷:۰۰', status: 'booked', note: 'تعطیل / تکمیل' },
  { id: 'fri-evening', dayKey: 'fri', dayName: 'جمعه', dayEn: 'Friday', shiftKey: 'evening', shiftName: 'سانس غروب', shiftTime: '۱۷:۳۰ الی ۲۰:۳۰', status: 'booked', note: 'تعطیل / تکمیل' }
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'review-1',
    name: 'مریم کمالی',
    role: 'طراح لباس و مدیر برندینگ',
    comment: '«بعد از دو سال درگیری با لک‌های سرسخت بارداری، با ۳ جلسه کربوکسی تراپی و پیلینگ تخصصی خانم هدی پژمان پوستم مثل دوران قبل از زایمان شفاف شد. واقعاً علمی و بدون مواد خشن کار می‌کنند.»',
    treatmentUsed: '۳ جلسه درمان لک و کربوکسی‌تراپی',
    rating: 5
  },
  {
    id: 'review-2',
    name: 'سحر اردلان',
    role: 'مهندس معمار',
    comment: '«پکیج کنترل چربی و آکواپیل نجات‌دهنده من بود. پوست چرب من همیشه بعد از پاکسازی‌های مراکز دیگر ملتهب می‌شد، اما اینجا تکنیک وکیوم و آرامش فضا حس فوق‌العاده‌ای داشت و منافذم کاملاً تمیز شدند.»',
    treatmentUsed: 'پکیج کنترل چربی و آکنه + آکواپیل',
    rating: 5
  },
  {
    id: 'review-3',
    name: 'دکتر هدی رضایی',
    role: 'دندانپزشک',
    comment: '«به عنوان یک همکار در کادر درمان، وسواس زیادی روی استریلیزاسیون و پایه علمی مواد دارم. توضیحات تخصصی خانم پژمان درباره سرامیدها و اسیدیته پوست بی‌نظیر بود. آبرسانی عمیق ایشان خستگی ماه‌ها کار را از پوستم برد.»',
    treatmentUsed: 'پکیج آبرسانی عمیق و شفاف‌سازی',
    rating: 5
  }
];

export interface ClinicalDevice {
  id: string;
  name: string;
  enName: string;
  badge: string;
  mechanism: string;
  benefit: string;
  icon: string;
}

export const DEFAULT_DEVICES: ClinicalDevice[] = [
  {
    id: 'aquapeel-vortex',
    name: 'سیستم آکواپیل گردابی هیدرووکیوم',
    enName: 'Hydro-Dermabrasion Vortex System',
    badge: 'تخلیه عمقی و آبرسانی',
    mechanism: 'گردش مارپیچی محلول‌های AHA/BHA همراه با مکش متغیر جهت لایه‌برداری بدون اصطکاک مکانیکی خشن.',
    benefit: 'پاکسازی ۱۰۰٪ کمدون‌های بسته و منافذ بدون آسیب به مویرگ‌ها و قرمزی پس از درمان.',
    icon: 'fa-wand-magic-sparkles'
  },
  {
    id: 'carboxy-bohr',
    name: 'راکتور کربوکسی‌تراپی غیرتهاجمی بوهر',
    enName: 'CO2 Bohr Effect Oxygen Chamber',
    badge: 'اکسیژن‌رسانی سلولی',
    mechanism: 'آزادسازی موضعی مولکول‌های CO2 جهت ترشح فوری اکسیژن O2 از هموگلوبین به بافت درم.',
    benefit: 'افزایش گردش خون میکروواسکولار، دفع سموم لنفاوی و رفع تیرگی و پف بافت.',
    icon: 'fa-atom'
  },
  {
    id: 'ultrasound-nano',
    name: 'اولتراسوند ترنس‌درمال و نانوکانالینگ',
    enName: 'Sonophoresis & Nano-Infusion Array',
    badge: 'نفوذ پپتیدها و سرامیدها',
    mechanism: 'امواج صوتی ۳ مگاهرتز جهت ایجاد منافذ موقت در لایه شاخی برای نفوذ سرم‌های با وزن مولکولی بالا.',
    benefit: 'نفوذ عمقی هیالورونیک اسید و فاکتورهای رشد تا عمق ۴ برابری جذب سطحی بدون سوزن.',
    icon: 'fa-wave-square'
  },
  {
    id: 'led-phototherapy',
    name: 'ماتریس فوتوتراپی ال‌ای‌دی مدیکال ۷ رنگ',
    enName: 'Medical Photobiomodulation 7-LED',
    badge: 'تحریک فیبروبلاست و آنتی‌باکتریال',
    mechanism: 'طول‌موج‌های باریک کالیبره شده ۶۳۰nm (قرمز برای کلاژن) و ۴۱۵nm (آبی ضد باکتری P.acnes).',
    benefit: 'مهار التهاب پس از پیلینگ، تسریع ترمیم زخم و بازسازی رشته‌های الاستین.',
    icon: 'fa-sun'
  }
];

