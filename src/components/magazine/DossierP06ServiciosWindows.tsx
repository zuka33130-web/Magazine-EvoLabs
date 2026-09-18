import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { SemaforoEvo } from './SemaforoEvo';
import { Cpu, ShieldAlert, CheckCircle, XCircle, AlertTriangle, Filter, Info } from 'lucide-react';

export const DossierP06ServiciosWindows: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-28"
      pageNumber={28}
      totalPages={41}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 06 // SERVICIOS DE WINDOWS"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // AUDITORÍA DE SERVICIOS // PÁGINA 06 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Servicios: Criterio Real, Cero Magia
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          DESMINTIENDO LAS LISTAS CIEGAS DE INTERNET
        </span>
      </div>

      {/* Narrative Lead & Reality Check */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 text-xs text-zinc-300 font-sans-editorial leading-relaxed mb-2">
        <div className="md:col-span-8 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            Internet abunda en guías que prometen "50 servicios de Windows que debés apagar para ganar 40 FPS". En una PC moderna (con procesadores de 6 u 8+ núcleos y 16+ GB de RAM), el impacto en juegos de apagar servicios en reposo es <strong className="text-white">marginal o prácticamente nulo</strong> (fluctuaciones dentro del margen de error de ±0 a 1%). El beneficio real es orden del sistema y menor actividad en segundo plano, no un milagro de cuadros por segundo.
          </p>
          <p className="text-zinc-400 text-[10px]">
            La regla de oro de la revista: <strong>preferí el modo MANUAL</strong> antes que Deshabilitado. En Manual, el servicio permanece apagado y Windows solo lo convoca si abrís la función específica.
          </p>
        </div>

        <div className="md:col-span-4 bg-[#11141c] border border-yellow-500/30 rounded-lg p-2 font-mono-tech flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold uppercase mb-1">
              <Filter className="w-3.5 h-3.5" />
              <span>FILTRO RÁPIDO DE SEGURIDAD</span>
            </div>
            <p className="text-[9px] text-zinc-300 font-sans-editorial leading-snug">
              Presioná <code className="text-yellow-400 bg-black/40 px-1 py-0.5 rounded font-bold">Win + R</code>, escribí <code className="text-yellow-400 bg-black/40 px-1 py-0.5 rounded font-bold">msconfig</code>, andá a <em>Servicios</em> y marcá la casilla:
            </p>
            <div className="p-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded text-[9px] text-yellow-300 font-bold mt-1 text-center">
              ✓ OCULTAR TODOS LOS SERVICIOS DE MICROSOFT
            </div>
          </div>
          <span className="text-[8px] text-zinc-500 pt-1 border-t border-zinc-800 block">
            Aísla solo los programas de terceros que instalaste vos.
          </span>
        </div>
      </div>

      {/* Comparative Section: What to adjust vs What to NEVER touch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 mb-2 font-mono-tech text-xs">
        
        {/* Safe to adjust: Third party / Helpers */}
        <div className="bg-[#08130e] border border-emerald-500/40 rounded-lg p-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>SERVICIOS DE TERCEROS AUDITABLES (BAJO RIESGO)</span>
              </div>
              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">MANUAL</span>
            </div>

            <div className="space-y-1.5 text-[9px]">
              <div className="p-1.5 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>Google Update / Edge Update:</span>
                  <span className="text-emerald-400">Poner en Manual</span>
                </div>
                <p className="text-zinc-400 font-sans-editorial mt-0.5 leading-snug">
                  Los navegadores seguirán actualizándose cuando los uses o desde su menú 'Ayuda → Acerca de', sin consultas persistentes.
                </p>
              </div>

              <div className="p-1.5 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>Servicios Huérfanos de Software Viejo:</span>
                  <span className="text-emerald-400">Deshabilitar</span>
                </div>
                <p className="text-zinc-400 font-sans-editorial mt-0.5 leading-snug">
                  Restos de aplicaciones ya desinstaladas o impresoras que ya no tenés. Si el ejecutable no existe, deshabilitá la entrada.
                </p>
              </div>

              <div className="p-1.5 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>Telemetría de Fabricante OEM (SupportAssist):</span>
                  <span className="text-emerald-400">Poner en Manual</span>
                </div>
                <p className="text-zinc-400 font-sans-editorial mt-0.5 leading-snug">
                  Herramientas accesorias de marca que consumen ciclos para encuestas o promociones. Conservá solo si usás updates de BIOS oficiales.
                </p>
              </div>
            </div>
          </div>
          <span className="text-[8px] text-emerald-400 pt-1 border-t border-emerald-500/30 mt-1 block">
            Criterio EVO: Poner en Manual preserva la funcionalidad sin sobrecargar el arranque.
          </span>
        </div>

        {/* Never Touch Under Any Circumstance (CRITICAL) */}
        <div className="bg-[#160a0c] border border-rose-500/50 rounded-lg p-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-rose-500/30">
              <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                <XCircle className="w-3.5 h-3.5" />
                <span>SERVICIOS NATIVOS CRÍTICOS (NO TOCAR POR RUTINA)</span>
              </div>
              <span className="text-[8px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-bold">ROJO</span>
            </div>

            <div className="space-y-1 text-[8.5px]">
              <div className="p-1 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>Windows Audio / AudioEndpointBuilder:</span>
                  <span className="text-rose-400 font-mono-tech">Sin sonido</span>
                </div>
                <span className="text-zinc-400 block font-sans-editorial">Apagarlo anula todo el subsistema de audio y congela reproductores.</span>
              </div>

              <div className="p-1 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>DHCP Client / DNS Client:</span>
                  <span className="text-rose-400 font-mono-tech">Sin internet</span>
                </div>
                <span className="text-zinc-400 block font-sans-editorial">Imprescindibles para resolución de dominios web y asignación de IP de red.</span>
              </div>

              <div className="p-1 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>CryptSvc (Servicios Criptográficos):</span>
                  <span className="text-rose-400 font-mono-tech">Falla drivers</span>
                </div>
                <span className="text-zinc-400 block font-sans-editorial">Valida firmas digitales de drivers GPU y certificados de instaladores seguros.</span>
              </div>

              <div className="p-1 bg-black/40 rounded border border-zinc-800">
                <div className="flex justify-between text-white font-bold">
                  <span>Windows Update / DWM:</span>
                  <span className="text-rose-400 font-mono-tech">Inseguridad / Cuelgues</span>
                </div>
                <span className="text-zinc-400 block font-sans-editorial">DWM maneja la aceleración de ventanas; Update provee parches de seguridad vitales.</span>
              </div>
            </div>
          </div>
          <span className="text-[8px] text-rose-400 pt-1 border-t border-rose-500/30 mt-1 block font-bold">
            NO REALIZAR COMO OPTIMIZACIÓN RUTINARIA: Deshabilitar estos servicios provoca fallas graves.
          </span>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-2 bg-[#12151e] border border-zinc-800 rounded flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
        <span>CONSEJO TÉCNICO: Cambiá el tipo de inicio a 'Manual' en services.msc. Deshabilitá solo si entendés qué función se apaga por completo.</span>
        <span className="text-yellow-400 font-bold">CRITERIO & SEGURIDAD →</span>
      </div>
    </MagazineMasterPage>
  );
};
