# 🔌 Services (Serviços Externos)

## 📝 Descrição

Integrações com serviços de terceiros como Analytics, Crashlytics, Push Notifications, etc.

## ✅ Exemplos de Services

### Analytics Service

```typescript
// AnalyticsService.ts
import * as Analytics from "expo-firebase-analytics";

/**
 * @service AnalyticsService
 * @description Serviço de analytics
 */
export class AnalyticsService {
  /**
   * Registra um evento
   */
  async logEvent(
    eventName: string,
    params?: Record<string, any>,
  ): Promise<void> {
    try {
      await Analytics.logEvent(eventName, params);
    } catch (error) {
      console.error("Error logging event:", error);
    }
  }

  /**
   * Registra tela visualizada
   */
  async logScreenView(screenName: string): Promise<void> {
    await this.logEvent("screen_view", {
      screen_name: screenName,
    });
  }

  /**
   * Define propriedades do usuário
   */
  async setUserProperties(properties: Record<string, string>): Promise<void> {
    try {
      for (const [key, value] of Object.entries(properties)) {
        await Analytics.setUserProperty(key, value);
      }
    } catch (error) {
      console.error("Error setting user properties:", error);
    }
  }
}

export const analyticsService = new AnalyticsService();
```

### Network Service

```typescript
// NetworkService.ts
import NetInfo from "@react-native-community/netinfo";

/**
 * @service NetworkService
 * @description Monitora status da rede
 */
export class NetworkService {
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.init();
  }

  private init(): void {
    NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable;
      this.notifyListeners(isOnline ?? false);
    });
  }

  /**
   * Verifica se está online
   */
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected && (state.isInternetReachable ?? true);
  }

  /**
   * Registra callback para mudanças no status da rede
   */
  onOnline(callback: () => void): void {
    this.onStatusChange((isOnline) => {
      if (isOnline) callback();
    });
  }

  /**
   * Registra callback para mudanças no status
   */
  onStatusChange(callback: (isOnline: boolean) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach((listener) => listener(isOnline));
  }
}

export const networkService = new NetworkService();
```

## 🔗 Ver Também

- [Repositories](../../data/repositories/README.md)
