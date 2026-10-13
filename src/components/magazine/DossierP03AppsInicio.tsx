import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { SemaforoEvo } from './SemaforoEvo';
import { MousePointerClick, ShieldCheck, ToggleRight, HardDrive, Check, X, AlertCircle } from 'lucide-react';

interface StartupAppItem {
  nombre: string;
  categoria: string;
  impactoBoot: 'BAJO' | 'MEDIO' | 'ALTO';
  semaforo: 'verde' | 'amarillo' | 'rojo';
  criterio: string;
}

const APPS_INICIO: StartupAppItem[] = [
  {
    nombre: 'Spotify',
    categoria: 'Música / Streaming',
    impactoBoot: 'ALTO',
    semaforo: 'verde',
    criterio: 'Desactivar del inicio. Cuando quieras escuchar música, hacés doble clic: abre en segundos con tus playlists intactas.',
  },
  {
    nombre: 'Steam Client',
    categoria: 'Plataforma Gaming',
    impactoBoot: 'ALTO',
    semaforo: 'verde',
    criterio: 'Desactivar del inicio. No jugamos todo el día. Doble clic cuando vayas a jugar y arranca normalmente.',
  },
  {
    nombre: 'Discord',
    categoria: 'Comunicación',
    impactoBoot: 'ALTO',
    semaforo: 'verde',
    criterio: 'Desactivar del arranque. Mantené el control: abrilo solo cuando te conectes con tus canales o amigos.',
  },
  {
    nombre: 'Epic Games Launcher',
    categoria: 'Lanzador Gaming',
    impactoBoot: 'ALTO',
    semaforo: 'verde',
    criterio: 'Desactivar. Abrilo únicamente cuando vayas a canjear un juego gratuito o abrir un título de tu biblioteca.',
  },
  {
    nombre: 'Microsoft OneDrive',
    categoria: 'Sincronización Cloud',
    impactoBoot: 'MEDIO',
    semaforo: 'amarillo',
    criterio: 'Conservar si sincronizás carpetas de trabajo activas en tiempo real; desactivar si solo lo usás como respaldo manual.',
  },
  {
    nombre: 'Software de Periféricos RGB (iCUE, Synapse, etc.)',
    categoria: 'Control Iluminación / Macros',
    impactoBoot: 'ALTO',
    semaforo: 'amarillo',
    criterio: 'Si tu mouse o teclado tiene memoria interna, guardá el perfil en el hardware y deshabilitá la suite del inicio.',
  },
  {
    nombre: 'Panel de Audio (Realtek / Waves)',
    categoria: 'Driver de Sonido',
    impactoBoot: 'BAJO',
    semaforo: 'rojo',
    criterio: 'No tocar por rutina. Gestiona la detección física de auriculares en el conector frontal y micrófonos.',
  },
  {
    nombre: 'Windows Security Notification',
    categoria: 'Seguridad Nativa',
    impactoBoot: 'BAJO',
    semaforo: 'rojo',
    criterio: 'No tocar por rutina. Notifica alertas del antivirus nativo y estado del aislamiento de núcleo.',
  },
];

