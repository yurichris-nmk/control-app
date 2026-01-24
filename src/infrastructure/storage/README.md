# 💾 Storage (Armazenamento Local)

## 📝 Descrição

Configuração e utilitários para armazenamento local usando AsyncStorage, SecureStore, ou SQLite.

## ✅ Exemplo de Storage Manager

```typescript
// StorageManager.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * @service StorageManager
 * @description Gerencia armazenamento local
 */
export class StorageManager {
  /**
   * Salva um item
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error saving to storage:", error);
      throw new Error("Failed to save data");
    }
  }

  /**
   * Busca um item
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error reading from storage:", error);
      return null;
    }
  }

  /**
   * Remove um item
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  }

  /**
   * Limpa todo o storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  /**
   * Verifica se existe uma chave
   */
  async hasItem(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }
}

export const storageManager = new StorageManager();
```

## 🔐 Secure Storage (Tokens)

```typescript
// TokenStorage.ts
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Salva o token de autenticação
 */
export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Busca o token de autenticação
 */
export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Remove o token de autenticação
 */
export async function removeAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * Salva refresh token
 */
export async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

/**
 * Busca refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}
```

## 📝 Uso

```typescript
// Em um LocalDataSource
import { storageManager } from "@/infrastructure/storage/StorageManager";

export class UserLocalDataSource {
  private readonly USER_KEY = "@user";

  async saveUser(user: UserModel): Promise<void> {
    await storageManager.setItem(this.USER_KEY, user);
  }

  async getUser(): Promise<UserModel | null> {
    return await storageManager.getItem<UserModel>(this.USER_KEY);
  }
}
```

## 🔗 Ver Também

- [DataSources](../../data/datasources/README.md)
