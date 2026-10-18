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
];
const view = file('src/components/tomo02/Tomo02MagazineEstrella.tsx');
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
const before = view.split('const ORIGINAL_ARTICLES: Article[] = [')[1]?.split('const ARTICLES: Article[] =')[0] || '';
const legacyIDs = [...before.matchAll(/\{\s*id:(\d+),\s*goal:/g)].map(match => Number(match[1]));
const all = [...first, ...second, ...legacyIDs.map(id => ({ id }))];

assert(titles.length === 200 && new Set(titles).size === 200, 'Hay exactamente 200 titulares únicos');
assert(groups.length === 7 && groups[0].start === 1 && groups.at(-1).end === 200, 'Siete bloques cubren el índice completo');
assert(groups.every((g, i) => g.end >= g.start && (i === 0 || g.start === groups[i - 1].end + 1)), 'Bloques consecutivos sin huecos');
assert(first.length === 20 && second.length === 20, 'Se desarrollaron 40 investigaciones iniciales');
assert(first.every((v, i) => v.id === i + 1) && second.every((v, i) => v.id === i + 21), 'Las investigaciones 001-040 conservan numeración');
assert(legacyIDs.length === 6, 'Se conservan seis artículos originales destacados');
assert(all.length === 46 && new Set(all.map(x => x.id)).size === 46, 'Hay 46 investigaciones disponibles sin números repetidos');

const forbidden = /\b(?:Remove-Item|Stop-Service|Set-Service|Stop-Process|Clear-Tpm|Format-Volume|Disable-NetAdapter|Set-MpPreference|Set-ItemProperty|Restart-Computer)\b|(?:bcdedit\s*\/(?:set|delete|import))|(?:reg\s+delete)/i;
for (const article of [...first, ...second]) {
  assert(article.goal?.length > 28 && article.basics?.length > 80, 'Introducción legible: ' + article.id);
  assert(article.tip?.length > 35 && article.warning?.length > 35 && article.challenge?.length > 30, 'Consejo, precaución y desafío: ' + article.id);
  assert(article.steps.length === 3 && article.steps.every(s => s.title && s.why?.length > 25 && s.expect?.length > 15), 'Tres pasos explicados: ' + article.id);
  assert(article.steps.filter(s => s.code?.trim()).length >= 2, 'Comandos demostrables: ' + article.id);
  assert(article.steps.every(s => !s.code || !forbidden.test(s.code)), 'Sin comandos de cambio destructivo: ' + article.id);
}
assert(view.includes('...EVO_MAGAZINE_FIRST_BATCH') && view.includes('...EVO_MAGAZINE_SECOND_BATCH'), 'El lector importa los dos bloques');
assert(view.includes('ARTICLES.map(renderGuide)') && view.includes('@page{size:A4'), 'La impresión A4 incluye todas las guías');
assert(view.includes('reviewedCount') && view.includes('evo_magazine02_reviewed_v1'), 'Existe seguimiento local explícitamente no certificado');
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
assert(all.every(item=>Array.isArray(sectorMap[item.id]) && sectorMap[item.id].length && sectorMap[item.id].every(s=>canonicalNums.includes(s))), 'Las 46 guías tienen puentes válidos a la Biblia Virtual');
assert(view.includes('TOMO_02_MASTER_SECTORS.map') && view.includes('evo-canonical-sector'), 'El PDF A4 contiene apéndice del índice canónico');
assert(wrapper.includes('onOpenSector={handleOpenOriginalSector}'), 'Los enlaces de investigación abren el sector técnico correspondiente');

process.stdout.write('EVO MAGAZINE: ' + passed.length + ' verificaciones OK; 200 títulos, 46 guías, 7 bloques.\n');
