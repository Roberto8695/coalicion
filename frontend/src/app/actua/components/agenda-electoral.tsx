"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  IconCalendar, 
  IconClock, 
  IconMapPin, 
  IconUsers, 
  IconChevronLeft, 
  IconChevronRight,
  IconBook,
  IconMicrophone,
  IconSchool,
  IconX
} from "@tabler/icons-react";

// Tipos de eventos
type EventType = 'taller' | 'capacitacion' | 'foro' | 'debate';

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time: string;
  location: string;
  description: string;
  duration: string;
  capacity?: number;
  registrationUrl?: string;
}

// Datos de ejemplo para los eventos
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Taller de Verificación de Hechos',
    type: 'taller',
    date: new Date(2025, 8, 15), // 15 de septiembre 2025
    time: '10:00',
    location: 'Centro de Capacitación La Paz',
    description: 'Aprende técnicas básicas para verificar información y detectar noticias falsas.',
    duration: '3 horas',
    capacity: 30,
    registrationUrl: '#'
  },
  {
    id: '2',
    title: 'Capacitación en Fact-Checking Electoral',
    type: 'capacitacion',
    date: new Date(2025, 8, 18), // 18 de septiembre 2025
    time: '14:30',
    location: 'Universidad Mayor de San Andrés',
    description: 'Formación especializada en verificación de contenido electoral y político.',
    duration: '4 horas',
    capacity: 50,
    registrationUrl: '#'
  },
  {
    id: '3',
    title: 'Foro: Desinformación y Democracia',
    type: 'foro',
    date: new Date(2025, 8, 22), // 22 de septiembre 2025
    time: '19:00',
    location: 'Auditorio CERES',
    description: 'Discusión abierta sobre el impacto de la desinformación en los procesos democráticos.',
    duration: '2 horas',
    capacity: 100,
    registrationUrl: '#'
  },
  {
    id: '4',
    title: 'Debate: Medios y Transparencia Electoral',
    type: 'debate',
    date: new Date(2025, 8, 25), // 25 de septiembre 2025
    time: '16:00',
    location: 'Canal Universitario',
    description: 'Debate entre expertos sobre el rol de los medios en la transparencia electoral.',
    duration: '90 minutos',
    registrationUrl: '#'
  },
  {
    id: '5',
    title: 'Taller de Herramientas Digitales',
    type: 'taller',
    date: new Date(2025, 9, 2), // 2 de octubre 2025
    time: '09:00',
    location: 'Online - Zoom',
    description: 'Conoce las mejores herramientas digitales para la verificación de información.',
    duration: '2.5 horas',
    capacity: 40,
    registrationUrl: '#'
  },
  {
    id: '6',
    title: 'Capacitación para Periodistas',
    type: 'capacitacion',
    date: new Date(2025, 9, 8), // 8 de octubre 2025
    time: '10:30',
    location: 'Colegio de Periodistas',
    description: 'Formación especializada para profesionales del periodismo en verificación electoral.',
    duration: '6 horas',
    capacity: 25,
    registrationUrl: '#'
  }
];

// Configuración de tipos de eventos
const eventTypeConfig = {
  taller: {
    icon: IconSchool,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    label: 'Taller'
  },
  capacitacion: {
    icon: IconBook,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    label: 'Capacitación'
  },
  foro: {
    icon: IconUsers,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    label: 'Foro'
  },
  debate: {
    icon: IconMicrophone,
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    label: 'Debate'
  }
};

