# 📦 Models (Modelos de Dados / DTOs)

## 📝 Descrição

**Models** são Data Transfer Objects (DTOs) que representam a estrutura de dados que trafega entre as camadas. Eles são a representação "crua" dos dados vindos da API ou Storage.

## 🎯 O que é um Model?

Um Model:

- Representa dados brutos (JSON)
- É usado para transferência de dados
- Não contém lógica de negócio
- É facilmente serializável
- Mapeia 1:1 com a API

## 📁 Estrutura

```
models/
├── UserModel.ts
├── ProductModel.ts
├── OrderModel.ts
└── index.ts
```

## ✅ Model vs Entity

### Model (DTO)

- Dados brutos da API
- Sem validações
- Sem comportamento
- Sempre tipado com interface/type
- Exemplo: `UserModel`

### Entity (Domain)

- Objeto de negócio
- Com validações
- Com comportamento (métodos)
- Classe com lógica
- Exemplo: `User`

## ✅ Anatomia de um Model

```typescript
// UserModel.ts

/**
 * @model UserModel
 * @description Representa dados de usuário vindos da API
 */
export interface UserModel {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO string da API
  updatedAt?: string;
  isActive: boolean;
  profilePicture?: string;
}

/**
 * Request para criar usuário
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Request para atualizar usuário
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  profilePicture?: string;
}

/**
 * Response de autenticação
 */
export interface AuthResponse {
  user: UserModel;
  token: string;
  refreshToken: string;
}
```

```typescript
// ProductModel.ts

/**
 * @model ProductModel
 * @description Modelo de produto da API
 */
export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  images?: string[];
}

export interface ProductListResponse {
  products: ProductModel[];
  total: number;
  page: number;
  pageSize: number;
}
```

```typescript
// OrderModel.ts

/**
 * @model OrderModel
 * @description Modelo de pedido
 */
export interface OrderModel {
  id: string;
  userId: string;
  items: OrderItemModel[];
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemModel {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CreateOrderRequest {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  couponCode?: string;
}
```

## ✅ Boas Práticas

### DO ✅

- Use `interface` ou `type` (não classes)
- Nomeie com sufixo "Model"
- Mantenha sincronizado com a API
- Documente cada campo
- Use tipos union para enums
- Separe Request/Response quando necessário

### DON'T ❌

- Não adicione métodos ou lógica
- Não faça validações
- Não use classes
- Não misture com Entities
- Não adicione computed properties

## 📝 Template de Documentação

```typescript
/**
 * @model ModelName
 * @description Breve descrição
 * @apiEndpoint GET /api/endpoint
 */
export interface ModelName {
  /** Descrição do campo */
  field1: string;

  /** Descrição do campo opcional */
  field2?: number;
}
```

## 🔄 Conversão Model ↔ Entity

A conversão acontece nos Repositories:

```typescript
// Em UserRepositoryImpl
private modelToEntity(model: UserModel): User {
  return new User(
    model.id,
    model.name,
    model.email,
    new Date(model.createdAt), // String → Date
    model.isActive
  );
}

private entityToModel(user: User): UserModel {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(), // Date → String
    isActive: user.isActive,
  };
}
```

## 🔗 Ver Também

- [Entities](../../domain/entities/README.md)
- [DataSources](../datasources/README.md)
- [Repositories](../repositories/README.md)
