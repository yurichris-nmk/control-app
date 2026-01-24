# 📌 Constants (Constantes)

## 📝 Descrição

Constantes da aplicação que são usadas em múltiplos lugares.

## ✅ Exemplos

### API Constants

```typescript
// api.ts

/**
 * @constants API
 * @description Configurações de API
 */
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://api.production.com";

export const API_TIMEOUT = 30000; // 30 segundos

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    ME: "/users/me",
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    BY_USER: (userId: string) => `/users/${userId}/orders`,
  },
} as const;
```

### Storage Keys

```typescript
// storage.ts

/**
 * @constants Storage
 * @description Chaves de armazenamento local
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "@auth:token",
  REFRESH_TOKEN: "@auth:refresh_token",
  USER: "@user:data",
  THEME: "@app:theme",
  LANGUAGE: "@app:language",
  ONBOARDING_COMPLETED: "@app:onboarding",
} as const;
```

### App Constants

```typescript
// app.ts

/**
 * @constants App
 * @description Constantes gerais da aplicação
 */
export const APP_NAME = "Control";
export const APP_VERSION = "1.0.0";
export const APP_BUILD = "1";

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const DEBOUNCE_DELAY = {
  SEARCH: 500,
  INPUT: 300,
  RESIZE: 200,
} as const;

export const CACHE_EXPIRATION = {
  SHORT: 5 * 60 * 1000, // 5 minutos
  MEDIUM: 30 * 60 * 1000, // 30 minutos
  LONG: 24 * 60 * 60 * 1000, // 24 horas
} as const;
```

### Regex Patterns

```typescript
// regex.ts

/**
 * @constants Regex
 * @description Padrões de validação
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_BR: /^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}-?[0-9]{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/,
  PASSWORD_STRONG:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;
```

## 📝 Template

```typescript
/**
 * @constants CategoryName
 * @description Breve descrição
 */
export const CONSTANT_NAME = "value";

export const OBJECT_CONSTANT = {
  KEY1: "value1",
  KEY2: "value2",
} as const;
```

## ✅ Boas Práticas

- Use SCREAMING_SNAKE_CASE para constantes
- Use `as const` para objetos imutáveis
- Agrupe constantes relacionadas
- Documente o propósito de cada constante

## 🔗 Ver Também

- [Utils](../utils/README.md)
