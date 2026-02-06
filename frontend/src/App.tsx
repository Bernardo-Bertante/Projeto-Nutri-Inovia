import { useState } from "react";
import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentList } from "./components/AppointmentList";
import { CalendarView } from "./components/CalendarView";

function App() {
  // Esse estado serve apenas para forçar a atualização da lista
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const handleUpdate = () => {
    // Incrementa o contador para avisar a lista que algo mudou
    setRefreshKey((prev) => prev + 1);
    setEditingAppointment(null);
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null); // Limpa se o usuário cancelar
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-6 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-blue-600">Nutri Inovia</h1>
        <p className="mt-2 text-gray-600">Sistema de Agendamento Inteligente</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Formulário */}
        <div className="w-full lg:w-[420px]">
          <AppointmentForm
            onSuccess={handleUpdate}
            appointmentToEdit={editingAppointment}
            onCancelEdit={handleCancelEdit}
            onDeleteSuccess={handleUpdate}
          />
        </div>

        {/* Calendário */}
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <CalendarView
            keyRefresh={refreshKey}
            onDeleteSuccess={handleUpdate}
            onEdit={(appointment) => {
              setEditingAppointment(appointment);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
