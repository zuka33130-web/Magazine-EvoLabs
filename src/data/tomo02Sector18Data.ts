// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 18: GRÁFICOS Y PANTALLA
// LO QUE VES EN LA PANTALLA NO ES TAN SIMPLE

export type RiskLevelSector18 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector18Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector18;
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    queEs: string;
    paraQueSirve: string;
    quePasaSiFalta: string;
  };
  interactua: {
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
  };
  alertaEVO: {
    reversibilityRule: string;
    safetyWarning: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
  };
}

export interface Sector18MiniCase {
  id: string;
  code: string;
  title: string;
  scenario: string;
  userStatement: string;
  initialMistake: string;
  diagnosticQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  technicalVerdict: string;
  lessonLearned: string;
}

export interface Sector18TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_18_INVESTIGATIONS: Sector18Investigation[] = [
  {
    "id": "inv-18-01",
    "code": "18.01",
    "title": "GPU selection",
    "subtitle": "El árbitro de Windows entre adaptadores gráficos",
    "targetMechanism": "DirectX Graphics Infrastructure (DXGI) Adapter Enumeration",
    "targetComponent": "dxgi.dll / D3D12CreateDevice",
    "commandName": "dxdiag /t dxdiag_out.txt",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Tenés una laptop potente pero los juegos corren a 12 FPS porque Windows eligió el silicio equivocado.",
      "mythVsTruth": {
        "mentira": "Windows siempre utiliza la placa más potente disponible en el equipo.",
        "verdad": "DXGI numera adaptadores según prioridad de bus; por defecto en portátiles asigna el iGPU a la pantalla para ahorrar energía a menos que se defina explícitamente.",
        "comprobalo": "Abrí Administrador de Tareas > Rendimiento > GPU 0 y GPU 1 mientras ejecutás una aplicación 3D."
      }
    },
    "entende": {
      "queEs": "El proceso por el cual el sistema operativo y el runtime de DirectX seleccionan qué adaptador físico compila y renderiza los draw calls.",
      "paraQueSirve": "Equilibra el consumo energético térmico frente a la potencia bruta de renderizado.",
      "quePasaSiFalta": "Si DXGI no detecta la GPU secundaria, las aplicaciones caen en fallback por software (WARP)."
    },
    "interactua": {
      "cliExample": "dxdiag /t %temp%\\dxdiag.txt",
      "psExample": "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion",
      "syntaxBreakdown": "Consulta el WMI de adaptadores de video activos y sus controladores.",
      "whatToLookFor": "Nombre de la GPU dedicada con AdapterRAM mayor a 4GB y estado OK.",
      "technicalMetrics": "Tiempo de inicialización DXGI < 45 ms; Adapter LUID persistente."
    },
    "alertaEVO": {
      "reversibilityRule": "La asignación forzada por registro se restablece limpiando la clave en HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences.",
      "safetyWarning": "Deshabilitar el iGPU en laptops híbridas sin MUX Switch puede provocar pantalla negra permanente."
    },
    "evidenceBadge": {
      "code": "DXGI-ENUM",
      "label": "DXGI Pipeline"
    }
  },
  {
    "id": "inv-18-02",
    "code": "18.02",
    "title": "iGPU vs dGPU",
    "subtitle": "Topología híbrida y el cuello de botella PCIe",
    "targetMechanism": "NVIDIA Optimus / AMD Switchable Graphics / Microsoft Hybrid",
    "targetComponent": "nvldumdx.dll / amdxx64.dll / dxgkrnl.sys",
    "commandName": "nvidia-smi",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "La placa dedicada procesa 120 FPS pero la pantalla muestra stuttering porque el buffer debe viajar por el bus PCIe hacia el procesador.",
      "mythVsTruth": {
        "mentira": "La dGPU envía los fotogramas directamente al panel del monitor en todas las notebooks.",
        "verdad": "En sistemas sin Advanced Optimus o MUX switch, la dGPU copia el backbuffer a través del bus PCIe hacia la memoria del iGPU, quien hace el display scanout.",
        "comprobalo": "Revisá en el panel de control de gráficos si el display figura cableado a Intel/AMD o a NVIDIA."
      }
    },
    "entende": {
      "queEs": "La arquitectura de conmutación donde una GPU integrada maneja el framebuffer y la dedicada procesa cómputo pesado.",
      "paraQueSirve": "Prolonga la duración de la batería apagando la dGPU cuando solo se dibuja el escritorio de Windows.",
      "quePasaSiFalta": "Latencia adicional de 2 a 5 ms por cuadro debido a la copia bidireccional PCIe Host-to-Device."
    },
    "interactua": {
      "cliExample": "nvidia-smi -q -d DISPLAY",
      "psExample": "Get-PnpDevice -Class Display | Select-Object FriendlyName, Status",
      "syntaxBreakdown": "Muestra estado y conectores de visualización asociados a la GPU.",
      "whatToLookFor": "Display Activo en la GPU esperada y estado OK.",
      "technicalMetrics": "PCIe copy bandwidth > 12 GB/s en PCIe 4.0 x8."
    },
    "alertaEVO": {
      "reversibilityRule": "El modo de pantalla se conmuta instantáneamente mediante el software del fabricante OEM.",
      "safetyWarning": "Forzar dGPU en batería reduce la autonomía a menos de 45 minutos."
    },
    "evidenceBadge": {
      "code": "HYBRID-ARCH",
      "label": "MUX Topology"
    }
  },
  {
    "id": "inv-18-03",
    "code": "18.03",
    "title": "Per-app graphics preference",
    "subtitle": "Control granular en la configuración de Windows",
    "targetMechanism": "Windows Graphics Settings User Preferences",
    "targetComponent": "SystemSettings.exe / HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences",
    "commandName": "reg query HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "OBS Studio captura pantalla en negro porque corre en la GPU dedicada mientras el monitor pertenece al iGPU.",
      "mythVsTruth": {
        "mentira": "El panel de control de NVIDIA tiene prioridad absoluta sobre la configuración de Windows 11.",
        "verdad": "Desde Windows 10 20H1, Windows UserGpuPreferences sobrescribe las directivas del controlador externo.",
        "comprobalo": "Configurá una app en \"Alto Rendimiento\" en Configuración de Pantalla y verificá su clave en el Registro."
      }
    },
    "entende": {
      "queEs": "Un almacén de directivas por ejecutable que fuerza GpuPreference=1 (Ahorro) o GpuPreference=2 (Alto Rendimiento).",
      "paraQueSirve": "Garantiza que editores de video o juegos siempre invoquen el silicio de alta potencia.",
      "quePasaSiFalta": "Windows decide heurísticamente, fallando con emuladores o herramientas de streaming."
    },
    "interactua": {
      "cliExample": "reg query \"HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences\"",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\Software\\Microsoft\\DirectX\\UserGpuPreferences\"",
      "syntaxBreakdown": "Lista los binarios con GPU forzada y sus valores GpuPreference.",
      "whatToLookFor": "GpuPreference=2 para aplicaciones de alto rendimiento.",
      "technicalMetrics": "Clave REG_SZ con flags AutoGpu=1;GpuPreference=2;."
    },
    "alertaEVO": {
      "reversibilityRule": "Eliminar el valor del ejecutable restaura la selección automática.",
      "safetyWarning": "No fuerces procesos del sistema como dwm.exe; Windows debe gestionar su render."
    },
    "evidenceBadge": {
      "code": "REG-GPUPREF",
      "label": "App Graphics"
    }
  },
  {
    "id": "inv-18-04",
    "code": "18.04",
    "title": "Game Mode",
    "subtitle": "Prioridad de hilos y supresión de tareas en segundo plano",
    "targetMechanism": "Windows Game Bar & Game Mode Thread Scheduler Prioritization",
    "targetComponent": "gamebar.exe / bcastdvr.exe / AvRt.dll",
    "commandName": "reg query HKCU\\Software\\Microsoft\\GameBar /v AllowAutoGameMode",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Windows suspende Windows Update y procesos secundarios cuando detecta que tu proceso principal es un juego 3D.",
      "mythVsTruth": {
        "mentira": "El Modo Juego hace overclock a tu tarjeta gráfica y aumenta 30% los FPS.",
        "verdad": "Modo Juego no altera clocks de hardware; fija afinidad de cores, prioriza hilos en el kernel y frena descargas automáticas de updates.",
        "comprobalo": "Inspeccioná la prioridad de hilos del proceso de juego con Process Explorer cuando Game Mode está activo."
      }
    },
    "entende": {
      "queEs": "Un conjunto de políticas en el scheduler de Windows que favorece la latencia de cuadros sobre la multitarea.",
      "paraQueSirve": "Previene caídas súbitas de framerate (stuttering) causadas por escaneos de Defender o indexación.",
      "quePasaSiFalta": "Picos de frametime cuando un proceso en background toma un núcleo del CPU."
    },
    "interactua": {
      "cliExample": "reg query HKCU\\Software\\Microsoft\\GameBar /v AllowAutoGameMode",
      "psExample": "Get-ItemPropertyValue -Path \"HKCU:\\Software\\Microsoft\\GameBar\" -Name \"AllowAutoGameMode\"",
      "syntaxBreakdown": "Devuelve 1 si el Modo Juego automático está habilitado.",
      "whatToLookFor": "0x1 (Activo) para estabilidad de frametimes.",
      "technicalMetrics": "Reducción del 40% en interrupciones DPC de procesos de usuario secundarios."
    },
    "alertaEVO": {
      "reversibilityRule": "Se activa o desactiva con un interruptor en Configuración > Juegos > Modo de Juego.",
      "safetyWarning": "En setups de renderizado o streaming intensivo, puede recortar recursos al encoder de OBS."
    },
    "evidenceBadge": {
      "code": "GAME-MODE",
      "label": "Game Scheduler"
    }
  },
  {
    "id": "inv-18-05",
    "code": "18.05",
    "title": "HAGS",
    "subtitle": "Hardware-Accelerated GPU Scheduling: bypass al CPU",
    "targetMechanism": "WDDM 2.7+ GPU Memory & Command Queue Direct Scheduling",
    "targetComponent": "dxgkrnl.sys / dxgmms2.sys",
    "commandName": "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v HwSchMode",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "El CPU solía empaquetar y priorizar cada comando antes de pasárselo a la GPU; HAGS delega esa cola a un procesador dedicado en la tarjeta gráfica.",
      "mythVsTruth": {
        "mentira": "HAGS siempre duplica los FPS en cualquier placa de video.",
        "verdad": "HAGS alivia el cuello de botella del CPU en la gestión de colas y es requisito obligatorio para tecnologías como DLSS 3 Frame Generation.",
        "comprobalo": "Ejecutá dxdiag y buscá \"Hardware-accelerated GPU scheduling\" en la solapa Pantalla."
      }
    },
    "entende": {
      "queEs": "La delegación de la planificación de memoria de video y colas de comandos directamente al procesador de scheduling de la GPU.",
      "paraQueSirve": "Reduce la latencia de entrada (input lag) y permite la generación de fotogramas por IA.",
      "quePasaSiFalta": "No es posible activar DLSS 3 Frame Generation ni ciertas optimizaciones de DirectX 12 Ultimate."
    },
    "interactua": {
      "cliExample": "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v HwSchMode",
      "psExample": "Get-ItemProperty -Path \"HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\" -Name HwSchMode",
      "syntaxBreakdown": "Valor 2 = HAGS habilitado; Valor 1 = HAGS deshabilitado.",
      "whatToLookFor": "HwSchMode = 2 tras el reinicio.",
      "technicalMetrics": "Latencia de despacho de colas reducida de ~1.5ms a ~0.1ms."
    },
    "alertaEVO": {
      "reversibilityRule": "Cambiar HwSchMode a 1 y reiniciar restaura el planificador tradicional del CPU.",
      "safetyWarning": "Requiere reinicio completo del sistema operativo para reconstruir el stack de WDDM."
    },
    "evidenceBadge": {
      "code": "WDDM-HAGS",
      "label": "HAGS Engine"
    }
  },
  {
    "id": "inv-18-06",
    "code": "18.06",
    "title": "Windowed Optimizations",
    "subtitle": "Flip Model moderno para juegos en ventana",
    "targetMechanism": "Modern Flip Model Presentation (FLIP_DISCARD / FLIP_SEQUENTIAL)",
    "targetComponent": "dwm.exe / dxgi.dll",
    "commandName": "reg query HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences /s",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Los juegos en ventana solían tener lag y tearing porque DWM copiaba el buffer; las optimizaciones en ventana aplican bypass directo.",
      "mythVsTruth": {
        "mentira": "El modo pantalla completa exclusiva siempre tiene menor latencia que cualquier modo en ventana.",
        "verdad": "Con Modern Flip Model, el modo sin bordes (borderless) alcanza la misma latencia y rendimiento que el modo exclusivo, permitiendo Alt+Tab instantáneo.",
        "comprobalo": "Habilitá \"Optimizaciones para juegos en ventana\" en Gráficos y medí la latencia con PresentMon."
      }
    },
    "entende": {
      "queEs": "La actualización de la cola de presentación de D3D11 a Flip Model para eliminar la copia legacy de Blt.",
      "paraQueSirve": "Permite VRR (G-Sync/FreeSync) y Auto HDR en juegos ejecutados en ventana sin bordes.",
      "quePasaSiFalta": "Los juegos en ventana quedan limitados al refresco del escritorio o sufren frame pacing irregular."
    },
    "interactua": {
      "cliExample": "reg query \"HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences\"",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR\"",
      "syntaxBreakdown": "Verifica parámetros de composición de ventana y flags DWM.",
      "whatToLookFor": "Flags Modern Flip activos en el runtime.",
      "technicalMetrics": "Cero copias intermedias en memoria de sistema; scanout directo desde swapchain."
    },
    "alertaEVO": {
      "reversibilityRule": "Se puede deshabilitar globalmente o por aplicación en las propiedades del ejecutable.",
      "safetyWarning": "Títulos DirectX 9 antiguos pueden requerir wrappers para no presentar artefactos."
    },
    "evidenceBadge": {
      "code": "FLIP-MODEL",
      "label": "Modern Flip"
    }
  },
  {
    "id": "inv-18-07",
    "code": "18.07",
    "title": "Fullscreen Optimization",
    "subtitle": "La evolución de Exclusive Fullscreen en Windows 10/11",
    "targetMechanism": "Fullscreen Optimizations (FSO) Compatibility Layer",
    "targetComponent": "dxgi.dll / compatibility shims",
    "commandName": "reg query \"HKCU\\System\\GameConfigStore\"",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Muchos usuarios desactivan Fullscreen Optimizations creyendo que ganan FPS, pero pierden la superposición rápida y el HDR.",
      "mythVsTruth": {
        "mentira": "Deshabilitar optimizaciones de pantalla completa siempre mejora el rendimiento de cualquier juego.",
        "verdad": "FSO proporciona un modo híbrido que simula pantalla exclusiva con latencia idéntica y permite superposiciones de Discord o Xbox sin tirones.",
        "comprobalo": "Probá Alt+Tab con FSO activado: es instantáneo; con pantalla exclusiva clásica la pantalla parpadea en negro 2 segundos."
      }
    },
    "entende": {
      "queEs": "Un shim de compatibilidad que promueve aplicaciones Fullscreen clásicas al pipeline moderno de composición directa.",
      "paraQueSirve": "Unifica la gestión de notificaciones, control de volumen y HDR sin sacrificar throughput de GPU.",
      "quePasaSiFalta": "Pantallas negras al conmutar tareas y fallas en monitores multirrefresco."
    },
    "interactua": {
      "cliExample": "reg query \"HKCU\\System\\GameConfigStore\" /v GameDVR_FSEBehavior",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\System\\GameConfigStore\" -Name GameDVR_FSEBehavior",
      "syntaxBreakdown": "Comprueba el comportamiento FSE (Fullscreen Exclusive) del sistema.",
      "whatToLookFor": "Valor 2 = Optimización gestionada por Windows.",
      "technicalMetrics": "Tiempo de conmutación Alt+Tab < 100 ms frente a > 1800 ms en modo exclusivo puro."
    },
    "alertaEVO": {
      "reversibilityRule": "Se deshabilita por ejecutable tildando \"Deshabilitar optimizaciones de pantalla completa\" en Propiedades > Compatibilidad.",
      "safetyWarning": "Algunos juegos con motores de 2012 pueden beneficiarse de deshabilitarlo si sufren micro-stuttering."
    },
    "evidenceBadge": {
      "code": "FSO-LAYER",
      "label": "Fullscreen Opt"
    }
  },
  {
    "id": "inv-18-08",
    "code": "18.08",
    "title": "VRR",
    "subtitle": "Variable Refresh Rate, G-Sync y FreeSync a nivel kernel",
    "targetMechanism": "Adaptive-Sync / Variable Refresh Rate OS Support",
    "targetComponent": "dxgkrnl.sys / d3d11.dll / d3d12.dll",
    "commandName": "reg query \"HKCU\\Control Panel\\Desktop\" /v WindowedVRR",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Tu monitor dice 144 Hz, pero los cuadros se renderizan a 83 FPS; sin VRR, la pantalla dibuja cuadros partidos o repetidos.",
      "mythVsTruth": {
        "mentira": "G-Sync funciona automáticamente en cualquier juego con solo conectar el cable HDMI.",
        "verdad": "Adaptive-Sync requiere DisplayPort (o HDMI 2.1 VRR certificado) y activación explícita tanto en el driver como en la configuración de Windows.",
        "comprobalo": "Activá el contador de hercios OSD incorporado en el monitor para ver si oscila al compás de los FPS."
      }
    },
    "entende": {
      "queEs": "La sincronización dinámica entre el ciclo de refresco vertical del panel y el momento exacto en que la GPU termina un fotograma.",
      "paraQueSirve": "Elimina el tearing sin introducir el retardo de input lag que genera el V-Sync tradicional.",
      "quePasaSiFalta": "Tearing visible si los FPS superan los Hz, o stuttering violento si caen por debajo de 60."
    },
    "interactua": {
      "cliExample": "reg query \"HKCU\\Control Panel\\Desktop\" /v WindowedVRR",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\Control Panel\\Desktop\" -Name WindowedVRR -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Indica si VRR está habilitado para aplicaciones en ventana.",
      "whatToLookFor": "Valor 1 = VRR activo en modo ventana.",
      "technicalMetrics": "Rango VRR típico de 48 Hz a 144/240 Hz; LFC (Low Framerate Compensation) activo."
    },
    "alertaEVO": {
      "reversibilityRule": "Desactivar en Configuración de Pantalla Gráficos restaura el refresco fijo.",
      "safetyWarning": "Monitores VA de baja calidad pueden exhibir parpadeo de brillo (gamma flicker) en oscilaciones bruscas de FPS."
    },
    "evidenceBadge": {
      "code": "VRR-SYNC",
      "label": "Adaptive Refresh"
    }
  },
  {
    "id": "inv-18-09",
    "code": "18.09",
    "title": "V-Sync",
    "subtitle": "Sincronización vertical, Double Buffering y Triple Buffering",
    "targetMechanism": "Vertical Blanking Interval (VBLANK) Synchronization",
    "targetComponent": "dxgi.dll / PresentFlags",
    "commandName": "wmic path Win32_VideoController get CurrentRefreshRate",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Al activar V-Sync en 60 Hz, si tus FPS bajan a 58, el juego cae de golpe a 30 FPS exactos.",
      "mythVsTruth": {
        "mentira": "El V-Sync no afecta la latencia de respuesta del mouse en absoluto.",
        "verdad": "V-Sync bloquea el buffer hasta el próximo pulso de VBLANK, acumulando hasta 2 o 3 cuadros de retraso de entrada perceptible.",
        "comprobalo": "Mové el mouse rápido en el menú de un juego con V-Sync encendido y luego con V-Sync apagado."
      }
    },
    "entende": {
      "queEs": "La instrucción que ordena al motor gráfico no enviar el backbuffer al frontbuffer hasta que el haz de barrido del monitor termine el cuadro.",
      "paraQueSirve": "Evita cortes horizontales en la imagen (tearing).",
      "quePasaSiFalta": "Si la GPU va a 150 FPS en un monitor de 60 Hz, cada refresco contiene trozos de 2 o 3 cuadros distintos."
    },
    "interactua": {
      "cliExample": "wmic path Win32_VideoController get CurrentRefreshRate",
      "psExample": "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentRefreshRate",
      "syntaxBreakdown": "Consulta la tasa de refresco a la que se ancla el pulso vertical.",
      "whatToLookFor": "Refresco nativo configurado (ej: 144 Hz).",
      "technicalMetrics": "Intervalo VBLANK en 60Hz: 16.66 ms; en 144Hz: 6.94 ms."
    },
    "alertaEVO": {
      "reversibilityRule": "Configurable en cada motor de juego o globalmente en el panel de la GPU.",
      "safetyWarning": "La mejor configuración moderna es: G-Sync activado + V-Sync activado en panel del driver + FPS limitados a Hz - 3."
    },
    "evidenceBadge": {
      "code": "V-BLANK",
      "label": "Vertical Blank"
    }
  },
  {
    "id": "inv-18-10",
    "code": "18.10",
    "title": "Resolution",
    "subtitle": "Nativa, renderizada y DSR/VSR",
    "targetMechanism": "Display Rasterizer Resolution & Virtual Super Resolution",
    "targetComponent": "cdd.dll / dxgkrnl.sys",
    "commandName": "wmic path Win32_VideoController get VideoModeDescription",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Tu monitor es 4K pero los textos se ven borrosos porque Windows eligió una resolución no nativa escalada por hardware.",
      "mythVsTruth": {
        "mentira": "Correr a 1080p en un panel 4K siempre se ve idéntico a un monitor 1080p nativo.",
        "verdad": "El escalado bilineal del monitor difumina los píxeles a menos que se utilice escalado por enteros (Integer Scaling).",
        "comprobalo": "Revisá en Configuración de Pantalla > Resolución de pantalla que figure la etiqueta \"(Recomendada)\"."
      }
    },
    "entende": {
      "queEs": "La matriz física de píxeles horizontales y verticales que componen la cuadrícula del panel LCD/OLED.",
      "paraQueSirve": "Define la nitidez espacial y la cantidad de detalle geométrico representable.",
      "quePasaSiFalta": "Distorsión de aspecto, pérdida de nitidez y aberración cromática en fuentes tipográficas."
    },
    "interactua": {
      "cliExample": "wmic path Win32_VideoController get CurrentHorizontalResolution, CurrentVerticalResolution",
      "psExample": "Get-CimInstance Win32_VideoController | Select-Object CurrentHorizontalResolution, CurrentVerticalResolution",
      "syntaxBreakdown": "Devuelve la resolución de rasterizado activa en el desktop.",
      "whatToLookFor": "Resolución nativa exacta del panel (ej: 2560x1440 o 3840x2160).",
      "technicalMetrics": "Aspect Ratio 16:9, 16:10 o 21:9 exacto."
    },
    "alertaEVO": {
      "reversibilityRule": "Windows revierte automáticamente en 15 segundos si el usuario no confirma la nueva resolución.",
      "safetyWarning": "Forzar resoluciones por encima del ancho de banda del cable provocará pérdida total de señal."
    },
    "evidenceBadge": {
      "code": "DISP-RES",
      "label": "Raster Resolution"
    }
  },
  {
    "id": "inv-18-11",
    "code": "18.11",
    "title": "Scaling",
    "subtitle": "DPI, High-DPI scaling y compatibilidad de software legacy",
    "targetMechanism": "Per-Monitor DPI Awareness v2 & Desktop Window Manager Scaling",
    "targetComponent": "user32.dll / dwmapi.dll / shcore.dll",
    "commandName": "reg query \"HKCU\\Control Panel\\Desktop\" /v LogPixels",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Abrís una aplicación corporativa en tu monitor 4K y los botones son diminutos o las letras se ven totalmente pixeladas.",
      "mythVsTruth": {
        "mentira": "Windows 11 escala todas las aplicaciones de forma vectorial y perfecta.",
        "verdad": "Aplicaciones Win32 antiguas no declaran soporte Per-Monitor DPI, por lo que DWM las estira como si fueran un bitmap estático.",
        "comprobalo": "Hacé clic derecho en una app > Propiedades > Compatibilidad > Cambiar configuración elevada de PPP."
      }
    },
    "entende": {
      "queEs": "El factor multiplicador (100%, 125%, 150%, 200%) aplicado a coordenadas de pantalla para mantener tamaños físicos legibles.",
      "paraQueSirve": "Permite leer texto en pantallas pequeñas con alta densidad de píxeles (laptops 1080p/4K de 14 pulgadas).",
      "quePasaSiFalta": "Texto de 2 milímetros imposible de leer en pantallas de más de 200 PPI."
    },
    "interactua": {
      "cliExample": "reg query \"HKCU\\Control Panel\\Desktop\" /v Win8DpiScaling",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\Control Panel\\Desktop\" -Name LogPixels -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Inspecciona el valor base de DPI (96 = 100%, 120 = 125%, 144 = 150%).",
      "whatToLookFor": "LogPixels en concordancia con el factor de escala.",
      "technicalMetrics": "Escala recomendada según densidad PPI = (sqrt(w^2 + h^2) / pulgadas)."
    },
    "alertaEVO": {
      "reversibilityRule": "El slider en Configuración > Sistema > Pantalla es 100% reversible en tiempo real.",
      "safetyWarning": "Cambiar de monitor con escalas distintas puede requerir cerrar sesión para limpiar cachés de iconos."
    },
    "evidenceBadge": {
      "code": "DPI-AWARE",
      "label": "DPI Scaling"
    }
  },
  {
    "id": "inv-18-12",
    "code": "18.12",
    "title": "Refresh rate",
    "subtitle": "La trampa clásica de comprar 144 Hz y usarlo en 60 Hz",
    "targetMechanism": "Display Timing Descriptor & Vertical Refresh Synchronization",
    "targetComponent": "cdd.dll / dxgi.dll",
    "commandName": "wmic path Win32_VideoController get CurrentRefreshRate",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "El 40% de los usuarios que compran un monitor de 144 Hz o 240 Hz lo usan durante dos años en 60 Hz porque nunca lo cambiaron en Windows.",
      "mythVsTruth": {
        "mentira": "Al conectar un monitor de 144 Hz, Windows siempre arranca a la máxima velocidad posible de fábrica.",
        "verdad": "Por estándar de seguridad VESA, Windows inicializa cualquier pantalla en el modo seguro EDID de 60 Hz hasta configuración manual.",
        "comprobalo": "Andá a Configuración > Sistema > Pantalla > Pantalla avanzada y mirá la tasa seleccionada."
      }
    },
    "entende": {
      "queEs": "La cantidad de veces por segundo que el panel dibuja físicamente un fotograma nuevo desde su memoria interna.",
      "paraQueSirve": "Reduce el blur de movimiento retiniano y mejora el tiempo de reacción en tareas dinámicas.",
      "quePasaSiFalta": "Fatiga visual en movimientos rápidos y desperdicio de la capacidad de render de la GPU."
    },
    "interactua": {
      "cliExample": "wmic path Win32_VideoController get CurrentRefreshRate",
      "psExample": "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentRefreshRate",
      "syntaxBreakdown": "Lee el refresco configurado en el subsistema de video.",
      "whatToLookFor": "Valor mayor o igual a 120, 144, 165 o 240 Hz.",
      "technicalMetrics": "Tiempo de fotograma a 60 Hz: 16.6ms; a 144 Hz: 6.94ms; a 240 Hz: 4.16ms."
    },
    "alertaEVO": {
      "reversibilityRule": "Windows prueba el modo y si la pantalla queda en negro revierte tras 15 segundos.",
      "safetyWarning": "Cables HDMI 1.4 antiguos no soportan 144Hz a 1440p; requieren cable DisplayPort certificado."
    },
    "evidenceBadge": {
      "code": "HZ-TIMING",
      "label": "Refresh Rate"
    }
  },
  {
    "id": "inv-18-13",
    "code": "18.13",
    "title": "Hz vs FPS",
    "subtitle": "La diferencia técnica entre producción y entrega de cuadros",
    "targetMechanism": "Frame Generation (GPU Render) vs Display Scanout Cycle",
    "targetComponent": "Presentation Pipeline / DWM",
    "commandName": "typeperf \"\\GPU Engine(*)\\Running Time\" -si 1 -sc 1",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "El juego dice que vas a 300 FPS pero tu pantalla solo es de 60 Hz: ¿sirve de algo o es una ilusión?",
      "mythVsTruth": {
        "mentira": "Tener 200 FPS en un monitor de 60 Hz no sirve para nada y se ve exactamente igual que a 60 FPS.",
        "verdad": "Más FPS reduce la antigüedad del fotograma mostrado (frame latency), mejorando el input lag del mouse aunque el monitor solo muestre 60 por segundo.",
        "comprobalo": "Medí la latencia de clic a respuesta con un medidor de input lag a 60 FPS vs 200 FPS en 60 Hz."
      }
    },
    "entende": {
      "queEs": "FPS es la tasa a la que la GPU procesa datos; Hz es la tasa a la que el panel refresca su hardware de luz.",
      "paraQueSirve": "Comprender el cuello de botella entre capacidad de cómputo y capacidad de presentación visual.",
      "quePasaSiFalta": "Decisiones de compra erróneas gastando en placas de gama alta sin monitores acordes."
    },
    "interactua": {
      "cliExample": "typeperf \"\\GPU Engine(*)\\Running Time\" -si 1 -sc 1",
      "psExample": "Get-Counter \"\\GPU Engine(*)\\Running Time\" -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Muestra actividad de motores de render de la GPU en tiempo real.",
      "whatToLookFor": "GPU Engine 3D con uso sostenido sin saturación de bus.",
      "technicalMetrics": "Input latency reduction de hasta 12 ms a 240 FPS frente a 60 FPS estables."
    },
    "alertaEVO": {
      "reversibilityRule": "Informativo y analítico; no altera configuraciones.",
      "safetyWarning": "Dejar FPS ilimitados en menús de juegos puede sobrecalentar la GPU al superar 1000 FPS."
    },
    "evidenceBadge": {
      "code": "FPS-METRIC",
      "label": "Hz vs FPS"
    }
  },
  {
    "id": "inv-18-14",
    "code": "18.14",
    "title": "SDR",
    "subtitle": "Standard Dynamic Range y el espacio de color sRGB",
    "targetMechanism": "BT.709 Color Primaries & 8-bit Integer Color Space",
    "targetComponent": "cdd.dll / Color Management System (mscms.dll)",
    "commandName": "colorcpl",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Casi todo el contenido de la web está calibrado en un estándar de hace 25 años pensado para tubos de rayos catódicos.",
      "mythVsTruth": {
        "mentira": "Cualquier imagen en una pantalla moderna aprovecha automáticamente los millones de colores del panel.",
        "verdad": "El contenido SDR se comprime en el espacio sRGB de 8 bits con gamma 2.2, recortando gradientes intensos.",
        "comprobalo": "Abrí Administrador de Color (colorcpl) y mirá el perfil ICC asociado a tu pantalla."
      }
    },
    "entende": {
      "queEs": "El rango dinámico convencional limitado a un brillo máximo nominal de 100 nits y 256 niveles por canal de color.",
      "paraQueSirve": "Estándar universal de compatibilidad retroactiva para software, páginas web y video.",
      "quePasaSiFalta": "Colores sobre-saturados artificialmente si se visualiza en paneles wide-gamut sin clamp sRGB."
    },
    "interactua": {
      "cliExample": "colorcpl",
      "psExample": "Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorColorCharacteristics",
      "syntaxBreakdown": "Consulta las características cromáticas reportadas por el firmware del monitor.",
      "whatToLookFor": "Chromaticity coordinates de primarios Rojo, Verde y Azul.",
      "technicalMetrics": "Gama de color sRGB (rec. 709) ~35% del espectro visible CIE 1931."
    },
    "alertaEVO": {
      "reversibilityRule": "Los perfiles ICC pueden desvincularse en cualquier momento desde colorcpl.",
      "safetyWarning": "Evitá perfiles ICC descargados de internet de otros usuarios; cada panel varía de fábrica."
    },
    "evidenceBadge": {
      "code": "COLOR-SDR",
      "label": "sRGB Space"
    }
  },
  {
    "id": "inv-18-15",
    "code": "18.15",
    "title": "HDR",
    "subtitle": "High Dynamic Range, 10-bit y curvas PQ/BT.2020",
    "targetMechanism": "Perceptual Quantizer (SMPTE ST 2084) & 10/12-bit Color Pipeline",
    "targetComponent": "dxgi.dll / dwm.exe / Windows Advanced Color",
    "commandName": "reg query \"HKCU\\Control Panel\\Desktop\" /v EnableAdvancedColor",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Activás HDR en Windows y el escritorio se ve lavado, gris y opaco en lugar de brillante y vibrante.",
      "mythVsTruth": {
        "mentira": "Activar HDR en un monitor económico \"HDR 400\" se ve igual que en una TV OLED de 1000 nits.",
        "verdad": "Monitores sin atenuación local (local dimming) solo aumentan el brillo de fondo, arruinando el contraste y lavando los negros.",
        "comprobalo": "Activá HDR con Win+Alt+B y observá si tu pantalla soporta atenuación por zonas."
      }
    },
    "entende": {
      "queEs": "El pipeline de color avanzado de Windows que reemplaza la curva gamma por la curva PQ (ST 2084) con rango de brillo de 0 a 10.000 nits.",
      "paraQueSirve": "Representa simultáneamente destellos de luz intensos y sombras profundas con detalle.",
      "quePasaSiFalta": "Clipping de blancos (highlights quemados) en escenas de alto contraste."
    },
    "interactua": {
      "cliExample": "dxdiag /x %temp%\\dxhdr.xml",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\Control Panel\\Desktop\" -Name AdvancedColorSupported -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Verifica si la pantalla y el driver reportan soporte para Advanced Color.",
      "whatToLookFor": "AdvancedColorSupported = 1 y AdvancedColorActive = 1.",
      "technicalMetrics": "Espacio de color DCI-P3 > 90% o BT.2020; brillo pico > 600 nits para HDR real."
    },
    "alertaEVO": {
      "reversibilityRule": "El atajo Win + Alt + B activa o desactiva HDR al instante sin reiniciar.",
      "safetyWarning": "Usar HDR en paneles IPS sin mini-LED en tareas ofimáticas fatiga la vista por exceso de backlight."
    },
    "evidenceBadge": {
      "code": "HDR-PIPELINE",
      "label": "Advanced Color"
    }
  },
  {
    "id": "inv-18-16",
    "code": "18.16",
    "title": "Auto HDR",
    "subtitle": "Machine Learning para convertir juegos SDR al vuelo",
    "targetMechanism": "DirectX 11/12 Real-Time Color Space Expansion & AI Tone Mapping",
    "targetComponent": "dxgi.dll / AutoHDRCore.dll",
    "commandName": "reg query \"HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences\" /v AutoHDR",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Un juego del año 2013 brilla con luces de neón en 1000 nits sin que los desarrolladores hayan lanzado ningún parche.",
      "mythVsTruth": {
        "mentira": "Auto HDR es solo un filtro de brillo artificial que satura los colores sin precisión.",
        "verdad": "Auto HDR utiliza un modelo entrenado de red neuronal que analiza el búfer de luminancia y expande specular highlights selectivamente.",
        "comprobalo": "Presioná Win+G en un juego compatible y observá la etiqueta de insignia \"Auto HDR\" en la Game Bar."
      }
    },
    "entende": {
      "queEs": "Una función de Windows 11 que intercepta draw calls de D3D11/D3D12 y expande el rango SDR a HDR10 automáticamente.",
      "paraQueSirve": "Da nueva vida a bibliotecas enteras de juegos sin soporte nativo de HDR.",
      "quePasaSiFalta": "Los juegos antiguos se ven descoloridos o con brillo plano cuando el monitor está en modo HDR."
    },
    "interactua": {
      "cliExample": "reg query \"HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences\"",
      "psExample": "Get-ItemProperty -Path \"HKCU:\\Software\\Microsoft\\DirectX\\UserGpuPreferences\" -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Consulta las flags de Auto HDR asignadas en el perfil de usuario.",
      "whatToLookFor": "AutoHDR activado para títulos compatibles.",
      "technicalMetrics": "Cero impacto medible en FPS (< 0.2% de GPU compute)."
    },
    "alertaEVO": {
      "reversibilityRule": "Se activa o apaga individualmente en la Xbox Game Bar (Win+G).",
      "safetyWarning": "Requiere que el HDR general de Windows esté encendido previamente."
    },
    "evidenceBadge": {
      "code": "AUTO-HDR",
      "label": "AI HDR Boost"
    }
  },
  {
    "id": "inv-18-17",
    "code": "18.17",
    "title": "Tone Mapping",
    "subtitle": "Ajuste de curvas de luminancia entre juego y panel físico",
    "targetMechanism": "Display Color Calibration & HDR Tone Mapping Metadata (SMPTE 2086)",
    "targetComponent": "Windows HDR Calibration App / dxgkrnl.sys",
    "commandName": "reg query \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\" /v HdrCalibration",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "El sol en el juego es una masa blanca sin detalle: el panel está haciendo clipping de tonos porque desconoce su límite de nits.",
      "mythVsTruth": {
        "mentira": "Windows sabe exactamente cuántos nits reales alcanza tu monitor sin necesidad de calibración.",
        "verdad": "Muchos fabricantes envían metadatos EDID genéricos; se necesita la app Windows HDR Calibration para fijar el punto negro y el punto blanco exacto.",
        "comprobalo": "Descargá \"Windows HDR Calibration\" del Microsoft Store y calibrá los 3 patrones de prueba."
      }
    },
    "entende": {
      "queEs": "El algoritmo matemático que comprime o estira los valores de brillo de la imagen para que encajen en las capacidades del panel físico.",
      "paraQueSirve": "Preserva detalles en nubes, explosiones y texturas oscuras sin quemar ni aplastar negros.",
      "quePasaSiFalta": "Pérdida de información visual en los extremos de la curva luminosa."
    },
    "interactua": {
      "cliExample": "dxdiag /t %temp%\\dxdiag_hdr.txt",
      "psExample": "Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams",
      "syntaxBreakdown": "Obtiene parámetros básicos de brillo y gamma del monitor.",
      "whatToLookFor": "MaxHorizontalImageSize y luminancia reportada.",
      "technicalMetrics": "Curva HGIG (HDR Gaming Interest Group) respetada al 100%."
    },
    "alertaEVO": {
      "reversibilityRule": "El perfil de color creado se elimina desde el Administrador de Color (colorcpl).",
      "safetyWarning": "Calibrá siempre con la habitación a oscuras para fijar el umbral mínimo de negro de forma certera."
    },
    "evidenceBadge": {
      "code": "TONE-MAP",
      "label": "Tone Mapping"
    }
  },
  {
    "id": "inv-18-18",
    "code": "18.18",
    "title": "Color depth",
    "subtitle": "8-bit, 10-bit, 12-bit y FRC (Frame Rate Control)",
    "targetMechanism": "Pixel Bit Depth & Temporal Dithering (FRC)",
    "targetComponent": "cdd.dll / dxgi.dll",
    "commandName": "wmic path Win32_VideoController get CurrentBitsPerPixel",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Mirás un degradado del cielo y en vez de una transición suave ves franjas duras (banding): estás en 8 bits.",
      "mythVsTruth": {
        "mentira": "Un monitor anunciado como \"1.07 mil millones de colores\" siempre tiene un panel 10-bit nativo costoso.",
        "verdad": "La mayoría de monitores comerciales son paneles 8-bit + FRC, una técnica de parpadeo temporal imperceptible que simula 10 bits.",
        "comprobalo": "Mirá en Pantalla avanzada el valor \"Profundidad de bits de color\"."
      }
    },
    "entende": {
      "queEs": "La cantidad de bits asignados a cada canal cromático (Rojo, Verde, Azul). 8 bits = 16.7 millones; 10 bits = 1070 millones.",
      "paraQueSirve": "Elimina el color banding y permite gradientes suaves en cielos, humo y contenido HDR.",
      "quePasaSiFalta": "Efecto póster (posterización) y artefactos en imágenes comprimidas."
    },
    "interactua": {
      "cliExample": "wmic path Win32_VideoController get CurrentBitsPerPixel",
      "psExample": "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentBitsPerPixel",
      "syntaxBreakdown": "Muestra la profundidad de bits por píxel (normalmente 32 bits = 8bpc + alpha).",
      "whatToLookFor": "32 bits por píxel con formato RGB completo.",
      "technicalMetrics": "10 bpc requiere DisplayPort 1.4 con DSC o HDMI 2.1 para refrescos superiores a 120Hz."
    },
    "alertaEVO": {
      "reversibilityRule": "Configurable en el panel de control del controlador gráfico (NVIDIA/AMD/Intel).",
      "safetyWarning": "Forzar 10 bits en cables de bajo ancho de banda puede degradar el submuestreo de croma a YCbCr 4:2:2."
    },
    "evidenceBadge": {
      "code": "BIT-DEPTH",
      "label": "Color Depth"
    }
  },
  {
    "id": "inv-18-19",
    "code": "18.19",
    "title": "Multiple monitors",
    "subtitle": "Topología DWM, tasas de refresco mixtas y virtual desktop",
    "targetMechanism": "Desktop Window Manager Multi-Monitor Coordinate Space",
    "targetComponent": "dwm.exe / user32.dll",
    "commandName": "displayswitch",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Tenés un monitor de 144 Hz y uno de 60 Hz; al reproducir un video en el de 60, el juego en el de 144 se siente trabado a 60.",
      "mythVsTruth": {
        "mentira": "Windows 11 nunca tiene problemas al combinar monitores con distinta tasa de refresco o distinta resolución.",
        "verdad": "En Windows 10 la sincronización de DWM anclaba los frames al monitor más lento; Windows 11 solucionó el render desacoplado con Hardware Flip.",
        "comprobalo": "Ejecutá \"displayswitch\" para cambiar entre modos Clonar, Extender y Solo Pantalla 1."
      }
    },
    "entende": {
      "queEs": "La superficie virtual continua que DWM mapea calculando compensación de escala, resolución y posición relativa de cada panel.",
      "paraQueSirve": "Permite arrastrar ventanas entre pantallas con diferente densidad física de píxeles.",
      "quePasaSiFalta": "Ventanas que se agrandan o achican desproporcionadamente al cruzar el límite entre monitores."
    },
    "interactua": {
      "cliExample": "displayswitch /extend",
      "psExample": "Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorID | Select-Object InstanceName",
      "syntaxBreakdown": "Consulta los identificadores de hardware de todos los monitores conectados.",
      "whatToLookFor": "Cada monitor listado con su InstanceName único.",
      "technicalMetrics": "DWM frame clocks independientes por monitor en WDDM 3.0+."
    },
    "alertaEVO": {
      "reversibilityRule": "displayswitch /extend o /clone es instantáneo con Win + P.",
      "safetyWarning": "Evitá adaptadores USB a HDMI baratos sin aceleración; consumen 30% de CPU constante."
    },
    "evidenceBadge": {
      "code": "MULTI-DISP",
      "label": "Multi Display"
    }
  },
  {
    "id": "inv-18-20",
    "code": "18.20",
    "title": "EDID",
    "subtitle": "Extended Display Identification Data: la cédula de la pantalla",
    "targetMechanism": "VESA EDID / DisplayID I2C DDC/CI Handshake",
    "targetComponent": "dxgkrnl.sys / monitor.sys",
    "commandName": "reg query HKLM\\SYSTEM\\CurrentControlSet\\Enum\\DISPLAY",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "Windows dice que tu monitor es \"Dispositivo desconocido\" y no te deja elegir más de 1080p a 60 Hz porque el bloque EDID se corrompió.",
      "mythVsTruth": {
        "mentira": "La placa de video adivina las capacidades del monitor analizando los pulsos de señal.",
        "verdad": "El monitor contiene un chip EEPROM de 128 o 256 bytes que transmite el bloque EDID por el canal I2C (DDC) apenas se conecta el cable.",
        "comprobalo": "Inspeccioná la clave HKLM\\SYSTEM\\CurrentControlSet\\Enum\\DISPLAY en el Registro para ver los bloques EDID cacheados."
      }
    },
    "entende": {
      "queEs": "La estructura de datos binaria estandarizada por VESA que describe fabricante, modelo, resoluciones nativas, frecuencias y espacio de color.",
      "paraQueSirve": "Informa al sistema operativo exactamente qué modos de video son seguros para no dañar el panel.",
      "quePasaSiFalta": "Windows cae en el driver VESA genérico con resolución máxima de 1024x768."
    },
    "interactua": {
      "cliExample": "reg query HKLM\\SYSTEM\\CurrentControlSet\\Enum\\DISPLAY /s /v \"EDID\"",
      "psExample": "Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorDescriptorMethods",
      "syntaxBreakdown": "Extrae los bloques binarios crudos de EDID guardados en el sistema.",
      "whatToLookFor": "Bytes binarios comenzando con la firma 00 FF FF FF FF FF FF 00.",
      "technicalMetrics": "Bloque base VESA de 128 bytes + Extensiones CEA-861 (HDR/Audio)."
    },
    "alertaEVO": {
      "reversibilityRule": "El caché de EDID se purga reinstalando el monitor desde el Administrador de Dispositivos.",
      "safetyWarning": "Usar herramientas como CRU (Custom Resolution Utility) para sobreescribir EDID puede dejar la pantalla fuera de rango."
    },
    "evidenceBadge": {
      "code": "EDID-VESA",
      "label": "EDID Handshake"
    }
  },
  {
    "id": "inv-18-21",
    "code": "18.21",
    "title": "Generic PnP Monitor",
    "subtitle": "Por qué no necesitás un driver de monitor en el 99% de los casos",
    "targetMechanism": "Microsoft Generic PnP Monitor Driver (monitor.sys)",
    "targetComponent": "monitor.sys / monitor.inf",
    "commandName": "Get-PnpDevice -Class Monitor",
    "riskLevel": "SAFE_READONLY",
    "descubri": {
      "hook": "El Administrador de Dispositivos dice \"Monitor PnP genérico\" y pensás que te falta un controlador especial del fabricante.",
      "mythVsTruth": {
        "mentira": "Si tu monitor figura como \"PnP Genérico\" está funcionando a menor calidad de imagen.",
        "verdad": "monitor.sys es un driver universal transparente; todas las resoluciones y frecuencias las provee el EDID y el driver de la GPU.",
        "comprobalo": "Revisá la fecha de monitor.sys: es del 2006 y es intencional, ya que no requiere lógica activa de ejecución."
      }
    },
    "entende": {
      "queEs": "El driver base de Windows que actúa como wrapper del stack de visualización sin alterar la señal.",
      "paraQueSirve": "Garantiza que cualquier pantalla conectada funcione inmediatamente sin depender de drivers propietarios.",
      "quePasaSiFalta": "Solo en pantallas profesionales de diseño con calibración por hardware se requiere el INF/driver del fabricante."
    },
    "interactua": {
      "cliExample": "pnputil /enum-devices /class Monitor",
      "psExample": "Get-PnpDevice -Class Monitor | Select-Object FriendlyName, InstanceId, Status",
      "syntaxBreakdown": "Lista los dispositivos monitor detectados por el subsistema PnP.",
      "whatToLookFor": "Status \"OK\" en el dispositivo PnP.",
      "technicalMetrics": "Cero memoria residente; monitor.sys es un driver funcional de paso."
    },
    "alertaEVO": {
      "reversibilityRule": "Desinstalar el monitor y presionar \"Buscar cambios de hardware\" lo restaura.",
      "safetyWarning": "Los instaladores de monitores que prometen \"optimizar Hz\" suelen ser solo perfiles de color ICC redundantes."
    },
    "evidenceBadge": {
      "code": "PNP-MONITOR",
      "label": "Generic PnP"
    }
  },
  {
    "id": "inv-18-22",
    "code": "18.22",
    "title": "Pantalla bloqueada en 30/60 Hz",
    "subtitle": "Ancho de banda de cable, HDMI 1.4 y adaptadores pasivos",
    "targetMechanism": "DisplayPort / HDMI TMDS / FRL Link Bandwidth Limitation",
    "targetComponent": "Physical Link Layer & Transceiver Handshake",
    "commandName": "Get-CimInstance Win32_VideoController | Select Name, CurrentRefreshRate",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "Conectás tu nuevo monitor 4K y Windows solo te deja elegir 30 Hz: mover el cursor se siente como una pesadilla.",
      "mythVsTruth": {
        "mentira": "Windows tiene un bug que limita artificialmente el refresco de los monitores 4K.",
        "verdad": "Estás usando un puerto o cable HDMI 1.4, cuyo ancho de banda máximo de 10.2 Gbps es físicamente incapaz de transportar 4K a 60 Hz.",
        "comprobalo": "Cambiá a un cable DisplayPort 1.4 o HDMI 2.0/2.1 y la opción de 60/144 Hz aparecerá de inmediato."
      }
    },
    "entende": {
      "queEs": "El límite de bits por segundo que el cable físico de cobre puede transmitir sin atenuación excesiva.",
      "paraQueSirve": "Windows interroga el transceiver del enlace y elimina de la lista los modos que superarían la tasa de error permitida.",
      "quePasaSiFalta": "Si se forzara el modo, el monitor perdería sincronismo mostrando parpadeos continuos (blackouts)."
    },
    "interactua": {
      "cliExample": "wmic path Win32_VideoController get CurrentRefreshRate, VideoModeDescription",
      "psExample": "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentRefreshRate, VideoModeDescription",
      "syntaxBreakdown": "Verifica la combinación activa de resolución y refresco.",
      "whatToLookFor": "Refresco bloqueado en 30 Hz o 60 Hz a pesar de especificaciones mayores del monitor.",
      "technicalMetrics": "HDMI 1.4 = 10.2 Gbps; HDMI 2.0 = 18 Gbps; DP 1.4 = 32.4 Gbps; HDMI 2.1 = 48 Gbps."
    },
    "alertaEVO": {
      "reversibilityRule": "Reemplazar el cable o cambiar al puerto correcto desbloquea los modos en caliente.",
      "safetyWarning": "Nunca uses adaptadores pasivos HDMI a DisplayPort para altas frecuencias; requieren chips activos."
    },
    "evidenceBadge": {
      "code": "LINK-BW",
      "label": "Cable Bandwidth"
    }
  },
  {
    "id": "inv-18-23",
    "code": "18.23",
    "title": "Pantalla negra",
    "subtitle": "TDR (Timeout Detection and Recovery) y colapso de pipeline",
    "targetMechanism": "WDDM Timeout Detection and Recovery (TDR)",
    "targetComponent": "dxgkrnl.sys / watchdog.sys",
    "commandName": "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v TdrDelay",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "La pantalla se congela 2 segundos, se pone negra, parpadea y Windows muestra: \"El controlador de pantalla dejó de responder y se recuperó\".",
      "mythVsTruth": {
        "mentira": "Una pantalla negra momentánea significa que la tarjeta gráfica se quemó físicamente.",
        "verdad": "El mecanismo TDR detectó que la GPU tardó más de 2 segundos en responder a un comando del kernel y reinició el driver antes de que cause un BSOD.",
        "comprobalo": "Revisá el Visor de Eventos > Registros de Windows > Sistema y buscá eventos con origen \"Display\"."
      }
    },
    "entende": {
      "queEs": "El sistema de seguridad de Windows que previene bloqueos catastróficos reinicializando el scheduler de la GPU sin reiniciar el PC.",
      "paraQueSirve": "Salva el trabajo del usuario y el estado del escritorio frente a shaders corruptos o cuelgues térmicos.",
      "quePasaSiFalta": "Sin TDR, cualquier error de la GPU causaría un pantallazo azul inmediato (VIDEO_TDR_FAILURE 0x116)."
    },
    "interactua": {
      "cliExample": "reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers /v TdrDelay",
      "psExample": "Get-ItemProperty -Path \"HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\" -Name TdrDelay -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Consulta el tiempo de espera de TDR (por defecto 2 segundos).",
      "whatToLookFor": "TdrDelay = 2 o no configurado (valor por defecto seguro).",
      "technicalMetrics": "TDR reset latency < 2500 ms con restauración de buffers DWM."
    },
    "alertaEVO": {
      "reversibilityRule": "Si se modifica TdrDelay para pruebas, borrar la clave restaura el valor default.",
      "safetyWarning": "Aumentar TdrDelay a valores altos puede dejar el equipo completamente congelado ante fallas de hardware."
    },
    "evidenceBadge": {
      "code": "TDR-RECOVERY",
      "label": "TDR Engine"
    }
  },
  {
    "id": "inv-18-24",
    "code": "18.24",
    "title": "Parpadeos",
    "subtitle": "Flickering, MPO (Multi-Plane Overlay) y corrupción de DWM",
    "targetMechanism": "Multi-Plane Overlays (MPO) & Desktop Window Manager Composition",
    "targetComponent": "dwm.exe / dxgkrnl.sys",
    "commandName": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm\" /v OverlayTestMode",
    "riskLevel": "MODIFIES_STATE",
    "descubri": {
      "hook": "Al reproducir un video en Chrome o Discord mientras jugás, toda la pantalla parpadea en negro o blanco cada pocos segundos.",
      "mythVsTruth": {
        "mentira": "Los parpadeos son siempre culpa de un cable flojo o del panel dañado.",
        "verdad": "En el 80% de los casos en Windows 10/11 se debe a fallas en la tecnología MPO (Multi-Plane Overlay) del driver al componer capas de video.",
        "comprobalo": "Desactivar MPO mediante clave de Registro soluciona de inmediato el parpadeo en navegadores."
      }
    },
    "entende": {
      "queEs": "Una función de hardware que permite a la GPU componer ventanas de video o juegos en planos directos sin pasar por el buffer de DWM.",
      "paraQueSirve": "Ahorra energía y reduce la latencia en reproducción multimedia.",
      "quePasaSiFalta": "Si el driver tiene un bug de timing en MPO, la pantalla parpadea al superponer ventanas transparentes."
    },
    "interactua": {
      "cliExample": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm\" /v OverlayTestMode",
      "psExample": "Get-ItemProperty -Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows\\Dwm\" -Name OverlayTestMode -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Valor 0x00000005 deshabilita MPO forzando composición estándar por DWM.",
      "whatToLookFor": "OverlayTestMode = 5 para resolver problemas crónicos de flickering.",
      "technicalMetrics": "Composición clásica DWM añade ~0.5ms de GPU copy overhead pero elimina parpadeos."
    },
    "alertaEVO": {
      "reversibilityRule": "Eliminar el valor OverlayTestMode en el Registro restaura MPO de fábrica.",
      "safetyWarning": "Asegurate de reiniciar el explorador o el PC tras modificar claves de DWM."
    },
    "evidenceBadge": {
      "code": "MPO-FLICKER",
      "label": "MPO Composition"
    }
  },
  {
    "id": "inv-18-25",
    "code": "18.25",
    "title": "Driver reset",
    "subtitle": "El atajo secreto Win + Ctrl + Shift + B",
    "targetMechanism": "DirectX Graphics Kernel User-Mode Driver Restart Hook",
    "targetComponent": "dwm.exe / user32.dll / dxgkrnl.sys",
    "commandName": "powershell -Command \"Restart-Service -Name DWM -Force\"",
    "riskLevel": "LOW_RISK",
    "descubri": {
      "hook": "La pantalla quedó congelada o en negro tras salir de un juego; presionás Win + Ctrl + Shift + B, suena un pitido y la imagen revive.",
      "mythVsTruth": {
        "mentira": "Win + Ctrl + Shift + B reinstala el controlador de video descargando archivos nuevos.",
        "verdad": "No reinstala el driver; descarta los buffers de la superficie de pantalla, solicita un redibujado forzado a DWM y reinicia el subsistema de usuario.",
        "comprobalo": "Probá la combinación ahora mismo: escucharás un \"beep\" sonoro y la pantalla parpadeará una fracción de segundo."
      }
    },
    "entende": {
      "queEs": "Un hook de depuración integrado en el kernel de Windows para recuperarse de cuelgues del framebuffer de usuario sin apagar el equipo.",
      "paraQueSirve": "Salva sesiones de trabajo cuando la composición de pantalla queda trabada en un buffer inválido.",
      "quePasaSiFalta": "El usuario se ve forzado a presionar el botón de apagado de la máquina, perdiendo archivos no guardados."
    },
    "interactua": {
      "cliExample": "echo Presiona Win + Ctrl + Shift + B en tu teclado fisico",
      "psExample": "Get-WinEvent -ProviderName \"Microsoft-Windows-Dwm-Core\" -MaxEvents 5 -ErrorAction SilentlyContinue",
      "syntaxBreakdown": "Revisa eventos de recuperación y reconexión de superficies de DWM.",
      "whatToLookFor": "Eventos de DWM Composition Restarted exitosos.",
      "technicalMetrics": "Tiempo de recuperación promedio: 400 a 800 ms."
    },
    "alertaEVO": {
      "reversibilityRule": "Completamente seguro e inocuo; no altera configuraciones persistentes.",
      "safetyWarning": "No presiones la combinación repetidamente en bucle para no saturar la cola de comandos del kernel."
    },
    "evidenceBadge": {
      "code": "DRIVER-RESET",
      "label": "Win+Ctrl+Shift+B"
    }
  }
];

