import React from 'react';
import {
  Activity, ArrowRight, Boxes, Clock3, Cpu, Database, Eye, FileSearch,
  Gauge, HardDrive, Layers, LockKeyhole, Network, Radio, ScanLine,
  Search, Settings2, Shield, Sparkles, Terminal, Workflow, Zap
} from 'lucide-react';

/**
 * Magazine Estrella: interiores de investigación, no portadas.
 * 001–010 poseen diagramas propios; el resto usa una dirección artística
 * tipográfica y diagramas abstractos por área, nunca resultados inventados.
 * Todos los números de los gráficos son demostrativos, no telemetría real.
 */
type IconType = React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
type ArtDirection = {
  category: string; accent: string; dark: string; secondary: string;
  icon: IconType; keywords: readonly string[]; subject: string;
};

const TOPICS: ArtDirection[] = [
  { category:'SISTEMA / PROCESOS',accent:'#3b82f6',dark:'#14284a',secondary:'#dbeafe',icon:Cpu,keywords:['PROCESOS','CPU','SERVICIOS','SISTEMA'],subject:'El motor invisible' },
  { category:'PRIVACIDAD / TELEMETRÍA',accent:'#9f5bd7',dark:'#322048',secondary:'#f0e3fc',icon:Eye,keywords:['PRIVACIDAD','DATOS','PERMISOS','TELEMETRÍA'],subject:'La huella digital' },
  { category:'SEGURIDAD / FORENSE',accent:'#df694f',dark:'#432720',secondary:'#fde5dd',icon:Shield,keywords:['EVIDENCIA','RIESGO','FIREWALL','DEFENSA'],subject:'Pistas y verificación' },
  { category:'WINDOWS / REGISTRO',accent:'#0f948d',dark:'#173e3a',secondary:'#d4f5ed',icon:Settings2,keywords:['WINDOWS','REGEDIT','CONFIGURACIÓN','OPTIMIZACIÓN'],subject:'Personalizá con criterio' },
  { category:'REDES / CONEXIONES',accent:'#267bc5',dark:'#143650',secondary:'#def4ff',icon:Network,keywords:['RED','DNS','TCP','ROUTER'],subject:'Seguí las conexiones' },
  { category:'GAMING / RENDIMIENTO',accent:'#ab61cc',dark:'#322143',secondary:'#f5defe',icon:Gauge,keywords:['FPS','FRAMETIME','LATENCIA','GAMING'],subject:'Medí, no adivines' },
  { category:'REPARACIÓN / LABORATORIO',accent:'#bd7429',dark:'#473017',secondary:'#ffefd1',icon:HardDrive,keywords:['REPARACIÓN','BACKUP','DRIVERS','MANTENIMIENTO'],subject:'Diagnóstico antes del cambio' },
];

export function magazineArtDirection(id:number): ArtDirection {
  if(id<=50)return TOPICS[0];
  if(id<=75)return TOPICS[1];
  if(id<=100)return TOPICS[2];
  if(id<=125)return TOPICS[3];
  if(id<=150)return TOPICS[4];
  if(id<=175)return TOPICS[5];
  return TOPICS[6];
}

function IconTag({icon: Icon,children}:{icon:IconType;children:React.ReactNode}){
  return <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white/90">
    <Icon className="h-3.5 w-3.5"/>{children}
  </span>;
}

const EXAMPLE_PROCESSES=[
  {name:'Navegador',type:'Aplicación',load:72},
  {name:'Explorador',type:'Shell',load:31},
  {name:'Servicio de red',type:'Sistema',load:17}
];

