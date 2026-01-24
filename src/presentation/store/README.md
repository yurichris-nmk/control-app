# 🗄️ Store (Gerenciamento de Estado Global)

## 📝 Descrição

Este diretório contém **todo gerenciamento de estado global** da aplicação, usando **Zustand** e **Context API**. Escolha a ferramenta certa para cada caso de uso.

## 📂 Estrutura

```
store/
├── zustand/          # 🟣 Stores Zustand (estado dinâmico)
│   ├── authStore.ts
│   ├── cartStore.ts
│   ├── uiStore.ts
│   └── index.ts
└── context/          # 🔵 Contexts React (estado estático)
    ├── ThemeContext.tsx
    ├── I18nContext.tsx
    └── index.ts
```

## 🎯 Quando Usar Cada Um?

### 🟣 Zustand ([ver documentação](./zustand/README.md))

**Use para estado que MUDA FREQUENTEMENTE:**

- ✅ Autenticação (login/logout)
- ✅ Carrinho de compras
- ✅ Estado de UI dinâmico (toasts, modals)
- ✅ Cache de dados
- ✅ Filtros/pesquisas
- ✅ Preferências que mudam muito

**Vantagens:**

- ⚡ Performance otimizada com selectors
- 💾 Persistência built-in (middleware)
- 🔧 DevTools integrado
- 📦 Menos boilerplate
- 🎯 Fácil de testar

### 🔵 Context API ([ver documentação](./context/README.md))

**Use para configurações que MUDAM RARAMENTE:**

- ✅ Tema (light/dark)
- ✅ Idioma (i18n)
- ✅ Configurações globais
- ✅ Feature flags
- ✅ Dados que dependem da árvore de componentes

**Vantagens:**

- 🏛️ Nativo do React
- 🎯 Controle fino sobre re-renders
- 📦 Não precisa biblioteca externa
- 🔒 Isolamento por Provider

## 📊 Comparação Rápida

| Aspecto          | Zustand 🟣                  | Context API 🔵                |
| ---------------- | --------------------------- | ----------------------------- |
| **Performance**  | ⭐⭐⭐⭐⭐ Otimizado        | ⭐⭐⭐ Pode causar re-renders |
| **Boilerplate**  | ⭐⭐⭐⭐⭐ Mínimo           | ⭐⭐⭐ Mais verboso           |
| **Persistência** | ⭐⭐⭐⭐⭐ Built-in         | ⭐⭐ Manual                   |
| **DevTools**     | ⭐⭐⭐⭐⭐ Zustand DevTools | ⭐⭐⭐ React DevTools         |
| **Complexidade** | ⭐⭐⭐⭐⭐ Simples          | ⭐⭐⭐ Média                  |
| **Use Case**     | Estado dinâmico             | Configurações estáticas       |

## 💡 Exemplos Práticos

### ❌ Errado - Context para estado dinâmico

```tsx
// NÃO FAÇA - Context com carrinho que muda muito
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // Re-render em TODA árvore!

  const addItem = (item) => setItems([...items, item]);

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children} {/* Todos re-renderizam quando items muda */}
    </CartContext.Provider>
  );
};
```

### ✅ Correto - Zustand para estado dinâmico

```tsx
// ✅ Zustand - apenas componentes que usam re-renderizam
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
}));

// Componente A - só re-renderiza quando items muda
const ComponentA = () => {
  const items = useCartStore((state) => state.items);
  return <Text>{items.length}</Text>;
};

// Componente B - nunca re-renderiza
const ComponentB = () => {
  const addItem = useCartStore((state) => state.addItem);
  return <Button onPress={() => addItem(product)} />;
};
```

### ✅ Correto - Context para tema

```tsx
// ✅ Context para tema que muda raramente
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Muda raramente, re-render é aceitável
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 🤝 Combinando os dois

```tsx
// App.tsx - Use ambos juntos!
import { ThemeProvider } from "./store/context/ThemeContext";
import { useCartStore } from "./store/zustand/cartStore";

