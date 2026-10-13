import React, { useState } from 'react';
import {
  User,
  Cpu,
  Layers,
  HardDrive,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  Clock,
  Fingerprint,
  FileText,
  Folder,
  ArrowRight,
  ArrowDown,
  Info,
  Laptop,
  Globe,
  Lock,
  RotateCcw,
  Sparkles,
  Sliders,
  ShieldAlert,
  Key,
} from 'lucide-react';

interface VisualDiagramProps {
  code: string;
}

export const Sector00VisualDiagram: React.FC<VisualDiagramProps> = ({ code }) => {
  switch (code) {
    case '00.01':
      return <Diagram0001 />;
    case '00.02':
      return <Diagram0002 />;
    case '00.03':
      return <Diagram0003 />;
    case '00.04':
      return <Diagram0004 />;
    case '00.05':
      return <Diagram0005 />;
    case '00.06':
      return <Diagram0006 />;
    case '00.07':
      return <Diagram0007 />;
    case '00.08':
      return <Diagram0008 />;
    case '00.09':
      return <Diagram0009 />;
    case '00.10':
      return <Diagram0010 />;
    case '00.11':
      return <Diagram0011 />;
    case '00.12':
      return <Diagram0012 />;
    case '00.13':
      return <Diagram0013 />;
    case '00.14':
      return <Diagram0014 />;
    case '00.15':
      return <Diagram0015 />;
    default:
      return null;
  }
};

/* ==========================================================================
   00.01 — DIAGRAMA: USUARIO → APLICACIÓN → WINDOWS → DRIVERS → HARDWARE
   ========================================================================== */
