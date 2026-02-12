import { useState, useEffect } from "react";
import { api } from "../services/api";
import { BodyType, bodyTypeLabels } from "../types/body-type";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  mode?: "view" | "edit";
  setMode?: (mode: "view" | "edit") => void;
}

export function AppointmentForm({
  onSuccess,
  appointmentToEdit,
  onCancelEdit,
  mode,
  setMode,
}: Props) {
  const [nutritionists, setNutritionists] = useState<INutritionist[]>([]);
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(7); // Padrão semanal
  const [recurrenceCount, setRecurrenceCount] = useState(4); // Padrão 4 sessões
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
    setIsRecurrent(false);
    setRecurrenceInterval(7);
    setRecurrenceCount(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (appointmentToEdit && mode === "view") {
      onSuccess?.();
      return;
    }

    const payload = {
      ...formData,
      isRecurrent,
      recurrenceInterval: Number(recurrenceInterval),
      recurrenceCount: Number(recurrenceCount),
    };

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
        setMode?.("view");
        setTimeout(() => {
          setStatus({ type: "", message: "" });
        }, 5000);
        return;
      } else {
        // --- (POST) ---
        await api.post("/appointments", {
          ...payload,
          startDate: localStartDateTimeToUTC(payload.startDate),
          endDate: localEndDateTimeToUTC(payload.startDate),
          birthDate: formatDateForInput(payload.birthDate),
        });
        setStatus({
          type: "success",
          message: isRecurrent
            ? "Agendamentos criados!"
            : "Agendamento criado!",
        });
      }
      resetForm();

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (error: any) {
      // mensagem de erro que o backend manda
      const errorMsg =
        error.response?.data?.message || "Erro ao realizar agendamento.";
      setStatus({
        type: "error",
        message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      });
      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 12000);
    }
  };

  const handleCancel = () => {
    setStatus({ type: "", message: "" });
    onCancelEdit?.(); // avisa o pai
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-6 border-t-4 border-blue-600">
      <div className="flex justify-between gap-5 items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === "view"
            ? "Agendamento"
            : appointmentToEdit
              ? "Editar Agendamento"
              : "Novo Agendamento"}
        </h2>

        {appointmentToEdit && (
          <div className="flex gap-2">
            {mode === "view" && (
              <button
                onClick={() => setMode?.("edit")}
                title="Editar Agendamento"
                className="text-gray-400 hover:text-blue-500 transition"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handleCancel}
              title="Fechar"
              className="text-gray-400 hover:text-gray-700 transition"
            >
              <XMarkIcon className="w-5 h-5" />
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
            disabled={mode === "view"}
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
            readOnly={mode === "view"}
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
            readOnly={mode === "view"}
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
            maxLength={14}
            inputMode="numeric"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm 
  focus:border-blue-500 focus:ring-blue-500 text-black"
            readOnly={mode === "view"}
            value={formData.phoneNumber}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");

              if (!value.startsWith("55")) {
                value = "55" + value;
              }

              setFormData({
                ...formData,
                phoneNumber: "+" + value.slice(0, 13),
              });
            }}
          />
        </div>

        {/* CPF do Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CPF do Paciente
          </label>
          <input
            type="text"
            maxLength={11}
            inputMode="numeric"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm 
  focus:border-blue-500 focus:ring-blue-500 text-black"
            readOnly={mode === "view"}
            value={formData.cpf}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setFormData({
                ...formData,
                cpf: onlyNumbers.slice(0, 11),
              });
            }}
          />
        </div>

        {/* Biotipo do Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Biotipo do Paciente
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            disabled={mode === "view"}
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
            max="2026-12-31"
            min="1900-01-01"
            required
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm
    ${formData.birthDate ? "text-black" : "text-gray-400"}
  `}
            readOnly={mode === "view"}
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
            max="2099-12-31T23:59"
            min="2026-01-01T00:00"
            required
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm
    ${formData.startDate ? "text-black" : "text-gray-400"}
  `}
            readOnly={mode === "view"}
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

        {!appointmentToEdit && (
          <div className="bg-blue-100 p-3 rounded-md border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="recurrence"
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="recurrence"
                className="text-sm font-bold text-blue-800 cursor-pointer"
              >
                Repetir este agendamento?
              </label>
            </div>

            {isRecurrent && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-blue-700">
                    A cada (dias)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recurrenceInterval}
                    onChange={(e) =>
                      setRecurrenceInterval(Number(e.target.value))
                    }
                    className="mt-1 block w-full rounded border-gray-600 p-1 text-sm, text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-700">
                    Quantidade de vezes
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="24"
                    value={recurrenceCount}
                    onChange={(e) => setRecurrenceCount(Number(e.target.value))}
                    className="mt-1 block w-full rounded border-gray-600 p-1 text-sm text-black"
                  />
                </div>
              </div>
            )}
          </div>
        )}

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
