import React from 'react';

/**
 * EVO LABS · WIN/NT editorial illustrations.
 * Original vector artwork for TOMO 02. No photographs/assets from Tomo 01.
 * Every diagram is conceptual, not a screenshot or measurement of the reader's PC.
 */
export type WindowsArtKind = 'night' | 'kernel' | 'cpu' | 'experiment' | 'tasks' | 'network' | 'verdict' | 'security';

const themes: Record<WindowsArtKind, { id: string; eyebrow: string; heading: string; detail: string; label: string; tint: string }> = {
  night: {id:'NT-001',eyebrow:'EXPEDIENTE // WINDOWS INVISIBLE',heading:'EL SISTEMA SIGUE ACTIVO',detail:'Kernel, procesos y tareas responden a eventos sin abrir ventanas.',label:'DEL ESCRITORIO AL NÚCLEO',tint:'#00D2FF'},
  kernel: {id:'NT-002',eyebrow:'ANATOMÍA // PLANIFICADOR',heading:'UNA CIUDAD DE HILOS',detail:'Los estados READY, RUNNING y WAIT describen trabajo, no amenazas.',label:'USER MODE / KERNEL MODE',tint:'#60CDFF'},
  cpu: {id:'NT-003',eyebrow:'METROLOGÍA // PROCESOS',heading:'LA CPU NO ES UNA FOTO',detail:'Tiempo acumulado y uso medio son métricas distintas.',label:'DELTA DE CPU · VENTANA 5 s',tint:'#20E8D5'},
  experiment: {id:'NT-004',eyebrow:'MÉTODO // ENSAYOS A/B',heading:'MEDÍ. REPETÍ. COMPARÁ.',detail:'Tres escenarios con condiciones documentadas.',label:'PROTOCOLO DE TRES VENTANAS',tint:'#16DCFA'},
  tasks: {id:'NT-005',eyebrow:'SCHEDULER // TRAZABILIDAD',heading:'¿QUÉ SE EJECUTÓ?',detail:'Una tarea registrada no es evidencia de ejecución.',label:'EVENTOS / DESENCADENADORES',tint:'#87CBFF'},
  network: {id:'NT-006',eyebrow:'RED // TELEMETRÍA',heading:'¿CON QUIÉN SE CONECTA?',detail:'Conexión TCP, PID, destino y contexto no son intercambiables.',label:'CONEXIONES / ATTRIBUCIÓN',tint:'#15B9FF'},
  verdict: {id:'NT-007',eyebrow:'PERITAJE // EVIDENCIA',heading:'HIPÓTESIS NO ES PRUEBA',detail:'Separá observaciones, correlaciones y conclusiones.',label:'INFORME / NIVEL DE CERTEZA',tint:'#52E7D5'},
  security: {id:'NT-008',eyebrow:'AUDITORÍA // CONFIANZA',heading:'VERIFICÁ ANTES DE TOCAR',detail:'Seguridad, procedencia y diagnóstico sin atajos peligrosos.',label:'EVIDENCIA / INTEGRIDAD',tint:'#29BAFF'},
};

