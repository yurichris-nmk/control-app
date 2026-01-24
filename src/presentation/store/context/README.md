# 🌐 Context API (Gerenciamento de Estado com Contextos)

## 📝 Descrição

Este diretório contém **Contexts** do React para compartilhar estado entre componentes sem passar props. Context API é ideal para dados que mudam pouco e precisam estar disponíveis em toda a árvore de componentes.

## 🎯 Context API vs Zustand

### ✅ Use Context API para:
- **Tema** (light/dark mode)
- **Internacionalização** (i18n/idiomas)
- **Configurações** que mudam raramente
- **Dados de contexto** da aplicação
- Quando precisa de controle fino sobre re-renders
- Dados que dependem da árvore de componentes

### ✅ Use Zustand para:
- **Autenticação** (login/logout frequente)
- **Carrinho** (adicionar/remover items)
- **Estado que muda frequentemente**
- **Persistência** complexa no AsyncStorage
- Performance crítica com muitos subscribers
- Estado que não depende da árvore de componentes

### 📊 Comparação

| Aspecto | Context API | Zustand |
|---------|-------------|---------|
| Performance | Re-render pode ser maior | Otimizado com selectors |
| Complexidade | Mais verboso | Mais simples |
| Persistência | Manual | Built-in middleware |
| DevTools | Precisa React DevTools | Zustand DevTools |
| Boilerplate | Mais código | Menos código |
| Use Case | Dados estáticos | Dados dinâmicos |

## 📁 Estrutura

```
context/
├── ThemeContext.tsx           # Tema da aplicação
├── I18nContext.tsx            # Internacionalização
├── AuthContext.tsx            # Autenticação (alternativa ao Zustand)
├── AppConfigContext.tsx       # Configurações gerais
└── index.ts                   # Exports centralizados
```

## ✅ Anatomia de um Context

### Context Simples (Theme)
```typescript
// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '@/shared/types/Theme';

/**
 * @context ThemeContext
 * @description Gerencia tema da aplicação (light/dark)
 */

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextData {
  theme: ThemeMode;
  currentTheme: Theme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// 1. Criar o Context
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// 2. Criar o Provider
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);

  // Carrega tema salvo
  useEffect(() => {
    loadTheme();
  }, []);

  // Aplica tema
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('@theme');
      if (saved) {
        setThemeState(saved as ThemeMode);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const applyTheme = (mode: ThemeMode) => {
    // Lógica para determinar tema baseado em 'auto'
    const isDark = mode === 'dark' || 
      (mode === 'auto' && shouldUseDarkMode());
    
    setCurrentTheme(isDark ? darkTheme : lightTheme);
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextData = {
    theme,
    currentTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Criar hook customizado
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  
  return context;
};

// Temas
const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
    // ...
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF',
    // ...
  },
};

const shouldUseDarkMode = (): boolean => {
  // Detecta preferência do sistema
  // Em React Native: usar Appearance.getColorScheme()
  return false;
};
```

### Context com Reducer (Auth)
```typescript
// AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/domain/entities/User';

/**
 * @context AuthContext
 * @description Gerencia autenticação do usuário
 */

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

interface AuthContextData extends AuthState {
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// 1. Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
      
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
      
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
      
    default:
      return state;
  }
};

// 2. Context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 3. Provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
  });

  // Restaura sessão ao iniciar
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const userJson = await AsyncStorage.getItem('@auth_user');

      if (token && userJson) {
        const user = JSON.parse(userJson);
        dispatch({ type: 'RESTORE_SESSION', payload: { user, token } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (user: User, token: string) => {
    try {
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
      
      dispatch({ type: 'SET_USER', payload: { user, token } });
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@auth_user');
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateUser = async (user: User) => {
    try {
      await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
      
      if (state.token) {
        dispatch({ type: 'SET_USER', payload: { user, token: state.token } });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const value: AuthContextData = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
};
```

### Context de Internacionalização (i18n)
```typescript
// I18nContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

/**
 * @context I18nContext
 * @description Gerencia idioma da aplicação
 */

type Locale = 'pt-BR' | 'en-US' | 'es-ES';

interface Translation {
  [key: string]: string | Translation;
}

interface Translations {
  [locale: string]: Translation;
}

interface I18nContextData {
  locale: Locale;
  t: (key: string, params?: Record<string, string>) => string;
  setLocale: (locale: Locale) => Promise<void>;
  availableLocales: Locale[];
}

interface I18nProviderProps {
  children: ReactNode;
  translations: Translations;
}

const I18nContext = createContext<I18nContextData>({} as I18nContextData);

export const I18nProvider = ({ children, translations }: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>('pt-BR');

  useEffect(() => {
    loadLocale();
  }, []);

  const loadLocale = async () => {
    try {
      const saved = await AsyncStorage.getItem('@locale');
      if (saved) {
        setLocaleState(saved as Locale);
      } else {
        // Usa idioma do dispositivo
        const deviceLocale = Localization.locale as Locale;
        setLocaleState(deviceLocale);
      }
    } catch (error) {
      console.error('Erro ao carregar idioma:', error);
    }
  };

  const setLocale = async (newLocale: Locale) => {
    try {
      await AsyncStorage.setItem('@locale', newLocale);
      setLocaleState(newLocale);
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      return key;
    }

    // Substitui parâmetros
    if (params) {
      Object.keys(params).forEach((param) => {
        value = value.replace(`{{${param}}}`, params[param]);
      });
    }

    return value;
  };

  const value: I18nContextData = {
    locale,
    t,
    setLocale,
    availableLocales: ['pt-BR', 'en-US', 'es-ES'],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de I18nProvider');
  }
  
  return context;
};

// Exemplo de uso das translations
export const translations: Translations = {
  'pt-BR': {
    common: {
      hello: 'Olá',
      welcome: 'Bem-vindo, {{name}}!',
      loading: 'Carregando...',
    },
    errors: {
      network: 'Erro de conexão',
    },
  },
  'en-US': {
    common: {
      hello: 'Hello',
      welcome: 'Welcome, {{name}}!',
      loading: 'Loading...',
    },
    errors: {
      network: 'Connection error',
    },
  },
};
```

