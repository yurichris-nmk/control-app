# 🏗️ Infrastructure Layer (Camada de Infraestrutura)

## 📝 Descrição

A camada de **Infrastructure** contém detalhes técnicos e implementações de serviços externos. É a camada mais externa da arquitetura.

## 🎯 Princípios

- **Detalhes de Implementação**: HTTP clients, Storage, Services
- **Frameworks e Bibliotecas**: Configuração de libs externas
- **Serviços Externos**: APIs de terceiros, Analytics, etc
- **Independente do Domain**: Não conhece regras de negócio

## 📂 Estrutura

```
infrastructure/
├── api/          # Configuração de API (Axios, Fetch)
├── storage/      # Armazenamento (AsyncStorage, SQLite)
└── services/     # Serviços externos (Firebase, Analytics)
```

## 🔧 Responsabilidades

### ✅ O que Infrastructure DEVE fazer:

- Configurar clientes HTTP
- Gerenciar interceptors
- Configurar storage engines
- Integrar serviços de terceiros
- Gerenciar tokens e autenticação
- Implementar logging e analytics

### ❌ O que Infrastructure NÃO deve fazer:

- Conter regras de negócio
- Conhecer Entities do Domain
- Implementar lógica de aplicação
- Depender da camada de Presentation

## 🔗 Dependências

- Pode usar: `shared/`
- NÃO pode usar: `domain/`, `data/`, `presentation/`

## 📚 Subdiretórios

### [api/](./api/README.md)

Configuração de clientes API

### [storage/](./storage/README.md)

Configuração de armazenamento local

### [services/](./services/README.md)

Serviços externos e integrações

## ✅ Boas Práticas

- Mantenha configurações centralizadas
- Use variáveis de ambiente
- Implemente tratamento de erros global
- Configure timeouts apropriados
- Implemente retry logic quando necessário
- Log requisições em desenvolvimento

## 🔗 Ver Também

- [Data Layer](../data/README.md)
- [Shared](../shared/README.md)
