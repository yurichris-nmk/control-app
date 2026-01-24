# 🏛️ Entities (Entidades)

## 📝 Descrição

**Entidades** são objetos de domínio que representam conceitos fundamentais do negócio. Elas encapsulam as regras de negócio mais críticas e são independentes de qualquer framework ou tecnologia.

## 🎯 O que é uma Entity?

Uma entidade é:

- Um objeto com identidade única
- Contém atributos e comportamentos
- Encapsula regras de negócio
- Independente de persistência
- Imutável ou com mutações controladas

## 📁 Estrutura

```
entities/
├── User.ts              # Entidade de usuário
├── Product.ts           # Entidade de produto
├── Order.ts             # Entidade de pedido
└── valueObjects/        # Value Objects (opcional)
    ├── Email.ts
    ├── Money.ts
    └── Address.ts
```

## ✅ Anatomia de uma Entity

### Entity Simples

```typescript
// User.ts

/**
 * @entity User
 * @description Representa um usuário do sistema
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly isActive: boolean = true,
  ) {
    this.validate();
  }

  /**
   * Valida os dados do usuário
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error("Email inválido");
    }
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verifica se o usuário é administrador
   */
  public isAdmin(): boolean {
    return this.email.endsWith("@admin.com");
  }

  /**
   * Cria um novo usuário com dados atualizados
   */
  public update(data: Partial<Omit<User, "id" | "createdAt">>): User {
    return new User(
      this.id,
      data.name ?? this.name,
      data.email ?? this.email,
      this.createdAt,
      data.isActive ?? this.isActive,
    );
  }

  /**
   * Converte para objeto simples
   */
  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      isActive: this.isActive,
    };
  }
}
```

### Entity com Relacionamentos

```typescript
// Order.ts
import { User } from "./User";
import { Product } from "./Product";

/**
 * @entity Order
 * @description Representa um pedido
 */
export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.items.length === 0) {
      throw new Error("Pedido deve ter pelo menos um item");
    }
  }

  /**
   * Calcula o total do pedido
   */
  public getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  /**
   * Verifica se o pedido pode ser cancelado
   */
  public canBeCancelled(): boolean {
    return this.status === "pending" || this.status === "processing";
  }

  /**
   * Cancela o pedido
   */
  public cancel(): Order {
    if (!this.canBeCancelled()) {
      throw new Error("Pedido não pode ser cancelado");
    }

    return new Order(
      this.id,
      this.userId,
      this.items,
      "cancelled",
      this.createdAt,
    );
  }
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
```

### Value Object

```typescript
// valueObjects/Email.ts

/**
 * @valueObject Email
 * @description Value Object para email
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Email inválido");
    }
    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public getDomain(): string {
    return this.value.split("@")[1];
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
```

```typescript
// valueObjects/Money.ts

/**
 * @valueObject Money
 * @description Value Object para valores monetários
 */
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = "BRL",
  ) {
    if (amount < 0) {
      throw new Error("Valor não pode ser negativo");
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  public multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error("Moedas diferentes não podem ser combinadas");
    }
  }

  public format(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: this.currency,
    }).format(this.amount);
  }

  public equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

## 🔧 Entity vs Value Object

### Entity

- Tem identidade única (ID)
- Pode mudar ao longo do tempo
- Comparado por ID
- Exemplo: User, Order, Product

### Value Object

- Sem identidade própria
- Imutável
- Comparado por valor
- Exemplo: Email, Money, Address

## ✅ Boas Práticas

### DO ✅

- Valide dados no construtor
- Use readonly para imutabilidade
- Implemente métodos de negócio
- Use TypeScript para garantir tipos
- Crie Value Objects para conceitos importantes
- Documente regras de negócio
- Implemente métodos `equals` e `toJSON`

### DON'T ❌

- Não coloque lógica de persistência
- Não faça chamadas HTTP
- Não dependa de frameworks
- Não exponha setters (prefira criar novas instâncias)
- Não misture responsabilidades

## 🧪 Testes

```typescript
// User.test.ts
describe("User Entity", () => {
  it("should create a valid user", () => {
    const user = new User(
      "1",
      "João Silva",
      "joao@example.com",
      new Date(),
      true,
    );

    expect(user.id).toBe("1");
    expect(user.name).toBe("João Silva");
  });

  it("should throw error for invalid email", () => {
    expect(() => {
      new User("1", "João", "invalid-email", new Date());
    }).toThrow("Email inválido");
  });

  it("should identify admin user", () => {
    const admin = new User("1", "Admin", "admin@admin.com", new Date());
    expect(admin.isAdmin()).toBe(true);
  });

  it("should update user data immutably", () => {
    const user = new User("1", "João", "joao@example.com", new Date());
    const updated = user.update({ name: "João Silva" });

    expect(user.name).toBe("João");
    expect(updated.name).toBe("João Silva");
    expect(user.id).toBe(updated.id);
  });
});
```

## 📝 Template de Documentação

```typescript
/**
 * @entity EntityName
 * @description Breve descrição da entidade
 *
 * @businessRules
 * - Regra 1: Descrição
 * - Regra 2: Descrição
 *
 * @invariants
 * - Invariante 1
 * - Invariante 2
 *
 * @example
 * const entity = new EntityName('id', 'data');
 */
```

## 📚 Padrões Comuns

### Aggregate Root

Entidade principal que garante consistência

```typescript
export class ShoppingCart {
  private items: CartItem[] = [];

  public addItem(product: Product, quantity: number): void {
    // Lógica de validação
    const existing = this.items.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }
  }

  public getTotal(): Money {
    // Calcula total
  }
}
```

### Factory Method

Para criação complexa

```typescript
export class User {
  static createNewUser(name: string, email: string): User {
    return new User(generateId(), name, email, new Date(), true);
  }
}
```

## 🔗 Ver Também

- [UseCases](../usecases/README.md)
- [Repositories](../repositories/README.md)
- [Models](../../data/models/README.md)