export const DossierP03AppsInicio: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-29"
      pageNumber={29}
      totalPages={46}
      sectionTitle="DOSSIER CENTRAL // PUESTA A PUNTO"
      subSlug="PARTE 03 // APPS DE INICIO"
      accentColor="#EAB308"
    >
      {/* Editorial Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            DOSSIER CENTRAL // ADMINISTRACIÓN DEL INICIO // PÁGINA 03 DE 12
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Apps de Inicio: Desactivar No Es Desinstalar
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          EL PODER DEL DOBLE CLIC CUANDO LO NECESITÁS
        </span>
      </div>

      {/* The Visual Concept: "Desactivar vs Desinstalar" */}
      <div className="bg-[#0b0e15] border border-yellow-500/40 rounded-lg p-2.5 mb-2.5 font-mono-tech">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-yellow-400">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5" />
            EL CONCEPTO EDITORIAL: EL DOBLE CLIC BAJO DEMANDA
          </span>
          <span className="text-zinc-400 text-[9px]">LIBERACIÓN DE MEMORIA Y ARRANQUE // SEGÚN TUS APPS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-2 bg-[#120a0d] border border-rose-500/30 rounded flex items-start gap-2.5">
            <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded shrink-0">
              <X className="w-4 h-4" />
            </div>
            <div>
              <span className="text-rose-400 font-bold block text-[11px]">EL ERROR COMÚN // TODO AL ARRANCAR</span>
              <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mt-0.5">
                Dejar Discord, Spotify, Steam, Epic o utilidades habilitados al arrancar. Tu PC compite por ciclos de CPU al encender y retiene memoria para programas que quizás no uses en todo el día.
              </p>
            </div>
          </div>

          <div className="p-2 bg-[#0a1410] border border-emerald-500/30 rounded flex items-start gap-2.5">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="text-emerald-400 font-bold block text-[11px]">EL CRITERIO EVO // DOBLE CLIC CUANDO LO USÁS</span>
              <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mt-0.5">
                <strong>Desactivar del inicio no borra nada</strong>. El programa sigue intacto en tu disco. ¿Querés escuchar música o jugar? Hacés doble clic en el acceso directo, abre al instante y conserva toda tu biblioteca.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Startup Apps Audit Table with Traffic Light */}
      <div className="bg-[#0e1118] border border-zinc-800 rounded-lg p-2 flex-1 mb-2 font-mono-tech flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-[10px] text-zinc-400 mb-1.5">
          <span className="text-white font-bold uppercase">AUDITORÍA DE APPS DE INICIO HABITUALES // SEMÁFORO EVO</span>
          <span className="text-zinc-500">ADMINISTRADOR DE TAREAS → PESTAÑA APLICACIONES DE ARRANQUE</span>
        </div>

        <div className="space-y-1 overflow-hidden">
          {APPS_INICIO.map((app, idx) => (
            <div
              key={idx}
              className="p-1.5 bg-[#131722] border border-zinc-800/80 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]"
            >
              {/* Name & Semaphore */}
              <div className="flex items-center gap-2 sm:w-1/3">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    app.semaforo === 'verde'
                      ? 'bg-emerald-400'
                      : app.semaforo === 'amarillo'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                />
                <span className="text-white font-bold truncate">{app.nombre}</span>
                <span className="text-zinc-500 text-[9px] hidden lg:inline truncate">({app.categoria})</span>
              </div>

              {/* Impact & Reader Custom PC slot */}
              <div className="flex items-center gap-2 sm:w-1/3 text-[9px]">
                <span className="text-zinc-400">
                  IMPACTO:{' '}
                  <strong
                    className={
                      app.impactoBoot === 'ALTO'
                        ? 'text-amber-400'
                        : app.impactoBoot === 'MEDIO'
                        ? 'text-yellow-300'
                        : 'text-zinc-300'
                    }
                  >
                    {app.impactoBoot}
                  </strong>
                </span>
                <span className="text-zinc-500 border-l border-zinc-700 pl-2">
                  CONSUMO EN TU PC: <strong className="text-yellow-400 font-mono-tech">_____ MB</strong>
                </span>
              </div>

              {/* Criterion */}
              <div className="sm:w-1/3 text-[9px] text-zinc-300 font-sans-editorial line-clamp-1">
                {app.criterio}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-1.5 pt-1 border-t border-zinc-800 text-[9px] text-zinc-400 flex items-center justify-between">
          <span>MÉTODO: Administrador de Tareas (Ctrl+Shift+Esc) → Pestaña Aplicaciones de arranque → Clic derecho → Deshabilitar.</span>
          <span className="text-emerald-400 font-bold">BAJO RIESGO & FÁCIL REVERSIÓN</span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
