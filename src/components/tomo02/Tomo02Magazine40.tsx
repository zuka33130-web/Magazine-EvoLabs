import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Printer,
  ShieldCheck,
  FlaskConical,
  Terminal,
  Cpu,
  Layers,
  Activity,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Info,
  CornerDownRight,
  Hash,
  AlertTriangle,
  Flame,
  Search,
} from 'lucide-react';
import { Tomo02MasterPage } from './Tomo02MasterPage';
import './Tomo02Magazine40.css';
import {
  EVO_WINDOWS_50_HEADLINES,
  EVO_WINDOWS_50_BLOCKS,
} from '../../data/tomo02Windows50';
import {
  EVO_WINDOWS40_001,
  EVO_WINDOWS40_001_REFERENCES,
  type Windows40Page,
} from '../../data/tomo02Magazine40Chapter001';
import { EVO_WINDOWS40_RESEARCH } from '../../data/tomo02Magazine40Corpus';
import type { EvoWindowsResearch } from '../../data/tomo02Magazine40CorpusTypes';
import { EVO_W50_LABS_E } from '../../data/tomo02Windows50LabsE';
import type { EvoWindowsFieldLab } from '../../data/tomo02Windows50LabTypes';
import { Tomo02WindowsEditorialArt, type WindowsArtKind } from './Tomo02WindowsEditorialArt';
import { TOMO_02_COVER } from '../../data/tomoCoversData';

/**
 * Total de páginas de la revista A4 (Edición continua completa tipo Hack x Crack):
 * 1 Portada + 1 Manifiesto + 2 Sumarios canónicos (50 títulos)
 * + 16 páginas de Investigación 001 (8 secciones dobles)
 * + 78 páginas de Investigaciones 002 a 040 (39 expedientes dobles)
 * + 20 páginas de Investigaciones 041 a 050 (10 expedientes dobles)
 * + 1 Cierre Editorial y Certificación
 * = 119 páginas continuas en un solo PDF.
 */
const TOTAL_PAGES =
  4 +
  EVO_WINDOWS40_001.length * 2 +
  EVO_WINDOWS40_RESEARCH.length * 2 +
  EVO_W50_LABS_E.length * 2 +
  1;

const pageId = (page: number) => `evo-w40-page-${String(page).padStart(2, '0')}`;
const pad = (n: number) => String(n).padStart(3, '0');

export const targetPageForDossier = (num: number): number => {
  if (num === 1) return 5;
  if (num <= 40) return 21 + (num - 2) * 2;
  return 99 + (num - 41) * 2;
};

type Props = { onBack: () => void; onOpenBiblia: () => void };

const Page: React.FC<{
  number: number;
  title: string;
  children: React.ReactNode;
  cover?: boolean;
  final?: boolean;
}> = ({ number, title, children, cover, final }) => (
  <Tomo02MasterPage
    pageId={pageId(number)}
    pageNumber={number}
    totalPages={TOTAL_PAGES}
    sectionTitle={title}
    subSlug="WINDOWS · INVESTIGACIÓN APLICADA"
    accentColor="#00D2FF"
    pageFooterRight="NO LO CREAS. COMPROBALO."
    hideHeaderFooter={cover}
    isCover={cover}
    isBackCover={final}
  >
    {children}
  </Tomo02MasterPage>
);

const Diagram: React.FC<{ mode: NonNullable<Windows40Page['visual']> }> = ({ mode }) => {
  const model: Record<
    NonNullable<Windows40Page['visual']>,
    readonly { step: string; label: string; desc: string }[]
  > = {
    flow: [
      { step: '01', label: 'EVENTO', desc: 'Trigger / I/O' },
      { step: '02', label: 'HILO LISTO', desc: 'Dispatcher Queue' },
      { step: '03', label: 'PLANIFICADOR', desc: 'Quantum CPU' },
      { step: '04', label: 'CPU · E/S', desc: 'Ejecución Lógica' },
      { step: '05', label: 'ESPERA', desc: 'Sleep / Bloqueo' },
    ],
    cpu: [
      { step: '01', label: 'MUESTRA 1', desc: 'Tiempo base t0' },
      { step: '02', label: 'Δ CPU (s)', desc: 'Ventana de 5s' },
      { step: '03', label: 'MUESTRA 2', desc: 'Tiempo final t1' },
      { step: '04', label: '% ESTIMADO', desc: '(ΔCPU/Δt/N)×100' },
    ],
    experiment: [
      { step: '01', label: 'HIPÓTESIS', desc: 'Causa postulada' },
      { step: '02', label: 'LÍNEA BASE', desc: 'Reposo medido' },
      { step: '03', label: '3 ENSAYOS', desc: 'A / B / C idénticos' },
      { step: '04', label: 'CONTRASTE', desc: 'Diferencia real' },
      { step: '05', label: 'CONCLUSIÓN', desc: 'Veredicto fundado' },
    ],
    network: [
      { step: '01', label: 'PROCESO', desc: 'Binario activo' },
      { step: '02', label: 'PID', desc: 'Identificador único' },
      { step: '03', label: 'SOCKET TCP', desc: 'Puerto local/remoto' },
      { step: '04', label: 'DESTINO', desc: 'IP / Endpoint DNS' },
      { step: '05', label: 'CONTEXTO', desc: 'Atribución de servicio' },
    ],
    verdict: [
      { step: '01', label: 'OBSERVACIÓN', desc: 'Dato empírico' },
      { step: '02', label: 'CORRELACIÓN', desc: 'Coincidencia temporal' },
      { step: '03', label: 'ALTERNATIVAS', desc: 'Descarte sistemático' },
      { step: '04', label: 'VEREDICTO', desc: 'Certeza probada' },
    ],
  };

  const steps = model[mode] || model.flow;

  return (
    <figure className="my-1.5 rounded-xl border border-[#00D2FF]/35 bg-[#040e1e] p-2.5 shadow-md">
      <div className="mb-2 flex items-center justify-between font-mono-tech text-[8.5px] font-black uppercase tracking-widest text-[#8DE8FF]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
          ESQUEMA FORENSE EVO · MODELO CONCEPTUAL NT
        </span>
        <span className="text-[#5984A2]">METODOLOGÍA DIDÁCTICA</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
        {steps.map((item, i) => (
          <div
            key={item.label}
            className="relative flex flex-col justify-between rounded-lg border border-[#00D2FF]/30 bg-gradient-to-b from-[#092949] to-[#041427] p-1.5 text-center transition-all hover:border-[#60CDFF]"
          >
            <div className="flex items-center justify-between text-[7.5px] font-mono-tech text-[#60CDFF] font-black">
              <span>{item.step}</span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="text-[#00D2FF] opacity-70">
                  →
                </span>
              )}
            </div>
            <span className="my-0.5 font-mono-tech text-[9.5px] font-black tracking-wide text-white">
              {item.label}
            </span>
            <span className="font-mono-tech text-[7.5px] text-[#A6D6F3]">{item.desc}</span>
          </div>
        ))}
      </div>
    </figure>
  );
};

