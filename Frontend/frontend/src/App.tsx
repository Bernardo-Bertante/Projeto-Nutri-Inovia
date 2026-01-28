import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    // Fundo escuro (zinc-900), texto claro, centralizado na tela
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-zinc-700">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-400 font-semibold">
            Teste de Setup
          </div>

          <h1 className="block mt-1 text-2xl leading-tight font-bold text-white">
            React + NestJS + Docker
          </h1>

          <p className="mt-2 text-zinc-400">
            Se você está vendo este cartão estilizado, o
            <span className="text-teal-400 font-bold mx-1">Tailwind v4</span>
            está funcionando perfeitamente dentro do Docker!
          </p>

          <div className="mt-6">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer">
              Botão Teste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
