# 🧭 Navigation (Navegação)

## 📝 Descrição

Este diretório contém toda a configuração de **navegação** da aplicação, incluindo rotas, tipos de navegação e navegadores.

## 🎯 O que é Navigation?

Sistema de navegação controla:

- Como o usuário navega entre telas
- Histórico de navegação (stack)
- Passagem de parâmetros entre telas
- Tipos de transições

## 📁 Estrutura de Organização

```
navigation/
├── types.ts                # Tipos TypeScript das rotas
├── RootNavigator.tsx       # Navegador principal
├── AppNavigator.tsx        # Navegação do app logado
├── AuthNavigator.tsx       # Navegação de autenticação
└── TabNavigator.tsx        # Navegação por abas
```

## 📦 Biblioteca

Este projeto usa **React Navigation v7**, instalado via:

```json
"@react-navigation/native": "^7.1.8",
"@react-navigation/bottom-tabs": "^7.4.0"
```

## ✅ Tipos de Navegação

### 1. Stack Navigator

Navegação em pilha (uma tela sobre a outra)

```tsx
// AppNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type AppStackParamList = {
  Home: undefined;
  Details: { id: string };
  Profile: { userId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
```

### 2. Tab Navigator

Navegação por abas (bottom tabs)

```tsx
// TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SearchTab") {
            iconName = focused ? "search" : "search-outline";
          } else {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="SearchTab" component={SearchScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
```

### 3. Drawer Navigator

Menu lateral

```tsx
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};
```

## 📋 Estrutura Completa

### Root Navigator

```tsx
// RootNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import { useAuth } from "@/presentation/hooks/useAuth";

/**
 * @component RootNavigator
 * @description Navegador raiz que decide entre Auth e App
 */
export const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
```

### Types (Tipagem)

```typescript
// types.ts
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

// Define as rotas de autenticação
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Define as rotas do app
export type AppStackParamList = {
  Home: undefined;
  Details: { id: string; title?: string };
  Profile: { userId: string };
  Settings: undefined;
};

// Tipos auxiliares para navigation prop
export type AppNavigationProp<T extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, T>;

// Tipos auxiliares para route prop
export type AppRouteProp<T extends keyof AppStackParamList> = RouteProp<
  AppStackParamList,
  T
>;

// Export types para uso nas screens
export type HomeScreenNavigationProp = AppNavigationProp<"Home">;
export type DetailsScreenNavigationProp = AppNavigationProp<"Details">;
export type DetailsScreenRouteProp = AppRouteProp<"Details">;
```

## 🔧 Uso nas Screens

### Com TypeScript

```tsx
// DetailsScreen.tsx
import { useNavigation, useRoute } from "@react-navigation/native";
import type {
  DetailsScreenNavigationProp,
  DetailsScreenRouteProp,
} from "@/presentation/navigation/types";

export const DetailsScreen = () => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const route = useRoute<DetailsScreenRouteProp>();

  // route.params é tipado!
  const { id, title } = route.params;

  const handleNavigateToProfile = () => {
    // TypeScript valida os parâmetros!
    navigation.navigate("Profile", { userId: "123" });
  };

  return (
    <View>
      <Text>ID: {id}</Text>
      <Text>Title: {title}</Text>
      <Button title="Ver Perfil" onPress={handleNavigateToProfile} />
    </View>
  );
};
```

### Navegação Programática

```tsx
// Navegar para uma tela
navigation.navigate("Details", { id: "123" });

// Voltar
navigation.goBack();

// Resetar stack
navigation.reset({
  index: 0,
  routes: [{ name: "Home" }],
});

// Substituir tela atual
navigation.replace("Login");

// Pop para tela específica
navigation.popToTop();
```

## ✅ Boas Práticas

### DO ✅

- Use TypeScript para tipar rotas e parâmetros
- Centralize tipos de navegação em um arquivo
- Use navegação programática com tipos
- Implemente deep linking
- Configure transições customizadas se necessário
- Use header customizado quando apropriado

### DON'T ❌

- Não passe objetos complexos como parâmetros
- Não ignore tipagem de navegação
- Não crie muitos níveis de stack aninhados
- Não use navegação imperativa sem necessidade

## 🔗 Deep Linking

```tsx
// RootNavigator.tsx
const linking = {
  prefixes: ["myapp://", "https://myapp.com"],
  config: {
    screens: {
      Home: "home",
      Details: "details/:id",
      Profile: "profile/:userId",
    },
  },
};

export const RootNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  );
};
```

## 🎨 Customização

### Header Customizado

```tsx
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTitle: "Meu App",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerRight: () => <Button title="Info" onPress={() => {}} />,
  }}
/>
```

### Transições

```tsx
<Stack.Navigator
  screenOptions={{
    animation: 'slide_from_right',
    // ou: 'fade', 'flip', 'none'
  }}
>
```

## 📚 Referências

- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Guide](https://reactnavigation.org/docs/typescript)
- [Deep Linking](https://reactnavigation.org/docs/deep-linking)

## 🔗 Ver Também

- [Screens](../screens/README.md)
- [Hooks](../hooks/README.md)
