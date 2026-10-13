import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';

export const Page05Chapter01: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-05"
      pageNumber={5}
      totalPages={24}
      sectionTitle="CAPÍTULO 01"
      subSlug="PERITAJE // AUDITORÍA DE COMPONENTES"
      accentColor="#EAB308"
    >
      {/* Chapter Title Bar */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            CAPÍTULO 01 // AUDITORÍA PERICIAL
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            ¿Qué PC Tenés Realmente?
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          DESMONTE DE LA FICHA COMERCIAL
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Columns: Investigative Article */}
        <div className="lg:col-span-7 space-y-2 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
          <p className="magazine-dropcap text-zinc-200">
            La mayoría de las personas cree saber qué computadora tiene porque leyó la caja del producto o el folleto de la tienda: "Intel Core i7, 16 GB de RAM, tarjeta gráfica de 8 GB". Sin embargo, en el laboratorio de ingeniería, esas etiquetas son meras simplificaciones comerciales que ocultan las variables que verdaderamente determinan la estabilidad y el rendimiento.
          </p>

          <p className="text-zinc-400 text-[11px]">
            Dos procesadores con el mismo nombre exacto pueden tener <strong>steppings</strong> de silicio distintos, comportamientos térmicos diferentes bajo carga sostenida y curvas de voltaje disímiles. Una memoria RAM etiquetada como "3200 MHz" funciona a 2133 MHz si el perfil XMP/EXPO no fue activado en el BIOS, recortando un 35% de su velocidad sin aviso.
          </p>

          {/* Technical Terminal Box */}
          <div className="p-2.5 bg-[#0a0d14] border border-zinc-800 rounded font-mono-tech text-[10px] space-y-1">
            <div className="flex items-center justify-between text-zinc-500 text-[9px] border-b border-zinc-800/60 pb-1">
              <span className="text-yellow-400 font-bold">POWERSHELL FORENSE // AUDITORÍA DIRECTA</span>
              <span>SIN SOFTWARES DUDOSOS</span>
            </div>
            <p className="text-emerald-400">Get-CimInstance Win32_PhysicalMemory | Select BankLabel, Capacity, Speed, Manufacturer</p>
            <p className="text-zinc-500 text-[9px] italic">
              ↳ Revela la velocidad de reloj real de cada zócalo, el fabricante del chip (Samsung, Hynix, Micron) y si están en canales cruzados.
            </p>
          </div>

          <h4 className="font-display font-bold text-xs text-white uppercase pt-0.5 border-b border-zinc-800 pb-0.5">
            Las 3 Trampas Frecuentes de la Ficha Comercial
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-sans-editorial">
            <div className="p-1.5 bg-[#10131b] border-l-2 border-yellow-400 rounded-r">
              <strong className="text-white block font-mono-tech">1. VRAM de 8 GB</strong>
              Una GPU recortada con bus de 128 bits rinde hasta 35% menos que una con bus de 256 bits, pese a los mismos gigas.
            </div>

            <div className="p-1.5 bg-[#10131b] border-l-2 border-zinc-600 rounded-r">
              <strong className="text-white block font-mono-tech">2. SSDs QLC sin DRAM</strong>
              Los primeros 20 GB vuelan en caché pseudo-SLC; al agotarse, caen a 70 MB/s, más lento que un disco de 2012.
            </div>

            <div className="p-1.5 bg-[#10131b] border-l-2 border-zinc-600 rounded-r">
              <strong className="text-white block font-mono-tech">3. Watts Pico vs Continuos</strong>
              Fuentes baratas que prometen 600W pero entregan menos de 320W en el riel de +12V bajo carga de GPU.
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Forensic Inspection Checklist */}
        <div className="lg:col-span-5 bg-[#0d1017] border border-zinc-800 rounded-lg p-3 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
              <span className="text-[10px] font-mono-tech font-bold uppercase text-yellow-400">
                FICHA DE VERIFICACIÓN FORENSE
              </span>
              <span className="text-[9px] font-mono-tech text-zinc-500">CHECKLIST TÉCNICO</span>
            </div>

            <div className="space-y-1.5 text-[10px] font-mono-tech">
              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded flex justify-between items-center">
                <span className="text-white font-bold">PROCESADOR (CPU)</span>
                <span className="text-zinc-400 text-[9px]">HWiNFO64 // Stepping y TDP real</span>
              </div>

              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded flex justify-between items-center">
                <span className="text-white font-bold">MEMORIA RAM</span>
                <span className="text-zinc-400 text-[9px]">CPU-Z // Perfil XMP y Command Rate</span>
              </div>

              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded flex justify-between items-center">
                <span className="text-white font-bold">TARJETA GRÁFICA</span>
                <span className="text-zinc-400 text-[9px]">GPU-Z // Enlace PCIe x16 vs x8 activo</span>
              </div>

              <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded flex justify-between items-center">
                <span className="text-white font-bold">ALMACENAMIENTO</span>
                <span className="text-zinc-400 text-[9px]">CrystalDiskInfo // Modo Gen3/Gen4</span>
              </div>
            </div>
          </div>

          {/* Photo / Inspection Diagram */}
          <div className="relative rounded overflow-hidden border border-zinc-800 h-24 bg-black">
            <img
              src="/src/assets/images/cap_01_silicon_1789531835511.jpg"
              alt="Inspección pericial de silicio"
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
              <span className="text-[9px] font-mono-tech text-zinc-300">
                FIG 1.1 // Inspección de empaque de silicio y pistas substrate.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-02) */}
      <InternetDiceEvoMide
        idMito="MITO-02"
        consejoPopular="Entrá a MSConfig > Arranque > Opciones avanzadas, tildá 'Número de procesadores' y poné el número máximo (8, 16) para que Windows use todos los núcleos al 100%."
        fuentePopular="Tutoriales virales de 'optimización extrema' de Windows"
        realidadTecnica="Windows Internals (Mark Russinovich) lo confirma: por diseño, Windows SIEMPRE utiliza todos los núcleos e hilos lógicos del CPU. El parámetro NUMPROC del BCD fue creado por Microsoft exclusivamente para desarrolladores que necesitan limitar artificialmente la CPU para reproducir bugs. Tildar la casilla fija el valor: si luego cambiás de procesador, Windows queda bloqueado al CPU viejo, y en procesadores Intel híbridos rompe el Thread Director desactivando núcleos de eficiencia."
        experimento="Medición en Cinebench R23 Multi-Core (3 corridas continuas) con casilla desmarcada (por defecto de fábrica) vs casilla forzada en 16 núcleos."
        herramientaMedicion="Cinebench R23 + Windows Performance Monitor"
        resultado="no-cambio"
        resultadoDetalle="Por defecto: 14.820 pts. Forzado en msconfig: 14.815 pts (Delta: -0.03%, margen de error nulo). Cero mejora, riesgo de fallo al actualizar CPU."
        riesgo="Si tildás erróneamente 'Cantidad máxima de memoria', Windows limitará la RAM a 256MB causando bucle BSOD de arranque."
        comoRevertirlo="Ejecutar msconfig > Arranque > Opciones avanzadas y desmarcar por completo la casilla 'Número de procesadores' para que quede en blanco."
      />
    </MagazineMasterPage>
  );
};
