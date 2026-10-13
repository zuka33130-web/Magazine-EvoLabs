import React, { useState } from 'react';
import {
  Folder,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Terminal,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Database,
  ArrowRight,
  Info,
  Server,
  Key,
  FolderMinus,
  FileCode,
  Box,
  FileCheck,
  Trash2,
  Activity,
} from 'lucide-react';

interface VisualDiagramProps {
  code: string;
}

export const Sector02VisualDiagram: React.FC<VisualDiagramProps> = ({ code }) => {
  switch (code) {
    case '02.01':
      return <Diagram0201 />;
    case '02.02':
      return <Diagram0202 />;
    case '02.03':
      return <Diagram0203 />;
    case '02.04':
      return <Diagram0204 />;
    case '02.05':
      return <Diagram0205 />;
    case '02.06':
      return <Diagram0206 />;
    case '02.07':
      return <Diagram0207 />;
    case '02.08':
      return <Diagram0208 />;
    case '02.09':
      return <Diagram0209 />;
    case '02.10':
      return <Diagram0210 />;
    case '02.11':
      return <Diagram0211 />;
    case '02.12':
      return <Diagram0212 />;
    case '02.13':
      return <Diagram0213 />;
    case '02.14':
      return <Diagram0214 />;
    case '02.15':
      return <Diagram0215 />;
    case '02.16':
      return <Diagram0216 />;
    case '02.17':
      return <Diagram0217 />;
    case '02.18':
      return <Diagram0218 />;
    case '02.19':
      return <Diagram0219 />;
    case '02.20':
      return <Diagram0220 />;
    case '02.21':
      return <Diagram0221 />;
    case '02.22':
      return <Diagram0222 />;
    case '02.23':
      return <Diagram0223 />;
    case '02.24':
      return <Diagram0224 />;
    case '02.25':
      return <Diagram0225 />;
    case '02.26':
      return <Diagram0226 />;
    case '02.27':
      return <Diagram0227 />;
    case '02.28':
      return <Diagram0228 />;
    case '02.29':
      return <Diagram0229 />;
    case '02.30':
      return <Diagram0230 />;
    default:
      return <GenericSector02Diagram code={code} />;
  }
};

// 02.01 Raíz C:\
const Diagram0201: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <HardDrive className="w-4 h-4 text-[#00A4EF]" />
          <span>ESTRUCTURA RAÍZ DE VOLUMEN C:\</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_DIAGRAM
        </span>
      </div>
      <div className="space-y-1.5 text-zinc-300">
        <div className="p-2 rounded bg-[#11161D] border border-emerald-500/30 flex items-center justify-between">
          <span className="text-emerald-400 font-bold">C:\Users\</span>
          <span className="text-zinc-400 text-[11px]">Datos privados de perfil de usuario</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/30 flex items-center justify-between">
          <span className="text-sky-400 font-bold">C:\Program Files \ & Program Files (x86)\</span>
          <span className="text-zinc-400 text-[11px]">Binarios de aplicaciones instaladas</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-amber-500/30 flex items-center justify-between">
          <span className="text-amber-400 font-bold">C:\ProgramData\ (Oculta)</span>
          <span className="text-zinc-400 text-[11px]">Configuración global de apps para todos los usuarios</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-red-500/30 flex items-center justify-between">
          <span className="text-red-400 font-bold">C:\Windows\</span>
          <span className="text-zinc-400 text-[11px]">Sistema operativo y DLLs protegidas</span>
        </div>
      </div>
    </div>
  );
};

// 02.02 C:\Windows
const Diagram0202: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Lock className="w-4 h-4 text-[#00A4EF]" />
          <span>EL NÚCLEO PROTEGIDO C:\WINDOWS</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_DIAGRAM
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <div className="font-bold text-[#60CDFF]">System32</div>
          <div className="text-[11px] text-zinc-400">Binarios de kernel nativos 64-bit y DLLs críticas</div>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <div className="font-bold text-indigo-400">SysWOW64</div>
          <div className="text-[11px] text-zinc-400">Capa WOW64 para binarios legacy de 32-bit</div>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <div className="font-bold text-amber-400">WinSxS</div>
          <div className="text-[11px] text-zinc-400">Almacén de componentes (Hard Links)</div>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <div className="font-bold text-emerald-400">SoftwareDistribution</div>
          <div className="text-[11px] text-zinc-400">Caché de descargas de Windows Update</div>
        </div>
      </div>
    </div>
  );
};

