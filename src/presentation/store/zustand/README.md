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

| Aspecto | Zustand 🟣 | Context API 🔵 |
|---------|-----------|----------------|
| **Performance** | ⭐⭐⭐⭐⭐ Otimizado | ⭐⭐⭐ Pode causar re-renders |
| **Boilerplate** | ⭐⭐⭐⭐⭐ Mínimo | ⭐⭐⭐ Mais verboso |
| **Persistência** | ⭐⭐⭐⭐⭐ Built-in | ⭐⭐ Manual |
| **DevTools** | ⭐⭐⭐⭐⭐ Zustand DevTools | ⭐⭐⭐ React DevTools |
| **Complexidade** | ⭐⭐⭐⭐⭐ Simples | ⭐⭐⭐ Média |
| **Use Case** | Estado dinâmico | Configurações estáticas |

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
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
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
  const [theme, setTheme] = useState('light');
  
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
import { ThemeProvider } from './store/context/ThemeContext';
import { useCartStore } from './store/zustand/cartStore';

export default function App() {
  return (
    <ThemeProvider> {/* Context para tema */}
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
    const response = await fetch('/login');
    set({ user: response.user });
  },
}));
```

## 🧪 Testes

### Testando Zustand
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from './zustand/cartStore';

test('should add item to cart', () => {
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

### Store Simples (Auth)
```typescript
// authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/domain/entities/User';

/**
 * @store AuthStore
 * @description Gerencia estado de autenticação
 */
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Actions
      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage', // chave no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Seleciona o que persistir
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### Store com UseCases (Cart)
```typescript
// cartStore.ts
import { create } from 'zustand';
import { Product } from '@/domain/entities/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * @store CartStore
 * @description Gerencia carrinho de compras
 */
interface CartState {
  items: CartItem[];
  total: number;

  // Actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  
  // Computed
  getItemCount: () => number;
  calculateTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Atualiza quantidade
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      // Adiciona novo item
      return {
        items: [...state.items, { product, quantity }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),

  clear: () => set({ items: [], total: 0 }),

  getItemCount: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  calculateTotal: () => {
    const state = get();
    return state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },
}));
```

### Store de UI Global
```typescript
// uiStore.ts
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
}

/**
 * @store UIStore
 * @description Gerencia estado de UI global (modals, toasts, etc)
 */
interface UIState {
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type: Toast['type'], duration?: number) => void;
  hideToast: (id: string) => void;

  // Modals
  modals: Modal[];
  openModal: (component: React.ComponentType<any>, props?: any) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Loading global
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Toasts
  toasts: [],
  showToast: (message, type, duration = 3000) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Modals
  modals: [],
  openModal: (component, props) => {
    const id = `modal-${Date.now()}`;
    set((state) => ({
      modals: [...state.modals, { id, component, props }],
    }));
    return id;
  },
  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    })),
  closeAllModals: () => set({ modals: [] }),

  // Loading global
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
```

### Store com Middleware (Preferences)
```typescript
// userPreferencesStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';
type Language = 'pt-BR' | 'en-US' | 'es-ES';

/**
 * @store UserPreferencesStore
 * @description Preferências do usuário (tema, idioma, etc)
 */
interface PreferencesState {
  theme: Theme;
  language: Language;
  notificationsEnabled: boolean;
  soundEnabled: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
  resetPreferences: () => void;
}

const initialState = {
  theme: 'auto' as Theme,
  language: 'pt-BR' as Language,
  notificationsEnabled: true,
  soundEnabled: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        toggleNotifications: () =>
          set((state) => ({
            notificationsEnabled: !state.notificationsEnabled,
          })),
        toggleSound: () =>
          set((state) => ({ soundEnabled: !state.soundEnabled })),
        resetPreferences: () => set(initialState),
      }),
      {
        name: 'user-preferences',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: 'PreferencesStore' } // Nome no DevTools
  )
);
```

## 📝 Uso nas Screens/Components

### Lendo Estado
```tsx
// HomeScreen.tsx
import { useAuthStore } from '@/presentation/store/authStore';
import { useCartStore } from '@/presentation/store/cartStore';

export const HomeScreen = () => {
  // Seleciona apenas o que precisa (otimização)
  const user = useAuthStore((state) => state.user);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <View>
      <Text>Bem-vindo, {user?.name}!</Text>
      <Text>Itens no carrinho: {itemCount}</Text>
    </View>
  );
};
```

### Modificando Estado
```tsx
// ProductScreen.tsx
import { useCartStore } from '@/presentation/store/cartStore';
import { useUIStore } from '@/presentation/store/uiStore';

export const ProductScreen = ({ product }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);

  const handleAddToCart = () => {
    addItem(product, 1);
    showToast('Produto adicionado ao carrinho!', 'success');
  };

  return (
    <Button onPress={handleAddToCart}>Adicionar ao Carrinho</Button>
  );
};
```

### Com UseCase
```tsx
// LoginScreen.tsx
import { useAuthStore } from '@/presentation/store/authStore';
import { LoginUseCase } from '@/domain/usecases/LoginUseCase';

export const LoginScreen = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const useCase = new LoginUseCase(repository);
      const result = await useCase.execute({ email, password });
      
      if (result.success) {
        setUser(result.data.user, result.data.token);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} />
  );
};
```

## ✅ Boas Práticas

### DO ✅
- Use stores para estado **realmente global**
- Mantenha stores focadas (auth, cart, ui)
- Use `persist` para dados que precisam sobreviver restart
- Selecione apenas o que precisa do state
- Use TypeScript para tipar stores
- Coloque lógica simples nas actions
- Use devtools em desenvolvimento

### DON'T ❌
- Não coloque TODA lógica de negócio nas stores
- Não use para estado local de componente
- Não ignore UseCases (stores NÃO substituem Domain)
- Não crie uma store gigante com tudo
- Não persista dados sensíveis sem criptografia
- Não ignore performance (use selectors)

## 🔄 Integração com Clean Architecture

### Store + UseCase (Correto)
```typescript
// LoginScreen.tsx
const handleLogin = async (credentials) => {
  setLoading(true);
  
  // UseCase executa lógica de negócio
  const useCase = new LoginUseCase(repository);
  const result = await useCase.execute(credentials);
  
  // Store apenas guarda o resultado
  if (result.success) {
    setUser(result.data.user, result.data.token);
  }
  
  setLoading(false);
};
```

### ❌ Errado (Lógica de negócio na store)
```typescript
// NÃO FAÇA ISSO
const useAuthStore = create((set) => ({
  login: async (email, password) => {
    // ❌ Validações de negócio na store
    if (!isValidEmail(email)) return;
    
    // ❌ Chamada de API na store
    const response = await fetch('/login', {...});
    
    set({ user: response.user });
  }
}));
```

## 📦 Instalação

```bash
npm install zustand
# ou
yarn add zustand
```

## 🧪 Testando Stores

```typescript
// authStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from './authStore';

describe('AuthStore', () => {
  it('should set user on login', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser(mockUser, 'token123');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear user on logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser(mockUser, 'token123');
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## 🔗 Ver Também

- [Hooks](../hooks/README.md) - Custom Hooks
- [UseCases](../../domain/usecases/README.md) - Lógica de negócio
- [Zustand Docs](https://github.com/pmndrs/zustand)
