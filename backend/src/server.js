require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => { 
    res.json({ message: 'API de Gerenciamento de Usuários - ON'});
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});