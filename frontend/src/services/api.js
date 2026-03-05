import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

export const criarUsuario = (dados) => api.post('/usuarios', dados);
export const listarUsuarios = () => api.get('/usuarios');

export default api;