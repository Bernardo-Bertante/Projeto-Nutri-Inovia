import { useState } from "react";
import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentList } from "./components/AppointmentList";

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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600">Nutri Inovia</h1>
        <p className="mt-2 text-gray-600">Sistema de Agendamento Inteligente</p>
      </div>

      {/* O Formulário recebe o objeto de edição */}
      <AppointmentForm
        onSuccess={handleUpdate}
        appointmentToEdit={editingAppointment}
        onCancelEdit={handleCancelEdit}
      />

      {/* A Lista avisa quando clicar no lápis */}
      <AppointmentList
        keyRefresh={refreshKey}
        onDeleteSuccess={handleUpdate}
        onEdit={(appointment) => {
          setEditingAppointment(appointment);
          // Opcional: Rolar a página para o topo para ver o formulário
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}

export default App;
