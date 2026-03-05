jest.mock('@prisma/client');
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_senha_123'),
  compare: jest.fn().mockResolvedValue(true),
}));

const { mockUsuario } = require('@prisma/client');
const { criarUsuario, listarUsuarios } = require('../controllers/usuario.controller');

// Helpers para criar req/res mockados
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (body = {}) => ({ body });

// ─────────────────────────────────────────
// TESTES: criarUsuario
// ─────────────────────────────────────────
describe('criarUsuario', () => {
  beforeEach(() => jest.clearAllMocks());

  test('deve retornar 400 se nomeCompleto estiver ausente', async () => {
    const req = mockReq({ email: 'a@a.com', senha: '123456' });
    const res = mockRes();
    await criarUsuario(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('obrigatórios') })
    );
  });

  test('deve retornar 400 se email estiver ausente', async () => {
    const req = mockReq({ nomeCompleto: 'Jamylle', senha: '123456' });
    const res = mockRes();
    await criarUsuario(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('deve retornar 400 se senha estiver ausente', async () => {
    const req = mockReq({ nomeCompleto: 'Jamylle', email: 'j@j.com' });
    const res = mockRes();
    await criarUsuario(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('deve retornar 400 se o email já estiver cadastrado', async () => {
    mockUsuario.findUnique.mockResolvedValue({ id: 1, email: 'j@j.com' });
    const req = mockReq({ nomeCompleto: 'Jamylle', email: 'j@j.com', senha: '123456' });
    const res = mockRes();
    await criarUsuario(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Email já cadastrado') })
    );
  });

  test('deve criar usuário com sucesso e retornar 201 sem a senha', async () => {
    mockUsuario.findUnique.mockResolvedValue(null);
    mockUsuario.create.mockResolvedValue({
      id: 1,
      nomeCompleto: 'Jamylle',
      email: 'j@j.com',
      senha: 'hashed_senha_123',
      telefone: null,
      dataNascimento: null,
      endereco: null,
      dataCadastro: new Date(),
    });

    const req = mockReq({ nomeCompleto: 'Jamylle', email: 'j@j.com', senha: '123456' });
    const res = mockRes();
    await criarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg).not.toHaveProperty('senha');
    expect(jsonArg).toHaveProperty('email', 'j@j.com');
  });

  test('deve criar usuário com campos opcionais preenchidos', async () => {
    mockUsuario.findUnique.mockResolvedValue(null);
    mockUsuario.create.mockResolvedValue({
      id: 2,
      nomeCompleto: 'João Silva',
      email: 'joao@email.com',
      senha: 'hashed',
      telefone: '(81) 99999-9999',
      dataNascimento: new Date('1995-06-15'),
      endereco: 'Rua Exemplo, 123',
      dataCadastro: new Date(),
    });

    const req = mockReq({
      nomeCompleto: 'João Silva',
      email: 'joao@email.com',
      senha: '123456',
      telefone: '(81) 99999-9999',
      dataNascimento: '1995-06-15',
      endereco: 'Rua Exemplo, 123',
    });
    const res = mockRes();
    await criarUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg).toHaveProperty('telefone', '(81) 99999-9999');
    expect(jsonArg).toHaveProperty('endereco', 'Rua Exemplo, 123');
    expect(jsonArg).not.toHaveProperty('senha');
  });

  test('deve retornar 500 se o Prisma lançar um erro', async () => {
    mockUsuario.findUnique.mockRejectedValue(new Error('DB error'));
    const req = mockReq({ nomeCompleto: 'Jamylle', email: 'j@j.com', senha: '123456' });
    const res = mockRes();
    await criarUsuario(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────
// TESTES: listarUsuarios
// ─────────────────────────────────────────
describe('listarUsuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('deve retornar lista de usuários com status 200', async () => {
    const usuariosMock = [
      { id: 1, nomeCompleto: 'Jamylle', email: 'j@j.com', telefone: null, dataNascimento: null, endereco: null, dataCadastro: new Date() },
      { id: 2, nomeCompleto: 'João', email: 'joao@email.com', telefone: '(81) 99999-9999', dataNascimento: null, endereco: null, dataCadastro: new Date() },
    ];
    mockUsuario.findMany.mockResolvedValue(usuariosMock);

    const req = mockReq();
    const res = mockRes();
    await listarUsuarios(req, res);

    expect(res.json).toHaveBeenCalledWith(usuariosMock);
    expect(mockUsuario.findMany).toHaveBeenCalledTimes(1);
  });

  test('deve retornar lista vazia quando não há usuários', async () => {
    mockUsuario.findMany.mockResolvedValue([]);
    const req = mockReq();
    const res = mockRes();
    await listarUsuarios(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('deve retornar 500 se o Prisma lançar um erro', async () => {
    mockUsuario.findMany.mockRejectedValue(new Error('DB error'));
    const req = mockReq();
    const res = mockRes();
    await listarUsuarios(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Erro no servidor' }));
  });
});
