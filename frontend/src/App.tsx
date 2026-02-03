import { useState } from "react";
import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentList } from "./components/AppointmentList";

function App() {
  // Esse estado serve apenas para forçar a atualização da lista
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    // Incrementa o contador para avisar a lista que algo mudou
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600">Nutri Inovia</h1>
        <p className="mt-2 text-gray-600">Sistema de Agendamento Inteligente</p>
      </div>

      {/* Passamos a função de sucesso para o formulário */}
      <AppointmentForm onSuccess={handleUpdate} />

      {/* Passamos o estado para a lista saber quando atualizar */}
      <AppointmentList keyRefresh={refreshKey} onDeleteSuccess={handleUpdate} />
    </div>
  );
}

export default App;
