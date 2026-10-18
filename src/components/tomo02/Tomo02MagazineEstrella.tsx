import React, { useEffect, useState } from 'react';
import { EVO_MAGAZINE_200_TITLES, EVO_MAGAZINE_GROUPS } from '../../data/tomo02Magazine200';
import { EVO_MAGAZINE_FIRST_BATCH } from '../../data/tomo02MagazineFirstBatch';
import { EVO_MAGAZINE_SECOND_BATCH } from '../../data/tomo02MagazineSecondBatch';
import { EVO_MAGAZINE_THIRD_BATCH } from '../../data/tomo02MagazineThirdBatch';
import { EVO_MAGAZINE_PRIVACY_A } from '../../data/tomo02MagazinePrivacyA';
import { EVO_MAGAZINE_PRIVACY_B } from '../../data/tomo02MagazinePrivacyB';
import { EVO_MAGAZINE_SECURITY_A } from '../../data/tomo02MagazineSecurityA';
import { EVO_MAGAZINE_SECURITY_B } from '../../data/tomo02MagazineSecurityB';
import { EVO_MAGAZINE_WINDOWS_A } from '../../data/tomo02MagazineWindowsA';
import { EVO_MAGAZINE_WINDOWS_B } from '../../data/tomo02MagazineWindowsB';
import { EVO_MAGAZINE_RELATED_SECTORS } from '../../data/tomo02MagazineSectorBridge';
import { TOMO_02_MASTER_SECTORS } from '../../data/tomo02MasterSectors';

