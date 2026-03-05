import React, { useState } from 'react';
import { criarUsuario } from '../services/api';

const campoInicial = {
  nomeCompleto: '',
  email: '',
  senha: '',
  telefone: '',
  dataNascimento: '',
  endereco: '',
};

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition';

const labelClass = 'block text-xs font-semibold text-gray-500 mb-1';

export default function FormularioCadastro({ onUsuarioCriado }) {
  const [form, setForm] = useState(campoInicial);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      await criarUsuario(form);
      setSucesso('Usuário cadastrado com sucesso!');
      setForm(campoInicial);
      if (onUsuarioCriado) onUsuarioCriado();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar usuário.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Usuário</h2>

      {erro && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
          {sucesso}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nome Completo *</label>
          <input
            className={inputClass}
            name="nomeCompleto"
            value={form.nomeCompleto}
            onChange={handleChange}
            placeholder="João da Silva"
            required
          />
        </div>

        <div>
          <label className={labelClass}>E-mail *</label>
          <input
            className={inputClass}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="joao@email.com"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Senha *</label>
          <input
            className={inputClass}
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Telefone</label>
            <input
              className={inputClass}
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(81) 99999-9999"
            />
          </div>
          <div>
            <label className={labelClass}>Data de Nascimento</label>
            <input
              className={inputClass}
              name="dataNascimento"
              type="date"
              value={form.dataNascimento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Endereço</label>
          <input
            className={inputClass}
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Rua Exemplo, 123 - Recife, PE"
          />
        </div>

        <button
          className="mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer"
          type="submit"
          disabled={carregando}
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}