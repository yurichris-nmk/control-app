# 📡 DataSources (Fontes de Dados)

## 📝 Descrição

**DataSources** são responsáveis por acessar dados de fontes específicas: API remota, armazenamento local, cache, etc. Eles são a camada mais próxima dos dados brutos.

## 🎯 O que é um DataSource?

Um DataSource:

- Acessa uma fonte de dados específica (API, Storage, etc)
- Retorna dados brutos (Models/DTOs)
- Não contém lógica de negócio
- É usado pelos Repositories
- Trata erros de I/O

## 📁 Estrutura

```
datasources/
├── remote/              # APIs remotas
│   ├── UserRemoteDataSource.ts
│   ├── ProductRemoteDataSource.ts
│   └── OrderRemoteDataSource.ts
├── local/               # Armazenamento local
│   ├── UserLocalDataSource.ts
│   ├── ProductLocalDataSource.ts
│   └── CacheManager.ts
└── index.ts
```

## 🔧 Tipos de DataSources

### 1. Remote DataSource

Acessa APIs REST/GraphQL

### 2. Local DataSource

Acessa armazenamento local (AsyncStorage, SQLite, etc)

### 3. Cache DataSource

Gerencia cache em memória

## ✅ Anatomia de um DataSource

### Remote DataSource (API)

```typescript
// UserRemoteDataSource.ts
import { UserModel } from "@/data/models/UserModel";
import { ApiClient } from "@/infrastructure/api/ApiClient";

/**
 * @datasource UserRemoteDataSource
 * @description Acessa dados de usuários da API remota
 */
export class UserRemoteDataSource {
  constructor(private api: ApiClient) {}

  /**
   * Busca um usuário por ID
   */
  async getUser(id: string): Promise<UserModel | null> {
    try {
      const response = await this.api.get<UserModel>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw this.handleError(error, "Failed to fetch user");
    }
  }

  /**
   * Busca usuário por email
   */
  async getUserByEmail(email: string): Promise<UserModel | null> {
    try {
      const response = await this.api.get<UserModel[]>("/users", {
        params: { email },
      });
      return response.data[0] || null;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch user by email");
    }
  }

  /**
   * Lista todos os usuários
   */
  async getUsers(): Promise<UserModel[]> {
    try {
      const response = await this.api.get<UserModel[]>("/users");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch users");
    }
  }

  /**
   * Cria um novo usuário
   */
  async createUser(user: Omit<UserModel, "id">): Promise<UserModel> {
    try {
      const response = await this.api.post<UserModel>("/users", user);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create user");
    }
  }

  /**
   * Atualiza um usuário
   */
  async updateUser(id: string, user: Partial<UserModel>): Promise<UserModel> {
    try {
      const response = await this.api.patch<UserModel>(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update user");
    }
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await this.api.delete(`/users/${id}`);
    } catch (error) {
      throw this.handleError(error, "Failed to delete user");
    }
  }

  // Helpers privados

  private isNotFoundError(error: any): boolean {
    return error?.response?.status === 404;
  }

  private handleError(error: any, message: string): Error {
    console.error(message, error);

    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    return new Error(message);
  }
}
```

### Local DataSource (Storage)

```typescript
// UserLocalDataSource.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserModel } from "@/data/models/UserModel";

/**
 * @datasource UserLocalDataSource
 * @description Gerencia cache local de usuários
 */
export class UserLocalDataSource {
  private readonly STORAGE_KEY = "@users";
  private readonly USER_KEY = (id: string) => `${this.STORAGE_KEY}:${id}`;

  /**
   * Busca usuário do cache
   */
  async getUser(id: string): Promise<UserModel | null> {
    try {
      const data = await AsyncStorage.getItem(this.USER_KEY(id));
      if (!data) return null;

      return JSON.parse(data) as UserModel;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }

  /**
   * Salva usuário no cache
   */
  async saveUser(user: UserModel): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY(user.id), JSON.stringify(user));
    } catch (error) {
      console.error("Error saving to cache:", error);
      throw new Error("Failed to save to cache");
    }
  }

  /**
   * Deleta usuário do cache
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_KEY(id));
    } catch (error) {
      console.error("Error deleting from cache:", error);
    }
  }

  /**
   * Lista todos os usuários do cache
   */
  async getAllUsers(): Promise<UserModel[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter((key) => key.startsWith(this.STORAGE_KEY));

      const items = await AsyncStorage.multiGet(userKeys);

      return items
        .map(([, value]) => (value ? JSON.parse(value) : null))
        .filter(Boolean) as UserModel[];
    } catch (error) {
      console.error("Error reading all from cache:", error);
      return [];
    }
  }

  /**
   * Limpa todo o cache de usuários
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter((key) => key.startsWith(this.STORAGE_KEY));
      await AsyncStorage.multiRemove(userKeys);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }
}
```

### DataSource com Cache Expiração

