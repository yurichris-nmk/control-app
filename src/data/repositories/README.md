# 🔄 Repositories (Implementações)

## 📝 Descrição

Este diretório contém as **implementações concretas** das interfaces de repositórios definidas no Domain. Aqui é onde a "mágica" do acesso aos dados acontece.

## 🎯 O que é uma Repository Implementation?

Uma implementação de repositório:

- Implementa uma interface do Domain
- Coordena DataSources (Remote, Local)
- Converte Models (DTOs) em Entities
- Gerencia cache e sincronização
- Trata erros de acesso a dados

## 📁 Estrutura

```
repositories/
├── UserRepositoryImpl.ts
├── ProductRepositoryImpl.ts
├── OrderRepositoryImpl.ts
└── index.ts                 # Exports
```

## ✅ Anatomia de um Repository Implementation

### Repository Básico

```typescript
// UserRepositoryImpl.ts
import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserRemoteDataSource } from "@/data/datasources/UserRemoteDataSource";
import { UserLocalDataSource } from "@/data/datasources/UserLocalDataSource";
import { UserModel } from "@/data/models/UserModel";

/**
 * @repository UserRepositoryImpl
 * @description Implementação do repositório de usuários
 * @implements {UserRepository}
 */
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private remoteDataSource: UserRemoteDataSource,
    private localDataSource: UserLocalDataSource,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      // 1. Tenta buscar do cache local
      const cachedData = await this.localDataSource.getUser(id);
      if (cachedData) {
        return this.modelToEntity(cachedData);
      }

      // 2. Se não tem cache, busca da API
      const remoteData = await this.remoteDataSource.getUser(id);
      if (!remoteData) {
        return null;
      }

      // 3. Salva no cache
      await this.localDataSource.saveUser(remoteData);

      // 4. Converte Model para Entity
      return this.modelToEntity(remoteData);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Falha ao buscar usuário");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const remoteData = await this.remoteDataSource.getUserByEmail(email);
      if (!remoteData) {
        return null;
      }
      return this.modelToEntity(remoteData);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Falha ao buscar usuário por email");
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const remoteData = await this.remoteDataSource.getUsers();
      return remoteData.map((model) => this.modelToEntity(model));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Falha ao buscar usuários");
    }
  }

  async create(user: User): Promise<User> {
    try {
      // 1. Converte Entity para Model
      const model = this.entityToModel(user);

      // 2. Envia para API
      const createdModel = await this.remoteDataSource.createUser(model);

      // 3. Salva no cache
      await this.localDataSource.saveUser(createdModel);

      // 4. Retorna Entity
      return this.modelToEntity(createdModel);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Falha ao criar usuário");
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      const model = this.entityToModel(userData as User);
      const updatedModel = await this.remoteDataSource.updateUser(id, model);

      // Atualiza cache
      await this.localDataSource.saveUser(updatedModel);

      return this.modelToEntity(updatedModel);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Falha ao atualizar usuário");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.remoteDataSource.deleteUser(id);
      await this.localDataSource.deleteUser(id);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Falha ao deletar usuário");
    }
  }

  // Métodos auxiliares de conversão

  /**
   * Converte Model (DTO) para Entity (Domain)
   */
  private modelToEntity(model: UserModel): User {
    return new User(
      model.id,
      model.name,
      model.email,
      new Date(model.createdAt),
      model.isActive,
    );
  }

  /**
   * Converte Entity (Domain) para Model (DTO)
   */
  private entityToModel(user: User): UserModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      isActive: user.isActive,
    };
  }
}
```

### Repository com Estratégia de Cache

