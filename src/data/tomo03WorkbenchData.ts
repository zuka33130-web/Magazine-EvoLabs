/**
 * EVO WORKBENCH 03: casos SIMULADOS para aprender a razonar.
 * La respuesta correcta expresa la mejor siguiente comprobación, NO un diagnóstico de la PC del usuario.
 */
export interface RepairChoice {
  id: string;
  label: string;
  feedback: string;
}
export interface RepairStep {
  id: string;
  question: string;
  options: [RepairChoice, RepairChoice, ...RepairChoice[]];
  correctId: string;
  explanation: string;
}
export interface RepairLab {
  id: string;
  moduleNumbers: string[];
  title: string;
  symptom: string;
  safety: string;
  outcome: string;
  steps: RepairStep[];
}
export const TOMO03_REPAIR_LABS: RepairLab[] = [
  {
    id: 'power-zero',
    moduleNumbers: ['01','02','03','04','05','14'],
    title: 'LAB 01 // PC completamente inerte',
    symptom: 'Caso simulado: al presionar POWER no hay luces, ventiladores ni imagen. Se desconoce la causa.',
    safety: 'No abrir la fuente ATX, no probar circuitos de red ni puentear conectores. Retirar alimentación antes de reconectar componentes. Las comprobaciones energizadas requieren entrenamiento y equipamiento.',
    outcome: 'La causa se establece solo después de una prueba cruzada que reproduzca la falla y confirme su desaparición. Un ventilador inmóvil o un LED apagado no bastan.',
    steps: [
      {id:'p1',question:'¿Cuál es la primera comprobación de bajo riesgo?',options:[
        {id:'a',label:'Confirmar toma, cable, interruptor y alimentación externa con elementos conocidos buenos.',feedback:'Correcto: verificás el camino de alimentación externo antes de señalar un componente.'},
        {id:'b',label:'Comprar una placa madre nueva.',feedback:'No existe todavía evidencia que incrimine a la placa.'},
        {id:'c',label:'Abrir la fuente y revisar capacitores.',feedback:'Peligroso. La fuente contiene tensión de red y energía almacenada aunque esté desconectada.'}
      ],correctId:'a',explanation:'Registrar si la toma funciona, el cable se encuentra íntegro y el interruptor de la fuente está en posición correcta. Ningún LED de placa es un indicador universal.'},
      {id:'p2',question:'El enchufe y el cable externos funcionan. ¿Qué prueba discrimina mejor la fuente?',options:[
        {id:'a',label:'Interpretar el hecho de que el ventilador de la fuente no gire como falla definitiva.',feedback:'Incorrecto: algunas fuentes detienen el ventilador en condiciones de baja carga.'},
        {id:'b',label:'Contrastar con una fuente compatible conocida buena o prueba profesional con carga adecuada.',feedback:'Correcto: una prueba cruzada controlada aporta mucha más evidencia.'},
        {id:'c',label:'Puentear conexiones al azar del ATX de 24 pines.',feedback:'Riesgo de corto y daño; nunca improvisar pines ni interpretar un simple giro como fuente sana.'}
      ],correctId:'b',explanation:'La tensión nominal en reposo no demuestra capacidad de entrega bajo carga. Documentá compatibilidad de conectores y de cables modulares antes de intercambiar fuentes.'},
      {id:'p3',question:'En el caso simulado, la PC inicia con una fuente comprobada compatible. ¿Cuál es el siguiente paso?',options:[
        {id:'a',label:'Entregar la PC sin otra prueba.',feedback:'Insuficiente: resta demostrar estabilidad y registrar qué se cambió.'},
        {id:'b',label:'Cambiar también CPU y RAM por prevención.',feedback:'Cambiar múltiples variables destruye el aislamiento de la causa.'},
        {id:'c',label:'Repetir encendidos, verificar estabilidad y documentar la sustitución y su reversión.',feedback:'Correcto: el restablecimiento y la prueba de estabilidad sustentan la reparación.'}
      ],correctId:'c',explanation:'Veredicto provisional: fuente original sospechosa por prueba cruzada. Verificá estabilidad en condiciones relevantes antes de cerrar expediente.'}
    ]
  },
  {
    id:'no-display',
    moduleNumbers:['02','06','07','08','09','10','11','13','14'],
    title:'LAB 02 // Enciende, no presenta imagen',
    symptom:'Caso simulado: luces y ventiladores funcionan, monitor en negro y sin mensaje de error claro.',
    safety:'Desconectar el equipo antes de cambiar RAM o cablear placas. No retirar componentes con alimentación presente. Consultar manual de placa y CPU para comprobar si existe video integrado.',
    outcome:'Ausencia de imagen no prueba daño de GPU. Separá monitor, enlace, salida usada y secuencia POST.',
    steps:[
      {id:'v1',question:'¿Qué se comprueba primero?',options:[
        {id:'a',label:'Cambiar la tarjeta gráfica.',feedback:'Prematuro: no hay evidencia de que la GPU sea la causa.'},
        {id:'b',label:'Verificar monitor, entrada seleccionada, cable y puerto realmente conectado.',feedback:'Correcto: descartás el tramo externo con mínimo riesgo.'},
        {id:'c',label:'Actualizar BIOS sin imagen y sin procedimiento de recuperación.',feedback:'Una actualización a ciegas aumenta el riesgo de inutilizar la placa.'}
      ],correctId:'b',explanation:'Si hay GPU dedicada, confirmá que el monitor usa una salida de esa GPU. La salida de motherboard podría no funcionar si la CPU carece de iGPU.'},
      {id:'v2',question:'La pantalla y el cable funcionan en otra PC. ¿Qué observación sigue?',options:[
        {id:'a',label:'Leer LEDs de diagnóstico, POST y manual del fabricante; registrar su secuencia.',feedback:'Correcto: los códigos y colores dependen del modelo; no son universales.'},
        {id:'b',label:'Asumir que todos los pitidos significan falla de RAM.',feedback:'Falso: el significado depende de firmware y placa.'},
        {id:'c',label:'Retirar la CPU mientras está encendida.',feedback:'Peligroso: no se manipula hardware energizado.'}
      ],correctId:'a',explanation:'Documentá modelo y revisión de la placa, tipo de CPU, si hubo cambios previos y estado de diagnóstico POST.'},
      {id:'v3',question:'LED DRAM persistente en esta simulación. ¿Cómo discriminás causas?',options:[
        {id:'a',label:'Comprar memoria nueva sin probar.',feedback:'Un LED DRAM también puede reflejar configuración, ranura, controlador o compatibilidad.'},
        {id:'b',label:'Reinstalar Windows.',feedback:'Windows todavía no participa del POST.'},
        {id:'c',label:'Probar módulo conocido bueno y configuración mínima siguiendo el manual, con alimentación desconectada.',feedback:'Correcto: ensayo cruzado documentado para aislar RAM, ranura y configuración.'}
      ],correctId:'c',explanation:'Una prueba positiva en un slot no descarta automáticamente la placa o el controlador de memoria en todas las condiciones.'}
    ]
  },
  {
    id:'shutdown-load',
    moduleNumbers:['02','04','11','12','13','16','25','26','27','31'],
    title:'LAB 03 // Se apaga bajo carga',
    symptom:'Caso simulado: la PC funciona en escritorio y se apaga al cargar un juego o una prueba sostenida.',
    safety:'No encadenar pruebas de estrés cuando hay olor, chispas, ruido anormal o temperaturas fuera de especificación. No abrir la fuente.',
    outcome:'Registrar evento, carga y temperaturas; comparar fuentes o alimentación solo después de comprobar el resto. Un único sensor o log no prueba causalidad.',
    steps:[
      {id:'t1',question:'¿Cuál es el primer conjunto de evidencias?',options:[
        {id:'a',label:'Temperaturas, frecuencia, consumo informado, eventos de apagado y reproducción controlada.',feedback:'Correcto: permite separar térmica, alimentación e inestabilidad de software.'},
        {id:'b',label:'Desactivar todas las protecciones térmicas.',feedback:'Inseguro y contraproducente: las protecciones evitan daño.'},
        {id:'c',label:'Hacer overclock para comprobar rendimiento.',feedback:'Agregar variables invalida el diagnóstico y aumenta el riesgo.'}
      ],correctId:'a',explanation:'Establecé línea base de reposo y carga. Los sensores informados por software tienen límites de calibración.'},
      {id:'t2',question:'Temperaturas observadas normales; apagado brusco reproducible bajo carga. ¿Qué sigue?',options:[
        {id:'a',label:'Dar por sana la fuente solo porque Windows inicia.',feedback:'Windows inicia con una carga distinta de la que provoca el fallo.'},
        {id:'b',label:'Revisar conexiones y dimensionamiento, y contrastar fuente compatible conocida buena.',feedback:'Correcto: evaluás alimentación sin atribuirle una causa no probada.'},
        {id:'c',label:'Formatear el disco sin copia de seguridad.',feedback:'Destructivo y no sustentado por la evidencia.'}
      ],correctId:'b',explanation:'No mezclar cables modulares de fuentes de distintos fabricantes/modelos: incluso conectores idénticos pueden tener patillajes distintos.'},
      {id:'t3',question:'Con la fuente de prueba la falla desaparece repetidamente. ¿Cómo cerrás?',options:[
        {id:'a',label:'Registrar resultados antes/después, configuración de carga y ensayo de estabilidad.',feedback:'Correcto: documentás la base empírica de la reparación.'},
        {id:'b',label:'Anunciar que la GPU está defectuosa.',feedback:'La GPU no fue aislada como origen del problema.'},
        {id:'c',label:'Cambiar la CPU por precaución.',feedback:'Cambiar otra variable ahora no aporta evidencia.'}
      ],correctId:'a',explanation:'La fuente original queda fuertemente implicada; la verificación debe repetirse con hardware de reemplazo definitivo.'}
    ]
  },
  {
    id:'storage-recovery',
    moduleNumbers:['02','15','17','18','19','20','21','22','28','30'],
    title:'LAB 04 // No arranca y hay archivos valiosos',
    symptom:'Caso simulado: error de arranque, disco sospechoso e información del usuario sin respaldo confirmado.',
    safety:'Priorizar preservación de datos. Si hay fallos mecánicos, clics, desconexiones o valores SMART críticos, evitar pruebas repetidas, escritura, CHKDSK /f, formateos y reinstalación sobre el original.',
    outcome:'La recuperación y preservación anteceden al intento de reparar Windows. La copia debe verificarse antes de cualquier operación destructiva.',
    steps:[
      {id:'d1',question:'¿Qué hacés antes de reparar el arranque?',options:[
        {id:'a',label:'Eliminar particiones y reinstalar.',feedback:'Destruye información potencialmente recuperable.'},
        {id:'b',label:'Confirmar valor de los datos, consentimiento y estado de la unidad con mínima escritura.',feedback:'Correcto: el objetivo principal puede ser preservar datos, no arrancar Windows.'},
        {id:'c',label:'Ejecutar CHKDSK /f sobre el disco sospechoso.',feedback:'Una reparación lógica que escribe puede agravar un medio físicamente fallando.'}
      ],correctId:'b',explanation:'Revisá inventario, consentimiento, cifrado BitLocker y claves de recuperación antes de cualquier intervención.'},
      {id:'d2',question:'La unidad presenta errores de lectura crecientes. ¿Cuál es el enfoque?',options:[
        {id:'a',label:'Clonar con estrategia de lectura controlada o derivar a recuperación profesional según criticidad.',feedback:'Correcto: minimizar lecturas sobre original, conservar evidencia y trabajar sobre copia.'},
        {id:'b',label:'Repetir escaneos de superficie durante toda la noche.',feedback:'Más lecturas pueden acelerar el deterioro; no preservan datos.'},
        {id:'c',label:'Hacer formateo de bajo nivel.',feedback:'No corresponde y supone destrucción de datos.'}
      ],correctId:'a',explanation:'Un duplicado sector a sector también puede contener errores: registrar sectores omitidos y comprobar integridad de los archivos recuperados.'},
      {id:'d3',question:'Ya hay copia verificada. ¿Qué secuencia corresponde?',options:[
        {id:'a',label:'Entregar sin informar sobre integridad.',feedback:'Falta registrar los límites del rescate.'},
        {id:'b',label:'Reinstalar en la unidad original defectuosa.',feedback:'La unidad sospechosa no es destino confiable.'},
        {id:'c',label:'Probar reparación del sistema sobre medio sano o copia, validar arranque y documentar los datos recuperados.',feedback:'Correcto: aislás fallo físico y software sin comprometer el original.'}
      ],correctId:'c',explanation:'No informar recuperación completa salvo que la verificación efectivamente la sustente.'}
    ]
  }
];
export const ATX_RAILS = [
 {id:'12',label:'+12 V',nominal:12,min:11.4,max:12.6},
 {id:'5',label:'+5 V',nominal:5,min:4.75,max:5.25},
 {id:'3.3',label:'+3,3 V',nominal:3.3,min:3.135,max:3.465},
 {id:'5vsb',label:'+5 VSB',nominal:5,min:4.75,max:5.25}
] as const;
export function assessAtxRail(id: string, measurement: number) {
  const rail=ATX_RAILS.find(item=>item.id===id);
  if(!rail || !Number.isFinite(measurement) || measurement<0 || measurement>100) return null;
  return {rail,within:measurement>=rail.min && measurement<=rail.max,delta:measurement-rail.nominal,
    caveat:'Comparación didáctica con tolerancia nominal de tensión; una lectura aislada no verifica rizado, transitorios ni capacidad bajo carga.'};
}
