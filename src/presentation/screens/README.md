# 📱 Screens (Telas)

## 📝 Descrição

Este diretório contém todas as **telas** (screens) da aplicação. Cada tela representa uma página completa que o usuário pode navegar.

## 🎯 O que é uma Screen?

Uma screen é um componente React que:

- Representa uma página completa do app
- Gerencia o estado da tela
- Coordena múltiplos components
- Conecta-se aos UseCases via Hooks
- É referenciada no sistema de navegação

## 📁 Estrutura de Organização

### Opção 1: Por Funcionalidade

```
screens/
├── Auth/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ForgotPasswordScreen.tsx
├── Home/
│   ├── HomeScreen.tsx
│   └── DashboardScreen.tsx
└── Profile/
    ├── ProfileScreen.tsx
    └── EditProfileScreen.tsx
```

### Opção 2: Flat (Simples)

```
screens/
├── LoginScreen.tsx
├── HomeScreen.tsx
├── ProfileScreen.tsx
└── SettingsScreen.tsx
```

## 📋 Convenções de Nomenclatura

- **PascalCase** para arquivos: `HomeScreen.tsx`
- Sufixo **"Screen"** obrigatório
- Nome descritivo e claro
- Um componente por arquivo

## ✅ Anatomia de uma Screen

```tsx
// HomeScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

// 1. Imports de hooks customizados
import { useGetDashboardData } from "@/presentation/hooks/useGetDashboardData";

// 2. Imports de componentes
import { Header } from "@/presentation/components/Header";
import { Card } from "@/presentation/components/Card";

// 3. Tipos (se necessário)
type HomeScreenProps = {
  // props da navegação
};

// 4. Componente da Screen
export const HomeScreen: React.FC<HomeScreenProps> = () => {
  // 5. Hooks de navegação
  const navigation = useNavigation();

  // 6. Hooks de dados/estado
  const { data, loading, error, refetch } = useGetDashboardData();

  // 7. Handlers de eventos
  const handleCardPress = (id: string) => {
    navigation.navigate("Details", { id });
  };

  // 8. Render condicional
  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error} onRetry={refetch} />;

  // 9. Render principal
  return (
    <View>
      <Header title="Home" />
      {data?.map((item) => (
        <Card
          key={item.id}
          data={item}
          onPress={() => handleCardPress(item.id)}
        />
      ))}
    </View>
  );
};
```

## 🔧 Responsabilidades

### ✅ O que uma Screen DEVE fazer:

- Coordenar componentes menores
- Usar hooks para acessar dados
- Gerenciar navegação
- Lidar com estados de loading/error
- Passar props para componentes filhos

### ❌ O que uma Screen NÃO deve fazer:

- Conter lógica de negócio complexa
- Fazer chamadas de API diretamente
- Implementar validações complexas
- Ter componentes muito grandes inline

## 📝 Template de Documentação

Ao criar uma nova screen, documente no topo do arquivo:

```tsx
/**
 * @screen HomeScreen
 * @description Tela principal do aplicativo, exibe dashboard com resumo
 * @navigation
 *   - Recebe: nenhum parâmetro
 *   - Navega para: DetailsScreen, SettingsScreen
 * @usecases
 *   - GetDashboardDataUseCase
 * @author Seu Nome
 * @created 2026-01-24
 */
```

## 🧪 Testes

Cada screen deve ter testes que verificam:

- Renderização correta
- Estados de loading e error
- Navegação funciona
- Interações do usuário

```typescript
// HomeScreen.test.tsx
describe("HomeScreen", () => {
  it("should render dashboard data", () => {
    // test implementation
  });

  it("should navigate to details on card press", () => {
    // test implementation
  });
});
```

## 📚 Exemplos

### Screen Simples

```tsx
export const AboutScreen = () => {
  return (
    <ScrollView>
      <Header title="Sobre" />
      <Text>Versão 1.0.0</Text>
    </ScrollView>
  );
};
```

### Screen com Dados

```tsx
export const ProductListScreen = () => {
  const { products, loading } = useGetProducts();

  return (
    <View>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
};
```

## 🔗 Ver Também

- [Components](../components/README.md)
- [Hooks](../hooks/README.md)
- [Navigation](../navigation/README.md)
