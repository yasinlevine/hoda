import React from 'react';
import { ClinicalDevice, DEFAULT_DEVICES } from '../types';
import {
  WandSparklesIcon,
  AtomIcon,
  WaveIcon,
  SunIcon,
  ShieldCheckIcon,
  InstagramIcon,
  CheckIcon,
  DropletIcon,
  SpaIcon,
  MicrochipIcon,
  MicroscopeIcon,
  SparklesIcon
} from './Icons';

interface ClinicalDevicesSectionProps {
  onInquireDevice: (deviceName: string) => void;
}

export const ClinicalDevicesSection: React.FC<ClinicalDevicesSectionProps> = ({
  onInquireDevice
}) => {
  const renderDeviceIcon = (id: string) => {
    switch (id) {
      case 'aquapeel-vortex':
        return <DropletIcon className="w-6 h-6 m-auto" />;
      case 'carboxy-bohr':
        return <SpaIcon className="w-6 h-6 m-auto" />;
      case 'ultrasound-nano':
        return <MicrochipIcon className="w-6 h-6 m-auto" />;
      case 'led-phototherapy':
        return <SunIcon className="w-6 h-6 m-auto" />;
      default:
        return <DropletIcon className="w-6 h-6 m-auto" />;
    }
  };

  return (
    <section id="devices" className="py-16 sm:py-24 bg-[#f8faf9] border-t border-[#7bc4bc]/20 font-vazir relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl text-right">
            <span className="text-[11px] sm:text-xs font-semibold text-[#1d5750] block mb-2">
              NON-INVASIVE MEDICAL TECHNOLOGIES
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight">
              تجهیزات و فناوری‌های بالینی کلینیک
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2.5 leading-relaxed">
              تمامی دستگاه‌ها دارای استانداردهای بین‌المللی تجهیزات پزشکی و استتیک بوده و پروتکل‌ها کاملاً غیرتهاجمی، ایمن و بدون دوران نقاهت اجرا می‌گردند.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#7bc4bc]/30 shadow-xs text-xs self-start md:self-auto">
            <ShieldCheckIcon className="w-6 h-6 text-[#7bc4bc] shrink-0" />
            <div>
              <span className="text-[#0f172a] font-bold block">استاندارد استریلیزاسیون بیمارستانی</span>
              <span className="text-[#64748b] text-[11px]">زعفرانیه · تجهیزات یکبار مصرف اختصاصی</span>
            </div>
          </div>
        </div>

        {/* 4 Clinical Devices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {DEFAULT_DEVICES.map((device, index) => (
            <div
              key={device.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white border border-[#7bc4bc]/25 rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#7bc4bc] hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-12px_rgba(123,196,188,0.25)] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group"
            >
              <div>
                {/* Icon & Category Badge */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <span className="text-[11px] font-semibold text-[#134e48] bg-[#f0f9f8] border border-[#7bc4bc]/30 px-3 py-1 rounded-full">
                    {device.badge}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#f0f9f8] border border-[#7bc4bc]/40 text-[#134e48] flex items-center justify-center group-hover:bg-[#7bc4bc] group-hover:text-white transition-all duration-300 shadow-xs group-hover:scale-105 shrink-0">
                    {renderDeviceIcon(device.id)}
                  </div>
                </div>

                {/* Device Title & En Name */}
                <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#134e48] transition-colors">
                  {device.name}
                </h3>
                <span className="text-[11px] text-[#64748b] block mt-0.5 mb-3 sm:mb-4">
                  {device.enName}
                </span>

                {/* Biological Mechanism */}
                <div className="bg-[#f8faf9] p-3 rounded-2xl border border-[#7bc4bc]/20 text-xs mb-3 group-hover:border-[#7bc4bc]/40 transition-colors">
                  <span className="text-[#134e48] font-bold flex items-center gap-1.5 mb-1">
                    <MicroscopeIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                    <span>مکانیسم اثر:</span>
                  </span>
                  <p className="text-[#475569] leading-relaxed text-[11px]">
                    {device.mechanism}
                  </p>
                </div>

                {/* Clinical Benefit */}
                <div className="text-xs text-[#475569] leading-relaxed text-[11px] px-1">
                  <span className="text-[#64748b] flex items-center gap-1.5 mb-1 font-medium">
                    <SparklesIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                    <span>نتیجه بالینی:</span>
                  </span>
                  <p>{device.benefit}</p>
                </div>
              </div>

              {/* Bottom Inquire CTA (Touch-friendly Min 44px) */}
              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#64748b] font-medium flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
                  بدون نقاهت
                </span>

                <button
                  onClick={() => onInquireDevice(device.name)}
                  className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-white bg-[#7bc4bc] hover:bg-[#68b5ac] rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-sm"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>مشاوره</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
