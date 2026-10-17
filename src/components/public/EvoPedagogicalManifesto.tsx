import React from 'react';
import { Eye, BookOpen, Wrench, Activity, CheckSquare, ArrowRight, Gauge, Compass } from 'lucide-react';

export const EvoPedagogicalManifesto: React.FC = () => {
  const steps = [
    { label: 'MIRÁ', icon: Eye, desc: 'Observación del hardware' },
    { label: 'ENTENDÉ', icon: BookOpen, desc: 'Lógica física del bus' },
    { label: 'PROBÁ', icon: Wrench, desc: 'Intervención en banco' },
    { label: 'MEDÍ', icon: Activity, desc: 'Telemetría e instrumental' },
    { label: 'DECIDÍ', icon: CheckSquare, desc: 'Resolución pericial' },
  ];

  const principles = [
    { num: '01', title: 'NO VENDEMOS MILAGROS. LOS MEDIMOS.' },
    { num: '02', title: 'SÍNTOMA NO ES CAUSA.' },
    { num: '03', una: 'UNA VARIABLE POR VEZ.', title: 'UNA VARIABLE POR VEZ.' },
    { num: '04', title: 'SI LO EXPLICAMOS, LO MOSTRAMOS.' },
    { num: '05', title: 'DATOS ANTES QUE OPINIÓN.' },
    { num: '06', title: 'NUNCA TE DEJAMOS EN “¿Y AHORA QUÉ?”.' },
  ];

  return (
    <div className="space-y-6 pt-2 pb-6">
      {/* BLOQUE 1: MANIFIESTO Y RECORRIDO PERICIAL */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono-tech tracking-widest text-amber-300 uppercase font-black">
              METODOLOGÍA OFICIAL EVO LABS
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight leading-tight">
              NO APRENDAS DE MEMORIA.{' '}
              <span className="text-amber-400 block sm:inline">APRENDÉ A ENCONTRAR LA CAUSA.</span>
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm sm:text-base italic border-l-2 border-amber-400/80 pl-4 py-1 max-w-3xl">
              “CONOCÉ TU PC empieza donde estás, no donde un técnico supone que deberías estar.”
            </p>
          </div>

          {/* RECORRIDO: MIRÁ → ENTENDÉ → PROBÁ → MEDÍ → DECIDÍ */}
          <div className="pt-3 border-t border-zinc-800/80">
            <span className="text-[10px] font-mono-tech tracking-widest text-zinc-400 uppercase font-bold block mb-3">
              EL RECORRIDO METODOLÓGICO:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 items-center">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="flex-1 p-2.5 sm:p-3 rounded-xl bg-[#0e121a] border border-zinc-800/80 flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left hover:border-amber-400/40 transition-colors">
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-xs font-mono-tech font-black text-white tracking-wider block">
                          {s.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 hidden sm:block font-sans-editorial">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:block shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 2: LOS 6 PRINCIPIOS EVO */}
      <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-tech tracking-widest text-amber-400 uppercase font-black">
              PRINCIPIOS EVO // RIGOR DE LABORATORIO
            </span>
          </div>
          <span className="text-[10px] font-mono-tech text-zinc-400 uppercase">
            06 REGLAS INNEGOCIABLES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {principles.map((p) => (
            <div
              key={p.num}
              className="p-3.5 rounded-xl bg-[#0c1017] border border-zinc-800/80 flex items-start gap-3 hover:border-zinc-700 transition-colors"
            >
              <span className="text-xs font-mono-tech font-black text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 shrink-0">
                {p.num}
              </span>
              <p className="text-xs font-mono-tech font-bold text-zinc-200 tracking-tight leading-snug pt-0.5">
                {p.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BLOQUE 3: UNA RUTA. DOS VELOCIDADES. */}
      <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <Compass className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-tight">
            UNA RUTA. <span className="text-amber-400">DOS VELOCIDADES.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-[#0c1017] border border-zinc-800/80 space-y-2 hover:border-amber-400/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-black text-amber-400 uppercase tracking-wider">
                MODO PRINCIPIANTE
              </span>
              <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                PASO A PASO
              </span>
            </div>
            <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
              Seguir el recorrido guiado en orden. Comenzá desde los fundamentos del silicio y avanzá con validaciones progresivas antes de pasar al siguiente capítulo.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#0c1017] border border-zinc-800/80 space-y-2 hover:border-amber-400/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-black text-cyan-400 uppercase tracking-wider">
                MODO CON EXPERIENCIA
              </span>
              <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                ACCESO DIRECTO
              </span>
            </div>
            <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
              Usar EVO como mapa e ir directamente a una medición, laboratorio o problema puntual de banco para consultar la causa raíz sin rodeos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
