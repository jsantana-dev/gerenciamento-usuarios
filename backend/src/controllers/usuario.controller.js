const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const criarUsuario = async (req, res) => {
    try {
        const { nomeCompleto, email, senha, telefone, dataNascimento, endereco} = req.body;
        if (!nomeCompleto || !email || !senha) {
            return res.status(400).json({ error: 'Nome completo, email e senha são obrigatórios.' });
        }

        const emailExistente = await prisma.usuario.findUnique({ where: { email } });
        if (emailExistente) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        
        const novoUsuario = await prisma.usuario.create({
            data: {
                nomeCompleto,
                email,
                senha: senhaHash,
                telefone: telefone || null,
                dataNascimento:dataNascimento ? new Date(dataNascimento) : null,
                endereco: endereco || null,
            },
        });

        const { senha: _, ...usuarioSemSenha } = novoUsuario;
        return res.status(201).json(usuarioSemSenha);
    } catch (error) {

        console.error(error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nomeCompleto: true,
                email: true,
                telefone: true,
                dataNascimento: true,
                endereco: true,
                dataCadastro: true,
            },
            orderBy: { dataCadastro: 'desc' },
        });
        return res.json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
};

module.exports = { criarUsuario, listarUsuarios };