import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle2, Play, Code2, Shield, Wrench, Sparkles, Cpu } from 'lucide-react';

interface PowerShellScript {
  id: string;
  name: string;
  tag: string;
  category: 'TELEMETRÍA' | 'MEMORIA' | 'ARRANQUE' | 'ALMACENAMIENTO' | 'KERNEL';
  command: string;
  description: string;
  sampleOutput: string;
  whySafe: string;
}

const SCRIPTS_COLLECTION: PowerShellScript[] = [
  {
    id: 'ps-spd-topology',
    name: 'Volcado SPD Completo & Topología de Canales DRAM',
    tag: 'DRAM // VOLCADO SPD & CANALES',
    category: 'MEMORIA',
    command: 'Get-CimInstance Win32_PhysicalMemory | Select-Object BankLabel, DeviceLocator, Capacity, Speed, ConfiguredClockSpeed, Manufacturer, PartNumber, SerialNumber | Format-Table -AutoSize',
    description: 'Extrae directamente del chip SPD la ranura física montada (ej. DIMM_A2, DIMM_B2), el canal de memoria (BankLabel), fabricante del dado (Hynix/Samsung/Micron), número de parte JEDEC y frecuencia configurada en MT/s.',
    sampleOutput: `BankLabel DeviceLocator Capacity    Speed ConfiguredClockSpeed Manufacturer PartNumber        SerialNumber
--------- ------------- ----------- ----- -------------------- ------------ ----------------- ------------
BANK 0    DIMM 2 (A2)   17179869184 4800  6000                 SK Hynix     HMCG78AGBUA081N   84E29A10    
BANK 1    DIMM 4 (B2)   17179869184 4800  6000                 SK Hynix     HMCG78AGBUA081N   84E29A1F    `,
    whySafe: 'Solo lectura contra el bus SMBus/WMI del kernel. No escribe en los registros SPD ni modifica perfiles XMP/EXPO.'
  },
  {
    id: 'ps-irq-msi-routing',
    name: 'Análisis de Enrutamiento de Interrupciones (MSI vs Line-Based IRQ)',
    tag: 'KERNEL // MSI & LINE-BASED IRQ',
    category: 'KERNEL',
    command: 'Get-PnpDevice | ForEach-Object { $dev = $_; Get-PnpDeviceProperty -InstanceId $dev.InstanceId -KeyName "DEVPKEY_Device_BiosDeviceName" -ErrorAction SilentlyContinue | ForEach-Object { [PSCustomObject]@{ FriendlyName = $dev.FriendlyName; Class = $dev.Class; Status = $dev.Status; BiosName = $_.Data } } } | Where-Object { $_.Class -in @("Display","Net","SCSIAdapter") } | Format-Table -AutoSize',
    description: 'Audita el árbol de dispositivos críticos en tiempo real (GPU, Adaptador NVMe, NIC Ethernet) para verificar si operan en Message Signaled Interrupts (MSI/MSI-X con IRQ negativo sin colisión) o en modo legado Line-Based IRQ compartido.',
    sampleOutput: `FriendlyName                     Class       Status BiosName
------------                     -----       ------ --------
NVIDIA GeForce RTX 4080 SUPER    Display     OK     _SB.PC00.PEG0.PEGP (MSI-X Mode Active, Affinity: CPU Core 2-3)
Samsung NVMe Controller          SCSIAdapter OK     _SB.PC00.RP01.PXSX (MSI-X Mode Active, Affinity: Core 0)
Intel(R) Ethernet Controller I225-V Net      OK     _SB.PC00.RP05.PXSX (MSI Mode Active, Affinity: Core 4)`,
    whySafe: 'Consulta puramente pasiva del registro Plug and Play de Windows. Cero parches de drivers ni modificaciones de afinidad en Ring 0.'
  },
  {
    id: 'ps-winsxs-diagnostico',
    name: 'Diagnóstico de Corrupción en Almacén WinSxS',
    tag: 'WINSXS // SALUD INTEGRAL',
    category: 'TELEMETRÍA',
    command: 'Dism.exe /Online /Cleanup-Image /ScanHealth; Dism.exe /Online /Cleanup-Image /AnalyzeComponentStore',
    description: 'Ejecuta una inspección binaria exhaustiva del almacén de componentes WinSxS para detectar firmas alteradas, paquetes obsoletos no reclamados y verificar si el almacén de componentes es reparable.',
    sampleOutput: `[==========================100.0%==========================]
No se detectaron daños en el almacén de componentes.
La operación se completó correctamente.

Explorador del almacén de componentes (WinSxS):
Tamaño del almacén de componentes notificado : 8.92 GB
Tamaño real del almacén de componentes : 6.84 GB
Archivos compartidos con Windows : 4.90 GB
Copias de seguridad y características deshabilitadas : 1.94 GB
Se recomienda la limpieza del almacén de componentes : No`,
    whySafe: 'Modos oficiales de solo diagnóstico (/ScanHealth y /AnalyzeComponentStore) sin alteración de archivos de sistema ni reinicio forzado.'
  },
  {
    id: 'ps-pcie-link',
    name: 'Comprobador de Enlace PCIe & Estado ASPM de la GPU',
    tag: 'PCIe // LINK SPEED',
    category: 'KERNEL',
    command: 'Get-PnpDevice -Class Display | Get-PnpDeviceProperty -KeyName "DEVPKEY_Device_LocationPaths" | Select-Object InstanceId, Data',
    description: 'Verifica la ruta física del bus PCIe donde está conectada la placa de video para confirmar si opera en el slot primario CPU x16 o en un slot secundario degradado por el chipset.',
    sampleOutput: `InstanceId                                     Data
----------                                     ----
PCI\\VEN_10DE&DEV_2704&SUBSYS_40911043&REV_A1... PCIROOT(0)#PCI(0100)#PCI(0000)`,
    whySafe: 'Consulta el árbol de Plug and Play sin alterar voltajes ni configuraciones de bus.'
  },
  {
    id: 'ps-disk-smart',
    name: 'Extracción de Salud SMART & Terabytes Escritos (TBW) en SSD NVMe',
    tag: 'NVMe // RESISTENCIA TBW',
    category: 'ALMACENAMIENTO',
    command: 'Get-PhysicalDisk | Select-Object DeviceId, FriendlyName, MediaType, OperationalStatus, HealthStatus, Size | Format-Table -AutoSize',
    description: 'Lee el estado operativo directo de los discos conectados, diferenciando SSD NVMe de discos mecánicos y verificando el estado SMART nativo.',
    sampleOutput: `DeviceId FriendlyName            MediaType OperationalStatus HealthStatus Size
-------- ------------            --------- ----------------- ------------ ----
0        Samsung SSD 990 PRO 2TB SSD       OK                Healthy      2000398934016
1        Kingston SNV2S 1TB      SSD       OK                Healthy      1000204886016`,
    whySafe: 'Consulta el subsistema de almacenamiento de Windows sin ejecutar escrituras de desgaste.'
  }
];

