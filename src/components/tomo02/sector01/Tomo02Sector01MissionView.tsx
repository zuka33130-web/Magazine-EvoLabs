import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Cpu,
  Layers,
  HardDrive,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  FileText,
  Key,
  Shield,
  Activity,
} from 'lucide-react';
import { Sector01BootDossier } from './Tomo02Sector01ExpedienteModal';
import { CANONICAL_BOOT_STAGES } from '../../../data/tomo02Sector01CasesAndTests';

interface Tomo02Sector01MissionViewProps {
  onBackToReader: () => void;
  onOpenExpediente: () => void;
  onSaveDossier: (dossier: Sector01BootDossier) => void;
}

export const Tomo02Sector01MissionView: React.FC<Tomo02Sector01MissionViewProps> = ({
  onBackToReader,
  onOpenExpediente,
  onSaveDossier,
}) => {
  // Form fields for the 9 boot inspection parameters
  // No default can be mistaken for a reading taken from the user's PC.
  const [formData, setFormData] = useState({
    biosMode: '', partitionScheme: '', secureBoot: '', tpmVersion: '',
    espPartition: '', bcdStatus: '', winloadState: '', postTime: '', fastStartup: '',
  });

  const [orderSequence, setOrderSequence] = useState([
    { id: 'esp', text: '5. Lectura de Partición EFI (ESP)' },
    { id: 'power', text: '1. Señal eléctrica PWR_OK y reset CPU' },
    { id: 'winload', text: '8. winload.efi e inicialización de kernel' },
    { id: 'post', text: '2. Power-On Self-Test (POST)' },
    { id: 'uefi', text: '3. Inicialización de Firmware UEFI' },
    { id: 'bootmgr', text: '6. Ejecución de Windows Boot Manager' },
    { id: 'bootorder', text: '4. Selección de Entrada NVRAM (BootOrder)' },
    { id: 'bcd', text: '7. Consulta de Almacén BCD' },
  ]);

  const [missionComplete, setMissionComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleValidateAndGenerate = () => {
    const errors: string[] = [];
    const missing = Object.entries(formData).filter(([, value]) => typeof value !== 'string' || !value.trim()).map(([field]) => field);
    if (missing.length) errors.push('Completá todos los campos observados o indicá explícitamente "No verificado": ' + missing.join(', '));

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const declared = (value: string, tool: string) => ({
      value, provenance: 'USER_DECLARED (consulta manual sugerida: ' + tool + ')',
      status: 'WARNING' as const,
    });
    const newDossier: Sector01BootDossier = {
      dossierId: 'EVO-BOOT-EXPEDIENTE-002-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      biosMode: declared(formData.biosMode, 'msinfo32'),
      partitionScheme: declared(formData.partitionScheme, 'diskpart'),
      secureBootStatus: declared(formData.secureBoot, 'Confirm-SecureBootUEFI'),
      tpmVersion: declared(formData.tpmVersion, 'tpm.msc'),
      espPartitionState: declared(formData.espPartition, 'diskmgmt.msc'),
      bcdStatus: declared(formData.bcdStatus, 'bcdedit'),
      winloadState: declared(formData.winloadState, 'sigcheck'),
      lastPostTime: declared(formData.postTime, 'Administrador de tareas'),
      fastStartupMode: declared(formData.fastStartup, 'Opciones de energía'),
      evaluatedStages: 0, // Sequence not autonomously verified.
    };

    onSaveDossier(newDossier);
    setMissionComplete(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-6 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-zinc-900/90 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToReader}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Investigaciones
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                MISIÓN DE CAMPO 002
              </span>
              <span className="text-xs font-mono text-zinc-400">SECTOR 01: ANTES DEL LOGO</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Reconstrucción Pericial del Vector de Arranque
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {missionComplete && (
            <button
              onClick={onOpenExpediente}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Ver Expediente 002
            </button>
          )}
        </div>
      </div>

      {/* Mission Description Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          OBJETIVO FORENSE DE LA MISIÓN
        </div>
        <h3 className="text-base md:text-lg font-bold text-white">
          Documentar los 9 vectores Pre-Boot con procedencia declarada
        </h3>
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
          Abrí las herramientas de diagnóstico en tu máquina física (<code>msinfo32</code>, <code>diskmgmt.msc</code>,{' '}
          <code>tpm.msc</code>, Administrador de Tareas) y consolidá la información del arranque para emitir tu{' '}
          <strong>EXPEDIENTE FORENSE DE ARRANQUE EVO 002</strong>.
        </p>
      </div>

      {/* Form Fields */}
      <div className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-amber-400" />
          Parámetros Críticos Pre-Boot
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* BIOS Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Modo de Firmware</label>
            <select
              value={formData.biosMode}
              onChange={(e) => setFormData({ ...formData, biosMode: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none"
            >
              <option value="">Elegí según la inspección</option>
              <option value="UEFI Nativo">UEFI Nativo (Recomendado)</option>
              <option value="Heredado / CSM BIOS">Heredado / BIOS Clásica (Legacy)</option>
            </select>
            <span className="text-[10px] font-mono text-zinc-500 block">Comando: msinfo32</span>
          </div>

          {/* Partition Scheme */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Esquema de Particionado</label>
            <select
              value={formData.partitionScheme}
              onChange={(e) => setFormData({ ...formData, partitionScheme: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none"
            >
              <option value="">Elegí según la inspección</option>
              <option value="GPT (GUID Partition Table)">GPT (Requerido para UEFI/Win11)</option>
              <option value="MBR (Master Boot Record)">MBR (Antiguo / Legacy)</option>
            </select>
            <span className="text-[10px] font-mono text-zinc-500 block">Comando: diskpart &gt; list disk</span>
          </div>

          {/* Secure Boot */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Secure Boot</label>
            <select
              value={formData.secureBoot}
              onChange={(e) => setFormData({ ...formData, secureBoot: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none"
            >
              <option value="">Elegí según la inspección</option>
              <option value="Habilitado / Activo">Habilitado (Secure Boot ON)</option>
              <option value="Deshabilitado">Deshabilitado (Secure Boot OFF)</option>
              <option value="No Soportado">No soportado por hardware</option>
            </select>
            <span className="text-[10px] font-mono text-zinc-500 block">PowerShell: Confirm-SecureBootUEFI</span>
          </div>

          {/* TPM */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Cripto-Chip TPM</label>
            <select
              value={formData.tpmVersion}
              onChange={(e) => setFormData({ ...formData, tpmVersion: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none"
            >
              <option value="">Elegí según la inspección</option>
              <option value="2.0">TPM 2.0 (Listo para usar)</option>
              <option value="1.2">TPM 1.2 (Generación anterior)</option>
              <option value="Ausente">Sin módulo TPM detectado</option>
            </select>
            <span className="text-[10px] font-mono text-zinc-500 block">Comando: tpm.msc</span>
          </div>

          {/* ESP Partition */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Partición EFI (ESP)</label>
            <input
              type="text"
              value={formData.espPartition}
              onChange={(e) => setFormData({ ...formData, espPartition: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none"
              placeholder="100 MB FAT32"
            />
            <span className="text-[10px] font-mono text-zinc-500 block">Comando: diskmgmt.msc</span>
          </div>

          {/* Post Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Última Hora de BIOS (POST)</label>
            <input
              type="text"
              value={formData.postTime}
              onChange={(e) => setFormData({ ...formData, postTime: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none"
              placeholder="ej. 3.5 segundos"
            />
            <span className="text-[10px] font-mono text-zinc-500 block">Taskmgr &gt; Inicio</span>
          </div>
          {([
            ['bcdStatus', 'Estado del almacén BCD', 'bcdedit /enum'],
            ['winloadState', 'Estado de winload.efi', 'Consulta de firma o ruta de arranque'],
            ['fastStartup', 'Inicio rápido', 'Opciones de energía'],
          ] as const).map(([field, label, tool]) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">{label}</label>
              <input type="text" value={formData[field]}
                onChange={event => setFormData(prev => ({ ...prev, [field]: event.target.value }))}
                placeholder='Dato observado o "No verificado"'
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white" />
              <span className="text-[10px] font-mono text-zinc-500 block">{tool}</span>
            </div>
          ))}
        </div>

        {/* Validation error message */}
        {validationErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-red-400">
              <AlertTriangle className="w-4 h-4" /> Errores en la Validación:
            </div>
            {validationErrors.map((err, i) => (
              <div key={i}>• {err}</div>
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            {missionComplete ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Registro didáctico emitido: valores declarados, sin validación automática
              </span>
            ) : (
              'Completá los campos según tus observaciones o indicá No verificado.'
            )}
          </div>

          <button
            onClick={handleValidateAndGenerate}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {missionComplete ? 'Actualizar Expediente' : 'Generar Expediente de Arranque 002'}
          </button>
        </div>
      </div>
    </div>
  );
};
