import React from 'react';

export default function ListaUsuarios({ usuarios, carregando }) {
  if (carregando) return (
    <p className="text-center text-gray-500 py-8">Carregando usuários...</p>
  );
  if (!usuarios.length) return (
    <p className="text-center text-gray-500 py-8">Nenhum usuário cadastrado ainda.</p>
  );

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Usuários Cadastrados ({usuarios.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {usuarios.map((u) => (
          <div key={u.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-start hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
              {u.nomeCompleto.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <strong className="text-gray-800 text-base truncate">{u.nomeCompleto}</strong>
              <span className="text-xs text-gray-500 truncate">✉ {u.email}</span>
              {u.telefone && <span className="text-xs text-gray-500">📞 {u.telefone}</span>}
              {u.endereco && <span className="text-xs text-gray-500 truncate">📍 {u.endereco}</span>}
              {u.dataNascimento && (
                <span className="text-xs text-gray-500">
                  🎂 {new Date(u.dataNascimento).toLocaleDateString('pt-BR')}
                </span>
              )}
              <span className="text-xs text-gray-400 mt-1">
                Cadastrado em: {new Date(u.dataCadastro).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}