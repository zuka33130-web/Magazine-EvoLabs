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
    edition: initialPassport.edition.value,
    version: initialPassport.version.value,
    build: initialPassport.build.value,
    architecture: initialPassport.architecture.value,
    accountType: initialPassport.accountType.value,
    privilege: initialPassport.privilege.value,
    systemDrive: initialPassport.systemDrive.value,
    windowsPath: initialPassport.windowsPath.value,
    userProfile: initialPassport.userProfile.value,
  });
  const [provenanceMap, setProvenanceMap] = useState<Record<string, ProvenanceType>>(
    Object.fromEntries(Object.keys(formData).map(field => [field, 'USER_DECLARED']))
  );
  const [showCaptureGuide, setShowCaptureGuide] = useState(false);
  const [formError, setFormError] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // A browser cannot inspect Winver, WMI or the local registry without a trusted agent.
  const handleRunAutodetect = () => setShowCaptureGuide(true);

  const handleSave = () => {
    if (Object.values(formData).some(value => !value.trim())) {
      setFormError('Completá los nueve datos de forma manual; no se generará información ficticia.');
      return;
    }
    setFormError('');
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
        captured: false, timestamp: '', ramTotalGB: null, diskFreeGB: null,
        processCount: null, startupAppsCount: null, bootTimeSec: null,
      },
    };

    // Handwritten values remain user-declared; this React view did not verify Windows.
    for (const field of ['edition','version','build','architecture','accountType','privilege','systemDrive','windowsPath','userProfile'] as const) {
      updated[field] = { ...updated[field],
        provenance: provenanceMap[field] === 'SIMULATED' ? 'SIMULATED' : 'USER_DECLARED',
        source: 'Entrada manual · sin lectura WMI/CIM',
        confidence: 'DECLARED_ONLY',
      };
    }
    updated.statusTag = 'NO DISPONIBLE';
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
            
            className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-xs font-mono-tech text-cyan-300 font-bold flex items-center gap-2 transition-colors"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>GUÍA PARA OBTENER DATOS REALES</span>
          </button>
          {showCaptureGuide && <p className="text-xs text-amber-300">
            El navegador no puede consultar WMI ni Winver. Abrí winver, msinfo32 y whoami /priv en tu Windows
            y transcribí los resultados. Se conservarán como declaración manual, no como telemetría verificada.
          </p>}
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
                  <option value="USER_DECLARED">USER_DECLARED</option>
                  <option value="SIMULATED">SIMULATED (práctica)</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {formError && <p role="alert" className="text-xs text-red-400">{formError}</p>}

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
