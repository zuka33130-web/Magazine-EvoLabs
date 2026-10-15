import React, { useState } from 'react';
import {
  Eye,
  Radio,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  HardDrive,
  FileCode,
  Search,
} from 'lucide-react';

export const Sector22VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'DIAGTRACK_TELEMETRY_PIPELINE' | 'CONSENT_STORE_PERMISSIONS' | 'GET_NET_TCP_CORRELATION' | 'SRUM_SRUDB_ARCHITECTURE'
  >('DIAGTRACK_TELEMETRY_PIPELINE');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Eye className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 22</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              PRIVACIDAD, TELEMETRÍA, CORRELACIÓN DE SOCKETS Y SRUM
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Tubería de Telemetría DiagTrack, Registro ConsentStore, Trazabilidad PID → Proceso → Destino y Análisis Forense ESE SRUDB.dat
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('DIAGTRACK_TELEMETRY_PIPELINE')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'DIAGTRACK_TELEMETRY_PIPELINE'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              DiagTrack Pipeline
            </button>
            <button
              onClick={() => setActiveDiagram('CONSENT_STORE_PERMISSIONS')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'CONSENT_STORE_PERMISSIONS'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              ConsentStore Registry
            </button>
            <button
              onClick={() => setActiveDiagram('GET_NET_TCP_CORRELATION')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'GET_NET_TCP_CORRELATION'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              PID Correlation Chain
            </button>
            <button
              onClick={() => setActiveDiagram('SRUM_SRUDB_ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeDiagram === 'SRUM_SRUDB_ARCHITECTURE'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              SRUDB.dat Forensics
            </button>
          </div>
        </div>

        {/* DIAGRAM 1: DIAGTRACK PIPELINE */}
        {activeDiagram === 'DIAGTRACK_TELEMETRY_PIPELINE' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                <Radio className="w-4 h-4" />
                <span>FLUJO DE EVENTOS ETW HACIA EL SERVICIO DIAGTRACK Y LA NUBE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-[10px] text-slate-400">1. Generación de Eventos</div>
                  <div className="text-cyan-400 font-bold mt-1 text-xs">ETW Providers</div>
                  <div className="text-slate-500 mt-1 text-[10px]">Kernel & Application Crash Logs</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-[10px] text-slate-400">2. Filtrado Local</div>
                  <div className="text-amber-400 font-bold mt-1 text-xs">AllowTelemetry Policy</div>
                  <div className="text-slate-500 mt-1 text-[10px]">Required (1) vs Optional (3)</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-[10px] text-slate-400">3. Buffer Local</div>
                  <div className="text-emerald-400 font-bold mt-1 text-xs">DiagTrack UTC Engine</div>
                  <div className="text-slate-500 mt-1 text-[10px]">Compresión y Cifrado JSON</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <div className="text-[10px] text-slate-400">4. Transmisión HTTPS</div>
                  <div className="text-purple-400 font-bold mt-1 text-xs">v10.events.data.microsoft.com</div>
                  <div className="text-slate-500 mt-1 text-[10px]">Envío en paquetes semanales</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 2: CONSENTSTORE */}
        {activeDiagram === 'CONSENT_STORE_PERMISSIONS' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>REGISTRO DE AUDITORÍA Y PERMISOS DE HARDWARE (CapabilityAccessManager)</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
                  <span>HKCU:\...\CapabilityAccessManager\ConsentStore\webcam</span>
                  <span className="text-emerald-400 font-bold">Webcam LastUsedTime & Consent</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex justify-between items-center">
                  <span>HKCU:\...\CapabilityAccessManager\ConsentStore\microphone</span>
                  <span className="text-cyan-400 font-bold">Microphone LastUsedTime & Consent</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 3: PID CORRELATION */}
        {activeDiagram === 'GET_NET_TCP_CORRELATION' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>TRAZABILIDAD FORENSE: SOCKET → PROCESS → SIGNATURE</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex-1">
                  <div className="text-amber-400 font-bold">Remote IP:Port</div>
                  <div className="text-[10px] text-slate-500 mt-1">Remote Socket Address</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex-1">
                  <div className="text-cyan-400 font-bold">OwningProcess (PID)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Get-NetTCPConnection</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded flex-1">
                  <div className="text-emerald-300 font-bold">Get-AuthenticodeSignature</div>
                  <div className="text-[10px] text-slate-400 mt-1">Firma Criptográfica Validada</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 4: SRUM FORENSICS */}
        {activeDiagram === 'SRUM_SRUDB_ARCHITECTURE' && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 font-mono text-xs">
              <div className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>ARQUITECTURA DE LA BASE DE DATOS ESE SRUDB.dat (SRUM)</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded space-y-2">
                <div className="text-amber-300 font-bold">Ubicación: C:\Windows\System32\SRU\SRUDB.dat</div>
                <p className="text-[11px] text-slate-400">
                  Registra tablas ESE de consumo contable por aplicación: {`{97332306-1D77-4981...}`} para bytes transmitidos de red por AppId y UserSID durante 30 días.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
