# 🎨 Presentation Layer (Camada de Apresentação)

## 📝 Descrição

A camada de **Presentation** é responsável por toda a interface do usuário e lógica de apresentação. Esta camada contém tudo que o usuário vê e interage.

## 📂 Estrutura

```
presentation/
├── screens/       # Telas da aplicação
├── components/    # Componentes reutilizáveis
├── hooks/         # Custom Hooks React
├── navigation/    # Configuração de navegação
└── store/         # Gerenciamento de Estado Global
    ├── zustand/   # Stores Zustand
    └── context/   # Contexts React
```

## ⚡ Responsabilidades

- Renderizar a interface do usuário
- Capturar interações do usuário
- Exibir dados vindos da camada de domínio
- Gerenciar estado local da UI
- Implementar navegação entre telas

## 🎯 Princípios

1. **Componentes Burros e Inteligentes**
   - Componentes burros: apenas apresentação
   - Componentes inteligentes: lógica e estado

2. **Single Responsibility**
   - Cada componente tem uma única responsabilidade

3. **Composição sobre Herança**
   - Preferir composição de componentes

4. **Props e Estado**
   - Props para dados externos
   - Estado para dados locais

## 🔗 Dependências

- Pode usar: `domain/`, `shared/`
- NÃO pode usar: `data/`, `infrastructure/`

## 📚 Subdiretórios

### [screens/](./screens/README.md)

Telas completas da aplicação

### [components/](./components/README.md)

Componentes reutilizáveis

### [hooks/](./hooks/README.md)

Custom Hooks React

### [navigation/](./navigation/README.md)

Configuração de navegação

### [store/](./store/README.md)

Gerenciamento de Estado Global (Zustand + Context API)

## ✅ Boas Práticas

- Use TypeScript para tipagem forte
- Evite lógica de negócio nesta camada
- Mantenha componentes pequenos e focados
- Use hooks customizados para lógica reutilizável
- Implemente testes para componentes críticos
- Use memo/useMemo para otimização quando necessário

## 📖 Exemplo de Uso

```tsx
// Screen usando UseCase
import { useGetUser } from "@/presentation/hooks/useGetUser";

export const ProfileScreen = () => {
  const { user, loading, error } = useGetUser();

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} />;

  return <ProfileView user={user} />;
};
```
