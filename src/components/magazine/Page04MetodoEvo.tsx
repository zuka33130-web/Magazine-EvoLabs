import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ArrowRight, Eye, Search, BookOpen, Gauge, GitCompare, CheckSquare, FileText, AlertTriangle } from 'lucide-react';

export const Page04MetodoEvo: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-04"
      pageNumber={4}
      totalPages={46}
      sectionTitle="MÉTODO CIENTÍFICO"
      subSlug="METROLOGÍA APLICADA // EL MÉTODO EVO"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Header */}
      <div className="mb-3.5 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            PROCEDIMIENTO TÉCNICO // 7 PASOS INVIOLABLES
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            El Método EVO
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          REF: EVO-METHOD-001
        </span>
      </div>

      {/* Main Flow: 7 Horizontal / Responsive Steps */}
      <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-3 sm:p-4 mb-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
          <span className="text-[10px] font-mono-tech font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            FLUJO DE PERITAJE: DE LA SOSPECHA AL REGISTRO INMUTABLE
          </span>
          <span className="text-[9px] font-mono-tech text-zinc-500 hidden sm:inline uppercase">
            REGLA: NUNCA OPTIMICES ANTES DE COMPRENDER
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center font-mono-tech">
          
          <div className="p-2.5 bg-[#12151d] border border-zinc-800 rounded-lg flex flex-col items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs font-black mb-1">
              01
            </div>
            <span className="font-bold text-white text-[11px] uppercase">OBSERVÁ</span>
            <p className="text-[8.5px] text-zinc-400 mt-1 font-sans-editorial leading-tight">Mirá el síntoma real sin sacar conclusiones apresuradas.</p>
          </div>

          <div className="p-2.5 bg-[#12151d] border border-zinc-800 rounded-lg flex flex-col items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs font-black mb-1">
              02
            </div>
            <span className="font-bold text-white text-[11px] uppercase">IDENTIFICÁ</span>
            <p className="text-[8.5px] text-zinc-400 mt-1 font-sans-editorial leading-tight">Reconocé qué pieza de silicio o proceso interviene.</p>
          </div>

          <div className="p-2.5 bg-[#12151d] border border-zinc-800 rounded-lg flex flex-col items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs font-black mb-1">
              03
            </div>
            <span className="font-bold text-white text-[11px] uppercase">ENTENDÉ</span>
            <p className="text-[8.5px] text-zinc-400 mt-1 font-sans-editorial leading-tight">Comprendé la física y arquitectura del subsistema.</p>
          </div>

          <div className="p-2.5 bg-[#12151d] border border-yellow-400/50 rounded-lg flex flex-col items-center justify-between bg-yellow-400/5 shadow-[0_0_12px_rgba(234,179,8,0.15)]">
            <div className="w-7 h-7 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xs mb-1">
              04
            </div>
            <span className="font-black text-yellow-400 text-[11px] uppercase">MEDÍ</span>
            <p className="text-[8.5px] text-zinc-300 mt-1 font-sans-editorial leading-tight">Capturá telemetría basal antes de tocar un solo valor.</p>
          </div>

          <div className="p-2.5 bg-[#12151d] border border-zinc-800 rounded-lg flex flex-col items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs font-black mb-1">
              05
            </div>
            <span className="font-bold text-white text-[11px] uppercase">COMPARÁ</span>
            <p className="text-[8.5px] text-zinc-400 mt-1 font-sans-editorial leading-tight">Ensayos A/B cruzados bajo idénticas condiciones.</p>
          </div>

          <div className="p-2.5 bg-[#12151d] border border-zinc-800 rounded-lg flex flex-col items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs font-black mb-1">
              06
            </div>
            <span className="font-bold text-white text-[11px] uppercase">DECIDÍ</span>
            <p className="text-[8.5px] text-zinc-400 mt-1 font-sans-editorial leading-tight">Mantené el cambio solo si la evidencia lo valida.</p>
          </div>

          <div className="p-2.5 bg-[#12151d] border border-zinc-800 rounded-lg flex flex-col items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 flex items-center justify-center text-xs font-black mb-1">
              07
            </div>
            <span className="font-bold text-white text-[11px] uppercase">REGISTRÁ</span>
            <p className="text-[8.5px] text-zinc-400 mt-1 font-sans-editorial leading-tight">Guardá los datos en tu Expediente Forense personal.</p>
          </div>

        </div>
      </div>

      {/* Central Case Study: La Ley de Oro de EVO y el Caso RAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        
        {/* Left 7 cols: La Ley Cuádruple */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="p-3.5 bg-[#0e1119] border-l-4 border-yellow-400 rounded-r-lg">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold uppercase tracking-widest block">
              PRINCIPIO DE AUDITORÍA FORENSE
            </span>
            <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight mt-0.5">
              DECLARADO ≠ OBSERVADO ≠ DETECTADO ≠ CONFIRMADO
            </h3>
            <p className="font-sans-editorial text-xs text-zinc-300 mt-1 leading-relaxed">
              La mayor causa de compras equivocadas, diagnósticos falsos y optimizaciones fallidas es confundir lo que el fabricante afirma con lo que el silicio está ejecutando.
            </p>
          </div>

          {/* Breakdown de los 4 estados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans-editorial">
            <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-md">
              <span className="text-[10px] font-mono-tech text-zinc-400 font-bold block uppercase">
                1. LO DECLARADO
              </span>
              <p className="text-zinc-300 text-[11px] mt-1">
                Lo que dice la caja, la factura comercial o la publicidad del fabricante. Suele omitir limitaciones de bus, perfiles JEDEC base y temperaturas máximas de operación.
              </p>
            </div>

            <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-md">
              <span className="text-[10px] font-mono-tech text-yellow-400 font-bold block uppercase">
                2. LO DETECTADO
              </span>
              <p className="text-zinc-300 text-[11px] mt-1">
                La cadena de texto que el sistema operativo lee del microcódigo o la BIOS. Puede indicar un modelo teórico, pero no su estado operativo actual.
              </p>
            </div>

            <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-md">
              <span className="text-[10px] font-mono-tech text-sky-400 font-bold block uppercase">
                3. LO OBSERVADO
              </span>
              <p className="text-zinc-300 text-[11px] mt-1">
                La lectura en tiempo real de los sensores: voltajes, relojes efectivos, frecuencias y consumos en wattios mientras el sistema está bajo carga real.
              </p>
            </div>

            <div className="p-3 bg-[#0d1017] border border-zinc-800 rounded-md">
              <span className="text-[10px] font-mono-tech text-emerald-400 font-bold block uppercase">
                4. LO CONFIRMADO
              </span>
              <p className="text-zinc-300 text-[11px] mt-1">
                El resultado validado mediante telemetría repetible, ensayos controlados y comparación de rendimiento antes y después de cualquier intervención.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-black/40 border border-zinc-800 rounded text-[11px] font-sans-editorial text-zinc-400">
            <strong className="text-white">Conclusión EVO:</strong> La información se transforma en conocimiento únicamente cuando aprendemos a interpretarla y contrastarla con la física del equipo.
          </div>
        </div>

        {/* Right 5 cols: El Ejemplo Didáctico de la Memoria RAM */}
        <div className="lg:col-span-5 bg-[#0f121a] border border-yellow-400/40 rounded-xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-[10px] font-mono-tech font-black text-yellow-400 uppercase tracking-wider">
              CASO FORENSE // EL MITO DE LOS "16 GB"
            </span>
            <span className="text-[9px] font-mono-tech bg-yellow-400 text-black px-1.5 py-0.2 rounded font-bold">
              EJEMPLO REAL
            </span>
          </div>

          <div className="text-xs font-sans-editorial space-y-2.5 text-zinc-300">
            <p className="text-[11.5px] leading-relaxed">
              Un usuario compra una PC que dice tener <strong className="text-white">16 GB de RAM</strong>. Abre el Administrador de Tareas y Windows confirma <strong className="text-white">16 GB</strong>. Cree que todo está perfecto. Pero el peritaje EVO revela la verdad:
            </p>

            <div className="space-y-1.5 font-mono-tech text-[10px]">
              <div className="p-2 bg-black/60 border border-red-900/40 rounded flex items-center justify-between">
                <span className="text-zinc-400">CANAL DE BUS:</span>
                <span className="text-red-400 font-bold">Single Channel (1×16 GB o slots 1-2)</span>
              </div>
              <div className="p-2 bg-black/60 border border-yellow-900/40 rounded flex items-center justify-between">
                <span className="text-zinc-400">FRECUENCIA:</span>
                <span className="text-yellow-400 font-bold">2133 MHz (XMP apagado)</span>
              </div>
              <div className="p-2 bg-black/60 border border-zinc-800 rounded flex items-center justify-between">
                <span className="text-zinc-400">ANCHO DE BANDA:</span>
                <span className="text-red-400 font-bold">17.0 GB/s (en vez de 51.2 GB/s)</span>
              </div>
              <div className="p-2 bg-black/60 border border-zinc-800 rounded flex items-center justify-between">
                <span className="text-zinc-400">RESERVADA HARDWARE:</span>
                <span className="text-zinc-300">2.1 GB tomados por iGPU</span>
              </div>
              <div className="p-2 bg-black/60 border border-emerald-900/40 rounded flex items-center justify-between">
                <span className="text-zinc-400">DISPONIBLE REAL:</span>
                <span className="text-emerald-400 font-bold">13.9 GB para el sistema</span>
              </div>
            </div>

            <p className="text-[10.5px] text-zinc-400 leading-snug bg-black/40 p-2 rounded border border-zinc-800/80">
              <span className="text-yellow-400 font-semibold">El veredicto:</span> La máquina tiene 16 GB instalados, pero opera al <strong className="text-white">33% del ancho de banda</strong> que el CPU soporta, provocando micro-stuttering constante en juegos y demoras en render.
            </p>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
