import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api, { criarUsuario, listarUsuarios } from '../services/api';

const mock = new MockAdapter(api);

describe('Serviço de API', () => {
  afterEach(() => mock.reset());

  // ─── listarUsuarios ───────────────────────────────────────────
  describe('listarUsuarios', () => {
    test('faz GET /usuarios e retorna a lista', async () => {
      const data = [{ id: 1, nomeCompleto: 'Jamylle', email: 'j@j.com' }];
      mock.onGet('/usuarios').reply(200, data);

      const res = await listarUsuarios();
      expect(res.data).toEqual(data);
    });

    test('retorna array vazio quando não há usuários', async () => {
      mock.onGet('/usuarios').reply(200, []);
      const res = await listarUsuarios();
      expect(res.data).toEqual([]);
    });

    test('lança erro quando a API retorna 500', async () => {
      mock.onGet('/usuarios').reply(500);
      await expect(listarUsuarios()).rejects.toThrow();
    });
  });

  // ─── criarUsuario ─────────────────────────────────────────────
  describe('criarUsuario', () => {
    test('faz POST /usuarios com os dados corretos', async () => {
      const payload = { nomeCompleto: 'Jamylle', email: 'j@j.com', senha: '123456' };
      const response = { id: 1, nomeCompleto: 'Jamylle', email: 'j@j.com' };
      mock.onPost('/usuarios').reply(201, response);

      const res = await criarUsuario(payload);
      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({ id: 1, email: 'j@j.com' });
    });

    test('envia o body correto na requisição', async () => {
      const payload = { nomeCompleto: 'Jamylle', email: 'j@j.com', senha: '123456' };
      mock.onPost('/usuarios', payload).reply(201, { id: 1 });

      const res = await criarUsuario(payload);
      expect(res.status).toBe(201);
    });

    test('lança erro 400 quando email já cadastrado', async () => {
      mock.onPost('/usuarios').reply(400, { error: 'Email já cadastrado.' });
      await expect(criarUsuario({ nomeCompleto: 'X', email: 'x@x.com', senha: '123' })).rejects.toMatchObject({
        response: { status: 400 },
      });
    });

    test('lança erro 500 em erro interno do servidor', async () => {
      mock.onPost('/usuarios').reply(500, { error: 'Erro no servidor' });
      await expect(criarUsuario({})).rejects.toMatchObject({
        response: { status: 500 },
      });
    });
  });

  // ─── Configuração da instância axios ─────────────────────────
  describe('Instância do axios', () => {
    test('usa a baseURL padrão correta', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:3001/api');
    });
  });
});
