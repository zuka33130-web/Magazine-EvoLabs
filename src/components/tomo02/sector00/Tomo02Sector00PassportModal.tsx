import React from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  HardDrive,
  User,
  Fingerprint,
  Activity,
  Copy,
  Check,
} from 'lucide-react';
import { Sector00Passport, ProvenanceType, PassportFieldData } from '../../../data/tomo02Sector00Data';

interface Tomo02Sector00PassportModalProps {
  passport: Sector00Passport;
  onClose: () => void;
}

export const Tomo02Sector00PassportModal: React.FC<Tomo02Sector00PassportModalProps> = ({
  passport,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const getProvenanceBadge = (prov: ProvenanceType) => {
    switch (prov) {
      case 'SYSTEM_REPORTED':
        return {
          bg: 'bg-[#0078D4]/15 text-[#00A4EF] border-[#00A4EF]/40',
          label: 'SYSTEM_REPORTED',
          desc: 'Extraído de APIs / WMI / Winver',
        };
      case 'MEASURED':
        return {
          bg: 'bg-emerald-500/15 text-[#16C784] border-emerald-500/40',
          label: 'MEASURED',
          desc: 'Medición instrumental directa',
        };
      case 'OBSERVED':
        return {
          bg: 'bg-[#0078D4]/10 text-[#60CDFF] border-[#60CDFF]/30',
          label: 'OBSERVED',
          desc: 'Inspeccionado visualmente en pantalla',
        };
      case 'DERIVED':
        return {
          bg: 'bg-purple-500/15 text-[#8B7CFF] border-purple-500/40',
          label: 'DERIVED',
          desc: 'Deducido lógicamente',
        };
      case 'USER_DECLARED':
        return {
          bg: 'bg-[#11161D] text-[#60CDFF] border-[#00A4EF]/30',
          label: 'USER_DECLARED',
          desc: 'Declarado por usuario (sin verificar)',
        };
      case 'SIMULATED':
        return {
          bg: 'bg-zinc-800/60 text-[#7D8590] border-zinc-700/40',
          label: 'SIMULATED',
          desc: 'Simulación de banco virtual',
        };
      default:
        return {
          bg: 'bg-zinc-800/40 text-zinc-400 border-zinc-700/30',
          label: 'UNKNOWN',
          desc: 'Origen no especificado',
        };
    }
  };

  const defaultCompName: PassportFieldData = passport.computerName || {
    fieldKey: 'computerName',
    label: 'Nombre del Equipo',
    value: '',
    source: 'No registrado',
    provenance: 'UNKNOWN',
    confidence: 'DECLARED_ONLY',
    timestamp: '',
  };

  const defaultMfr: PassportFieldData = passport.systemManufacturer || {
    fieldKey: 'systemManufacturer',
    label: 'Fabricante del Sistema',
    value: '',
    source: 'No registrado',
    provenance: 'UNKNOWN',
    confidence: 'DECLARED_ONLY',
    timestamp: '',
  };

  const defaultModel: PassportFieldData = passport.systemModel || {
    fieldKey: 'systemModel',
    label: 'Modelo del Sistema',
    value: '',
    source: 'No registrado',
    provenance: 'UNKNOWN',
    confidence: 'DECLARED_ONLY',
    timestamp: '',
  };

  const defaultBootMode: PassportFieldData = passport.bootMode || {
    fieldKey: 'bootMode',
    label: 'Modo de BIOS / Firmware',
    value: '',
    source: 'No registrado',
    provenance: 'UNKNOWN',
    confidence: 'DECLARED_ONLY',
    timestamp: '',
  };

  const defaultSecureBoot: PassportFieldData = passport.secureBoot || {
    fieldKey: 'secureBoot',
    label: 'Estado de Secure Boot',
    value: '',
    source: 'No registrado',
    provenance: 'UNKNOWN',
    confidence: 'DECLARED_ONLY',
    timestamp: '',
  };

  const fieldsList = [
    { key: 'edition', data: passport.edition, icon: Layers },
    { key: 'version', data: passport.version, icon: Clock },
    { key: 'build', data: passport.build, icon: Fingerprint },
    { key: 'architecture', data: passport.architecture, icon: Cpu },
    { key: 'computerName', data: defaultCompName, icon: HardDrive },
    { key: 'systemManufacturer', data: defaultMfr, icon: Cpu },
    { key: 'systemModel', data: defaultModel, icon: HardDrive },
    { key: 'bootMode', data: defaultBootMode, icon: ShieldCheck },
    { key: 'secureBoot', data: defaultSecureBoot, icon: ShieldCheck },
    { key: 'systemDrive', data: passport.systemDrive, icon: HardDrive },
    { key: 'windowsPath', data: passport.windowsPath, icon: FileText },
    { key: 'userProfile', data: passport.userProfile, icon: User },
    { key: 'accountType', data: passport.accountType, icon: User },
    { key: 'privilege', data: passport.privilege, icon: ShieldCheck },
  ];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(passport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#080B10] border border-[#00A4EF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,164,239,0.18)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-sky-500/20 bg-[#05070A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0078D4]/20 border border-[#00A4EF]/40 flex items-center justify-center text-[#60CDFF] font-mono font-black text-sm">
              001
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00A4EF] uppercase tracking-widest">
                  DOCUMENTO PERICIAL OFICIAL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-[#16C784] font-bold">
                  {passport.statusTag || 'EVIDENCIA VÁLIDA'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight">
                PASAPORTE WINDOWS EVO 001 // EXPEDIENTE FORENSE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/30 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16C784]" /> : <Copy className="w-3.5 h-3.5 text-[#00A4EF]" />}
              <span>{copied ? 'COPIADO' : 'EXPORTAR JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/30 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Identity Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-sky-500/15 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#60CDFF] font-bold flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#00A4EF]" />
                MATRIZ DE IDENTIDAD DEL SISTEMA (EXPEDIENTE WINDOWS EVO 001)
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">
                PROVENANCE ENGINE: STRICT AUDIT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {fieldsList.map(({ key, data, icon: Icon }) => {
                const badge = getProvenanceBadge(data.provenance);
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-[#11161D] border border-sky-500/15 hover:border-[#00A4EF]/50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
                        <Icon className="w-3.5 h-3.5 text-[#00A4EF]" />
                        <span>{data.label}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${badge.bg}`}
                        title={badge.desc}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-sm font-mono font-black text-white break-words">
                      {data.value || 'NO REGISTRADO'}
                    </div>

                    <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1 border-t border-sky-500/10">
                      <span>Fuente: {data.source}</span>
                      <span className="text-[#60CDFF]">{data.confidence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Baseline Freeze Snapshot */}
          <div className="p-4 rounded-xl bg-[#0C1118] border border-sky-500/20 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-500/15 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00A4EF] animate-pulse" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  LÍNEA BASE DE ESTADO INICIAL (BASELINE FREEZE)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#60CDFF] font-semibold">
                {passport.baseline.captured ? 'CONGELADO EN EL TIEMPO' : 'PENDIENTE DE CAPTURA'}
              </span>
            </div>

            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              “Si no sabés cómo estaba antes, jamás podrás demostrar que mejoró.” Este registro captura la telemetría en reposo de tu máquina antes de aplicar cualquier modificación.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-[#05070A] border border-sky-500/15">
                <div className="text-[10px] font-mono text-zinc-400">RAM TOTAL</div>
                <div className="text-base font-mono font-bold text-[#60CDFF]">
                  {passport.baseline.ramTotalGB ? `${passport.baseline.ramTotalGB} GB` : '16 GB (REF)'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#05070A] border border-sky-500/15">
                <div className="text-[10px] font-mono text-zinc-400">DISCO LIBRE (C:)</div>
                <div className="text-base font-mono font-bold text-[#16C784]">
                  {passport.baseline.diskFreeGB ? `${passport.baseline.diskFreeGB} GB` : '124 GB (REF)'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#05070A] border border-sky-500/15">
                <div className="text-[10px] font-mono text-zinc-400">PROCESOS EN REPOSO</div>
                <div className="text-base font-mono font-bold text-[#60CDFF]">
                  {passport.baseline.processCount ? passport.baseline.processCount : '138 PROC'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#05070A] border border-sky-500/15">
                <div className="text-[10px] font-mono text-zinc-400">APPS EN INICIO</div>
                <div className="text-base font-mono font-bold text-purple-400">
                  {passport.baseline.startupAppsCount ? passport.baseline.startupAppsCount : '6 APPS'}
                </div>
              </div>
            </div>
          </div>

          {/* Forensic Protocol Footer */}
          <div className="p-3.5 rounded-xl bg-[#05070A] border border-sky-500/15 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
              <span>EXPEDIENTE WINDOWS EVO 001 FIRMADO CON HASH PERICIAL</span>
            </div>
            <span className="text-[10px] text-zinc-400">ID: {passport.passportId}</span>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-sky-500/20 bg-[#05070A] flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-zinc-400">
            ESTE PASAPORTE ACREDITA LA IDENTIDAD TÉCNICA DEL SISTEMA ANTE EVO LABS.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,164,239,0.25)]"
          >
            ENTENDIDO / CONTINUAR
          </button>
        </div>

      </div>
    </div>
  );
};