function Visual001(){
  return <div className="grid gap-3 sm:grid-cols-[1.25fr_.75fr] items-stretch h-full">
    <div className="rounded-xl border border-white/15 bg-white/[.07] p-4">
      <div className="flex justify-between items-center text-xs font-black mb-5"><span>MAPA DE PROCESOS</span><span className="font-mono text-[10px] text-white/60">PID → RECURSOS</span></div>
      {EXAMPLE_PROCESSES.map((p,i)=><div key={p.name} className="grid grid-cols-[minmax(0,1fr)_85px] gap-2 items-center border-t border-white/10 py-3">
        <div><p className="text-sm font-bold">{p.name}</p><p className="text-[10px] text-white/60">{p.type} · ID {1200+i*487}</p></div>
        <div><div className="text-[10px] text-right mb-1 opacity-70">Muestra {p.load}%</div><div className="h-2 bg-white/15 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:p.load+'%',backgroundColor:'#8fd6ff'}}/></div></div>
      </div>)}
    </div>
    <div className="grid gap-3 grid-rows-2">
      <div className="rounded-xl bg-[#a6dffd] text-[#08243e] p-4 flex flex-col justify-between"><Cpu size={29}/><p className="text-xl font-black">¿QUIÉN USA QUÉ?</p><span className="text-xs">Proceso · PID · CPU · Memoria</span></div>
      <div className="rounded-xl border border-white/15 bg-white/[.06] p-4 flex flex-col justify-between"><ScanLine size={27}/><p className="font-extrabold">OBSERVAR ≠ DETENER</p><span className="text-xs text-white/70">Primero identificá. Después evaluá.</span></div>
    </div>
  </div>;
}
function Visual002(){
  const items=[['INICIO','Automático'],['ESTADO','En ejecución'],['DEPENDE DE','Otro servicio']];
  return <div className="h-full flex flex-col justify-center gap-4">
    <div className="grid grid-cols-3 gap-2">{items.map(([head,sub],i)=><div key={head} className="rounded-xl bg-white/10 border border-white/20 p-3 min-h-[102px]">
      <span className="text-2xl font-black text-[#b4edff]">0{i+1}</span><p className="mt-1 text-xs font-black">{head}</p><p className="text-[11px] text-white/65">{sub}</p></div>)}</div>
    <div className="rounded-xl bg-[#b4edff] text-slate-900 px-4 py-3 flex items-center justify-between font-black"><Settings2 size={24}/><span className="text-center text-sm">UN SERVICIO NO ES UN INTERRUPTOR AISLADO</span><Workflow size={24}/></div>
  </div>;
}
function Visual003(){
  return <div className="grid grid-cols-[1fr_28px_1.15fr] gap-3 items-center h-full">
    <div className="rounded-2xl border border-white/25 bg-white/10 p-4 flex flex-col items-center justify-center gap-2"><Boxes size={52}/><b className="text-lg">svchost.exe</b><span className="text-xs text-white/65 text-center">Proceso contenedor</span></div>
    <div className="flex items-center justify-center"><ArrowRight className="w-7 text-[#9edbf4]"/></div>
    <div className="space-y-3">{['Servicio A','Servicio B','Servicio C'].map((x,i)=><div key={x} className="flex gap-2 items-center border border-white/20 bg-white/10 rounded-lg p-3"><span className="text-xs font-mono text-[#86dfff]">0{i+1}</span><Settings2 size={17}/><span className="text-sm font-bold">{x}</span></div>)}</div>
  </div>;
}
function Visual004(){
  const phases=[['UEFI','Firmware'],['BOOT','Carga'],['NT','Kernel'],['LOGIN','Sesión'],['UI','Escritorio']];
  return <div className="h-full flex flex-col justify-center">
    <div className="flex items-center gap-1 mb-5">{phases.map((p,i)=><React.Fragment key={p[0]}><div className="flex-1 min-w-0"><div className="rounded-xl border border-white/20 bg-white/10 p-3 min-h-[102px] flex flex-col justify-between">
      <span className="text-[10px] font-bold text-white/60">FASE 0{i+1}</span><span className="text-lg font-black">{p[0]}</span><span className="text-[10px] text-white/70">{p[1]}</span></div></div>{i!==4&&<ArrowRight className="w-3 shrink-0 text-[#b6f0ff]"/>}</React.Fragment>)}</div>
    <div className="border-t border-dashed border-white/50 pt-3 text-xs font-bold">La pantalla visible es sólo la última parte del proceso.</div>
  </div>;
}
function Visual005(){
  return <div className="grid grid-cols-3 gap-2 items-center h-full">
    <div className="rounded-xl bg-white/10 border border-white/20 p-4 text-center space-y-3"><Database className="mx-auto" size={32}/><b className="block text-sm">TUS ARCHIVOS</b><span className="text-xs text-white/70">Carpetas y contenido</span></div>
    <div className="flex flex-col items-center text-center gap-3"><ArrowRight size={23}/><div className="rounded-full w-24 h-24 border-[6px] border-[#83d5ff] bg-[#1b455f] flex items-center justify-center"><Search size={42}/></div><span className="font-black text-xs">ÍNDICE</span></div>
    <div className="rounded-xl bg-[#b6ebff] text-[#123047] p-4 text-center space-y-3"><FileSearch className="mx-auto" size={32}/><b className="block text-sm">RESULTADOS</b><span className="text-xs">Buscar más rápido</span></div>
  </div>;
}
function Visual006(){
  const phases=['DESCARGAR','VALIDAR','INSTALAR','REINICIAR'];
  return <div className="space-y-5 h-full flex flex-col justify-center">
    <div className="grid grid-cols-4 gap-2">{phases.map((p,i)=><div key={p} className="min-w-0"><div className="rounded-xl bg-white/10 border border-white/20 p-3 h-[110px] flex flex-col justify-between"><span className="font-black text-2xl text-[#b5f0ff]">0{i+1}</span><span className="text-[10px] font-black break-words">{p}</span></div>{i<3&&<div className="h-0.5 bg-[#5de0f5] mt-2"/>}</div>)}</div>
    <div className="flex gap-3 items-center rounded-xl bg-white/10 border border-white/15 p-4"><Clock3 size={28}/><span className="text-sm"><b>ACTIVIDAD EN SEGUNDO PLANO</b><br/>La instalación puede continuar aunque no la veas.</span></div>
  </div>;
}
function Visual007(){
  return <div className="grid grid-cols-[1fr_1fr] gap-3 h-full">
    <div className="relative rounded-2xl bg-[#a5e7ff] text-[#0f2840] p-4 flex flex-col justify-between overflow-hidden"><div className="absolute -right-5 -bottom-6 opacity-15"><Shield size={170}/></div><Shield size={43}/><span className="font-black text-2xl leading-tight relative">PROTECCIÓN<br/>ACTIVA</span><span className="text-xs font-bold relative">Seguridad ≠ consumo perdido</span></div>
    <div className="flex flex-col gap-3"><div className="rounded-xl border border-white/15 bg-white/10 p-4 flex-1"><Activity size={21}/><div className="text-sm font-black mt-2">USO DE CPU</div><div className="mt-3 h-2 rounded-full bg-white/15"><div className="bg-[#7ce9ff] w-[45%] h-full rounded-full"/></div><div className="text-[10px] mt-2 opacity-60">Ejemplo visual · no medido</div></div><div className="rounded-xl border border-white/15 p-3 flex gap-2 items-center"><LockKeyhole size={19}/><span className="text-xs font-bold">Medí antes de desactivar.</span></div></div>
  </div>;
}
function Visual008(){
  const timeline=[['08:00','Inicio'],['12:00','Mantenimiento'],['18:00','Sincronización'],['22:00','Diagnóstico']];
  return <div className="h-full flex flex-col justify-center gap-4">
    <div className="flex justify-between items-center"><Clock3 size={34}/><strong className="tracking-wider text-xs">PLANIFICADOR · EJEMPLO VISUAL</strong></div>
    <div className="grid grid-cols-4 gap-2">{timeline.map(([t,l],i)=><div key={t} className="relative"><div className="h-2 bg-[#92dcff] mb-4 rounded-full"/><span className="text-lg font-black">{t}</span><p className="text-[10px] text-white/65 mt-1">{l}</p></div>)}</div>
    <div className="border border-white/20 bg-white/10 rounded-xl p-3 text-sm font-bold">Una tarea programada puede ejecutarse sin abrir ventanas.</div>
  </div>;
}
function Visual009(){
  return <div className="h-full grid grid-cols-[1.15fr_.85fr] gap-3">
    <div className="rounded-xl border border-white/15 bg-white/10 p-4"><span className="text-xs font-black">TRABAJO INVISIBLE</span><div className="grid grid-cols-2 gap-2 mt-4">{[['CPU',Cpu],['DISCO',HardDrive],['RED',Network],['RAM',Database]].map(([s,Icon])=>{const I=Icon as IconType;return <div key={s as string} className="rounded-lg bg-white/10 p-3 flex flex-col gap-3"><I size={22}/><span className="font-black text-xs">{s as string}</span></div>})}</div></div>
    <div className="rounded-xl bg-[#aff0ff] text-[#0d3544] p-4 flex flex-col justify-between"><Radio size={35}/><span className="text-2xl font-black leading-tight">EN SEGUNDO<br/>PLANO</span><span className="text-xs font-semibold">Actividad ≠ amenaza</span></div>
  </div>;
}
function Visual010(){
  return <div className="grid grid-cols-2 gap-3 h-full">{[['CPU',Cpu,'Procesos'],['MEMORIA',Database,'Páginas'],['DISCO',HardDrive,'Lectura y escritura'],['RED',Network,'Conexiones']].map(([label,Icon,note],i)=>{const I=Icon as IconType;return <div key={label as string} className="rounded-xl bg-white/10 border border-white/15 p-4 flex flex-col justify-between"><div className="flex items-center justify-between"><span className="text-xs font-black">{label as string}</span><I size={23}/></div><div className="flex gap-1 items-end h-8">{[3,5,2,7,4,6,3,5].map((n,j)=><span key={j} className="flex-1 rounded-t-sm bg-[#9ee4ff]" style={{height: (n*10+(i*7)%15)+'%'}}/>)}</div><span className="text-[10px] text-white/60">{note as string} · esquema conceptual</span></div>})}</div>;
}

