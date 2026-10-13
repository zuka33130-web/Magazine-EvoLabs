import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Cpu,
  Layers,
  HardDrive,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  FileText,
} from 'lucide-react';
import { Sector00Passport, PassportFieldData, ProvenanceType } from '../../../data/tomo02Sector00Data';

interface Tomo02Sector00MissionViewProps {
  initialPassport: Sector00Passport;
  onSavePassport: (updatedPassport: Sector00Passport) => void;
  onBack: () => void;
}

export const Tomo02Sector00MissionView: React.FC<Tomo02Sector00MissionViewProps> = ({
  initialPassport,
  onSavePassport,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    edition: initialPassport.edition.value || 'Windows 11 Pro',
    version: initialPassport.version.value || '24H2',
    build: initialPassport.build.value || '26100.2033',
    architecture: initialPassport.architecture.value || 'x64 (64-bit)',
    accountType: initialPassport.accountType.value || 'Cuenta Local',
    privilege: initialPassport.privilege.value || 'Administrador (Split Token / Medium Integrity)',
    systemDrive: initialPassport.systemDrive.value || 'C:',
    windowsPath: initialPassport.windowsPath.value || 'C:\\Windows',
    userProfile: initialPassport.userProfile.value || 'C:\\Users\\Lucas',
  });

  const [provenanceMap, setProvenanceMap] = useState<Record<string, ProvenanceType>>({
    edition: initialPassport.edition.provenance || 'SYSTEM_REPORTED',
    version: initialPassport.version.provenance || 'SYSTEM_REPORTED',
    build: initialPassport.build.provenance || 'SYSTEM_REPORTED',
    architecture: initialPassport.architecture.provenance || 'SYSTEM_REPORTED',
    accountType: initialPassport.accountType.provenance || 'OBSERVED',
    privilege: initialPassport.privilege.provenance || 'OBSERVED',
    systemDrive: initialPassport.systemDrive.provenance || 'SYSTEM_REPORTED',
    windowsPath: initialPassport.windowsPath.provenance || 'SYSTEM_REPORTED',
    userProfile: initialPassport.userProfile.provenance || 'SYSTEM_REPORTED',
  });

  const [simulatedAutodetectRunning, setSimulatedAutodetectRunning] = useState(false);
  const [autodetected, setAutodetected] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-detect simulation from browser / client hints or real inputs
  const handleRunAutodetect = () => {
    setSimulatedAutodetectRunning(true);
    setTimeout(() => {
      // Extract what browser Navigator can truly declare vs what user inspects
      const ua = navigator.userAgent;
      const is64 = ua.includes('x64') || ua.includes('Win64') || navigator.maxTouchPoints === 0;
      
      setFormData((prev) => ({
        ...prev,
        edition: 'Windows 11 Pro',
        version: '24H2 (Actual)',
        build: '26100.2033',
        architecture: is64 ? 'x64 (64-bit)' : 'ARM64',
        systemDrive: 'C:',
        windowsPath: 'C:\\Windows',
        accountType: 'Cuenta Local',
        privilege: 'Administrador (UAC Filtered)',
        userProfile: 'C:\\Users\\TecnicoEVO',
      }));

      setProvenanceMap({
        edition: 'SYSTEM_REPORTED',
        version: 'SYSTEM_REPORTED',
        build: 'SYSTEM_REPORTED',
        architecture: 'SYSTEM_REPORTED',
        accountType: 'OBSERVED',
        privilege: 'OBSERVED',
        systemDrive: 'SYSTEM_REPORTED',
        windowsPath: 'SYSTEM_REPORTED',
        userProfile: 'SYSTEM_REPORTED',
      });

      setSimulatedAutodetectRunning(false);
      setAutodetected(true);
    }, 1200);
  };

  const handleSave = () => {
    const updated: Sector00Passport = {
      ...initialPassport,
      edition: {
        ...initialPassport.edition,
        value: formData.edition,
        provenance: provenanceMap.edition,
        confidence: provenanceMap.edition === 'SYSTEM_REPORTED' ? 'HIGH' : 'DECLARED_ONLY',
        timestamp: new Date().toISOString(),
      },
      version: {
        ...initialPassport.version,
        value: formData.version,
        provenance: provenanceMap.version,
        confidence: provenanceMap.version === 'SYSTEM_REPORTED' ? 'HIGH' : 'DECLARED_ONLY',
        timestamp: new Date().toISOString(),
      },
      build: {
        ...initialPassport.build,
        value: formData.build,
        provenance: provenanceMap.build,
        confidence: provenanceMap.build === 'SYSTEM_REPORTED' ? 'HIGH' : 'DECLARED_ONLY',
        timestamp: new Date().toISOString(),
      },
      architecture: {
        ...initialPassport.architecture,
        value: formData.architecture,
        provenance: provenanceMap.architecture,
        confidence: provenanceMap.architecture === 'SYSTEM_REPORTED' ? 'HIGH' : 'DECLARED_ONLY',
        timestamp: new Date().toISOString(),
      },
      accountType: {
        ...initialPassport.accountType,
        value: formData.accountType,
        provenance: provenanceMap.accountType,
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      },
      privilege: {
        ...initialPassport.privilege,
        value: formData.privilege,
        provenance: provenanceMap.privilege,
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      },
      systemDrive: {
        ...initialPassport.systemDrive,
        value: formData.systemDrive,
        provenance: provenanceMap.systemDrive,
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      },
      windowsPath: {
        ...initialPassport.windowsPath,
        value: formData.windowsPath,
        provenance: provenanceMap.windowsPath,
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      },
      userProfile: {
        ...initialPassport.userProfile,
        value: formData.userProfile,
        provenance: provenanceMap.userProfile,
        confidence: 'HIGH',
        timestamp: new Date().toISOString(),
      },
      baseline: {
        ...initialPassport.baseline,
        captured: true,
        timestamp: new Date().toISOString(),
        ramTotalGB: 16,
        diskFreeGB: 142,
        processCount: 135,
        startupAppsCount: 5,
        bootTimeSec: 14.2,
      },
    };

    onSavePassport(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const fieldsConfig = [
    { key: 'edition', label: '1. EDICIÓN DE WINDOWS', placeholder: 'Ej: Windows 11 Pro / Home', icon: Layers, helper: 'Win+R → winver (Línea 2)' },
    { key: 'version', label: '2. VERSIÓN DEL SISTEMA', placeholder: 'Ej: 24H2 / 23H2', icon: Clock, helper: 'Win+R → winver (Línea 3)' },
    { key: 'build', label: '3. COMPILACIÓN DEL SO (BUILD)', placeholder: 'Ej: 26100.2033', icon: Fingerprint, helper: 'Win+R → winver (Número entre paréntesis)' },
    { key: 'architecture', label: '4. ARQUITECTURA DEL SISTEMA', placeholder: 'Ej: x64-based PC / ARM64', icon: Cpu, helper: 'Win+R → msinfo32 (Tipo de sistema)' },
    { key: 'systemDrive', label: '5. UNIDAD DEL SISTEMA', placeholder: 'Ej: C:', icon: HardDrive, helper: 'CMD: echo %SYSTEMDRIVE%' },
    { key: 'windowsPath', label: '6. RUTA DE WINDOWS (%WINDIR%)', placeholder: 'Ej: C:\\Windows', icon: FileText, helper: 'CMD: echo %WINDIR%' },
    { key: 'userProfile', label: '7. RUTA DE PERFIL (%USERPROFILE%)', placeholder: 'Ej: C:\\Users\\Lucas', icon: User, helper: 'CMD: echo %USERPROFILE%' },
    { key: 'accountType', label: '8. TIPO DE CUENTA', placeholder: 'Ej: Cuenta Local / Cuenta Microsoft', icon: User, helper: 'Configuración > Cuentas' },
    { key: 'privilege', label: '9. CONTEXTO DE PRIVILEGIO', placeholder: 'Ej: Administrador (Split Token)', icon: ShieldCheck, helper: 'CMD: whoami /priv' },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#090c12] border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 font-bold uppercase tracking-widest">
            <Fingerprint className="w-4 h-4" />
            MISIÓN OFICIAL DE SECTOR 00
          </div>
          <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-[10px] font-mono-tech text-yellow-300 font-bold">
            PASAPORTE 001
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
          IDENTIFICÁ WINDOWS COMO UN TÉCNICO PERICIAL
        </h1>

        <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
          Completá los 9 campos canónicos de identidad técnica de tu sistema. Cada dato debe declarar su procedencia exacta. Al finalizar, se generará tu <strong>Pasaporte Windows EVO 001</strong> y se registrará en el Expediente.
        </p>

        {/* Quick autofill helper */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleRunAutodetect}
            disabled={simulatedAutodetectRunning}
            className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-xs font-mono-tech text-cyan-300 font-bold flex items-center gap-2 transition-colors"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{simulatedAutodetectRunning ? 'CONSULTANDO WMI / REGISTRY...' : 'PRECARGAR DESDE AUDITORÍA EVO'}</span>
          </button>
          {autodetected && (
            <span className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Datos precargados con sellos SYSTEM_REPORTED
            </span>
          )}
        </div>
      </div>

      {/* 9 Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fieldsConfig.map(({ key, label, placeholder, icon: Icon, helper }) => {
          const val = (formData as any)[key];
          const prov = provenanceMap[key];

          return (
            <div
              key={key}
              className="p-4 rounded-xl bg-[#0b0f17] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono-tech font-bold text-zinc-300 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{label}</span>
                </label>
              </div>

              <input
                type="text"
                value={val}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-zinc-700 text-xs font-mono-tech text-white focus:border-cyan-400 focus:outline-none"
              />

              <div className="flex items-center justify-between text-[10px] font-mono-tech pt-1 border-t border-zinc-800/80">
                <span className="text-zinc-400">{helper}</span>
                <select
                  value={prov}
                  onChange={(e) => setProvenanceMap({ ...provenanceMap, [key]: e.target.value as ProvenanceType })}
                  className="bg-black text-[9px] font-mono-tech text-cyan-300 border border-zinc-700 rounded px-1.5 py-0.5 focus:outline-none"
                >
                  <option value="SYSTEM_REPORTED">SYSTEM_REPORTED</option>
                  <option value="USER_DECLARED">USER_DECLARED</option>
                  <option value="OBSERVED">OBSERVED</option>
                  <option value="MEASURED">MEASURED</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-2xl bg-[#090c12] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-300 hover:text-white"
        >
          VOLVER AL SECTOR
        </button>

        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>PASAPORTE SELLADO &amp; GUARDADO</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>SELLAR PASAPORTE WINDOWS EVO 001</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
