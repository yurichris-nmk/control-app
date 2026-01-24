# 📚 Índice Completo da Documentação

Este documento contém links para toda a documentação do projeto.

## 🏠 Documentação Principal

- [README Principal](../README.md) - Visão geral e início rápido
- [Arquitetura](./ARCHITECTURE.md) - Arquitetura limpa detalhada
- [Templates](./TEMPLATES.md) - Templates de documentação

## 🎨 Presentation Layer

### Visão Geral

- [Presentation](../src/presentation/README.md) - Camada de apresentação

### Subdiretórios

- [Screens](../src/presentation/screens/README.md) - Telas da aplicação
- [Components](../src/presentation/components/README.md) - Componentes reutilizáveis
- [Hooks](../src/presentation/hooks/README.md) - Custom hooks
- [Navigation](../src/presentation/navigation/README.md) - Navegação
- [Store](../src/presentation/store/README.md) - Gerenciamento de Estado Global
  - [Zustand](../src/presentation/store/zustand/README.md) - Stores Zustand
  - [Context API](../src/presentation/store/context/README.md) - Contexts React

## 💼 Domain Layer

### Visão Geral

- [Domain](../src/domain/README.md) - Camada de domínio

### Subdiretórios

- [Entities](../src/domain/entities/README.md) - Entidades de negócio
- [UseCases](../src/domain/usecases/README.md) - Casos de uso
- [Repositories](../src/domain/repositories/README.md) - Interfaces de repositórios

## 💾 Data Layer

### Visão Geral

- [Data](../src/data/README.md) - Camada de dados

### Subdiretórios

- [Repositories](../src/data/repositories/README.md) - Implementações de repositórios
- [DataSources](../src/data/datasources/README.md) - Fontes de dados
- [Models](../src/data/models/README.md) - Modelos de dados (DTOs)

## 🏗️ Infrastructure Layer

### Visão Geral

- [Infrastructure](../src/infrastructure/README.md) - Camada de infraestrutura

### Subdiretórios

- [API](../src/infrastructure/api/README.md) - Cliente de API
- [Storage](../src/infrastructure/storage/README.md) - Armazenamento local
- [Services](../src/infrastructure/services/README.md) - Serviços externos

## 🔄 Shared Layer

### Visão Geral

- [Shared](../src/shared/README.md) - Código compartilhado

### Subdiretórios

- [Constants](../src/shared/constants/README.md) - Constantes
- [Utils](../src/shared/utils/README.md) - Funções utilitárias
- [Types](../src/shared/types/README.md) - Tipos TypeScript globais
- [Theme](../src/shared/theme/README.md) - Tema da aplicação

## 🗺️ Mapa de Navegação Rápida

### Por Tarefa

#### Criar uma Nova Tela

1. [Screens](../src/presentation/screens/README.md) - Como criar screens
2. [Navigation](../src/presentation/navigation/README.md) - Adicionar rota
3. [Templates](./TEMPLATES.md) - Template de screen

#### Criar um Componente

1. [Components](../src/presentation/components/README.md) - Como criar componentes
2. [Theme](../src/shared/theme/README.md) - Usar tema
3. [Templates](./TEMPLATES.md) - Template de component

#### Adicionar Lógica de Negócio

1. [Entities](../src/domain/entities/README.md) - Criar entidade
2. [UseCases](../src/domain/usecases/README.md) - Criar use case
3. [Repositories](../src/domain/repositories/README.md) - Definir interface
4. [Templates](./TEMPLATES.md) - Templates de domain

#### Integrar com API

1. [Models](../src/data/models/README.md) - Criar model
2. [DataSources](../src/data/datasources/README.md) - Criar datasource
3. [Repositories](../src/data/repositories/README.md) - Implementar repository
4. [API](../src/infrastructure/api/README.md) - Configurar API client

#### Criar Utilitário

1. [Utils](../src/shared/utils/README.md) - Adicionar função
2. [Constants](../src/shared/constants/README.md) - Adicionar constantes
3. [Types](../src/shared/types/README.md) - Adicionar tipos

## 📊 Fluxo de Dados

```
User Interaction (Presentation)
        ↓
    Screen/Component
        ↓
    Custom Hook
        ↓
    UseCase (Domain)
        ↓
    Repository Interface (Domain)
        ↓
    Repository Implementation (Data)
        ↓
    DataSource (Data)
        ↓
    API/Storage (Infrastructure)
```

## 🔍 Busca Rápida

### Conceitos

- **Clean Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **SOLID**: [ARCHITECTURE.md](./ARCHITECTURE.md#princípios-solid)
- **Camadas**: [ARCHITECTURE.md](./ARCHITECTURE.md#estrutura-de-diretórios)

### Componentes UI

- **Screens**: [Screens README](../src/presentation/screens/README.md)
- **Components**: [Components README](../src/presentation/components/README.md)
- **Navigation**: [Navigation README](../src/presentation/navigation/README.md)

### Lógica de Negócio

- **Entities**: [Entities README](../src/domain/entities/README.md)
- **UseCases**: [UseCases README](../src/domain/usecases/README.md)
- **Business Rules**: [UseCases README](../src/domain/usecases/README.md)

### Acesso a Dados

- **API**: [API README](../src/infrastructure/api/README.md)
- **Storage**: [Storage README](../src/infrastructure/storage/README.md)
- **Models**: [Models README](../src/data/models/README.md)
- **DataSources**: [DataSources README](../src/data/datasources/README.md)

### Utilitários

- **Utils**: [Utils README](../src/shared/utils/README.md)
- **Constants**: [Constants README](../src/shared/constants/README.md)
- **Theme**: [Theme README](../src/shared/theme/README.md)

## 📖 Guias de Estilo

### Nomenclatura

- **PascalCase**: Components, Classes, Types
- **camelCase**: functions, variables, hooks
- **SCREAMING_SNAKE_CASE**: CONSTANTS

### Estrutura de Arquivos

- Um componente por arquivo
- Agrupar arquivos relacionados em pastas
- README.md em cada diretório importante

### Documentação

- Use TSDoc para inline docs
- README.md para visão geral de diretórios
- Exemplos de código sempre que possível

## ✅ Checklist de Desenvolvimento

### Ao Criar Nova Feature

- [ ] Definir Entity no Domain
- [ ] Criar UseCase no Domain
- [ ] Definir Repository Interface no Domain
- [ ] Criar Model no Data
- [ ] Criar DataSource no Data
- [ ] Implementar Repository no Data
- [ ] Criar Hook no Presentation
- [ ] Criar Components necessários
- [ ] Criar Screen
- [ ] Adicionar rota na Navigation
- [ ] Documentar tudo com templates
- [ ] Escrever testes

## 🎯 Próximos Passos

Depois de ler a documentação:

1. **Explore o código**: Veja os exemplos em cada README
2. **Crie uma feature**: Siga o fluxo sugerido
3. **Documente**: Use os templates fornecidos
4. **Teste**: Implemente testes para seu código

## 💡 Dicas

- Comece pelo Domain (regras de negócio)
- Mantenha cada camada independente
- Documente conforme desenvolve
- Use TypeScript rigorosamente
- Siga os princípios SOLID
- Teste cada camada isoladamente

## 📞 Ajuda

Se tiver dúvidas:

1. Consulte o README específico da camada
2. Veja os exemplos de código
3. Confira os templates de documentação
4. Revise a arquitetura geral

---

**Última atualização**: 24/01/2026
