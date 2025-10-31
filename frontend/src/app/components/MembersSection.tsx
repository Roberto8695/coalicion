import { motion } from "motion/react";

export default function MembersSection() {
  return (
    <motion.section
      id="members"
      className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-slate-50/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-regular mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#222426]">Nuestros </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Miembros
            </span>
          </motion.h2>
          
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />
          
          <motion.p 
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-opensans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="font-semibold text-[#222426]">17 organizaciones comprometidas</span> con la integridad electoral boliviana, 
            unidas en la lucha contra la desinformación y el fortalecimiento democrático.
          </motion.p>
        </div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Left Section - Ejes Estratégicos */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-8">
              <h3 className="text-2xl lg:text-3xl font-montserrat font-bold text-[#222426] mb-8">
                Ejes Estratégicos
              </h3>
              
              <div className="space-y-6">
                <div className="relative pl-8 py-4 border-l-4 border-[#CBA135] bg-gradient-to-r from-amber-50/50 to-transparent">
                  <div className="absolute -left-3 top-6 w-6 h-6 bg-[#CBA135] rounded-full"></div>
                  <h4 className="text-lg font-montserrat font-semibold text-[#222426] mb-2">
                    Democracia y Tecnología
                  </h4>
                  <p className="text-gray-600 font-opensans text-sm leading-relaxed">
                    Desarrollo de herramientas tecnológicas para fortalecer los procesos democráticos
                  </p>
                </div>
                
                <div className="relative pl-8 py-4 border-l-4 border-red-800 bg-gradient-to-r from-red-50/50 to-transparent">
                  <div className="absolute -left-3 top-6 w-6 h-6 bg-red-800 rounded-full"></div>
                  <h4 className="text-lg font-montserrat font-semibold text-[#222426] mb-2">
                    Contra la Desinformación
                  </h4>
                  <p className="text-gray-600 font-opensans text-sm leading-relaxed">
                    Verificación de información y educación ciudadana para combatir noticias falsas
                  </p>
                </div>
              </div>
              
              {/* Statistics */}
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-montserrat font-bold text-[#00797B]">17</div>
                    <div className="text-sm text-gray-600 font-opensans">Miembros Activos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-montserrat font-bold text-[#CBA135]">4</div>
                    <div className="text-sm text-gray-600 font-opensans">En Proceso</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Lista de Organizaciones */}
          <div className="lg:col-span-2">
            <motion.div 
              className="grid gap-8"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Instituciones Oficiales */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-montserrat font-bold text-[#222426]">Instituciones Oficiales</h4>
                    <p className="text-gray-600 font-opensans text-sm">Órganos del Estado</p>
                  </div>
                </div>
                <div className="pl-16">
                  <p className="text-gray-700 font-opensans">Tribunal Supremo Electoral - Órgano Electoral Plurinacional (TSE-OEP)</p>
                </div>
              </div>

              {/* Medios y Verificadores */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-montserrat font-bold text-[#222426]">Medios y Verificadores</h4>
                    <p className="text-gray-600 font-opensans text-sm">Comunicación y fact-checking</p>
                  </div>
                </div>
                <div className="pl-16 grid md:grid-cols-2 gap-3">
                  <p className="text-gray-700 font-opensans">• Bolivia Verifica</p>
                  <p className="text-gray-700 font-opensans">• ChequeaBolivia</p>
                  <p className="text-gray-700 font-opensans">• DW Akademie</p>
                  <p className="text-gray-700 font-opensans">• Guardiana</p>
                </div>
              </div>

              {/* Organizaciones Sociales */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-montserrat font-bold text-[#222426]">Organizaciones Sociales</h4>
                    <p className="text-gray-600 font-opensans text-sm">Sociedad civil y feminismo</p>
                  </div>
                </div>
                <div className="pl-16 grid md:grid-cols-2 gap-3">
                  <p className="text-gray-700 font-opensans">• Ciberwarmi</p>
                  <p className="text-gray-700 font-opensans">• Coordinadora de la Mujer</p>
                </div>
              </div>

              {/* Fundaciones Tecnológicas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-montserrat font-bold text-[#222426]">Fundaciones Tecnológicas</h4>
                    <p className="text-gray-600 font-opensans text-sm">Innovación y desarrollo</p>
                  </div>
                </div>
                <div className="pl-16 grid md:grid-cols-2 gap-3">
                  <p className="text-gray-700 font-opensans">• Fundación Internet Bolivia</p>
                  <p className="text-gray-700 font-opensans">• Fundación Aru</p>
                  <p className="text-gray-700 font-opensans">• Fundación Muy Waso</p>
                  <p className="text-gray-700 font-opensans">• Fundación Construir</p>
                </div>
              </div>

              {/* Instituciones Académicas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-montserrat font-bold text-[#222426]">Instituciones Académicas</h4>
                    <p className="text-gray-600 font-opensans text-sm">Investigación y educación</p>
                  </div>
                </div>
                <div className="pl-16 space-y-2">
                  <p className="text-gray-700 font-opensans">• Instituto de Investigación y Posgrado en Comunicación - UMSA (IPICOM-UMSA)</p>
                  <p className="text-gray-700 font-opensans">• Asociación Boliviana de Investigadores de la Comunicación (ABOIC)</p>
                </div>
              </div>

              {/* Organismos Internacionales */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00797B] to-[#005F61] rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-montserrat font-bold text-[#222426]">Organismos Internacionales</h4>
                    <p className="text-gray-600 font-opensans text-sm">Cooperación global</p>
                  </div>
                </div>
                <div className="pl-16 grid md:grid-cols-2 gap-3">
                  <p className="text-gray-700 font-opensans">• ONU Mujeres</p>
                  <p className="text-gray-700 font-opensans">• PNUD</p>
                  <p className="text-gray-700 font-opensans">• Friedrich Ebert Stiftung (FES)</p>
                  <p className="text-gray-700 font-opensans">• Asociación Nacional de la Prensa de Bolivia (ANPB)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 lg:mt-20"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-full border border-gray-200">
            <div className="w-3 h-3 bg-[#CBA135] rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-opensans font-medium">
              Coalición en crecimiento - 4 nuevas organizaciones en proceso de adhesión
            </span>
            <div className="w-3 h-3 bg-red-800 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