type Step = { title: string; why: string; code?: string; expect: string };
type Article = { id: number; goal: string; basics: string; steps: Step[]; tip: string; warning: string; challenge: string };
const ORIGINAL_ARTICLES: Article[] = [
 { id:52, goal:'Investigar qué hace Windows mientras no usás el equipo.',
   basics:'Un proceso es un programa en ejecución. Que aparezca en una lista no lo convierte en espía. CPU acumulada no es lo mismo que porcentaje instantáneo.',
   steps:[
     { title:'Abrí PowerShell sin administrador',why:'Inicio > escribí PowerShell > Abrir. Vamos a consultar, no modificar.',expect:'Aparecerá una ventana con una línea lista para recibir comandos.' },
     { title:'Listá los procesos de mayor CPU acumulada',why:'Get-Process obtiene procesos; Sort-Object los ordena; Select-Object muestra las primeras filas.',code:'Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 Name, Id, CPU',expect:'Nombre, identificador (ID) y segundos de CPU consumidos desde que arrancó cada proceso.' },
     { title:'Consultá la memoria física',why:'CIM permite leer datos que Windows informa del equipo.',code:'Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory',expect:'Dos cifras expresadas en KiB; una instantánea no indica una tendencia.' },
     { title:'Repetí tras unos minutos de reposo',why:'Anotá el momento y los programas abiertos, luego compará resultados.',expect:'Puede haber diferencias normales por cachés, tareas y servicios.' }
   ],
   tip:'Anotá hora, tiempo desde el arranque y programas abiertos. Una comparación sin condiciones equivalentes no demuestra mejora.',
   warning:'No finalices procesos desconocidos; primero investigá su función.',
   challenge:'Elegí tres procesos y explicá su función. ¿Qué información falta para afirmar que uno es sospechoso?' },
 { id:51, goal:'Examinar conexiones reales sin confundir actividad normal con una intrusión.',
   basics:'TCP conecta programas mediante direcciones y puertos. Una conexión saliente no significa que alguien controle tu PC.',
   steps:[
     {title:'Enumerá conexiones establecidas',why:'La consulta es de solo lectura.',code:'Get-NetTCPConnection -State Established | Select-Object -First 20 LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess',expect:'Direcciones, puertos y PID del programa que mantiene la sesión.'},
     {title:'Identificá un proceso',why:'Reemplazá 1234 por un OwningProcess de la salida.',code:'Get-Process -Id 1234 | Select-Object Name, Id, Path',expect:'Nombre y posiblemente ruta. Un error puede significar que el proceso ya finalizó.'},
     {title:'Consultá el servicio de Escritorio remoto',why:'Comprobar si el servicio funciona no demuestra por sí solo una sesión remota.',code:'Get-Service TermService | Select-Object Name, Status, StartType',expect:'Estado y tipo de inicio del servicio.'}
   ],
   tip:'Una dirección desconocida requiere contexto: qué programa la usa, qué destino es y qué actividad produjo.',
   warning:'No difundas direcciones IP, nombres de usuario ni rutas privadas en capturas públicas.',
   challenge:'Abrí tu navegador, repetí la consulta y explicá qué cambió. ¿Alcanza para demostrar espionaje?' },
 { id:54, goal:'Separar telemetría, conexiones y permisos sin hacer suposiciones.',
   basics:'Telemetría es recopilación de medidas de uso y diagnóstico. Microsoft también utiliza conexiones para certificados, actualizaciones, hora, licencias y otros fines.',
   steps:[
     {title:'Consultá DiagTrack',why:'Ver el estado de este servicio es el inicio de una auditoría, no el final.',code:'Get-Service DiagTrack -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType',expect:'Puede aparecer el servicio o ninguna fila según la configuración.'},
     {title:'Revisá Diagnósticos y comentarios',why:'Configuración > Privacidad y seguridad > Diagnósticos y comentarios.',expect:'Anotá las opciones visibles en tu edición de Windows.'},
     {title:'Observá conexiones por proceso',why:'Contar conexiones no demuestra qué contenido transmiten.',code:'Get-NetTCPConnection -State Established | Group-Object OwningProcess | Sort-Object Count -Descending | Select-Object -First 10 Name, Count',expect:'Los PID que mantienen más conexiones en ese instante.'}
   ],
   tip:'Para cada conclusión diferenciá: opción configurada, componente en ejecución y tráfico confirmado.',
   warning:'No desactives servicios de seguridad ni actualizaciones solo para reducir consumo.',
   challenge:'Anotá tres afirmaciones verificables y qué evidencia necesitarías para cada una.' },
 { id:127, goal:'Saber qué puertos TCP escuchan y evaluar su riesgo sin alarmismo.',
   basics:'Escuchar en un puerto significa que un programa acepta conexiones en una dirección. No implica estar accesible desde Internet.',
   steps:[
     {title:'Listá puertos TCP en escucha',why:'No cambia el firewall.',code:'Get-NetTCPConnection -State Listen | Sort-Object LocalPort | Select-Object LocalAddress, LocalPort, OwningProcess',expect:'Puertos, dirección local y PID. 127.0.0.1 es loopback; 0.0.0.0 abarca interfaces IPv4.'},
     {title:'Descubrí a qué programa pertenece',why:'Sustituí 1234 por el PID observado.',code:'Get-Process -Id 1234 | Select-Object Name, Path',expect:'Nombre y, si tenés permisos, ubicación del ejecutable.'},
     {title:'Consultá los perfiles del firewall',why:'El firewall es otra capa que controla exposición.',code:'Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction',expect:'Estado y regla predeterminada de entrada por perfil.'}
   ],
   tip:'Un puerto en 127.0.0.1 no se expone igual que uno que escucha en todas las interfaces.',
   warning:'No abras, cierres o deshabilites puertos sin identificar previamente el servicio.',
   challenge:'Elegí un puerto, buscá su proceso y justificá si podría estar accesible desde otra PC.' },
 { id:102, goal:'Entender cuánta memoria usa Windows sin perseguir porcentajes engañosos.',
   basics:'Windows usa RAM como caché, además de ejecutar aplicaciones. Libre, disponible, en espera y comprometida son métricas diferentes.',
   steps:[
     {title:'Leé memoria total y libre',why:'Estas cifras provienen del sistema operativo y se expresan originalmente en KiB.',code:'$os = Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{ TotalGiB = [math]::Round($os.TotalVisibleMemorySize/1MB,2); LibreGiB = [math]::Round($os.FreePhysicalMemory/1MB,2) }',expect:'Verás valores aproximados en GiB. No tienen por qué coincidir con el porcentaje del Administrador de tareas.'},
     {title:'Comprobá con el Administrador de tareas',why:'Abrí Rendimiento > Memoria y mirá En uso, Disponible y Confirmada.',expect:'Son métricas relacionadas pero no idénticas.'},
     {title:'Realizá tres mediciones',why:'Usá condiciones similares y anotá programas abiertos.',expect:'La variación ayuda a distinguir actividad normal de un problema sostenido.'}
   ],
   tip:'No sumes WorkingSet de todos los procesos para estimar consumo total: muchas páginas de memoria son compartidas.',
   warning:'No desactives archivo de paginación, seguridad o servicios críticos para lograr un número menor.',
   challenge:'Compará tus tres medidas y proponé explicaciones para sus diferencias.' },
 { id:187, goal:'Recuperar espacio de forma consciente con herramientas incorporadas en Windows.',
   basics:'Archivo temporal no significa archivo inútil. La caché ahorra trabajo; borrar a ciegas puede empeorar la experiencia.',
   steps:[
     {title:'Localizá tus temporales',why:'Mostrá el directorio del usuario actual.',code:'$env:TEMP',expect:'Una ruta bajo el perfil de usuario, normalmente.'},
     {title:'Medí sin borrar nada',why:'Solo contamos archivos del primer nivel de TEMP.',code:'Get-ChildItem -LiteralPath $env:TEMP -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum',expect:'Count indica cuántos archivos hay y Sum su tamaño en bytes.'},
     {title:'Abrí el limpiador oficial',why:'Revisá categorías y confirmá vos cualquier limpieza.',code:'Start-Process cleanmgr.exe',expect:'Aparece la herramienta de limpieza si está disponible.'}
   ],
   tip:'Registrá espacio libre antes y después: el resultado medido vale más que una barra de progreso.',
   warning:'Nunca borres manualmente System32, WinSxS o DriverStore.',
   challenge:'Explicá la diferencia entre archivos temporales, caché y componentes del sistema.' }
];
const ARTICLES: Article[] = [...ORIGINAL_ARTICLES, ...EVO_MAGAZINE_FIRST_BATCH, ...EVO_MAGAZINE_SECOND_BATCH, ...EVO_MAGAZINE_THIRD_BATCH, ...EVO_MAGAZINE_PRIVACY_A, ...EVO_MAGAZINE_PRIVACY_B, ...EVO_MAGAZINE_SECURITY_A, ...EVO_MAGAZINE_SECURITY_B, ...EVO_MAGAZINE_WINDOWS_A, ...EVO_MAGAZINE_WINDOWS_B].sort((a, b) => a.id - b.id);
const dictionary = new Map(ARTICLES.map(a => [a.id,a]));
const number = (n:number) => String(n).padStart(3,'0');

