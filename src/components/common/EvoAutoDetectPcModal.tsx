import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Zap,
  Terminal,
  Copy,
  Check,
  Cpu,
  Tv,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  Download,
  FileArchive,
  Loader2,
} from 'lucide-react';
import { UserHardwarePassport } from '../../types';

interface EvoAutoDetectPcModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHardwareDetected?: (hardware: UserHardwarePassport) => void;
}

export const EvoAutoDetectPcModal: React.FC<EvoAutoDetectPcModalProps> = ({
  isOpen,
  onClose,
  onHardwareDetected,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{
    CPU?: string;
    Cores?: number;
    Threads?: number;
    GPU?: string;
    VRAM_GB?: number;
    RAM_GB?: number;
    RAM_Speed?: number;
  } | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const powershellCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "$c=Get-CimInstance Win32_Processor | Select-Object -First 1; $v=Get-CimInstance Win32_VideoController | Select-Object -First 1; $m=Get-CimInstance Win32_PhysicalMemory; [PSCustomObject]@{CPU=$c.Name; Cores=$c.NumberOfCores; Threads=$c.NumberOfLogicalProcessors; GPU=$v.Name; VRAM_GB=if($v.AdapterRAM){[math]::Round($v.AdapterRAM/1GB,1)}else{0}; RAM_GB=[math]::Round(($m | Measure-Object Capacity -Sum).Sum/1GB,1); RAM_Speed=($m | Select-Object -First 1).Speed} | ConvertTo-Json -Compress | Set-Clipboard"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(powershellCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const zip = new JSZip();

      const cmdScriptContent = `@echo off
title EVO LABS // TELEMETRIA NATIVA
echo ===================================================
echo [EVO LABS] Analizando hardware desde el silicio...
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "$c=Get-CimInstance Win32_Processor | Select-Object -First 1; $v=Get-CimInstance Win32_VideoController | Select-Object -First 1; $m=Get-CimInstance Win32_PhysicalMemory; [PSCustomObject]@{CPU=$c.Name; Cores=$c.NumberOfCores; Threads=$c.NumberOfLogicalProcessors; GPU=$v.Name; VRAM_GB=if($v.AdapterRAM){[math]::Round($v.AdapterRAM/1GB,1)}else{0}; RAM_GB=[math]::Round(($m | Measure-Object Capacity -Sum).Sum/1GB,1); RAM_Speed=($m | Select-Object -First 1).Speed} | ConvertTo-Json -Compress | Set-Clipboard"
echo.
echo [OK] Telemetria pericial copiada al portapapeles con exito.
echo Volve a la web de EVO LABS y pega el resultado (Ctrl+V) en el cajon.
echo.
timeout /t 4 >nul
`;

      zip.file('EVO_Telemetria.cmd', cmdScriptContent);
      const blobContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      const blobUrl = URL.createObjectURL(blobContent);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'EVO_Telemetria_Script.zip';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);

      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 3500);
    } catch (err) {
      console.error('Error generando paquete ZIP:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleParseAndIngest = () => {
    setParseError(null);
    if (!jsonInput.trim()) {
      setParseError('Por favor pega el texto JSON generado por el comando de PowerShell.');
      return;
    }

    try {
      // Find json in text if user pasted extra text
      const cleanInput = jsonInput.trim();
      const firstBrace = cleanInput.indexOf('{');
      const lastBrace = cleanInput.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error('No se encontró un bloque JSON válido {...} en el texto pegado.');
      }

      const jsonSub = cleanInput.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonSub);

      if (!parsed.CPU && !parsed.GPU && !parsed.RAM_GB) {
        throw new Error('El JSON no contiene campos reconocibles de hardware (CPU, GPU o RAM_GB).');
      }

      setParsedData(parsed);

      // Create hardware passport
      const newPassport: UserHardwarePassport = {
        cpuModel: parsed.CPU || 'CPU Desconocida',
        cpuCores: parsed.Cores ? `${parsed.Cores}c / ${parsed.Threads || parsed.Cores}t` : 'Multi-Core',
        ramSizeGb: parsed.RAM_GB ? Math.round(parsed.RAM_GB) : 16,
        ramSpeedMhz: parsed.RAM_Speed ? parsed.RAM_Speed : 3200,
        ramType: parsed.RAM_Speed && parsed.RAM_Speed > 4400 ? 'DDR5' : 'DDR4',
        gpuModel: parsed.GPU || 'GPU Desconocida',
        vramGb: parsed.VRAM_GB ? Math.round(parsed.VRAM_GB) : 8,
        storageType: 'NVMe M.2 SSD',
        displayHz: 144,
        capturedAt: new Date().toISOString(),
      };

      // Save to localStorage
      try {
        localStorage.setItem('evo_c01_specs', JSON.stringify(newPassport));
        localStorage.setItem('evo_autodetected_hardware', JSON.stringify(parsed));
        // Dispatch storage event so other components update live
        window.dispatchEvent(new Event('evo_hardware_updated'));
      } catch (err) {
        console.error(err);
      }

      if (onHardwareDetected) {
        onHardwareDetected(newPassport);
      }

      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
      }, 4000);
    } catch (err: any) {
      setParseError(err.message || 'Error al procesar el JSON. Verificá que hayas copiado la salida completa.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-mono-tech relative flex flex-col max-h-[92vh]"
        style={{
          background: 'rgba(14, 18, 25, 0.94)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-[#080a0d]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  TELEMETRÍA NATIVA EN 1 CLIC
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CIM/WMI READ-ONLY
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-tight uppercase">
                AUTO-DETECTAR MI PC // SIN INSTALAR NADA
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          
          {/* Aerospace Security Assurance Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans-editorial">
              <div className="font-mono-tech font-bold text-emerald-400 text-xs uppercase tracking-wide">
                Protocolo Seguro de Cero Huella (Zero-Admin, Zero-Install)
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Este comando utiliza únicamente consultas nativas de Windows WMI/CIM de solo lectura.
                No modifica el Registro, no descarga ejecutables de terceros y no requiere privilegios de Administrador.
              </p>
            </div>
          </div>

          {/* STEP 1: Copy Command */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2 text-xs uppercase">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>COPIÁ ESTE COMANDO NATIVO DE POWERSHELL</span>
              </span>
              <span className="text-[10px] text-zinc-500">Un clic copia la línea completa</span>
            </div>

            <div className="relative rounded-xl bg-[#080a0d] border border-zinc-800 p-3.5 font-mono text-[11px] text-amber-200/90 overflow-x-auto">
              <pre className="whitespace-pre-wrap break-all pr-24 font-mono leading-relaxed">
                {powershellCommand}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className={`absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  copied
                    ? 'bg-emerald-500 text-black border border-emerald-400'
                    : 'bg-amber-400 hover:bg-amber-300 text-black border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>¡COPIADO!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPIAR</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans-editorial">
              Abrí PowerShell en tu PC (presioná <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Win</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">X</kbd> y elegí <em>Terminal</em> o <em>PowerShell</em>), pegá el comando y dale <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Enter</kbd>.
            </p>

            {/* Alternativa: Descarga directa en ZIP empaquetado (Sin falsos positivos del navegador) */}
            <div className="p-3.5 rounded-xl bg-[#0a0d14] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-0.5 font-sans-editorial">
                <div className="font-mono-tech font-bold text-xs text-amber-300 uppercase flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-amber-400" />
                  <span>¿PREFERÍS EJECUTARLO EN 1 CLIC? (AUTO-COPIADO)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Descargá el .zip, extraé el archivo y ejecutalo. Tu telemetría se copiará sola al portapapeles de forma segura (Zero-Install).
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isDownloadingZip}
                className={`px-4 py-2.5 rounded-xl font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md ${
                  zipDownloaded
                    ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 hover:border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                }`}
                title="Descargar EVO_Telemetria_Script.zip para ejecutar directamente"
              >
                {isDownloadingZip ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>EMPAQUETANDO...</span>
                  </>
                ) : zipDownloaded ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3]" />
                    <span>¡ZIP DESCARGADO!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>DESCARGAR SCRIPT (.ZIP)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: Paste JSON */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2 text-xs uppercase">
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-black font-black flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>PEGÁ ACÁ LA RESPUESTA JSON OBTENIDA</span>
              </span>
              <span className="text-[10px] text-zinc-500">Formato: {"{ \"CPU\": ... }"}</span>
            </div>

            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Ejemplo: {"CPU":"AMD Ryzen 7 7800X3D","Cores":8,"Threads":16,"GPU":"NVIDIA GeForce RTX 4080","VRAM_GB":16,"RAM_GB":32,"RAM_Speed":6000}'
                rows={3}
                className="w-full rounded-xl bg-[#080a0d] border border-zinc-800 focus:border-cyan-400 p-3.5 font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none"
              />
            </div>

            {parseError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>¡Hardware Sincronizado Exitosamente!</strong> Todas las herramientas de EVO LABS y el Sector 02 han sido pobladas con las especificaciones reales de tu equipo.
                </span>
              </div>
            )}
          </div>

          {/* Parsed Live Cards Preview */}
          {parsedData && (
            <div className="p-4 rounded-xl bg-[#080a0d] border border-zinc-800 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  MÁQUINA DETECTADA Y VALIDADA:
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">100% SINTONIZADO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono-tech">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
                    <Cpu className="w-3 h-3 text-amber-400" />
                    <span>PROCESADOR</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate mt-0.5" title={parsedData.CPU}>
                    {parsedData.CPU || 'N/A'}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    {parsedData.Cores}c / {parsedData.Threads}t
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
                    <Tv className="w-3 h-3 text-cyan-400" />
                    <span>GRÁFICA (GPU)</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate mt-0.5" title={parsedData.GPU}>
                    {parsedData.GPU || 'N/A'}
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">
                    {parsedData.VRAM_GB ? `${parsedData.VRAM_GB} GB VRAM` : 'Integrada / N/A'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
                    <HardDrive className="w-3 h-3 text-emerald-400" />
                    <span>MEMORIA RAM</span>
                  </div>
                  <div className="font-bold text-white text-xs truncate mt-0.5">
                    {parsedData.RAM_GB ? `${parsedData.RAM_GB} GB Total` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    {parsedData.RAM_Speed ? `${parsedData.RAM_Speed} MT/s` : 'Frecuencia JEDEC'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-[#080a0d]/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-white font-mono-tech text-xs transition-colors cursor-pointer"
          >
            CERRAR
          </button>

          <button
            type="button"
            onClick={handleParseAndIngest}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.35)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>INGESTAR Y SINCRONIZAR CON EL LABORATORIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
