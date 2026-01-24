# 🪝 Hooks (Custom Hooks)

## 📝 Descrição

Este diretório contém **Custom Hooks** React que encapsulam lógica reutilizável, conectam a UI aos UseCases e gerenciam estado compartilhado.

## 🎯 O que é um Custom Hook?

Um custom hook é uma função JavaScript que:

- Começa com "use"
- Pode usar outros hooks do React
- Encapsula lógica reutilizável
- Retorna dados e/ou funções
- Facilita o compartilhamento de lógica entre componentes

## 📁 Estrutura de Organização

```
hooks/
├── useAuth.ts              # Autenticação
├── useGetUser.ts           # Buscar usuário
├── useGetProducts.ts       # Buscar produtos
├── useForm.ts              # Gerenciar formulários
├── useDebounce.ts          # Debounce de valores
└── usePagination.ts        # Paginação
```

## 📋 Convenções de Nomenclatura

- **Prefixo "use"** é obrigatório: `useGetUser`
- **camelCase**: `useGetProductList`
- Nome descritivo e claro
- Indica o que o hook faz

### Padrões de Nomenclatura

- `useGet[Entity]` - para buscar dados
- `useCreate[Entity]` - para criar
- `useUpdate[Entity]` - para atualizar
- `useDelete[Entity]` - para deletar
- `use[Feature]` - para features específicas

## ✅ Anatomia de um Hook

### Hook Simples (Utilitário)

```typescript
// useDebounce.ts
import { useEffect, useState } from "react";

/**
 * @hook useDebounce
 * @description Adiciona delay a uma mudança de valor
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos
 * @returns Valor com delay aplicado
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500);
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### Hook com UseCase

```typescript
// useGetUser.ts
import { useState, useEffect } from "react";
import { GetUserUseCase } from "@/domain/usecases/GetUserUseCase";
import { User } from "@/domain/entities/User";

/**
 * @hook useGetUser
 * @description Hook para buscar dados do usuário
 * @param userId - ID do usuário
 * @returns Objeto com user, loading, error e refetch
 */
interface UseGetUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useGetUser = (userId: string): UseGetUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Instancia o UseCase (ou use Dependency Injection)
  const getUserUseCase = new GetUserUseCase();

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserUseCase.execute(userId);
      setUser(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};
```

### Hook com Mutação

```typescript
// useUpdateUser.ts
import { useState } from "react";
import { UpdateUserUseCase } from "@/domain/usecases/UpdateUserUseCase";
import { User } from "@/domain/entities/User";

/**
 * @hook useUpdateUser
 * @description Hook para atualizar dados do usuário
 */
interface UseUpdateUserReturn {
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useUpdateUser = (): UseUpdateUserReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserUseCase = new UpdateUserUseCase();

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await updateUserUseCase.execute(userId, data);
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
    error,
    success,
  };
};
```

### Hook de Formulário

```typescript
// useForm.ts
import { useState, ChangeEvent } from "react";

/**
 * @hook useForm
 * @description Hook genérico para gerenciar formulários
 */
interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (field: keyof T) => (value: any) => void;
  handleSubmit: (callback: () => void) => void;
  reset: () => void;
  setFieldError: (field: keyof T, error: string) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>,
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T) => (value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Limpa erro do campo ao mudar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (callback: () => void) => {
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    callback();
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    setFieldError,
  };
};
```

## 🔧 Tipos de Hooks

### 1. Hooks de Dados

Conectam-se aos UseCases para buscar/modificar dados

- `useGetProducts`
- `useCreateOrder`
- `useUpdateProfile`

### 2. Hooks de Estado

Gerenciam estado compartilhado

- `useAuth`
- `useCart`
- `useTheme`

### 3. Hooks Utilitários

Funcionalidades reutilizáveis

- `useDebounce`
- `useLocalStorage`
- `useKeyboard`

### 4. Hooks de UI

Lógica de interface

- `useModal`
- `useToast`
- `usePagination`

## ✅ Boas Práticas

### DO ✅

- Use o prefixo "use"
- Retorne objetos com nomes descritivos
- Documente parâmetros e retorno
- Implemente tratamento de erros
- Use TypeScript para tipagem
- Mantenha hooks focados em uma responsabilidade
- Reutilize hooks em múltiplos componentes

### DON'T ❌

- Não chame hooks condicionalmente
- Não chame hooks em loops
- Não chame hooks em callbacks
- Não coloque lógica de negócio complexa
- Não faça chamadas de API diretamente (use UseCases)

## 🧪 Testes

```typescript
// useGetUser.test.ts
import { renderHook, waitFor } from "@testing-library/react-hooks";
import { useGetUser } from "./useGetUser";

describe("useGetUser", () => {
  it("should fetch user data", async () => {
    const { result } = renderHook(() => useGetUser("123"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    // Mock para simular erro
    const { result } = renderHook(() => useGetUser("invalid-id"));

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

## 📚 Hooks Comuns

Hooks úteis para a maioria das aplicações:

- **useAuth** - Autenticação e autorização
- **useForm** - Gerenciamento de formulários
- **useDebounce** - Delay em mudanças de valor
- **useLocalStorage** - Persistência local
- **usePagination** - Paginação de listas
- **useInfiniteScroll** - Scroll infinito
- **useKeyboard** - Gerenciar teclado
- **useOrientation** - Orientação da tela
- **useNetworkStatus** - Status da rede

## 📖 Exemplo de Uso

```tsx
// Em uma Screen
import { useGetProducts } from "@/presentation/hooks/useGetProducts";
import { useDebounce } from "@/presentation/hooks/useDebounce";

export const ProductsScreen = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { products, loading, error } = useGetProducts(debouncedSearch);

  return (
    <View>
      <SearchBar value={search} onChangeText={setSearch} />
      {loading && <Loading />}
      {error && <Error message={error.message} />}
      <ProductList products={products} />
    </View>
  );
};
```

## 🔗 Ver Também

- [UseCases](../../domain/usecases/README.md)
- [Screens](../screens/README.md)
- [Components](../components/README.md)
