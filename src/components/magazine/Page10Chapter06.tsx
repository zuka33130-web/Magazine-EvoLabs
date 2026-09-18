import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';

export const Page10Chapter06: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-22"
      pageNumber={22}
      totalPages={24}
      sectionTitle="CAPÍTULO 06"
      subSlug="TALLER PERICIAL // MÉTODO DEDUCTIVO & FALLAS"
      accentColor="#EAB308"
    >
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            CAPÍTULO 06 // TALLER FORENSE
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            El Método Deductivo
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          PROTOCOLOS DE AISLAMIENTO EN 4 PASOS
        </span>
      </div>

      {/* Decision Tree Graphic / Flowchart */}
      <div className="bg-[#0c0d12] border border-yellow-500/30 rounded-lg p-2.5 mb-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 border-b border-zinc-800/80 pb-1 mb-2">
          <span className="text-yellow-400 font-bold uppercase">ÁRBOL FORENSE DE DECISIÓN ANTE ANOMALÍAS</span>
          <span>METROLOGÍA DE DESCARTE RACIONAL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-[#12151e] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">01 // CRONOLOGÍA</span>
            <h4 className="font-display font-bold text-white text-[11px] mt-0.5">¿Qué cambió?</h4>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-0.5 leading-tight">
              ¿Se actualizó un driver, hubo un corte de energía o se conectó un nuevo dispositivo USB en las últimas 72 horas?
            </p>
          </div>

          <div className="p-2 bg-[#12151e] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">02 // AISLAMIENTO</span>
            <h4 className="font-display font-bold text-white text-[11px] mt-0.5">Hardware Mínimo</h4>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-0.5 leading-tight">
              Desconectar periféricos secundarios. Probar con un único módulo de memoria RAM en el slot primario A2.
            </p>
          </div>

          <div className="p-2 bg-[#12151e] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">03 // ESTRÉS</span>
            <h4 className="font-display font-bold text-white text-[11px] mt-0.5">Reproducibilidad</h4>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-0.5 leading-tight">
              Cargar el subsistema sospechoso: TestMem5 para RAM, FurMark para GPU, Prime95 Small FFTs para núcleos de CPU.
            </p>
          </div>

          <div className="p-2 bg-[#12151e] border-t-2 border-yellow-400 rounded">
            <span className="text-[9px] font-mono-tech text-yellow-400 font-bold block">04 // VALIDACIÓN</span>
            <h4 className="font-display font-bold text-white text-[11px] mt-0.5">Prueba Inversa</h4>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-0.5 leading-tight">
              Aplicar la contramedida y someter el equipo a 2 horas continuas de estrés sin ninguna advertencia WHEA.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
        <div className="md:col-span-7 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            Ante una falla técnica (una pantalla azul, un congelamiento o un reinicio espontáneo), el reflejo instintivo del usuario es el pánico: formatear el disco o comprar una fuente nueva. Pero en la práctica forense, el síntoma casi nunca es la causa.
          </p>
          <p className="text-zinc-400 text-[11px]">
            Un error <em>MEMORY_MANAGEMENT</em> no significa necesariamente que la RAM esté rota: puede significar que el controlador de memoria (IMC) del CPU tiene un voltaje VDDQ insuficiente, o que un sector del disco NVMe se corrompió.
          </p>
        </div>

        <div className="md:col-span-5 bg-[#0c0d12] border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
          <div className="space-y-1 text-[9px] font-mono-tech">
            <span className="text-yellow-400 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-0.5">
              PATRONES DE COLAPSO INMEDIATOS
            </span>
            <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/60">
              <span className="text-zinc-300">CORTE NEGRO DIRECTO:</span>
              <span className="text-rose-400 font-bold">OCP/OPP DE FUENTE</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/60">
              <span className="text-zinc-300">FREEZE CON AUDIO EN BUCLE:</span>
              <span className="text-amber-400 font-bold">TDR TIMEOUT / GPU</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-300">REINICIO EN REPOSO/IDLE:</span>
              <span className="text-sky-400 font-bold">CURVE OPTIMIZER / C-STATES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-07) */}
      <InternetDiceEvoMide
        idMito="MITO-07"
        consejoPopular="Pasá DDU (Display Driver Uninstaller) en modo seguro cada vez que actualices el driver de video o tengas cualquier error en un juego."
        fuentePopular="Comentarios habituales en foros de soporte"
        realidadTecnica="DDU es una herramienta forense de rescate imprescindible al cambiar de marca (AMD a NVIDIA o viceversa) o ante corrupciones graves. Sin embargo, usarlo de rutina borra todo el 'Shader Cache' (caché compilado de sombreadores de DirectX y Vulkan). Durante las siguientes 2 a 4 horas de juego, el CPU se ve forzado a compilar shaders al vuelo, provocando tirones y caídas de frames brutales que el usuario confunde con un driver defectuoso."
        experimento="Evaluación de frametimes en Hogwarts Legacy y Cyberpunk 2077 durante los primeros 20 minutos de juego tras pasar DDU innecesariamente en un sistema sano."
        herramientaMedicion="CapFrameX + Visor de Frametime de RivaTuner (RTSS)"
        resultado="condicional"
        resultadoDetalle="1% Lows cayeron a 14 FPS durante la primera sesión debido a la compilación en tiempo real de shaders perdidos. DDU debe usarse como bisturí, no como escoba diaria."
        riesgo="Pérdida de perfiles de juego, calibración de color y tartamudeo inevitable post-limpieza."
        comoRevertirlo="Actualizar drivers con la opción oficial 'Instalación rápida' o 'Instalación limpia' del fabricante; reservar DDU solo ante cambio físico de placa o fallas de inicio."
      />
    </MagazineMasterPage>
  );
};
