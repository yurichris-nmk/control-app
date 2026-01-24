# 🛠️ Utils (Utilitários)

## 📝 Descrição

Funções utilitárias puras e reutilizáveis.

## ✅ Exemplos

### Date Utils

```typescript
// date.utils.ts

/**
 * Formata data para string legível
 */
export function formatDate(
  date: Date,
  format: "short" | "long" = "short",
): string {
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" };

  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}

/**
 * Calcula diferença entre datas em dias
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se a data é hoje
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
```

### String Utils

```typescript
// string.utils.ts

/**
 * Capitaliza primeira letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Trunca string com ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Remove acentos
 */
export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Gera slug de uma string
 */
export function slugify(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

### Number Utils

```typescript
// number.utils.ts

/**
 * Formata número como moeda
 */
export function formatCurrency(
  value: number,
  currency: string = "BRL",
): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formata número com separadores
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/**
 * Arredonda para N casas decimais
 */
export function round(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamp valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

### Validation Utils

```typescript
// validation.utils.ts
import { REGEX_PATTERNS } from "@/shared/constants/regex";

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

/**
 * Valida senha forte
 */
export function isStrongPassword(password: string): boolean {
  return REGEX_PATTERNS.PASSWORD_STRONG.test(password);
}
```

### Array Utils

```typescript
// array.utils.ts

/**
 * Remove duplicados de array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Agrupa array por chave
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Divide array em chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
```

### Async Utils

```typescript
// async.utils.ts

/**
 * Sleep/delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry com exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(delay * Math.pow(2, attempt - 1));
    }
  }
  throw new Error("Max attempts reached");
}

/**
 * Timeout para promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeoutMs),
    ),
  ]);
}
```

## ✅ Boas Práticas

- Mantenha funções puras (sem side effects)
- Use TypeScript com tipagem forte
- Documente parâmetros e retornos
- Escreva testes para cada função
- Use nomes descritivos

## 🧪 Testes

```typescript
// string.utils.test.ts
describe("capitalize", () => {
  it("should capitalize first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("HELLO")).toBe("Hello");
  });
});
```

## 🔗 Ver Também

- [Constants](../constants/README.md)
