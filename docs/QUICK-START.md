# 🚀 Guia de Início Rápido

Guia prático para começar a desenvolver rapidamente no projeto.

## 📋 Checklist de Setup

- [ ] Node.js instalado (v18+)
- [ ] Expo CLI instalado
- [ ] Editor configurado (VS Code recomendado)
- [ ] Dependências instaladas (`npm install`)
- [ ] Projeto rodando (`npm start`)

## 🎯 Primeira Feature: Lista de Usuários

Vamos criar uma feature completa do zero seguindo a arquitetura.

### Passo 1: Domain Layer

#### 1.1 Criar Entity

```typescript
// src/domain/entities/User.ts

/**
 * @entity User
 * @description Representa um usuário do sistema
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error("Email inválido");
    }
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
```

#### 1.2 Criar Repository Interface

```typescript
// src/domain/repositories/UserRepository.ts
import { User } from "../entities/User";

/**
 * @interface UserRepository
 * @description Contrato para acesso a dados de usuários
 */
export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
}
```

#### 1.3 Criar UseCase

```typescript
// src/domain/usecases/GetAllUsersUseCase.ts
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

/**
 * @usecase GetAllUsersUseCase
 * @description Busca todos os usuários
 */
export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
```

### Passo 2: Data Layer

#### 2.1 Criar Model

```typescript
// src/data/models/UserModel.ts

/**
 * @model UserModel
 * @description Dados de usuário vindos da API
 */
export interface UserModel {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO string
}
```

#### 2.2 Criar Remote DataSource

```typescript
// src/data/datasources/remote/UserRemoteDataSource.ts
import { UserModel } from "../models/UserModel";

/**
 * @datasource UserRemoteDataSource
 * @description Acessa API de usuários
 */
export class UserRemoteDataSource {
  private baseUrl = "https://jsonplaceholder.typicode.com";

  async getUsers(): Promise<UserModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      const data = await response.json();

      // Mapeia para nosso modelo
      return data.map((user: any) => ({
        id: String(user.id),
        name: user.name,
        email: user.email,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      throw new Error("Falha ao buscar usuários");
    }
  }

  async getUser(id: string): Promise<UserModel | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);
      if (response.status === 404) return null;

      const user = await response.json();
      return {
        id: String(user.id),
        name: user.name,
        email: user.email,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error("Falha ao buscar usuário");
    }
  }
}
```

#### 2.3 Implementar Repository

```typescript
// src/data/repositories/UserRepositoryImpl.ts
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserRemoteDataSource } from "../datasources/remote/UserRemoteDataSource";
import { UserModel } from "../models/UserModel";

/**
 * @repository UserRepositoryImpl
 * @description Implementação do repositório de usuários
 */
export class UserRepositoryImpl implements UserRepository {
  constructor(private remoteDataSource: UserRemoteDataSource) {}

  async findAll(): Promise<User[]> {
    const models = await this.remoteDataSource.getUsers();
    return models.map(this.modelToEntity);
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.remoteDataSource.getUser(id);
    if (!model) return null;
    return this.modelToEntity(model);
  }

  private modelToEntity(model: UserModel): User {
    return new User(
      model.id,
      model.name,
      model.email,
      new Date(model.createdAt),
    );
  }
}
```

### Passo 3: Presentation Layer

#### 3.1 Criar Hook

```typescript
// src/presentation/hooks/useGetUsers.ts
import { useState, useEffect } from "react";
import { User } from "@/domain/entities/User";
import { GetAllUsersUseCase } from "@/domain/usecases/GetAllUsersUseCase";
import { UserRepositoryImpl } from "@/data/repositories/UserRepositoryImpl";
import { UserRemoteDataSource } from "@/data/datasources/remote/UserRemoteDataSource";

/**
 * @hook useGetUsers
 * @description Hook para buscar lista de usuários
 */
export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Instancia dependências
      const dataSource = new UserRemoteDataSource();
      const repository = new UserRepositoryImpl(dataSource);
      const useCase = new GetAllUsersUseCase(repository);

      // Executa use case
      const result = await useCase.execute();
      setUsers(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};
```