```typescript
// ProductRepositoryImpl.ts
import { Product } from "@/domain/entities/Product";
import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { ProductRemoteDataSource } from "@/data/datasources/ProductRemoteDataSource";
import { ProductLocalDataSource } from "@/data/datasources/ProductLocalDataSource";

export class ProductRepositoryImpl implements ProductRepository {
  private cacheExpiration = 5 * 60 * 1000; // 5 minutos

  constructor(
    private remoteDataSource: ProductRemoteDataSource,
    private localDataSource: ProductLocalDataSource,
  ) {}

  async findById(id: string): Promise<Product | null> {
    // Verifica cache
    const cached = await this.localDataSource.getProduct(id);

    if (cached && !this.isCacheExpired(cached.cachedAt)) {
      return this.modelToEntity(cached.data);
    }

    // Busca remoto
    const remote = await this.remoteDataSource.getProduct(id);
    if (!remote) return null;

    // Atualiza cache
    await this.localDataSource.saveProduct(id, {
      data: remote,
      cachedAt: Date.now(),
    });

    return this.modelToEntity(remote);
  }

  async findAll(): Promise<Product[]> {
    try {
      // Tenta cache primeiro
      const cached = await this.localDataSource.getAllProducts();
      if (cached.length > 0 && !this.isCacheExpired(cached[0].cachedAt)) {
        return cached.map((c) => this.modelToEntity(c.data));
      }

      // Busca remoto
      const remote = await this.remoteDataSource.getProducts();

      // Salva em cache
      await this.localDataSource.saveProducts(remote);

      return remote.map((m) => this.modelToEntity(m));
    } catch (error) {
      // Fallback para cache se API falhar
      const cached = await this.localDataSource.getAllProducts();
      if (cached.length > 0) {
        return cached.map((c) => this.modelToEntity(c.data));
      }
      throw error;
    }
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products =
      await this.remoteDataSource.getProductsByCategory(category);
    return products.map((m) => this.modelToEntity(m));
  }

  async search(term: string): Promise<Product[]> {
    const products = await this.remoteDataSource.searchProducts(term);
    return products.map((m) => this.modelToEntity(m));
  }

  async create(product: Product): Promise<Product> {
    const model = this.entityToModel(product);
    const created = await this.remoteDataSource.createProduct(model);

    // Invalida cache da lista
    await this.localDataSource.clearProducts();

    return this.modelToEntity(created);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const model = this.entityToModel(data as Product);
    const updated = await this.remoteDataSource.updateProduct(id, model);

    // Atualiza cache específico
    await this.localDataSource.saveProduct(id, {
      data: updated,
      cachedAt: Date.now(),
    });

    return this.modelToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.remoteDataSource.deleteProduct(id);
    await this.localDataSource.deleteProduct(id);
    return true;
  }

  async decreaseStock(id: string, quantity: number): Promise<void> {
    await this.remoteDataSource.updateStock(id, -quantity);
    // Invalida cache do produto
    await this.localDataSource.deleteProduct(id);
  }

  async increaseStock(id: string, quantity: number): Promise<void> {
    await this.remoteDataSource.updateStock(id, quantity);
    await this.localDataSource.deleteProduct(id);
  }

  // Helpers

  private isCacheExpired(cachedAt: number): boolean {
    return Date.now() - cachedAt > this.cacheExpiration;
  }

  private modelToEntity(model: ProductModel): Product {
    // conversão
  }

  private entityToModel(product: Product): ProductModel {
    // conversão
  }
}
```

### Repository com Sincronização Offline

