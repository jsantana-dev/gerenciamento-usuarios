// Mock manual do @prisma/client (fica em backend/__mocks__ ao lado do node_modules)
const mockUsuario = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
};

const PrismaClient = jest.fn(() => ({
  usuario: mockUsuario,
}));

module.exports = { PrismaClient, mockUsuario };
