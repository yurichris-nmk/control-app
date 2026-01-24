# 📖 Documentação - Sumário Executivo

## 🎯 Visão Geral Rápida

Este projeto implementa **Clean Architecture** em React Native com Expo, organizado em 5 camadas principais.

## 📊 Estrutura em 30 segundos

```
src/
├── presentation/   → 🎨 O que o usuário vê
├── domain/         → 💼 Regras de negócio
├── data/           → 💾 Como os dados são acessados
├── infrastructure/ → 🏗️ Detalhes técnicos (API, Storage)
└── shared/         → 🔄 Código usado em todo lugar
```

## 🚀 3 Documentos Essenciais

1. **[QUICK-START.md](./QUICK-START.md)** ⚡
   - Crie sua primeira feature em 10 minutos
   - Código completo de exemplo
   - Passo a passo detalhado

2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🏗️
   - Entenda a arquitetura completa
   - Diagramas e fluxos
   - Princípios SOLID

3. **[TEMPLATES.md](./TEMPLATES.md)** 📝
   - Templates prontos para copiar
   - Documentação padronizada
   - Para cada tipo de código

## 📚 Navegação por Tarefa

| Quero...                    | Consulte...                                            |
| --------------------------- | ------------------------------------------------------ |
| Criar uma tela              | [Screens](../src/presentation/screens/README.md)       |
| Criar um componente         | [Components](../src/presentation/components/README.md) |
| Adicionar lógica de negócio | [UseCases](../src/domain/usecases/README.md)           |
| Integrar com API            | [DataSources](../src/data/datasources/README.md)       |
| Criar função utilitária     | [Utils](../src/shared/utils/README.md)                 |
| Configurar navegação        | [Navigation](../src/presentation/navigation/README.md) |

## 🗺️ Mapa Completo

```
docs/
├── INDEX.md          → 📑 Índice completo com todos os links
├── QUICK-START.md    → ⚡ Comece aqui!
├── ARCHITECTURE.md   → 🏗️ Arquitetura detalhada
└── TEMPLATES.md      → 📝 Templates de documentação

src/
├── presentation/     → 🎨 Interface do Usuário
│   ├── screens/      → Telas completas
│   ├── components/   → Componentes reutilizáveis
│   ├── hooks/        → Custom hooks
│   └── navigation/   → Rotas e navegação
│
├── domain/           → 💼 Regras de Negócio
│   ├── entities/     → Objetos de negócio
│   ├── usecases/     → Casos de uso
│   └── repositories/ → Interfaces (contratos)
│
├── data/             → 💾 Acesso a Dados
│   ├── repositories/ → Implementações
│   ├── datasources/  → Fontes de dados (API/Local)
│   └── models/       → DTOs (Data Transfer Objects)
│
├── infrastructure/   → 🏗️ Infraestrutura
│   ├── api/          → Cliente HTTP
│   ├── storage/      → Armazenamento local
│   └── services/     → Serviços externos
│
└── shared/           → 🔄 Compartilhado
    ├── constants/    → Constantes
    ├── utils/        → Funções utilitárias
    ├── types/        → Tipos TypeScript
    └── theme/        → Cores, fontes, etc
```

## 💡 Regra de Ouro

> **Sempre comece pelo Domain (regras de negócio), depois Data (acesso a dados), e por último Presentation (UI)**

## 🔄 Fluxo de Desenvolvimento

```
1. Entity     →  O que é?
2. UseCase    →  O que faz?
3. Repository →  Como pega/salva?
4. Model      →  Como vem da API?
5. DataSource →  De onde vem?
6. Hook       →  Como a UI usa?
7. Screen     →  Onde aparece?
```

## 📖 Leitura Recomendada

### Para Começar (30 min)

1. Leia [QUICK-START.md](./QUICK-START.md)
2. Siga o exemplo prático
3. Crie sua primeira feature

### Para Aprofundar (1h)

1. Leia [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Entenda cada camada
3. Veja os diagramas

### Para Documentar

1. Use [TEMPLATES.md](./TEMPLATES.md)
2. Documente conforme desenvolve
3. Mantenha atualizado

## ✅ Checklist do Desenvolvedor

### Ao Começar um Projeto

- [ ] Ler QUICK-START.md
- [ ] Ler ARCHITECTURE.md
- [ ] Entender as 5 camadas
- [ ] Rodar o projeto localmente

### Ao Criar uma Feature

- [ ] Definir Entity (Domain)
- [ ] Criar UseCase (Domain)
- [ ] Definir Repository Interface (Domain)
- [ ] Criar Model (Data)
- [ ] Criar DataSource (Data)
- [ ] Implementar Repository (Data)
- [ ] Criar Hook (Presentation)
- [ ] Criar Components (Presentation)
- [ ] Criar Screen (Presentation)
- [ ] Documentar tudo
- [ ] Escrever testes

### Ao Fazer Code Review

- [ ] Separação de camadas correta?
- [ ] Domain independente?
- [ ] Documentação presente?
- [ ] Testes implementados?
- [ ] Código limpo e legível?

## 🎓 Conceitos-Chave

- **Entity**: Objeto de negócio com identidade e regras
- **UseCase**: Uma ação específica que o sistema pode fazer
- **Repository**: Contrato para acessar dados
- **Model (DTO)**: Estrutura de dados da API
- **DataSource**: Fonte de dados (API, Storage)
- **Hook**: Conecta UI aos UseCases
- **Component**: Pedaço reutilizável de UI
- **Screen**: Tela completa da aplicação

## 🆘 Precisa de Ajuda?

1. **Conceito não entendido?**
   → Leia [ARCHITECTURE.md](./ARCHITECTURE.md)

2. **Como criar algo?**
   → Veja [QUICK-START.md](./QUICK-START.md)

3. **Como documentar?**
   → Use [TEMPLATES.md](./TEMPLATES.md)

4. **Onde encontrar algo?**
   → Consulte [INDEX.md](./INDEX.md)

## 📞 Recursos Adicionais

- **README Principal**: `/README.md`
- **Índice Completo**: `/docs/INDEX.md`
- **Cada diretório tem README**: Explore!

## 🎯 TL;DR (Too Long; Didn't Read)

1. Leia [QUICK-START.md](./QUICK-START.md)
2. Siga o exemplo
3. Use os [TEMPLATES.md](./TEMPLATES.md)
4. Consulte [INDEX.md](./INDEX.md) quando precisar

---

**Última atualização**: 24/01/2026

**Próximo passo**: Abra [QUICK-START.md](./QUICK-START.md) e crie sua primeira feature! 🚀