```typescript
// OrderRepositoryImpl.ts
import { Order } from "@/domain/entities/Order";
import {
  OrderRepository,
  PaginatedResult,
  PaginationOptions,
} from "@/domain/repositories/OrderRepository";

export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    private remoteDataSource: OrderRemoteDataSource,
    private localDataSource: OrderLocalDataSource,
    private networkService: NetworkService,
  ) {
    // Sincroniza quando voltar online
    this.networkService.onOnline(() => this.syncPendingOrders());
  }

  async create(order: Order): Promise<Order> {
    const model = this.entityToModel(order);

    // Se estiver online, envia direto
    if (await this.networkService.isOnline()) {
      const created = await this.remoteDataSource.createOrder(model);
      return this.modelToEntity(created);
    }

    // Se offline, salva localmente para sincronizar depois
    await this.localDataSource.savePendingOrder({
      ...model,
      syncStatus: "pending",
    });

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    // Tenta local primeiro
    const local = await this.localDataSource.getOrder(id);
    if (local) {
      return this.modelToEntity(local);
    }

    // Se online, busca remoto
    if (await this.networkService.isOnline()) {
      const remote = await this.remoteDataSource.getOrder(id);
      if (remote) {
        await this.localDataSource.saveOrder(remote);
        return this.modelToEntity(remote);
      }
    }

    return null;
  }

  async findByUserId(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Order>> {
    const result = await this.remoteDataSource.getOrdersByUser(userId, options);

    return {
      ...result,
      data: result.data.map((m) => this.modelToEntity(m)),
    };
  }

  async findByStatus(status: string): Promise<Order[]> {
    const orders = await this.remoteDataSource.getOrdersByStatus(status);
    return orders.map((m) => this.modelToEntity(m));
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order> {
    const model = this.entityToModel(orderData as Order);
    const updated = await this.remoteDataSource.updateOrder(id, model);
    await this.localDataSource.saveOrder(updated);
    return this.modelToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.remoteDataSource.deleteOrder(id);
    await this.localDataSource.deleteOrder(id);
    return true;
  }

  /**
   * Sincroniza pedidos pendentes quando voltar online
   */
  private async syncPendingOrders(): Promise<void> {
    const pending = await this.localDataSource.getPendingOrders();

    for (const order of pending) {
      try {
        await this.remoteDataSource.createOrder(order);
        await this.localDataSource.deletePendingOrder(order.id);
      } catch (error) {
        console.error("Failed to sync order:", order.id, error);
      }
    }
  }

  // Conversões
  private modelToEntity(model: OrderModel): Order {
    // ...
  }

  private entityToModel(order: Order): OrderModel {
    // ...
  }
}
```

## ✅ Boas Práticas

### DO ✅

- Implemente TODAS as métodos da interface
- Trate erros apropriadamente
- Use cache quando faz sentido
- Converta Models em Entities
- Documente estratégias de dados
- Implemente fallbacks para offline
- Use injeção de dependências

### DON'T ❌

- Não retorne Models (DTOs) diretamente
- Não implemente lógica de negócio
- Não ignore erros
- Não faça acesso direto a API/Storage
- Não misture responsabilidades

## 🧪 Testes

```typescript
// UserRepositoryImpl.test.ts
describe("UserRepositoryImpl", () => {
  let repository: UserRepositoryImpl;
  let remoteDataSource: jest.Mocked<UserRemoteDataSource>;
  let localDataSource: jest.Mocked<UserLocalDataSource>;

  beforeEach(() => {
    remoteDataSource = {
      getUser: jest.fn(),
      createUser: jest.fn(),
    } as any;

    localDataSource = {
      getUser: jest.fn(),
      saveUser: jest.fn(),
    } as any;

    repository = new UserRepositoryImpl(remoteDataSource, localDataSource);
  });

  describe("findById", () => {
    it("should return cached user if available", async () => {
      const cachedModel = {
        id: "1",
        name: "João",
        email: "joao@test.com",
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      localDataSource.getUser.mockResolvedValue(cachedModel);

      const result = await repository.findById("1");

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe("1");
      expect(remoteDataSource.getUser).not.toHaveBeenCalled();
    });

    it("should fetch from remote if cache miss", async () => {
      localDataSource.getUser.mockResolvedValue(null);
      remoteDataSource.getUser.mockResolvedValue({
        id: "1",
        name: "João",
        email: "joao@test.com",
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      const result = await repository.findById("1");

      expect(result).toBeInstanceOf(User);
      expect(remoteDataSource.getUser).toHaveBeenCalledWith("1");
      expect(localDataSource.saveUser).toHaveBeenCalled();
    });
  });
});
```

## 📝 Template de Documentação

```typescript
/**
 * @repository RepositoryNameImpl
 * @description Implementação do repositório de [Entity]
 * @implements {RepositoryName}
 *
 * @strategy
 * - Usa cache local para melhor performance
 * - Sincroniza com API remota
 * - Implementa fallback offline
 *
 * @dependencies
 * - RemoteDataSource: Acesso à API
 * - LocalDataSource: Cache local
 */
```

## 🔗 Ver Também

- [Repository Interfaces](../../domain/repositories/README.md)
- [DataSources](../datasources/README.md)
- [Models](../models/README.md)
