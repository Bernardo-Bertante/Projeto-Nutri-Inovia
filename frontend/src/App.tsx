import { AppointmentForm } from "./components/AppointmentForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600">Nutri Inovia</h1>
        <p className="mt-2 text-gray-600">Sistema de Agendamento Inteligente</p>
      </div>

      {/* Renderiza o formulário */}
      <AppointmentForm />
    </div>
  );
}

export default App;
