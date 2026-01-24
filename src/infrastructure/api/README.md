# 🌐 API (Cliente de API)

## 📝 Descrição

Configuração do cliente HTTP para comunicação com APIs REST. Gerencia interceptors, headers, autenticação e tratamento de erros.

## ✅ Exemplo de API Client

```typescript
// ApiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/shared/constants/api";
import {
  getAuthToken,
  refreshAuthToken,
} from "@/infrastructure/storage/TokenStorage";

/**
 * @service ApiClient
 * @description Cliente HTTP configurado para a API
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptors de request e response
   */
  private setupInterceptors(): void {
    // Request Interceptor - adiciona token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (__DEV__) {
          console.log("📤 Request:", config.method?.toUpperCase(), config.url);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response Interceptor - trata erros e refresh token
    this.client.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log("📥 Response:", response.config.url, response.status);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Se 401 e não é retry, tenta refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Redirect para login ou dispatch logout
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Métodos HTTP

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
```

## 🔧 Configuração de Ambiente

```typescript
// config/api.config.ts

const getApiUrl = (): string => {
  if (__DEV__) {
    return "http://localhost:3000/api";
  }
  return "https://api.production.com";
};

export const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};
```

## 📝 Uso

```typescript
// Em um DataSource
import { apiClient } from "@/infrastructure/api/ApiClient";

export class UserRemoteDataSource {
  async getUser(id: string): Promise<UserModel> {
    const response = await apiClient.get<UserModel>(`/users/${id}`);
    return response.data;
  }
}
```

## 🔗 Ver Também

- [DataSources](../../data/datasources/README.md)
- [Constants](../../shared/constants/README.md)