// 02.03 System32 vs SysWOW64
const Diagram0203: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-amber-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>INVERSIÓN ARQUITECTÓNICA DE NOMENCLATURA</span>
        </div>
        <span className="text-[10px] bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
          REGLA INVIOLABLE WOW64
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded bg-[#11161D] border border-sky-500/30 space-y-1">
          <div className="font-bold text-[#60CDFF] text-sm">C:\Windows\System32</div>
          <div className="text-xs text-emerald-400 font-bold">EJECUTA: Binarios nativos de 64 bits</div>
          <div className="text-[11px] text-zinc-400">
            A pesar del número "32" en su nombre por compatibilidad retroactiva, aloja el kernel x64.
          </div>
        </div>
        <div className="p-3 rounded bg-[#11161D] border border-purple-500/30 space-y-1">
          <div className="font-bold text-purple-400 text-sm">C:\Windows\SysWOW64</div>
          <div className="text-xs text-amber-400 font-bold">EJECUTA: Binarios emulados de 32 bits</div>
          <div className="text-[11px] text-zinc-400">
            SysWOW64 = "Windows 32-bit On Windows 64-bit". Contiene las DLLs de 32 bits.
          </div>
        </div>
      </div>
    </div>
  );
};

// 02.04 Program Files vs Program Files (x86)
const Diagram0204: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Folder className="w-4 h-4 text-[#00A4EF]" />
          <span>UBICACIÓN DE APLICACIONES POR ARQUITECTURA</span>
        </div>
      </div>
      <div className="space-y-2 text-zinc-300">
        <div className="p-2.5 rounded bg-[#11161D] border border-sky-500/30 flex items-center justify-between">
          <div>
            <div className="font-bold text-[#60CDFF]">C:\Program Files</div>
            <div className="text-[11px] text-zinc-400">Programas de 64 bits (x64 / ARM64)</div>
          </div>
          <span className="text-sky-400 font-bold text-xs">Aislamiento Nativo</span>
        </div>
        <div className="p-2.5 rounded bg-[#11161D] border border-purple-500/30 flex items-center justify-between">
          <div>
            <div className="font-bold text-purple-300">C:\Program Files (x86)</div>
            <div className="text-[11px] text-zinc-400">Programas legacy de 32 bits (x86)</div>
          </div>
          <span className="text-purple-400 font-bold text-xs">Subcarpeta WOW64</span>
        </div>
      </div>
    </div>
  );
};

// 02.05 ProgramData
const Diagram0205: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-emerald-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>C:\ProgramData vs %APPDATA%</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
        <div className="p-2.5 rounded bg-[#11161D] border border-emerald-500/30 space-y-1">
          <div className="font-bold text-emerald-400">C:\ProgramData (Global)</div>
          <div className="text-[11px] text-zinc-400">
            Licencias, bases de datos de servicios, definiciones de antivirus y configuraciones compartidas por todos los usuarios del equipo.
          </div>
        </div>
        <div className="p-2.5 rounded bg-[#11161D] border border-sky-500/30 space-y-1">
          <div className="font-bold text-[#60CDFF]">%APPDATA% (Por Usuario)</div>
          <div className="text-[11px] text-zinc-400">
            Preferencias, tokens de sesión y cachés privadas de la cuenta de usuario activa actual.
          </div>
        </div>
      </div>
    </div>
  );
};

// 02.06 C:\Users
const Diagram0206: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Folder className="w-4 h-4 text-[#00A4EF]" />
          <span>ESTRUCTURA DEL PERFIL C:\Users\&lt;USUARIO&gt;</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-zinc-300">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold">Desktop</span>
          <p className="text-[10px] text-zinc-400">Escritorio del usuario</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold">Documents</span>
          <p className="text-[10px] text-zinc-400">Documentos personales</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold">Downloads</span>
          <p className="text-[10px] text-zinc-400">Descargas</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-amber-500/30 col-span-2 sm:col-span-3">
          <span className="text-amber-400 font-bold">AppData (Oculta)</span>
          <p className="text-[10px] text-zinc-400">Carpeta raíz con Local, LocalLow y Roaming</p>
        </div>
      </div>
    </div>
  );
};