export default function App() {
  return (
    <ThemeProvider>
      {" "}
      {/* Context para tema */}
      <MainScreen />
    </ThemeProvider>
  );
}

const MainScreen = () => {
  const { theme } = useTheme(); // Context API
  const cartCount = useCartStore((state) => state.items.length); // Zustand

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text>Carrinho: {cartCount}</Text>
    </View>
  );
};
```

## 📝 Guia de Decisão Rápido

Responda estas perguntas para escolher:

### 1️⃣ O estado muda frequentemente?

- **SIM** → 🟣 Zustand
- **NÃO** → 🔵 Context API

### 2️⃣ Precisa persistir no AsyncStorage?

- **SIM (complexo)** → 🟣 Zustand (middleware persist)
- **SIM (simples)** → 🔵 Context API (manual)

### 3️⃣ Muitos componentes leem esse estado?

- **SIM** → 🟣 Zustand (performance)
- **NÃO** → 🔵 Context API ou props

### 4️⃣ É configuração global?

- **SIM** → 🔵 Context API (Tema, i18n)
- **NÃO** → 🟣 Zustand

### 5️⃣ Precisa de DevTools?

- **SIM** → 🟣 Zustand (melhor DevTools)
- **NÃO** → Tanto faz

## 🚀 Setup Inicial

### Instalar Zustand

```bash
npm install zustand
# ou
yarn add zustand
```

### Context API

Já vem com React, nada para instalar! 🎉

## 📚 Ver Documentação Detalhada

- **[Zustand →](./zustand/README.md)** - Documentação completa de Zustand
- **[Context API →](./context/README.md)** - Documentação completa de Context API

## ✅ Boas Práticas Gerais

### DO ✅

- Use Zustand para estado dinâmico/frequente
- Use Context para configurações estáticas
- Combine os dois quando fizer sentido
- Mantenha stores focadas (uma responsabilidade)
- Use TypeScript para tipar todo estado
- Documente quando usar cada store/context

### DON'T ❌

- Não use Context para tudo (performance)
- Não use Zustand para configurações simples
- Não misture lógica de negócio nas stores
- Não ignore UseCases (stores são apenas estado)
- Não crie uma store gigante com tudo
- Não persista dados sensíveis sem criptografia

## 🔄 Integração com Clean Architecture

### ⚠️ Lembre-se: Stores NÃO substituem UseCases!

```tsx
// ✅ CORRETO - UseCase executa lógica, Store guarda resultado
const LoginScreen = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (credentials) => {
    // 1. UseCase executa LÓGICA DE NEGÓCIO
    const useCase = new LoginUseCase(repository);
    const result = await useCase.execute(credentials);

    // 2. Store apenas GUARDA o resultado
    if (result.success) {
      setUser(result.data.user, result.data.token);
    }
  };
};

// ❌ ERRADO - Lógica de negócio na store
const useAuthStore = create((set) => ({
  login: async (email, password) => {
    // ❌ Validações, regras de negócio, API calls na store
    if (!isValidEmail(email)) return;
    const response = await fetch("/login");
    set({ user: response.user });
  },
}));
```

## 🧪 Testes

### Testando Zustand

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useCartStore } from "./zustand/cartStore";

test("should add item to cart", () => {
  const { result } = renderHook(() => useCartStore());

  act(() => {
    result.current.addItem(mockProduct);
  });

  expect(result.current.items).toHaveLength(1);
});
```

### Testando Context

```typescript
import { render } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';

test('should toggle theme', () => {
  const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return <Button testID="toggle" onPress={toggleTheme} />;
  };

  const { getByTestId } = render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  // ...
});
```

## 🔗 Ver Também

- [Hooks](../hooks/README.md) - Custom Hooks
- [UseCases](../../domain/usecases/README.md) - Lógica de negócio
- [Screens](../screens/README.md) - Onde usar stores/contexts
