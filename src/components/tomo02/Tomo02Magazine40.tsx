import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileText, Printer, ShieldCheck } from 'lucide-react';
import { Tomo02MasterPage } from './Tomo02MasterPage';
import { EVO_WINDOWS_40_ARTICLES, EVO_WINDOWS_40_SECTIONS } from '../../data/tomo02Magazine40';
import { EVO_WINDOWS40_001, EVO_WINDOWS40_001_REFERENCES, type Windows40Page } from '../../data/tomo02Magazine40Chapter001';
import { Tomo02WindowsEditorialArt, type WindowsArtKind } from './Tomo02WindowsEditorialArt';
import { TOMO_02_COVER } from '../../data/tomoCoversData';


const TOTAL_PAGES = 5 + EVO_WINDOWS40_001.length * 2; // portada + manifiesto + 2 sumarios + 16 páginas del expediente 001 + cierre
const pageId = (page: number) => `evo-w40-page-${String(page).padStart(2, '0')}`;
const pad = (n: number) => String(n).padStart(3, '0');

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

const Diagram: React.FC<{ mode: NonNullable<Windows40Page['visual']> }> = ({mode}) => {
  const model: Record<NonNullable<Windows40Page['visual']>, readonly string[]> = {
    flow: ['EVENTO', 'HILO LISTO', 'PLANIFICADOR NT', 'CPU · E/S', 'ESPERA'],
    cpu: ['MUESTRA 1', 'Δ CPU EN SEGUNDOS', 'MUESTRA 2', '% ESTIMADO'],
    experiment: ['HIPÓTESIS', 'LÍNEA DE BASE', '3 ESCENARIOS', 'CONTRASTE', 'CONCLUSIÓN'],
    network: ['PROCESO', 'PID', 'CONEXIÓN TCP', 'DESTINO', 'CONTEXTO'],
    verdict: ['OBSERVACIÓN', 'CORRELACIÓN', 'ALTERNATIVAS', 'VEREDICTO'],
  };
  return (
    <figure className="my-2 rounded-xl border border-[#00D2FF]/30 bg-[#071A2A] px-3 py-3">
      <div className="mb-2 font-mono-tech text-[9px] font-black uppercase tracking-widest text-[#8DDCFF]">
        ESQUEMA EVO · MODELO CONCEPTUAL · NO ES TELEMETRÍA
      </div>
      <div className="flex flex-wrap items-stretch gap-1">
        {model[mode].map((item, i) => (
          <React.Fragment key={item}>
            {i > 0 && <span aria-hidden="true" className="flex items-center font-black text-[#00D2FF]">→</span>}
            <span className="flex-1 rounded-lg border border-[#60CDFF]/35 bg-gradient-to-b from-[#103253] to-[#06192C] px-2 py-2 text-center font-mono-tech text-[9px] font-bold tracking-wide text-white">{item}</span>
          </React.Fragment>
        ))}
      </div>
    </figure>
  );
};

/**
 * Maquetación real: cada sección del manuscrito se distribuye en DOS páginas A4.
 * Primera página: apertura tipográfica, imagen exclusiva Windows, texto de contexto.
 * Segunda página: desarrollo restante, esquema técnico, laboratorio y conclusión.
 * Nunca se descarta ni resume un párrafo del manuscrito.
 */
const CHAPTER_ART: readonly WindowsArtKind[] = [
  'night', 'kernel', 'cpu', 'experiment', 'tasks', 'network', 'verdict', 'security'
];

