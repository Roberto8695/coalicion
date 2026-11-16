"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  IconCalendar, 
  IconClock, 
  IconMapPin, 
  IconUsers, 
  IconX
} from "@tabler/icons-react";
import { Evento } from "@/api/services";
import { RecursosCarousel, RecursosPagination } from "./RecursosPagination";

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
  },
  {
    id: '7',
    title: 'Segunda Vuelta Elecciones Presidenciales',
    type: 'capacitacion',
    date: new Date(2025, 9, 19), // 8 de octubre 2025
    time: '08:00',
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
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    label: 'Taller'
  },
  capacitacion: {
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    label: 'Capacitación'
  },
  foro: {
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    label: 'Foro'
  },
  debate: {
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    label: 'Debate'
  }
};

export function AgendaElectoralSection() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);
  const itemsPerPage = 10;

  // Cargar eventos desde API local al montar
  useEffect(() => {
    let mounted = true;
    async function fetchEvents() {
      try {
        const { eventosService } = await import('@/api');
        const response = await eventosService.getAll({ limit: 15 });
        const data = response.data;
        if (!mounted) return;

        // Mapear la respuesta de la API al tipo CalendarEvent
        // Usar el tipo Evento importado desde services
        
        // Función para mapear tipos de evento
        const mapEventType = (apiType: string): EventType => {
          switch (apiType) {
            case 'taller':
              return 'taller';
            case 'capacitacion':
              return 'capacitacion';
            case 'foro':
              return 'foro';
            case 'debate':
              return 'debate';
            default:
              return 'taller';
          }
        };
        
        const mapped: CalendarEvent[] = data.map((ev: Evento) => ({
          id: ev.id?.toString() || String(Math.random()),
          title: ev.title || 'Evento sin título',
          type: mapEventType(ev.type),
          date: ev.date ? new Date(ev.date) : new Date(),
          time: ev.time || '', 
          location: ev.location || '',
          description: ev.description || '',
          duration: ev.duration || '',
          capacity: ev.capacity || undefined,
          registrationUrl: ev.registrationUrl || ''
        }));

        // Reemplaza eventos sólo si hay datos desde la API
        if (mapped.length > 0) {
          setEvents(mapped);
          setCurrentPage(1);
        }
      } catch (error) {
        // Si falla, mantenemos los sampleEvents y mostramos en consola
        console.error('Error cargando eventos desde la API:', error);
      }
    }

    fetchEvents();
    return () => { mounted = false; };
  }, []);

  const getEventsForList = () => {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const sortedEvents = getEventsForList();
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const visibleEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setPageDirection(nextPage > currentPage ? 1 : -1);
    setCurrentPage(nextPage);
  };

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

        {/* Event List */}
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-center text-2xl font-montserrat font-bold text-gray-900">
              Eventos
            </h2>

            <RecursosCarousel page={currentPage} direction={pageDirection}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {visibleEvents.map((event) => {
                  const config = eventTypeConfig[event.type];

                  return (
                    <motion.div
                      key={event.id}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(34,36,38,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CBA135]/40 hover:shadow-[0_16px_34px_rgba(34,36,38,0.12)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#CBA135] to-[#B8941F]" />

                      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${config.lightColor} ${config.textColor}`}>
                          {config.label}
                        </span>
                        <span className="text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                          {event.date.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-1 flex-col">
                        <h3 className="mb-3 text-xl font-montserrat font-semibold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-[#B8941F]">
                          {event.title}
                        </h3>

                        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 font-opensans">
                          {event.description}
                        </p>

                        <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                          <div className="flex items-start gap-2">
                            <IconCalendar className="mt-0.5 h-4 w-4 shrink-0 text-[#B8941F]" />
                            <span className="text-gray-600 font-opensans">
                              {event.date.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <IconClock className="h-4 w-4 shrink-0 text-[#B8941F]" />
                            <span className="text-gray-600 font-opensans">
                              {event.time} ({event.duration})
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B8941F]" />
                            <span className="text-gray-600 font-opensans">
                              {event.location}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#CBA135] to-[#B8941F] px-4 py-2.5 font-medium font-montserrat text-white shadow-sm transition-all duration-300 hover:from-[#B8941F] hover:to-[#A67E0E] hover:shadow-md"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </RecursosCarousel>
            <RecursosPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </motion.div>

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