```typescript
// ProductLocalDataSource.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductModel } from "@/data/models/ProductModel";

interface CachedData<T> {
  data: T;
  cachedAt: number;
}

/**
 * @datasource ProductLocalDataSource
 * @description Cache local de produtos com expiração
 */
export class ProductLocalDataSource {
  private readonly STORAGE_KEY = "@products";
  private readonly PRODUCT_KEY = (id: string) => `${this.STORAGE_KEY}:${id}`;
  private readonly ALL_PRODUCTS_KEY = `${this.STORAGE_KEY}:all`;

  /**
   * Busca produto do cache com timestamp
   */
  async getProduct(id: string): Promise<CachedData<ProductModel> | null> {
    try {
      const data = await AsyncStorage.getItem(this.PRODUCT_KEY(id));
      if (!data) return null;

      return JSON.parse(data) as CachedData<ProductModel>;
    } catch (error) {
      console.error("Error reading product from cache:", error);
      return null;
    }
  }

  /**
   * Salva produto no cache com timestamp
   */
  async saveProduct(
    id: string,
    cached: CachedData<ProductModel>,
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PRODUCT_KEY(id), JSON.stringify(cached));
    } catch (error) {
      console.error("Error saving product to cache:", error);
    }
  }

  /**
   * Busca todos os produtos do cache
   */
  async getAllProducts(): Promise<CachedData<ProductModel>[]> {
    try {
      const data = await AsyncStorage.getItem(this.ALL_PRODUCTS_KEY);
      if (!data) return [];

      return JSON.parse(data) as CachedData<ProductModel>[];
    } catch (error) {
      console.error("Error reading products from cache:", error);
      return [];
    }
  }

  /**
   * Salva lista de produtos no cache
   */
  async saveProducts(products: ProductModel[]): Promise<void> {
    try {
      const cached: CachedData<ProductModel>[] = products.map((p) => ({
        data: p,
        cachedAt: Date.now(),
      }));

      await AsyncStorage.setItem(this.ALL_PRODUCTS_KEY, JSON.stringify(cached));
    } catch (error) {
      console.error("Error saving products to cache:", error);
    }
  }

  /**
   * Deleta produto do cache
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.PRODUCT_KEY(id));
    } catch (error) {
      console.error("Error deleting product from cache:", error);
    }
  }

  /**
   * Limpa cache de produtos
   */
  async clearProducts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ALL_PRODUCTS_KEY);

      const keys = await AsyncStorage.getAllKeys();
      const productKeys = keys.filter((key) =>
        key.startsWith(this.STORAGE_KEY),
      );
      await AsyncStorage.multiRemove(productKeys);
    } catch (error) {
      console.error("Error clearing products cache:", error);
    }
  }
}
```

### DataSource com Paginação

```typescript
// OrderRemoteDataSource.ts
import { OrderModel } from "@/data/models/OrderModel";
import { ApiClient } from "@/infrastructure/api/ApiClient";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * @datasource OrderRemoteDataSource
 * @description Acessa dados de pedidos da API com paginação
 */
export class OrderRemoteDataSource {
  constructor(private api: ApiClient) {}

  async getOrder(id: string): Promise<OrderModel | null> {
    try {
      const response = await this.api.get<OrderModel>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw error;
    }
  }

  async getOrdersByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<OrderModel>> {
    try {
      const response = await this.api.get<PaginatedResponse<OrderModel>>(
        `/users/${userId}/orders`,
        { params },
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user orders");
    }
  }

  async getOrdersByStatus(status: string): Promise<OrderModel[]> {
    try {
      const response = await this.api.get<OrderModel[]>("/orders", {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch orders by status");
    }
  }

  async createOrder(order: Omit<OrderModel, "id">): Promise<OrderModel> {
    try {
      const response = await this.api.post<OrderModel>("/orders", order);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create order");
    }
  }

  async updateOrder(
    id: string,
    order: Partial<OrderModel>,
  ): Promise<OrderModel> {
    try {
      const response = await this.api.patch<OrderModel>(`/orders/${id}`, order);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update order");
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await this.api.delete(`/orders/${id}`);
    } catch (error) {
      throw new Error("Failed to delete order");
    }
  }

  private isNotFoundError(error: any): boolean {
    return error?.response?.status === 404;
  }
}
```

## ✅ Boas Práticas

### DO ✅

- Mantenha DataSources focados em I/O
- Retorne Models (DTOs), não Entities
- Trate erros de rede/storage apropriadamente
- Use tipos específicos para requests/responses
- Implemente retry logic quando apropriado
- Log erros para debugging
- Use constantes para keys de storage

### DON'T ❌

- Não implemente lógica de negócio
- Não converta para Entities (deixe para Repository)
- Não gerencie múltiplas fontes (deixe para Repository)
- Não ignore erros silenciosamente
- Não faça validações de negócio

## 🧪 Testes

```typescript
// UserRemoteDataSource.test.ts
describe("UserRemoteDataSource", () => {
  let dataSource: UserRemoteDataSource;
  let apiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    apiClient = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as any;

    dataSource = new UserRemoteDataSource(apiClient);
  });

  describe("getUser", () => {
    it("should return user model", async () => {
      const mockUser: UserModel = {
        id: "1",
        name: "João",
        email: "joao@test.com",
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      apiClient.get.mockResolvedValue({ data: mockUser });

      const result = await dataSource.getUser("1");

      expect(result).toEqual(mockUser);
      expect(apiClient.get).toHaveBeenCalledWith("/users/1");
    });

    it("should return null for 404", async () => {
      apiClient.get.mockRejectedValue({
        response: { status: 404 },
      });

      const result = await dataSource.getUser("999");

      expect(result).toBeNull();
    });

    it("should throw error for other errors", async () => {
      apiClient.get.mockRejectedValue(new Error("Network error"));

      await expect(dataSource.getUser("1")).rejects.toThrow();
    });
  });
});
```

## 📝 Template de Documentação

```typescript
/**
 * @datasource DataSourceName
 * @description Acessa [fonte de dados]
 *
 * @responsibilities
 * - Fazer chamadas HTTP/Storage
 * - Retornar dados brutos (Models)
 * - Tratar erros de I/O
 *
 * @dependencies
 * - ApiClient / AsyncStorage / etc
 */
```

## 🔗 Ver Também

- [Repositories](../repositories/README.md)
- [Models](../models/README.md)
- [API Client](../../infrastructure/api/README.md)
- [Storage](../../infrastructure/storage/README.md)