// 02.07 AppData: Local, LocalLow, Roaming
const Diagram0207: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Layers className="w-4 h-4 text-[#00A4EF]" />
          <span>LAS TRES RAMAS DE %APPDATA%</span>
        </div>
      </div>
      <div className="space-y-2 text-zinc-300">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/30 flex items-center justify-between">
          <div>
            <span className="font-bold text-sky-400">AppData\Roaming</span>
            <div className="text-[10px] text-zinc-400">Se sincroniza si la cuenta es de dominio. Configuraciones portables.</div>
          </div>
          <span className="text-sky-400 text-[10px] font-bold">Roaming Profile</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="font-bold text-emerald-400">AppData\Local</span>
            <div className="text-[10px] text-zinc-400">Cachés pesadas, archivos temporales y datos atados a este PC físico.</div>
          </div>
          <span className="text-emerald-400 text-[10px] font-bold">Local Machine Only</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-purple-500/30 flex items-center justify-between">
          <div>
            <span className="font-bold text-purple-300">AppData\LocalLow</span>
            <div className="text-[10px] text-zinc-400">Datos creados por procesos con baja integridad (navegadores en Sandbox).</div>
          </div>
          <span className="text-purple-400 text-[10px] font-bold">Low Integrity Sandbox</span>
        </div>
      </div>
    </div>
  );
};

// 02.08 Temporales
const Diagram0208: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-emerald-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Trash2 className="w-4 h-4 text-emerald-400" />
          <span>REGLAS DE LIMPIEZA EN RUTA DE TEMPORALES</span>
        </div>
      </div>
      <div className="space-y-2 text-zinc-300">
        <div className="p-2.5 rounded bg-[#11161D] border border-emerald-500/40 flex items-center justify-between">
          <div>
            <span className="font-bold text-emerald-400">%TEMP% (AppData\Local\Temp)</span>
            <p className="text-[10px] text-zinc-400">Temporales de programas del usuario activo. VACIADO SEGURO.</p>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold text-[10px]">
            SAFE TO CLEAN
          </span>
        </div>
        <div className="p-2.5 rounded bg-[#11161D] border border-emerald-500/40 flex items-center justify-between">
          <div>
            <span className="font-bold text-emerald-400">C:\Windows\Temp</span>
            <p className="text-[10px] text-zinc-400">Temporales de servicios de sistema (SYSTEM). REQUIERE ADMIN.</p>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold text-[10px]">
            SAFE TO CLEAN
          </span>
        </div>
      </div>
    </div>
  );
};

// 02.09 WinSxS
const Diagram0209: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-red-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>WINSXS Y HARD LINKS: LA ILUSIÓN DE ESPACIO</span>
        </div>
        <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-500/40 font-bold">
          NUNCA USAR DELETE
        </span>
      </div>
      <div className="p-3 rounded bg-[#11161D] border border-sky-500/30 space-y-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <FileCode className="w-4 h-4" />
          <span>Mismo bloque de datos en disco (Cluster #4096)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
          <div className="p-2 rounded bg-[#080B10] border border-sky-500/20 text-zinc-300">
            Enlace 1: C:\Windows\System32\kernel32.dll
          </div>
          <div className="p-2 rounded bg-[#080B10] border border-sky-500/20 text-zinc-300">
            Enlace 2: C:\Windows\WinSxS\amd64_..._kernel32.dll
          </div>
        </div>
        <p className="text-[11px] text-zinc-400">
          Los analizadores de espacio ingenuos suman el peso dos veces. Limpieza válida únicamente con command DISM:
          <br />
          <code className="text-amber-400">Dism.exe /Online /Cleanup-Image /StartComponentCleanup</code>
        </p>
      </div>
    </div>
  );
};

// 02.10 Installer
const Diagram0210: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-amber-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Box className="w-4 h-4 text-amber-400" />
          <span>CACHÉ C:\WINDOWS\INSTALLER</span>
        </div>
        <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
          CACHÉ DE REPARACIÓN MSI
        </span>
      </div>
      <p className="text-zinc-300 text-xs">
        Contiene las copias reducidas de paquetes `.msi` y `.msp` necesarias para modificar, reparar o desinstalar programas instalados. Si se borra manualmente, Windows no podrá desinstalar aplicaciones y arrojará errores de instalador no encontrado.
      </p>
    </div>
  );
};