const ChapterPage: React.FC<{data: Windows40Page; index: number; part: 0 | 1}> = ({data,index,part}) => {
  const art = CHAPTER_ART[index];
  const split = data.paragraphs.length >= 5 ? 3 : 2;
  const paras = part === 0 ? data.paragraphs.slice(0,split) : data.paragraphs.slice(split);
  const number = 5 + index * 2 + part;
  const isOpener = part === 0;
  return (
    <Page number={number} title={'INVESTIGACIÓN 001 · '+data.eyebrow.split('/').pop()?.trim()}>
      <div className={'evo-w40-chapter evo-w40-chapter--'+(isOpener?'opening':'continuation')}>
        <header className="evo-w40-chapter__heading">
          <div className="evo-w40-chapter__metadata">
            <span>INVESTIGACIÓN 001 / {data.eyebrow.split('/').pop()?.trim()}</span>
            <span className="evo-w40-chapter__number">{String(index+1).padStart(2,'0')} · {isOpener?'APERTURA':'DESARROLLO'}</span>
          </div>
          <h2>{data.title}</h2>
          <p>{data.subtitle}</p>
        </header>
        {isOpener && <Tomo02WindowsEditorialArt kind={art} variant="hero" />}
        <div className="evo-w40-chapter__columns">
          {paras.map((paragraph,i)=><p key={i} className={isOpener&&i===0?'evo-w40-dropcap':''}>{paragraph}</p>)}
        </div>
        {!isOpener && <Diagram mode={data.visual || art === 'security'?'verdict':'flow'} />}
        {!isOpener && data.laboratory && <section className="evo-w40-lab">
          <div className="evo-w40-lab__top">
            <span className="evo-w40-lab__label">{data.laboratory.title}</span>
            <span className="evo-w40-lab__readonly">CONSULTA · SIN CAMBIOS</span>
          </div>
          <p className="evo-w40-lab__intro">{data.laboratory.why}</p>
          <pre className="evo-w40-lab__code"><code>{data.laboratory.code}</code></pre>
          <p className="evo-w40-lab__readout">{data.laboratory.readout}</p>
        </section>}
        <div className="evo-w40-chapter__closing">
          {isOpener ? <div className="evo-w40-next">
            <span>EN LA SIGUIENTE PÁGINA</span>
            <strong>COMPROBAR ANTES DE CONCLUIR</strong>
            <ArrowRight className="h-5 w-5" />
          </div> : <aside className="evo-w40-focus">
            <strong>{data.focus.label}</strong>
            <p>{data.focus.text}</p>
          </aside>}
          {!isOpener && <p className="evo-w40-footnote">{data.footnote}</p>}
        </div>
      </div>
    </Page>
  );
};