function ConceptScene({id,direction,title,steps}:{id:number;direction:ArtDirection;title:string;steps:readonly string[]}){
  if(id===1)return <Visual001/>;
  if(id===2)return <Visual002/>;
  if(id===3)return <Visual003/>;
  if(id===4)return <Visual004/>;
  if(id===5)return <Visual005/>;
  if(id===6)return <Visual006/>;
  if(id===7)return <Visual007/>;
  if(id===8)return <Visual008/>;
  if(id===9)return <Visual009/>;
  if(id===10)return <Visual010/>;
  const Icon=direction.icon;
  return <div className="evo-generic-visual" aria-label={'Mapa conceptual de investigación '+id}>
    <div className="evo-generic-emblem">
      <div className="evo-emblem-illustration" aria-hidden="true">
        <div className="evo-emblem-outer"><Icon className="h-14 w-14" strokeWidth={1.25}/></div>
        <span className="evo-emblem-orbit orbit-a"/><span className="evo-emblem-orbit orbit-b"/>
      </div>
      <span>ÁREA DE ESTUDIO / {direction.category}</span>
      <strong>{direction.subject}</strong>
      <small>EXPEDIENTE TÉCNICO {String(id).padStart(3,'0')}</small>
    </div>
    <div className="evo-generic-path">
      <div className="evo-path-heading"><span>MAPA DE ESTA INVESTIGACIÓN</span><span>03 / ETAPAS</span></div>
      {(steps.length?steps:['Observar','Comprobar','Concluir']).slice(0,3).map((step,i)=>
        <div className="evo-path-item" key={i}>
          <span className="evo-path-count">{String(i+1).padStart(2,'0')}</span>
          <span className="evo-path-label">{step}</span>
          <ArrowRight className="evo-path-arrow" size={17}/>
        </div>
      )}
      <p>Ruta real del contenido de esta guía; las observaciones se obtienen al hacer los ejercicios.</p>
      <span className="sr-only">Esquema conceptual de {title}; no contiene mediciones del usuario.</span>
    </div>
  </div>;
}

