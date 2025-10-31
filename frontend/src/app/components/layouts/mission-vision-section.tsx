import { motion } from "motion/react";
import { IconTarget, IconEye, IconUsers, IconBulb, IconShield } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Predefined positions to avoid hydration mismatch
const particlePositions = [
  { left: 15, top: 25 },
  { left: 75, top: 35 },
  { left: 40, top: 60 },
  { left: 85, top: 20 },
  { left: 25, top: 80 },
  { left: 60, top: 15 },
  { left: 35, top: 45 },
  { left: 90, top: 70 },
  { left: 10, top: 55 },
  { left: 65, top: 85 },
  { left: 45, top: 30 },
  { left: 80, top: 50 },
  { left: 20, top: 70 },
  { left: 55, top: 40 },
  { left: 70, top: 25 }
];

export default function MissionVisionSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.section
      id="mission-vision"
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Enhanced background pattern */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[#CBA135]/20 to-red-400/20 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.2 }}
          viewport={{ once: true }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-red-400/15 to-[#CBA135]/15 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
          viewport={{ once: true }}
        />
        
        {/* Floating elements - Only render after mount to avoid hydration issues */}
        {mounted && (
          <div className="absolute inset-0">
            {particlePositions.map((position, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#CBA135]/40 rounded-full"
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Main Title */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.h2 
            className="text-5xl sm:text-6xl lg:text-5xl font-montserrat font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#222426] font-montserrat">Nuestra </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent font-montserrat font-bold">
              Propuesta
            </span>
          </motion.h2>
          
          <motion.div 
            className="w-40 h-1.5 bg-gradient-to-r from-red-800 via-rose-600 to-red-800 rounded-full mx-auto shadow-lg"
            initial={{ width: 0 }}
            whileInView={{ width: 160 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />
          
          <motion.p
            className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto font-opensans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Descubre los pilares fundamentales que guían nuestro trabajo hacia una democracia más transparente
          </motion.p>
        </div>

        {/* Enhanced Content Grid - Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 text-justify gap-8 lg:gap-12 mb-20">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-red-800 to-rose-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 5 }}
              >
                <IconTarget className="h-7 w-7 text-white" />
              </motion.div>
              <h3 className="text-3xl font-montserrat font-bold text-[#222426]">
                Misión
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed font-opensans text-lg">
              Combatir la desinformación electoral mediante el trabajo colaborativo de organizaciones comprometidas con la integridad de los procesos democráticos en Bolivia.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-[#00797B] to-[#005F61] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: -5 }}
              >
                <IconEye className="h-7 w-7 text-white" />
              </motion.div>
              <h3 className="text-3xl font-montserrat font-bold text-[#222426]">
                Visión
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed font-opensans text-lg">
              Una Bolivia con elecciones transparentes, donde la información veraz fortalezca la democracia y la participación ciudadana informada sea la base de nuestro sistema electoral.
            </p>
          </motion.div>
        </div>

        {/* Enhanced Objectives Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl sm:text-5xl font-montserrat font-bold text-[#222426] mb-4">
              Nuestros{" "}
              <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent font-montserrat">
                Objetivos
              </span>
            </h3>
          </motion.div>
          
          {/* Enhanced red underline with gradient */}
          <motion.div 
            className="w-40 h-1.5 bg-gradient-to-r from-red-800 via-rose-600 to-red-800 rounded-full mx-auto mb-16 shadow-lg"
            initial={{ width: 0 }}
            whileInView={{ width: 160 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Objective 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <IconUsers className="h-7 w-7 text-white" />
                </motion.div>
                <h4 className="text-xl font-montserrat font-bold text-[#222426]">
                  Fortalecer la Colaboración
                </h4>
              </div>
              <p className="text-gray-700 text-justify font-opensans leading-relaxed">
                Establecer una coalición que reúna a instituciones públicas, sociedad civil, medios de comunicación y socios internacionales para contrarrestar la desinformación.
              </p>
            </motion.div>

            {/* Objective 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: -5 }}
                >
                  <IconBulb className="h-7 w-7 text-white" />
                </motion.div>
                <h4 className="text-xl font-montserrat font-bold text-[#222426]">
                  Desarrollo de Capacidades
                </h4>
              </div>
              <p className="text-gray-700 text-justify font-opensans leading-relaxed">
                Colaborar en iniciativas que fortalezcan la alfabetización mediática digital, aumenten la conciencia pública y aseguren la integridad de la información electoral.
              </p>
            </motion.div>

            {/* Objective 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <IconShield className="h-7 w-7 text-white" />
                </motion.div>
                <h4 className="text-xl font-montserrat font-bold text-[#222426]">
                  Integridad de la Información
                </h4>
              </div>
              <p className="text-gray-700 text-justify font-opensans leading-relaxed">
                Mitigar el impacto de la desinformación y los discursos tóxicos, especialmente hacia las mujeres y poblaciones vulnerables.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Enhanced bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <motion.div 
            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-white/10 to-gray-100/10 backdrop-blur-sm rounded-full border border-white/20 shadow-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-4 h-4 bg-[#CBA135] rounded-full shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[#222426] font-opensans font-semibold text-lg">
              Compromiso con la Democracia Boliviana
            </span>
            <motion.div 
              className="w-4 h-4 bg-red-500 rounded-full shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
