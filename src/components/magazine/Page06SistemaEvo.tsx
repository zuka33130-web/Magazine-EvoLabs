import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { 
  HelpCircle, 
  Sparkles, 
  Terminal, 
  Scale, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle, 
  FolderArchive, 
  RotateCcw 
} from 'lucide-react';

export const Page06SistemaEvo: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-06"
      pageNumber={6}
      totalPages={46}
      sectionTitle="SISTEMA & ARCHIVO"
      subSlug="METODOLOGÍA DE LECTURA // TU EXPEDIENTE PERSONAL"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Header */}
      <div className="mb-3.5 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            CONVENCIONES EDITORIALES // GUÍA DE NAVEGACIÓN TÉCNICA
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            Cómo leer este tomo y tu Archivo EVO
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          REF: EVO-SYS-001
        </span>
      </div>

      {/* Main Grid: 2 Columns (Sistema de Bloques + Archivo EVO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        
        {/* Left 7 cols: Sistema de Lectura (Los 9 Bloques de Identidad) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="border-b border-zinc-800/80 pb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono-tech font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 rounded-xs" />
              SISTEMA DE LECTURA // BLOQUES MODULARES DE IDENTIDAD
            </span>
            <span className="text-[9px] font-mono-tech text-zinc-500">
              RECONOCELOS EN CADA CAPÍTULO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-tech text-[10px]">
            
            {/* 1. Primera Vez */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>¿PRIMERA VEZ?</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                Explicación de base desde cero. Ningún término técnico queda sin traducir.
              </p>
            </div>

            {/* 2. Truco EVO */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRUCO EVO</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                Atajo, comando o función nativa poco conocida pero de enorme impacto.
              </p>
            </div>

            {/* 3. Lab EVO */}
            <div className="p-2.5 bg-[#0f121a] border border-yellow-500/40 rounded-md bg-yellow-400/5">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>LAB EVO</span>
              </div>
              <p className="text-[9px] text-zinc-300 font-sans-editorial leading-snug">
                Práctica guiada en PowerShell o consola sin software de terceros.
              </p>
            </div>

            {/* 4. Internet Dice / EVO Mide */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
                <Scale className="w-3.5 h-3.5" />
                <span>INTERNET DICE</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                Mito viral sometido a banco de pruebas y medición con instrumental.
              </p>
            </div>

            {/* 5. EVO+ */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>EVO+ (AVANZADO)</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                Profundización técnica, microcódigo, registros y telemetría pericial.
              </p>
            </div>

            {/* 6. Cuidado */}
            <div className="p-2.5 bg-[#0f121a] border border-red-900/50 rounded-md bg-red-950/20">
              <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>CUIDADO</span>
              </div>
              <p className="text-[9px] text-zinc-300 font-sans-editorial leading-snug">
                Riesgo de daño térmico, inestabilidad o pérdida de dependencias.
              </p>
            </div>

            {/* 7. Resultado */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>RESULTADO</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                Cómo interpretar los números obtenidos y saber si la prueba fue exitosa.
              </p>
            </div>

            {/* 8. Expediente EVO */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                <FolderArchive className="w-3.5 h-3.5" />
                <span>EXPEDIENTE EVO</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                Los datos exactos que debés archivar en tu bitácora forense.
              </p>
            </div>

            {/* 9. Retorno Seguro */}
            <div className="p-2.5 bg-[#0f121a] border border-zinc-800 rounded-md">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold mb-1">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETORNO SEGURO</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-snug">
                El paso a paso exacto para volver atrás y restaurar el estado previo.
              </p>
            </div>

          </div>

          {/* Cita de Cierre del Sistema */}
          <div className="p-2.5 bg-black/40 border border-zinc-800 rounded text-[11px] font-sans-editorial text-zinc-300">
            <span className="text-yellow-400 font-bold font-mono-tech uppercase text-[9.5px]">REGLA DE CONFIANZA:</span> Ningún ajuste se realiza a ciegas. Siempre que un capítulo propone una intervención, primero se explica el riesgo, luego se mide la base y finalmente se entrega el método de retorno.
          </div>
        </div>

        {/* Right 5 cols: Tu Archivo EVO (Concepto y Soberanía de Datos) */}
        <div className="lg:col-span-5 bg-[#0d1017] border border-zinc-800 rounded-xl p-4 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-[10px] font-mono-tech font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <FolderArchive className="w-3.5 h-3.5 text-yellow-400" />
              TU ARCHIVO EVO // SOBERANÍA TOTAL
            </span>
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold">
              EN TU DISCO LOCAL
            </span>
          </div>

          <div className="text-xs font-sans-editorial space-y-3 text-zinc-300 leading-relaxed">
            <p>
              A diferencia de las herramientas que envían telemetría opaca a servidores remotos, en EVO LABS sostenemos un principio inviolable: <strong className="text-white">el expediente de tu PC te pertenece exclusivamente a vos</strong>.
            </p>

            <div className="p-3 bg-[#131620] border border-yellow-400/30 rounded-lg space-y-2 font-mono-tech text-[10px]">
              <span className="text-yellow-400 font-bold uppercase tracking-wider block">
                CARPETA DE EXPEDIENTE RECOMENDADA:
              </span>
              <p className="text-zinc-400 bg-black/70 p-2 rounded border border-zinc-800">
                C:\EVO_LABS\TOMO_01_EXPEDIENTE\
              </p>
              <div className="text-zinc-300 space-y-1 text-[9.5px]">
                <p>📁 <span className="text-white">00_BASELINE/</span> (Capturas y HWInfo inicial)</p>
                <p>📁 <span className="text-white">01_TELEMETRIA/</span> (CSVs de frametimes y DPC)</p>
                <p>📁 <span className="text-white">02_AUDITORIA_WIN/</span> (Informes de servicios y tareas)</p>
                <p>📁 <span className="text-white">03_COMPARATIVAS_AB/</span> (Gráficas antes y después)</p>
              </div>
            </div>

            <p className="text-[11.5px] text-zinc-400">
              No necesitas instalar aplicaciones invasivas. A lo largo del tomo utilizaremos la consola PowerShell nativa y programas portables de código abierto que no requieren instalación residente en el arranque.
            </p>

            <div className="p-2.5 bg-yellow-400/10 border-l-2 border-yellow-400 rounded-r text-[10.5px] text-zinc-200">
              <strong className="text-yellow-400">Objetivo del Tomo 01:</strong> Al cerrar la última página, tendrás un informe pericial completo de tu computadora que ningún servicio técnico improvisado podrá refutar.
            </div>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
