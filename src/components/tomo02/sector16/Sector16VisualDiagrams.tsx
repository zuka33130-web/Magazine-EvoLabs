import React, { useState } from 'react';
import {
  Printer,
  Usb,
  Bluetooth,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Layers,
  Zap,
  ArrowRight,
  FolderTree,
  Radio,
  Volume2,
} from 'lucide-react';

export const Sector16VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'SPOOLER_LIFECYCLE' | 'USB_DESCRIPTOR_FAIL' | 'BLUETOOTH_HCI_FASTBOOT' | 'WSD_VS_TCPIP'
  >('SPOOLER_LIFECYCLE');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Printer className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 16</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE PERIFÉRICOS, PRINT SPOOLER, BUS USB Y BLUETOOTH
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Ciclo de vida de archivos .SHD/.SPL, enumeración eléctrica USB, pila HCI Bluetooth y puertos WSD vs RAW 9100
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('SPOOLER_LIFECYCLE')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'SPOOLER_LIFECYCLE'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Ciclo Spooler & Deadlock (.SHD/.SPL)
            </button>
            <button
              onClick={() => setActiveDiagram('USB_DESCRIPTOR_FAIL')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'USB_DESCRIPTOR_FAIL'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. Enumeración USB & Descriptor Fail
            </button>
            <button
              onClick={() => setActiveDiagram('BLUETOOTH_HCI_FASTBOOT')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'BLUETOOTH_HCI_FASTBOOT'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Bluetooth HCI & Fast Startup S4
            </button>
            <button
              onClick={() => setActiveDiagram('WSD_VS_TCPIP')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'WSD_VS_TCPIP'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. WSD Multicast vs TCP/IP RAW 9100
            </button>
          </div>
        </div>

        {/* Diagram 1: Spooler Lifecycle */}
        {activeDiagram === 'SPOOLER_LIFECYCLE' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">FASE 1: CREACIÓN</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px]">
                    SPOOLING
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-slate-300">
                    <strong>00042.SHD:</strong> Metadatos del trabajo (Dueño, Páginas, Permisos).
                  </div>
                  <div className="text-slate-300">
                    <strong>00042.SPL:</strong> Flujo binario rasterizado (EMF/PCL/PostScript).
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  La aplicación deposita el trabajo en C:\Windows\System32\spool\PRINTERS y queda liberada.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">FASE 2: DEADLOCK</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">
                    LOCKED HANDLE
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-slate-300">
                    <strong>Fallo de puerto:</strong> Cable cortado o buffer de impresora colgado.
                  </div>
                  <div className="text-amber-300">
                    <strong>Handle abierto:</strong> spoolsv.exe retiene el lock NTFS de lectura.
                  </div>
                  <div className="text-rose-400">
                    <strong>Estado en GUI:</strong> "Eliminando..." clavado por horas.
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Windows no puede borrar el archivo porque el sistema de archivos prohíbe eliminar archivos abiertos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">FASE 3: PURGA CANÓNICA</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                    CLEAN RESTART
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-cyan-300">1. net stop spooler (libera handles)</div>
                  <div className="text-emerald-400">2. del /Q /F ...\PRINTERS\* (elimina .SPL/.SHD)</div>
                  <div className="text-cyan-300">3. net start spooler (cola limpia a 0)</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  El servicio arranca con memoria vacía y la cola vuelve a estar operativa de inmediato.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-300 font-mono">Por qué reiniciar la PC no sirve: </strong>
                Dado que los archivos .SHD y .SPL se almacenan en el disco duro por tolerancia a fallos, al reiniciar Windows el servicio <code>spoolsv.exe</code> los vuelve a leer y reproduce el atascamiento una y otra vez.
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: USB Descriptor Fail */}
        {activeDiagram === 'USB_DESCRIPTOR_FAIL' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
                  <Usb className="w-4 h-4" />
                  <span>PROTOCOLO DE ENUMERACIÓN USB NORMAL</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>1. Enchufe físico:</span>
                    <span className="text-cyan-400">Pull-up en D+ (1.5k a 3.3V)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>2. Bus Reset:</span>
                    <span className="text-slate-300">SE0 durante 10-20 ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>3. GET_DESCRIPTOR:</span>
                    <span className="text-emerald-400">Endpoint 0 retorna 18 bytes</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>4. SET_ADDRESS:</span>
                    <span className="text-cyan-300">Asignación de ID único en bus</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>5. PnP Matching:</span>
                    <span className="text-emerald-400">Match con VID/PID en Driver Store</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/40 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold pb-2 border-b border-slate-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>FALLO DE DESCRIPTOR (CÓDIGO 43)</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-rose-900/40 space-y-1">
                    <span className="text-rose-400 font-bold block">Causas Físicas Reales:</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      <li>Pista cortada o soldadura fría en líneas D+/D-.</li>
                      <li>Caída de tensión VBUS por hub sin alimentación externa.</li>
                      <li>Cable USB dañado o resistencia de contacto por suciedad.</li>
                    </ul>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold block">Reacción de Windows:</span>
                    <p className="text-slate-400">
                      Windows reintenta 3 veces. Si la respuesta es ruido eléctrico o 0xFF, apaga el puerto y reporta: <code>USB\DEVICE_DESCRIPTOR_FAILURE</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: Bluetooth HCI & Fast Startup */}
        {activeDiagram === 'BLUETOOTH_HCI_FASTBOOT' && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 font-mono text-xs">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-3">
                EL CONFLICTO ENTRE EL INICIO RÁPIDO (S4) Y EL RIEL 5VSB
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-3">
                  <span className="font-bold text-rose-400 text-xs block">
                    ESCENARIO FALLIDO: FAST STARTUP + 5VSB
                  </span>
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div>1. Usuario hace clic en "Apagar el equipo".</div>
                    <div>2. Windows entra en hibernación del kernel (S4 híbrido).</div>
                    <div className="text-amber-300">3. La fuente de poder mantiene activo el riel 5V Standby.</div>
                    <div className="text-rose-400">
                      4. El chip Bluetooth queda energizado con firmware en bucle zombi.
                    </div>
                    <div className="text-rose-400">
                      5. Al encender, el handshake HCI falla y Windows oculta la radio.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3">
                  <span className="font-bold text-emerald-400 text-xs block">
                    ESCENARIO RESUELTO: COLD POWER CYCLE (S5)
                  </span>
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div>1. Se desactiva el Inicio Rápido o se desconecta la corriente.</div>
                    <div className="text-emerald-400">2. Se descargan los capacitores de la placa madre.</div>
                    <div>3. El silicio Bluetooth pierde tensión absoluta (0V).</div>
                    <div className="text-emerald-400">
                      4. Al volver la energía, el chip ejecuta su Power-On Reset (POR).
                    </div>
                    <div className="text-cyan-300">5. El microcódigo se carga limpio y el botón reaparece.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: WSD vs TCP/IP RAW */}
        {activeDiagram === 'WSD_VS_TCPIP' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-rose-400">PUERTO WSD (WS-DISCOVERY)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300">FRÁGIL</span>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-300 list-disc list-inside font-sans">
                <li>Depende de mensajes multicast UDP en el puerto 3702.</li>
                <li>Si el router bloquea multicast o cambia la IP por DHCP, se pierde el enlace.</li>
                <li>Frecuente estado "Impresora sin conexión" fantasma.</li>
                <li>Inadecuado para entornos corporativos o VLANs separadas.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-emerald-400">PUERTO TCP/IP ESTÁNDAR (RAW 9100)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">ROBUSTO</span>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-300 list-disc list-inside font-sans">
                <li>Conexión TCP directa de socket punto a punto en puerto 9100.</li>
                <li>Requiere IP fija en la impresora (reserva DHCP o estática).</li>
                <li>Inmune a caídas de descubrimiento multicast.</li>
                <li>Desmarcando "Estado SNMP" nunca entra en falso offline.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
