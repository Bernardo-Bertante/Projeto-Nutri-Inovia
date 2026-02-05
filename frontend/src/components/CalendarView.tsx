import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Para detectar cliques
import ptBr from "@fullcalendar/core/locales/pt-br"; // Tradução para PT-BR
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { BodyType } from "../types/body-type";

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
  onEdit: (appointment: any) => void;
}

export function CalendarView({ keyRefresh, onEdit }: Props) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/appointments")
      .then((response) => {
        // O FullCalendar exige um array de objetos com chaves específicas: title, start, end
        const formattedEvents = response.data.map((app: IAppointment) => ({
          id: app.id,
          title: app.patientName, // O que aparece na barra colorida
          start: app.startDate, // Data ISO
          end: app.endDate,
          extendedProps: { ...app }, // Guardamos o objeto original aqui para usar na edição
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => console.error("Erro ao buscar eventos", err));
  }, [keyRefresh]);

  // Quando clicar num evento (na barra colorida do calendário)
  const handleEventClick = (clickInfo: any) => {
    // Recuperamos os dados originais que salvamos em 'extendedProps'
    const originalAppointment = clickInfo.event.extendedProps;

    // Precisamos garantir que os IDs estejam certos para o form de edição
    const appointmentToEdit = {
      ...originalAppointment,
      id: clickInfo.event.id,
    };

    onEdit(appointmentToEdit);
  };

  return (
    <div className="calendar-wrapper bg-white p-6 rounded-lg shadow mt-10">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={ptBr}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        eventColor="#3B82F6"
        eventTextColor="#1f2937"
      />
    </div>
  );
}
