import { useState } from "react";
import { AppointmentForm } from "./components/AppointmentForm";
import { CalendarView } from "./components/CalendarView";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function MainApp() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    setEditingAppointment(null);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 px-6 py-6">
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-10 border-b pb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-600">
            Nutri Inovia
          </h1>
          <p className="text-gray-600">Olá, {user?.name}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-500 border border-red-200 rounded hover:bg-red-50 transition"
        >
          <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="w-full lg:w-[420px]">
          <AppointmentForm
            onSuccess={handleUpdate}
            appointmentToEdit={editingAppointment}
            onCancelEdit={() => setEditingAppointment(null)}
            onDeleteSuccess={handleUpdate}
          />
        </div>

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