export function Tomo02MagazineEstrella({ onBack, onOpenInteractive, onOpenSector }:{onBack:()=>void;onOpenInteractive:()=>void;onOpenSector?:(sectorNumber:string)=>void}) {
  const [current, setCurrent] = useState(1);
  const [reviewed, setReviewed] = useState<Record<number, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('evo_magazine02_reviewed_v1') || '{}'); }
    catch { return {}; }
  });
  const [query, setQuery] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState('');
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try { return JSON.parse(localStorage.getItem('evo_magazine02_notes_v1') || '{}'); }
    catch { return {}; }
  });
  const saveNote = (id: number, value: string) => {
    const nextNotes = { ...notes, [id]: value };
    setNotes(nextNotes);
    try { localStorage.setItem('evo_magazine02_notes_v1', JSON.stringify(nextNotes)); }
    catch { /* Keep notes for this browser session. */ }
  };
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedFeedback('Comando copiado. Revisá cada línea antes de ejecutarlo.');
    } catch {
      setCopiedFeedback('No se pudo copiar automáticamente. Seleccioná el texto del comando.');
    }
  };
  const [section, setSection] = useState(0);
  const selected = dictionary.get(current) || ARTICLES[0];
  const reviewedCount = ARTICLES.filter(a => reviewed[a.id]).length;
  const markReviewed = () => {
    const updated = { ...reviewed, [selected.id]: !reviewed[selected.id] };
    setReviewed(updated);
    try { localStorage.setItem('evo_magazine02_reviewed_v1', JSON.stringify(updated)); }
    catch { /* Offline/blocked storage: keep session state. */ }
  };
  const nextArticle = ARTICLES[(ARTICLES.findIndex(a => a.id === selected.id) + 1) % ARTICLES.length];
  const jumpToGuide = (id: number) => {
    setCurrent(id);
    document.getElementById('magazine-guide')?.scrollIntoView({ behavior: 'smooth' });
  };
  const visible = EVO_MAGAZINE_200_TITLES.map((title,i)=>({ title, id:i+1 })).filter(item=>{
    if (query && !item.title.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))) return false;
    if (!section) return true;
    const g=EVO_MAGAZINE_GROUPS[section-1];
    return item.id>=g.start && item.id<=g.end;
  });
  useEffect(()=>{
    if(new URLSearchParams(window.location.search).get('print')!=='true') return;
    const handle=window.setTimeout(()=>{document.title='EVO-LABS-TOMO-02-MAGAZINE-ESTRELLA';window.print();},900);
    return ()=>window.clearTimeout(handle);
  },[]);
  const renderGuide=(a:Article)=>(
    <article key={a.id} className="evo-guide bg-white text-zinc-900 rounded-xl mb-7 border border-zinc-300 p-6 sm:p-9">
      <p className="text-xs font-black text-cyan-800 uppercase tracking-widest">Investigación {number(a.id)} · Guía real</p>
      <h2 className="text-3xl font-black tracking-tight mt-2">{EVO_MAGAZINE_200_TITLES[a.id-1]}</h2>
      <p className="mt-4"><b>Lo que vas a aprender:</b> {a.goal}</p>
      <p className="mt-3 leading-relaxed"><b>Desde cero:</b> {a.basics}</p>
      {a.steps.map((step,i)=>(
        <section className="evo-step mt-6" key={i}>
          <h3 className="font-bold text-lg">{i+1}. {step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed">{step.why}</p>
          {step.code && <div className="mt-2">
            <button type="button" onClick={()=>copyCode(step.code!)}
              className="evo-no-print text-xs px-3 py-1.5 bg-cyan-800 hover:bg-cyan-700 text-white rounded-t-md"
              aria-label={'Copiar comando del paso ' + (i+1)}>Copiar comando</button>
            <pre className="evo-command select-text bg-zinc-900 text-cyan-100 text-xs p-4 rounded-md whitespace-pre-wrap break-words print:bg-zinc-100 print:text-black print:border">{step.code}</pre>
          </div>}
          <p className="mt-2 text-sm"><b>Qué debería suceder:</b> {step.expect}</p>
        </section>
      ))}
      <p className="mt-6 border-l-4 border-emerald-600 pl-3 text-sm"><b>TRUCO EVO.</b> {a.tip}</p>
      <p className="mt-4 border-l-4 border-amber-500 pl-3 text-sm"><b>ANTES DE TOCAR NADA.</b> {a.warning}</p>
      <div className="mt-5 p-4 rounded-lg border border-zinc-400 text-sm"><b>DESAFÍO DEL ALUMNO.</b> {a.challenge}<div className="mt-6 border-b border-dashed border-zinc-400"/><div className="mt-6 border-b border-dashed border-zinc-400"/></div>
      <div className="mt-5 pt-4 border-t border-cyan-200">
        <p className="font-bold text-sm mb-2">El mismo tema, explicado en profundidad en la Biblia Virtual:</p>
        <div className="flex flex-wrap gap-2">
          {(EVO_MAGAZINE_RELATED_SECTORS[a.id] || []).map(number => {
            const sector = TOMO_02_MASTER_SECTORS.find(s => s.sectorNumber === number);
            if (!sector) return null;
            return <button key={number} type="button" onClick={() => onOpenSector ? onOpenSector(number) : onOpenInteractive()}
              className="evo-no-print border border-cyan-800 text-cyan-900 px-3 py-2 rounded-md text-xs font-bold hover:bg-cyan-50">
              Sector {number} · {sector.title} →
            </button>;
          })}
        </div>
        <p className="text-xs text-zinc-600 mt-2">
          {(EVO_MAGAZINE_RELATED_SECTORS[a.id] || []).map(number => {
            const sector = TOMO_02_MASTER_SECTORS.find(s => s.sectorNumber === number);
            return sector ? 'Sector ' + number + ': ' + sector.title : '';
          }).filter(Boolean).join(' · ')}
        </p>
      </div>
      <p className="mt-5 pt-3 border-t text-xs text-zinc-600">No se ejecuta código desde el PDF. Los comandos de estas guías son consultas o abren herramientas nativas. La Biblia Virtual conserva el estudio avanzado.</p>
    </article>
  );
  return (
    <div className="evo-magazine-star min-h-screen bg-[#10151b] text-zinc-100">
      <style>{'@page{size:A4;margin:14mm 12mm;}@media print{html,body,.evo-magazine-star{background:white!important;color:black!important;} .evo-no-print{display:none!important;} .evo-print-only{display:block!important;} .evo-cover{page-break-after:always;} .evo-index-print{columns:2;column-gap:8mm;font-size:9pt;} .evo-index-print p{break-inside:avoid;margin:0 0 3mm;} .evo-index-section{break-after:page;} .evo-guide{break-before:page;border:0!important;padding:0!important;} .evo-step{break-inside:avoid;} .evo-command{overflow-wrap:anywhere;white-space:pre-wrap!important;} .evo-cover .text-zinc-300,.evo-cover .text-zinc-400{color:#333!important;} .evo-cover .text-cyan-300{color:#076284!important;} .evo-guide p,.evo-guide h2,.evo-guide h3{orphans:3;widows:3;} .evo-canonical-sector{break-inside:auto;} .evo-canonical-sector h3,.evo-can-entry{break-inside:avoid;} .evo-magazine-star a{color:#075985!important;} }'}</style>
      <nav className="evo-no-print sticky top-0 z-50 bg-[#0b1118] border-b border-zinc-700 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <button onClick={onBack} className="rounded-md border border-zinc-600 px-3 py-2 text-sm">← Tomo 02</button>
        <strong className="text-sm">EVO LABS · MAGAZINE ESTRELLA</strong>
        <div className="flex gap-2">
          <button onClick={onOpenInteractive} className="rounded-md border border-zinc-600 px-3 py-2 text-xs">Biblia Virtual</button>
          <button onClick={()=>window.print()} className="rounded-md bg-cyan-400 text-black font-bold px-3 py-2 text-xs">Guardar PDF A4</button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 sm:px-7 pb-20">
        <header className="evo-cover py-16 sm:py-24 border-b border-zinc-700">
          <p className="font-mono text-xs text-cyan-300 tracking-widest">TOMO 02 · LA BIBLIA NEGRA DE WINDOWS</p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-black leading-tight max-w-4xl">¿QUÉ HACE TU PC CUANDO NO ESTÁS?</h1>
          <p className="mt-6 text-xl sm:text-2xl text-zinc-300 max-w-3xl">200 secretos de Windows para descubrir, investigar y comprobar en tu propia computadora.</p>
          <p className="mt-8 max-w-3xl text-sm">Procesos · Privacidad · Telemetría · Puertos · Regedit · RAM · Limpieza · Gaming · Reparación · PowerShell</p>
          <p className="mt-10 font-black text-cyan-300">NO LO CREAS. COMPROBALO.</p>
          <p className="mt-6 text-xs text-zinc-400">Catálogo de 200 títulos + {ARTICLES.length} guías prácticas desarrolladas. Los capítulos restantes siguen en elaboración y verificación. Los otros títulos todavía requieren desarrollo y validación.</p>
        </header>
        <section className="evo-index-section py-10">
          <h2 className="text-2xl font-black mb-3">ÍNDICE MAESTRO · 200 INVESTIGACIONES</h2>
          <p className="text-sm text-zinc-300 mb-6">Los títulos se agrupan por tema. El botón azul indica que ya existe una guía paso a paso. La Biblia Virtual mantiene su propio índice técnico sin cambios.</p>
          <div className="evo-no-print flex flex-col sm:flex-row gap-3 mb-6">
            <input type="search" aria-label="Buscar artículos" placeholder="Buscá por tema: RAM, telemetría, gaming..." value={query} onChange={e=>setQuery(e.target.value)} className="flex-1 rounded-md bg-zinc-900 border border-zinc-600 px-3 py-3"/>
            <select aria-label="Filtrar categoría" value={section} onChange={e=>setSection(Number(e.target.value))} className="rounded-md bg-zinc-900 border border-zinc-600 px-3 py-3">
              <option value={0}>Todas las categorías</option>
              {EVO_MAGAZINE_GROUPS.map((g,i)=><option key={g.name} value={i+1}>{g.name}</option>)}
            </select>
          </div>
          <div className="evo-no-print grid sm:grid-cols-2 gap-2">
            {visible.map(item=>{
              const ready=dictionary.has(item.id);
              return <button type="button" disabled={!ready} onClick={()=>jumpToGuide(item.id)} key={item.id} className={'p-3 border rounded-lg flex gap-3 text-left text-sm '+(ready?'bg-[#16303b] border-cyan-600 hover:border-cyan-300':'bg-zinc-900 border-zinc-700 opacity-75')}>
                <span className="font-mono text-cyan-300">{number(item.id)}</span><span className="flex-1">{item.title}</span><span className="text-[10px]">{ready?(reviewed[item.id]?'REVISADA':'LEER'):'ÍNDICE'}</span>
              </button>
            })}
          </div>
          <div className="evo-print-only hidden evo-index-print text-zinc-900">
            {EVO_MAGAZINE_200_TITLES.map((t,i)=><p key={i}><b>{number(i+1)}.</b> {t}{dictionary.has(i+1)?' · GUÍA':''}</p>)}
          </div>
        </section>
        <section id="magazine-guide" className="evo-no-print py-6">
          <h2 className="text-2xl font-black mb-3">TU LABORATORIO, DESDE CERO</h2>
          <p className="text-sm text-zinc-300 mb-5">Tu registro local de lectura: <strong>{reviewedCount} de {ARTICLES.length}</strong> guías marcadas como revisadas. Esto no sustituye una evaluación técnica.</p>
          {renderGuide(selected)}
          <div className="border border-zinc-600 rounded-lg p-4 mb-5">
            <label htmlFor="evo-lab-note" className="font-bold text-sm block mb-2">Tu cuaderno de laboratorio · Investigación {number(selected.id)}</label>
            <textarea id="evo-lab-note" key={selected.id} rows={5}
              defaultValue={notes[selected.id] || ''} onBlur={e=>saveNote(selected.id,e.target.value)}
              placeholder="Anotá: qué ejecutaste, qué apareció, qué entendiste y qué tenés que investigar."
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 text-white p-3 text-sm"/>
            <p className="mt-2 text-xs text-zinc-400">Las notas se guardan al salir del campo en el almacenamiento local de este navegador. Evitá incluir contraseñas, IP privadas u otros datos sensibles.</p>
          </div>
          <p className="text-sm text-cyan-300 mb-4" aria-live="polite">{copiedFeedback}</p>
          <div className="flex flex-wrap gap-3 mb-7">
            <button type="button" onClick={markReviewed} className="px-4 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg font-bold text-sm">
              {reviewed[selected.id] ? '✓ Revisada · Desmarcar' : '✓ Marcar práctica como revisada'}
            </button>
            <button type="button" onClick={()=>jumpToGuide(nextArticle.id)} className="px-4 py-3 border border-cyan-500 rounded-lg font-bold text-sm">
              Siguiente investigación disponible →
            </button>
          </div>
          <p className="text-sm text-zinc-300">Podés imprimir la edición con el índice de 200 títulos y las {ARTICLES.length} guías actualmente desarrolladas desde el botón «Guardar PDF A4».</p>
        </section>
        <section className="evo-print-only hidden">
          <h2 className="text-2xl font-black text-zinc-900">Guías completas de esta primera entrega</h2>
          {ARTICLES.map(renderGuide)}
        </section>
        <section aria-labelledby="bibliavirtual-index" className="py-10 border-t border-zinc-700">
          <h2 id="bibliavirtual-index" className="text-2xl font-black mb-2">Índice original completo de la Biblia Virtual</h2>
          <p className="mb-5 text-sm text-zinc-300">Se conserva la numeración original de {TOMO_02_MASTER_SECTORS.length} sectores y {TOMO_02_MASTER_SECTORS.reduce((sum,s)=>sum+s.investigationsList.length,0)} subtemas. Este apéndice es un mapa de estudio, no una afirmación de que todos ellos ya estén desarrollados en el Magazine.</p>
          <div className="evo-no-print space-y-2">
            {TOMO_02_MASTER_SECTORS.map(sector => (
              <details key={sector.sectorId} className="border border-zinc-700 rounded-lg bg-zinc-900 px-4 py-3">
                <summary className="cursor-pointer font-bold text-sm">
                  SECTOR {sector.sectorNumber} · {sector.title} · {sector.investigationsList.length} investigaciones
                </summary>
                <ol className="pl-4 mt-3 space-y-1 text-sm text-zinc-300">
                  {sector.investigationsList.map(inv => <li key={inv.id}><span className="font-mono text-cyan-400">{inv.id}</span> · {inv.title}</li>)}
                </ol>
                <button type="button" onClick={()=>onOpenSector ? onOpenSector(sector.sectorNumber) : onOpenInteractive()}
                  className="mt-3 px-3 py-2 text-xs border border-cyan-600 rounded-lg text-cyan-300">
                  Abrir este sector de la Biblia →
                </button>
              </details>
            ))}
          </div>
          <div className="evo-print-only hidden">
            {TOMO_02_MASTER_SECTORS.map(sector => (
              <section key={sector.sectorId} className="evo-canonical-sector mb-7 text-zinc-900">
                <h3 className="font-bold text-base">SECTOR {sector.sectorNumber} · {sector.title}</h3>
                <p className="text-xs italic mb-2">{sector.subtitle}</p>
                <ul className="text-xs grid grid-cols-2 gap-x-6 gap-y-1">
                  {sector.investigationsList.map(inv=><li className="evo-can-entry" key={inv.id}><strong>{inv.id}</strong> · {inv.title}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </section>
        <aside aria-label="Fuentes técnicas oficiales" className="border-t border-zinc-700 py-8">
          <h2 className="text-lg font-black mb-2">Fuentes oficiales para contrastar tus pruebas</h2>
          <p className="text-sm text-zinc-300 mb-4">Cada resultado puede cambiar según versión, controlador, permisos y configuración. Documentá tus mediciones y consultá las referencias técnicas originales.</p>
          <ul className="text-sm grid sm:grid-cols-2 gap-2">
            <li><a className="underline text-cyan-300" href="https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns" target="_blank" rel="noopener noreferrer">Microsoft Sysinternals · Autoruns y ubicaciones de inicio</a></li>
            <li><a className="underline text-cyan-300" href="https://learn.microsoft.com/en-us/windows/win32/setupapi/run-and-runonce-registry-keys" target="_blank" rel="noopener noreferrer">Microsoft · Run y RunOnce en el Registro</a></li>
            <li><a className="underline text-cyan-300" href="https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file" target="_blank" rel="noopener noreferrer">Microsoft · Archivo de paginación y memoria comprometida</a></li>
            <li><a className="underline text-cyan-300" href="https://support.microsoft.com/es-es/windows/privacy/diagnostics-feedback-and-privacy-in-windows" target="_blank" rel="noopener noreferrer">Microsoft · Qué datos diagnósticos recopila Windows</a></li>
            <li><a className="underline text-cyan-300" href="https://support.microsoft.com/en-us/windows/privacy/windows-camera-microphone-and-privacy" target="_blank" rel="noopener noreferrer">Microsoft · Permisos de cámara y micrófono</a></li>
            <li><a className="underline text-cyan-300" href="https://learn.microsoft.com/es-es/windows-hardware/manufacture/desktop/dism-operating-system-package-servicing-command-line-options?view=windows-11" target="_blank" rel="noopener noreferrer">Microsoft · Comprobaciones de DISM y WinSxS</a></li>
          </ul>
        </aside>
        <footer className="border-t border-zinc-700 pt-6 text-xs text-zinc-400">
          EVO LABS · Edición de desarrollo con {ARTICLES.length} guías completas en formato inicial y 200 títulos en catálogo. Antes de realizar una práctica, revisá riesgos, permisos y recuperación. La Biblia Virtual conserva su contenido técnico.
        </footer>
      </main>
    </div>
  );
}