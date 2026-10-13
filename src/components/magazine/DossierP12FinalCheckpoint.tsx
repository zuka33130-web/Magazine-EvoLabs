import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { CheckCircle2, RotateCcw, FileText, ClipboardCheck, ArrowRight, ShieldCheck, Award, Timer, HardDrive, Cpu, Sliders } from 'lucide-react';

export const DossierP12FinalCheckpoint: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-38"
      pageNumber={38}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 12 // BALANCE Y CHECKPOINT B"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // BALANCE Y CHECKPOINT B // PÁGINA 12 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            El Checkpoint Final: Tu Medición Real
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          COMPARATIVA A/B // SIN PROMESAS ARTIFICIALES
        </span>
      </div>

      {/* Narrative Lead */}
      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2">
        Llegó el momento del reinicio general. Con las apps de inicio auditadas, servicios innecesarios en Manual, tareas programadas bajo control y temporales depurados, reiniciá tu equipo. Esperá 3 a 5 minutos en el escritorio para que el sistema estabilice su reposo y completá tu <strong>Checkpoint B</strong> frente a los datos basales que registraste en la Página 14.
      </p>

      {/* Checkpoint A vs Checkpoint B Interactive Reader Matrix */}
      <div className="bg-[#0b0e15] border border-yellow-500/40 rounded-lg p-2.5 mb-2 font-mono-tech">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-yellow-400 mb-1.5">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5" />
            TABLA DE MEDICIÓN: TU CHECKPOINT A VS TU CHECKPOINT B
          </span>
          <span className="text-zinc-500 text-[8.5px]">ANOTÁ TUS VALORES REALES</span>
        </div>

        <div className="grid grid-cols-12 gap-1 text-[9px] pb-1 border-b border-zinc-800/80 font-bold text-zinc-400">
          <div className="col-span-4 text-left">MÉTRICA A EVALUAR</div>
          <div className="col-span-2 text-center text-amber-400">CHECKPOINT A</div>
          <div className="col-span-2 text-center text-emerald-400">CHECKPOINT B</div>
          <div className="col-span-4 text-left">EJEMPLO DIDÁCTICO / INTERPRETACIÓN</div>
        </div>

        <div className="space-y-1 pt-1 text-[9px]">
          {/* Row 1: Boot Time */}
          <div className="grid grid-cols-12 gap-1 items-center bg-[#131722] p-1.5 rounded border border-zinc-800/60">
            <span className="col-span-4 text-left text-white font-bold flex items-center gap-1">
              <Timer className="w-3 h-3 text-yellow-400 shrink-0" />
              Tiempo de arranque (BIOS/Cronómetro):
            </span>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-zinc-700 text-amber-300 font-mono-tech">
              ___ seg
            </div>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-emerald-500/40 text-emerald-300 font-mono-tech font-bold">
              ___ seg
            </div>
            <span className="col-span-4 text-zinc-400 text-left font-sans-editorial text-[8.5px]">
              Ilustrativo: Menos ejecutables compitiendo en la lectura inicial del almacenamiento.
            </span>
          </div>

          {/* Row 2: Free Space */}
          <div className="grid grid-cols-12 gap-1 items-center bg-[#131722] p-1.5 rounded border border-zinc-800/60">
            <span className="col-span-4 text-left text-white font-bold flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-sky-400 shrink-0" />
              Espacio libre en C: (GB reales):
            </span>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-zinc-700 text-amber-300 font-mono-tech">
              ___ GB
            </div>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-emerald-500/40 text-emerald-300 font-mono-tech font-bold">
              ___ GB
            </div>
            <span className="col-span-4 text-zinc-400 text-left font-sans-editorial text-[8.5px]">
              Ilustrativo: Depende de actualizaciones acumuladas previas y archivos %temp%.
            </span>
          </div>

          {/* Row 3: Background Processes */}
          <div className="grid grid-cols-12 gap-1 items-center bg-[#131722] p-1.5 rounded border border-zinc-800/60">
            <span className="col-span-4 text-left text-white font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400 shrink-0" />
              Procesos en segundo plano (Admin):
            </span>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-zinc-700 text-amber-300 font-mono-tech">
              ___ proc
            </div>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-emerald-500/40 text-emerald-300 font-mono-tech font-bold">
              ___ proc
            </div>
            <span className="col-span-4 text-zinc-400 text-left font-sans-editorial text-[8.5px]">
              Ilustrativo: Reducción de servicios residentes y menor cambio de contexto en CPU.
            </span>
          </div>

          {/* Row 4: UI Responsiveness */}
          <div className="grid grid-cols-12 gap-1 items-center bg-[#131722] p-1.5 rounded border border-zinc-800/60">
            <span className="col-span-4 text-left text-white font-bold flex items-center gap-1">
              <Sliders className="w-3 h-3 text-emerald-400 shrink-0" />
              Sensación de respuesta de interfaz:
            </span>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-zinc-700 text-zinc-400 font-mono-tech">
              Estándar
            </div>
            <div className="col-span-2 text-center py-0.5 px-1 bg-black/50 rounded border border-emerald-500/40 text-emerald-300 font-mono-tech font-bold">
              Inmediata
            </div>
            <span className="col-span-4 text-zinc-400 text-left font-sans-editorial text-[8.5px]">
              Ajustes de MenuShowDelay y reducción de animaciones redundantes de ventanas.
            </span>
          </div>
        </div>

        <div className="mt-2 p-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded text-[9px] text-zinc-300 font-sans-editorial">
          <strong className="text-yellow-400 font-mono-tech block">INTERPRETACIÓN REALISTA:</strong>
          No te prometemos que tus juegos dupliquen sus FPS por arte de magia. Lo que lograste es un sistema operativo ordenado, transparente, predecible y sin procesos fantasma disputando recursos en segundo plano.
        </div>
      </div>

      {/* Bitacora & Rollback Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1 mb-2 font-mono-tech text-xs">
        
        {/* Bitacora Box */}
        <div className="p-2.5 bg-[#0e1118] border border-zinc-800 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold pb-1 border-b border-zinc-800 mb-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>BITÁCORA PERSONAL: "MI WINDOWS"</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mb-2">
              Tu registro de intervenciones. Si dentro de unos meses instalás un software o periférico específico y algo requiere atención, sabés con certeza qué cambiaste:
            </p>
            <div className="space-y-1 text-[9px] text-zinc-400">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Apps de inicio documentadas en tu lista de exclusión.</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Servicios secundarios en modo Manual (arrancan si los llamás).</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Tareas programadas innecesarias deshabilitadas (no borradas).</span>
              </div>
            </div>
          </div>
          <span className="text-[8px] text-zinc-500 pt-1 border-t border-zinc-800 mt-1 block">
            REGISTRO TÉCNICO ORDENADO
          </span>
        </div>

        {/* Rollback Guide */}
        <div className="p-2.5 bg-[#0e1118] border border-zinc-800 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold pb-1 border-b border-zinc-800 mb-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>PROTOCOLO DE REVERSIÓN ÁGIL</span>
            </div>
            <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mb-2">
              Si en algún momento decidís restablecer cualquier ajuste, cada paso es fácilmente reversible:
            </p>
            <div className="space-y-1 text-[9px] text-zinc-400">
              <span>• Reactivar inicio: Admin. de Tareas → Pestaña Inicio → Clic derecho → Habilitar.</span>
              <span>• Reactivar servicio: services.msc → Cambiar 'Manual' a 'Automático'.</span>
              <span>• Revertir menú: regedit → Colocar 400 en MenuShowDelay.</span>
            </div>
          </div>
          <span className="text-[8px] text-emerald-400 pt-1 border-t border-zinc-800 mt-1 block font-bold">
            FÁCILMENTE REVERSIBLE: BAJO RIESGO SI SE SIGUEN LOS PASOS
          </span>
        </div>

      </div>

      {/* Editorial Final Closing Banner */}
      <div className="p-2.5 bg-yellow-400/10 border-2 border-yellow-400/60 rounded-lg text-center font-mono-tech">
        <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest block">
          CIERRE EDITORIAL DEL DOSSIER CENTRAL // EVO LABS
        </span>
        <p className="text-xs sm:text-sm text-white font-display font-black uppercase tracking-tight mt-0.5">
          "No se trata de tener menos cosas, se trata de que nada esté ahí sin que sepas por qué."
        </p>
      </div>
    </MagazineMasterPage>
  );
};
