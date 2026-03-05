import React from 'react';
import { render, screen } from '@testing-library/react';
import ListaUsuarios from '../components/ListaUsuarios';

const usuariosMock = [
  {
    id: 1,
    nomeCompleto: 'Jamylle da Silva Santana',
    email: 'jamylle@email.com',
    telefone: '(81) 99999-9999',
    dataNascimento: '1995-06-15T00:00:00.000Z',
    endereco: 'Rua Exemplo, 123 - Recife, PE',
    dataCadastro: '2026-03-04T12:00:00.000Z',
  },
  {
    id: 2,
    nomeCompleto: 'João Silva',
    email: 'joao@email.com',
    telefone: null,
    dataNascimento: null,
    endereco: null,
    dataCadastro: '2026-03-04T13:00:00.000Z',
  },
];

describe('ListaUsuarios', () => {
  test('exibe mensagem de carregando quando carregando=true', () => {
    render(<ListaUsuarios usuarios={[]} carregando={true} />);
    expect(screen.getByText(/Carregando usuários/i)).toBeInTheDocument();
  });

  test('exibe mensagem quando não há usuários', () => {
    render(<ListaUsuarios usuarios={[]} carregando={false} />);
    expect(screen.getByText(/Nenhum usuário cadastrado/i)).toBeInTheDocument();
  });

  test('renderiza a lista de usuários corretamente', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    expect(screen.getByText('Jamylle da Silva Santana')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  test('exibe o email de cada usuário', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    expect(screen.getByText(/jamylle@email.com/i)).toBeInTheDocument();
    expect(screen.getByText(/joao@email.com/i)).toBeInTheDocument();
  });

  test('exibe o telefone quando disponível', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    expect(screen.getByText(/\(81\) 99999-9999/)).toBeInTheDocument();
  });

  test('exibe o endereço quando disponível', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    expect(screen.getByText(/Rua Exemplo, 123/i)).toBeInTheDocument();
  });

  test('exibe a data de cadastro formatada', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    expect(screen.getAllByText(/Cadastrado em:/i).length).toBe(2);
  });

  test('exibe a data de nascimento quando disponível', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    // A data é formatada em pt-BR (pode variar por fuso do ambiente)
    const dataNasc = new Date('1995-06-15T00:00:00.000Z').toLocaleDateString('pt-BR');
    expect(screen.getByText(new RegExp(dataNasc.replace(/\//g, '\\/')))).toBeInTheDocument();
  });

  test('exibe o avatar com a inicial do nome', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    // Ambos os usuários têm nomes começando com J
    expect(screen.getAllByText('J').length).toBeGreaterThanOrEqual(1);
  });

  test('exibe o título com a contagem de usuários', () => {
    render(<ListaUsuarios usuarios={usuariosMock} carregando={false} />);
    expect(screen.getByText(/Usuários Cadastrados \(2\)/i)).toBeInTheDocument();
  });

  test('não exibe campos opcionais ausentes', () => {
    render(<ListaUsuarios usuarios={[usuariosMock[1]]} carregando={false} />);
    // João não tem telefone nem endereço - não devem aparecer ícones
    expect(screen.queryByText(/📞/)).not.toBeInTheDocument();
    expect(screen.queryByText(/📍/)).not.toBeInTheDocument();
  });
});
