import React from "react";

interface Evo3DBrandMarkProps {
  className?: string;
}

export const Evo3DBrandMark: React.FC<Evo3DBrandMarkProps> = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <img
        src="/branding/evo-logo-premium.png"
        alt="EVO LABS"
        className="w-full h-full max-w-[500px] max-h-[500px] object-contain"
        draggable={false}
      />
    </div>
  );
};
