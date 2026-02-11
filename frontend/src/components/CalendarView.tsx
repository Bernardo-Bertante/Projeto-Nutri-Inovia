import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Para detectar cliques
import ptBr from "@fullcalendar/core/locales/pt-br"; // Tradução para PT-BR
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { BodyType } from "../types/body-type";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { AppointmentForm } from "./AppointmentForm";

interface IAppointment {
  id: string;
  patientName: string;
  startDate: string; // Datas são convertidas pela função auxiliar
  endDate: string;
  email: string;
  nutritionistId: {
    id: string;
    name: string;
    crn: string;
  };
  phoneNumber: string;
  birthDate: string;
  bodyType: BodyType | "";
  cpf: string;
}

interface Props {
  keyRefresh: number;
  onSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onCancelEdit?: () => void;
}

export function CalendarView({
  keyRefresh,
  onSuccess,
  onDeleteSuccess,
}: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayAppointments, setDayAppointments] = useState<any[]>([]); // Lista filtrada do dia
  const [open, setOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");

  const handleUpdate = () => {
    setEditingAppointment(null);
  };

  //Ação ao clicar no dia (quadrado branco)
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    filterEventsForDate(arg.dateStr, events);

    // rola a tela suavemente para a lista abaixo
    setTimeout(() => {
      document
        .getElementById("daily-list")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEventClick = (clickInfo: any) => {
    const dateStr = clickInfo.event.start?.toISOString().split("T")[0];

    if (!dateStr) return;

    setSelectedDate(dateStr);
    filterEventsForDate(dateStr, events);

    setTimeout(() => {
      document
        .getElementById("daily-list")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      // avisa o pai para recarregar os dados (disparar keyRefresh)
      if (onDeleteSuccess) onDeleteSuccess();
      else alert("Deletado! Atualize a página.");
    } catch (error) {
      alert("Erro ao cancelar agendamento");
    }
  };

  useEffect(() => {
    api
      .get(`/appointments/my`)
      .then((response) => {
        const formattedEvents = response.data.map((app: IAppointment) => ({
          id: app.id,
          title: app.patientName,
          start: app.startDate,
          end: app.endDate,
          extendedProps: { ...app }, // Guardamos o objeto original aqui para usar na edição
        }));
        setEvents(formattedEvents);
        if (selectedDate) {
          filterEventsForDate(selectedDate, formattedEvents);
        }
      })
      .catch((err) => console.error("Erro ao buscar eventos", err));
  }, [keyRefresh]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const filterEventsForDate = (dateStr: string, eventsList: any[]) => {
    const filtered = eventsList.filter((event) => {
      const eventDate = event.start.split("T")[0];
      return eventDate === dateStr;
    });
    setDayAppointments(filtered);
  };

  const formatTime = (iso: string) => {
    if (!iso) return "";

    const [datePart, timePart] = iso.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    return `${hour}:${minute}`;
  };

  return (
    <div className="space-y-8">
      {/* CARD DO CALENDÁRIO */}
      <div className="bg-white p-6 rounded-lg shadow mt-10">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBr}
          timeZone="UTC"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          eventColor="#3B82F6"
        />
      </div>

      {/* lista de detalhes do dia (Aparece quando clica) */}
      {selectedDate && (
        <div
          id="daily-list"
          className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6"
        >
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>📅</span>
            Consultas do dia{" "}
            {new Date(selectedDate).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </h3>

          {dayAppointments.length === 0 ? (
            <p className="text-gray-500 italic">
              Nenhuma consulta agendada para este dia.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayAppointments.map((evt) => {
                // Recuperamos os dados
                const app = evt.extendedProps;

                return (
                  <div
                    key={evt.id}
                    className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md transition relative"
                  >
                    {/* Botões de Ação */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleDelete(evt.id)}
                        title="Cancelar Agendamento"
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setMode("view");
                          setOpen(true);
                          setEditingAppointment({ ...app, id: evt.id });
                        }}
                        title="Visualizar Consulta"
                        className="text-gray-400 hover:text-gray-700 transition"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pr-10">
                      <h4 className="font-bold text-lg text-gray-800">
                        {app.patientName}
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        🕒 {formatTime(app.startDate)} -{" "}
                        {formatTime(app.endDate)}
                      </p>
                      <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded inline-block">
                        Nutricionista:{" "}
                        <span className="font-semibold">
                          {app.nutritionistId?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {open && editingAppointment && (
        <div className="overlay">
          <div className="modal">
            <h2 className="text-xl font-bold mb-4">Visualizar Consulta</h2>

            <AppointmentForm
              appointmentToEdit={editingAppointment}
              mode={mode}
              setMode={setMode}
              onSuccess={() => {
                handleUpdate();
                onSuccess?.();
                setOpen(false);
              }}
              onDeleteSuccess={() => {
                handleUpdate();
                onSuccess?.();
                setOpen(false);
              }}
              onCancelEdit={() => {
                setEditingAppointment(null);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
