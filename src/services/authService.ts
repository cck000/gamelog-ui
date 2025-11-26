import api from './api';

// Tipagem dos dados (igual aos DTOs do Java)
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    }
};