# 🧩 Components (Componentes)

## 📝 Descrição

Este diretório contém **componentes reutilizáveis** da UI que podem ser usados em múltiplas screens e contextos.

## 🎯 O que é um Component?

Um componente é um pedaço reutilizável de UI que:

- Pode ser usado em várias partes da aplicação
- Recebe dados via props
- É independente e isolado
- Não conhece o contexto onde será usado

## 📁 Estrutura de Organização

### Opção 1: Por Categoria

```
components/
├── common/           # Componentes genéricos
│   ├── Button/
│   ├── Input/
│   └── Card/
├── layout/           # Componentes de layout
│   ├── Header/
│   ├── Footer/
│   └── Container/
└── feature/          # Componentes específicos
    ├── ProductCard/
    └── UserAvatar/
```

### Opção 2: Atomic Design

```
components/
├── atoms/           # Componentes básicos
│   ├── Button/
│   ├── Text/
│   └── Icon/
├── molecules/       # Combinação de átomos
│   ├── SearchBar/
│   └── FormField/
└── organisms/       # Seções complexas
    ├── Header/
    └── ProductList/
```

## 📋 Convenções de Nomenclatura

- **PascalCase** para pastas e arquivos: `Button/`, `Button.tsx`
- Nome claro e descritivo
- Cada componente em sua própria pasta
- Arquivo index.tsx para facilitar imports

### Estrutura de um Componente

```
Button/
├── Button.tsx           # Componente principal
├── Button.styles.ts     # Estilos (se não usar Tailwind inline)
├── Button.test.tsx      # Testes
├── Button.types.ts      # Tipos TypeScript
├── README.md            # Documentação do componente
└── index.ts             # Export
```

## ✅ Anatomia de um Component

```tsx
// Button/Button.tsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { ButtonProps } from "./Button.types";

/**
 * @component Button
 * @description Botão reutilizável com suporte a loading e variantes
 * @example
 * <Button
 *   title="Clique aqui"
 *   onPress={() => {}}
 *   variant="primary"
 * />
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        px-4 py-3 rounded-lg
        ${variant === "primary" ? "bg-blue-500" : "bg-gray-500"}
        ${disabled ? "opacity-50" : ""}
      `}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold text-center">{title}</Text>
      )}
    </TouchableOpacity>
  );
};
```

```typescript
// Button/Button.types.ts
import { TouchableOpacityProps } from "react-native";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
}
```

```typescript
// Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button.types";
```

## 🔧 Tipos de Componentes

### 1. Componentes de Apresentação (Dumb Components)

- Apenas recebem props e renderizam
- Não têm estado interno (ou muito pouco)
- Não fazem chamadas de dados
- Altamente reutilizáveis

```tsx
export const Card: React.FC<CardProps> = ({ title, content, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
      <Text>{content}</Text>
    </TouchableOpacity>
  );
};
```

### 2. Componentes Container (Smart Components)

- Gerenciam estado
- Conectam-se a hooks de dados
- Coordenam componentes de apresentação
- Geralmente ficam em screens/

## 📝 Template de Documentação

```markdown
# ComponentName

## Descrição

Breve descrição do componente e seu propósito.

## Props

| Prop    | Tipo                     | Obrigatório | Default   | Descrição              |
| ------- | ------------------------ | ----------- | --------- | ---------------------- |
| title   | string                   | Sim         | -         | Título exibido         |
| onPress | function                 | Sim         | -         | Callback ao pressionar |
| variant | 'primary' \| 'secondary' | Não         | 'primary' | Estilo visual          |

## Exemplos

### Uso Básico

\`\`\`tsx
<Button title="Salvar" onPress={handleSave} />
\`\`\`

### Com Loading

\`\`\`tsx
<Button title="Carregando..." loading={true} />
\`\`\`

## Acessibilidade

- Suporta leitores de tela
- Feedback tátil ao pressionar

## Notas

Qualquer informação adicional relevante.
```

## ✅ Boas Práticas

### DO ✅

- Mantenha componentes pequenos e focados
- Use TypeScript para definir props
- Documente props e exemplos
- Implemente testes
- Use nomes descritivos
- Torne componentes acessíveis
- Use composição de componentes

### DON'T ❌

- Não adicione lógica de negócio
- Não faça chamadas de API
- Não acople a contextos específicos
- Não use estados globais diretamente
- Não crie componentes muito grandes

## 🧪 Testes

```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test" onPress={onPress} />
    );

    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button title="Test" onPress={() => {}} loading />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

## 📚 Componentes Comuns

Componentes que toda aplicação geralmente precisa:

- **Button** - Botões de ação
- **Input** - Campos de texto
- **Card** - Cartões de conteúdo
- **Avatar** - Imagens de perfil
- **Badge** - Indicadores pequenos
- **Modal** - Janelas modais
- **Loading** - Indicadores de carregamento
- **ErrorBoundary** - Tratamento de erros
- **Empty** - Estados vazios
- **Header** - Cabeçalhos

## 🔗 Ver Também

- [Screens](../screens/README.md)
- [Hooks](../hooks/README.md)
- [Theme](../../shared/theme/README.md)