#### 3.2 Criar Component (Card)

```typescript
// src/presentation/components/UserCard/UserCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User } from '@/domain/entities/User';

interface UserCardProps {
  user: User;
  onPress?: () => void;
}

/**
 * @component UserCard
 * @description Card para exibir informações de usuário
 */
export const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200"
    >
      <Text className="text-lg font-semibold text-gray-900">
        {user.name}
      </Text>
      <Text className="text-sm text-gray-600 mt-1">
        {user.email}
      </Text>
    </TouchableOpacity>
  );
};
```

```typescript
// src/presentation/components/UserCard/index.ts
export { UserCard } from "./UserCard";
```

#### 3.3 Criar Screen

```typescript
// src/presentation/screens/UserListScreen.tsx
import React from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUsers } from '@/presentation/hooks/useGetUsers';
import { UserCard } from '@/presentation/components/UserCard';

/**
 * @screen UserListScreen
 * @description Tela que lista todos os usuários
 */
export const UserListScreen = () => {
  const { users, loading, error, refetch } = useGetUsers();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2196f3" />
        <Text className="mt-4 text-gray-600">Carregando usuários...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-red-500 text-center mb-4">{error.message}</Text>
        <TouchableOpacity
          onPress={refetch}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Tentar Novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Usuários</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {users.length} usuários encontrados
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => console.log('User pressed:', item.id)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500">Nenhum usuário encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
```

#### 3.4 Atualizar App

```typescript
// src/index.tsx
import React from 'react';
import { UserListScreen } from './presentation/screens/UserListScreen';

const ControlApp = () => {
  return <UserListScreen />;
};

export default ControlApp;
```

## 🎉 Pronto!

Você criou sua primeira feature completa seguindo Clean Architecture!

### O que você fez:

- ✅ Criou uma Entity com validações
- ✅ Definiu um Repository Interface (contrato)
- ✅ Implementou um UseCase
- ✅ Criou um Model (DTO)
- ✅ Implementou um DataSource (API)
- ✅ Implementou o Repository
- ✅ Criou um Custom Hook
- ✅ Criou um Component
- ✅ Criou uma Screen

## 🚀 Próximos Passos

### 1. Adicionar Navegação

- Instalar React Navigation (já está no projeto)
- Criar arquivo de tipos de navegação
- Configurar Stack Navigator
- Adicionar screen de detalhes

### 2. Adicionar Estado Global (Opcional)

- Context API para auth
- Zustand ou Redux para estado complexo

### 3. Adicionar Testes

```typescript
// src/domain/usecases/__tests__/GetAllUsersUseCase.test.ts
describe("GetAllUsersUseCase", () => {
  it("should return all users", async () => {
    // test implementation
  });
});
```

### 4. Melhorar UX

- Pull to refresh
- Loading skeleton
- Animações
- Dark mode

## 📚 Continue Aprendendo

- [Documentação Completa](./INDEX.md)
- [Arquitetura](./ARCHITECTURE.md)
- [Templates](./TEMPLATES.md)

## 💡 Dicas Importantes

1. **Sempre comece pelo Domain** - Defina as regras de negócio primeiro
2. **Use TypeScript rigorosamente** - Aproveite a tipagem forte
3. **Documente conforme desenvolve** - Use os templates fornecidos
4. **Teste cada camada** - Testes facilitam manutenção
5. **Mantenha componentes pequenos** - Single Responsibility Principle

## 🆘 Problemas Comuns

### Erro de Import

```typescript
// Use caminhos absolutos com @/
import { User } from "@/domain/entities/User";
```

### Entity não valida

```typescript
// Sempre valide no construtor
constructor(...) {
  this.validate();
}
```

### Hook não atualiza

```typescript
// Certifique-se de usar useState e useEffect corretamente
const [data, setData] = useState([]);
useEffect(() => {
  /* fetch */
}, []);
```

---

**Parabéns! 🎉 Você está pronto para desenvolver com Clean Architecture!**
