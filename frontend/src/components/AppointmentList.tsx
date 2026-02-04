import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { BodyType } from "../types/body-type";

interface IAppointment {
  id: string;
  patientName: string;
  startDate: string; // Datas são convertidas pela função auxiliar
  endDate: string;
  nutritionistId: {
    id: string;
    name: string;
    crn: string;
  };
  phoneNumber: string;
  birthDate: string;
  bodyType: BodyType;
  cpf: string;
}

interface Props {
  keyRefresh: number; // "gatilho" que avisa quando atualizar
  onDeleteSuccess: () => void;
}

export function AppointmentList({ keyRefresh, onDeleteSuccess }: Props) {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    api
      .get("/appointments")
      .then((response) => setAppointments(response.data))
      .catch((err) => console.error("Erro ao buscar agendamentos", err));
  }, [keyRefresh]);

  // Função auxiliar para formatar data bonitinha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      await api.delete(`/appointments/${id}`);
      onDeleteSuccess(); // Avisa o pai para recarregar a lista
    } catch (error) {
      alert("Erro ao cancelar agendamento");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
        Agendamentos Confirmados ({appointments.length})
      </h3>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">
          Nenhum agendamento encontrado.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md transition relative"
            >
              {/* Botão de Excluir */}
              <button
                onClick={() => handleDelete(app.id)}
                title="Cancelar Agendamento"
                className="
    absolute top-1 right-1
    p-1
    bg-transparent
    border-0
    appearance-none
    shadow-none
    text-gray-400
    hover:text-red-500
    focus:outline-none
    focus:ring-0
    focus-visible:outline-none
    transition
  "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={0.8}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    {app.patientName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    📅 {formatDate(app.startDate)} até{" "}
                    {formatDate(app.endDate).split(" ")[1]}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <p>
                  Nutricionista: {app.nutritionistId?.name || " Não informado"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
