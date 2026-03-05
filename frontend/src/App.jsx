import React, { useState, useEffect, useCallback } from 'react';
import FormularioCadastro from './components/FormularioCadastro';
import ListaUsuarios from './components/ListaUsuarios';
import { listarUsuarios } from './services/api';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState('cadastro');

  const buscarUsuarios = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await listarUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);

  const handleUsuarioCriado = () => {
    buscarUsuarios();
    setAba('lista');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-8 text-center shadow-md">
        <h1 className="text-3xl font-bold">👤 Gerenciamento de Usuários</h1>
        <p className="mt-1 text-indigo-200 text-sm">Cadastro e visualização de usuários</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-2 mb-6">
          <button
            className={`px-5 py-2 rounded-lg border-2 border-indigo-600 font-semibold text-sm transition-colors ${
              aba === 'cadastro'
                ? 'bg-indigo-600 text-white'
                : 'bg-transparent text-indigo-600 hover:bg-indigo-50'
            }`}
            onClick={() => setAba('cadastro')}
          >
            Cadastrar
          </button>
          <button
            className={`px-5 py-2 rounded-lg border-2 border-indigo-600 font-semibold text-sm transition-colors ${
              aba === 'lista'
                ? 'bg-indigo-600 text-white'
                : 'bg-transparent text-indigo-600 hover:bg-indigo-50'
            }`}
            onClick={() => setAba('lista')}
          >
            Usuários ({usuarios.length})
          </button>
        </div>

        {aba === 'cadastro' && (
          <FormularioCadastro onUsuarioCriado={handleUsuarioCriado} />
        )}
        {aba === 'lista' && (
          <ListaUsuarios usuarios={usuarios} carregando={carregando} />
        )}
      </main>
    </div>
  );
}