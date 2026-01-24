# 📦 Repositories (Interfaces de Repositórios)

## 📝 Descrição

Este diretório contém as **interfaces** (contratos) dos repositórios. São abstrações que definem como os dados devem ser acessados, sem especificar como são implementados.

## 🎯 O que é um Repository Interface?

Um Repository Interface:

- Define contratos para acesso a dados
- É uma abstração (interface TypeScript)
- Não contém implementação
- Permite trocar implementações facilmente
- Facilita testes (mocking)

## 📁 Estrutura

```
repositories/
├── UserRepository.ts
├── ProductRepository.ts
├── OrderRepository.ts
└── AuthRepository.ts
```

## 🔧 Dependency Inversion Principle (DIP)

O Domain **define** as interfaces, mas **não implementa**. A camada Data implementa essas interfaces.

```
Domain (Interface) ← implementada por ← Data (Implementação)
```

## ✅ Anatomia de um Repository Interface

### Repository Básico (CRUD)

```typescript
// UserRepository.ts
import { User } from "@/domain/entities/User";

/**
 * @interface UserRepository
 * @description Contrato para acesso a dados de usuários
 */
export interface UserRepository {
  /**
   * Busca um usuário por ID
   * @param id - ID do usuário
   * @returns Usuário ou null se não encontrado
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário por email
   * @param email - Email do usuário
   * @returns Usuário ou null se não encontrado
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Lista todos os usuários
   * @returns Array de usuários
   */
  findAll(): Promise<User[]>;

  /**
   * Cria um novo usuário
   * @param user - Dados do usuário
   * @returns Usuário criado
   */
  create(user: User): Promise<User>;

  /**
   * Atualiza um usuário existente
   * @param id - ID do usuário
   * @param user - Dados atualizados
   * @returns Usuário atualizado
   */
  update(id: string, user: Partial<User>): Promise<User>;

  /**
   * Deleta um usuário
   * @param id - ID do usuário
   * @returns true se deletado com sucesso
   */
  delete(id: string): Promise<boolean>;
}
```

### Repository com Queries Específicas

```typescript
// ProductRepository.ts
import { Product } from "@/domain/entities/Product";

/**
 * @interface ProductRepository
 * @description Contrato para acesso a dados de produtos
 */
export interface ProductRepository {
  // CRUD básico
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<boolean>;

  // Queries específicas
  /**
   * Busca produtos por categoria
   */
  findByCategory(category: string): Promise<Product[]>;

  /**
   * Busca produtos disponíveis (em estoque)
   */
  findAvailable(): Promise<Product[]>;

  /**
   * Busca produtos com preço em um intervalo
   */
  findByPriceRange(min: number, max: number): Promise<Product[]>;

  /**
   * Busca produtos por termo de busca
   */
  search(term: string): Promise<Product[]>;

  /**
   * Decrementa o estoque de um produto
   */
  decreaseStock(id: string, quantity: number): Promise<void>;

  /**
   * Incrementa o estoque de um produto
   */
  increaseStock(id: string, quantity: number): Promise<void>;
}
```

### Repository com Paginação

```typescript
// OrderRepository.ts
import { Order } from "@/domain/entities/Order";

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Opções de paginação
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * @interface OrderRepository
 * @description Contrato para acesso a dados de pedidos
 */
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(id: string, order: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<boolean>;

  /**
   * Lista pedidos de um usuário com paginação
   */
  findByUserId(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Order>>;

  /**
   * Lista pedidos por status
   */
  findByStatus(status: string): Promise<Order[]>;

  /**
   * Lista pedidos em um intervalo de datas
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;

  /**
   * Conta total de pedidos
   */
  count(): Promise<number>;

  /**
   * Conta pedidos por status
   */
  countByStatus(status: string): Promise<number>;
}
```

### Repository com Filtros Complexos

```typescript
// ProductRepository.ts (avançado)

/**
 * Filtros de busca de produtos
 */
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
}

export interface ProductRepository {
  // ... métodos básicos

  /**
   * Busca produtos com filtros múltiplos
   */
  findWithFilters(
    filters: ProductFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Product>>;
}
```

## 🔧 Padrões de Nomenclatura

### Métodos Comuns

#### Busca