export function MagazineArticleHero({id,title,steps}:{id:number;title:string;steps:readonly string[]}){
  const direction=magazineArtDirection(id);
  const Icon=direction.icon;
  const issue=String(id).padStart(3,'0');
  return <header className="evo-no-print evo-article-hero overflow-hidden rounded-[22px] text-white" style={{backgroundColor:direction.dark}}>
    <div className="relative px-5 pt-5 sm:px-7 sm:pt-7 overflow-hidden">
      <div className="absolute top-[-90px] right-[-85px] w-64 h-64 rounded-full blur-3xl opacity-30" style={{backgroundColor:direction.accent}}/>
      <div className="relative flex items-center justify-between gap-3 border-b border-white/20 pb-4 text-[10px] uppercase font-black tracking-[.17em]">
        <span>EVO LABS <span className="text-white/40">/</span> MAGAZINE ESTRELLA</span>
        <span className="font-mono">TOMO 02 · {issue}</span>
      </div>
      <div className="relative flex flex-wrap items-center gap-2 pt-5">
        <IconTag icon={Icon}>{direction.category}</IconTag>
        <span className="text-[11px] uppercase font-bold tracking-widest text-white/60">Experimento guiado</span>
      </div>
      <div className="relative mt-5 sm:mt-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-3"><span className="font-black text-5xl sm:text-6xl tracking-tighter leading-none" style={{color:direction.secondary}}>{issue}</span><div className="w-12 h-px bg-white/50"/><span className="uppercase text-[11px] tracking-[.16em] font-bold text-white/65">Investigación</span></div>
        <h2 className="text-[clamp(1.8rem,4vw,3.35rem)] leading-[1.05] font-black tracking-tight max-w-3xl [text-wrap:balance]">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80">Una misión para entender qué ocurre dentro de tu computadora. Mirá la evidencia, probá en tu equipo y sacá tus propias conclusiones.</p>
      </div>
      <div className="relative mt-6 flex flex-wrap gap-2 pb-6">
        {direction.keywords.map((k,i)=><span key={k} className="border border-white/25 rounded-md px-2.5 py-1 text-[10px] tracking-wider uppercase font-bold text-white/85">{String(i+1).padStart(2,'0')} {k}</span>)}
      </div>
    </div>
    <div className="evo-hero-diagram grid gap-3 p-4 sm:p-6 min-h-[245px]" style={{background:'linear-gradient(135deg, rgba(0,0,0,.23),rgba(255,255,255,.035))'}}>
      <ConceptScene id={id} direction={direction} title={title} steps={steps}/>
    </div>
    <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-7 border-t border-white/15 text-[10px] uppercase font-bold tracking-[.12em] text-white/70">
      <span className="inline-flex items-center gap-2"><Sparkles size={14}/> NO LO CREAS. COMPROBALO.</span>
      <span className="inline-flex items-center gap-1">{String(steps.length).padStart(2,"0")} PASOS · INVESTIGAR <ArrowRight size={14}/></span>
    </div>
  </header>;
}
