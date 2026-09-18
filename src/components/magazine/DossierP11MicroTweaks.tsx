import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Sliders, RotateCcw, Check, Clock, Eye, AlertCircle, Zap, Gamepad2, BatteryCharging, Info } from 'lucide-react';

export const DossierP11MicroTweaks: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-33"
      pageNumber={33}
      totalPages={41}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 11 // AJUSTES Y RENDIMIENTO"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // PERCEPCIÓN VS HARDWARE // PÁGINA 11 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Micro-Tweaks: Respuesta Percibida vs Rendimiento Real
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          SEPARANDO AGILIDAD VISUAL DE FPS REALES
        </span>
      </div>

      {/* Narrative Lead */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2">
        Existe una confusión permanente entre que Windows <strong className="text-white">se sienta más rápido</strong> y que el hardware <strong className="text-white">entregue más FPS</strong>. Desactivar transparencias o sombras en una GPU moderna (RTX 3060+, RX 6600+) produce <strong>cero aumento medible de cuadros por segundo</strong> en juegos 3D, ya que el motor gráfico utiliza una cola de render independiente del escritorio (DWM). La clave está en distinguir dos dimensiones:
      </p>

      {/* Two Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1 mb-2 font-mono-tech text-xs">
        
        {/* Pillar 1: Perceived Response (Visual UI) */}
        <div className="bg-[#0e1118] border border-yellow-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>01 // RESPUESTA PERCIBIDA (INTERFAZ)</span>
              </div>
              <span className="text-[8px] bg-yellow-400/10 text-yellow-300 px-1 py-0.2 rounded font-bold">AGILIDAD GUI</span>
            </div>

            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Hace que ventanas y menús respondan al instante sin demoras artificiales.
            </p>

            <div className="space-y-1.5 bg-black/50 p-2 rounded border border-zinc-800 text-[9px]">
              <div>
                <div className="flex justify-between text-white font-bold">
                  <span>MenuShowDelay (Win+R → regedit):</span>
                  <span className="text-yellow-400">50 a 100 ms</span>
                </div>
                <span className="text-zinc-400 font-sans-editorial block text-[8.5px]">
                  Ruta: <code>HKCU\Control Panel\Desktop</code>. Windows espera por defecto 400 ms antes de abrir un submenú. Bajarlo a 50 ms da respuesta inmediata sin aperturas accidentales. (Revertir: 400).
                </span>
              </div>

              <div className="border-t border-zinc-800/60 pt-1">
                <div className="flex justify-between text-white font-bold">
                  <span>Animaciones (SystemPropertiesPerformance):</span>
                  <span className="text-sky-300">Quirúrgico</span>
                </div>
                <span className="text-zinc-400 font-sans-editorial block text-[8.5px]">
                  Desactivar animaciones al minimizar/maximizar. <strong>Conservar siempre:</strong> <em>"Suavizar bordes para las fuentes de pantalla"</em> para evitar textos pixelados.
                </span>
              </div>
            </div>
          </div>

          <div className="p-1 bg-yellow-400/10 border border-yellow-400/20 rounded mt-1 text-[8px] text-yellow-300">
            <strong>Impacto:</strong> Elimina tiempos de animación visual. Cero impacto en cómputo 3D.
          </div>
        </div>

        {/* Pillar 2: Real Hardware Performance */}
        <div className="bg-[#0e1118] border border-emerald-500/40 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>02 // RENDIMIENTO REAL DE HARDWARE</span>
              </div>
              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">ENERGÍA & CPU</span>
            </div>

            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-snug mb-1.5">
              Configuraciones que sí afectan cómputo, temperaturas y despacho de hilos en CPU.
            </p>

            <div className="space-y-1.5 bg-black/50 p-2 rounded border border-zinc-800 text-[9px]">
              <div>
                <div className="flex justify-between text-white font-bold">
                  <span>Plan de Energía: ¿Equilibrado o Alto?</span>
                  <span className="text-emerald-400 font-bold">Equilibrado</span>
                </div>
                <span className="text-zinc-400 font-sans-editorial block text-[8.5px]">
                  En PCs modernas, el plan <strong>Equilibrado</strong> permite que los núcleos bajen frecuencia en reposo (menor calor y consumo) y salten a frecuencias turbo en microsegundos ante exigencia. Alto Rendimiento bloquea relojes al máximo innecesariamente.
                </span>
              </div>

              <div className="border-t border-zinc-800/60 pt-1">
                <div className="flex justify-between text-white font-bold">
                  <span>Modo de Juego de Windows (Game Mode):</span>
                  <span className="text-emerald-400 font-bold">Activo (On)</span>
                </div>
                <span className="text-zinc-400 font-sans-editorial block text-[8.5px]">
                  Mantenelo encendido. Prioriza el hilo del juego en primer plano y colabora con el scheduler de Windows en procesadores con núcleos híbridos (P/E cores de Intel) o chips con 3D V-Cache de AMD.
                </span>
              </div>
            </div>
          </div>

          <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded mt-1 text-[8px] text-emerald-300">
            <strong>Impacto:</strong> Eficiencia térmica en reposo y correcta priorización de hilos bajo carga.
          </div>
        </div>

      </div>

      {/* Bottom Summary Bar */}
      <div className="p-2 bg-[#10131c] border border-zinc-800 rounded flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
        <span>CRITERIO EVO: Ajustá la interfaz para que tu escritorio se sienta inmediato, y dejá a tu CPU moderna autorregularse con precisión.</span>
        <span className="text-yellow-400 font-bold">EVALUACIÓN FINAL →</span>
      </div>
    </MagazineMasterPage>
  );
};