## 📝 Setup dos Providers

### App.tsx (ou src/index.tsx)
```tsx
import React from 'react';
import { ThemeProvider } from '@/presentation/context/ThemeContext';
import { I18nProvider, translations } from '@/presentation/context/I18nContext';
import { AuthProvider } from '@/presentation/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '@/presentation/navigation/RootNavigator';

/**
 * Ordem dos Providers importa!
 * - Theme: primeiro (pode ser usado por todos)
 * - I18n: segundo (pode ser usado por Auth e outros)
 * - Auth: terceiro (pode usar Theme e I18n)
 */
export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider translations={translations}>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
```

## 📝 Uso nos Components/Screens

### Usando Theme
```tsx
// HomeScreen.tsx
import { useTheme } from '@/presentation/context/ThemeContext';

export const HomeScreen = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: currentTheme.colors.background }}>
      <Text style={{ color: currentTheme.colors.text }}>
        Olá!
      </Text>
      <Button title="Alternar Tema" onPress={toggleTheme} />
    </View>
  );
};
```

### Usando Auth
```tsx
// ProfileScreen.tsx
import { useAuth } from '@/presentation/context/AuthContext';

export const ProfileScreen = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text>Nome: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
};
```

### Usando i18n
```tsx
// WelcomeScreen.tsx
import { useI18n } from '@/presentation/context/I18nContext';

export const WelcomeScreen = () => {
  const { t, setLocale } = useI18n();

  return (
    <View>
      <Text>{t('common.hello')}</Text>
      <Text>{t('common.welcome', { name: 'João' })}</Text>
      
      <Button title="PT-BR" onPress={() => setLocale('pt-BR')} />
      <Button title="EN-US" onPress={() => setLocale('en-US')} />
    </View>
  );
};
```

## ⚡ Otimização de Performance

### Evitar Re-renders Desnecessários
```typescript
// ThemeContext.tsx - Split em múltiplos contexts
const ThemeStateContext = createContext<ThemeState>(null!);
const ThemeActionsContext = createContext<ThemeActions>(null!);

export const ThemeProvider = ({ children }) => {
  const [state, setState] = useState<ThemeState>({ theme: 'light' });

  // Actions não mudam, não causam re-render
  const actions = useMemo(() => ({
    setTheme: (theme: ThemeMode) => setState({ theme }),
    toggleTheme: () => setState(prev => ({ 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    })),
  }), []);

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeActionsContext.Provider value={actions}>
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
};

// Hooks separados
export const useThemeState = () => useContext(ThemeStateContext);
export const useThemeActions = () => useContext(ThemeActionsContext);
```

### Memoização
```tsx
const MyComponent = () => {
  const { theme } = useTheme();
  
  // Memoiza valores derivados
  const buttonColor = useMemo(
    () => theme === 'dark' ? '#FFF' : '#000',
    [theme]
  );

  return <Button color={buttonColor} />;
};
```

## ✅ Boas Práticas

### DO ✅
- Use Context para dados que **mudam raramente**
- Sempre crie um **hook customizado** (useMyContext)
- Valide se está dentro do Provider
- **Split contexts** quando possível (state/actions)
- Use **useMemo** para valores derivados
- Documente o propósito de cada Context

### DON'T ❌
- Não coloque **tudo** em Context
- Não use para estado que muda frequentemente
- Não ignore performance (re-renders)
- Não coloque lógica de negócio no Context
- Não esqueça de lidar com loading states
- Não use Context quando props seria suficiente

## 🔄 Context vs Zustand - Quando usar cada um?

### Use Context API 🌐
```typescript
// ✅ Tema - muda raramente, toda app precisa
<ThemeProvider>
  <App />
</ThemeProvider>

// ✅ Idioma - configuração global
<I18nProvider>
  <App />
</I18nProvider>
```

### Use Zustand 🗄️
```typescript
// ✅ Carrinho - muda frequentemente
const { items, addItem } = useCartStore();

// ✅ Auth - precisa persistência complexa
const { user, token } = useAuthStore();
```

### Combine os dois! 🤝
```tsx
// Theme com Context
const { currentTheme } = useTheme();

// Cart com Zustand
const cartItems = useCartStore(state => state.items);

return (
  <View style={{ backgroundColor: currentTheme.colors.background }}>
    <Text>Itens: {cartItems.length}</Text>
  </View>
);
```

## 🧪 Testando Contexts

```typescript
// ThemeContext.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { ThemeProvider, useTheme } from './ThemeContext';

describe('ThemeContext', () => {
  it('should toggle theme', () => {
    const wrapper = ({ children }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});
```

## 🔗 Ver Também

- [Store (Zustand)](../store/README.md) - Estado global com Zustand
- [Hooks](../hooks/README.md) - Custom Hooks
- [Theme](../../shared/theme/README.md) - Definições de tema
