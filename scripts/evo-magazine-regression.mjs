#!/usr/bin/env node
/**
 * EVO LABS Magazine Estrella: content + routing regression.
 * Run: node scripts/evo-magazine-regression.mjs
 *
 * Checks educational publishing criteria without executing PowerShell,
 * opening networks, or changing host configuration.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = name => readFileSync(resolve(process.cwd(), name), 'utf8');
const master = file('src/data/tomo02Magazine200.ts');
const batches = [
  file('src/data/tomo02MagazineFirstBatch.ts'),
  file('src/data/tomo02MagazineSecondBatch.ts'),
  file('src/data/tomo02MagazineThirdBatch.ts'),
  file('src/data/tomo02MagazinePrivacyA.ts'),
  file('src/data/tomo02MagazinePrivacyB.ts'),
  file('src/data/tomo02MagazineSecurityA.ts'),
  file('src/data/tomo02MagazineSecurityB.ts'),
  file('src/data/tomo02MagazineWindowsA.ts'),
  file('src/data/tomo02MagazineWindowsB.ts'),
  file('src/data/tomo02MagazineNetworkA.ts'),
  file('src/data/tomo02MagazineNetworkB.ts'),
  file('src/data/tomo02MagazineGamingA.ts'),
  file('src/data/tomo02MagazineGamingB.ts'),
  file('src/data/tomo02MagazineRepairA.ts'),
  file('src/data/tomo02MagazineRepairB.ts'),
];
const view = file('src/components/tomo02/Tomo02MagazineEstrella.tsx');
const visual = file('src/components/tomo02/MagazineArticleHero.tsx');
const editorialCSS = file('src/components/tomo02/Tomo02MagazineEditorial.css');
const premiumCSS = file('src/components/tomo02/Tomo02MagazinePremium.css');
const wrapper = file('src/components/tomo02/Tomo02MagazineView.tsx');
const cover = file('src/components/tomo02/Tomo02Cover.tsx');
const bridge = file('src/data/tomo02MagazineSectorBridge.ts');
const canon = file('src/data/tomo02MasterSectors.ts');
const passed = [];
const assert = (truth, message) => {
  if (!truth) throw new Error('FAIL: ' + message);
  passed.push(message);
};
const readJSON = (text, pattern, label) => {
  const match = text.match(pattern);
  assert(Boolean(match), label + ': existe el bloque');
  return JSON.parse(match[1]);
};
const titles = readJSON(master, /EVO_MAGAZINE_200_TITLES\s*=\s*(\[[\s\S]*?\])\s+as const/, 'Indice');
const groups = readJSON(master, /EVO_MAGAZINE_GROUPS\s*=\s*(\[[\s\S]*?\])\s+as const/, 'Bloques');
const first = readJSON(batches[0], /EVO_MAGAZINE_FIRST_BATCH: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Primera tanda');
const second = readJSON(batches[1], /EVO_MAGAZINE_SECOND_BATCH: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Segunda tanda');
const third = readJSON(batches[2], /EVO_MAGAZINE_THIRD_BATCH: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Tercera tanda');
const privacyA = readJSON(batches[3], /EVO_MAGAZINE_PRIVACY_A: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Privacidad A');
const privacyB = readJSON(batches[4], /EVO_MAGAZINE_PRIVACY_B: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Privacidad B');
const securityA = readJSON(batches[5], /EVO_MAGAZINE_SECURITY_A: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Seguridad A');
const securityB = readJSON(batches[6], /EVO_MAGAZINE_SECURITY_B: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Seguridad B');
const windowsA = readJSON(batches[7], /EVO_MAGAZINE_WINDOWS_A: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Windows extremo A');
const windowsB = readJSON(batches[8], /EVO_MAGAZINE_WINDOWS_B: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Windows extremo B');
const networkA = readJSON(batches[9], /EVO_MAGAZINE_NETWORK_A: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Redes A');
const networkB = readJSON(batches[10], /EVO_MAGAZINE_NETWORK_B: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Redes B');
const gamingA = readJSON(batches[11], /EVO_MAGAZINE_GAMING_A: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Gaming A');
const gamingB = readJSON(batches[12], /EVO_MAGAZINE_GAMING_B: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Gaming B');
const repairA = readJSON(batches[13], /EVO_MAGAZINE_REPAIR_A: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Reparación A');
const repairB = readJSON(batches[14], /EVO_MAGAZINE_REPAIR_B: EvoMagazineArticle\[\]\s*=\s*([\s\S]*);\s*$/, 'Reparación B');
const before = view.split('const ORIGINAL_ARTICLES: Article[] = [')[1]?.split('const ARTICLES: Article[] =')[0] || '';
const legacyIDs = [...before.matchAll(/\{\s*id:(\d+),\s*goal:/g)].map(match => Number(match[1]));
const written = [...first, ...second, ...third, ...privacyA, ...privacyB, ...securityA, ...securityB, ...windowsA, ...windowsB, ...networkA, ...networkB, ...gamingA, ...gamingB, ...repairA, ...repairB];
const all = [...written, ...legacyIDs.map(id => ({ id }))];

assert(titles.length === 200 && new Set(titles).size === 200, 'Hay exactamente 200 titulares únicos');
assert(groups.length === 7 && groups[0].start === 1 && groups.at(-1).end === 200, 'Siete bloques cubren el índice completo');
assert(groups.every((g, i) => g.end >= g.start && (i === 0 || g.start === groups[i - 1].end + 1)), 'Bloques consecutivos sin huecos');
assert(first.length === 20 && second.length === 20, 'Se desarrollaron 40 investigaciones iniciales');
assert(first.every((v, i) => v.id === i + 1) && second.every((v, i) => v.id === i + 21), 'Las investigaciones 001-040 conservan numeración');
assert(legacyIDs.length === 6, 'Se conservan seis artículos originales destacados');
assert(third.length === 10 && third.every((v, i) => v.id === i + 41), 'Investigaciones 041–050 desarrolladas');
assert(privacyA.length === 11 && privacyA.every((v,i) => v.id === [53,55,56,57,58,59,60,61,62,63,64][i]), 'Privacidad 053 y 055–064 desarrollada');
assert(privacyB.length === 11 && privacyB.every((v,i) => v.id === i + 65), 'Privacidad 065–075 desarrollada');
assert(securityA.length === 12 && securityA.every((v,i)=>v.id === i + 76), 'Seguridad 076–087 desarrollada');
assert(securityB.length === 13 && securityB.every((v,i)=>v.id === i + 88), 'Seguridad 088–100 desarrollada');
assert(windowsA.length === 11 && windowsA.every((v,i) => v.id === [101,103,104,105,106,107,108,109,110,111,112][i]), 'Windows extremo A cubre 101 y 103–112');
assert(windowsB.length === 13 && windowsB.every((v,i) => v.id === i + 113), 'Windows extremo B cubre 113–125');
assert(networkA.length === 12 && networkA.every((v,i) => v.id === [126,128,129,130,131,132,133,134,135,136,137,138][i]), 'Redes A cubre 126 y 128–138');
assert(networkB.length === 12 && networkB.every((v,i) => v.id === i + 139), 'Redes B cubre 139–150');
assert(gamingA.length === 12 && gamingA.every((v,i) => v.id === i+151), 'Gaming A cubre 151–162');
assert(gamingB.length === 13 && gamingB.every((v,i) => v.id === i+163), 'Gaming B cubre 163–175');
assert(repairA.length === 11 && repairA.every((v,i)=>v.id===i+176), 'Reparación A cubre 176–186');
assert(repairB.length === 13 && repairB.every((v,i)=>v.id===i+188), 'Reparación B cubre 188–200');
assert(all.length === 200 && new Set(all.map(x => x.id)).size === 200, 'Hay 200 guías iniciales disponibles sin números repetidos');
assert(Array.from({length:200},(_,i)=>i+1).every(id=>all.some(a=>a.id===id)), 'El índice 001–200 tiene guías disponibles');
assert(Array.from({length:175},(_,i)=>i+1).every(id=>all.some(a=>a.id===id)), 'Investigaciones 001–175 tienen guías disponibles');
assert(Array.from({length:150},(_,i)=>i+1).every(id=>all.some(a=>a.id===id)), 'Investigaciones 001–150 tienen guías disponibles');
assert(Array.from({length:125},(_,i)=>i+1).every(id=>all.some(a=>a.id===id)), 'Investigaciones 001–125 tienen guías disponibles');

const forbidden = /\b(?:Remove-Item|Stop-Service|Set-Service|Stop-Process|Clear-Tpm|Format-Volume|Disable-NetAdapter|Set-MpPreference|Set-ItemProperty|Restart-Computer)\b|(?:bcdedit\s*\/(?:set|delete|import))|(?:reg\s+delete)/i;
for (const article of written) {
  assert(article.goal?.length > 28 && article.basics?.length > 80, 'Introducción legible: ' + article.id);
  assert(article.tip?.length > 35 && article.warning?.length > 35 && article.challenge?.length > 30, 'Consejo, precaución y desafío: ' + article.id);
  assert(article.steps.length === 3 && article.steps.every(s => s.title && s.why?.length > 25 && s.expect?.length > 15), 'Tres pasos explicados: ' + article.id);
  assert(article.steps.filter(s => s.code?.trim()).length >= 2, 'Comandos demostrables: ' + article.id);
  assert(article.steps.every(s => !s.code || !forbidden.test(s.code)), 'Sin comandos de cambio destructivo: ' + article.id);
}
assert(['...EVO_MAGAZINE_FIRST_BATCH','...EVO_MAGAZINE_SECOND_BATCH','...EVO_MAGAZINE_THIRD_BATCH','...EVO_MAGAZINE_PRIVACY_A','...EVO_MAGAZINE_PRIVACY_B','...EVO_MAGAZINE_SECURITY_A','...EVO_MAGAZINE_SECURITY_B','...EVO_MAGAZINE_WINDOWS_A','...EVO_MAGAZINE_WINDOWS_B','...EVO_MAGAZINE_NETWORK_A','...EVO_MAGAZINE_NETWORK_B','...EVO_MAGAZINE_GAMING_A','...EVO_MAGAZINE_GAMING_B','...EVO_MAGAZINE_REPAIR_A','...EVO_MAGAZINE_REPAIR_B'].every(term=>view.includes(term)), 'El lector importa los quince bloques de guías');
assert(view.includes('ARTICLES.map(a => renderGuide(a, true))') && view.includes('@page{size:A4'), 'La impresión A4 incluye todas las guías sin cargar los gráficos interactivos');
assert(view.includes('<MagazineArticleHero id={a.id}') && view.includes('magazineArtDirection(item.id)'), 'El lector integra diagramas interiores y tarjetas editoriales tematizadas');
assert(['Visual001','Visual002','Visual003','Visual004','Visual005','Visual006','Visual007','Visual008','Visual009','Visual010'].every(name => visual.includes('function '+name+'()')), 'Las diez primeras investigaciones tienen diez diagramas originales independientes');
assert(visual.includes('if(id===10)return <Visual010/>') && visual.includes('evo-generic-visual') && visual.includes('evo-path-item'), 'Las investigaciones restantes usan mapas técnicos adaptativos');
assert(visual.includes('Visual conceptual · sin datos del equipo') && view.includes('no representan mediciones de tu PC'), 'La escenografía didáctica se distingue de la telemetría real');
assert(view.includes('!printOnly && <MagazineArticleHero'), 'La exportación evita renderizar 200 diagramas complejos');
assert(view.includes("import './Tomo02MagazineEditorial.css'"), 'La revista usa la nueva hoja de estilo editorial');
assert(editorialCSS.includes('.evo-magazine-star .evo-mag-article') && editorialCSS.includes('background:#101b28!important'), 'Las páginas interiores tienen fondo oscuro por defecto');
assert(editorialCSS.includes('@media print') && editorialCSS.includes('background:#fff!important'), 'El PDF mantiene impresión legible sobre fondo blanco');
assert(view.indexOf('<section id="magazine-guide"') < view.indexOf('<section className="evo-index-section'), 'La investigación abre antes del catálogo');
assert(view.includes('visible.map(item=>{') && view.includes('evo-rail-search') && view.includes('evo-rail-filter'), 'La biblioteca lateral permite navegar, buscar y filtrar las 200 investigaciones');
assert(view.includes('evo-code-toolbar') && view.includes('evo-result') && view.includes('evo-tip') && view.includes('evo-warning'), 'Los componentes didácticos emplean jerarquía visual de alto contraste');
assert(view.includes("import './Tomo02MagazinePremium.css'"), 'La edición profesional activa su hoja de diseño');
assert(view.includes('evo-mag-workspace') && view.includes('evo-mag-sidebar') && view.includes('evo-mag-reader'), 'Lectura a dos columnas con navegación lateral');
assert(view.includes('evo-reader-pager') && view.includes('previousArticle') && view.includes('nextArticle'), 'Navegación anterior/siguiente desde el propio artículo');
assert(view.includes('data-mobile-open={mobileLibraryOpen}') && premiumCSS.includes('@media(max-width:850px)'), 'La biblioteca se despliega en móviles sin ocultar el lector');
assert(view.includes('evo-mag-notes') && view.includes('evo-reader-completion') && view.includes('aria-pressed={Boolean(reviewed[selected.id])}'), 'Cuaderno y revisión integrados en el artículo');
assert(premiumCSS.includes('font-family:var(--ev-display)') && premiumCSS.includes('--ev-text:'), 'Tipografías editoriales reutilizan la identidad de EVO LABS');
assert(premiumCSS.includes('@media print') && premiumCSS.includes('background:white!important'), 'La edición PDF impresa conserva papel blanco y texto legible');
assert(view.includes('evo-cover-system') && view.includes('Esquema de aprendizaje · no es telemetría del equipo'), 'La portada usa ilustración técnica explícitamente conceptual');
assert(view.includes('steps={a.steps.map(step=>step.title)}') && visual.includes('(steps.length?steps:'), 'El mapa visual usa los pasos reales de cada artículo');
assert(premiumCSS.includes('.evo-generic-path') && premiumCSS.includes('.evo-rail-item.is-active'), 'Las guías y el índice tienen identidades visuales consistentes');


assert(view.includes('reviewedCount') && view.includes('evo_magazine02_reviewed_v1'), 'Existe seguimiento local explícitamente no certificado');
assert(view.includes('evo_magazine02_notes_v1') && view.includes('onBlur={e=>saveNote'), 'Cada guía ofrece notas locales para registrar resultados');
assert(view.includes('navigator.clipboard.writeText') && view.includes('Copiar comando'), 'Los comandos pueden copiarse desde el lector');
assert(wrapper.includes("subView === 'pdf_magazine' || subView === 'a4_magazine'"), 'Las rutas de PDF y A4 van al mismo magazine');
assert(cover.includes('btn-magazine-estrella-tomo02'), 'El magazine es accesible desde portada');
assert(wrapper.includes("if (subView === 'index')"), 'Se conserva el acceso a la Biblia Virtual');
const sectorMap = readJSON(bridge, /EVO_MAGAZINE_RELATED_SECTORS: Record<number, readonly string\[\]> = ([\s\S]*);\s*$/, 'Puentes al índice canónico');
const canonicalNums = [...canon.matchAll(/sectorNumber:\s*'(\d\d)'/g)].map(m => m[1]);
const canonicalSubids = [...canon.matchAll(/\{\s*id:\s*'(\d\d\.\d\d)'/g)].map(m => m[1]);
const canonicalCounts = [...canon.matchAll(/investigationsCount:\s*(\d+)/g)].map(m => Number(m[1]));
assert(canonicalNums.length === 40 && new Set(canonicalNums).size === 40, 'El índice virtual tiene 40 sectores únicos');
assert(canonicalSubids.length >= 700 && new Set(canonicalSubids).size === canonicalSubids.length, 'El subíndice canónico conserva sus identificadores únicos');
assert(canonicalCounts.reduce((a,b)=>a+b,0) === canonicalSubids.length, 'El total canónico concuerda con la suma de investigaciones');
assert(all.every(item=>Array.isArray(sectorMap[item.id]) && sectorMap[item.id].length && sectorMap[item.id].every(s=>canonicalNums.includes(s))), 'Las 200 guías tienen puentes válidos a la Biblia Virtual');
assert(view.includes('TOMO_02_MASTER_SECTORS.map') && view.includes('evo-canonical-sector'), 'El PDF A4 contiene apéndice del índice canónico');
assert(wrapper.includes('onOpenSector={handleOpenOriginalSector}'), 'Los enlaces de investigación abren el sector técnico correspondiente');

process.stdout.write('EVO MAGAZINE: ' + passed.length + ' verificaciones OK; 200 títulos, 200 guías, 7 bloques.\n');
