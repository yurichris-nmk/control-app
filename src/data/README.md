# 💾 Data Layer (Camada de Dados)

## 📝 Descrição

A camada de **Data** é responsável pela **implementação** do acesso aos dados. Ela implementa as interfaces definidas no Domain e coordena as fontes de dados.

## 🎯 Princípios

- **Implementa contratos**: Implementa as interfaces do Domain
- **Coordena dados**: Gerencia múltiplas fontes de dados
- **Transforma dados**: Converte entre Models (DTOs) e Entities
- **Cache e persistência**: Gerencia estratégias de cache

## 📂 Estrutura

```
data/
├── repositories/   # Implementações de repositórios
├── datasources/    # Fontes de dados (API, local, etc)
└── models/         # Modelos de dados (DTOs)
```

## 🔄 Fluxo de Dados

```
UseCase (Domain)
      ↓
Repository Interface (Domain)
      ↓
Repository Implementation (Data) ← você está aqui
      ↓
DataSource (Data)
      ↓
API/Storage (Infrastructure)
```

## 🔧 Responsabilidades

### ✅ O que Data DEVE fazer:

- Implementar interfaces de repositórios
- Converter Models em Entities e vice-versa
- Coordenar múltiplas fontes de dados
- Implementar cache
- Lidar com erros de dados
- Gerenciar estratégias de sincronização

### ❌ O que Data NÃO deve fazer:

- Conter regras de negócio
- Conhecer detalhes de UI
- Implementar validações de negócio
- Ter dependências de frameworks de UI

## 🔗 Dependências

- Pode usar: `domain/`, `infrastructure/`, `shared/`
- NÃO pode usar: `presentation/`

## 📚 Subdiretórios

### [repositories/](./repositories/README.md)

Implementações concretas de repositórios

### [datasources/](./datasources/README.md)

Fontes de dados (Remote, Local)

### [models/](./models/README.md)

Modelos de dados (DTOs)

## ✅ Boas Práticas

- Mantenha separação clara entre Models e Entities
- Implemente tratamento de erros apropriado
- Use cache quando apropriado
- Teste implementações de repositórios
- Documente estratégias de dados

## 📖 Exemplo de Fluxo

```typescript
// 1. UseCase solicita dados
const user = await userRepository.findById("123");

// 2. Repository Implementation coordena
// - Verifica cache
// - Se não tem, busca do DataSource
// - Converte Model para Entity
// - Atualiza cache
// - Retorna Entity

// 3. UseCase recebe Entity do Domain
```

## 🔗 Ver Também

- [Domain Layer](../domain/README.md)
- [Infrastructure Layer](../infrastructure/README.md)
