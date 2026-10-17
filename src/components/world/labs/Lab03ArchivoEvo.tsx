import React from 'react';
import { BookOpen, FileText, ArrowRight, ShieldCheck, Sparkles, Download, CheckCircle2, Bookmark } from 'lucide-react';

interface Lab03ArchivoEvoProps {
  onEnterTomo01?: () => void;
  onEnterMagazine?: () => void;
  onEnterTomo02?: () => void;
  onEnterTomo03?: () => void;
  onEnterTomo04?: () => void;
  onOpenTomo?: (tomoNumber: string) => void;
}

export const Lab03ArchivoEvo: React.FC<Lab03ArchivoEvoProps> = ({
  onEnterTomo01,
  onEnterMagazine,
  onEnterTomo02,
  onEnterTomo03,
  onEnterTomo04,
  onOpenTomo,
}) => {
  const handleOpenTomo = (num: string) => {
    if (num === '01') {
      if (onEnterTomo01) onEnterTomo01();
      else if (onOpenTomo) onOpenTomo('01');
    } else if (num === '02') {
      if (onEnterTomo02) onEnterTomo02();
      else if (onOpenTomo) onOpenTomo('02');
    } else if (num === '03') {
      if (onEnterTomo03) onEnterTomo03();
      else if (onOpenTomo) onOpenTomo('03');
    } else if (num === '04') {
      if (onEnterTomo04) onEnterTomo04();
      else if (onOpenTomo) onOpenTomo('04');
    } else {
      if (onOpenTomo) onOpenTomo(num);
    }
  };

  const archiveVolumes = [
    {
      num: '01',
      title: 'Conocé tu PC',
      tag: 'OFICIAL // HARDWARE',
      activeBadge: 'ACTIVO',
      description: 'La base fundamental: arquitectura real, micro-stuttering, 6 puertas de arranque de Windows, cuello de botella y pasaporte pericial.',
      action: () => handleOpenTomo('01'),
      btnLabel: 'ABRIR TOMO 01',
      primary: true,
    },
    {
      num: '02',
      title: 'La Biblia Negra de Windows',
      tag: 'VOLUMEN // KERNEL NT',
      activeBadge: 'ACTIVO',
      description: 'Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando: telemetría oculta, ring 0 y descarte de mitos.',
      action: () => handleOpenTomo('02'),
      btnLabel: 'ABRIR TOMO 02',
    },
    {
      num: '03',
      title: 'Repará tu PC',
      tag: 'VOLUMEN // TALLER ATX',
      activeBadge: 'ACTIVO',
      description: 'La Biblia del reparador de escritorio: Síntoma → Medición con multímetro → Descarte de variables → Solución garantizada.',
      action: () => handleOpenTomo('03'),
      btnLabel: 'ABRIR TOMO 03',
    },
    {
      num: '04',
      title: 'Repará tu Notebook',
      tag: 'VOLUMEN // MICROMECÁNICA',
      activeBadge: 'ACTIVO',
      description: 'Diagnóstico de portátiles: pin de carga, mosfets de entrada, esquemáticos boardview y arquitectura térmica.',
      action: () => handleOpenTomo('04'),
      btnLabel: 'ABRIR TOMO 04',
    },
    {
      num: '05',
      title: 'Redes y Tráfico',
      tag: 'VOLUMEN // PROTOCOLOS',
      activeBadge: 'ACTIVO',
      description: 'Pila TCP/IP, Wireshark, direccionamiento CIDR, handshake de 3 vías y telemetría de latencias en redes.',
      action: () => handleOpenTomo('05'),
      btnLabel: 'ABRIR TOMO 05',
    },
    {
      num: '06',
      title: 'Ciberseguridad Defensiva',
      tag: 'VOLUMEN // HARDENING',
      activeBadge: 'ACTIVO',
      description: 'Matriz MITRE ATT&CK, contención de ransomware, directivas de aislamiento de kernel y análisis forense de procesos.',
      action: () => handleOpenTomo('06'),
      btnLabel: 'ABRIR TOMO 06',
    },
    {
      num: '07',
      title: 'Gaming Pro y Rendimiento',
      tag: 'VOLUMEN // METROLOGÍA',
      activeBadge: 'ACTIVO',
      description: 'Metrología de frametimes, percentiles 1% low, sincronización de cuadros y eliminación real de micro-stuttering.',
      action: () => handleOpenTomo('07'),
      btnLabel: 'ABRIR TOMO 07',
    },
    {
      num: '08',
      title: 'Arranque y Diagnóstico',
      tag: 'VOLUMEN // 35 ESTADOS POST',
      activeBadge: 'ACTIVO',
      description: 'Secuencia cronológica completa desde el pulso de encendido y Power Good hasta el escritorio de Windows NT.',
      action: () => handleOpenTomo('08'),
      btnLabel: 'ABRIR TOMO 08',
    },
    {
      num: '09',
      title: 'Programación desde Cero',
      tag: 'VOLUMEN // SOFTWARE & CÓDIGO',
      activeBadge: 'ACTIVO',
      description: 'Lógica algorítmica, TypeScript, Python, consumo de APIs, git y creación de utilidades técnicas independientes.',
      action: () => handleOpenTomo('09'),
      btnLabel: 'ABRIR TOMO 09',
    },
    {
      num: '10',
      title: 'Prompt e IA Avanzada',
      tag: 'VOLUMEN // LLMs & AGENTES',
      activeBadge: 'ACTIVO',
      description: 'Ingeniería de contexto, transformers, tokens, RAG, function calling y agentes con validación empírica.',
      action: () => handleOpenTomo('10'),
      btnLabel: 'ABRIR TOMO 10',
    },
    {
      num: '11',
      title: 'Electrónica Aplicada',
      tag: 'VOLUMEN // FÍSICA & VRM',
      activeBadge: 'ACTIVO',
      description: 'Desde la física del electrón hasta el diagnóstico a nivel componente en motherboards: convertidores Buck, PWM y bobinas.',
      action: () => handleOpenTomo('11'),
      btnLabel: 'ABRIR TOMO 11',
    },
    {
      num: '12',
      title: 'Creación de Videojuegos',
      tag: 'VOLUMEN // GAME FORGE',
      activeBadge: 'ACTIVO',
      description: 'EVO Game Forge: arquitectura del game loop con delta time, físicas vectoriales, shaders y proyecto Mundo Max.',
      action: () => handleOpenTomo('12'),
      btnLabel: 'ABRIR TOMO 12',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-400/15 via-[#0e1017] to-zinc-900 border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <BookOpen className="w-40 h-40 text-amber-400" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/50 text-amber-300 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 03 // BÓVEDA DE PUBLICACIONES & ARCHIVO MAESTRO
              </span>
              <span className="text-zinc-400 font-mono-tech text-xs font-bold">// 12 VOLÚMENES EDITORIALES</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Archivo Técnico EVO & Biblioteca de Investigación
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              El repositorio oficial donde queda documentada toda la metrología, protocolos de descarte y arquitectura de computadoras. Desde el Tomo 01 fundamental hasta las guías periciales de microelectrónica y Game Forge.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onEnterMagazine}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>REVISTA A4 (46 PÁGS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 12 Volumes with Direct Exploration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {archiveVolumes.map((vol) => (
          <div
            key={vol.num}
            className={`p-5 bg-[#0d0f17] rounded-xl flex flex-col justify-between space-y-4 shadow-xl transition-all group ${
              vol.primary
                ? 'border-2 border-amber-400'
                : 'border border-zinc-800 hover:border-amber-400/60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded font-mono-tech text-[10px] font-bold uppercase ${
                  vol.primary ? 'bg-amber-400 text-black font-black' : 'bg-zinc-800 text-amber-300'
                }`}>
                  TOMO {vol.num} // {vol.tag}
                </span>
                <span className="text-[10px] font-mono-tech text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {vol.activeBadge}
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors">
                {vol.title}
              </h3>
              <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed line-clamp-3">
                {vol.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={vol.action}
                className={`w-full py-2 font-mono-tech text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  vol.primary
                    ? 'bg-amber-400 hover:bg-amber-300 text-black'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 hover:border-amber-400'
                }`}
              >
                <span>{vol.btnLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
