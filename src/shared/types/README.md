# 📐 Types (Tipos TypeScript)

## 📝 Descrição

Tipos TypeScript globais e reutilizáveis.

## ✅ Exemplos

### Common Types

```typescript
// common.types.ts

/**
 * Tipo genérico para resultados de operações
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Tipo para paginação
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Tipo para resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Tipo para ordenação
 */
export interface Sort {
  field: string;
  order: "asc" | "desc";
}

/**
 * Tipo para filtros genéricos
 */
export type Filters = Record<string, any>;
```

### Utility Types

```typescript
// utility.types.ts

/**
 * Torna todas as propriedades de T opcionais exceto as listadas em K
 */
export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Torna todas as propriedades de T obrigatórias exceto as listadas em K
 */
export type OptionalExcept<T, K extends keyof T> = Required<T> &
  Partial<Pick<T, K>>;

/**
 * Remove null e undefined de T
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Tipo para valores de um objeto
 */
export type ValueOf<T> = T[keyof T];

/**
 * Tipo para promises unwrapped
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;
```

### Navigation Types

```typescript
// navigation.types.ts

/**
 * Tipo helper para navegação
 */
export type NavigationParams<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends undefined
    ? { screen: K; params?: T[K] }
    : { screen: K; params: T[K] };
}[keyof T];

/**
 * Tipo para rotas sem parâmetros
 */
export type SimpleRoute = {
  screen: string;
};

/**
 * Tipo para rotas com parâmetros
 */
export type RouteWithParams<T = any> = {
  screen: string;
  params: T;
};
```

### API Types

```typescript
// api.types.ts

/**
 * Tipo para resposta de API
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Tipo para erro de API
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Tipo para status de requisição
 */
export type RequestStatus = "idle" | "loading" | "success" | "error";

/**
 * Tipo para estado de dados assíncronos
 */
export interface AsyncData<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

## 📝 Template

```typescript
/**
 * @type TypeName
 * @description Breve descrição
 */
export type TypeName<T = any> = {
  // definição
};
```

## 🔗 Ver Também

- Usado em todas as camadas
