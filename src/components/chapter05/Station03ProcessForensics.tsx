import React, { useState } from 'react';
import {
  Search,
  Terminal,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  FolderOpen,
} from 'lucide-react';
import { ProcessIdentityCard } from '../../types';

const DEFAULT_PROCESS: ProcessIdentityCard = {
  name: 'EpicGamesLauncher.exe',
  pid: '6420',
  path: 'C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe',
  publisher: 'Epic Games Inc.',
  signature: 'VALID',
  observedConsumption: '0.8% CPU, 452 MB RAM, 0 MB/s Disco',
  identificationResult: 'IDENTIFICADO',
  observation:
    'Launcher de tienda secundario ejecutándose en segundo plano con interfaz oculta.',
};

interface Station03ProcessForensicsProps {
  initialProcess?: ProcessIdentityCard;
  initialCard?: ProcessIdentityCard;
  onSaveProcess?: (data: ProcessIdentityCard) => void;
  onSaveCard?: (data: ProcessIdentityCard) => void;
  onNextStation: () => void;
}

export const Station03ProcessForensics: React.FC<Station03ProcessForensicsProps> = ({
  initialProcess,
  initialCard,
  onSaveProcess,
  onSaveCard,
  onNextStation,
}) => {
  const initial = initialProcess || initialCard || DEFAULT_PROCESS;
  const [card, setCard] = useState<ProcessIdentityCard>({
    ...DEFAULT_PROCESS,
    ...initial,
  });
  const [copiedPidCmd, setCopiedPidCmd] = useState(false);
  const [copiedSigCmd, setCopiedSigCmd] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [challengeExe, setChallengeExe] = useState('');

  const handleUpdate = (key: keyof ProcessIdentityCard, value: any) => {
    setCard((prev) => ({ ...prev, [key]: value }));
  };

  const pidCommand = `Get-Process -Id ${card.pid || '1234'} | Select-Object Name,Id,Path`;
  const signatureCommand = `Get-AuthenticodeSignature "${card.path || 'C:\\Windows\\System32\\dwm.exe'}"`;

  const copyPidCmd = () => {
    navigator.clipboard.writeText(pidCommand);
    setCopiedPidCmd(true);
    setTimeout(() => setCopiedPidCmd(false), 2000);
  };

  const copySigCmd = () => {
    navigator.clipboard.writeText(signatureCommand);
    setCopiedSigCmd(true);
    setTimeout(() => setCopiedSigCmd(false), 2000);
  };

  const handleSaveAndProceed = () => {
    if (onSaveProcess) onSaveProcess(card);
    if (onSaveCard) onSaveCard(card);
    onNextStation();
  };

  return (
    <section
      id="estacion-03-el-proceso-misterioso"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 03 // 08</span>
          <span>•</span>
          <span>PERITAJE FORENSE DE PROCESOS</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          03 // EL PROCESO MISTERIOSO
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “No lo conocés. Pero eso no significa en absoluto que sea un virus o un error.”
        </p>
      </div>

      {/* Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          En los foros de optimización abunda una mala costumbre: si alguien ve un proceso con nombre
          raro en Windows, le recomiendan terminarlo, borrarlo o descargar un “script de limpieza”.
        </p>
        <p className="text-white font-medium">
          En EVO LABS no adivinamos. Aprendemos a <strong>seguir el rastro físico</strong> de un
          proceso: desde su número de instancia en el kernel (PID) hasta el archivo ejecutable en el
          disco y su firma criptográfica.
        </p>
      </div>

      {/* Form: Proceso a Investigar */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400">
          <Search className="w-4 h-4" />
          <span>INVESTIGACIÓN EN VIVO // REGISTRO DE DATOS BÁSICOS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech text-xs">
          {/* Nombre del Proceso */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">NOMBRE DEL PROCESO</label>
            <input
              type="text"
              value={card.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              placeholder="Ej. SearchHost.exe, RuntimeBroker.exe, spoolsv.exe"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* PID */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">PID (PROCESS ID)</label>
            <input
              type="text"
              value={card.pid}
              onChange={(e) => handleUpdate('pid', e.target.value)}
              placeholder="Ej. 4820"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-sm focus:outline-none focus:border-yellow-400"
            />
            <span className="text-[10px] text-zinc-500 block">
              Activar columna PID en Admin de tareas si no se ve
            </span>
          </div>

          {/* Consumo */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">CONSUMO OBSERVADO</label>
            <input
              type="text"
              value={card.observedConsumption}
              onChange={(e) => handleUpdate('observedConsumption', e.target.value)}
              placeholder="Ej. 45 MB RAM | 0.1% CPU"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Ruta y Editor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs pt-1">
          {/* Ruta en disco */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400 font-bold">RUTA COMPLETA EN DISCO (.EXE)</label>
              <span className="text-[11px] text-zinc-500">Clic derecho → Abrir ubicación</span>
            </div>
            <input
              type="text"
              value={card.path}
              onChange={(e) => handleUpdate('path', e.target.value)}
              placeholder="Ej. C:\Windows\System32\SearchHost.exe"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sky-300 text-xs focus:outline-none focus:border-yellow-400"
            />
            <span className="text-[10px] text-zinc-500 block">
              Si no está disponible: marcar como 'RUTA NO DETERMINADA'.
            </span>
          </div>

          {/* Editor */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-bold">EDITOR DECLARADO / FIRMANTE</label>
            <input
              type="text"
              value={card.publisher}
              onChange={(e) => handleUpdate('publisher', e.target.value)}
              placeholder="Ej. Microsoft Corporation, Valve Corporation, NVIDIA"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Forensic PowerShell Section */}
      <div className="p-5 rounded-2xl bg-black/50 border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold uppercase">
            <Terminal className="w-4 h-4" />
            <span>COMANDO POWERSHELL PERICIAL // INSPECCIONAR PID Y RUTA</span>
          </div>
          <span className="text-[11px] text-zinc-500">Auto-generado con tu PID ingresado</span>
        </div>

        <div className="relative group">
          <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
            <code>{pidCommand}</code>
          </pre>
          <button
            type="button"
            onClick={copyPidCmd}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copiar comando"
          >
            {copiedPidCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-zinc-400 text-[11px]">
          Este comando le solicita al kernel el objeto exacto vinculado a ese identificador y extrae la ruta del binario en el sistema de archivos.
        </p>
      </div>

      {/* Digital Signature Audit */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 font-bold uppercase flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            COMPROBACIÓN DE FIRMA DIGITAL (AUTHENTICODE)
          </span>
          <span className="text-[11px] text-zinc-500">Verificación criptográfica</span>
        </div>

        <div className="relative group">
          <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
            <code>{signatureCommand}</code>
          </pre>
          <button
            type="button"
            onClick={copySigCmd}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copiar comando"
          >
            {copiedSigCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-zinc-400 block font-bold mb-1.5">ESTADO DE LA FIRMA</label>
            <select
              value={card.signature}
              onChange={(e) => handleUpdate('signature', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="VALID">VALID // Firma válida y certificada</option>
              <option value="NOTSIGNED">NOTSIGNED // Binario no firmado</option>
              <option value="UNKNOWN">UNKNOWN // Cadena no verificable</option>
              <option value="HASHMISMATCH">HASHMISMATCH // Alterado tras firmarse</option>
              <option value="NO_DETERMINADA">NO DETERMINADA // No evaluada</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block font-bold mb-1.5">DICTAMEN PERICIAL</label>
            <select
              value={card.identificationResult}
              onChange={(e) => handleUpdate('identificationResult', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="IDENTIFICADO">IDENTIFICADO (Origen y propósito confirmados)</option>
              <option value="PARCIALMENTE_IDENTIFICADO">PARCIALMENTE IDENTIFICADO (Faltan detalles)</option>
              <option value="NO_DETERMINADO">NO DETERMINADO (Requiere análisis ulterior)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="text-zinc-400 block font-bold mb-1.5">OBSERVACIÓN FORENSE / NOTAS</label>
          <textarea
            value={card.observation}
            onChange={(e) => handleUpdate('observation', e.target.value)}
            rows={2}
            placeholder="Ej. Proceso legítimo del subsistema de indexación de Windows. Su consumo es esporádico y se detiene automáticamente durante cargas completas."
            className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400 font-sans-editorial"
          />
        </div>
      </div>

      {/* Regla Fundamental */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border-l-4 border-yellow-400 text-xs font-mono-tech space-y-1">
        <span className="font-bold text-white block">
          PRINCIPIO PERICIAL // FIRMA DIGITAL VS SEGURIDAD
        </span>
        <p className="text-zinc-300 font-sans-editorial leading-relaxed">
          Que un ejecutable no tenga firma digital (NOTSIGNED) <strong>no significa que sea un virus</strong> (muchas utilidades de código abierto no pagan certificados comerciales). Y viceversa: que tenga firma de un editor <strong>no garantiza que sea útil</strong> ni que no consuma recursos que preferís reservar.
        </p>
      </div>

      {/* TIPS EVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
        <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-yellow-400 block">TIP EVO // EL PID ES VOLÁTIL</span>
            <p className="text-zinc-300 font-sans-editorial leading-relaxed">
              Un PID identifica una instancia concreta en este encendido. Si cerrás el programa o reiniciás la PC, el sistema operativo le asignará un PID numérico totalmente nuevo.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-start gap-3">
          <FolderOpen className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sky-400 block">TIP EVO // LA RUTA ES LA VERDAD</span>
            <p className="text-zinc-300 font-sans-editorial leading-relaxed">
              Cualquier archivo puede llamarse 'svchost.exe'. La diferencia entre un proceso legítimo de Windows y un imitador reside en si se aloja en System32 o en una carpeta temporal sospechosa.
            </p>
          </div>
        </div>
      </div>

      {/* Recompensa / Ficha Emitida Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#14151b] to-black border border-yellow-400/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            FICHA DE IDENTIDAD EMITIDA // PROCESO INVESTIGADO
          </span>
          <span className="px-2.5 py-1 rounded bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 font-mono-tech text-[10px] uppercase font-bold">
            {card.identificationResult}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech text-xs">
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">NOMBRE</span>
            <span className="text-white font-bold truncate block">{card.name || 'No ingresado'}</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">PID ASIGNADO</span>
            <span className="text-yellow-400 font-bold">{card.pid || 'N/D'}</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">FIRMA DIGITAL</span>
            <span className="text-emerald-400 font-bold">{card.signature}</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">EDITOR</span>
            <span className="text-white font-bold truncate block">{card.publisher || 'Desconocido'}</span>
          </div>
        </div>

        <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 font-sans-editorial text-xs text-zinc-300 italic">
          “Acabás de seguir un proceso desde el Administrador de tareas hasta su ejecutable real en disco y su certificado criptográfico.”
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            id="btn-guardar-proceso-forense"
            onClick={handleSaveAndProceed}
            className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
          >
            GUARDAR PERITAJE // CONTINUAR A ESTACIÓN 04 →
          </button>
        </div>
      </div>
    </section>
  );
};
