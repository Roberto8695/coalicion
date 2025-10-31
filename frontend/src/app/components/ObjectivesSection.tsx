import { motion } from "motion/react";
import { IconUsers, IconBulb, IconShield } from "@tabler/icons-react";

export default function ObjectivesSection() {
  const objectives = [
    {
      icon: IconUsers,
      title: "Fortalecer la Colaboración",
      description: "Establecer una coalición que reúna a instituciones públicas, sociedad civil, medios de comunicación y socios internacionales para contrarrestar la desinformación.",
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: IconBulb,
      title: "Desarrollo de Capacidades",
      description: "Colaborar en iniciativas que fortalezcan la alfabetización mediática digital, aumenten la conciencia pública y aseguren la integridad de la información electoral.",
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      icon: IconShield,
      title: "Integridad de la Información",
      description: "Mitigar el impacto de la desinformación y los discursos tóxicos, especialmente hacia las mujeres y poblaciones vulnerables.",
      gradient: "from-purple-600 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <motion.section
      id="objectives"
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-slate-50 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background decorations */}
      <div className="absolute top-10 sm:top-20 right-4 sm:right-10 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-4 sm:left-10 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-regular   mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-[#222426]">Objetivos de la </span>
            <span className="bg-gradient-to-r bg-clip-text text-[#CBA135]">
              Coalición
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl  text-[#222426] max-w-4xl mx-auto leading-relaxed mb-3 sm:mb-4 font-opensans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            En el Marco de la Iniciativa Global contra la Desinformación Electoral
          </motion.p>
          
          <motion.div 
            className="w-24 sm:w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </div>

        {/* Main Objectives Grid */}
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {objectives.map((objective, idx) => (
            <motion.div
              key={objective.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${objective.bgGradient} ${objective.borderColor} border rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full blur-2xl transform translate-x-6 sm:translate-x-8 -translate-y-6 sm:-translate-y-8"></div>
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`${objective.iconBg} w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <objective.icon size={24} className={`sm:hidden bg-gradient-to-r ${objective.gradient} bg-clip-text text-transparent`} />
                    <objective.icon size={32} className={`hidden sm:block bg-gradient-to-r ${objective.gradient} bg-clip-text text-transparent`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-red-800 transition-colors duration-300">
                    {objective.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-700  leading-relaxed text-sm sm:text-base">
                    {objective.description}
                  </p>
                  
                  {/* Decorative line */}
                  <div className={`mt-4 sm:mt-6 h-1 w-10 sm:w-12 bg-gradient-to-r ${objective.gradient} rounded-full group-hover:w-16 sm:group-hover:w-20 transition-all duration-500`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
