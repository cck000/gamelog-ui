import axios from 'axios';
import Cookies from 'js-cookie';


const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: baseURL, // Endereço do seu Spring Boot
});

// INTERCEPTOR DE REQUISIÇÃO
// Antes de qualquer requisição sair do frontend, este código roda.
api.interceptors.request.use((config) => {
  // Tenta pegar o token salvo nos cookies
  const token = Cookies.get('gamelog_token');

  // Se tiver token, adiciona no cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;