export const SECTOR_18_MINICASES: Sector18MiniCase[] = [
  {
    "id": "case-18-01",
    "code": "MC-18.01",
    "title": "La laptop gamer que rinde como una netbook de oficina",
    "scenario": "Un usuario adquiere una laptop con RTX 4070 pero su juego favorito apenas alcanza 14 FPS con micro-cortes continuos. El equipo está enchufado a la corriente.",
    "userStatement": "La placa de video me vino fallada de fábrica, voy a pedir la garantía.",
    "initialMistake": "Asumir falla física del silicio sin verificar la topología DXGI y la asignación de GPU en Windows.",
    "diagnosticQuestion": "¿Cuál es el primer paso diagnóstico certero para resolver el problema?",
    "options": [
      {
        "id": "opt-a",
        "text": "Desinstalar el juego y formatear Windows 11 desde cero.",
        "isCorrect": false,
        "explanation": "Extremo e innecesario; si la directiva de Windows sigue apuntando al iGPU, el problema persistirá tras el formateo."
      },
      {
        "id": "opt-b",
        "text": "Verificar en Configuración > Pantalla > Gráficos si el ejecutable está asignado a \"Alto Rendimiento\" (RTX 4070) o si Optimus está forzando el iGPU.",
        "isCorrect": true,
        "explanation": "En laptops híbridas, Windows a menudo clasifica nuevos juegos como aplicaciones de bajo consumo, corriendo en los gráficos integrados del CPU."
      },
      {
        "id": "opt-c",
        "text": "Deshabilitar el adaptador de gráficos integrados de Intel/AMD en el Administrador de Dispositivos.",
        "isCorrect": false,
        "explanation": "Peligroso: en laptops sin MUX switch físico, el panel interno está cableado a la iGPU. Deshabilitarla puede provocar pantalla negra total."
      }
    ],
    "technicalVerdict": "El juego corría en el procesador integrado debido a la heurística de Windows. Asignar manualmente GpuPreference=2 restauró los 140 FPS.",
    "lessonLearned": "En arquitecturas híbridas (Optimus/Switchable), el subsistema DXGI de Windows tiene la última palabra sobre qué silicio renderiza cada ejecutable."
  },
  {
    "id": "case-18-02",
    "code": "MC-18.02",
    "title": "Monitor 4K bloqueado a 30 Hz y mareos del usuario",
    "scenario": "Un diseñador conecta su monitor 4K mediante un cable HDMI que tenía guardado en un cajón. El mouse tiene un retraso intolerable y la opción de 60 Hz no aparece en la lista.",
    "userStatement": "Windows 11 no es compatible con la resolución 4K de este monitor.",
    "initialMistake": "Culpar al sistema operativo cuando la limitación es el ancho de banda del estándar físico del cable HDMI.",
    "diagnosticQuestion": "¿Por qué Windows no permite seleccionar 60 Hz en este escenario?",
    "options": [
      {
        "id": "opt-a",
        "text": "El cable es HDMI 1.4 antiguo, cuyo límite físico es 10.2 Gbps, insuficiente para transportar 4K a más de 30 Hz sin compresión.",
        "isCorrect": true,
        "explanation": "4K a 60 Hz en RGB de 8 bits requiere al menos 12.54 Gbps de ancho de banda no comprimido (HDMI 2.0 o DisplayPort 1.2+)."
      },
      {
        "id": "opt-b",
        "text": "Falta instalar el controlador oficial con firma digital del monitor en Windows Update.",
        "isCorrect": false,
        "explanation": "Los monitores usan el driver transparente monitor.sys. El límite proviene del handshake de ancho de banda del enlace físico."
      },
      {
        "id": "opt-c",
        "text": "Se debe activar el Modo Juego de Windows para habilitar los 60 Hz.",
        "isCorrect": false,
        "explanation": "Modo Juego no tiene relación con el reloj de pixel del enlace de video."
      }
    ],
    "technicalVerdict": "Reemplazar el cable por un cable DisplayPort 1.4 habilitó inmediatamente 4K a 144 Hz con soporte HDR de 10 bits.",
    "lessonLearned": "La interfaz física impone el límite supremo de píxeles por segundo; ningún tweak de software puede superar las leyes de la señalización digital."
  },
  {
    "id": "case-18-03",
    "code": "MC-18.03",
    "title": "Parpadeo negro constante al abrir Discord o navegadores",
    "scenario": "Durante sesiones de juego intensivas, cada vez que el usuario recibe un mensaje en Discord o abre un video en YouTube, la pantalla parpadea en negro por 1 segundo.",
    "userStatement": "La tarjeta de video tiene artefactos y está a punto de quemarse.",
    "initialMistake": "Confundir fallas en la tecnología Multi-Plane Overlay (MPO) de DWM con muerte del silicio gráfico.",
    "diagnosticQuestion": "¿Cuál es la causa técnica raíz y la solución recomendada?",
    "options": [
      {
        "id": "opt-a",
        "text": "Bajar las frecuencias de la memoria VRAM un 20%.",
        "isCorrect": false,
        "explanation": "No es inestabilidad de hardware; el problema ocurre exclusivamente al superponer ventanas con aceleración por hardware."
      },
      {
        "id": "opt-b",
        "text": "Incompatibilidad temporal del driver con Multi-Plane Overlays (MPO); desactivar MPO en el registro estabiliza la composición.",
        "isCorrect": true,
        "explanation": "MPO intenta enviar planos independientes de hardware directamente a la pantalla; cuando el driver falla en la sincronización, DWM parpadea."
      },
      {
        "id": "opt-c",
        "text": "Comprar una fuente de alimentación de 1000W.",
        "isCorrect": false,
        "explanation": "El consumo durante la apertura de una ventana en Discord es mínimo; no es un problema de rieles de potencia."
      }
    ],
    "technicalVerdict": "La desactivación de MPO eliminó por completo los parpadeos entre aplicaciones aceleradas por GPU y el juego en segundo plano.",
    "lessonLearned": "DWM y sus optimizaciones de planos de hardware pueden tener conflictos con navegadores basados en Chromium; el diagnóstico debe aislar el pipeline de composición."
  },
  {
    "id": "case-18-04",
    "code": "MC-18.04",
    "title": "El \"HDR\" que convirtió el juego en un desierto gris y desteñido",
    "scenario": "Un usuario activa HDR en su monitor certificado como \"HDR 400\" con panel IPS de borde. En lugar de colores increíbles, la imagen pierde contraste y el texto cansa la vista.",
    "userStatement": "El HDR en PC no funciona, es una estafa publicitaria.",
    "initialMistake": "Esperar rango dinámico real en un panel con retroiluminación global sin atenuación local por zonas (Local Dimming).",
    "diagnosticQuestion": "¿Por qué la experiencia HDR fue decepcionante en este equipo?",
    "options": [
      {
        "id": "opt-a",
        "text": "Windows 11 requiere tener activado obligatoriamente el perfil sRGB en lugar de DCI-P3.",
        "isCorrect": false,
        "explanation": "HDR utiliza el espacio BT.2020 con contenedor ST.2084; forzar sRGB rompería la calibración."
      },
      {
        "id": "opt-b",
        "text": "HDR 400 sin FALD (Full Array Local Dimming) o OLED simplemente sube el brillo general al 100%, arruinando el nivel de negros a más de 0.4 nits.",
        "isCorrect": true,
        "explanation": "El verdadero HDR depende del ratio de contraste (negros profundos vs brillos cegadores); si el panel ilumina todo a la vez, los negros se vuelven grises."
      },
      {
        "id": "opt-c",
        "text": "El cable DisplayPort está conectado en sentido inverso.",
        "isCorrect": false,
        "explanation": "Los cables DisplayPort estándar son bidireccionales y pasivos."
      }
    ],
    "technicalVerdict": "El monitor carece del hardware necesario para HDR real. Se calibró adecuadamente en modo SDR con amplio gamut de color.",
    "lessonLearned": "HDR no es solo una señal de software; sin capacidad física de apagar píxeles individuales (OLED) o zonas pequeñas (Mini-LED), el resultado es perjudicial."
  }
];

