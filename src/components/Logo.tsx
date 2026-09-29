import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
  href?: string;
}

export default function Logo({
  size = 'md',
  showText = true,
  showTagline = false,
  variant = 'light',
  className = '',
  href = '/'
}: LogoProps) {
  // Dimensions for emblem
  const dimensions = {
    sm: { box: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 40, text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 48, text: 'text-2xl', sub: 'text-xs' }
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Branded Emblem Frame */}
      <div
        className="relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-[#010E38] border border-[#005CBF]/30 group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <Image
          src="/logo.svg.svg"
          alt="Notes Study Official Logo"
          width={dimensions.box}
          height={dimensions.box}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${dimensions.text} ${
                variant === 'dark' ? 'text-white' : 'text-[#010E38]'
              }`}
            >
              Notes Study
            </span>
            <span className="bg-[#FC7600] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Edu
            </span>
          </div>
          {showTagline ? (
            <span className="text-[#005CBF] font-semibold text-[10px] tracking-wide mt-0.5">
              Learn • Practice • Grow
            </span>
          ) : (
            <span
              className={`font-medium ${dimensions.sub} ${
                variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
              } mt-0.5`}
            >
              UPSC & Govt Exams
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