const artKindForIndex = (index: number): WindowsArtKind => {
  const map: WindowsArtKind[] = [
    'night',
    'kernel',
    'cpu',
    'experiment',
    'tasks',
    'network',
    'verdict',
    'security',
  ];
  return map[index % map.length];
};

const ChapterPage: React.FC<{
  data: Windows40Page;
  index: number;
  part: 0 | 1;
}> = ({ data, index, part }) => {
  const [copied, setCopied] = React.useState(false);
  const number = 5 + index * 2 + part;
  const isFirstOfDossier = index === 0 && part === 0;

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Page
      number={number}
      title={`${data.eyebrow} · ${part === 0 ? 'APERTURA' : 'CONTINUACIÓN'}`}
    >
      <article className="evo-w40-chapter">
        <header className="evo-w40-chapter__heading">
          <div className="evo-w40-chapter__metadata">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
              {data.eyebrow}
            </span>
            <span className="evo-w40-chapter__tag">
              {part === 0 ? 'PLIEGO I / TEORÍA & ESTRUCTURA' : 'PLIEGO II / EXPERIMENTO & VEREDICTO'}
            </span>
          </div>

          <h2 className="evo-w40-chapter__title">{data.title}</h2>
          <p className="evo-w40-chapter__subtitle">{data.subtitle}</p>
        </header>

        {part === 0 ? (
          <>
            {isFirstOfDossier ? (
              <Tomo02WindowsEditorialArt
                kind={artKindForIndex(index)}
                variant="hero"
                caption="ANÁLISIS PERICIAL DE LA ACTIVIDAD EN SEGUNDO PLANO DE WINDOWS"
              />
            ) : (
              <Tomo02WindowsEditorialArt
                kind={artKindForIndex(index)}
                variant="wide"
                caption={`EXPEDIENTE 001 // SECCIÓN ${index + 1} — KERNEL NT 10.0`}
              />
            )}

            <div className="evo-w40-chapter__columns">
              {data.paragraphs.slice(0, 3).map((p, i) => (
                <p key={i} className={i === 0 && isFirstOfDossier ? 'evo-w40-dropcap' : undefined}>
                  {p}
                </p>
              ))}
            </div>

            {data.visual && <Diagram mode={data.visual} />}

            <div className="evo-w40-next">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-[#00D2FF]" />
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-[#60CDFF]">
                    CONTINÚA EN LA SIGUIENTE PÁGINA (PÁG. {pad(number + 1)})
                  </span>
                  <strong>{data.title}</strong>
                </div>
              </div>
              <span className="rounded bg-[#02182c] px-2 py-0.5 font-mono-tech text-[8.5px] text-[#A6E8FF] border border-[#00D2FF]/30">
                PÁGINA 1 DE 2
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="evo-w40-chapter__columns">
              {data.paragraphs.slice(3).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {data.laboratory && (
              <section className="evo-w40-lab">
                <div className="evo-w40-lab__top flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-1">
                      <span className="h-2 w-2 rounded-full bg-red-400/90 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/90 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/90 inline-block" />
                    </div>
                    <span className="evo-w40-lab__label">{data.laboratory.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(data.laboratory!.code)}
                      className="flex items-center gap-1 rounded bg-[#00529B] hover:bg-[#0078D4] px-2.5 py-0.5 font-mono-tech text-[9px] font-black text-white transition-all shadow-[0_0_10px_rgba(0,120,212,0.4)]"
                      title="Copiar script PowerShell al portapapeles"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-emerald-300" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copied ? '¡COPIADO!' : 'COPIAR SCRIPT'}</span>
                    </button>
                    <span className="evo-w40-lab__readonly">CONSULTA · SOLO LECTURA</span>
                  </div>
                </div>
                <div className="px-3 pt-1.5 pb-0.5 text-[9.5px] font-mono-tech text-[#8DE8FF] flex items-center gap-1.5 bg-[#020b18] border-b border-[#00D2FF]/20">
                  <Info className="h-3 w-3 text-[#00D2FF] shrink-0" />
                  <span>{data.laboratory.why}</span>
                </div>
                <pre className="evo-w40-lab__code">
                  <code>{data.laboratory.code}</code>
                </pre>
                <div className="evo-w40-lab__readout flex items-start gap-1.5">
                  <Activity className="h-3 w-3 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{data.laboratory.readout}</span>
                </div>
              </section>
            )}

            <aside className="evo-w40-focus">
              <div className="flex items-center gap-2 mb-1 text-[#60CDFF]">
                <ShieldCheck className="h-4 w-4 text-[#00D2FF] shrink-0" />
                <span className="font-mono-tech text-[9px] font-black uppercase tracking-wider">
                  {data.focus.label}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-white leading-relaxed">
                {data.focus.text}
              </p>
            </aside>

            {data.footnote && (
              <p className="evo-w40-footnote">
                <span className="font-bold text-[#60CDFF]">[METROLOGÍA]</span> {data.footnote}
              </p>
            )}
          </>
        )}
      </article>
    </Page>
  );
};

/**
 * Pliego A4 tipo revista Hack x Crack para las Investigaciones 002 a 040.
 * Cada investigación abarca dos páginas completas:
 * - Pliego 1: El Misterio, Mecanismos Reales, Falsas Pistas y Fórmula Pericial.
 * - Pliego 2: Protocolo Experimental, Consola PowerShell, Interpretación, Veredicto y Fuentes Oficiales.
 */
const HackXCrackDossierPage: React.FC<{
  research: EvoWindowsResearch;
  part: 0 | 1;
}> = ({ research, part }) => {
  const [copied, setCopied] = React.useState(false);
  const number = 21 + (research.number - 2) * 2 + part;
  const headline = EVO_WINDOWS_50_HEADLINES[research.number - 1];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Page
      number={number}
      title={`EXPEDIENTE ${pad(research.number)} · ${part === 0 ? 'INVESTIGACIÓN TÉCNICA' : 'LABORATORIO & VEREDICTO'}`}
    >
      <div className="flex h-full flex-col justify-between space-y-2.5">
        <div className="border-b border-[#00D2FF]/40 pb-2">
          <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#60CDFF] tracking-wider uppercase font-black">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
              EXPEDIENTE {pad(research.number)} // INVESTIGACIÓN FORENSE
            </span>
            <span className="rounded bg-[#041d38] px-2 py-0.5 border border-[#00D2FF]/30 text-[#8DE8FF]">
              {part === 0 ? 'PLIEGO I / APERTURA & ANÁLISIS' : 'PLIEGO II / LABORATORIO & VEREDICTO'}
            </span>
          </div>
          <h2 className="mt-1 font-display text-[21px] font-black uppercase text-white tracking-tight leading-tight">
            {headline}
          </h2>
          <p className="mt-0.5 text-[10px] text-[#A6D8F8] font-mono-tech">
            {part === 0
              ? 'Análisis pericial del subsistema: premisa, arquitectura, fallos típicos y clave técnica.'
              : 'Verificación empírica con script reproducible, diagnóstico pericial y fuentes oficiales.'}
          </p>
        </div>

        {part === 0 ? (
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-3.5 text-[10.5px] leading-relaxed text-[#E1EEF7] font-sans-editorial">
              <div className="space-y-2">
                <div>
                  <h4 className="evo-hxc-section-title">
                    <span className="text-[#00D2FF]">01</span> EL MISTERIO // PUNTO DE PARTIDA
                  </h4>
                  {research.premise.map((p, i) => (
                    <p key={i} className={i === 0 ? 'evo-w40-dropcap mb-1.5' : 'mb-1.5'}>
                      {p}
                    </p>
                  ))}
                </div>

                <div className="pt-1">
                  <h4 className="evo-hxc-section-title">
                    <span className="text-[#00D2FF]">02</span> MECANISMOS REALES EN WINDOWS
                  </h4>
                  {research.mechanisms.map((p, i) => (
                    <p key={i} className="mb-1.5">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 flex flex-col justify-between">
                <div className="evo-hxc-traps">
                  <h4 className="flex items-center gap-1.5 font-mono-tech text-[9.5px] font-black text-amber-300 uppercase tracking-wide mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    03 // FALSAS PISTAS Y MITOS COMUNES
                  </h4>
                  {research.traps.map((p, i) => (
                    <p key={i} className="text-[10px] text-[#F3E8D2] leading-relaxed mb-1">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="evo-hxc-card">
                  <span className="block font-mono-tech text-[8.5px] font-black text-[#60CDFF] uppercase tracking-wider mb-0.5">
                    FÓRMULA PERICIAL DE ESTE EXPEDIENTE
                  </span>
                  <p className="text-[10.5px] font-bold text-white leading-snug">
                    {research.insight}
                  </p>
                </div>

                <div className="rounded-lg border border-[#00D2FF]/30 bg-[#04162a] p-2 text-[9.5px] font-mono-tech text-[#A9DCFA]">
                  <span className="font-bold text-[#60CDFF] block mb-0.5">DESAFÍO PARA EL LECTOR:</span>
                  <p>{research.challenge}</p>
                </div>
              </div>
            </div>

            <div className="evo-w40-next">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-[#00D2FF]" />
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-[#60CDFF]">
                    CONTINÚA EN LA SIGUIENTE PÁGINA (PÁG. {pad(number + 1)})
                  </span>
                  <strong>PROTOCOLO EXPERIMENTAL & LABORATORIO POWERSHELL</strong>
                </div>
              </div>
              <span className="rounded bg-[#02182c] px-2 py-0.5 font-mono-tech text-[8.5px] text-[#A6E8FF] border border-[#00D2FF]/30">
                PÁGINA 1 DE 2
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="evo-hxc-section-title">
                <span className="text-[#00D2FF]">04</span> EL EXPERIMENTO REPRODUCIBLE
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[10px] leading-relaxed text-[#DCEEFA] font-sans-editorial">
                {research.protocol.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <section className="evo-w40-lab">
              <div className="evo-w40-lab__top flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 mr-1">
                    <span className="h-2 w-2 rounded-full bg-red-400/90 inline-block" />
                    <span className="h-2 w-2 rounded-full bg-amber-400/90 inline-block" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400/90 inline-block" />
                  </div>
                  <span className="evo-w40-lab__label">{research.lab.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(research.lab.code)}
                    className="flex items-center gap-1 rounded bg-[#00529B] hover:bg-[#0078D4] px-2.5 py-0.5 font-mono-tech text-[9px] font-black text-white transition-all shadow-[0_0_10px_rgba(0,120,212,0.4)]"
                    title="Copiar script PowerShell al portapapeles"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? '¡COPIADO!' : 'COPIAR SCRIPT'}</span>
                  </button>
                  <span className="evo-w40-lab__readonly">CONSULTA · SOLO LECTURA</span>
                </div>
              </div>
              <div className="px-3 pt-1.5 pb-0.5 text-[9.5px] font-mono-tech text-[#8DE8FF] flex items-center gap-1.5 bg-[#020b18] border-b border-[#00D2FF]/20">
                <Info className="h-3 w-3 text-[#00D2FF] shrink-0" />
                <span>{research.lab.why}</span>
              </div>
              <pre className="evo-w40-lab__code">
                <code>{research.lab.code}</code>
              </pre>
              <div className="evo-w40-lab__readout flex items-start gap-1.5">
                <Activity className="h-3 w-3 text-cyan-400 shrink-0 mt-0.5" />
                <span>{research.lab.readout}</span>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 text-[10px] leading-relaxed text-[#DCEEFA] font-sans-editorial">
              <div>
                <h4 className="evo-hxc-section-title">
                  <span className="text-[#00D2FF]">05</span> CÓMO INTERPRETAR RESULTADOS
                </h4>
                {research.interpretation.map((p, i) => (
                  <p key={i} className="mb-1">{p}</p>
                ))}
              </div>

              <div>
                <h4 className="evo-hxc-section-title">
                  <span className="text-[#00D2FF]">06</span> EL VEREDICTO TÉCNICO
                </h4>
                {research.conclusion.map((p, i) => (
                  <p key={i} className="mb-1">{p}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#00D2FF]/25">
              <div className="rounded-lg border border-[#00D2FF]/30 bg-[#04172c] p-2">
                <span className="text-[8.5px] font-mono-tech font-bold text-[#60CDFF] block mb-0.5 uppercase">
                  VEREDICTO FINAL DE LABORATORIO
                </span>
                <p className="text-[10px] text-white font-medium">
                  {research.conclusion[research.conclusion.length - 1]}
                </p>
              </div>

              <div className="rounded-lg border border-[#00D2FF]/30 bg-[#031326] p-2">
                <span className="text-[8.5px] font-mono-tech font-bold text-[#60CDFF] block mb-0.5 uppercase">
                  FUENTES OFICIALES DE AUDITORÍA
                </span>
                <div className="space-y-0.5">
                  {research.sources.map((s) => (
                    <div key={s.url} className="text-[9px] font-mono-tech text-[#CFE4F5] truncate flex items-center gap-1">
                      <span className="text-[#00D2FF]">▪</span>
                      <span className="font-bold text-white">{s.name}:</span>
                      <span className="text-[#7AC9ED] truncate">{s.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="evo-w40-footnote">
              <span className="font-bold text-[#60CDFF]">[HXC-REF-{pad(research.number)}]</span> Fuentes técnicas verificadas con documentación oficial de Microsoft Learn y Sysinternals · NO LO CREAS. COMPROBALO.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
};

/**
 * Pliego A4 tipo revista Hack x Crack para las Investigaciones 041 a 050.
 * Conectadas directamente en la secuencia continua del Magazine.
 */
const HackXCrackExtraLabPage: React.FC<{
  lab: EvoWindowsFieldLab;
  part: 0 | 1;
}> = ({ lab, part }) => {
  const [copied, setCopied] = React.useState(false);
  const number = 99 + (lab.number - 41) * 2 + part;
  const headline = EVO_WINDOWS_50_HEADLINES[lab.number - 1];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Page
      number={number}
      title={`EXPEDIENTE ${pad(lab.number)} · ${part === 0 ? 'INVESTIGACIÓN TÉCNICA' : 'LABORATORIO & VEREDICTO'}`}
    >
      <div className="flex h-full flex-col justify-between space-y-2.5">
        <div className="border-b border-[#00D2FF]/40 pb-2">
          <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#60CDFF] tracking-wider uppercase font-black">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]" />
              EXPEDIENTE {pad(lab.number)} // BLOQUE VI · LOS 10 SECRETOS
            </span>
            <span className="rounded bg-[#041d38] px-2 py-0.5 border border-[#00D2FF]/30 text-[#8DE8FF]">
              {part === 0 ? 'PLIEGO I / APERTURA & ANÁLISIS' : 'PLIEGO II / LABORATORIO & VEREDICTO'}
            </span>
          </div>
          <h2 className="mt-1 font-display text-[21px] font-black uppercase text-white tracking-tight leading-tight">
            {headline}
          </h2>
          <p className="mt-0.5 text-[10px] text-[#A6D8F8] font-mono-tech">
            {part === 0
              ? 'Análisis pericial del subsistema: premisa, arquitectura, fallos típicos y clave técnica.'
              : 'Verificación empírica con script reproducible, diagnóstico pericial y fuentes oficiales.'}
          </p>
        </div>

        {part === 0 ? (
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-3.5 text-[10.5px] leading-relaxed text-[#E1EEF7] font-sans-editorial">
              <div className="space-y-2">
                <div>
                  <h4 className="evo-hxc-section-title">
                    <span className="text-[#00D2FF]">01</span> EL HALLAZGO TÉCNICO // PUNTO DE PARTIDA
                  </h4>
                  <p className="evo-w40-dropcap mb-1.5">{lab.discovery}</p>
                  <div className="text-[10px] text-[#C0E1F5] font-mono-tech bg-[#031326] p-2 rounded-lg border border-[#00D2FF]/20 mt-2">
                    <span className="text-[#60CDFF] font-bold block mb-0.5">PREPARACIÓN DEL SISTEMA:</span>
                    <p>{lab.preparation}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h4 className="evo-hxc-section-title">
                    <span className="text-[#00D2FF]">02</span> MECANISMOS REALES EN WINDOWS
                  </h4>
                  <p className="mb-1.5">{lab.mechanism}</p>
                </div>
                <div className="evo-hxc-traps">
                  <h4 className="flex items-center gap-1.5 font-mono-tech text-[9.5px] font-black text-amber-300 uppercase tracking-wide mb-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    03 // FALSAS PISTAS Y PRECAUCIONES
                  </h4>
                  <p className="text-[10px] text-[#F3E8D2] leading-relaxed">{lab.pitfall}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="evo-hxc-card">
                <span className="block font-mono-tech text-[8.5px] font-black text-[#60CDFF] uppercase tracking-wider mb-0.5">
                  FÓRMULA PERICIAL DE ESTE EXPEDIENTE
                </span>
                <p className="text-[10.5px] font-bold text-white leading-snug">{lab.action}</p>
              </div>

              <div className="rounded-lg border border-[#00D2FF]/30 bg-[#04162a] p-2 text-[9.5px] font-mono-tech text-[#A9DCFA]">
                <span className="font-bold text-[#60CDFF] block mb-0.5">DESAFÍO PARA EL LECTOR:</span>
                <p>{lab.challenge}</p>
              </div>
            </div>

            <div className="evo-w40-next">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-[#00D2FF]" />
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-[#60CDFF]">
                    CONTINÚA EN LA SIGUIENTE PÁGINA (PÁG. {pad(number + 1)})
                  </span>
                  <strong>PROTOCOLO EXPERIMENTAL & SCRIPT POWERSHELL</strong>
                </div>
              </div>
              <span className="rounded bg-[#02182c] px-2 py-0.5 font-mono-tech text-[8.5px] text-[#A6E8FF] border border-[#00D2FF]/30">
                PÁGINA 1 DE 2
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="evo-hxc-section-title">
                <span className="text-[#00D2FF]">04</span> EL EXPERIMENTO REPRODUCIBLE
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[9.5px] leading-relaxed text-[#DCEEFA] font-sans-editorial">
                {lab.experiment.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 bg-[#031326] p-1.5 rounded-lg border border-[#00D2FF]/15">
                    <span className="font-mono-tech font-bold text-[#60CDFF] text-[9px] shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <section className="evo-w40-lab">
              <div className="evo-w40-lab__top flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 mr-1">
                    <span className="h-2 w-2 rounded-full bg-red-400/90 inline-block" />
                    <span className="h-2 w-2 rounded-full bg-amber-400/90 inline-block" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400/90 inline-block" />
                  </div>
                  <span className="evo-w40-lab__label">{headline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(lab.command)}
                    className="flex items-center gap-1 rounded bg-[#00529B] hover:bg-[#0078D4] px-2.5 py-0.5 font-mono-tech text-[9px] font-black text-white transition-all shadow-[0_0_10px_rgba(0,120,212,0.4)]"
                    title="Copiar comando al portapapeles"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? '¡COPIADO!' : 'COPIAR COMANDO'}</span>
                  </button>
                  <span className="evo-w40-lab__readonly">CONSULTA · SOLO LECTURA</span>
                </div>
              </div>
              <pre className="evo-w40-lab__code">
                <code>{lab.command}</code>
              </pre>
              <div className="evo-w40-lab__readout flex items-start gap-1.5">
                <Activity className="h-3 w-3 text-cyan-400 shrink-0 mt-0.5" />
                <span>{lab.evidence}</span>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 text-[10px] leading-relaxed text-[#DCEEFA] font-sans-editorial">
              <div>
                <h4 className="evo-hxc-section-title">
                  <span className="text-[#00D2FF]">05</span> CÓMO COMPROBAR LA EVIDENCIA
                </h4>
                <p className="mb-1">{lab.evidence}</p>
              </div>
              <div>
                <h4 className="evo-hxc-section-title">
                  <span className="text-[#00D2FF]">06</span> VEREDICTO Y PLAN DE ACCIÓN
                </h4>
                <p className="mb-1">{lab.action}</p>
                <div className="text-[9px] text-[#A6E8FF] font-mono-tech mt-1 bg-[#021325] p-1.5 rounded border border-[#00D2FF]/20">
                  <span className="font-bold text-[#60CDFF]">REVERSIÓN: </span>{lab.recovery}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#00D2FF]/25">
              <div className="rounded-lg border border-[#00D2FF]/30 bg-[#04172c] p-2">
                <span className="text-[8.5px] font-mono-tech font-bold text-[#60CDFF] block mb-0.5 uppercase">
                  VEREDICTO FINAL DE LABORATORIO
                </span>
                <p className="text-[10px] text-white font-medium">{lab.action}</p>
              </div>

              <div className="rounded-lg border border-[#00D2FF]/30 bg-[#031326] p-2">
                <span className="text-[8.5px] font-mono-tech font-bold text-[#60CDFF] block mb-0.5 uppercase">
                  FUENTES OFICIALES DE AUDITORÍA
                </span>
                <div className="space-y-0.5">
                  {lab.references.map((s) => (
                    <div key={s.url} className="text-[9px] font-mono-tech text-[#CFE4F5] truncate flex items-center gap-1">
                      <span className="text-[#00D2FF]">▪</span>
                      <span className="font-bold text-white">{s.name}:</span>
                      <span className="text-[#7AC9ED] truncate">{s.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="evo-w40-footnote">
              <span className="font-bold text-[#60CDFF]">[HXC-REF-{pad(lab.number)}]</span> Fuentes técnicas verificadas con documentación oficial de Microsoft Learn · NO LO CREAS. COMPROBALO.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
};

export const Tomo02Magazine40: React.FC<Props> = ({ onBack, onOpenBiblia }) => {
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [selectedDossierJump, setSelectedDossierJump] = React.useState('1');

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const pct = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, pct)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (n: number) => {
    document.getElementById(pageId(n))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleJumpDossier = (dossierNumber: number) => {
    setSelectedDossierJump(String(dossierNumber));
    const target = targetPageForDossier(dossierNumber);
    goTo(target);
  };

  const printPdf = () => {
    window.print();
  };

  return (
    <div id="evo-magazine40-root" className="evo-magazine40 min-h-screen pb-16">
      {/* Barra de progreso de lectura pericial superior */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0059C8] via-[#00D2FF] to-[#60CDFF] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* TOOLBAR SUPERIOR FIJA // NAVEGACIÓN Y EXPORTACIÓN */}
      <nav
        id="evo-magazine40-toolbar"
        className="sticky top-0 z-40 mb-6 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-3"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-[#60CDFF]/40 px-3 py-1.5 font-mono-tech text-xs font-bold text-white hover:bg-[#073863]"
          >
            <ArrowLeft className="h-4 w-4 text-[#00D2FF]" /> TOMO 02
          </button>
          <div className="hidden md:flex items-center gap-2">
            <span className="font-mono-tech text-xs font-black tracking-wider text-white">
              MAGAZINE A4 · 50 INVESTIGACIONES FORENSES
            </span>
            <span className="rounded bg-[#02182c] px-2 py-0.5 font-mono-tech text-[10px] font-bold text-[#60CDFF] border border-[#00D2FF]/30">
              UN SOLO PDF CONTINUO · TIPO HACK X CRACK
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botones de navegación de pliegos */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goTo(1)}
              className="rounded-lg border border-[#60CDFF]/30 px-2.5 py-1.5 font-mono-tech text-xs font-bold text-[#E5F3FD] hover:bg-[#103453]"
              title="Ir a Portada"
            >
              PORTADA
            </button>
            <button
              type="button"
              onClick={() => goTo(3)}
              className="rounded-lg border border-[#60CDFF]/30 px-2.5 py-1.5 font-mono-tech text-xs font-bold text-[#E5F3FD] hover:bg-[#103453]"
              title="Ir a Índice de las 50 investigaciones"
            >
              ÍNDICE
            </button>
          </div>

          {/* Selector de salto directo a cualquiera de los 50 expedientes */}
          <div className="flex items-center gap-1 bg-[#051c36] rounded-lg border border-[#60CDFF]/40 px-2 py-1">
            <span className="text-[10px] font-mono-tech font-bold text-[#8CE8FF] hidden sm:inline">
              EXP:
            </span>
            <select
              value={selectedDossierJump}
              onChange={(e) => handleJumpDossier(Number(e.target.value))}
              className="bg-transparent text-[#EDF7FC] font-mono-tech text-xs font-bold outline-none cursor-pointer max-w-[210px] truncate"
            >
              {EVO_WINDOWS_50_HEADLINES.map((title, i) => {
                const num = i + 1;
                return (
                  <option key={num} value={num} className="bg-[#031528] text-white">
                    {pad(num)} · {title.slice(0, 36)}...
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenBiblia}
            className="rounded-lg border border-[#60CDFF]/45 px-3 py-1.5 font-mono-tech text-xs font-bold text-[#9DDDFF] hover:bg-[#103453]"
          >
            BIBLIA VIRTUAL
          </button>
          <button
            type="button"
            onClick={printPdf}
            className="flex items-center gap-1.5 rounded-lg border border-[#80E3FF] bg-gradient-to-r from-[#0068BD] to-[#00A4EF] px-3.5 py-1.5 font-mono-tech text-xs font-black text-white shadow-[0_0_18px_rgba(0,164,239,0.25)] hover:to-[#60CDFF]"
          >
            <Printer className="h-4 w-4" /> GUARDAR AVANCE PDF A4
          </button>
        </div>
      </nav>

      <p className="mx-auto mb-5 max-w-[820px] px-4 text-center text-xs text-[#B6D6E9]">
        <strong>Edición completa tipo revista Hack x Crack:</strong> 50 investigaciones forenses integradas en un solo PDF continuo con índice unificado y todos los manuscritos en secuencia. Expediente 001 desarrollado en profundidad; manuscritos 002 a 050 incorporados con sus secciones y laboratorios. Las otras 39 no se muestran como terminadas.
      </p>

      {/* DOCUMENTO UNIFICADO DE LA REVISTA (119 PÁGINAS A4) */}
      <div id="evo-magazine40-document" className="mx-auto max-w-[820px]">
        {/* PÁGINA 1: PORTADA */}
        <Page number={1} title="PORTADA" cover>
          <div className="relative flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#010309]">
            <img
              src={TOMO_02_COVER}
              alt="Portada oficial de EVO LABS — Tomo 02: La Biblia Negra de Windows"
              className="block h-full w-full object-contain"
              decoding="async"
            />
          </div>
        </Page>

        {/* PÁGINA 2: CARTA EDITORIAL */}
        <Page number={2} title="CARTA EDITORIAL">
          <div className="flex h-full flex-col justify-between space-y-3">
            <div className="border-b border-[#00D2FF]/40 pb-2">
              <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#60CDFF] tracking-[0.2em] uppercase font-black">
                <span>MANIFIESTO EDITORIAL · EVO LABS</span>
                <span className="rounded bg-[#062544] px-2 py-0.5 border border-[#00D2FF]/30 text-[#8CE8FF]">
                  INGENIERÍA & KERNEL NT
                </span>
              </div>
              <h2 className="mt-1 font-display text-[30px] font-black uppercase leading-tight text-white tracking-tight">
                UNA PROMESA:<br />
                <span className="text-[#00D2FF] drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
                  MOSTRAR LAS PRUEBAS
                </span>
              </h2>
            </div>

            <Tomo02WindowsEditorialArt
              kind="night"
              variant="wide"
              caption="WINDOWS EN SEGUNDO PLANO · SERVICIOS, PROCESOS Y TAREAS"
            />

            <div className="grid grid-cols-2 gap-4 font-sans-editorial text-[11px] leading-relaxed text-[#E2ECF4]">
              <div className="space-y-2">
                <p className="evo-w40-dropcap">
                  El título tiene que despertar curiosidad; el capítulo debe entregar todavía más. Una
                  revista tecnológica que promete descubrir el interior de Windows no puede
                  limitarse a tres comandos y una conclusión apresurada.
                </p>
                <p>
                  Por eso cada investigación se desarrolla como un expediente: un misterio inicial,
                  teoría rigurosa explicada desde cero, arquitectura real, un experimento repetible,
                  criterios para interpretar resultados y fuentes contrastables.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  No vamos a fabricar telemetría, inventar porcentajes de optimización ni sugerir
                  cambios destructivos para que un gráfico parezca espectacular. Un resultado que
                  contradice la hipótesis también es un descubrimiento.
                </p>
                <p>
                  La Biblia Virtual de sectores 00–39 acompaña este recorrido con el estudio
                  sistemático. El magazine enciende la curiosidad; la Biblia transforma esa
                  curiosidad en conocimiento técnico.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-0.5">
              {[
                { step: '01', title: 'OBSERVAR', desc: 'Identificar sin sesgos' },
                { step: '02', title: 'MEDIR', desc: 'Deltas y ventanas' },
                { step: '03', title: 'COMPARAR', desc: 'Escenarios A / B' },
                { step: '04', title: 'CONCLUIR', desc: 'Solo con evidencia' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-[#00D2FF]/35 bg-gradient-to-b from-[#0b3154] to-[#041527] p-2 text-center font-mono-tech shadow-md transition-all hover:border-[#60CDFF]"
                >
                  <span className="block font-display text-base font-black text-[#60CDFF] drop-shadow-[0_0_6px_rgba(0,210,255,0.4)]">
                    {item.step}
                  </span>
                  <span className="block text-[9.5px] font-black text-white">{item.title}</span>
                  <span className="text-[8px] text-[#A2D7F3] block mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#00D2FF]/40 border-l-4 border-l-[#00D2FF] bg-gradient-to-r from-[#072540] via-[#051c33] to-[#031120] p-3 font-mono-tech text-[10.5px] font-bold text-white shadow-sm flex items-center justify-between">
              <span>EL CRITERIO DE PUBLICACIÓN ES LA PROFUNDIDAD, NO EL NÚMERO DE FICHAS.</span>
              <span className="text-[8.5px] text-[#86D4F9] uppercase tracking-wider hidden sm:inline">
                CONSEJO EDITORIAL EVO LABS
              </span>
            </div>
          </div>
        </Page>

        {/* PÁGINAS 3 Y 4: ÍNDICE CANÓNICO UNIFICADO (50 INVESTIGACIONES EN 6 BLOQUES) */}
        {[0, 1].map((part) => {
          const blocks = part === 0 ? EVO_WINDOWS_50_BLOCKS.slice(0, 3) : EVO_WINDOWS_50_BLOCKS.slice(3, 6);
          return (
            <Page
              key={part}
              number={3 + part}
              title={`ÍNDICE CANÓNICO · 50 INVESTIGACIONES (${part + 1}/2)`}
            >
              <div className="flex h-full flex-col justify-between space-y-2.5">
                <div className="border-b border-[#00D2FF]/35 pb-2">
                  <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#60CDFF] font-black tracking-widest uppercase">
                    <span>EVO LABS · 50 TÍTULOS EDITORIALES MAESTROS</span>
                    <span className="rounded bg-[#041d38] px-2 py-0.5 border border-[#00D2FF]/30 text-[#8CE8FF]">
                      ÍNDICE CANÓNICO UNIFICADO {part + 1} / 2
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-[26px] font-black uppercase text-white tracking-tight">
                    MAPA DE INVESTIGACIONES <span className="text-[#00D2FF]">{part + 1}/2</span>
                  </h2>
                  <p className="mt-0.5 text-[10.5px] text-[#BEE2F7]">
                    Índice editorial integral: tocá cualquier expediente para desplazarte directamente a su pliego correspondiente dentro de este mismo documento PDF.
                  </p>
                </div>

                <div className="space-y-2.5 flex-1 flex flex-col justify-around">
                  {blocks.map((b) => {
                    const startNum = b.range[0];
                    const endNum = b.range[1];
                    const items = Array.from({ length: endNum - startNum + 1 }, (_, i) => {
                      const num = startNum + i;
                      return {
                        number: num,
                        title: EVO_WINDOWS_50_HEADLINES[num - 1],
                        targetPage: targetPageForDossier(num),
                      };
                    });

                    return (
                      <section
                        key={b.number}
                        className="overflow-hidden rounded-xl border border-[#0078D4]/45 bg-[#051426] shadow-md"
                      >
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#023b72] via-[#054b86] to-[#042445] px-3.5 py-1.5 border-b border-[#00D2FF]/30">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#00D2FF]/20 text-[10px] font-mono-tech font-black text-[#8DE9FF] border border-[#00D2FF]/40">
                              {b.number}
                            </span>
                            <div>
                              <h3 className="font-display text-[13px] font-black tracking-wide text-white">
                                BLOQUE {b.number} · {b.title}
                              </h3>
                              <p className="text-[9.5px] text-[#C2E8FF]">
                                Expedientes {pad(startNum)} al {pad(endNum)}
                              </p>
                            </div>
                          </div>
                          <span className="rounded-md bg-[#011429] border border-[#60CDFF]/30 px-2 py-0.5 font-mono-tech text-[9px] font-bold text-[#8DE8FF]">
                            {items.length < 10 ? `0${items.length}` : items.length} EXPEDIENTES
                          </span>
                        </div>
                        <div className="divide-y divide-[#60CDFF]/15">
                          {items.map((a) => (
                            <div
                              key={a.number}
                              onClick={() => goTo(a.targetPage)}
                              className="group flex items-center gap-3 px-3.5 py-[5px] hover:bg-[#0c2f52] cursor-pointer transition-colors"
                              title={`Ir a la investigación ${pad(a.number)} en la página ${pad(a.targetPage)}`}
                            >
                              <span className="shrink-0 font-mono-tech text-[10px] font-black text-[#60CDFF] group-hover:text-white transition-colors">
                                {pad(a.number)}
                              </span>
                              <span className="flex-1 text-[11px] font-semibold leading-tight text-[#E8F4FC] group-hover:text-[#A6E8FF] transition-colors truncate">
                                {a.title}
                              </span>
                              <span className="shrink-0 font-mono-tech text-[9px] text-[#60CDFF] mr-2">
                                PÁG. {pad(a.targetPage)}
                              </span>
                              <span className="shrink-0 rounded-md border px-2 py-0.5 font-mono-tech text-[8px] font-black tracking-wide transition-all border-emerald-400/70 bg-emerald-950/80 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                                ● DESARROLLADO
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>

                {part === 1 && (
                  <div className="rounded-xl border border-[#60CDFF]/45 bg-gradient-to-r from-[#08304f] to-[#041a2e] p-2.5 text-[10.5px] leading-relaxed text-white shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D2FF] shrink-0 shadow-[0_0_6px_#00D2FF]" />
                    <p>
                      <strong>TODO EL MAGAZINE EN UN SOLO PDF:</strong> Los 50 expedientes se desarrollan de manera consecutiva en este documento (119 páginas continuas tipo revista Hack x Crack).
                    </p>
                  </div>
                )}
              </div>
            </Page>
          );
        })}

        {/* PÁGINAS 5 A 20: 8 SECCIONES DE INVESTIGACIÓN 001 EN 16 PÁGINAS A4 */}
        {EVO_WINDOWS40_001.flatMap((data, i) => [
          <ChapterPage key={i + '-opener'} data={data} index={i} part={0} />,
          <ChapterPage key={i + '-continuation'} data={data} index={i} part={1} />,
        ])}

        {/* PÁGINAS 21 A 98: INVESTIGACIONES 002 A 040 (39 EXPEDIENTES TIPO HACK X CRACK, 78 PÁGINAS A4) */}
        {EVO_WINDOWS40_RESEARCH.flatMap((research) => [
          <HackXCrackDossierPage key={research.number + '-part1'} research={research} part={0} />,
          <HackXCrackDossierPage key={research.number + '-part2'} research={research} part={1} />,
        ])}

        {/* PÁGINAS 99 A 118: INVESTIGACIONES 041 A 050 (10 EXPEDIENTES TIPO HACK X CRACK, 20 PÁGINAS A4) */}
        {EVO_W50_LABS_E.flatMap((lab) => [
          <HackXCrackExtraLabPage key={lab.number + '-part1'} lab={lab} part={0} />,
          <HackXCrackExtraLabPage key={lab.number + '-part2'} lab={lab} part={1} />,
        ])}

        {/* PÁGINA 119: CIERRE EDITORIAL Y CERTIFICACIÓN */}
        <Page number={TOTAL_PAGES} title="CIERRE EDITORIAL" final>
          <div className="flex h-full flex-col justify-between space-y-3">
            <div className="border-b border-[#00D2FF]/40 pb-3">
              <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#60CDFF] tracking-wider uppercase font-black">
                <span>CIERRE DEL VOLUMEN // 50 EXPEDIENTES</span>
                <span className="rounded bg-[#062544] px-2 py-0.5 border border-[#00D2FF]/30 text-[#8CE8FF]">
                  EDICIÓN TÉCNICA INTEGRAL HACK X CRACK
                </span>
              </div>
              <h2 className="mt-1.5 font-display text-[34px] font-black uppercase leading-tight text-white tracking-tight">
                EL CONOCIMIENTO ES LIBRE.<br />
                <span className="text-[#00D2FF] drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
                  LAS PRUEBAS LO DEMUESTRAN.
                </span>
              </h2>
            </div>

            <Tomo02WindowsEditorialArt
              kind="security"
              variant="wide"
              caption="CERTIFICACIÓN EDITORIAL · METROLOGÍA FORENSE DE WINDOWS"
            />

            <div className="rounded-2xl border border-[#00D2FF]/40 bg-gradient-to-br from-[#0a2f52] to-[#04172c] p-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#00D2FF] text-[9.5px] font-mono-tech font-bold uppercase mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] inline-block shadow-[0_0_6px_#00D2FF]" />
                REGISTRO CANÓNICO TOMO 02 // LA BIBLIA NEGRA DE WINDOWS
              </div>
              <h3 className="font-display text-lg font-black text-white">
                50 EXPEDIENTES FORENSES · DEL 001 AL 050
              </h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#D9ECF9]">
                Cada investigación de este magazine fue concebida para desarmar mitos populares,
                explicar la arquitectura real del Kernel NT y dotar al usuario de comandos reproducibles
                sin comprometer la estabilidad del sistema operativo.
              </p>
              <p className="mt-2 font-mono-tech text-[9px] font-black text-[#60CDFF]">
                METODOLOGÍA: OBSERVAR → MEDIR → EXPERIMENTAR → COMPARAR → CONCLUIR
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-mono-tech text-[10.5px] font-black uppercase tracking-wide text-[#60CDFF]">
                FUENTES Y REFERENCIAS PERICIALES DEL TOMO 02
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {EVO_WINDOWS40_001_REFERENCES.map((r) => (
                  <div
                    key={r.url}
                    className="flex items-center justify-between rounded-lg border border-[#00D2FF]/25 bg-[#031528] px-2.5 py-1 text-[9px] font-mono-tech text-[#CFDFED]"
                  >
                    <span className="font-bold text-white truncate max-w-[200px]">{r.name}</span>
                    <span className="text-[#60CDFF] truncate max-w-[140px] text-[8px]">{r.url}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-[#00D2FF]/35 pt-3 flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-black uppercase tracking-wider text-white">
                  NO LO CREAS. <span className="text-[#00D2FF]">COMPROBALO.</span>
                </p>
                <p className="mt-0.5 text-[10px] text-[#B4D4EB]">
                  Biblia Virtual del Tomo 02: 40 sectores 00–39. El magazine es el complemento editorial que expande cada sector a un caso pericial.
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="block font-mono-tech text-[8px] text-[#6997B6]">
                  CERTIFICACIÓN EDITORIAL
                </span>
                <span className="font-mono-tech text-[9.5px] font-black text-[#8DE9FF]">
                  EVO-LABS-DOC-T02-HXC-50-COMPLETE
                </span>
              </div>
            </div>
          </div>
        </Page>
      </div>

      {/* BOTONERA INFERIOR DE REGRESO Y NAVEGACIÓN */}
      <div className="mx-auto mt-8 flex max-w-[820px] flex-wrap justify-center gap-3 px-4 print:hidden">
        <button
          type="button"
          onClick={() => goTo(1)}
          className="rounded-xl border border-[#00D2FF]/40 px-5 py-2.5 font-mono-tech text-xs font-black text-white hover:bg-[#123D5A] transition-colors"
        >
          ↑ VOLVER A LA PORTADA
        </button>
        <button
          type="button"
          onClick={() => goTo(3)}
          className="flex items-center gap-2 rounded-xl border border-[#00D2FF]/40 px-5 py-2.5 font-mono-tech text-xs font-black text-white hover:bg-[#123D5A] transition-colors"
        >
          VER ÍNDICE CANÓNICO <BookOpen className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={printPdf}
          className="flex items-center gap-2 rounded-xl border border-[#8EEFFF] bg-gradient-to-r from-[#0068BD] to-[#00A4EF] px-5 py-2.5 font-mono-tech text-xs font-black text-white hover:to-[#60CDFF] transition-all shadow-[0_0_18px_rgba(0,164,239,0.3)]"
        >
          GUARDAR REVISTA COMPLETA PDF A4 <Printer className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