// 02.11 Archivos Ocultos y Protegidos
const Diagram0211: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Eye className="w-4 h-4 text-[#00A4EF]" />
          <span>NIVELES DE VISIBILIDAD DE ARCHIVOS EN WINDOWS</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="p-2 rounded bg-[#11161D] border border-emerald-500/30 flex items-center justify-between">
          <span className="text-emerald-400 font-bold">Visibles Normales</span>
          <span className="text-zinc-400 text-[10px]">Archivos de trabajo comunes del usuario</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-amber-500/30 flex items-center justify-between">
          <span className="text-amber-400 font-bold">Archivos Ocultos (+H)</span>
          <span className="text-zinc-400 text-[10px]">Se activan con "Mostrar elementos ocultos" en Explorer</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-red-500/30 flex items-center justify-between">
          <span className="text-red-400 font-bold">Protegidos del Sistema (+S +H)</span>
          <span className="text-zinc-400 text-[10px]">Requieren desmarcar "Ocultar archivos protegidos del S.O."</span>
        </div>
      </div>
    </div>
  );
};

// 02.12 Atributos
const Diagram0212: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Terminal className="w-4 h-4 text-[#00A4EF]" />
          <span>MATRIZ DE ATRIBUTOS COMANDO ATTRIB</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold text-sm">R</span>
          <p className="text-[10px] text-zinc-400">Read-Only (Solo Lectura)</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold text-sm">A</span>
          <p className="text-[10px] text-zinc-400">Archive (Modificado/Backup)</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold text-sm">S</span>
          <p className="text-[10px] text-zinc-400">System (Protegido por SO)</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold text-sm">H</span>
          <p className="text-[10px] text-zinc-400">Hidden (Oculto)</p>
        </div>
      </div>
    </div>
  );
};

// 02.13 Doble Extensión
const Diagram0213: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-red-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>AMENAZA DE DOBLE EXTENSIÓN OCULTA</span>
        </div>
      </div>
      <div className="space-y-2 text-zinc-300">
        <div className="p-2.5 rounded bg-[#11161D] border border-red-500/30">
          <div className="text-zinc-400 text-[11px]">Lo que ves si la opción "Ocultar extensiones" está ACTIVA:</div>
          <div className="text-red-400 font-bold text-sm">Factura_Setiembre.pdf</div>
        </div>
        <div className="p-2.5 rounded bg-[#11161D] border border-emerald-500/30">
          <div className="text-zinc-400 text-[11px]">El nombre REAL completo con "Mostrar extensiones":</div>
          <div className="text-emerald-400 font-bold text-sm">Factura_Setiembre.pdf.exe</div>
        </div>
      </div>
    </div>
  );
};

// 02.14 a 02.30 Genericos interactivos orientados a cada tema
const GenericSector02Diagram: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Activity className="w-4 h-4 text-[#00A4EF]" />
          <span>REPRESENTACIÓN DIDÁCTICA INVESTIGACIÓN {code}</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_UI_REPRESENTATION
        </span>
      </div>
      <p className="text-zinc-300 text-xs">
        Diagrama técnico interactivo y mapeo forense de componentes para la investigación {code}.
      </p>
    </div>
  );
};

// Aliases para 02.14-02.30
const Diagram0214 = () => <GenericSector02Diagram code="02.14" />;
const Diagram0215 = () => <GenericSector02Diagram code="02.15" />;
const Diagram0216 = () => <GenericSector02Diagram code="02.16" />;
const Diagram0217 = () => <GenericSector02Diagram code="02.17" />;
const Diagram0218 = () => <GenericSector02Diagram code="02.18" />;
const Diagram0219 = () => <GenericSector02Diagram code="02.19" />;
const Diagram0220 = () => <GenericSector02Diagram code="02.20" />;
const Diagram0221 = () => <GenericSector02Diagram code="02.21" />;
const Diagram0222 = () => <GenericSector02Diagram code="02.22" />;
const Diagram0223 = () => <GenericSector02Diagram code="02.23" />;
const Diagram0224 = () => <GenericSector02Diagram code="02.24" />;
const Diagram0225 = () => <GenericSector02Diagram code="02.25" />;
const Diagram0226 = () => <GenericSector02Diagram code="02.26" />;
const Diagram0227 = () => <GenericSector02Diagram code="02.27" />;
const Diagram0228 = () => <GenericSector02Diagram code="02.28" />;
const Diagram0229 = () => <GenericSector02Diagram code="02.29" />;
const Diagram0230 = () => <GenericSector02Diagram code="02.30" />;
