#!/usr/bin/env node
/**
 * Preflight de sintaxis TSX del Magazine/Biblia Virtual Tomo 02.
 * Detecta errores de parser sin exigir que se configure Firebase ni arrancar el servidor.
 */
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const paths = [
  'src/components/tomo02/Tomo02WindowsEditorialArt.tsx',
  'src/components/tomo02/Tomo02VisualAtlas.tsx',
  'src/components/tomo02/Tomo02Magazine40.tsx',
  'src/components/tomo02/Tomo02Cover.tsx',
  'src/components/tomo02/Tomo02MagazineView.tsx',
  'src/components/tomo02/Tomo02MasterPage.tsx'
];

let failures = 0;
for (const path of paths) {
  const src = readFileSync(resolve(process.cwd(), path), 'utf8');
  const ast = ts.createSourceFile(path, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const errors = ast.parseDiagnostics ?? [];
  if (!errors.length) {
    process.stdout.write('OK TSX · ' + path + '\n');
    continue;
  }
  for (const diag of errors) {
    failures++;
    const pos = ast.getLineAndCharacterOfPosition(diag.start ?? 0);
    process.stderr.write('ERROR · ' + path + ':' + (pos.line + 1) + ':' + (pos.character + 1) + ' · ' +
      ts.flattenDiagnosticMessageText(diag.messageText, '\n') + '\n');
  }
}
if (failures) {
  process.stderr.write('EVO LABS: ' + failures + ' errores de sintaxis TSX. No publicar.\n');
  process.exitCode = 1;
} else {
  process.stdout.write('EVO LABS: sintaxis TSX válida en ' + paths.length + ' componentes críticos del Tomo 02.\n');
}