- `findById(id)` - Buscar por ID
- `findAll()` - Listar todos
- `findBy[Field]([value])` - Buscar por campo específico
- `search(term)` - Busca textual

#### Mutação

- `create(entity)` - Criar
- `update(id, data)` - Atualizar
- `delete(id)` - Deletar
- `save(entity)` - Salvar (criar ou atualizar)

#### Contagem

- `count()` - Contar todos
- `countBy[Criteria]()` - Contar com critério

#### Verificação

- `exists(id)` - Verifica se existe
- `existsBy[Field](value)` - Verifica por campo

## ✅ Boas Práticas

### DO ✅

- Use interfaces, não classes
- Nomeie métodos claramente
- Documente cada método
- Use tipos do domínio (Entities)
- Retorne Promises
- Use tipos genéricos quando apropriado
- Defina tipos para filtros e opções
- Mantenha interface coesa

### DON'T ❌

- Não implemente lógica na interface
- Não use tipos da camada de dados (DTOs)
- Não exponha detalhes de implementação
- Não misture responsabilidades
- Não use any ou unknown

## 🧪 Uso em Testes (Mocking)

```typescript
// CreateUserUseCase.test.ts
import { UserRepository } from "@/domain/repositories/UserRepository";
import { CreateUserUseCase } from "@/domain/usecases/CreateUserUseCase";

describe("CreateUserUseCase", () => {
  let userRepository: jest.Mocked<UserRepository>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    // Mock do repositório
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository);
  });

  it("should create user when email is available", async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(
      new User("1", "João", "joao@example.com", new Date()),
    );

    // Act
    const result = await useCase.execute({
      name: "João",
      email: "joao@example.com",
    });

    // Assert
    expect(result).toBeDefined();
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});
```

## 📝 Template de Documentação

```typescript
/**
 * @interface RepositoryName
 * @description Breve descrição do propósito do repositório
 *
 * @responsibilities
 * - Responsabilidade 1
 * - Responsabilidade 2
 *
 * @example
 * // Implementação
 * class RepositoryImpl implements RepositoryName {
 *   async findById(id: string) {
 *     // implementação
 *   }
 * }
 */
export interface RepositoryName {
  /**
   * Descrição do método
   * @param param - Descrição do parâmetro
   * @returns Descrição do retorno
   * @throws {Error} Quando ocorre erro
   */
  methodName(param: Type): Promise<ReturnType>;
}
```

## 🔗 Implementação

As implementações dessas interfaces ficam em `data/repositories/`:

```
domain/repositories/UserRepository.ts (interface)
     ↓ implementada por
data/repositories/UserRepositoryImpl.ts (implementação)
```

## 📚 Exemplo Completo

```typescript
// AuthRepository.ts
import { User } from "@/domain/entities/User";

/**
 * @interface AuthRepository
 * @description Contrato para operações de autenticação
 */
export interface AuthRepository {
  /**
   * Autentica um usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Usuário autenticado e token
   * @throws {Error} Se credenciais inválidas
   */
  login(
    email: string,
    password: string,
  ): Promise<{
    user: User;
    token: string;
  }>;

  /**
   * Registra um novo usuário
   * @param name - Nome do usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Usuário criado e token
   */
  register(
    name: string,
    email: string,
    password: string,
  ): Promise<{
    user: User;
    token: string;
  }>;

  /**
   * Faz logout do usuário
   * @param token - Token de autenticação
   */
  logout(token: string): Promise<void>;

  /**
   * Verifica se um token é válido
   * @param token - Token a ser verificado
   * @returns true se válido
   */
  verifyToken(token: string): Promise<boolean>;

  /**
   * Obtém usuário pelo token
   * @param token - Token de autenticação
   * @returns Usuário ou null
   */
  getUserByToken(token: string): Promise<User | null>;

  /**
   * Solicita reset de senha
   * @param email - Email do usuário
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Reseta a senha
   * @param token - Token de reset
   * @param newPassword - Nova senha
   */
  resetPassword(token: string, newPassword: string): Promise<void>;
}
```

## 🔗 Ver Também

- [Entities](../entities/README.md)
- [UseCases](../usecases/README.md)
- [Repository Implementations](../../data/repositories/README.md)