const Diagram0001: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(2);

  const layers = [
    {
      id: 0,
      title: 'USUARIO HUMANO',
      subtitle: 'Intención y comandos visuales',
      desc: 'El operador interactúa mediante teclado, mouse o pantalla táctil enviando intenciones de usuario.',
      icon: User,
      color: 'text-zinc-200',
      tag: 'Ring 3 - Espacio de Usuario',
    },
    {
      id: 1,
      title: 'APLICACIONES & SHELL (EXPLORER.EXE)',
      subtitle: 'Navegadores, juegos, interfaces win32/XAML',
      desc: 'Programas de usuario. No pueden tocar el hardware directamente; realizan solicitudes al SO mediante llamadas de sistema (Syscalls).',
      icon: Laptop,
      color: 'text-[#60CDFF]',
      tag: 'Ring 3 - User Mode Isolation',
    },
    {
      id: 2,
      title: 'KERNEL WINDOWS NT & SERVICIOS',
      subtitle: 'Administración de memoria, procesos, hilos y seguridad',
      desc: 'El corazón indivisible del sistema. Arbitra accesos a la CPU, memoria RAM y asigna prioridades con permisos estrictos.',
      icon: Layers,
      color: 'text-[#00A4EF]',
      tag: 'Ring 0 - Kernel Mode',
    },
    {
      id: 3,
      title: 'CONTROLADORES (DRIVERS)',
      subtitle: 'Traductores de código a señales eléctricas de hardware',
      desc: 'Software de bajo nivel que traduce las llamadas abstractas del kernel en instrucciones electrónicas para cada chip específico.',
      icon: Terminal,
      color: 'text-[#60CDFF]',
      tag: 'Ring 0 - Driver Space',
    },
    {
      id: 4,
      title: 'HARDWARE FÍSICO',
      subtitle: 'Procesador, RAM, SSD NVMe, GPU, Chipset',
      desc: 'El silicio real. Ejecuta transistores, almacenamiento electromagnético y cálculos matemáticos brutos.',
      icon: Cpu,
      color: 'text-[#FFC700]',
      tag: 'Silicio & Circuitos',
    },
  ];

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
            DIAGRAMA EVO // ARQUITECTURA EN CAPAS
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          HAZ CLIC EN UNA CAPA PARA INSPECCIONAR
        </span>
      </div>

      {/* Layer stack */}
      <div className="space-y-2">
        {layers.map((layer, index) => {
          const isSelected = activeLayer === index;
          const Icon = layer.icon;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(index)}
              className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                isSelected
                  ? 'bg-[#111622] border-[#00A4EF]/60 shadow-[0_0_20px_rgba(0,164,239,0.15)] text-white'
                  : 'bg-[#0B0F17] border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-[#0078D4]/20 border-[#00A4EF]/50 text-[#00A4EF]'
                      : 'bg-zinc-900 border-white/5 text-zinc-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00A4EF]">
                      NIVEL 0{index + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-sans text-white truncate">
                      {layer.title}
                    </span>
                  </div>
                  <div className="text-xs font-sans text-zinc-400 truncate mt-0.5">
                    {layer.subtitle}
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 hidden sm:inline-block ${
                  index >= 2
                    ? 'bg-[#0078D4]/15 border-[#00A4EF]/30 text-[#60CDFF]'
                    : 'bg-zinc-800/50 border-white/10 text-zinc-400'
                }`}
              >
                {layer.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected layer details */}
      <div className="p-4 rounded-xl bg-[#0E131F] border border-[#00A4EF]/20 space-y-1.5 animate-fadeIn">
        <div className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#00A4EF]" />
          <span>ROL TÉCNICO EN EL SISTEMA: {layers[activeLayer].title}</span>
        </div>
        <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">
          {layers[activeLayer].desc}
        </p>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.02 — MAPA: QUÉ ES WINDOWS / QUÉ NO ES WINDOWS
   ========================================================================== */
const Diagram0002: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          DIAGRAMA EVO // DESMONTAJE DE LÍMITES
        </span>
        <span className="text-[10px] font-mono text-zinc-500">REPRESENTACIÓN DIDÁCTICA</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Es Windows */}
        <div className="p-4 rounded-xl bg-[#0A121A] border border-[#00A4EF]/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#60CDFF] uppercase">
            <CheckCircle2 className="w-4 h-4 text-[#00A4EF]" />
            <span>SÍ ES WINDOWS (SISTEMA OPERATIVO BASE)</span>
          </div>

          <ul className="space-y-2 text-xs font-sans text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-[#00A4EF] font-bold font-mono">•</span>
              <span><strong>Kernel NT (`ntoskrnl.exe`):</strong> Gestión de hilos, memoria física y prioridad de CPU.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00A4EF] font-bold font-mono">•</span>
              <span><strong>Subsistema LSASS:</strong> Autenticación, seguridad local y tokens de sesión.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00A4EF] font-bold font-mono">•</span>
              <span><strong>Servicios de Plataforma:</strong> Spooler de impresión, audio (audiodg), red y RPC.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00A4EF] font-bold font-mono">•</span>
              <span><strong>Gestor de Archivos (NTFS / ReFS):</strong> Asignación de bloques, permisos ACL y registros de volumen.</span>
            </li>
          </ul>
        </div>

        {/* No es Windows */}
        <div className="p-4 rounded-xl bg-[#11141A] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase">
            <Info className="w-4 h-4 text-zinc-500" />
            <span>NO ES WINDOWS (SOFTWARE/AGREGADO)</span>
          </div>

          <ul className="space-y-2 text-xs font-sans text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 font-bold font-mono">•</span>
              <span><strong>Microsoft Edge / Chrome:</strong> Navegadores instalados sobre la plataforma.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 font-bold font-mono">•</span>
              <span><strong>OneDrive Client:</strong> Servicio de sincronización en nube de archivos de usuario.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 font-bold font-mono">•</span>
              <span><strong>Microsoft Office / Teams:</strong> Aplicaciones ofimáticas y de comunicación comercial.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-600 font-bold font-mono">•</span>
              <span><strong>Antivirus de Terceros / Games:</strong> Capas de software montadas en espacio de usuario.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.03 — COMPARADOR VISUAL: HOME / PRO / ENTERPRISE / EDUCATION
   ========================================================================== */
const Diagram0003: React.FC = () => {
  const [selectedEd, setSelectedEd] = useState<'home' | 'pro' | 'ent' | 'edu'>('pro');

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          DIAGRAMA EVO // MATRIZ DE EDICIONES
        </span>
        <span className="text-[10px] font-mono text-zinc-500">PARIDAD DE PERFORMANCE / DIFERENCIA DE HERRAMIENTAS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2">
        {(['home', 'pro', 'ent', 'edu'] as const).map((ed) => (
          <button
            key={ed}
            onClick={() => setSelectedEd(ed)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer text-center ${
              selectedEd === ed
                ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_15px_rgba(0,164,239,0.2)]'
                : 'bg-[#111620] border border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {ed === 'home' ? 'Home' : ed === 'pro' ? 'Pro' : ed === 'ent' ? 'Enterprise' : 'Education'}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-[#0D121B] border border-[#00A4EF]/20 space-y-3">
        {selectedEd === 'home' && (
          <div className="space-y-2 text-xs font-sans text-zinc-300">
            <div className="font-mono font-bold text-[#60CDFF] uppercase text-sm">1. WINDOWS 11 HOME</div>
            <p><strong>Orientación:</strong> Usuario final, laptops personales y hogar.</p>
            <p><strong>Kernel &amp; Performance:</strong> Idéntico a Pro/Enterprise en FPS, DirectX, multitarea y potencia de GPU.</p>
            <p className="text-amber-400 font-mono"><strong>Ausente en Home:</strong> Directivas de Grupo Local (`gpedit.msc`), Cifrado BitLocker nativo de volumen, Servidor RDP y Windows Sandbox.</p>
          </div>
        )}

        {selectedEd === 'pro' && (
          <div className="space-y-2 text-xs font-sans text-zinc-300">
            <div className="font-mono font-bold text-[#60CDFF] uppercase text-sm">2. WINDOWS 11 PRO (ESTÁNDAR DE TALLER)</div>
            <p><strong>Orientación:</strong> Profesionales, desarrolladores, técnicos y pequeñas empresas.</p>
            <p><strong>Kernel &amp; Performance:</strong> Idéntico rendimiento que Home en cargas de trabajo brutas.</p>
            <p className="text-[#16C784] font-mono"><strong>Herramientas agregadas:</strong> Editor de Directivas de Grupo (`gpedit.msc`), BitLocker, Hyper-V, Windows Sandbox y Host de Escritorio Remoto (RDP).</p>
          </div>
        )}

        {selectedEd === 'ent' && (
          <div className="space-y-2 text-xs font-sans text-zinc-300">
            <div className="font-mono font-bold text-[#60CDFF] uppercase text-sm">3. WINDOWS 11 ENTERPRISE</div>
            <p><strong>Orientación:</strong> Corporaciones y grandes organizaciones informáticas.</p>
            <p><strong>Kernel &amp; Performance:</strong> Mismo motor base con políticas avanzadas de seguridad corporativa.</p>
            <p className="text-[#60CDFF] font-mono"><strong>Herramientas agregadas:</strong> Desactivación total de telemetría por GPO, AppLocker, DirectAccess y canales de soporte de largo plazo (LTSC / IoT).</p>
          </div>
        )}

        {selectedEd === 'edu' && (
          <div className="space-y-2 text-xs font-sans text-zinc-300">
            <div className="font-mono font-bold text-[#60CDFF] uppercase text-sm">4. WINDOWS 11 EDUCATION</div>
            <p><strong>Orientación:</strong> Escuelas, universidades, docentes y centros de investigación académica.</p>
            <p><strong>Kernel &amp; Performance:</strong> Basado directamente en la imagen de Enterprise con licenciamiento educativo.</p>
            <p className="text-[#60CDFF] font-mono"><strong>Herramientas agregadas:</strong> Mismas directivas de seguridad avanzada que Enterprise, optimización para administración masiva de aulas y bloqueo de sugerencias comerciales de consumidor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   00.04 — ESQUEMA: x64 vs ARM64
   ========================================================================== */
const Diagram0004: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          ESQUEMA EVO // ARQUITECTURAS DE PROCESADOR
        </span>
        <span className="text-[10px] font-mono text-zinc-500">CISA x64 vs ARM64</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* x64 */}
        <div className="p-4 rounded-xl bg-[#0D121C] border border-[#00A4EF]/30 space-y-2">
          <div className="text-xs font-mono font-bold text-[#60CDFF] uppercase">
            ARQUITECTURA x64 (Intel 64 / AMD64)
          </div>
          <p className="text-xs font-sans text-zinc-300">
            Estándar CISC tradicional de PCs de escritorio y laptops de alto rendimiento.
          </p>
          <div className="p-2.5 rounded bg-[#070A0F] border border-white/5 text-[11px] font-mono text-zinc-300 space-y-1">
            <div>• Modo Usuario: Ejecución directa x64 nativa</div>
            <div>• Modo Kernel: Drivers nativos x64 (Ring 0)</div>
            <div className="text-[#16C784]">• Compatibilidad: 100% de apps y periféricos históricos</div>
          </div>
        </div>

        {/* ARM64 */}
        <div className="p-4 rounded-xl bg-[#0D121C] border border-white/10 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase">
            ARQUITECTURA ARM64 (Qualcomm Snapdragon X / Surface)
          </div>
          <p className="text-xs font-sans text-zinc-300">
            Conjunto RISC de alta eficiencia energética para dispositivos ultramóviles.
          </p>
          <div className="p-2.5 rounded bg-[#070A0F] border border-white/5 text-[11px] font-mono text-zinc-300 space-y-1">
            <div>• Modo Usuario: Emulación Prism transparente para apps x64</div>
            <div className="text-red-400 font-bold">• Modo Kernel: NINGUNA emulación para drivers x64 en Ring 0</div>
            <div className="text-amber-300">• Exigencia: Requiere drivers nativos ARM64 del fabricante</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.05 — RUTA VISUAL: CÓMO IDENTIFICAR QUÉ WINDOWS TENGO
   ========================================================================== */
const Diagram0005: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          MAPA PERICIAL // 4 VÍAS DE INTERROGACIÓN
        </span>
        <span className="text-[10px] font-mono text-zinc-500">COMPROBACIÓN CRUZADA</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#0C1019] border border-white/5 text-center space-y-1">
          <div className="text-xs font-mono font-bold text-[#60CDFF]">1. WINVER</div>
          <div className="text-[11px] font-sans text-zinc-400">Resumen rápido</div>
          <div className="text-[10px] font-mono text-zinc-500 pt-1">Edición + OS Build</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0C1019] border border-white/5 text-center space-y-1">
          <div className="text-xs font-mono font-bold text-[#60CDFF]">2. MSINFO32</div>
          <div className="text-[11px] font-sans text-zinc-400">Radiografía total</div>
          <div className="text-[10px] font-mono text-zinc-500 pt-1">Firmware + Arch + RAM</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0C1019] border border-white/5 text-center space-y-1">
          <div className="text-xs font-mono font-bold text-[#60CDFF]">3. CONFIGURACIÓN</div>
          <div className="text-[11px] font-sans text-zinc-400">Interfaz moderna</div>
          <div className="text-[10px] font-mono text-zinc-500 pt-1">Sistema &gt; Acerca de</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0C1019] border border-white/5 text-center space-y-1">
          <div className="text-xs font-mono font-bold text-[#60CDFF]">4. TERMINAL</div>
          <div className="text-[11px] font-sans text-zinc-400">CMD / PowerShell</div>
          <div className="text-[10px] font-mono text-zinc-500 pt-1">`systeminfo`</div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.06 — VISUAL EXPLICATIVO ANOTADO: WINVER + MSINFO32
   ========================================================================== */
const Diagram0006: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          CAPTURA EXPLICATIVA EVO // WINVER & MSINFO32
        </span>
        <span className="text-[10px] font-mono text-zinc-500">REPRESENTACIÓN DIDÁCTICA ANOTADA</span>
      </div>

      <div className="p-4 rounded-xl bg-[#05070B] border border-[#00A4EF]/30 font-mono text-xs text-zinc-300 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[#60CDFF]">
          <span>Acerca de Windows (`winver`) &amp; Información del Sistema (`msinfo32`)</span>
          <span className="text-[10px] text-zinc-500">PROVENANCE: SYSTEM_REPORTED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded bg-[#0A0E17] border border-white/5 space-y-2">
            <div className="text-[#00A4EF] font-bold">① EDICIÓN DEL SISTEMA</div>
            <p className="text-zinc-400 text-[11px]">e.g. Windows 11 Pro</p>
            <div className="text-[#00A4EF] font-bold pt-1">② COMPILACIÓN DE SO (BUILD + UBR)</div>
            <p className="text-zinc-400 text-[11px]">e.g. Compilación 26100.2033</p>
          </div>

          <div className="p-3 rounded bg-[#0A0E17] border border-white/5 space-y-2">
            <div className="text-[#00A4EF] font-bold">③ TIPO DE SISTEMA (ARQUITECTURA)</div>
            <p className="text-zinc-400 text-[11px]">e.g. PC basado en x64 / ARM64</p>
            <div className="text-[#00A4EF] font-bold pt-1">④ MODO DE BIOS / FIRMWARE</div>
            <p className="text-zinc-400 text-[11px]">e.g. UEFI / Heredado (CSM)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.07 — JERARQUÍA VISUAL: VERSIÓN → BUILD → REVISIÓN
   ========================================================================== */
const Diagram0007: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          JERARQUÍA TÉCNICA // DNI DEL KERNEL
        </span>
        <span className="text-[10px] font-mono text-zinc-500">DESGLOSE DE COMPILACIÓN</span>
      </div>

      <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-[#00A4EF] font-bold text-sm">
          <span>WINDOWS 11</span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-white">24H2</span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-[#60CDFF]">26100</span>
          <span className="text-zinc-500">.</span>
          <span className="text-amber-400">2033</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-sans pt-2">
          <div className="p-2.5 rounded bg-[#111622] border border-white/5">
            <div className="font-mono font-bold text-white">VERSIÓN (24H2)</div>
            <div className="text-zinc-400 mt-1">Actualización de características anual.</div>
          </div>
          <div className="p-2.5 rounded bg-[#111622] border border-white/5">
            <div className="font-mono font-bold text-[#60CDFF]">BUILD MAYOR (26100)</div>
            <div className="text-zinc-400 mt-1">Base de código del núcleo NT.</div>
          </div>
          <div className="p-2.5 rounded bg-[#111622] border border-white/5">
            <div className="font-mono font-bold text-amber-400">UBR REVISIÓN (.2033)</div>
            <div className="text-zinc-400 mt-1">Parches de seguridad mensuales acumulativos.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.08 — COMPARACIÓN: CUENTA LOCAL vs CUENTA MICROSOFT
   ========================================================================== */
const Diagram0008: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          COMPARATIVA TÉCNICA // SESIÓN & AUTENTICACIÓN
        </span>
        <span className="text-[10px] font-mono text-zinc-500">SAM LOCAL vs IDENTITY CLOUD</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
        <div className="p-4 rounded-xl bg-[#0A1017] border border-[#00A4EF]/30 space-y-2">
          <div className="font-mono font-bold text-[#60CDFF] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00A4EF]" />
            <span>CUENTA LOCAL (SAM AUTÓNOMA)</span>
          </div>
          <p className="text-zinc-300">
            Hash de clave almacenado únicamente en `C:\Windows\System32\config\SAM`.
          </p>
          <div className="text-zinc-400 text-[11px] pt-1 border-t border-white/5 space-y-1 font-mono">
            <div>✓ Funciona sin internet de forma indefinida</div>
            <div>✓ Máxima privacidad local sin telemetría de cuenta</div>
            <div>⚠️ La clave se recupera solo localmente si hay backup</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10141D] border border-white/10 space-y-2">
          <div className="font-mono font-bold text-zinc-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00A4EF]" />
            <span>CUENTA MICROSOFT (MSA CLOUD)</span>
          </div>
          <p className="text-zinc-300">
            Sesión autenticada periódicamente contra servidores en la nube de Microsoft.
          </p>
          <div className="text-zinc-400 text-[11px] pt-1 border-t border-white/5 space-y-1 font-mono">
            <div>✓ Guarda claves BitLocker automáticamente en nube</div>
            <div>✓ Sincronización de licencias digitales y ajustes</div>
            <div>⚠️ Requiere token activo y conexión a internet</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.09 — ESQUEMA: USUARIO ESTÁNDAR → UAC → ADMINISTRADOR
   ========================================================================== */
const Diagram0009: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          ESQUEMA DE SEGURIDAD // TOKEN DE PRIVILEGIOS UAC
        </span>
        <span className="text-[10px] font-mono text-zinc-500">SPLIT TOKEN MODEL</span>
      </div>

      <div className="space-y-3 text-xs font-sans">
        <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/5 flex items-center justify-between">
          <div className="font-mono font-bold text-zinc-300">1. SESIÓN HABITUAL (Medium Integrity)</div>
          <span className="text-[10px] font-mono text-zinc-500">Token filtrado por defecto</span>
        </div>

        <div className="p-3 rounded-xl bg-[#141A26] border border-[#00A4EF]/40 text-center space-y-1">
          <div className="font-mono font-bold text-[#60CDFF] flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#00A4EF]" />
            <span>2. BARRERA UAC (Secure Desktop Elevation)</span>
          </div>
          <p className="text-[11px] text-zinc-400">Solicitud explícita de elevación para inyectar privilegios administrativos al proceso objetivo.</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/5 flex items-center justify-between">
          <div className="font-mono font-bold text-white">3. PROCESO ELEVADO (High Integrity)</div>
          <span className="text-[10px] font-mono text-amber-400">Admin Privileges Active</span>
        </div>

        <div className="p-3 rounded-xl bg-[#05070B] border border-purple-500/30 flex items-center justify-between">
          <div className="font-mono font-bold text-purple-300">4. SYSTEM / TrustedInstaller (System Level)</div>
          <span className="text-[10px] font-mono text-purple-400">Protección WRP del Kernel</span>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.10 — MAPA VISUAL: ESCRITORIO | EXPLORER | CONFIGURACIÓN | PANEL DE CONTROL
   ========================================================================== */
const Diagram0010: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          MAPA DE INTERFACES // CONVIVENCIA MODERNA &amp; CLÁSICA
        </span>
        <span className="text-[10px] font-mono text-zinc-500">CONSOLAS DE GESTIÓN</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
        <div className="p-3.5 rounded-xl bg-[#0C1019] border border-white/5 space-y-2">
          <div className="font-mono font-bold text-white">ESCRITORIO &amp; SHELL</div>
          <p className="text-zinc-400 text-[11px]">`explorer.exe` // Proceso gráfico de usuario.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C1019] border border-white/5 space-y-2">
          <div className="font-mono font-bold text-[#60CDFF]">CONFIGURACIÓN</div>
          <p className="text-zinc-400 text-[11px]">`SystemSettings.exe` // Interfaz moderna WinUI.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C1019] border border-white/5 space-y-2">
          <div className="font-mono font-bold text-amber-400">PANEL DE CONTROL</div>
          <p className="text-zinc-400 text-[11px]">`control.exe` (`.cpl`) // Applets clásicos Win32.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C1019] border border-white/5 space-y-2">
          <div className="font-mono font-bold text-purple-300">CONSOLAS MMC</div>
          <p className="text-zinc-400 text-[11px]">`.msc` // MMC (`services.msc`, `devmgmt.msc`).</p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.11 — ÁRBOL VISUAL DE DIRECTORIOS IMPORTANTES
   ========================================================================== */
const Diagram0011: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          ANATOMÍA DE RUTAS // ESTRUCTURA CANÓNICA DE C:\
        </span>
        <span className="text-[10px] font-mono text-zinc-500">SISTEMA DE ARCHIVOS</span>
      </div>

      <div className="p-4 rounded-xl bg-[#07090F] border border-white/5 font-mono text-xs text-zinc-300 space-y-2">
        <div className="text-[#00A4EF] font-bold">C:\ (Unidad de Sistema)</div>
        <div className="pl-4 space-y-1.5 border-l border-white/10">
          <div>├─ <strong className="text-white">Windows\</strong> → Kernel, System32, controladores y binarios del SO.</div>
          <div>├─ <strong className="text-white">Program Files\</strong> → Aplicaciones nativas de 64 bits (x64 / ARM64).</div>
          <div>├─ <strong className="text-white">Program Files (x86)\</strong> → Aplicaciones de 32 bits (x86 WOW64).</div>
          <div>├─ <strong className="text-amber-300">ProgramData\</strong> (Oculta) → Datos compartidos entre todos los usuarios.</div>
          <div>└─ <strong className="text-white">Users\</strong> → Perfiles personales (Documentos, Escritorio, AppData).</div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.12 — MAPA: VARIABLE DE ENTORNO → RUTA REAL
   ========================================================================== */
const Diagram0012: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          RESOLUCIÓN DE VARIABLES // DINÁMICA DE RUTAS
        </span>
        <span className="text-[10px] font-mono text-zinc-500">%VARIABLE% → RUTA ABSOLUTA</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        <div className="p-2.5 rounded-lg bg-[#0C1019] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[#00A4EF] font-bold">%USERPROFILE%</span>
          <span className="text-zinc-300">C:\Users\&lt;TuUsuario&gt;</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0C1019] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[#00A4EF] font-bold">%APPDATA%</span>
          <span className="text-zinc-300">C:\Users\&lt;TuUsuario&gt;\AppData\Roaming</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0C1019] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[#00A4EF] font-bold">%LOCALAPPDATA%</span>
          <span className="text-zinc-300">C:\Users\&lt;TuUsuario&gt;\AppData\Local</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0C1019] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[#00A4EF] font-bold">%TEMP%</span>
          <span className="text-zinc-300">C:\Users\&lt;TuUsuario&gt;\AppData\Local\Temp</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0C1019] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[#00A4EF] font-bold">%PROGRAMDATA%</span>
          <span className="text-zinc-300">C:\ProgramData</span>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.13 — REPRESENTACIÓN VISUAL DEL PASAPORTE WINDOWS EVO
   ========================================================================== */
const Diagram0013: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-[#00A4EF]/30 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          REPRESENTACIÓN DIDÁCTICA // PASAPORTE WINDOWS EVO 001
        </span>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">PROVENANCE MOTOR ATTACHED</span>
      </div>

      <div className="p-4 rounded-xl bg-[#05080E] border border-white/5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-white font-bold">EXPEDIENTE 001: MATRIZ DE EVIDENCIA</span>
          <span className="text-[10px] text-[#00A4EF] font-bold">[SYSTEM_REPORTED]</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="p-2 bg-[#0C1019] rounded border border-white/5">
            <span className="text-zinc-500 block text-[9px]">EDICIÓN</span>
            <span className="text-white font-bold">Windows 11 Pro</span>
          </div>
          <div className="p-2 bg-[#0C1019] rounded border border-white/5">
            <span className="text-zinc-500 block text-[9px]">COMPILACIÓN</span>
            <span className="text-white font-bold">26100.2033</span>
          </div>
          <div className="p-2 bg-[#0C1019] rounded border border-white/5">
            <span className="text-zinc-500 block text-[9px]">ARQUITECTURA</span>
            <span className="text-white font-bold">x64 (64-bit)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.14 — TIMELINE: BASELINE → CAMBIO → MEDICIÓN → COMPARACIÓN
   ========================================================================== */
const Diagram0014: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          TIMELINE METROLÓGICO // FLUIJO DE LÍNEA BASE
        </span>
        <span className="text-[10px] font-mono text-zinc-500">RIGOR TÉCNICO SIN PLACEBO</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-center">
        <div className="p-3 rounded-xl bg-[#0C1019] border border-[#00A4EF]/30 space-y-1">
          <div className="text-[#00A4EF] font-bold">1. BASELINE</div>
          <div className="text-[10px] text-zinc-400">Captura previa de telemetría en reposo.</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0C1019] border border-white/5 space-y-1">
          <div className="text-amber-400 font-bold">2. CAMBIO</div>
          <div className="text-[10px] text-zinc-400">Intervención aislada de variable única.</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0C1019] border border-white/5 space-y-1">
          <div className="text-[#60CDFF] font-bold">3. MEDICIÓN</div>
          <div className="text-[10px] text-zinc-400">Registro posterior post-intervención.</div>
        </div>

        <div className="p-3 rounded-xl bg-[#0C1019] border border-emerald-500/30 space-y-1">
          <div className="text-[#16C784] font-bold">4. COMPARACIÓN</div>
          <div className="text-[10px] text-zinc-400">Delta numérico real vs hipótesis.</div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   00.15 — FLUJO DE REVERSIBILIDAD
   ========================================================================== */
const Diagram0015: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-mono tracking-widest text-[#00A4EF] uppercase font-bold">
          PROTOCOLO DE REVERSIBILIDAD // BOTÓN DE PÁNICO
        </span>
        <span className="text-[10px] font-mono text-zinc-500">SAFETY FIRST PROTOCOL</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-center">
        <div className="p-2.5 w-full rounded bg-[#0A0D15] border border-white/10 text-zinc-300">
          1. REGISTRAR PREVIO
        </div>
        <div className="text-zinc-600 font-bold hidden sm:block">→</div>
        <div className="p-2.5 w-full rounded bg-[#0A0D15] border border-amber-500/30 text-amber-300">
          2. CREAR BACKUP
        </div>
        <div className="text-zinc-600 font-bold hidden sm:block">→</div>
        <div className="p-2.5 w-full rounded bg-[#0A0D15] border border-white/10 text-zinc-300">
          3. MODIFICAR
        </div>
        <div className="text-zinc-600 font-bold hidden sm:block">→</div>
        <div className="p-2.5 w-full rounded bg-[#0A0D15] border border-emerald-500/30 text-[#16C784]">
          4. VALIDAR / REVERTIR
        </div>
      </div>
    </div>
  );
};
