import { useState } from "react";
import { AppointmentForm } from "./components/AppointmentForm";
//import { AppointmentList } from "./components/AppointmentList";
import { CalendarView } from "./components/CalendarView";
import { Login } from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

function MainApp() {
  const { signed, signOut, user, loading } = useAuth();
  // Esse estado serve apenas para forçar a atualização da lista
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!signed) {
    return <Login />;
  }

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
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-10 border-b pb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-600">
            Nutri Inovia
          </h1>
          <p className="text-gray-600">Olá, {user?.name}</p>
        </div>
        <button
          onClick={signOut}
          title="Logout"
          className="px-4 py-2 text-sm text-gray-500 border border-red-200 rounded hover:bg-red-50 transition"
        >
          <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
        </button>
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
            onSuccess={handleUpdate}
            keyRefresh={refreshKey}
            onDeleteSuccess={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