export const Tomo02Magazine40: React.FC<Props> = ({ onBack, onOpenBiblia }) => {
  const goTo = (n: number) => document.getElementById(pageId(n))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const printPdf = () => {
    const currentTitle = document.title;
    document.title = 'EVO_LABS_MAGAZINE_TOMO_02_AVANCE_EDITORIAL_A4';
    window.print();
    document.title = currentTitle;
  };

  return (
    <div id="evo-magazine40-root" className="evo-magazine40 min-h-screen bg-[#04070E] pb-16 font-sans-editorial text-white">
      <style>{`
        .evo-magazine40 .a4-magazine-page { width: min(100%, 820px); max-width: 820px; height: 1160px; min-height: 1160px; max-height: 1160px; }
        .evo-magazine40 [data-page-id] { scroll-margin-top: 85px; }
        .evo-magazine40 .a4-magazine-page { margin-bottom: 24px; }
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body:has(#evo-magazine40-root) * { visibility: hidden !important; }
          #evo-magazine40-document, #evo-magazine40-document * { visibility: visible !important; }
          #evo-magazine40-document { position: absolute !important; left: 0; top: 0; width: 210mm !important; }
          .evo-magazine40 .a4-magazine-page { width: 210mm !important; max-width: 210mm !important; min-width: 210mm !important; height: 297mm !important; min-height: 297mm !important; max-height: 297mm !important; margin: 0 !important; break-after: page !important; page-break-after: always !important; }
          .evo-magazine40 .a4-magazine-page:last-child { break-after: avoid !important; page-break-after: avoid !important; }
          #evo-magazine40-toolbar { display: none !important; }
        }
      `}</style>
      <nav id="evo-magazine40-toolbar" className="sticky top-0 z-50 mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#00D2FF]/30 bg-[#06111F]/95 px-4 py-3 shadow-[0_8px_34px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-lg border border-[#60CDFF]/35 px-3 py-2 font-mono-tech text-xs font-bold text-[#A7E9FF] hover:bg-[#0D3554]">
          <ArrowLeft className="h-4 w-4" /> TOMO 02
        </button>
        <span className="font-mono-tech text-[11px] font-bold tracking-wider text-white">EVO LABS / MAGAZINE A4 · 40 INVESTIGACIONES</span>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => goTo(3)} className="flex items-center gap-2 rounded-lg border border-[#60CDFF]/45 px-3 py-2 font-mono-tech text-xs font-bold text-[#9DDDFF] hover:bg-[#103453]"><BookOpen className="h-4 w-4" /> ÍNDICE</button>
          <button type="button" onClick={onOpenBiblia} className="rounded-lg border border-[#60CDFF]/45 px-3 py-2 font-mono-tech text-xs font-bold text-[#9DDDFF] hover:bg-[#103453]">BIBLIA VIRTUAL</button>
          <button type="button" onClick={printPdf} className="flex items-center gap-2 rounded-lg border border-[#80E3FF] bg-gradient-to-r from-[#0068BD] to-[#00A4EF] px-4 py-2 font-mono-tech text-xs font-black text-white shadow-[0_0_18px_rgba(0,164,239,0.22)] hover:to-[#60CDFF]"><Printer className="h-4 w-4" /> GUARDAR AVANCE PDF A4</button>
        </div>
      </nav>
      <p className="mx-auto mb-5 max-w-[820px] px-4 text-center text-xs text-[#B6D6E9]">
        <strong>Edición en desarrollo:</strong> 40 investigaciones seleccionadas; expediente 001 desarrollado y documentado. Las otras 39 no se muestran como terminadas.
      </p>

      <div id="evo-magazine40-document" className="mx-auto max-w-[820px]">
        <Page number={1} title="PORTADA" cover>
          {/* La misma portada oficial subida a GitHub; no recrear ni recortar la ilustración. */}
          <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-[#010309]">
            <img
              src={TOMO_02_COVER}
              alt="Portada oficial de EVO LABS — Tomo 02: La Biblia Negra de Windows"
              className="block h-full w-full object-contain"
              decoding="async"
            />
          </div>
        </Page>

        <Page number={2} title="CARTA EDITORIAL">
          <div className="space-y-5">
            <div className="border-b border-[#00D2FF]/35 pb-3">
              <p className="font-mono-tech text-[10px] font-black tracking-[0.2em] text-[#60CDFF]">MANIFIESTO EDITORIAL · EVO LABS</p>
              <h2 className="mt-2 font-display text-[38px] font-black uppercase leading-tight text-white">UNA PROMESA:<br/><span className="text-[#60CDFF]">MOSTRAR LAS PRUEBAS</span></h2>
            </div>
            <Tomo02WindowsEditorialArt kind="night" variant="wide" caption="WINDOWS EN SEGUNDO PLANO · SERVICIOS, PROCESOS Y TAREAS" />
            <div className="grid grid-cols-2 gap-5 font-sans-editorial text-[13px] leading-relaxed text-[#E2ECF4]">
              <div className="space-y-3">
                <p>El título tiene que despertar curiosidad; el capítulo debe entregar todavía más. Una revista tecnológica que promete descubrir el interior de Windows no puede limitarse a tres comandos y una conclusión apresurada.</p>
                <p>Por eso cada investigación se desarrolla como un expediente: un misterio inicial, teoría rigurosa explicada desde cero, arquitectura real, un experimento repetible, criterios para interpretar resultados y fuentes contrastables.</p>
              </div>
              <div className="space-y-3">
                <p>No vamos a fabricar telemetría, inventar porcentajes de optimización ni sugerir cambios destructivos para que un gráfico parezca espectacular. Un resultado que contradice la hipótesis también es un descubrimiento.</p>
                <p>La Biblia Virtual de sectores 00–39 acompaña este recorrido con el estudio sistemático. El magazine enciende la curiosidad; la Biblia transforma esa curiosidad en conocimiento técnico.</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['OBSERVAR','MEDIR','COMPARAR','CONCLUIR'].map((label,i)=><div key={label} className="rounded-lg border border-[#00D2FF]/30 bg-[#0A3152] p-3 text-center font-mono-tech text-[10px] font-black text-white"><span className="block text-lg text-[#60CDFF]">0{i+1}</span>{label}</div>)}
            </div>
            <p className="rounded-xl border-l-4 border-[#00D2FF] bg-[#0B2841] p-4 font-mono-tech text-[12px] font-bold text-white">EL CRITERIO DE PUBLICACIÓN ES LA PROFUNDIDAD, NO EL NÚMERO DE FICHAS.</p>
          </div>
        </Page>

        {[0,1].map((part) => {
          const groups = EVO_WINDOWS_40_SECTIONS.slice(part === 0 ? 0 : 2, part === 0 ? 2 : 5);
          return <Page key={part} number={3 + part} title="ÍNDICE CANÓNICO · 40 INVESTIGACIONES">
            <div className="space-y-3">
              <div className="border-b border-[#00D2FF]/30 pb-3">
                <p className="font-mono-tech text-[10px] font-black uppercase tracking-widest text-[#60CDFF]">EVO LABS · 40 TÍTULOS EDITORIALES</p>
                <h2 className="mt-1 font-display text-[32px] font-black uppercase text-white">MAPA DE INVESTIGACIONES <span className="text-[#60CDFF]">{part+1}/2</span></h2>
                <p className="mt-1 text-[11px] text-[#C9DEEC]">Un índice es una promesa editorial, no una certificación de capítulos terminados. La investigación 001 está desarrollada; las restantes están en preparación.</p>
              </div>
              {groups.map((g,gi) => {
                const items=EVO_WINDOWS_40_ARTICLES.slice(g.range[0],g.range[1]);
                return <section key={g.number} className="overflow-hidden rounded-xl border border-[#0078D4]/40 bg-[#08182A]">
                  <div className="flex items-center justify-between bg-gradient-to-r from-[#003D75] via-[#09548C] to-[#082B49] px-3 py-2">
                    <div>
                      <h3 className="font-display text-[15px] font-black tracking-wide text-white">BLOQUE {g.number} · {g.title}</h3>
                      <p className="text-[10px] text-[#C9EAFF]">{g.subtitle}</p>
                    </div>
                    <span className="font-mono-tech text-[11px] font-bold text-[#8DE8FF]">08 TEMAS</span>
                  </div>
                  <div className="divide-y divide-[#60CDFF]/10">
                    {items.map((a) => <div key={a.number} className="flex items-start gap-3 px-3 py-[6px]">
                      <span className="shrink-0 font-mono-tech text-[10px] font-black text-[#60CDFF]">{pad(a.number)}</span>
                      <span className="flex-1 text-[11px] font-semibold leading-tight text-[#EDF6FC]">{a.title}</span>
                      <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono-tech text-[8px] font-black ${a.published?'border-emerald-400/45 text-emerald-300':'border-[#60CDFF]/25 text-[#91AFC6]'}`}>{a.published?'DESARROLLADO':'EN EDICIÓN'}</span>
                    </div>)}
                  </div>
                </section>;
              })}
              {part === 1 && <div className="rounded-xl border border-[#60CDFF]/40 bg-[#0A3453] p-3 text-[11px] leading-relaxed text-white">
                <strong>PRIMERA INVESTIGACIÓN PUBLICADA:</strong> ¿Qué hace tu PC cuando no estás? Comienza en la página 05. Incluye tres laboratorios de solo lectura, protocolo comparativo y referencias técnicas.
              </div>}
            </div>
          </Page>;
        })}

        {EVO_WINDOWS40_001.flatMap((data, i) => [
          <ChapterPage key={i+'-opener'} data={data} index={i} part={0}/>,
          <ChapterPage key={i+'-continuation'} data={data} index={i} part={1}/>
        ])}

        <Page number={TOTAL_PAGES} title="CIERRE EDITORIAL" final>
          <div className="flex h-full flex-col gap-5">
            <div className="border-b border-[#00D2FF]/35 pb-4">
              <p className="font-mono-tech text-[11px] font-black tracking-wider text-[#60CDFF]">CIERRE · EXPEDIENTE 001</p>
              <h2 className="mt-2 font-display text-[40px] font-black uppercase leading-tight text-white">EL PRÓXIMO<br/><span className="text-[#60CDFF]">MISTERIO TE ESPERA</span></h2>
            </div>
            <Tomo02WindowsEditorialArt kind="security" variant="wide" caption="PRÓXIMO EXPEDIENTE · PROCESOS Y PRIVILEGIOS DE WINDOWS" />
            <div className="rounded-2xl border border-[#00D2FF]/40 bg-[#0B2844] p-5">
              <h3 className="font-display text-2xl font-black text-white">002 · TU PC EJECUTA DECENAS DE PROCESOS</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#D9ECF9]">¿Qué está haciendo realmente cada uno? El próximo expediente deberá desmontar errores de interpretación de CPU, RAM, hilos, servicios y procesos de usuario; documentará procedimientos que cualquiera pueda reproducir sin romper Windows.</p>
              <p className="mt-3 font-mono-tech text-[10px] font-bold text-[#60CDFF]">ESTADO EDITORIAL: EN PRODUCCIÓN · NO PUBLICADO COMO INVESTIGACIÓN COMPLETA</p>
            </div>
            <div className="mt-2 space-y-2">
              <h3 className="font-mono-tech text-[12px] font-black uppercase tracking-wide text-[#60CDFF]">FUENTES TÉCNICAS DE ESTA INVESTIGACIÓN</h3>
              {EVO_WINDOWS40_001_REFERENCES.map((r) => <p key={r.url} className="text-[11px] text-[#CFDFED]">• {r.name} — {r.url}</p>)}
            </div>
            <div className="mt-auto border-t border-[#00D2FF]/35 pt-4">
              <p className="font-display text-xl font-black uppercase tracking-wider text-white">NO LO CREAS. <span className="text-[#60CDFF]">COMPROBALO.</span></p>
              <p className="mt-2 text-[11px] text-[#B4D4EB]">Biblia Virtual del Tomo 02: 40 sectores 00–39. El magazine es un complemento editorial, no reemplaza los laboratorios ni la formación.</p>
            </div>
          </div>
        </Page>
      </div>

      <div className="mx-auto mt-8 flex max-w-[820px] flex-wrap justify-center gap-3 px-4 print:hidden">
        <button type="button" onClick={() => goTo(1)} className="rounded-xl border border-[#00D2FF]/40 px-5 py-3 font-mono-tech text-xs font-black text-white hover:bg-[#123D5A]">↑ VOLVER A LA PORTADA</button>
        <button type="button" onClick={() => goTo(5)} className="flex items-center gap-2 rounded-xl border border-[#00D2FF]/40 px-5 py-3 font-mono-tech text-xs font-black text-white hover:bg-[#123D5A]">LEER EXPEDIENTE 001 <ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
};