const Schematic: React.FC<{ kind: WindowsArtKind; tint: string }> = ({ kind, tint }) => {
  const card = (x:number,y:number,w:number,h:number,label:string,sub:string,idx:number) => (
    <g key={idx}>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#092F55" stroke={tint} strokeOpacity=".8" strokeWidth="1.3" />
      <path d={'M '+(x+8)+' '+(y+6)+' h '+Math.min(34,w-16)} stroke={tint} strokeWidth="2.5"/>
      <text x={x+12} y={y+25} fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#F3FCFF">{label}</text>
      <text x={x+12} y={y+42} fontFamily="monospace" fontSize="9" fill="#A8D5EC">{sub}</text>
    </g>
  );
  const line = (x1:number,y1:number,x2:number,y2:number,i:number) => (
    <g key={'l'+i}><path d={'M'+x1+' '+y1+' L'+x2+' '+y2} fill="none" stroke={tint} strokeWidth="2" strokeOpacity=".85" strokeDasharray="6 5"/><circle cx={x2} cy={y2} r="3.5" fill={tint}/></g>
  );

  switch (kind) {
    case 'night':
      return <g>
        <rect x="420" y="58" width="285" height="177" rx="10" fill="#071D35" stroke="#2686CB" strokeWidth="2"/>
        <rect x="432" y="70" width="261" height="145" rx="5" fill="#03152E"/>
        <g transform="translate(487 90)" fill={tint} opacity=".95">
          <path d="M0 0 L72 -8 L72 49 L0 49 Z"/><path d="M80 -9 L160 -17 L160 49 L80 49 Z"/>
          <path d="M0 58 L72 58 L72 111 L0 105 Z"/><path d="M80 58 L160 58 L160 122 L80 114 Z"/>
        </g>
        <path d="M472 249 H650 M545 235 V249" stroke="#76C9FF" strokeWidth="3"/>
        {card(90,58,210,55,'SERVICIOS','SCM / SVCHOST',1)}
        {card(90,137,210,55,'TAREAS','TRIGGERS / SCHEDULER',2)}
        {card(90,216,210,55,'RED Y E/S','EVENTOS EN SEGUNDO PLANO',3)}
        {line(300,85,415,115,1)}{line(300,165,414,155,2)}{line(300,243,415,199,3)}
      </g>;
    case 'kernel':
      return <g>
        <rect x="104" y="40" width="606" height="65" rx="10" fill="#07345A" stroke={tint} strokeWidth="1.7"/>
        <text x="125" y="66" fontFamily="monospace" fontSize="15" fontWeight="bold" fill="white">ESPACIO DE USUARIO · RING 3</text>
        <text x="125" y="89" fontFamily="monospace" fontSize="11" fill="#C5EDFF">APPS / PROCESOS / HILOS / ESPERAS</text>
        <path d="M410 106 V148" stroke={tint} strokeWidth="3"/><path d="M399 138 L410 150 L421 138" fill="none" stroke={tint} strokeWidth="3"/>
        {card(100,153,188,75,'READY','LISTO PARA CPU',0)}
        {card(319,153,188,75,'RUNNING','EN EJECUCIÓN',1)}
        {card(539,153,175,75,'WAIT','ESPERANDO EVENTO',2)}
        {line(288,189,317,189,1)}{line(507,189,536,189,2)}
        <text x="410" y="269" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="bold" fill="#B7E8FF">KERNEL NT · PLANIFICADOR</text>
      </g>;
    case 'cpu':
      return <g>
        <rect x="87" y="37" width="626" height="229" rx="14" fill="#031629" stroke="#188FCE" strokeWidth="2"/>
        <g stroke="#12557F" strokeWidth="1">{[0,1,2,3].map(i=><path key={i} d={'M110 '+(80+i*41)+' H695' />)}</g>
        <g stroke="#15577D" strokeWidth="1">{[0,1,2,3,4,5,6,7].map(i=><path key={i} d={'M'+(131+i*76)+' 58 V240'}/>)}</g>
        <path d="M110 212 L159 210 L210 196 L260 190 L312 164 L358 173 L408 112 L458 139 L510 123 L567 78 L627 96 L691 60" fill="none" stroke={tint} strokeWidth="3"/>
        <path d="M110 212 L159 210 L210 196 L260 190 L312 164 L358 173 L408 112 L458 139 L510 123 L567 78 L627 96 L691 60 L691 238 H110 Z" fill={tint} fillOpacity=".10"/>
        <path d="M112 223 L689 223" stroke="#74DFFF" strokeWidth="2" strokeDasharray="3 7"/>
        <rect x="435" y="45" width="244" height="37" rx="6" fill="#0A3352" stroke="#44E2E7"/>
        <text x="450" y="61" fontFamily="monospace" fontSize="10" fill="#BDEFFF">EJEMPLO DIDÁCTICO</text>
        <text x="450" y="76" fontFamily="monospace" fontWeight="bold" fontSize="13" fill="white">1,5 s / 5 s / 12 CPU</text>
        <text x="110" y="257" fontFamily="monospace" fontWeight="bold" fontSize="11" fill="#A8E7FF">ESTIMACIÓN · NO CAPTURA REAL</text>
      </g>;
    case 'experiment':
      return <g>
        {[
          ['A','REPOSO','SIN APPS NUEVAS'],
          ['B','CARGA','APPS ABIERTAS'],
          ['C','RETORNO','SEGUNDO PLANO'],
        ].map(([num,label,sub],i)=>{
          const x=100+i*232;return <g key={num}>
            <rect x={x} y="67" width="198" height="151" rx="13" fill="#073257" stroke={tint} strokeOpacity=".8" strokeWidth="2"/>
            <circle cx={x+32} cy="107" r="22" fill={tint}/><text x={x+32} y="113" textAnchor="middle" fontSize="20" fontWeight="900" fill="#031323">{num}</text>
            <text x={x+14} y="164" fontFamily="monospace" fontWeight="bold" fontSize="18" fill="white">{label}</text>
            <text x={x+14} y="186" fontFamily="monospace" fontSize="10" fill="#C9E7F5">{sub}</text>
            <path d={'M'+(x+13)+' 202 H'+(x+184)} stroke="#3D9FD0" strokeWidth="2" strokeDasharray="5 6"/>
          </g>;
        })}
        <path d="M118 243 H679" stroke={tint} strokeWidth="2" strokeDasharray="5 5"/>
        <text x="399" y="270" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#A6DFFF">MISMAS CONDICIONES · REPETICIONES · REGISTRO</text>
      </g>;
    case 'tasks':
      return <g>
        {card(83,60,209,64,'DEFINICIÓN','TASK SCHEDULER',1)}
        {card(319,60,209,64,'HISTORIAL','EJECUCIÓN REAL',2)}
        {card(555,60,175,64,'RECURSOS','CPU / DISCO',3)}
        {line(292,92,319,92,1)}{line(528,92,555,92,2)}
        <rect x="95" y="157" width="629" height="90" rx="10" fill="#061F3A" stroke="#2694C8"/>
        {[0,1,2,3,4,5,6,7].map(i=><path key={i} d={'M'+(118+i*84)+' 175 V235'} stroke="#15557B" strokeWidth="1"/>)}
        <path d="M120 209 H694" stroke="#3579A9" strokeWidth="2"/>
        {[175,354,585].map((x,i)=><g key={i}><circle cx={x} cy="209" r="10" fill={tint}/><circle cx={x} cy="209" r="3.5" fill="#041324"/></g>)}
        <text x="402" y="269" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#C4E7F9">COINCIDENCIA EN EL TIEMPO ≠ PRUEBA CAUSAL</text>
      </g>;
    case 'network':
      return <g>
        <circle cx="401" cy="156" r="110" fill="#052B50" stroke="#2579B3" strokeWidth="2"/>
        <circle cx="401" cy="156" r="74" fill="none" stroke={tint} strokeDasharray="8 8" strokeOpacity=".7"/>
        <circle cx="401" cy="156" r="32" fill="#0379C8" stroke="#77DCFF" strokeWidth="2"/>
        <text x="401" y="162" fontFamily="monospace" fontWeight="bold" fontSize="16" textAnchor="middle" fill="white">PID</text>
        {[[150,85,'PROCESO'],[645,85,'REMOTO'],[150,228,'TCP'],[645,228,'CONTEXTO']].map(([x,y,l],i)=><g key={i}><rect x={Number(x)-73} y={Number(y)-25} width="146" height="55" rx="8" fill="#08365C" stroke={tint} strokeOpacity=".7"/><text x={x} y={Number(y)+7} textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#E2F7FF">{l}</text></g>)}
        {line(223,89,337,140,1)}{line(574,89,468,139,2)}{line(223,230,337,177,3)}{line(574,230,468,175,4)}
      </g>;
    case 'verdict':
      return <g>
        {[
          [80,'HECHO','MEDIDO O REGISTRADO','#1ABEF0'],
          [316,'HIPÓTESIS','POSIBLE / REFUTABLE','#8CBDFC'],
          [551,'CONCLUSIÓN','SÓLO CON RESPALDO','#24E7C8'],
        ].map(([x,title,sub,c],i)=><g key={i}>
          <rect x={Number(x)} y="76" width="194" height="140" rx="12" fill="#092B4B" stroke={String(c)} strokeWidth="2"/>
          <path d={'M'+(Number(x)+22)+' 106 h90'} stroke={String(c)} strokeWidth="5"/>
          <text x={Number(x)+18} y="149" fontFamily="monospace" fontWeight="bold" fontSize="15" fill="white">{title}</text>
          <text x={Number(x)+18} y="176" fontFamily="monospace" fontSize="10" fill="#C1DCEC">{sub}</text>
        </g>)}
        {line(274,150,313,150,1)}{line(510,150,548,150,2)}
        <text x="400" y="258" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#A4E9FF">CORRELACIÓN ≠ CAUSALIDAD</text>
      </g>;
    default:
      return <g>
        <path d="M400 45 L635 100 L605 227 L400 285 L195 227 L165 100 Z" fill="#052D54" stroke={tint} strokeWidth="3"/>
        <path d="M400 85 L583 126 L560 201 L400 245 L240 201 L217 126 Z" fill="#083B67" stroke={tint} strokeWidth="1.8"/>
        <rect x="355" y="111" width="90" height="84" rx="11" fill="#078BDF" stroke="#B2EAFF" strokeWidth="3"/>
        <path d="M380 144 L400 160 L425 130" fill="none" stroke="#E9FEFF" strokeWidth="7" strokeLinecap="round"/>
        <text x="400" y="224" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="14" fill="#BAEFFF">INTEGRIDAD / EVENTOS / PRIVILEGIOS</text>
      </g>;
  }
};

export const Tomo02WindowsEditorialArt: React.FC<{
  kind: WindowsArtKind;
  variant?: 'hero' | 'card' | 'wide';
  caption?: string;
}> = ({kind,variant='hero',caption}) => {
  const t=themes[kind];
  return (
    <figure className={'evo-windows-art evo-windows-art--'+variant} data-windows-art={kind}>
      <svg viewBox="0 0 1120 475" role="img" aria-label={t.heading+': '+t.detail} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={'bg-'+kind} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#010613"/><stop offset="48%" stopColor="#09284A"/><stop offset="100%" stopColor="#010817"/></linearGradient>
          <linearGradient id={'glow-'+kind} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0078D4"/><stop offset="60%" stopColor={t.tint}/><stop offset="100%" stopColor="#BDEFFF"/></linearGradient>
          <radialGradient id={'rad-'+kind}><stop offset="0%" stopColor={t.tint} stopOpacity=".22"/><stop offset="100%" stopColor={t.tint} stopOpacity="0"/></radialGradient>
          <pattern id={'grid-'+kind} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0 H0 V28" fill="none" stroke={t.tint} strokeOpacity=".12" strokeWidth="1"/></pattern>
        </defs>
        <rect width="1120" height="475" fill={'url(#bg-'+kind+')'}/>
        <rect width="1120" height="475" fill={'url(#grid-'+kind+')'}/>
        <ellipse cx="510" cy="190" rx="380" ry="260" fill={'url(#rad-'+kind+')'}/>
        <path d="M25 22 H1095 M25 453 H1095" stroke={'url(#glow-'+kind+')'} strokeWidth="2"/>
        <g transform="translate(160 35)"><Schematic kind={kind} tint={t.tint}/></g>
        <path d="M22 22 V60 M22 22 H60 M1098 22 H1060 M1098 22 V60 M22 453 V415 M22 453 H60 M1098 453 H1060 M1098 453 V415" fill="none" stroke={t.tint} strokeWidth="3"/>
        <rect x="0" y="354" width="1120" height="121" fill="#010915" opacity=".89"/>
        <path d="M32 356 H1088" stroke={t.tint} strokeWidth="1" strokeOpacity=".55"/>
        <text x="47" y="383" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="2" fill={t.tint}>{t.eyebrow}</text>
        <text x="45" y="419" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="900" letterSpacing=".6" fill="white">{t.heading}</text>
        <text x="46" y="442" fontFamily="Arial, sans-serif" fontSize="14" fill="#C1E6FB">{t.detail}</text>
        <text x="1070" y="47" textAnchor="end" fontFamily="monospace" fontSize="14" fontWeight="bold" fill={t.tint}>EVO LABS / {t.id}</text>
      </svg>
      <figcaption className="evo-windows-art__caption">
        {caption ?? t.label} · ILUSTRACIÓN VECTORIAL ORIGINAL · MODELO DIDÁCTICO, NO TELEMETRÍA DEL LECTOR
      </figcaption>
    </figure>
  );
};
