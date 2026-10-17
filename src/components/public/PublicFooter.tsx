import React from 'react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#05070a] border-t border-zinc-900/90 text-zinc-400 font-mono-tech select-none py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-1">
        <p className="text-zinc-300 font-bold text-xs">
          © 2026 EVO LABS — ZUDOKA PROGRAMING SYSTEM CORPORATION
        </p>
        <p className="text-zinc-400 text-xs">
          Todos los derechos reservados.
        </p>
        <p className="text-[11px] text-zinc-500 pt-0.5">
          Creado y dirigido por ZuKA · Denis Galperin
        </p>
      </div>
    </footer>
  );
};
