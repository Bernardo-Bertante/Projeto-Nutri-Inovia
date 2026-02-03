import { useState, useEffect } from "react";
import { api } from "../services/api";
import { BodyType, bodyTypeLabels } from "../types/body-type";

interface INutritionist {
  id: string;
  name: string;
}

interface Props {
  onSuccess?: () => void;
}

export function AppointmentForm({ onSuccess }: Props) {
  const [nutritionists, setNutritionists] = useState<INutritionist[]>([]);
  const [formData, setFormData] = useState({
    patientName: "",
    nutritionistId: "",
    startDate: "",
    endDate: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    bodyType: "" as BodyType | "",
    cpf: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  // Busca nutricionistas ao carregar
  useEffect(() => {
    api.get("/nutritionists").then((res) => {
      setNutritionists(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, nutritionistId: res.data[0].id }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    end.setHours(end.getHours() + 1);

    if (end <= start) {
      setStatus({
        type: "error",
        message: "O horário de término deve ser depois do início.",
      });
      return;
    }

    try {
      // Envia para o backend
      await api.post("/appointments", {
        ...formData,
        startDate: start,
        endDate: end,
      });
      setStatus({
        type: "success",
        message: "Agendamento realizado com sucesso!",
      });

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Novo Agendamento
      </h2>

      {status.message && (
        <div
          className={`p-3 rounded mb-4 text-sm ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
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

        {/* CPF do Pasciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CPF do Pasciente
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

        {/* Biotipo do Pasciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Biotipo do Pasciente
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
            Data de Nascimento
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
