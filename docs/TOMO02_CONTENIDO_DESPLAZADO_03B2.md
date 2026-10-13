# TOMO 02 — CONTENIDO DESPLAZADO (RESTAURACIÓN 03B-2)

Este documento almacena íntegramente el contenido anterior de los módulos M17 a M21 (que abordaban Windows Update, UAC, Reparación In-Place, Latencia DPC y Diagnóstico de Disco al 100%) conforme a los requerimientos de la directiva de restauración quirúrgica EVO LABS.

---

## MÓDULO 17 (ORIGINAL ANTERIOR) — WINDOWS UPDATE Y DISM/SFC
- **Pregunta Hook:** Windows Update se queda clavado en el 23% durante 3 horas. Reiniciás forzadamente la PC, aparece "Deshaciendo cambios" y al día siguiente vuelve a intentar instalar la misma actualización fallida en un bucle infinito. ¿Dónde se trabó y cómo sanear el subsistema de parches?
- **Analogía Simple:** Una fábrica de ensamblado y su depósito de materias primas: Windows Update descarga las piezas empaquetadas en un galpón temporal (SoftwareDistribution)...
- **Explicación EVO:** Las actualizaciones acumulativas de Windows (LCU) pasan por un ciclo estricto de Staging, ensamblado en C:\\Windows\\WinSxS y confirmación tras reinicio por TrustedInstaller.
- **Mito vs Realidad:** Mito: Correr sfc /scannow 5 veces arregla todo. Realidad: Si WinSxS está corrupto, SFC falla. El orden es DISM primero y luego SFC.
- **Deep Dive:** Anatomía de SoftwareDistribution (Download y DataStore), SSU y LCU, WUDO, y cadena DISM /Online /Cleanup-Image /RestoreHealth seguida de sfc /scannow.
- **Caso de Estudio:** Bucle de error 0x800f0922 en estación contable resuelto purgando SoftwareDistribution y ejecutando DISM/SFC.
- **Práctica:** Ejecución de DISM ScanHealth / RestoreHealth y sfc /scannow.

---

## MÓDULO 18 (ORIGINAL ANTERIOR) — UAC Y SECURE DESKTOP
- **Pregunta Hook:** Te descargás un archivo llamado Factura_Pendiente.pdf desde un correo. Hacés doble clic, la pantalla se oscurece por completo y aparece un cartel amarillo pidiéndote permisos de Administrador...
- **Analogía Simple:** La esclusa de seguridad de un banco y el carnet de acceso (Split Token y Secure Desktop).
- **Explicación EVO:** User Account Control (UAC) como frontera de doble token y Secure Desktop (estación aislada ConsentUI inmune a inyección UIPI).
- **Mito vs Realidad:** Mito: Desactivar UAC ahorra tiempo. Realidad: Otorga elevación silenciosa a malware y compromete el anillo 0.
- **Deep Dive:** Split Token en LSASS, Secure Desktop en Winlogon\\Desktop, Firmas Authenticode y la trampa de doble extensión (.pdf.exe).
- **Caso de Estudio:** Ransomware detenido por la ventana de consentimiento del Secure Desktop.
- **Práctica:** Get-AuthenticodeSignature en PowerShell y habilitación de extensiones en el Explorador.

---

## MÓDULO 19 (ORIGINAL ANTERIOR) — REPARACIÓN IN-PLACE (UPGRADE)
- **Pregunta Hook:** ¿Por qué formatear y borrar gigabytes de programas y configuraciones cuando el 90% de los arranques colapsados se deben a 16 KB corruptos en el archivo BCD?
- **Analogía Simple:** Demoler una casa entera porque se trabó la cerradura frente a usar una ganzúa maestra (WinRE, BCDboot, In-Place).
- **Explicación EVO:** WinRE como entorno WinPE independiente, reconstrucción ESP con bcdboot y reparación In-Place reemplazando System32 y WinSxS conservando datos y licencias.
- **Mito vs Realidad:** Mito: Pantalla azul de reparación automática exige formatear. Realidad: El 85% se resuelve con bcdboot o dism /revertpendingactions.
- **Deep Dive:** Estructura WinRE (winre.wim), BCD en ESP FAT32, bisturí de DISM Offline y motor de migración In-Place Setup.
- **Caso de Estudio:** Bucle de reparación automática tras corte eléctrico resuelto reescribiendo BCD con bcdboot.
- **Práctica:** bcdedit /enum {current} y reagentc /info.

---

## MÓDULO 20 (ORIGINAL ANTERIOR) — LATENCIA DPC / ISR Y RENDIMIENTO
- **Pregunta Hook:** ¿Por qué una PC con procesador de 16 núcleos puede sufrir micro-congelamientos y chasquidos de audio mientras una máquina modesta corre con absoluta fluidez?
- **Analogía Simple:** Un Ferrari en una autopista donde un camión de basura (driver defectuoso) frena a cero cada 30 segundos (Latencia DPC).
- **Explicación EVO:** Rutinas DPC y ISR en IRQL 2, impacto de drivers (ndis.sys, nvlddmkm.sys) y metrología con LatencyMon y powercfg.
- **Mito vs Realidad:** Mito: "Máximo Rendimiento" y desactivar C-States siempre da más FPS. Realidad: Aumenta el calor basal y provoca thermal throttling prematuro.
- **Deep Dive:** Arquitectura DPC/ISR, umbrales de LatencyMon (<250µs vs >1000µs), drivers con fugas de interrupción y powercfg /requests.
- **Caso de Estudio:** Micro-stuttering en Ryzen 7 con RTX 4080 resuelto desactivando Energy Efficient Ethernet en ndis.sys.
- **Práctica:** powercfg /list y powercfg /requests.

---

## MÓDULO 21 (ORIGINAL ANTERIOR) — DIAGNÓSTICO DE DISCO AL 100% (HDD IOPS)
- **Pregunta Hook:** ¿Por qué una computadora modesta con 4 GB de RAM y disco duro mecánico se congela por 20 minutos con el disco clavado al 100% de uso cada vez que se enciende?
- **Analogía Simple:** Un bibliotecario en patines buscando libros en 10 pisos (HDD mecánico de 5400 RPM vs SSD NAND flash).
- **Explicación EVO:** Límite físico de IOPS en discos mecánicos (~83 IOPS), congestión por SearchIndexer y TiWorker, optimización visual en sysdm.cpl y descarte de pestañas en navegadores.
- **Mito vs Realidad:** Mito: Hay que instalar versiones "Lite" o "MiniOS" piratas. Realidad: Rompen seguridad y actualizaciones; la solución real es configurar Windows racionalmente o migrar a SSD.
- **Deep Dive:** Barrera de IOPS, optimización DWM en sysdm.cpl, archivo pagefile.sys en 4GB RAM y tab discarding.
- **Caso de Estudio:** Notebook Lenovo con HDD al 100% rescatada pausando indexación, optimizando efectos visuales y clonando a SSD SATA.
- **Práctica:** SystemPropertiesPerformance.exe para optimización de efectos visuales en sysdm.cpl.
