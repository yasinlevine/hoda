import React, { useRef, useState, useEffect } from 'react';
import { ServiceItem } from '../types';
import { ClockIcon, ArrowLeftIcon, InstagramIcon } from './Icons';

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  onSelectService: (service: ServiceItem) => void;
  onOpenInstagramBooking: (title: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onSelectService,
  onOpenInstagramBooking,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const el = cardRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  // Stagger delay calculation for fluid staggered reveal on desktop
  const staggerDelay = (index % 3) * 120;

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms',
      }}
      className={`bg-white border border-[#7bc4bc]/25 rounded-3xl overflow-hidden hover:border-[#7bc4bc] transition-all duration-500 ease-out flex flex-col justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(123,196,188,0.25)] hover:-translate-y-1.5 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-[0.98]'
      } motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none`}
    >
      <div>
        <div className="relative h-56 overflow-hidden bg-[#f0f9f8]">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[#134e48] border border-white/60 shadow-xs">
            {service.categoryLabel}
          </div>

          <div className="absolute bottom-3 left-4 text-xs font-medium text-white flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full">
            <ClockIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
            <span>{service.duration}</span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div>
            <span className="text-[11px] font-medium text-[#285f57] uppercase tracking-wider block">
              {service.subtitle}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mt-1 group-hover:text-[#134e48] transition-colors leading-snug">
              {service.title}
            </h3>
          </div>

          <div className="text-xs text-[#475569] leading-relaxed bg-[#f8faf9] p-3.5 rounded-2xl border border-[#7bc4bc]/20">
            <span className="text-[#134e48] font-bold block mb-1">تکنیک و مکانیسم بیولوژیک:</span>
            <p>{service.technique}</p>
          </div>

          <div className="text-xs text-[#475569] leading-relaxed bg-[#f8faf9] p-3.5 rounded-2xl border border-[#7bc4bc]/20">
            <span className="text-[#134e48] font-bold block mb-1">مزایا و نتایج بالینی:</span>
            <p>{service.benefits}</p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-[#285f57] font-semibold block mb-1.5">مواد مؤثره کلیدی:</span>
            <div className="flex flex-wrap gap-1.5">
              {service.keyActives.map((act, i) => (
                <span
                  key={i}
                  className="text-[10px] text-[#134e48] bg-[#f0f9f8] px-2.5 py-1 rounded-lg border border-[#7bc4bc]/30 font-medium"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 pt-0 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onSelectService(service)}
          className="min-h-[44px] px-2 text-xs text-[#285f57] hover:text-[#134e48] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>جزئیات پروتکل</span>
          <ArrowLeftIcon className="w-3.5 h-3.5 text-[#7bc4bc]" />
        </button>

        <button
          onClick={() => onOpenInstagramBooking(service.title)}
          className="min-h-[44px] px-4 py-2.5 text-xs font-semibold text-white bg-[#7bc4bc] hover:bg-[#68b5ac] rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-[0_8px_20px_-4px_rgba(123,196,188,0.5)] active:scale-95"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>رزرو در دایرکت</span>
        </button>
      </div>
    </div>
  );
};
