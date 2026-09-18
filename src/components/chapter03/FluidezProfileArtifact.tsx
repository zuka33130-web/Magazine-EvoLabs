import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Layers,
  Award,
  Clock,
  Cpu,
} from 'lucide-react';
import {
  FluidezProfileData,
  FluidezProfileExportSchema,
  UserPcSpec,
} from '../../types';

interface FluidezProfileArtifactProps {
  profileData: FluidezProfileData;
  specs: Partial<UserPcSpec>;
  isCompleted: boolean;
  onConsolidate: () => void;
  onResetTest: () => void;
  onOpenChapter04: () => void;
  onBackToIndex: () => void;
}

export const FluidezProfileArtifact: React.FC<FluidezProfileArtifactProps> = ({
  profileData,
  specs,
  isCompleted,
  onConsolidate,
  onResetTest,
  onOpenChapter04,
  onBackToIndex,
}) => {
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const effectiveGame =
    profileData.game === 'OTRO' && profileData.customGameName
      ? profileData.customGameName
      : profileData.game;

  const effectiveRes =
    profileData.resolution === 'PERSONALIZADA' && profileData.customResolution
      ? profileData.customResolution
      : profileData.resolution;

  // Export to TXT format
  const handleExportTxt = () => {
    const lines = [
      '============================================================',
      'EVO LABS // EXPEDIENTE TÉCNICO // TOMO 01',
      'ARTEFACTO // PERFIL DE FLUIDEZ EVO 001',
      '============================================================',
      `FECHA DE REGISTRO: ${profileData.registeredAt}`,
      `MÉTODO: ${profileData.method}`,
      '',
      '--- CONTEXTO DE HARDWARE (HEREDADO C01) ---',
      `CPU: ${specs.cpu || 'No especificada'}`,
      `GPU: ${specs.gpu || 'No especificada'}`,
      `RAM: ${specs.ram || 'No especificada'}`,
      `ALMACENAMIENTO: ${specs.storage || 'No especificado'}`,
      '',
      '--- PARÁMETROS DEL ENSAYO ---',
      `JUEGO: ${effectiveGame}`,
      `RESOLUCIÓN: ${effectiveRes}`,
      `CALIDAD GRÁFICA: ${profileData.quality}`,
      `LÍMITE DE FPS: ${profileData.fpsLimit}`,
      `V-SYNC: ${profileData.vsync}`,
      `MONITOR / REFRESCO: ${profileData.monitor}`,
      '',
      '--- RESULTADOS DE MEDICIÓN ---',
      `FPS HABITUALES OBSERVADOS: ${profileData.fpsHabituales ?? 'No registrado'}`,
      `CAÍDA MÁS BAJA OBSERVADA: ${profileData.caidaObservada ?? 'No registrada'}`,
      `FRAMETIME TEÓRICO: ${profileData.frametimeTeoricoMs ? `${profileData.frametimeTeoricoMs} ms` : 'No calculado'}`,
      `SENSACIÓN PERCIBIDA: ${profileData.sensacion}`,
      `SÍNTOMAS REPORTADOS: ${profileData.sintomas.length > 0 ? profileData.sintomas.join(', ') : 'Ninguno'}`,
      '',
    ];

    if (profileData.hasTelemetry && profileData.avgFps) {
      lines.push(
        '--- TELEMETRÍA CAPTURADA CUADRO POR CUADRO ---',
        `AVG FPS: ${profileData.avgFps}`,
        `1% LOW: ${profileData.onePercentLow ?? 'N/A'}`,
        `0.1% LOW: ${profileData.zeroPointOnePercentLow ?? 'N/A'}`,
        `FRAMETIME MEDIO: ${profileData.frametimeAvgMs ? `${profileData.frametimeAvgMs} ms` : 'N/A'}`,
        `PICO DE FRAMETIME: ${profileData.frametimePeakMs ? `${profileData.frametimePeakMs} ms` : 'N/A'}`,
        `DURACIÓN DE CAPTURA: ${profileData.captureDurationSeconds ? `${profileData.captureDurationSeconds}s` : 'N/A'}`,
        ''
      );
    }

    lines.push(
      '--- CONCLUSIÓN EDITORIAL EVO LABS ---',
      '“Este perfil constituye la línea base empírica de tu equipo.',
      'En futuros ensayos modificaremos una única variable para cuantificar',
      'la ganancia o pérdida exacta en regularidad de cuadros.”',
      '============================================================'
    );

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EVO_LABS_PERFIL_FLUIDEZ_001_${profileData.game.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setCopiedNotification('Perfil exportado en formato TXT.');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Export to JSON format
  const handleExportJson = () => {
    const exportSchema: FluidezProfileExportSchema = {
      schemaVersion: 1,
      generatedAt: profileData.registeredAt,
      artifact: 'PERFIL_DE_FLUIDEZ_EVO_001',
      hardwareSpecs: specs,
      fluidezProfile: profileData,
      interpretacion: {
        loQueSabemos: [
          `Juego: ${effectiveGame} en ${effectiveRes}`,
          `FPS habituales: ${profileData.fpsHabituales ?? 'N/A'}`,
          `Sensación: ${profileData.sensacion}`,
        ],
        loQueTodaviaNoSabemos: [
          'Componente físico causante del cuello de botella',
          'Comportamiento bajo estrés térmico prolongado',
        ],
        clasificacionEstabilidad: profileData.sensacion,
        hipotesisAbiertas: ['CPU Draw calls', 'GPU VRAM', 'RAM Latency', 'Thermal limits'],
      },
    };

    const blob = new Blob([JSON.stringify(exportSchema, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EVO_LABS_PERFIL_FLUIDEZ_001_${profileData.game.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setCopiedNotification('Perfil exportado en formato JSON.');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <section id="seccion-estacion-07" className="space-y-8 pt-6">
      {/* Station Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-widest text-yellow-400 font-bold">
            <span>ESTACIÓN 07</span>
            <span>•</span>
            <span>EXPEDIENTE TÉCNICO // PERFIL DE FLUIDEZ EVO 001</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            Tu línea base de rendimiento consolidada
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="text-xs font-mono-tech px-3 py-1 rounded-full bg-yellow-400 text-black font-bold uppercase flex items-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              CONSOLIDADO
            </span>
          )}
        </div>
      </div>

      {/* Artifact Technical Certificate Card */}
      <div className="rounded-2xl bg-[#111217] border-2 border-yellow-400 shadow-2xl p-6 sm:p-8 text-left space-y-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400" />

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>EVO LABS // ARTEFACTO CERTIFICADO // TOMO 01</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-none">
              PERFIL DE FLUIDEZ EVO 001
            </h3>
            <p className="text-xs font-mono-tech text-zinc-400">
              Línea base registrada para {effectiveGame} • {profileData.method}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 uppercase">
              {profileData.registeredAt}
            </span>
          </div>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-tech">
          {/* Hardware Heredado */}
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">
              HARDWARE ASOCIADO (C01)
            </span>
            <div className="space-y-1 text-zinc-300">
              <div>CPU: <strong className="text-white">{specs.cpu || 'Auditada en C01'}</strong></div>
              <div>GPU: <strong className="text-white">{specs.gpu || 'Auditada en C01'}</strong></div>
              <div>RAM: <strong className="text-white">{specs.ram || 'Auditada en C01'}</strong></div>
            </div>
          </div>

          {/* Contexto Gráfico */}
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">
              CONDICIÓN DEL ENSAYO
            </span>
            <div className="space-y-1 text-zinc-300">
              <div>Resolución: <strong className="text-white">{effectiveRes}</strong></div>
              <div>Calidad: <strong className="text-white">{profileData.quality}</strong></div>
              <div>Límite: <strong className="text-white">{profileData.fpsLimit}</strong></div>
              <div>V-Sync: <strong className="text-white">{profileData.vsync}</strong></div>
            </div>
          </div>

          {/* Métricas y Diagnóstico */}
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">
              LECTURA TEMPORAL
            </span>
            <div className="space-y-1 text-zinc-300">
              <div>
                FPS Habituales:{' '}
                <strong className="text-yellow-400 font-bold text-sm">
                  {profileData.fpsHabituales ? `${profileData.fpsHabituales} FPS` : 'N/A'}
                </strong>
              </div>
              <div>
                Cadencia teórica:{' '}
                <strong className="text-white">
                  {profileData.frametimeTeoricoMs ? `${profileData.frametimeTeoricoMs} ms` : 'N/A'}
                </strong>
              </div>
              <div>
                Sensación: <strong className="text-white">{profileData.sensacion}</strong>
              </div>
              {profileData.hasTelemetry && profileData.onePercentLow && (
                <div className="pt-1 border-t border-zinc-800 text-[11px] text-emerald-400">
                  AVG: {profileData.avgFps} • 1% Low: {profileData.onePercentLow}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Purpose Quote */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border-l-4 border-yellow-400 space-y-1">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-yellow-400 font-bold block">
            UTILIDAD METODOLÓGICA EN EVO LABS
          </span>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
            “Este perfil será nuestra línea base inalterable. Más adelante, cuando optimicemos procesos, drivers o frecuencias, cambiaremos una sola variable y volveremos a medir exactamente la misma escena para cuantificar si ganamos estabilidad real.”
          </p>
        </div>

        {/* Actions Bar */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-export-perfil-txt"
              onClick={handleExportTxt}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-200 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-yellow-400" />
              <span>EXPORTAR TXT</span>
            </button>

            <button
              type="button"
              id="btn-export-perfil-json"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-200 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-yellow-400" />
              <span>EXPORTAR JSON</span>
            </button>

            <button
              type="button"
              id="btn-repetir-medicion"
              onClick={onResetTest}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono-tech text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nueva prueba / Editar</span>
            </button>
          </div>

          {!isCompleted && (
            <button
              type="button"
              id="btn-consolidar-perfil-fluidez"
              onClick={onConsolidate}
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-all shadow-xl hover:shadow-yellow-400/20 inline-flex items-center gap-2"
            >
              <span>CONSOLIDAR PERFIL Y FINALIZAR CAPÍTULO</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          )}
        </div>

        {copiedNotification && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-tech animate-in fade-in duration-150">
            {copiedNotification}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* CIERRE DEL CAPÍTULO 03 & CLIFFHANGER AL CAPÍTULO 04 */}
      {/* ============================================================ */}
      {isCompleted && (
        <div id="bloque-cierre-capitulo-03" className="space-y-6 pt-4 animate-in fade-in duration-300">
          {/* Resumen de aprendizajes validados */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>CAPÍTULO 03 COMPLETADO // INVESTIGACIÓN VALIDADA</span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              LOS FPS YA NO SON UN SOLO NÚMERO
            </h3>

            <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
              Ahora sabés que el promedio cuenta solo una parte de la historia. La regularidad con la que llegan los frames puede cambiar completamente cómo se siente un juego y cómo responde tu puntería.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                'Mostrar y observar FPS en tu juego',
                'Distinguir FPS (frecuencia) de frametime (cadencia)',
                'Comprender la métrica 1% Low y 0.1% Low',
                'Reconocer micro-stuttering frente a caídas continuas',
                'Separar percepción subjetiva de telemetría',
                'Crear una línea base certificada de fluidez',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono-tech text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cliffhanger to Chapter 04 // ENCONTRÁ EL LÍMITE */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#181920] to-[#0d0e12] border-2 border-yellow-400 space-y-5 text-left relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-wider">
                <Flame className="w-4 h-4 text-yellow-400" />
                <span>PRÓXIMO PASO // TOMO 01 // CAPÍTULO 04</span>
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none">
                CAPÍTULO 04 // ENCONTRÁ EL LÍMITE
              </h3>

              <p className="text-xs font-mono-tech uppercase text-zinc-400 tracking-wider">
                CPU • GPU • RAM • TEMPERATURA • ENERGÍA • CARGA
              </p>
            </div>

            <p className="font-sans-editorial text-base sm:text-lg text-zinc-200 italic leading-relaxed max-w-3xl">
              “Ya sabemos cuándo una experiencia es inestable y cómo detectar los picos de frametime. Ahora falta responder la pregunta más difícil de la arquitectura de computadoras:
              <br />
              <strong className="text-white not-italic font-bold">
                ¿QUIÉN ESTÁ ESPERANDO A QUIÉN?
              </strong>”
            </p>

            {/* Action Buttons: Yellow CTA for opening next chapter */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                id="btn-c03-abrir-c04"
                onClick={onOpenChapter04}
                className="px-7 py-4 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-all shadow-xl hover:shadow-yellow-400/25 inline-flex items-center justify-center gap-3 group/btn"
              >
                <span>ABRIR CAPÍTULO 04: ENCONTRÁ EL LÍMITE</span>
                <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onBackToIndex}
                className="px-6 py-4 rounded-xl bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-zinc-500 font-mono-tech font-bold text-xs uppercase cursor-pointer transition-colors text-center"
              >
                VOLVER AL ÍNDICE DEL TOMO 01
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