export const SECTOR_18_TEST_BANK: Sector18TestQuestion[] = [
  {
    "id": "q-18-01",
    "questionNumber": 1,
    "category": "Arquitectura DXGI",
    "question": "¿Qué componente del sistema operativo es el responsable directo de enumerar los adaptadores gráficos y gestionar los swap chains?",
    "options": [
      {
        "id": "opt-a",
        "text": "DirectX Graphics Infrastructure (DXGI)"
      },
      {
        "id": "opt-b",
        "text": "Windows Audio Session API (WASAPI)"
      },
      {
        "id": "opt-c",
        "text": "Hardware Abstraction Layer (HAL)"
      },
      {
        "id": "opt-d",
        "text": "Windows Management Instrumentation (WMI)"
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "DXGI (dxgi.dll) es el subsistema de nivel superior que maneja la enumeración de GPUs físicas, salidas de pantalla y swap chains para Direct3D.",
    "relatedInvestigationCode": "18.01"
  },
  {
    "id": "q-18-02",
    "questionNumber": 2,
    "category": "Topología Híbrida",
    "question": "En una laptop sin MUX switch físico, ¿cuál es el trayecto que realiza un fotograma renderizado por la GPU dedicada?",
    "options": [
      {
        "id": "opt-a",
        "text": "Viaja directamente por un cable ribbon interno hacia el panel sin intermediarios."
      },
      {
        "id": "opt-b",
        "text": "Se copia a través del bus PCIe a la memoria del iGPU, que se encarga del scanout final a la pantalla."
      },
      {
        "id": "opt-c",
        "text": "Se guarda en el disco SSD y DWM lo lee como archivo temporal."
      },
      {
        "id": "opt-d",
        "text": "Se comprime por Wi-Fi hacia el controlador de pantalla."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "En diseños Optimus clásicos, la pantalla está cableada exclusivamente al iGPU. La dGPU debe volcar sus buffers por PCIe a la RAM compartida del iGPU para el refresco.",
    "relatedInvestigationCode": "18.02"
  },
  {
    "id": "q-18-03",
    "questionNumber": 3,
    "category": "Hardware Scheduling",
    "question": "¿Qué cambio fundamental introduce HAGS (Hardware-Accelerated GPU Scheduling) en WDDM 2.7+?",
    "options": [
      {
        "id": "opt-a",
        "text": "Aumenta el voltaje de la GPU un 15% de forma automática."
      },
      {
        "id": "opt-b",
        "text": "Delega la planificación de memoria de video y colas de comandos directamente a un microprocesador dedicado en la GPU."
      },
      {
        "id": "opt-c",
        "text": "Elimina los drivers de video y usa código ensamblador directo."
      },
      {
        "id": "opt-d",
        "text": "Fuerza todos los juegos a correr en resolución 720p para ganar fluidez."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "HAGS transfiere la tarea de scheduling de hilos y memoria desde el kernel de CPU hacia el hardware de la GPU, reduciendo drásticamente la latencia de despacho.",
    "relatedInvestigationCode": "18.05"
  },
  {
    "id": "q-18-04",
    "questionNumber": 4,
    "category": "Presentación de Ventanas",
    "question": "¿Cuál es la principal ventaja técnica de Modern Flip Model frente al modelo tradicional de BitBlt en juegos en ventana?",
    "options": [
      {
        "id": "opt-a",
        "text": "Elimina la copia intermedia en memoria, logrando la misma latencia y soporte VRR que el modo pantalla completa exclusiva."
      },
      {
        "id": "opt-b",
        "text": "Permite jugar sin tener tarjeta gráfica instalada."
      },
      {
        "id": "opt-c",
        "text": "Duplica la resolución del monitor mediante inteligencia artificial."
      },
      {
        "id": "opt-d",
        "text": "Bloquea la conexión a internet para evitar trampas en multijugador."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "Con Flip Model (FLIP_DISCARD), el buffer de la aplicación se intercambia directamente con el hardware de escaneo sin que DWM copie los píxeles a su backbuffer.",
    "relatedInvestigationCode": "18.06"
  },
  {
    "id": "q-18-05",
    "questionNumber": 5,
    "category": "Sincronización Dinámica",
    "question": "¿Qué condición de hardware es obligatoria para que funcione Variable Refresh Rate (VRR / G-Sync Compatible)?",
    "options": [
      {
        "id": "opt-a",
        "text": "Tener una fuente de alimentación modular."
      },
      {
        "id": "opt-b",
        "text": "Conexión DisplayPort o HDMI 2.1 VRR con soporte Adaptive-Sync reportado en el bloque EDID."
      },
      {
        "id": "opt-c",
        "text": "Tener instalado Windows en formato FAT32."
      },
      {
        "id": "opt-d",
        "text": "Desactivar el sonido en el Administrador de Dispositivos."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "VRR requiere que el enlace transmita paquetes de sincronización vertical de longitud variable (Adaptive-Sync), soportado en DisplayPort y HDMI 2.1.",
    "relatedInvestigationCode": "18.08"
  },
  {
    "id": "q-18-06",
    "questionNumber": 6,
    "category": "Latencia y FPS",
    "question": "¿Por qué tener 240 FPS en un monitor de 60 Hz reduce el retardo del cursor a pesar de que el panel solo refresque 60 veces por segundo?",
    "options": [
      {
        "id": "opt-a",
        "text": "Porque el monitor mágicamente acelera sus cristales líquidos."
      },
      {
        "id": "opt-b",
        "text": "Porque el fotograma que el monitor muestra en cada ciclo fue terminado más recientemente por la GPU (menor edad del frame)."
      },
      {
        "id": "opt-c",
        "text": "Porque Windows apaga los ventiladores del CPU."
      },
      {
        "id": "opt-d",
        "text": "Porque el mouse transmite más rápido la señal USB si los FPS son altos."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "A mayores FPS, el intervalo entre el procesamiento del input y el renderizado final es menor, por lo que el fotograma listo al momento del scanout es más fresco.",
    "relatedInvestigationCode": "18.13"
  },
  {
    "id": "q-18-07",
    "questionNumber": 7,
    "category": "Composición de Pantalla",
    "question": "¿Qué función cumple el bloque EDID en la comunicación entre monitor y Windows?",
    "options": [
      {
        "id": "opt-a",
        "text": "Almacenar las contraseñas de inicio de sesión de Windows."
      },
      {
        "id": "opt-b",
        "text": "Transmitir mediante I2C/DDC las características físicas, resoluciones seguras, tiempos y capacidades cromáticas del panel."
      },
      {
        "id": "opt-c",
        "text": "Cifrar la señal de video para que no se pueda grabar con OBS."
      },
      {
        "id": "opt-d",
        "text": "Controlar el volumen de los parlantes del monitor."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "EDID (Extended Display Identification Data) es la estructura VESA de 128 o 256 bytes leída por el driver para conocer las resoluciones y frecuencias seguras.",
    "relatedInvestigationCode": "18.20"
  },
  {
    "id": "q-18-08",
    "questionNumber": 8,
    "category": "Mecanismo de Rescate TDR",
    "question": "¿Qué acción ejecuta Windows cuando la GPU no responde a una orden del kernel durante más de 2 segundos?",
    "options": [
      {
        "id": "opt-a",
        "text": "Apaga la computadora de forma abrupta."
      },
      {
        "id": "opt-b",
        "text": "Activa TDR (Timeout Detection and Recovery), reiniciando el planificador del driver y restaurando el escritorio sin BSOD."
      },
      {
        "id": "opt-c",
        "text": "Borra los controladores de la carpeta System32."
      },
      {
        "id": "opt-d",
        "text": "Emite un pitido de alarma continuo por el parlante del gabinete."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "TDR previene bloqueos duros reiniciando los adaptadores gráficos colgados, registrando el evento en el Visor de Eventos y recuperando las superficies DWM.",
    "relatedInvestigationCode": "18.23"
  },
  {
    "id": "q-18-09",
    "questionNumber": 9,
    "category": "Recuperación de Framebuffer",
    "question": "¿Qué realiza exactamente la combinación de teclas Win + Ctrl + Shift + B en Windows?",
    "options": [
      {
        "id": "opt-a",
        "text": "Descarga un driver nuevo desde los servidores de Microsoft."
      },
      {
        "id": "opt-b",
        "text": "Descarta los buffers de superficie de usuario, emite un beep y solicita a DWM un redibujado forzado del framebuffer."
      },
      {
        "id": "opt-c",
        "text": "Abre el BIOS del sistema en una ventana flotante."
      },
      {
        "id": "opt-d",
        "text": "Cambia la resolución de pantalla a 640x480 de forma permanente."
      }
    ],
    "correctOptionId": "opt-b",
    "technicalExplanation": "Es un atajo de emergencia del subsistema de usuario que reinicia la superficie gráfica y fuerza a DWM a reconstruir su árbol visual tras cuelgues leves.",
    "relatedInvestigationCode": "18.25"
  },
  {
    "id": "q-18-10",
    "questionNumber": 10,
    "category": "Frecuencia de Refresco",
    "question": "Si conectás un monitor 4K y la tasa de refresco máxima seleccionable en Windows es de 30 Hz, ¿cuál es la causa más probable?",
    "options": [
      {
        "id": "opt-a",
        "text": "El cable o puerto utilizado es estándar HDMI 1.4, cuyo ancho de banda (10.2 Gbps) no alcanza para 4K a 60 Hz."
      },
      {
        "id": "opt-b",
        "text": "El procesador no tiene suficiente memoria caché L3."
      },
      {
        "id": "opt-c",
        "text": "Falta activar el antivirus de Windows Defender."
      },
      {
        "id": "opt-d",
        "text": "El fondo de pantalla elegido es demasiado pesado."
      }
    ],
    "correctOptionId": "opt-a",
    "technicalExplanation": "La limitación de ancho de banda físico en cables HDMI 1.4 o puertos desactualizados restringe la señal 4K a un máximo de 30 fotogramas por segundo.",
    "relatedInvestigationCode": "18.22"
  }
];
