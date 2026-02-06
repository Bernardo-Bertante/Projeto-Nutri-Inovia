import { useState, useEffect } from "react";
import { api } from "../services/api";
import { BodyType, bodyTypeLabels } from "../types/body-type";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface INutritionist {
  id: string;
  name: string;
}

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
  onSuccess?: () => void;
  appointmentToEdit: IAppointment | null;
  onCancelEdit?: () => void;
  onDeleteSuccess: () => void;
}

export function AppointmentForm({
  onSuccess,
  appointmentToEdit,
  onCancelEdit,
  onDeleteSuccess,
}: Props) {
  const [nutritionists, setNutritionists] = useState<INutritionist[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [formData, setFormData] = useState({
    patientName: "",
    nutritionistId: "",
    startDate: "",
    endDate: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    bodyType: "",
    cpf: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  // Helper somente para o Date
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.slice(0, 10); // YYYY-MM-DD
  };

  const localEndDateTimeToUTC = (localDateTime: string) => {
    const date = new Date(localDateTime);
    date.setHours(date.getHours() + 1);
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
  };

  const localStartDateTimeToUTC = (localDateTime: string) => {
    const date = new Date(localDateTime);
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
  };

  const utcToLocalInput = (iso: string) => {
    if (!iso) return "";
    return iso.slice(0, 16);
  };

  // Busca nutricionistas ao carregar
  useEffect(() => {
    api.get("/nutritionists").then((res) => {
      setNutritionists(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, nutritionistId: res.data[0].id }));
      }
    });
  }, []);

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        patientName: appointmentToEdit.patientName,
        // Tenta pegar o ID do objeto ou a string direta
        nutritionistId:
          typeof appointmentToEdit.nutritionistId === "object"
            ? appointmentToEdit.nutritionistId.id
            : appointmentToEdit.nutritionistId,
        startDate: utcToLocalInput(appointmentToEdit.startDate),
        endDate: utcToLocalInput(appointmentToEdit.endDate),
        email: appointmentToEdit.email,
        phoneNumber: appointmentToEdit.phoneNumber,
        birthDate: formatDateForInput(appointmentToEdit.birthDate),
        bodyType: appointmentToEdit.bodyType,
        cpf: appointmentToEdit.cpf,
      });
    } else {
      // cancelou edição, limpa tudo
      resetForm();
    }
  }, [appointmentToEdit]);

  const resetForm = () => {
    setFormData({
      patientName: "",
      nutritionistId: nutritionists[0]?.id || "",
      startDate: "",
      endDate: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      bodyType: "",
      cpf: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      // Envia para o backend
      if (appointmentToEdit) {
        // --- (PUT) ---
        const id = appointmentToEdit.id;
        await api.patch(`/appointments/${id}`, {
          ...formData,
          startDate: localStartDateTimeToUTC(formData.startDate),
          endDate: localEndDateTimeToUTC(formData.startDate),
          birthDate: formData.birthDate,
        });
        setStatus({ type: "success", message: "Agendamento atualizado!" });
      } else {
        // --- (POST) ---
        await api.post("/appointments", {
          ...formData,
          startDate: localStartDateTimeToUTC(formData.startDate),
          endDate: localEndDateTimeToUTC(formData.startDate),
          birthDate: formatDateForInput(formData.birthDate),
        });
        setStatus({ type: "success", message: "Agendamento criado!" });
      }
      resetForm();

      if (onSuccess) {
        onSuccess();
      }

      // Limpa formulário, menos o Nuticonista
      setFormData((prev) => ({
        ...prev,
        patientName: "",
        startDate: "",
        endDate: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        bodyType: "",
        cpf: "",
      }));
    } catch (error: any) {
      // mensagem de erro que o backend manda
      const errorMsg =
        error.response?.data?.message || "Erro ao realizar agendamento.";
      setStatus({
        type: "error",
        message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      });
    }
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

  const handleCancel = () => {
    setStatus({ type: "", message: "" }); // limpa mensagem
    onCancelEdit?.(); // avisa o pai
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-6 border-t-4 border-blue-600">
      <div className="flex gap-5 items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {appointmentToEdit ? "Editar Agendamento" : "Novo Agendamento"}
        </h2>

        {appointmentToEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => handleDelete(appointmentToEdit.id)}
              title="Cancelar Agendamento"
              className="text-gray-400 hover:text-red-500 transition"
            >
              <TrashIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleCancel}
              title="Cancelar Alterações"
              className="text-gray-400 hover:text-gray-700 transition"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {status.message && (
        <div
          className={`inline-block px-3 py-1 rounded mb-4 mt-3 text-sm text-center
      ${
        status.type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nutricionista */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nutricionista
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            value={formData.nutritionistId}
            onChange={(e) =>
              setFormData({ ...formData, nutritionistId: e.target.value })
            }
          >
            {nutritionists.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nome do Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Paciente
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm 
             focus:border-blue-500 focus:ring-blue-500 
             text-black"
            value={formData.patientName}
            onChange={(e) =>
              setFormData({ ...formData, patientName: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm 
             focus:border-blue-500 focus:ring-blue-500 
             text-black"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Telefone do Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone do Paciente
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm 
             focus:border-blue-500 focus:ring-blue-500 
             text-black"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>

        {/* CPF do Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CPF do Paciente
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm 
             focus:border-blue-500 focus:ring-blue-500 
             text-black"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          />
        </div>

        {/* Biotipo do Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Biotipo do Paciente
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            value={formData.bodyType}
            onChange={(e) =>
              setFormData({ ...formData, bodyType: e.target.value as BodyType })
            }
          >
            <option value="" disabled>
              selecione o biotipo
            </option>

            {Object.values(BodyType).map((type) => (
              <option key={type} value={type}>
                {bodyTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data de Nascimento do Paciente
          </label>
          <input
            type="date"
            required
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm
    ${formData.birthDate ? "text-black" : "text-gray-400"}
  `}
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />
        </div>

        {/* Datas (Inicio, logo Fim) */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data e Hora do agendamento
          </label>
          <input
            type="datetime-local"
            required
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm
    ${formData.startDate ? "text-black" : "text-gray-400"}
  `}
            value={formData.startDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                startDate: e.target.value,
                endDate: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}
