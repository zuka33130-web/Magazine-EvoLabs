import React from 'react';

/**
 * Tomo02CoverHeroVisual
 * 
 * Visual Hero Original para la portada A4 de Tomo 02: La Biblia Negra de Windows.
 * Representa de forma gráfica, técnica e integrada la pila arquitectónica de Windows:
 * USER MODE (Ring 3) → PROCESOS → SERVICIOS → REGISTRO → KERNEL NT (Ring 0) → DRIVERS / HARDWARE
 * 
 * Sin placeholders, sin sensación de tarjeta/dashboard: diagramación de revista técnica de élite.
 */
export const Tomo02CoverHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full my-auto py-2 font-mono-tech select-none">
      {/* Precision Corner Metric Ticks */}
      <div className="absolute top-0 left-0 text-[9px] text-cyan-500/60 tracking-wider">
        SYS.ARCH // MAPA ESTRUCTURAL DEL KERNEL NT 10.0
      </div>
      <div className="absolute top-0 right-0 text-[9px] text-cyan-500/60 tracking-wider hidden sm:block">
        CANONICAL 64-BIT VIRTUAL MEMORY SPLIT
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full relative mt-4">
        <svg
          viewBox="0 0 760 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="t02UserGrad" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="t02KernelGrad" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0369A1" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="t02SyscallGlow" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#00D2FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="75%" stopColor="#00D2FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="t02FlowLine" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.9" />
            </linearGradient>

            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* =========================================================================
              TIER 1: USER MODE [RING 3]
          ========================================================================= */}
          {/* Background Area */}
          <rect
            x="20"
            y="12"
            width="720"
            height="116"
            rx="8"
            fill="url(#t02UserGrad)"
            stroke="#00D2FF"
            strokeWidth="0.8"
            strokeOpacity="0.35"
            strokeDasharray="6 4"
          />

          {/* Left Vertical Category Tag */}
          <g>
            <rect x="20" y="12" width="28" height="116" rx="8" fill="#00D2FF" fillOpacity="0.15" />
            <text
              x="-70"
              y="38"
              transform="rotate(-90)"
              fill="#00D2FF"
              fontSize="8.5"
              fontWeight="bold"
              letterSpacing="2"
              textAnchor="middle"
            >
              RING 3 // USER MODE
            </text>
          </g>

          {/* Sub-tier 1A: PROCESOS & APLICACIONES */}
          <g transform="translate(60, 22)">
            <rect x="0" y="0" width="195" height="42" rx="5" fill="#080D1A" stroke="#00D2FF" strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="12" cy="14" r="3" fill="#00D2FF" />
            <text x="22" y="17" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="0.8">
              PROCESOS DE USUARIO
            </text>
            <text x="22" y="32" fill="#94A3B8" fontSize="8">
              explorer.exe · cmd · apps Win32 / x64
            </text>
            <text x="183" y="17" fill="#00D2FF" fontSize="7.5" textAnchor="end" opacity="0.8">
              PID_POOL
            </text>
          </g>

          {/* Sub-tier 1B: SUBSISTEMA & DLLs */}
          <g transform="translate(268, 22)">
            <rect x="0" y="0" width="224" height="42" rx="5" fill="#080D1A" stroke="#00D2FF" strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="12" cy="14" r="3" fill="#38BDF8" />
            <text x="22" y="17" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="0.8">
              SUBSISTEMAS & DLLs
            </text>
            <text x="22" y="32" fill="#94A3B8" fontSize="8">
              ntdll.dll · kernel32.dll · csrss.exe
            </text>
            <text x="212" y="17" fill="#38BDF8" fontSize="7.5" textAnchor="end" opacity="0.8">
              WOW64_LAYER
            </text>
          </g>

          {/* Sub-tier 1C: SERVICIOS */}
          <g transform="translate(504, 22)">
            <rect x="0" y="0" width="224" height="42" rx="5" fill="#080D1A" stroke="#00D2FF" strokeWidth="0.8" strokeOpacity="0.5" />
            <circle cx="12" cy="14" r="3" fill="#00D2FF" />
            <text x="22" y="17" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="0.8">
              SERVICIOS DEL SISTEMA
            </text>
            <text x="22" y="32" fill="#94A3B8" fontSize="8">
              services.exe · svchost.exe pools · RPC
            </text>
            <text x="212" y="17" fill="#00D2FF" fontSize="7.5" textAnchor="end" opacity="0.8">
              SCM_ENGINE
            </text>
          </g>

          {/* Connector Arrows: Procesos / Servicios → Registro */}
          <path d="M 157 64 L 157 76 L 380 76 L 380 80" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeDasharray="3 3" />
          <path d="M 380 64 L 380 80" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.7" fill="none" />
          <path d="M 616 64 L 616 76 L 380 76" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeDasharray="3 3" />

          {/* Sub-tier 2: REGISTRO DE WINDOWS (Intermedio User / Kernel) */}
          <g transform="translate(60, 80)">
            <rect x="0" y="0" width="668" height="38" rx="5" fill="#060A14" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.6" />
            <rect x="8" y="8" width="6" height="22" rx="1" fill="#00D2FF" />
            
            <text x="24" y="18" fill="#00D2FF" fontSize="9.5" fontWeight="bold" letterSpacing="1">
              REGISTRO DE WINDOWS // SUBSISTEMA DE CONFIGURACIÓN & HIVES
            </text>
            <text x="24" y="30" fill="#94A3B8" fontSize="8">
              HKEY_LOCAL_MACHINE · SYSTEM · SOFTWARE · SAM · Transacciones Atómicas .LOG · Celdas HBIN & Knodes
            </text>
            
            <g transform="translate(560, 11)">
              <rect x="0" y="0" width="98" height="16" rx="3" fill="#00D2FF" fillOpacity="0.12" stroke="#00D2FF" strokeWidth="0.6" />
              <text x="49" y="11" fill="#00D2FF" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                REGBACK / RESILIENCE
              </text>
            </g>
          </g>

          {/* =========================================================================
              THE SYSTEM CALL BOUNDARY [BARICENTRO Y FRONTERA DE PRIVILEGIO]
          ========================================================================= */}
          <g transform="translate(20, 142)">
            {/* Luminous Core Laser Beam */}
            <line x1="0" y1="0" x2="720" y2="0" stroke="url(#t02SyscallGlow)" strokeWidth="2.5" filter="url(#cyanGlow)" />
            <line x1="0" y1="0" x2="720" y2="0" stroke="#FFFFFF" strokeWidth="1" />

            {/* Central Dispatch Node */}
            <rect x="260" y="-10" width="200" height="20" rx="10" fill="#050811" stroke="#00D2FF" strokeWidth="1.2" />
            <circle cx="275" cy="0" r="4" fill="#00D2FF" className="animate-pulse" />
            <text x="365" y="3.5" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" letterSpacing="1.2" textAnchor="middle">
              SYSCALL / SYSENTER BOUNDARY
            </text>

            {/* Marginal Annotations */}
            <text x="8" y="-4" fill="#38BDF8" fontSize="7.5" fontWeight="bold" letterSpacing="1">
              RING 3 (CPL=3)
            </text>
            <text x="8" y="10" fill="#00D2FF" fontSize="7.5" fontWeight="bold" letterSpacing="1">
              RING 0 (CPL=0)
            </text>

            <text x="712" y="-4" fill="#94A3B8" fontSize="7" textAnchor="end">
              0x00007FFF'FFFFFFFF (128 TB)
            </text>
            <text x="712" y="10" fill="#00D2FF" fontSize="7" textAnchor="end" fontWeight="bold">
              0xFFFF8000'00000000 (128 TB)
            </text>

            {/* Syscall Vector Micro-ticks */}
            {[-120, -60, 60, 120].map((offset, i) => (
              <g key={i} transform={`translate(${360 + offset}, 0)`}>
                <circle cx="0" cy="0" r="2" fill="#00D2FF" />
                <path d="M 0 -8 L 0 8" stroke="#00D2FF" strokeWidth="0.6" strokeOpacity="0.6" />
              </g>
            ))}
          </g>

          {/* =========================================================================
              TIER 2: KERNEL NT [RING 0]
          ========================================================================= */}
          {/* Background Area */}
          <rect
            x="20"
            y="160"
            width="720"
            height="174"
            rx="8"
            fill="url(#t02KernelGrad)"
            stroke="#0284C7"
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />

          {/* Left Vertical Category Tag */}
          <g>
            <rect x="20" y="160" width="28" height="174" rx="8" fill="#0284C7" fillOpacity="0.2" />
            <text
              x="-247"
              y="38"
              transform="rotate(-90)"
              fill="#38BDF8"
              fontSize="8.5"
              fontWeight="bold"
              letterSpacing="2"
              textAnchor="middle"
            >
              RING 0 // KERNEL NT
            </text>
          </g>

          {/* Sub-tier 2A: EXECUTIVE & OBJECT MANAGER */}
          <g transform="translate(60, 172)">
            <rect x="0" y="0" width="215" height="46" rx="5" fill="#060B16" stroke="#0284C7" strokeWidth="0.8" />
            <circle cx="12" cy="14" r="3" fill="#38BDF8" />
            <text x="22" y="16" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="0.8">
              EXECUTIVE & OBJECT MGR
            </text>
            <text x="22" y="30" fill="#94A3B8" fontSize="7.5">
              ntoskrnl.exe · Handles · Ob / Ps / Se
            </text>
            <text x="22" y="40" fill="#38BDF8" fontSize="7">
              IRQL 0 (PASSIVE_LEVEL)
            </text>
            <text x="204" y="16" fill="#00D2FF" fontSize="7.5" textAnchor="end">
              CORE
            </text>
          </g>

          {/* Sub-tier 2B: MEMORY MANAGER (Mm) */}
          <g transform="translate(286, 172)">
            <rect x="0" y="0" width="220" height="46" rx="5" fill="#060B16" stroke="#00D2FF" strokeWidth="0.9" />
            <circle cx="12" cy="14" r="3" fill="#00D2FF" />
            <text x="22" y="16" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="0.8">
              GESTOR DE MEMORIA (Mm)
            </text>
            <text x="22" y="30" fill="#94A3B8" fontSize="7.5">
              VAD Trees · PFN Database · Commit Charge
            </text>
            <text x="22" y="40" fill="#00D2FF" fontSize="7">
              Non-Paged Pool · Paged Pool · Paging
            </text>
            <text x="208" y="16" fill="#00D2FF" fontSize="7.5" textAnchor="end">
              VIRTUAL_MEM
            </text>
          </g>

          {/* Sub-tier 2C: PLANIFICADOR (SCHEDULER / DISPATCHER) */}
          <g transform="translate(516, 172)">
            <rect x="0" y="0" width="212" height="46" rx="5" fill="#060B16" stroke="#0284C7" strokeWidth="0.8" />
            <circle cx="12" cy="14" r="3" fill="#38BDF8" />
            <text x="22" y="16" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="0.8">
              HILOS & SCHEDULER
            </text>
            <text x="22" y="30" fill="#94A3B8" fontSize="7.5">
              Quantum CPU · Prioridades 0-31 · DPC/ISR
            </text>
            <text x="22" y="40" fill="#38BDF8" fontSize="7">
              IRQL 2 (DISPATCH_LEVEL)
            </text>
            <text x="202" y="16" fill="#00D2FF" fontSize="7.5" textAnchor="end">
              SYNC
            </text>
          </g>

          {/* Bus Lines connecting to HAL & Drivers */}
          <path d="M 167 218 L 167 232 L 380 232 L 380 238" stroke="#00D2FF" strokeWidth="0.9" strokeOpacity="0.6" fill="none" />
          <path d="M 396 218 L 396 238" stroke="#00D2FF" strokeWidth="0.9" strokeOpacity="0.8" fill="none" />
          <path d="M 622 218 L 622 232 L 412 232 L 412 238" stroke="#00D2FF" strokeWidth="0.9" strokeOpacity="0.6" fill="none" />

          {/* Sub-tier 2D: HAL & DRIVERS STACK */}
          <g transform="translate(60, 238)">
            <rect x="0" y="0" width="668" height="42" rx="5" fill="#040812" stroke="#00D2FF" strokeWidth="0.9" strokeOpacity="0.7" />
            <rect x="8" y="9" width="6" height="24" rx="1" fill="#38BDF8" />
            
            <text x="24" y="18" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" letterSpacing="1">
              HAL (HARDWARE ABSTRACTION LAYER) & CONTROLADORES (KMDF / UMDF)
            </text>
            <text x="24" y="32" fill="#94A3B8" fontSize="8">
              hal.dll · Filter Drivers · I/O Request Packets (IRP) · Storport · PnP & Power Management (ACPI)
            </text>

            <g transform="translate(530, 11)">
              <rect x="0" y="0" width="128" height="18" rx="3" fill="#00D2FF" fillOpacity="0.1" stroke="#00D2FF" strokeWidth="0.7" />
              <text x="64" y="12" fill="#00D2FF" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                LATENCY &lt; 100 µs DPC
              </text>
            </g>
          </g>

          {/* Flow Indicator: HAL → HARDWARE SILICON */}
          <path d="M 380 280 L 380 292" stroke="#00D2FF" strokeWidth="1.2" strokeOpacity="0.8" fill="none" />
          <polygon points="380,296 376,289 384,289" fill="#00D2FF" />

          {/* Sub-tier 2E: HARDWARE SILICON & FIRMWARE INTERFACE */}
          <g transform="translate(60, 296)">
            <rect x="0" y="0" width="668" height="30" rx="4" fill="#02040A" stroke="#00D2FF" strokeWidth="0.7" strokeDasharray="4 2" />
            
            <div className="flex items-center">
              <text x="14" y="19" fill="#38BDF8" fontSize="8.5" fontWeight="bold" letterSpacing="0.8">
                DRIVERS / HARDWARE:
              </text>
              <text x="140" y="19" fill="#E2E8F0" fontSize="8">
                UEFI BIOS / GPT (ESP 100MB) · PCIe Gen4/Gen5 Lanes · Controladoras NVMe · Núcleos CPU x86-64 / APIC
              </text>
              <text x="654" y="19" fill="#00D2FF" fontSize="7.5" fontWeight="bold" textAnchor="end">
                SILICON_RING
              </text>
            </div>
          </g>
        </svg>
      </div>

      {/* Micro-annotations Bottom Strip */}
      <div className="flex flex-wrap items-center justify-between text-[8px] sm:text-[9px] text-zinc-500 pt-2 border-t border-cyan-950/60 mt-2">
        <span className="text-cyan-400/80">
          FLUJO PERICIAL: USER MODE → PROCESOS → SERVICIOS → REGISTRO → KERNEL NT → HARDWARE
        </span>
        <span className="font-mono-tech text-zinc-400">
          MICRO-ARQUITECTURA DETERMINÍSTICA // 64-BIT NTOSKRNL
        </span>
      </div>
    </div>
  );
};
