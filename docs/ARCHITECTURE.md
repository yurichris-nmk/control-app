# 🏗️ Arquitetura do Projeto Control

## Visão Geral

Este projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), proposta por Robert C. Martin. A estrutura foi adaptada para aplicações React Native com Expo, garantindo:

- ✅ Separação clara de responsabilidades
- ✅ Independência de frameworks
- ✅ Testabilidade
- ✅ Independência de UI
- ✅ Independência de banco de dados
- ✅ Manutenibilidade e escalabilidade

## 📊 Diagrama de Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  (Screens, Components, Hooks, Navigation)               │
│  - Interface do usuário                                 │
│  - Lógica de apresentação                               │
└──────────────────┬──────────────────────────────────────┘
                   │ usa
                   ↓
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN                              │
│    (Entities, UseCases, Repository Interfaces)          │
│  - Regras de negócio                                    │
│  - Entidades de domínio                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ implementa
                   ↓
┌─────────────────────────────────────────────────────────┐
│                       DATA                               │
│    (Repositories, DataSources, Models)                  │
│  - Implementação de repositórios                        │
│  - Acesso a dados                                       │
└──────────────────┬──────────────────────────────────────┘
                   │ usa
                   ↓
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                          │
│       (API, Storage, Services)                          │
│  - Detalhes técnicos                                    │
│  - Serviços externos                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      SHARED                              │
│   (Constants, Utils, Types, Theme)                      │
│  - Código compartilhado entre camadas                   │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

1. **Usuário** interage com a **UI** (Presentation)
2. **Screen/Component** chama um **Hook** ou **UseCase**
3. **UseCase** executa a lógica de negócio usando **Entities**
4. **UseCase** solicita dados através de uma **Repository Interface** (Domain)
5. **Repository Implementation** (Data) busca dados de um **DataSource**
6. **DataSource** usa serviços de **Infrastructure** (API, Storage)
7. Os dados retornam através das camadas até a **UI**

## 📁 Estrutura de Diretórios

```
src/
├── presentation/      # Camada de Apresentação
│   ├── screens/       # Telas da aplicação
│   ├── components/    # Componentes reutilizáveis
│   ├── hooks/         # Custom Hooks
│   ├── navigation/    # Configuração de navegação
│   └── store/         # Estado Global (Zustand + Context API)
│       ├── zustand/   # Stores Zustand
│       └── context/   # Contexts React
│
├── domain/            # Camada de Domínio
│   ├── entities/      # Entidades de negócio
│   ├── usecases/      # Casos de uso
│   └── repositories/  # Interfaces de repositórios
│
├── data/              # Camada de Dados
│   ├── repositories/  # Implementação de repositórios
│   ├── datasources/   # Fontes de dados
│   └── models/        # Modelos de dados (DTOs)
│
├── infrastructure/    # Camada de Infraestrutura
│   ├── api/           # Configuração de API
│   ├── storage/       # Armazenamento local
│   └── services/      # Serviços externos
│
└── shared/            # Código compartilhado
    ├── constants/     # Constantes
    ├── utils/         # Funções utilitárias
    ├── types/         # Tipos TypeScript globais
    └── theme/         # Tema (cores, fontes, etc)
```

## 🎯 Princípios SOLID

### Single Responsibility Principle (SRP)

Cada módulo tem uma única responsabilidade bem definida.

### Open/Closed Principle (OCP)

Aberto para extensão, fechado para modificação.

### Liskov Substitution Principle (LSP)

Interfaces podem ser substituídas por suas implementações.

### Interface Segregation Principle (ISP)

Interfaces específicas são melhores que interfaces gerais.

### Dependency Inversion Principle (DIP)

Dependa de abstrações, não de implementações concretas.

## 📝 Regras de Dependência

1. **Presentation** pode depender de **Domain**
2. **Domain** NÃO depende de nenhuma outra camada
3. **Data** depende de **Domain** e **Infrastructure**
4. **Infrastructure** NÃO depende de outras camadas (exceto Shared)
5. **Shared** NÃO depende de nenhuma camada específica

## 🚀 Vantagens desta Arquitetura

- **Testabilidade**: Fácil criar testes unitários e de integração
- **Manutenibilidade**: Código organizado e fácil de entender
- **Escalabilidade**: Adicionar features sem quebrar código existente
- **Flexibilidade**: Trocar implementações sem afetar outras camadas
- **Reusabilidade**: Componentes e lógica podem ser reutilizados

## 📚 Referências

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Best Practices](https://reactnative.dev/docs/getting-started)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
