import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  Folder,
  ShieldCheck,
  ArrowRight,
  FileText,
  AlertTriangle,
  FolderCheck,
} from 'lucide-react';

interface Tomo02Sector02MissionViewProps {
  onBack: () => void;
  onMissionComplete: () => void;
}

export const Tomo02Sector02MissionView: React.FC<Tomo02Sector02MissionViewProps> = ({
  onBack,
  onMissionComplete,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dossierNotes, setDossierNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const checklist = [
    { id: 'c1', label: 'Verificar estado de ocultación de extensiones en el Explorador (`Factura.pdf.exe`)', category: 'ATRIBUTOS' },
    { id: 'c2', label: 'Identificar rutas C:\\Windows\\System32 (x64) y C:\\Windows\\SysWOW64 (32-bit)', category: 'ARQUITECTURA' },
    { id: 'c3', label: 'Comprobar contenido y regla de no borrado de C:\\Windows\\WinSxS (Hard Links)', category: 'CONSERVACIÓN' },
    { id: 'c4', label: 'Ubicar carpeta %APPDATA% (Roaming vs Local vs LocalLow)', category: 'PERFIL' },
    { id: 'c5', label: 'Ejecutar orden `attrib` en consola para verificar flags +H / +S', category: 'COMANDOS' },
    { id: 'c6', label: 'Validar ruta de logs principales C:\\Windows\\Logs y C:\\Windows\\Minidump', category: 'LOGS' },
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const isAllChecked = completedCount === checklist.length;

  const handleSave = () => {
    setIsSaved(true);
    onMissionComplete();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 space-y-4 shadow-[0_0_30px_rgba(0,164,239,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF]">
              <FolderCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#60CDFF] font-bold">MISIÓN PRÁCTICA DE CAMPO</span>
              <h1 className="text-lg font-bold text-white uppercase tracking-tight">
                AUDITORÍA PERICIAL DE RUTAS Y ESTRUCTURA SECTOR 02
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold border border-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            VOLVER AL TEMARIO
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          Ejecutá los hallazgos en tu sistema Windows real y completá el protocolo de verificación. Esta auditoría confirma que podés orientarte en C:\ sin cometer destrucciones accidentales de archivos protegidos.
        </p>
      </div>

      {/* Checklist */}
      <div className="p-6 rounded-2xl bg-[#080B10] border border-sky-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00A4EF]" />
            PROTOCOLOS DE AUDITORÍA (6 PASOS)
          </span>
          <span className="text-xs text-[#60CDFF]">
            {completedCount} / {checklist.length} VERIFICADOS
          </span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {checklist.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-[#11161D] border-sky-500/10 text-zinc-300 hover:border-sky-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${isChecked ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-zinc-600'}`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#05070A] border border-sky-500/20 text-[#60CDFF] font-bold shrink-0">
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forensic Notes */}
      <div className="p-6 rounded-2xl bg-[#080B10] border border-sky-500/20 space-y-3 font-mono">
        <label htmlFor="sector02-notes" className="text-xs font-bold text-white block">
          NOTAS DE HALLAZGO Y ANOMALÍAS EN TU PC:
        </label>
        <textarea
          id="sector02-notes"
          value={dossierNotes}
          onChange={(e) => setDossierNotes(e.target.value)}
          placeholder="Escribí aquí si encontraste extensiones ocultas, carpetas de instalador gigantes o anomalías en la auditoría..."
          className="w-full h-24 p-3 rounded-xl bg-[#05070A] border border-sky-500/20 text-xs text-zinc-200 focus:outline-none focus:border-[#00A4EF] font-sans resize-none"
        />
      </div>

      {/* Mission Action */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs">
        <span className="text-zinc-400">
          {isAllChecked ? '¡Todos los protocolos han sido auditados!' : 'Marcá los 6 ítems para completar la misión.'}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isAllChecked}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isAllChecked
              ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span>{isSaved ? 'MISIÓN GUARDADA' : 'REGISTRAR MISIÓN EN EXPEDIENTE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
