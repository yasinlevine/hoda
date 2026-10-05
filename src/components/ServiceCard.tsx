import React, { useRef, useState, useEffect } from 'react';
import { ServiceItem } from '../types';

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
      className={`bg-[#242922] border border-[#363d33] rounded-2xl overflow-hidden hover:border-[#a3b18a]/60 transition-all duration-700 ease-out flex flex-col justify-between group shadow-xl ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-[0.98]'
      } motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none`}
    >
      <div>
        <div className="relative h-52 overflow-hidden bg-[#1e221b]">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#242922] via-transparent to-transparent"></div>

          <div className="absolute top-4 right-4 bg-[#1e221b]/85 backdrop-blur-md px-3 py-1 rounded text-xs font-mono text-[#a3b18a] border border-[#363d33]">
            {service.categoryLabel}
          </div>

          <div className="absolute bottom-3 left-4 text-xs font-mono text-gray-300">
            <i className="fa-regular fa-clock ml-1 text-[#a3b18a]"></i>
            {service.duration}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-mono text-[#a3b18a] uppercase tracking-wider block">
              {service.subtitle}
            </span>
            <h3 className="text-lg font-bold text-[#f1f5f9] mt-1 group-hover:text-[#a3b18a] transition-colors">
              {service.title}
            </h3>
          </div>

          <div className="text-xs text-[#e2e8f0]/80 leading-relaxed bg-[#1e221b] p-3.5 rounded-xl border border-[#363d33]/60">
            <span className="text-[#a3b18a] font-bold block mb-1">تکنیک و مکانیسم بیولوژیک:</span>
            <p>{service.technique}</p>
          </div>

          <div className="text-xs text-[#e2e8f0]/80 leading-relaxed bg-[#1e221b] p-3.5 rounded-xl border border-[#363d33]/60">
            <span className="text-[#a3b18a] font-bold block mb-1">مزایا و نتایج بالینی:</span>
            <p>{service.benefits}</p>
          </div>

          <div className="pt-2">
            <span className="text-[11px] text-[#a3b18a] font-medium block mb-1">مواد مؤثره کلیدی:</span>
            <div className="flex flex-wrap gap-1.5">
              {service.keyActives.map((act, i) => (
                <span
                  key={i}
                  className="text-[10px] text-[#e2e8f0]/80 bg-[#1e221b] px-2.5 py-0.5 rounded border border-[#363d33]"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 mt-4 border-t border-[#363d33]/50 flex items-center justify-between gap-3">
        <button
          onClick={() => onSelectService(service)}
          className="min-h-[44px] px-2 text-xs text-[#a3b18a] hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>جزئیات پروتکل</span>
          <i className="fa-solid fa-arrow-left text-[10px]"></i>
        </button>

        <button
          onClick={() => onOpenInstagramBooking(service.title)}
          className="min-h-[44px] px-4 py-2.5 text-xs font-semibold text-[#1e221b] bg-[#a3b18a] hover:bg-[#b5c49b] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-98"
        >
          <i className="fa-brands fa-instagram text-xs"></i>
          <span>رزرو در دایرکت</span>
        </button>
      </div>
    </div>
  );
};
