# 💼 Domain Layer (Camada de Domínio)

## 📝 Descrição

A camada de **Domain** é o coração da aplicação. Contém as **regras de negócio** puras, independentes de frameworks, UI ou infraestrutura.

## 🎯 Princípios

- **Independência total**: Não depende de nenhuma outra camada
- **Regras de negócio**: Contém toda a lógica de negócio
- **Entidades puras**: Objetos de domínio sem dependências externas
- **Contratos**: Define interfaces que outras camadas implementam

## 📂 Estrutura

```
domain/
├── entities/       # Entidades de negócio
├── usecases/       # Casos de uso (regras de negócio)
└── repositories/   # Interfaces de repositórios
```

## 🔧 Responsabilidades

### ✅ O que Domain DEVE fazer:

- Definir entidades de negócio
- Implementar regras de negócio
- Validar dados de domínio
- Definir contratos (interfaces)
- Orquestrar operações de negócio

### ❌ O que Domain NÃO deve fazer:

- Fazer chamadas HTTP
- Acessar banco de dados
- Conhecer detalhes de UI
- Depender de frameworks
- Ter lógica de apresentação

## 🔗 Dependências

- Pode usar: `shared/types`, `shared/utils` (apenas utilitários puros)
- NÃO pode usar: `presentation/`, `data/`, `infrastructure/`

## 📚 Subdiretórios

### [entities/](./entities/README.md)

Entidades de negócio e regras de domínio

### [usecases/](./usecases/README.md)

Casos de uso e orquestração de negócio

### [repositories/](./repositories/README.md)

Interfaces de repositórios (contratos)

## ✅ Boas Práticas

- Mantenha o domínio puro e independente
- Use TypeScript para garantir contratos
- Implemente validações no domínio
- Não exponha detalhes de implementação
- Teste extensivamente (lógica crítica)
- Use Value Objects quando apropriado

## 📖 Fluxo de Dados

```
UI (Presentation)
      ↓
UseCase (Domain)
      ↓
Repository Interface (Domain)
      ↓
Repository Implementation (Data)
      ↓
DataSource (Data/Infrastructure)
```

## 🔗 Ver Também

- [Data Layer](../data/README.md)
- [Presentation Layer](../presentation/README.md)
