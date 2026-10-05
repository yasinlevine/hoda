import React from 'react';
import { ClinicalDevice, DEFAULT_DEVICES } from '../types';

interface ClinicalDevicesSectionProps {
  onInquireDevice: (deviceName: string) => void;
}

export const ClinicalDevicesSection: React.FC<ClinicalDevicesSectionProps> = ({
  onInquireDevice
}) => {
  return (
    <section id="devices" className="py-16 sm:py-24 bg-[#242922] border-t border-[#363d33] font-vazir relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="max-w-2xl text-right">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#a3b18a] block mb-2">
              NON-INVASIVE MEDICAL TECHNOLOGIES
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#f1f5f9] tracking-tight">
              تجهیزات و فناوری‌های بالینی کلینیک
            </h2>
            <p className="text-xs sm:text-sm text-[#e2e8f0]/75 mt-2.5 leading-relaxed">
              تمامی دستگاه‌ها دارای استانداردهای بین‌المللی تجهیزات پزشکی و استتیک بوده و پروتکل‌ها کاملاً غیرتهاجمی، ایمن و بدون دوران نقاهت اجرا می‌گردند.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1e221b] p-3 rounded-2xl border border-[#363d33] text-xs self-start md:self-auto">
            <i className="fa-solid fa-shield-check text-[#a3b18a] text-lg"></i>
            <div>
              <span className="text-[#f1f5f9] font-bold block">استاندارد استریلیزاسیون بیمارستانی</span>
              <span className="text-gray-400 text-[11px]">زعفرانیه · تجهیزات یکبار مصرف اختصاصی</span>
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
              className="bg-[#1e221b] border border-[#363d33] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#a3b18a]/60 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.8)] transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Icon & Category Badge */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#242922] border border-[#a3b18a]/40 text-[#a3b18a] flex items-center justify-center text-xl group-hover:bg-[#a3b18a] group-hover:text-[#1e221b] transition-all duration-300 shadow-inner group-hover:scale-110">
                    <i className={`fa-solid ${device.icon}`}></i>
                  </div>
                  <span className="text-[10px] font-mono text-[#a3b18a] bg-[#a3b18a]/10 border border-[#a3b18a]/30 px-2.5 py-1 rounded-full">
                    {device.badge}
                  </span>
                </div>

                {/* Device Title & En Name */}
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#a3b18a] transition-colors">
                  {device.name}
                </h3>
                <span className="text-[10px] font-mono text-gray-500 block mt-0.5 mb-3 sm:mb-4">
                  {device.enName}
                </span>

                {/* Biological Mechanism */}
                <div className="bg-[#242922] p-3 rounded-xl border border-[#363d33]/60 text-xs mb-3 group-hover:border-[#3d4738] transition-colors">
                  <span className="text-[#a3b18a] font-bold block mb-1">مکانیسم اثر:</span>
                  <p className="text-[#e2e8f0]/80 leading-relaxed text-[11px]">
                    {device.mechanism}
                  </p>
                </div>

                {/* Clinical Benefit */}
                <div className="text-xs text-[#e2e8f0]/80 leading-relaxed text-[11px]">
                  <span className="text-gray-400 block mb-1">نتیجه بالینی:</span>
                  <p>{device.benefit}</p>
                </div>
              </div>

              {/* Bottom Inquire CTA (Touch-friendly Min 44px) */}
              <div className="pt-4 mt-5 border-t border-[#363d33]/50 flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <i className="fa-solid fa-check text-[#a3b18a]"></i>
                  بدون نقاهت
                </span>

                <button
                  onClick={() => onInquireDevice(device.name)}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[#1e221b] bg-[#a3b18a] hover:bg-[#b5c49b] rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-md"
                >
                  <i className="fa-brands fa-instagram text-xs"></i>
                  <span>مشاوره این دستگاه</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
