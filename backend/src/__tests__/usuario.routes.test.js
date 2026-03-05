const request = require('supertest');

jest.mock('@prisma/client');
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_senha_123'),
}));

const { mockUsuario } = require('@prisma/client');
const app = require('../app');

// ─────────────────────────────────────────
// TESTES: GET /
// ─────────────────────────────────────────
describe('GET /', () => {
  test('deve retornar status 200 e mensagem de status da API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Gerenciamento de Usuários/);
  });
});

// ─────────────────────────────────────────
// TESTES: POST /api/usuarios
// ─────────────────────────────────────────
describe('POST /api/usuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('deve retornar 400 quando campos obrigatórios estão ausentes', async () => {
    const res = await request(app).post('/api/usuarios').send({ email: 'a@a.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('deve retornar 400 quando o email já está cadastrado', async () => {
    mockUsuario.findUnique.mockResolvedValue({ id: 1, email: 'j@j.com' });
    const res = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'Jamylle',
      email: 'j@j.com',
      senha: '123456',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Email já cadastrado/);
  });

  test('deve criar usuário e retornar 201 sem a senha no body', async () => {
    mockUsuario.findUnique.mockResolvedValue(null);
    mockUsuario.create.mockResolvedValue({
      id: 1,
      nomeCompleto: 'Jamylle',
      email: 'j@j.com',
      senha: 'hashed_senha_123',
      telefone: null,
      dataNascimento: null,
      endereco: null,
      dataCadastro: new Date().toISOString(),
    });

    const res = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'Jamylle',
      email: 'j@j.com',
      senha: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'j@j.com');
    expect(res.body).not.toHaveProperty('senha');
  });

  test('deve aceitar campos opcionais e retornar 201', async () => {
    mockUsuario.findUnique.mockResolvedValue(null);
    mockUsuario.create.mockResolvedValue({
      id: 3,
      nomeCompleto: 'João Silva',
      email: 'joao@email.com',
      senha: 'hashed',
      telefone: '(81) 99999-9999',
      dataNascimento: '1995-06-15T00:00:00.000Z',
      endereco: 'Rua Exemplo, 123',
      dataCadastro: new Date().toISOString(),
    });

    const res = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'João Silva',
      email: 'joao@email.com',
      senha: '123456',
      telefone: '(81) 99999-9999',
      dataNascimento: '1995-06-15',
      endereco: 'Rua Exemplo, 123',
    });

    expect(res.status).toBe(201);
    expect(res.body.telefone).toBe('(81) 99999-9999');
    expect(res.body.endereco).toBe('Rua Exemplo, 123');
  });

  test('deve retornar 500 em caso de erro interno', async () => {
    mockUsuario.findUnique.mockRejectedValue(new Error('DB error'));
    const res = await request(app).post('/api/usuarios').send({
      nomeCompleto: 'Jamylle',
      email: 'j@j.com',
      senha: '123456',
    });
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────
// TESTES: GET /api/usuarios
// ─────────────────────────────────────────
describe('GET /api/usuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('deve retornar 200 e array de usuários', async () => {
    mockUsuario.findMany.mockResolvedValue([
      { id: 1, nomeCompleto: 'Jamylle', email: 'j@j.com', telefone: null, dataNascimento: null, endereco: null, dataCadastro: new Date().toISOString() },
    ]);
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('nomeCompleto', 'Jamylle');
  });

  test('deve retornar 200 e array vazio quando não há usuários', async () => {
    mockUsuario.findMany.mockResolvedValue([]);
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('deve retornar 500 em caso de erro interno', async () => {
    mockUsuario.findMany.mockRejectedValue(new Error('DB error'));
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────
// TESTES: Rotas inexistentes
// ─────────────────────────────────────────
describe('Rotas inexistentes', () => {
  test('GET /rota-invalida deve retornar 404', async () => {
    const res = await request(app).get('/rota-invalida');
    expect(res.status).toBe(404);
  });

  test('DELETE /api/usuarios deve retornar 404', async () => {
    const res = await request(app).delete('/api/usuarios');
    expect(res.status).toBe(404);
  });
});
