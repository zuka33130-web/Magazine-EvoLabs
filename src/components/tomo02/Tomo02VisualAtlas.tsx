import React from 'react';
import kernelImage from '../../assets/images/cap_05_kernel_1789531884339.jpg';
import siliconImage from '../../assets/images/cap_01_silicon_1789531835511.jpg';
import frametimeImage from '../../assets/images/cap_03_frametime_1789531858625.jpg';
import workshopImage from '../../assets/images/cap_06_workshop_1789531894578.jpg';
import laboratoryImage from '../../assets/images/cap_07_lab_1789531904106.jpg';

/**
 * Atlas visual de los cinco niveles de la Biblia Virtual.
 * Reutiliza la fotografía editorial ya presente en el Tomo 01
 * con un tratamiento cromático propio del Tomo 02.
 * Las imágenes ilustran conceptos: NO representan diagnósticos ni lecturas del usuario.
 */
const WINDOWS_ATLAS = [
  {
    id: 'lvl-1',
    number: 'I',
    range: '00–07',
    title: 'WINDOWS POR DENTRO',
    subtitle: 'Arranque · kernel · procesos',
    image: kernelImage,
    alt: 'Ilustración editorial técnica relacionada con la arquitectura interna del procesador y el kernel de Windows',
  },
  {
    id: 'lvl-2',
    number: 'II',
    range: '08–15',
    title: 'CONTROL TOTAL',
    subtitle: 'Memoria · consola · registro',
    image: siliconImage,
    alt: 'Fotografía editorial de silicio utilizada para ilustrar memoria y arquitectura de hardware',
  },
  {
    id: 'lvl-3',
    number: 'III',
    range: '16–23',
    title: 'RENDIMIENTO REAL',
    subtitle: 'Energía · red · pantalla',
    image: frametimeImage,
    alt: 'Fotografía editorial sobre rendimiento y tiempos de respuesta del equipo',
  },
  {
    id: 'lvl-4',
    number: 'IV',
    range: '24–31',
    title: 'DIAGNÓSTICO FORENSE',
    subtitle: 'Errores · BSOD · latencias',
    image: workshopImage,
    alt: 'Fotografía editorial de un banco de trabajo técnico usado para ilustrar diagnóstico y reparación',
  },
  {
    id: 'lvl-5',
    number: 'V',
    range: '32–39',
    title: 'LABORATORIO EXPERTO',
    subtitle: 'NTFS · Sysinternals · pruebas',
    image: laboratoryImage,
    alt: 'Imagen editorial de laboratorio técnico que representa el método experimental EVO LABS',
  },
] as const;

type Tomo02VisualAtlasProps = {
  variant?: 'cover' | 'index';
  activeLevel?: string;
  onSelectLevel?: (level: string) => void;
};

export const Tomo02VisualAtlas: React.FC<Tomo02VisualAtlasProps> = ({
  variant = 'cover',
  activeLevel,
  onSelectLevel,
}) => {
  return (
    <section
      aria-label="Atlas visual de los cinco niveles de Windows"
      className={`relative overflow-hidden rounded-[22px] border border-[#0078D4]/40 bg-[#050B15] shadow-[0_20px_70px_rgba(0,0,0,0.40)] ${variant === 'cover' ? 'mt-11 lg:mt-14 p-4 sm:p-5' : 'p-4 sm:p-5'}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(ellipse_at_15%_0%,rgba(0,210,255,0.22),transparent_48%)]" />
      <div className="relative mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-[#60CDFF]/20 pb-3">
        <div>
          <p className="mb-1 font-mono-tech text-[10px] font-black tracking-[0.2em] text-[#60CDFF] uppercase">
            EVO LABS // ATLAS VISUAL DE WINDOWS
          </p>
          <h2 className="font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
            CINCO NIVELES. UN SISTEMA AL DESCUBIERTO.
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] font-bold tracking-widest text-[#91CFFF]">
          40 SECTORES · 00–39
        </span>
      </div>

      <div className="relative grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {WINDOWS_ATLAS.map((item) => {
          const active = activeLevel === item.id;
          const tile = (
            <>
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-[0.78] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-100"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020814] via-[#041425]/65 to-[#0078D4]/10" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0078D4] via-[#00D2FF] to-[#60CDFF]" />
              <div className="relative z-10 flex h-full flex-col justify-between p-3.5 text-left">
                <div className="flex items-start justify-between gap-1">
                  <span className="font-mono-tech text-[10px] font-black tracking-widest text-[#C0EBFF]">
                    NIVEL {item.number}
                  </span>
                  <span className="rounded border border-[#00D2FF]/50 bg-[#031526]/90 px-1.5 py-0.5 font-mono-tech text-[9px] font-bold text-[#60CDFF]">
                    {item.range}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-black leading-tight tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 font-sans-editorial text-[11px] leading-snug text-[#C9DCEA]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </>
          );

          const className = `group relative block h-40 w-full overflow-hidden rounded-xl border text-left shadow-[0_8px_25px_rgba(0,0,0,0.4)] transition-all duration-300 sm:h-44 ${active ? 'border-[#60CDFF] ring-2 ring-[#00D2FF]/60 shadow-[0_0_28px_rgba(0,210,255,0.24)]' : 'border-[#60CDFF]/25 hover:border-[#60CDFF] hover:shadow-[0_0_25px_rgba(0,120,212,0.25)]'}`;

          return onSelectLevel ? (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectLevel(active ? 'all' : item.id)}
              aria-pressed={active}
              aria-label={`Ver sectores ${item.range}: ${item.title}`}
              className={`${className} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60CDFF]`}
            >
              {tile}
            </button>
          ) : (
            <figure key={item.id} className={className}>
              {tile}
            </figure>
          );
        })}
      </div>

      <p className="relative mt-3 font-mono-tech text-[10px] leading-relaxed text-[#9BB9CE]">
        FIGURAS EDITORIALES CONCEPTUALES · ILUSTRAN LOS CONTENIDOS; NO SON MEDICIONES NI CAPTURAS DE TU PC.
        {onSelectLevel ? ' · SELECCIONÁ UNA IMAGEN PARA FILTRAR LOS SECTORES.' : ''}
      </p>
    </section>
  );
};
