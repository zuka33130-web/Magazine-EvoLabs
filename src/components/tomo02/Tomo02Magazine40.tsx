import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileText, Printer, ShieldCheck } from 'lucide-react';
import { Tomo02MasterPage } from './Tomo02MasterPage';
import { EVO_WINDOWS_40_ARTICLES, EVO_WINDOWS_40_SECTIONS } from '../../data/tomo02Magazine40';
import { EVO_WINDOWS40_001, EVO_WINDOWS40_001_REFERENCES, type Windows40Page } from '../../data/tomo02Magazine40Chapter001';
import kernelImage from '../../assets/images/cap_05_kernel_1789531884339.jpg';
import workbenchImage from '../../assets/images/cap_06_workshop_1789531894578.jpg';
import siliconImage from '../../assets/images/cap_01_silicon_1789531835511.jpg';
import { TOMO_02_COVER } from '../../data/tomoCoversData';

const TOTAL_PAGES = 5 + EVO_WINDOWS40_001.length; // 1 portada + 1 editorial + 2 sumarios + 8 investigación + 1 cierre
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

const ChapterPage: React.FC<{ data: Windows40Page; index: number }> = ({ data, index }) => {
  const first = index === 0;
  return (
    <Page number={index + 5} title="INVESTIGACIÓN 001 · WINDOWS INVISIBLE">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 shrink-0 border-b border-[#00D2FF]/30 pb-2">
          <div className="flex items-center justify-between gap-2 font-mono-tech text-[10px] font-bold tracking-widest text-[#60CDFF]">
            <span>{data.eyebrow}</span>
            <span>{index + 1} / {EVO_WINDOWS40_001.length}</span>
          </div>
          <h2 className="mt-1 font-display text-[25px] font-black uppercase leading-[1.03] tracking-tight text-white">{data.title}</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-[#C9E9F8]">{data.subtitle}</p>
        </div>

        {first && (
          <figure className="relative mb-3 h-[152px] shrink-0 overflow-hidden rounded-xl border border-[#00D2FF]/40">
            <img src={kernelImage} alt="Ilustración editorial conceptual de la arquitectura de Windows y sus procesos" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030A17]/85 via-[#030A17]/30 to-transparent" />
            <figcaption className="absolute bottom-3 left-4 max-w-[70%] font-mono-tech text-[10px] font-bold uppercase tracking-widest text-white">
              DETRÁS DEL ESCRITORIO · KERNEL / SERVICIOS / TAREAS
            </figcaption>
          </figure>
        )}

        <div className="space-y-2 font-sans-editorial text-[11.5px] leading-[1.44] text-[#E1EAF1]">
          {data.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
        </div>

        {data.visual && !first && <Diagram mode={data.visual} />}

        {data.laboratory && (
          <section className="mt-2 shrink-0 overflow-hidden rounded-xl border border-[#1182C6]/50 bg-[#050F1B]">
            <div className="border-b border-[#1179BC]/45 bg-gradient-to-r from-[#064374] to-[#0B2038] px-3 py-2">
              <h3 className="font-mono-tech text-[10px] font-black uppercase tracking-widest text-white">{data.laboratory.title}</h3>
              <p className="mt-1 text-[10px] leading-snug text-[#BFDFF2]">{data.laboratory.why}</p>
            </div>
            <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-words px-3 py-2 font-mono text-[9.3px] leading-[1.38] text-[#8BE6FF]">{data.laboratory.code}</pre>
            <p className="border-t border-[#1179BC]/30 px-3 py-2 text-[10px] leading-snug text-[#BBD6E8]">{data.laboratory.readout}</p>
          </section>
        )}

        <div className="mt-auto shrink-0 space-y-2 pt-3">
          <aside className="rounded-xl border-l-[3px] border-[#00D2FF] bg-[#0B304A] px-3 py-2.5">
            <div className="mb-1 font-mono-tech text-[10px] font-black uppercase tracking-widest text-[#6BDFFF]">{data.focus.label}</div>
            <p className="font-sans-editorial text-[11px] leading-[1.37] text-white">{data.focus.text}</p>
          </aside>
          <p className="font-mono-tech text-[9px] leading-[1.3] text-[#AEC4D4]">{data.footnote}</p>
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
          <div className="relative flex h-full flex-col overflow-hidden bg-[#020713]">
            <img src={TOMO_02_COVER} alt="Portada oficial de La Biblia Negra de Windows, volumen 02" className="absolute inset-0 h-full w-full object-cover opacity-[0.34]" />
            <img src={kernelImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030811]/75 via-[#031329]/50 to-[#02040A]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div>
                <div className="flex items-center justify-between border-b border-[#00D2FF]/45 pb-4 font-mono-tech text-xs font-black uppercase tracking-[0.22em] text-[#9DDDFF]"><span>EVO <span className="text-white">LABS</span></span><span>TOMO 02 · WINDOWS</span></div>
                <p className="mt-12 font-mono-tech text-[12px] font-bold tracking-[0.3em] text-[#55DFFF]">MAGAZINE ESTRELLA / EDICIÓN A4</p>
                <h1 className="mt-4 font-display text-[59px] font-black uppercase leading-[0.91] tracking-tighter text-white">LA BIBLIA<br/>NEGRA <span className="text-[#60CDFF]">DE<br/>WINDOWS</span></h1>
                <div className="mt-7 h-1.5 w-36 bg-gradient-to-r from-[#0078D4] to-[#00D2FF]"/>
                <p className="mt-6 max-w-[490px] font-sans-editorial text-lg font-semibold leading-snug text-white">40 misterios del sistema operativo.<br/>Cero mitos. Evidencia y experimentos.</p>
              </div>
              <div>
                <div className="grid grid-cols-3 gap-2.5">
                  {['KERNEL NT','PRIVACIDAD','RENDIMIENTO'].map(x=><div key={x} className="border border-[#60CDFF]/50 bg-[#092239]/85 p-3 text-center font-mono-tech text-[11px] font-black tracking-wider text-[#BBECFF]">{x}</div>)}
                </div>
                <p className="mt-7 border-t border-[#00D2FF]/45 pt-4 font-mono-tech text-[14px] font-black tracking-[0.18em] text-white">NO LO CREAS. <span className="text-[#60CDFF]">COMPROBALO.</span></p>
                <p className="mt-2 font-mono-tech text-[10px] text-[#C5DBED]">EDICIÓN PRELIMINAR · 1 INVESTIGACIÓN COMPLETA · 39 EN DESARROLLO</p>
              </div>
            </div>
          </div>
        </Page>

        <Page number={2} title="CARTA EDITORIAL">
          <div className="space-y-5">
            <div className="border-b border-[#00D2FF]/35 pb-3">
              <p className="font-mono-tech text-[10px] font-black tracking-[0.2em] text-[#60CDFF]">MANIFIESTO EDITORIAL · EVO LABS</p>
              <h2 className="mt-2 font-display text-[38px] font-black uppercase leading-tight text-white">UNA PROMESA:<br/><span className="text-[#60CDFF]">MOSTRAR LAS PRUEBAS</span></h2>
            </div>
            <figure className="relative h-60 overflow-hidden rounded-xl border border-[#00D2FF]/45">
              <img src={workbenchImage} className="h-full w-full object-cover" alt="Banco técnico de diagnóstico, ilustración editorial" />
              <figcaption className="absolute bottom-3 left-4 rounded bg-[#020A16]/80 px-3 py-2 font-mono-tech text-[10px] font-semibold text-[#D0EDFF]">FIGURA EDITORIAL · INVESTIGACIÓN, MEDICIÓN Y REPRODUCIBILIDAD</figcaption>
            </figure>
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

        {EVO_WINDOWS40_001.map((data, i) => <ChapterPage key={i} data={data} index={i}/>)}

        <Page number={TOTAL_PAGES} title="CIERRE EDITORIAL" final>
          <div className="flex h-full flex-col gap-5">
            <div className="border-b border-[#00D2FF]/35 pb-4">
              <p className="font-mono-tech text-[11px] font-black tracking-wider text-[#60CDFF]">CIERRE · EXPEDIENTE 001</p>
              <h2 className="mt-2 font-display text-[40px] font-black uppercase leading-tight text-white">EL PRÓXIMO<br/><span className="text-[#60CDFF]">MISTERIO TE ESPERA</span></h2>
            </div>
            <figure className="relative h-64 overflow-hidden rounded-xl border border-[#00D2FF]/40">
              <img src={siliconImage} alt="Ilustración técnica editorial de circuito y silicio" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041122] to-transparent" />
              <figcaption className="absolute bottom-4 left-4 font-mono-tech text-[11px] font-black text-white">SIGUIENTE EXPEDIENTE · PROCESOS INVISIBLES</figcaption>
            </figure>
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