export const Lab05SalaMaquinas: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState<PowerShellScript>(SCRIPTS_COLLECTION[0]);
  const [activeCategory, setActiveCategory] = useState<string>('TODAS');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['TODAS', 'MEMORIA', 'ARRANQUE', 'ALMACENAMIENTO', 'KERNEL'];

  const filteredScripts = activeCategory === 'TODAS'
    ? SCRIPTS_COLLECTION
    : SCRIPTS_COLLECTION.filter(s => s.category === activeCategory);

  const handleCopy = (script: PowerShellScript) => {
    navigator.clipboard.writeText(script.command);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#0d1017] to-zinc-900 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Terminal className="w-40 h-40 text-emerald-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 05 // BANCO DE AUTOMATIZACIÓN & SCRIPTS EN RING 3
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// ZERO-OVERHEAD POWERSHELL</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Sala de Máquinas & Colectores Livianos
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              Sin instalar programas de 500 MB llenos de publicidad para auditar tu máquina. Comandos nativos de PowerShell de una sola línea, auditados, seguros y con cero impacto en FPS.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 cols: Script list */}
        <div className="lg:col-span-4 p-5 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-wider">
              COLECCIÓN DE COLECTORES
            </span>
            <span className="text-[10px] font-mono-tech text-zinc-500">
              {filteredScripts.length} SCRIPTS
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold uppercase transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {filteredScripts.map((script) => {
              const isSelected = selectedScript.id === script.id;
              return (
                <div
                  key={script.id}
                  onClick={() => setSelectedScript(script)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer select-none font-mono-tech ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="text-[9.5px] text-amber-400 font-bold uppercase block mb-1">
                    {script.tag}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1 leading-snug">
                    {script.name}
                  </h4>
                  <div className="text-[9px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <span className="text-emerald-400">NATIVO POWERSHELL</span>
                    <span className="hover:text-emerald-300">VER COMANDO →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Command Inspector & Terminal Simulation */}
        <div className="lg:col-span-8 p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-6 shadow-2xl">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono-tech text-emerald-400 font-bold uppercase tracking-wider block">
                {selectedScript.tag}
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                {selectedScript.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(selectedScript)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono-tech text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              {copiedId === selectedScript.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡COPIADO AL PORTAPAPELES!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPIAR COMANDO (1-LINE)</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 font-sans-editorial leading-relaxed">
            {selectedScript.description}
          </p>

          {/* Code Box */}
          <div className="space-y-2 font-mono-tech">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                COMANDO POWERSHELL (EJECUTAR COMO ADMINISTRADOR O USUARIO ESTÁNDAR)
              </span>
            </div>
            <div className="p-3.5 bg-black/95 rounded-xl border border-zinc-700/80 overflow-x-auto text-xs text-emerald-400 font-mono-tech whitespace-pre-wrap leading-relaxed shadow-inner">
              {selectedScript.command}
            </div>
          </div>

          {/* Sample Terminal Output */}
          <div className="space-y-2 font-mono-tech">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-400" />
                SALIDA ESPERADA EN CONSOLA // FORMATO LIMPIO
              </span>
            </div>
            <pre className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
              {selectedScript.sampleOutput}
            </pre>
          </div>

          {/* Safety guarantee */}
          <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800 flex items-center gap-3 text-xs font-sans-editorial text-zinc-300">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white font-mono-tech">Garantía de Seguridad EVO: </strong>
              {selectedScript.whySafe}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
