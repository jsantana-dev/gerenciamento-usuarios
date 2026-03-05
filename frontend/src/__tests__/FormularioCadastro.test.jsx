import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioCadastro from '../components/FormularioCadastro';
import * as api from '../services/api';

jest.mock('../services/api');

describe('FormularioCadastro', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renderiza o formulário com todos os campos', () => {
    render(<FormularioCadastro />);
    expect(screen.getByPlaceholderText(/João da Silva/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/joao@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\(81\) 99999-9999/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Rua Exemplo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  test('campo de data de nascimento está presente', () => {
    render(<FormularioCadastro />);
    const inputData = document.querySelector('input[name="dataNascimento"]');
    expect(inputData).toBeInTheDocument();
    expect(inputData).toHaveAttribute('type', 'date');
  });

  test('atualiza os campos ao digitar', async () => {
    render(<FormularioCadastro />);
    const inputNome = screen.getByPlaceholderText(/João da Silva/i);
    await userEvent.type(inputNome, 'Jamylle');
    expect(inputNome).toHaveValue('Jamylle');
  });

  test('exibe mensagem de sucesso após cadastro bem-sucedido', async () => {
    api.criarUsuario.mockResolvedValueOnce({ data: { id: 1 } });
    render(<FormularioCadastro />);

    await userEvent.type(screen.getByPlaceholderText(/João da Silva/i), 'Jamylle');
    await userEvent.type(screen.getByPlaceholderText(/joao@email.com/i), 'j@j.com');
    await userEvent.type(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), '123456');
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Usuário cadastrado com sucesso/i)).toBeInTheDocument();
    });
  });

  test('limpa o formulário após cadastro bem-sucedido', async () => {
    api.criarUsuario.mockResolvedValueOnce({ data: { id: 1 } });
    render(<FormularioCadastro />);

    const inputNome = screen.getByPlaceholderText(/João da Silva/i);
    await userEvent.type(inputNome, 'Jamylle');
    await userEvent.type(screen.getByPlaceholderText(/joao@email.com/i), 'j@j.com');
    await userEvent.type(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), '123456');
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(inputNome).toHaveValue('');
    });
  });

  test('chama onUsuarioCriado após cadastro bem-sucedido', async () => {
    api.criarUsuario.mockResolvedValueOnce({ data: { id: 1 } });
    const onUsuarioCriado = jest.fn();
    render(<FormularioCadastro onUsuarioCriado={onUsuarioCriado} />);

    await userEvent.type(screen.getByPlaceholderText(/João da Silva/i), 'Jamylle');
    await userEvent.type(screen.getByPlaceholderText(/joao@email.com/i), 'j@j.com');
    await userEvent.type(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), '123456');
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => expect(onUsuarioCriado).toHaveBeenCalledTimes(1));
  });

  test('exibe mensagem de erro quando a API retorna erro', async () => {
    api.criarUsuario.mockRejectedValueOnce({
      response: { data: { error: 'Email já cadastrado.' } },
    });
    render(<FormularioCadastro />);

    await userEvent.type(screen.getByPlaceholderText(/João da Silva/i), 'Jamylle');
    await userEvent.type(screen.getByPlaceholderText(/joao@email.com/i), 'j@j.com');
    await userEvent.type(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), '123456');
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email já cadastrado/i)).toBeInTheDocument();
    });
  });

  test('exibe erro genérico quando a API falha sem mensagem', async () => {
    api.criarUsuario.mockRejectedValueOnce(new Error('Network Error'));
    render(<FormularioCadastro />);

    await userEvent.type(screen.getByPlaceholderText(/João da Silva/i), 'Jamylle');
    await userEvent.type(screen.getByPlaceholderText(/joao@email.com/i), 'j@j.com');
    await userEvent.type(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), '123456');
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erro ao cadastrar usuário/i)).toBeInTheDocument();
    });
  });

  test('desabilita o botão durante o envio', async () => {
    api.criarUsuario.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<FormularioCadastro />);

    await userEvent.type(screen.getByPlaceholderText(/João da Silva/i), 'Jamylle');
    await userEvent.type(screen.getByPlaceholderText(/joao@email.com/i), 'j@j.com');
    await userEvent.type(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), '123456');
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cadastrando/i })).toBeDisabled();
    });
  });
});
