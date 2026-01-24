# 🎨 Theme (Tema da Aplicação)

## 📝 Descrição

Configurações de tema: cores, tipografia, espaçamentos, etc.

## ✅ Exemplo de Theme

### Colors

```typescript
// colors.ts

/**
 * @theme Colors
 * @description Paleta de cores da aplicação
 */
export const colors = {
  // Cores principais
  primary: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3", // cor base
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },

  // Cores secundárias
  secondary: {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
  },

  // Cores de feedback
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Tons de cinza
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  // Cores de texto
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#bdbdbd",
    inverse: "#ffffff",
  },

  // Cores de fundo
  background: {
    default: "#ffffff",
    paper: "#f5f5f5",
    dark: "#121212",
  },

  // Transparências
  transparent: "transparent",
  black: "#000000",
  white: "#ffffff",
} as const;

export type ThemeColors = typeof colors;
```

### Typography

```typescript
// typography.ts

/**
 * @theme Typography
 * @description Configurações de tipografia
 */
export const typography = {
  fonts: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;
```

### Spacing

```typescript
// spacing.ts

/**
 * @theme Spacing
 * @description Sistema de espaçamento
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/**
 * Helper para acessar spacing
 */
export const space = (value: keyof typeof spacing): number => spacing[value];
```

### Borders

```typescript
// borders.ts

/**
 * @theme Borders
 * @description Configurações de bordas
 */
export const borders = {
  radius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  width: {
    thin: 1,
    base: 2,
    thick: 4,
  },
} as const;
```

### Shadows

```typescript
// shadows.ts

/**
 * @theme Shadows
 * @description Sombras da aplicação
 */
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;
```

### Theme Index

```typescript
// index.ts
import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { borders } from "./borders";
import { shadows } from "./shadows";

/**
 * @theme Theme
 * @description Tema completo da aplicação
 */
export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
} as const;

export type Theme = typeof theme;

// Exports individuais
export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./borders";
export * from "./shadows";
```

## 📝 Uso com Tailwind (NativeWind)

```typescript
// tailwind.config.js
import { colors, spacing, borders } from "./src/shared/theme";

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: colors,
      spacing: spacing,
      borderRadius: borders.radius,
    },
  },
};
```

## 📝 Uso em Componentes

```tsx
import { colors, spacing } from "@/shared/theme";

export const Button = () => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary[500],
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[6],
        borderRadius: borders.radius.base,
      }}
    >
      <Text style={{ color: colors.white }}>Button</Text>
    </TouchableOpacity>
  );
};
```

## 🔗 Ver Também

- [Components](../../presentation/components/README.md)