export function AgendaElectoralSection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  // Funciones para navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Obtener eventos próximos (siguientes 30 días)
  const getUpcomingEvents = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return sampleEvents
      .filter(event => event.date >= today && event.date <= thirtyDaysFromNow)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Generar días del mes para el calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = sampleEvents.filter(event => 
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      );
      days.push({ date, events: dayEvents });
    }
    
    return days;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <motion.section
      id="agenda-electoral"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#CBA135]/10 to-red-400/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-red-400/10 to-[#CBA135]/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-gray-900">Agenda</span>{" "}
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Electoral
            </span>
          </motion.h1>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-opensans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Participa en nuestros talleres, capacitaciones, foros y debates sobre transparencia electoral y verificación de hechos.
          </motion.p>
        </div>

        {/* View Mode Toggle */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-2 rounded-md font-medium font-montserrat transition-all duration-200 ${
                viewMode === 'month'
                  ? 'bg-[#CBA135] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vista Mensual
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-md font-medium font-montserrat transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-[#CBA135] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista de Eventos
            </button>
          </div>
        </motion.div>

        {/* Calendar View */}
        {viewMode === 'month' && (
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <IconChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <h2 className="text-2xl lg:text-3xl font-montserrat font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <IconChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-3 text-center">
                  <span className="text-sm font-medium text-gray-500 font-montserrat">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-100 ${
                    day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                  } transition-colors duration-200`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((event) => {
                          const config = eventTypeConfig[event.type];
                          return (
                            <button
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={`w-full text-left p-1 rounded text-xs ${config.lightColor} ${config.borderColor} border hover:shadow-sm transition-all duration-200`}
                            >
                              <div className={`font-medium ${config.textColor} truncate`}>
                                {event.title}
                              </div>
                              <div className="text-gray-500 truncate">
                                {event.time}
                              </div>
                            </button>
                          );
                        })}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{day.events.length - 2} más
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-montserrat font-bold text-gray-900 text-center mb-8">
              Próximos Eventos
            </h2>
            
            {getUpcomingEvents().map((event, index) => {
              const config = eventTypeConfig[event.type];
              const IconComponent = config.icon;
              
              return (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${config.color} p-3 rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.lightColor} ${config.textColor}`}>
                            {config.label}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="bg-[#CBA135] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-medium font-montserrat transition-colors duration-200"
                        >
                          Ver Detalles
                        </button>
                      </div>
                      
                      <p className="text-gray-600 font-opensans mb-4">
                        {event.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <IconCalendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 font-opensans">
                            {event.date.toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <IconClock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 font-opensans">
                            {event.time} ({event.duration})
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <IconMapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 font-opensans">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${eventTypeConfig[selectedEvent.type].lightColor} ${eventTypeConfig[selectedEvent.type].textColor}`}>
                    {eventTypeConfig[selectedEvent.type].label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <IconX className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 font-opensans text-lg mb-8">
                {selectedEvent.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <IconCalendar className="h-5 w-5 text-[#CBA135]" />
                    <div>
                      <div className="font-medium text-gray-900 font-montserrat">Fecha</div>
                      <div className="text-gray-600 font-opensans">
                        {selectedEvent.date.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <IconClock className="h-5 w-5 text-[#CBA135]" />
                    <div>
                      <div className="font-medium text-gray-900 font-montserrat">Horario</div>
                      <div className="text-gray-600 font-opensans">
                        {selectedEvent.time} ({selectedEvent.duration})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <IconMapPin className="h-5 w-5 text-[#CBA135]" />
                    <div>
                      <div className="font-medium text-gray-900 font-montserrat">Ubicación</div>
                      <div className="text-gray-600 font-opensans">
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>

                  {selectedEvent.capacity && (
                    <div className="flex items-center space-x-3">
                      <IconUsers className="h-5 w-5 text-[#CBA135]" />
                      <div>
                        <div className="font-medium text-gray-900 font-montserrat">Capacidad</div>
                        <div className="text-gray-600 font-opensans">
                          {selectedEvent.capacity} participantes
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    // Aquí puedes implementar la lógica de registro
                    window.open(selectedEvent.registrationUrl || '#', '_blank');
                  }}
                  className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] hover:from-[#B8941F] hover:to-[#A67E0E] text-white font-semibold font-montserrat px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Registrarse al Evento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Additional background pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#CBA135] rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-[#CBA135] rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.section>
  );
}
