export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "¿Qué elegiremos?",
    answer: "Las y los bolivianos elegiremos a las siguientes autoridades: presidente del Estado Plurinacional de Bolivia; vicepresidenta o vicepresidente; 36 senadoras y senadores (4 por departamento); 130 diputadas y diputados (60 plurinominales, 63 uninominales y 7 de circunscripciones especiales indígena originario campesinas); 9 representantes ante organismos parlamentarios supraestatales (1 por departamento), incluidos en las listas de presidente y vicepresidente.",
    category: "Proceso Electoral"
  },
  {
    id: 2,
    question: "¿Cómo debemos marcar en la papeleta de sufragio?",
    answer: "La votación se considera válida cuando se utiliza un signo, marca o señal visible y clara que exprese la voluntad de la o el elector, y esté dentro del espacio de solamente una o un candidato.",
    category: "Votación"
  },
  {
    id: 3,
    question: "¿Cómo se realiza el conteo de votos?",
    answer: "La presidenta o presidente de la mesa de sufragio desdobla las papeletas una por una y las vuelve a doblar horizontalmente de manera que quede visible la franja superior a un lado y la franja inferior al otro. Se empieza el conteo por la franja de candidaturas presidenciales. La presidenta o presidente de la mesa de sufragio lee en voz alta el nombre de la organización política o alianza política a la que corresponde el voto. Estos votos se registran en la hoja de trabajo correspondiente por la secretaria o secretario. De igual manera, se leen en voz alta y se registran los votos blancos y nulos. Concluido el conteo de las candidaturas presidenciales (franja superior), se sigue el mismo procedimiento para el conteo de la franja inferior, de diputadas y diputados uninominales o especiales. La secretaria o secretario registra estos votos en la hoja de trabajo correspondiente. También se leen en voz alta y se registran los votos blancos y nulos. Finalizado el conteo de votos de ambas franjas, se suman los votos válidos, blancos y nulos de cada franja. La presidenta o presidente anuncia en voz alta los resultados obtenidos por cada organización política o alianza política, así como la cantidad de votos blancos y nulos en cada franja.",
    category: "Conteo"
  },
  {
    id: 4,
    question: "Distribución de escaños a nivel nacional",
    answer: "Un escaño es un puesto en la Asamblea Legislativa que representa a un grupo de personas. Cuantos más escaños tenga un partido, más poder tienen para tomar decisiones y hacer leyes. En una elección, los partidos y candidatos compiten para ganar estos escaños y así decidir sobre el futuro del país. La distribución de escaños la realiza el órgano electoral en base al número de habitantes de acuerdo al último Censo Nacional. Se distribuyen en base al procedimiento de asignación que considera los principios de igualdad territorial, equidad poblacional departamental, proporcionalidad y plurinacionalidad. Escaños en la Cámara de Senadores: 36 senadores 4 por departamento. Principio de igualdad territorial, cada departamento independientemente de su población elige 4 senadores en votos acumulativos obtenidos por las candidaturas a presidenta o presidente, bajo distribución proporcional. Escaños en la Cámara de Diputados: 60 diputadas y diputados plurinominales, son elegidas y elegidos de las listas encabezadas por las candidaturas para presidenta o presidente del Estado, mediante el sistema proporcional. 63 diputadas y diputados uninominales, son elegidas y elegidos por simple mayoría de sufragios válidos. 7 diputadas y diputados circunscripciones especiales, corresponden a cada departamento donde habitan Naciones y Pueblos indígena Originario Campesinos que representan a la plurinacionalidad del Estado. 9 representantes ante organismos Parlamentarios Supraestatales, por organización política, 1 por departamento.",
    category: "Sistema Electoral"
  },
  {
    id: 5,
    question: "¿Qué es el acta de escrutinio?",
    answer: "Es el documento más importante de este proceso porque aquí se registran los resultados obtenidos en la mesa de sufragio. La primera copia del acta se entregará a la o el operador del Sirepe, la segunda copia a la o el notario electoral, otra a la o el presidente de la mesa, y las otras a las y los delegados de la organizaciones políticas y alianzas políticas.",
    category: "Documentación"
  },
  {
    id: 6,
    question: "¿Cuál es la cadena de escrutinio?",
    answer: "Son las medidas de seguridad aplicadas al material electoral en todas sus etapas, desde su producción hasta su disposición una vez finalizada la jornada de votación, dejando prueba documental de la custodia en cada una de ellas. Etapa de la cadena de custodia: Custodia en imprentas, Traslado al COL y luego a los CDL, Resguardo en los centros logísticos, Distribución a recintos electorales, Custodia de ambientes seguros, Vigilancia el día de la elección (desde las 05:00 a.m.), Registro de entrega a jurados, Retorno del sobre \"A\" y material sobrante, Registro final en actas correspondientes.",
    category: "Seguridad"
  },
  {
    id: 7,
    question: "Procedimiento de votación",
    answer: "Presentación de la cédula de identidad, Verificación de los datos del elector, Si está habilitado, el elector firma y coloca su huella en la lista correspondiente. Luego, la o el secretario tacha los datos de la o el elector sin afectar el código QR ni el nombre, Entrega de la papeleta, Emisión del voto, Depósito en el ánfora, La o el presidente entrega el certificado de sufragio al elector junto con su cédula de identidad.",
    category: "Votación"
  },
  {
    id: 8,
    question: "¿Qué tipos de voto hay?",
    answer: "Voto válido: Es el voto emitido en favor de una candidatura, en el espacio correspondiente de la papeleta de sufragio. La votación se considera válida cuando se utiliza un signo, marca o señal visible y clara que exprese la voluntad de la o el elector, y esté dentro del espacio de solamente una o un candidato. Voto nulo: Se considera nulo en los siguientes casos: Cuando la marca o señal toca el espacio de más de una o un candidato. Cuando hay más de una casilla marcada dentro de una misma franja. Cuando la papeleta esté rota, dañada o contenga inscripciones o señales ajenas al acto de votación. Voto blanco: Es el que se realiza dejando sin marcar las opciones establecidas en la papeleta de sufragio.",
    category: "Votación"
  },
  {
    id: 9,
    question: "¿Cuáles son los actores electorales?",
    answer: "Órgano Electoral Plurinacional (OEP): Es un órgano del poder público que organiza, supervisa, administra ejecuta y proclama los resultados de las Elecciones Generales 2025 en todo el territorio nacional y también en el extranjero. Se asegura de que todo se haga correctamente, desde el inicio hasta la entrega de resultados. Tribunal Supremo Electoral (TSE): Es la máxima instancia del OEP con jurisdicción y competencia en todo el territorio del Estado Plurinacional de Bolivia y en los asientos electorales ubicados en el exterior. Organiza, dirige, supervisa, administra y ejecuta el proceso electoral. Tribunales Electorales Departamentales (TED): Son el máximo nivel y autoridad a nivel departamental, con jurisdicción y atribuciones en sus respectivos departamentos. Ciudadanas y ciudadanos votantes: Son todas las personas mayores de 18 años que están registradas en el Padrón Electoral. Ejercen su derecho político para votar y elegir a las nuevas autoridades y representantes del Estado Plurinacional de Bolivia. Juezas y jueces electorales: Se encargan de conocer y resolver controversias, sancionar las faltas electorales, vigilar el funcionamiento de las mesas de sufragio y observar el trabajo desarrollado por notarios y jurados electorales. Juradas y jurados electorales: Son personas elegidas por sorteo 30 días antes de la jornada de votación. Su función es organizar y garantizar el óptimo funcionamiento de las mesas de sufragio. Notarias y notarios electorales: Son los que organizan y apoyan el trabajo en los recintos de votación. Sus tareas son: brindar apoyo operativo y logístico, notificar, acompañar y preparar a las y los jurados electorales, organizar el recinto electoral y entregar material electoral. Delegadas y delegados de organizaciones y alianzas políticas: Representan a las organizaciones políticas y alianzas políticas en las Elecciones Generales 2025. Se encargan de verificar el desarrollo del proceso electoral conforme a ley, defender los derechos de su organización política. Su presencia no es obligatoria, pero ayuda a dar mayor confiabilidad al proceso. Guías electorales: Son personas que informan y orientan a las y los electores el día de la votación en el recinto electoral. Informan a la ciudadanía sobre su habilitación o inhabilitación, apoyan a personas con discapacidad motora, visual o auditiva y asisten a los adultos mayores. También acompañan el traslado de los sobres de seguridad. Observadores nacionales e internacionales: Son personas o grupos que observan cómo se desarrollan las elecciones. Su objetivo es garantizar que el proceso se realice de manera transparente. Pueden ser veedores internacionales o nacionales. Efectivos policiales y militares: Durante la jornada electoral, el Órgano Electoral Plurinacional asume el mando de la fuerza pública para garantizar la seguridad en todos los recintos electorales y los Tribunales Electorales Departamentales. El apoyo de la Policía Boliviana y de las Fuerzas Armadas se hace efectivo antes y después del día de la votación, para garantizar la cadena de custodia de los materiales electorales.",
    category: "Actores"
  },
  {
    id: 10,
    question: "¿Qué es el Sirepe?",
    answer: "El Sirepe articula tecnología, logística, recursos humanos y comunicación para difundir resultados electorales preliminares la misma noche de la elección, pero solo con fines informativos y de transparencia.",
    category: "Tecnología"
  },
  {
    id: 11,
    question: "¿Qué son los resultados electorales preliminares?",
    answer: "Son datos electorales no vinculantes ni definitivos, que reúnen los resultados de las actas de mesa de sufragio y que se transmiten mediante el Sistema de Resultados Electorales Preliminares (Sirepe). Su único propósito es informar a la ciudadanía, a las organizaciones políticas y a los medios de comunicación. En ningún caso sustituirán al cómputo oficial.",
    category: "Resultados"
  },
  {
    id: 12,
    question: "¿Cuál es el alcance del Sirepe?",
    answer: "El Sirepe cubre casi todos los recintos electorales del territorio nacional, salvo algunos donde no existe conexión ni acceso al internet; pero su alcance es suficiente para cumplir la función puramente informativa para la que fue diseñado. Los resultados de la votación en el exterior provendrán únicamente del cómputo oficial.",
    category: "Tecnología"
  },
  {
    id: 13,
    question: "¿Cómo funciona el Sirepe?",
    answer: "Los operadores envían, desde los recintos electorales, imágenes y datos de las actas de las mesas asignadas. El procedimiento es el siguiente: 1. El operador del Sirepe toma una fotografía nítida y completa del acta electoral original. 2. Registra en la aplicación móvil Sirepe los datos de votación (tal como están en el acta). 3. La fotografía y los datos del acta se transmiten al Centro de Procesamiento de Datos (CPD) mediante una red segura y utilizando cifrado de extremo a extremo. 4. En el CPD se siguen varios pasos para la verificación de la calidad de las imágenes y de la transcripción. 5. Una vez cumplidos estos pasos se realiza la publicación de los resultados preliminares.",
    category: "Tecnología"
  },
  {
    id: 14,
    question: "¿Qué porcentaje de votos debe tener un candidato para ganar las elecciones generales?",
    answer: "Más del 50% (+ 1 voto) o un mínimo del 40% de votos válidos con una diferencia del 10% con la segunda candidatura más votada.",
    category: "Resultados"
  },
  {
    id: 15,
    question: "¿En qué casos hay segunda vuelta?",
    answer: "Si ningún candidato obtiene el 50 % + 1 o no hay diferencia de 10 %.",
    category: "Resultados"
  },
  {
    id: 16,
    question: "En caso de segunda vuelta ¿Cuándo se realizaría?",
    answer: "En un plazo de 60 días después de la primera votación.",
    category: "Resultados"
  },
  {
    id: 17,
    question: "Distribución de escaños en el departamento de Cochabamba",
    answer: "9 uninominales, 9 plurinominales, 1 especial, 4 senadores, 1 supraestatal.",
    category: "Sistema Electoral"
  },
  {
    id: 18,
    question: "¿Cómo se distribuyen los 130 escaños de la Cámara de Diputados?",
    answer: "60 diputadas y diputados plurinominales, 63 diputados y diputados uninominales, 7 diputados y diputadas circunscripciones. 5 Pando, 29 La paz, 19 Cochabamba, 29 Santa Cruz, 9 Oruro, 13 Potosí, 8 Beni, 9 Chuquisaca y 9 Tarija.",
    category: "Sistema Electoral"
  },
  {
    id: 19,
    question: "¿Qué es el Padrón Electoral Biométrico?",
    answer: "Es el sistema de registro biométrico de todas las bolivianas y bolivianos en edad de votar (mayores de 18 años) y de los extranjeros habilitados por ley para ejercer su derecho al voto en Bolivia.",
    category: "Proceso Electoral"
  },
  {
    id: 20,
    question: "¿Qué datos se registran en el Padrón Electoral?",
    answer: "El Padrón Electoral es el registro de identificación personal más completo de Bolivia, porque incluye datos biométricos y biográficos de las personas empadronadas: 10 huellas dactilares, Fotografía facial, Firma digitalizada.",
    category: "Proceso Electoral"
  },
  {
    id: 21,
    question: "¿Tengo que llevar mi lapicero?",
    answer: "Existencia en la mesa de sufragio.",
    category: "Votación"
  },
  {
    id: 22,
    question: "¿Cómo funciona el voto asistido?",
    answer: "El voto asistido es un derecho de las personas con discapacidad o mayores de 60 años que soliciten expresamente ayuda para votar. Las personas mayores de 60 años o con dificultades visuales, auditivas o para trasladarse que necesiten ayuda para votar pueden pedir asistencia a la presidenta o presidente de su mesa de votación. La presidenta o presidente de la mesa verifica la situación del elector y comunica su necesidad a los otros jurados y a los delegados de la mesa. Formas de voto asistido: La presidenta o presidente de la mesa acompaña a la persona al recinto y vigila que se cumpla la voluntad de la persona que solicitó el voto asistido. El acompañante marca las opciones que decida la electora o el elector. Si la electora o elector no tuviera un acompañante, la presidenta o presidente de mesa escoge a una persona de la la para que entre como testigo y luego marcará la papeleta siguiendo la voluntad de la electora o elector, en presencia del testigo. El material electoral para la asistencia a personas con discapacidad incluye: Una cercha en alfabeto braille, que se superpone a la papeleta de sufragio, en el caso de personas con dificultades visuales. Material impreso con información e instrucciones escritas sobre 'cómo votar' para personas con dificultades auditivas.",
    category: "Votación"
  },
  {
    id: 23,
    question: "¿Qué es el certificado de sufragio?",
    answer: "Es el documento público que certifica la participación de las personas en el acto electoral. Es la constancia de que la ciudadana o ciudadano votó. El certificado de sufragio, que se entrega a toda persona que ha votado, será válido siempre y cuando tenga la firma y huella dactilar de la presidenta o presidente de la mesa de sufragio.",
    category: "Documentación"
  },
  {
    id: 24,
    question: "¿Qué sanciones o multas hay por no votar?",
    answer: "Los ciudadanos que no voten el día de la elección o no exhiban el certificado de sufragio como único documento que acredita haber cumplido con la obligación del voto dentro de los noventa días siguientes a la elección, serán sancionados con una multa equivalente al 20% (Bs 550) del salario mínimo, caso contrario se aplicará el impedimento por 90 días para acceder a cargos públicos, efectuar trámites bancarios y obtener pasaporte. Quedan eximidos de esta sanción: las personas que no pudieron votar por caso fortuito o fuerza mayor comprobada documentalmente; las personas mayores de setenta (70) años; y las personas que acrediten haber estado ausentes del territorio nacional al momento de la votación.",
    category: "Proceso Electoral"
  },
  {
    id: 25,
    question: "¿Cuáles son las causales de la nulidad de actas electorales?",
    answer: "Se consideran causales de nulidad de un acta electoral las siguientes situaciones: a. La ausencia de las firmas y huellas dactilares de por lo menos tres Jurados Electorales legalmente designados. Se admitirá la impresión dactilar, sin firma, de una o un solo jurado. b. El uso de formularios de Actas no aprobados por la autoridad electoral competente. c. El funcionamiento de la mesa de sufragio en lugar distinto al señalado por la autoridad electoral competente. d. El funcionamiento de la mesa de sufragio en día distinto del fijado para el verificativo de la elección. e. El cómputo de votos emitidos en papeletas distintas a las proporcionadas por la autoridad electoral competente. f. El uso de papeletas de sufragio de distinta circunscripción uninominal o especial. g. La existencia de elementos que contradigan los datos contenidos en el Acta Electoral, aunque no se hubiere asentado la observación en el Acta. h. La existencia de datos asentados en el Acta Electoral que sean contradictorios o inconsistentes entre sí, aunque no se hubiere asentado la observación en el Acta. i. La existencia de diferencias en los datos del Acta Electoral original y sus copias, aunque no se hubiere asentado la observación en el Acta. j. La existencia de alteración de datos, borrones o tachaduras en el Acta Electoral, que no hayan sido señaladas en las observaciones de la propia Acta. k. La violación de la integridad del sobre de seguridad o el extravío del Acta original, cuando no pueda ser reemplazada por dos copias auténticas e iguales. l. La consignación de un número de votos en el Acta Electoral que supere la cantidad de personas inscritas en la mesa. Durante el proceso de valoración de la existencia de causales de nulidad, el Tribunal Electoral Departamental podrá revisar todo el material electoral contenido en los sobres de seguridad y, si fuera necesario, recurrir a las Notarías o Notarios y a las Juradas o Jurados de la mesa de sufragio correspondiente para solicitar aclaraciones. Declarada la nulidad, se repetirá el acto de votación en la mesa de sufragio correspondiente, con el mismo padrón y con nuevos jurados electorales, el segundo domingo siguiente de realizada la elección.",
    category: "Documentación"
  },
  {
    id: 26,
    question: "¿Cuándo es la posesión de las nuevas autoridades?",
    answer: "Sábado 8 de noviembre de 2025.",
    category: "Proceso Electoral"
  },
  {
    id: 27,
    question: "¿Dónde consulto mi recinto electoral y mesa de sufragio?",
    answer: "https://yoparticipo.oep.org.bo/auth/signin",
    category: "Proceso Electoral"
  },
  {
    id: 28,
    question: "¿El sistema TREP funcionará en estas elecciones?",
    answer: "Ahora el TREP (Transmisión de Resultado Electorales Preliminares) esta bajo el nombre de SIREPE (Sistema de Resultados Preliminares). Y si dará resultados preliminares el día de las elecciones.",
    category: "Tecnología"
  },
  {
    id: 29,
    question: "¿Qué documentos son válidos para emitir mi voto?",
    answer: "La cédula de identidad original vigente y en formato físico es el único documento válido para ejercer el derecho al voto en estas elecciones generales. El Tribunal Supremo Electoral (TSE) informa que, de acuerdo con la normativa vigente y su reglamentación, el único documento válido para ejercer el derecho al sufragio es la cédula de identidad original y en formato físico. Se recuerda a todas las personas habilitadas que no se aceptarán fotocopias, documentos digitales ni ningún otro tipo de identificación el día de la votación.",
    category: "Votación"
  },
  {
    id: 30,
    question: "¿En qué horario puedo emitir mi voto?",
    answer: "El horario de votación es de ocho (8) horas continuas, a partir de la apertura de la mesa para que los ciudadanos hagan efectivo su voto. La mesa de sufragio iniciará con la jornada electoral a las 08:00, y como máximo hasta las 9 de la mañana. El horario de votación podrá extenderse cuando existan ciudadanas y ciudadanos esperando en la fila y que aún no hayan votado, en ese caso se desarrollará hasta que la o el último ciudadano de la fila emita su voto.",
    category: "Votación"
  },
  {
    id: 31,
    question: "¿Tengo derecho a día libre si soy jurado electoral?",
    answer: "Si, el jurado electoral tendrá una jornada laboral libre el lunes siguiente.",
    category: "Proceso Electoral"
  },
  {
    id: 32,
    question: "¿El voto rural vale doble en relación al urbano?",
    answer: "En la normativa se determina el criterio de la proporcionalidad poblacional para la delimitación de circunscripciones uninominales. Al mejorar la aplicación de este criterio, se reduce la posibilidad o la percepción de que el voto rural valga mas que el área urbana o viceversa.",
    category: "Sistema Electoral"
  },
  {
    id: 33,
    question: "¿Dónde y cómo puedo obtener un certificado de impedimento si no pude asistir a sufragar?",
    answer: "El día de la votación, cada Tribunal Electoral Departamental instalará en diferentes recintos electorales urbanos y en las oficinas del propio Tribunal módulos automatizados para la expedición y entrega de certificados de impedimento de sufragio.",
    category: "Documentación"
  },
  {
    id: 34,
    question: "¿Qué prohibiciones hay el día de las elecciones?",
    answer: "Prohibición de propaganda electoral: Desde las 00:00 del jueves 14 de agosto hasta las 18:00 del domingo 17 queda prohibida toda manifestación pública de apoyo o rechazo a candidaturas, en cualquier formato o medio. Restricción de consumo de alcohol: Desde las 00:00 del viernes 15 hasta las 12:00 del lunes 18 de agosto no se podrá vender ni consumir bebidas alcohólicas en domicilios, tiendas, restaurantes, hoteles, cantinas u otros establecimientos públicos o privados. Prohibición de portar armas: Durante toda la jornada electoral del domingo 17 queda prohibido portar armas de fuego, armas blancas o cualquier objeto que represente un peligro para la seguridad ciudadana. Esta disposición no incluye a las Fuerzas Armadas ni a la Policía, que estarán a cargo del resguardo del orden. Suspensión de reuniones y espectáculos: Desde las 00:00 hasta las 24:00 del día de las elecciones no se podrán realizar actos públicos, reuniones o espectáculos de ninguna índole. Prohibición de traslado de electores: Durante el día de la elección queda prohibido trasladar votantes de un recinto electoral a otro, por cualquier medio de transporte. Cualquier caso detectado será remitido al Ministerio Público, en aplicación del artículo 238, inciso i) de la Ley del Régimen Electoral (Ley 026). Restricción vehicular: Se restringe la circulación de vehículos motorizados, sean particulares, oficiales o de transporte público, durante toda la jornada electoral. Solo podrán transitar aquellos que cuenten con autorización expresa del TSE o de los Tribunales Electorales Departamentales. Están exentos los vehículos de las fuerzas del orden involucrados en tareas de seguridad y custodia electoral, además de ambulancias, vehículos de emergencia y de la prensa.",
    category: "Proceso Electoral"
  },
  {
    id: 35,
    question: "¿Qué es el conteo rápido?",
    answer: "El recuento de escrutinio o conteo rápido consiste en obtener los resultados finales de las mesas de votación de la misma muestra de electores consultados en la encuesta en boca de urna. El nivel de muestra es amplio y se da a nivel nacional, brindando información recogida del acta electoral publicada al final del escrutinio en cada recinto electoral. Se toman en cuenta los resultados tomados de las actas, antes de que estas sean trasladadas a los tribunales electorales departamentales. El margen de error es más pequeño, pues se basa en resultados oficiales.",
    category: "Conteo"
  },
  {
    id: 36,
    question: "¿Qué significa en boca de urna?",
    answer: "Consiste en preguntar sobre el voto realizado a una muestra de electores luego que estos han sufragado. El nivel de muestra es grande, pero hay un margen importante de error, pues el encuestado puede mentir al declarar por qué candidato votó. La normativa nacional indica que debe tenerse el 95% de la muestra registrada en recuento de escrutinio, condición que las empresas de estudio de opinión no pudieron cumplir.",
    category: "Conteo"
  }
];

export const faqCategories = [
  "Todos",
  "Proceso Electoral",
  "Votación", 
  "Conteo",
  "Sistema Electoral",
  "Documentación",
  "Seguridad",
  "Actores",
  "Tecnología",
  "Resultados"
];
