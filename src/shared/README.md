# 🔄 Shared (Código Compartilhado)

## 📝 Descrição

A camada **Shared** contém código que pode ser usado por **todas as outras camadas**. São utilitários, constantes, tipos e configurações compartilhadas.

## 🎯 Princípios

- **Reutilizável**: Código usado em múltiplas camadas
- **Sem dependências**: Não depende de outras camadas
- **Genérico**: Funcionalidades de propósito geral
- **Agnóstico**: Não conhece regras de negócio específicas

## 📂 Estrutura

```
shared/
├── constants/     # Constantes da aplicação
├── utils/         # Funções utilitárias
├── types/         # Tipos TypeScript globais
└── theme/         # Tema (cores, fontes, espaçamentos)
```

## 🔧 Responsabilidades

### ✅ O que Shared DEVE ter:

- Constantes (URLs, chaves, etc)
- Funções utilitárias puras
- Tipos TypeScript comuns
- Configurações de tema
- Helpers de formatação
- Validadores genéricos

### ❌ O que Shared NÃO deve ter:

- Regras de negócio
- Componentes React
- Hooks
- Lógica de acesso a dados
- Código específico de features

## 🔗 Dependências

- NÃO pode usar: Nenhuma outra camada

## 📚 Subdiretórios

### [constants/](./constants/README.md)

Constantes da aplicação

### [utils/](./utils/README.md)

Funções utilitárias

### [types/](./types/README.md)

Tipos TypeScript globais

### [theme/](./theme/README.md)

Configurações de tema

## ✅ Boas Práticas

- Mantenha funções puras (sem side effects)
- Documente bem os utilitários
- Use TypeScript para tipagem forte
- Teste funções utilitárias
- Não crie dependências entre shared modules

## 🔗 Ver Também

- Pode ser usado por todas as camadas
