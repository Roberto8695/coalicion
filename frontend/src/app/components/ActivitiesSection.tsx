import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

const activities = [
  {
    title: "Talleres de Capacitación",
    description: "Formación especializada sobre identificación y combate de desinformación electoral",
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: "eMonitor+",
    description: "Herramienta tecnológica avanzada para monitoreo de procesos electorales en tiempo real",
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Análisis Electoral",
    description: "Estudios profundos de procesos electorales y estrategias comunicacionales",
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    title: "Educación Ciudadana",
    description: "Programas educativos sobre mitos electorales y participación democrática",
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
];

const timeline = [
  {
    mes: "Noviembre 2024",
    color: "#b91c1c",
    gradient: "from-red-700 to-red-600",
    bgColor: "bg-red-50",
    items: [
      {
        dia: "12",
        titulo: "Lanzamiento de la Coalición",
        desc: "Presentación formal, lanzamiento de recursos y compromiso con la lucha contra la desinformación electoral en Bolivia."
      }
    ]
  },
  {
    mes: "Diciembre 2024",
    color: "#be123c",
    gradient: "from-rose-700 to-red-700",
    bgColor: "bg-rose-50",
    items: [
      {
        dia: "5",
        titulo: "Taller de Coordinación",
        desc: "Definición de lineamientos de acción conjunta y análisis inicial sobre desinformación electoral."
      },
      {
        dia: "13-14",
        titulo: "Taller de Análisis del Entorno Informativo",
        desc: "Implementación de talleres para detectar desinformación y analizar tendencias."
      },
      {
        dia: "16",
        titulo: "Implementación de plataformas piloto",
        desc: "Instalación de plataformas piloto y diseño de cronograma de acciones escalables."
      }
    ]
  },
  {
    mes: "Enero 2025",
    color: "#991b1b",
    gradient: "from-red-800 to-red-700",
    bgColor: "bg-red-50",
    items: [
      {
        dia: "20",
        titulo: "Reunión de Coordinación 2025",
        desc: "Presentación de avances conjuntos y evaluación del contexto electoral."
      },
      {
        dia: "27",
        titulo: "Inicio del Boletín de Desinformación",
        desc: "Publicación del primer boletín elaborado por Fundación Aru y Fundación Internet Bolivia."
      }
    ]
  },
  {
    mes: "Febrero 2025",
    color: "#be123c",
    gradient: "from-rose-700 to-red-700",
    bgColor: "bg-red-50",
    items: [
      {
        dia: "11",
        titulo: "Diálogo sobre narrativa de desinformación",
        desc: "Conversatorio con expertos y formulación de lineamientos argumentales."
      }
    ]
  },
  {
    mes: "Marzo 2025",
    color: "#7f1d1d",
    gradient: "from-red-900 to-red-800",
    bgColor: "bg-red-50",
    items: [
      {
        dia: "10",
        titulo: "Taller sobre Mitos Electorales",
        desc: "Desmontando mitos electorales: análisis, lógica y contexto electoral."
      },
      {
        dia: "22",
        titulo: "Conversatorio estrategias digitales",
        desc: "Participación de expertos internacionales y mesa de mujeres y juventudes."
      }
    ]
  },
  {
    mes: "Abril 2025",
    color: "#881337",
    gradient: "from-rose-900 to-red-800",
    bgColor: "bg-rose-50",
    items: [
      {
        dia: "10",
        titulo: "Continuación talleres pedagógicos",
        desc: "Espacios sobre mecanismos de encuesta y consulta electoral."
      },
      {
        dia: "28",
        titulo: "Difusión de materiales educativos",
        desc: "Difusión de conclusiones sobre la desinformación."
      }
    ]
  }
];

export default function ActivitiesSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.2"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "103%"]);

  return (
    <motion.section
      id="activities"
      className="py-20 sm:py-24 lg:py-32 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-slate-50/30"></div>
      
      <div className="relative  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-5xl font-montserrat font-regular mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#222426] font-montserrat font-semibold">Nuestras </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent font-montserrat font-semibold">
              Actividades
            </span>
          </motion.h2>
          
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />
        </div>

        {/* Image and Text Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20 items-center">
          {/* Image - Left Column */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/inicial/actividades.png"
                alt="Nuestras Actividades"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 via-transparent to-transparent"></div>
            </div>
          </motion.div>

          {/* Text - Right Column */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-justify text-gray-600 leading-relaxed font-opensans">
              Desarrollamos iniciativas integrales que incluyen talleres de capacitación, implementación de herramientas
              tecnológicas avanzadas, análisis exhaustivo de procesos electorales y creación de lineamientos comunicacionales estratégicos.
            </p>
            
            {/* Additional descriptive text */}
            <div className="space-y-4 text-justify">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-600 font-opensans">
                  Fortalecemos la democracia a través de la educación ciudadana y el combate efectivo contra la desinformación.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-600 font-opensans">
                  Implementamos tecnologías de monitoreo en tiempo real para garantizar procesos electorales transparentes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activities Overview */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.1 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-500 hover:scale-105 h-full relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-full blur-xl transform translate-x-4 sm:translate-x-6 -translate-y-4 sm:-translate-y-6"></div>
                
                <div className="relative">
                  <div className="mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {activity.icon}
                  </div>
                  <h3 className="text-lg sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-gray-900 transition-colors duration-300">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-md sm:text-md leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl lg:text-5xl font-montserrat font-semibold text-[#222426] mb-4">
              Cronología de <span className="text-[#CBA135]">Actividades</span>
            </h3>
            {/* Red underline with gradient */}
                    <motion.div 
                      className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-12  shadow-sm"
                      initial={{ width: 0 }}
                      whileInView={{ width: 128 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      viewport={{ once: true }}
                    ></motion.div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-opensans">
              Seguimiento detallado de nuestras actividades y logros en la lucha contra la desinformación
            </p>
          </motion.div>

          {/* Timeline */}
          <div ref={timelineRef} className="relative">
            {/* Timeline line background */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
            
            {/* Animated timeline line */}
            <motion.div 
              className="absolute left-8 top-0 w-1 bg-gradient-to-b from-red-600 via-rose-600 to-red-800 rounded-full origin-top"
              style={{ height: lineHeight }}
            ></motion.div>
            
            <div className="space-y-8">
              {timeline.map((periodo, index) => (
                <motion.div
                  key={periodo.mes}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-6 w-5 h-5 bg-gradient-to-br ${periodo.gradient} rounded-full border-4 border-white shadow-lg`}></div>
                  
                  {/* Content */}
                  <div className="ml-20">
                    <div className={`${periodo.bgColor} rounded-2xl p-6 border-l-4 border-red-500`}>
                      <h4 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${periodo.gradient} bg-clip-text text-transparent font-montserrat`}>
                        {periodo.mes}
                      </h4>
                      
                      <div className="space-y-4">
                        {periodo.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`bg-gradient-to-br ${periodo.gradient} text-white font-bold text-sm w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                                {item.dia}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-lg font-bold text-[#222426] mb-2 font-montserrat">
                                  {item.titulo}
                                </h5>
                                <p className="text-gray-700 text-sm leading-relaxed font-opensans">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Próximas Actividades */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-gradient-to-br from-[#CBA135]/10 to-red-800/10 rounded-3xl p-8 border border-[#CBA135]/20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-montserrat font-bold text-[#222426] mb-4">
              Próximas <span className="text-red-800">Iniciativas</span>
            </h3>
            <p className="text-gray-600 font-opensans">
              Actividades planificadas para fortalecer nuestra misión
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Entrega de recomendaciones a autoridades nacionales",
              "Salas de monitoreo conjunto en espacios públicos",
              "Jornadas de alfabetización digital y mediática",
              "Casos emblemáticos de desinformación",
              "Lanzamiento de plataforma digital boliviana",
              "Difusión de resultados y boletines"
            ].map((actividad, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#CBA135] rounded-full flex-shrink-0"></div>
                  <p className="text-sm text-[#222426] font-opensans leading-relaxed">
                    {actividad}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </motion.section>
  );
}
