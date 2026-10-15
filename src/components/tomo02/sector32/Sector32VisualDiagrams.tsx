import React, { useState } from "react";
import {
  Layers,
  Cpu,
  Shield,
  Activity,
  ArrowRight,
  Database,
  Lock,
  CheckCircle2,
} from "lucide-react";

export const Sector32VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "NT_ARCHITECTURE_STACK" | "RING_TRANSITION_SYSCALL" | "OBJECT_HANDLE_TABLE"
  >("NT_ARCHITECTURE_STACK");

  const [selectedLayer, setSelectedLayer] = useState<string>("EXECUTIVE");
  const [syscallStep, setSyscallStep] = useState<number>(2);

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080B10] p-5 my-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Laboratorio Forense Visual: Anatomía Interna de Windows NT
          </h4>
        </div>
        <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("NT_ARCHITECTURE_STACK")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "NT_ARCHITECTURE_STACK"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            1. Pila de Arquitectura NT
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("RING_TRANSITION_SYSCALL")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "RING_TRANSITION_SYSCALL"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            2. Transición Ring 3 → Ring 0
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("OBJECT_HANDLE_TABLE")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "OBJECT_HANDLE_TABLE"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3. Tabla de Handles & Objetos
          </button>
        </div>
      </div>

      {/* TAB 1: NT ARCHITECTURE STACK */}
      {activeTab === "NT_ARCHITECTURE_STACK" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Las 5 Capas Estructurales del Núcleo de Windows
            </h5>
            <p className="text-xs text-zinc-300">
              Selecciona una capa para inspeccionar sus responsabilidades, mecanismos de aislamiento y barreras de protección de hardware:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {[
              {
                id: "USER_APPS",
                name: "1. Modo Usuario (Ring 3)",
                sub: "Apps, Servicios, ntdll",
                color: "border-blue-500/40 text-blue-400",
                desc: "Espacio virtual privado de 128 TB por proceso. Aislado por hardware MMU.",
              },
              {
                id: "EXECUTIVE",
                name: "2. NT Executive",
                sub: "Ob, Ps, Mm, Io, Se, Cm",
                color: "border-cyan-500/40 text-cyan-400",
                desc: "Servicios del SO: gestión de memoria, procesos, archivos, registro y seguridad.",
              },
              {
                id: "KERNEL",
                name: "3. Microkernel (Ke)",
                sub: "ntoskrnl.exe",
                color: "border-emerald-500/40 text-emerald-400",
                desc: "Despacho de hilos (Scheduler), sincronización multiprocesador y manejo de interrupciones.",
              },
              {
                id: "HAL",
                name: "4. HAL (Ring 0)",
                sub: "hal.dll",
                color: "border-amber-500/40 text-amber-400",
                desc: "Oculta el APIC, timers de placa madre y controladores de bus físico.",
              },
              {
                id: "HARDWARE",
                name: "5. Silicio / CPU",
                sub: "Cores, TLB, Cache L1-L3",
                color: "border-purple-500/40 text-purple-400",
                desc: "Microarquitectura física ejecutando instrucciones y forzando privilegios CPL.",
              },
            ].map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLayer === layer.id
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "bg-[#0A0E17] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <span className={`text-xs font-mono font-bold block mb-1 ${layer.color}`}>{layer.name}</span>
                <span className="text-[10px] font-mono text-zinc-400 block mb-2">{layer.sub}</span>
                <p className="text-[10px] text-zinc-300 leading-snug">{layer.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-cyan-500/30 font-mono text-xs flex items-center justify-between">
            <span className="text-zinc-400">
              Frontera de seguridad inquebrantable: <span className="text-cyan-300 font-bold">Ring 3 (no privilegiado) ⇄ Ring 0 (supervisor de hardware)</span>
            </span>
            <span className="text-[10px] text-zinc-500">SSDT Dispatcher</span>
          </div>
        </div>
      )}

      {/* TAB 2: RING TRANSITION SYSCALL */}
      {activeTab === "RING_TRANSITION_SYSCALL" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Secuencia de Transición por Hardware con la Instrucción SYSCALL (x64)
            </h5>
            <p className="text-xs text-zinc-300">
              Avanza en los pasos de la llamada para comprender cómo la CPU conmuta registros y punteros de pila de forma segura:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {[
              {
                step: 1,
                title: "1. Preparación en Ring 3",
                reg: "EAX = Syscall Number (ej. 0x55)",
                desc: "ntdll.dll carga el ID de servicio en EAX y guarda el puntero de contexto en R10.",
              },
              {
                step: 2,
                title: "2. Disparo de SYSCALL",
                reg: "CPU CPL: 3 → 0",
                desc: "El procesador carga RIP desde MSR_LSTAR (apuntando a KiSystemCall64).",
              },
              {
                step: 3,
                title: "3. Kernel Stack Swap",
                reg: "RSP = ETHREAD.KernelStack",
                desc: "La CPU conmuta al stack de kernel protegido del hilo para evitar desbordamientos de usuario.",
              },
              {
                step: 4,
                title: "4. Despacho SSDT & SYSRET",
                reg: "CPL: 0 → 3 (Retorno seguro)",
                desc: "Se ejecuta la función del Executive (ej. NtReadFile) y SYSRET devuelve el resultado.",
              },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setSyscallStep(s.step)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  syscallStep === s.step
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "bg-[#0A0E17] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">{s.title}</span>
                  {syscallStep === s.step && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="p-1.5 rounded bg-black/60 font-mono text-[10px] text-emerald-300 mb-2">{s.reg}</div>
                <p className="text-[10px] text-zinc-300 leading-snug">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OBJECT HANDLE TABLE */}
      {activeTab === "OBJECT_HANDLE_TABLE" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Arquitectura de la Tabla de Handles de Proceso y Cabecera OBJECT_HEADER
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Un <strong>Handle</strong> es un número de índice entero (ej. 0x0004) que la API de usuario recibe. El kernel utiliza ese índice para consultar una tabla privada de 3 niveles, localizando la cabecera <strong>OBJECT_HEADER</strong> en memoria no paginada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">1. Espacio de Usuario (Ring 3):</span>
              <div className="p-2 rounded bg-black text-cyan-300 text-xs">HANDLE hFile = 0x00000028;</div>
              <p className="text-[10px] text-zinc-400">El proceso no tiene punteros de memoria; solo un ticket numérico opaco.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">2. Tabla de Descriptores (EPROCESS):</span>
              <div className="p-2 rounded bg-black text-emerald-300 text-xs">Index 10 → GrantedAccess: 0x120089</div>
              <p className="text-[10px] text-zinc-400">Verifica que el handle fue abierto con permisos de lectura/escritura válidos.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <span className="text-zinc-400 text-[10px] uppercase font-bold block">3. Objeto Real en Kernel (Ring 0):</span>
              <div className="p-2 rounded bg-black text-purple-300 text-xs">OBJECT_HEADER [PointerCount: 2, Handles: 1]</div>
              <p className="text-[10px] text-zinc-400">El objeto solo se destruye físicamente cuando PointerCount y Handles = 0.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
