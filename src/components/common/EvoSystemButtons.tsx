import React from 'react';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

interface EvoPrimarySystemButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const EvoPrimarySystemButton: React.FC<EvoPrimarySystemButtonProps> = ({
  onClick,
  children,
  icon,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-between gap-3 px-6 py-4 bg-[#0a0d14] text-white font-mono-tech font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer select-none overflow-hidden ${className}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
      }}
    >
      {/* Outer Industrial Layered Border */}
      <div className="absolute inset-0 border border-amber-400/50 group-hover:border-amber-300 transition-colors pointer-events-none" />

      {/* Top-Right Chamfer Gold Accent Fill */}
      <div
        className="absolute top-0 right-0 w-3 h-3 bg-amber-400 group-hover:bg-amber-300 transition-colors pointer-events-none"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />

      {/* Internal Active Gold Glow Ambient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Left Mechanical Pulse Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 group-hover:w-2 transition-all shadow-[0_0_10px_#fbbf24]" />

      {/* Button Content */}
      <div className="relative z-10 flex items-center gap-2.5 pl-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:animate-ping" />
        <span className="text-white group-hover:text-amber-200 transition-colors">
          {children}
        </span>
      </div>

      {/* Trailing Icon / Tactical Chevron */}
      <div className="relative z-10 text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
        {icon || <ArrowRight className="w-4 h-4" />}
      </div>
    </button>
  );
};

interface EvoSecondaryInspectButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const EvoSecondaryInspectButton: React.FC<EvoSecondaryInspectButtonProps> = ({
  onClick,
  children,
  icon,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-[#080b11]/80 hover:bg-[#0c1018] text-zinc-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider border border-zinc-800 hover:border-zinc-600 transition-all duration-300 cursor-pointer select-none ${className}`}
    >
      {/* 4 Optical Corner Calipers */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-zinc-500 group-hover:border-cyan-400 transition-colors" />
      <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-500 group-hover:border-cyan-400 transition-colors" />
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-zinc-500 group-hover:border-cyan-400 transition-colors" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-zinc-500 group-hover:border-cyan-400 transition-colors" />

      {/* Button Content */}
      <div className="relative z-10 flex items-center gap-2">
        {icon || <Eye className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />}
        <span>{children}</span>
      </div>
    </button>
  );
};
