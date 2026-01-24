# ⚙️ UseCases (Casos de Uso)

## 📝 Descrição

**UseCases** (Casos de Uso) são as **regras de negócio da aplicação**. Cada UseCase representa uma ação ou operação específica que o sistema pode realizar.

## 🎯 O que é um UseCase?

Um UseCase:

- Representa uma ação específica do usuário
- Orquestra entidades e repositórios
- Contém lógica de negócio da aplicação
- É independente de UI e infraestrutura
- Retorna resultados ou lança exceções

## 📁 Estrutura

```
usecases/
├── user/
│   ├── GetUserUseCase.ts
│   ├── CreateUserUseCase.ts
│   └── UpdateUserUseCase.ts
├── auth/
│   ├── LoginUseCase.ts
│   └── LogoutUseCase.ts
└── product/
    ├── GetProductsUseCase.ts
    └── CreateOrderUseCase.ts
```

## 📋 Convenções de Nomenclatura

- **PascalCase** com sufixo "UseCase": `GetUserUseCase`
- Verbo + Substantivo: `CreateOrder`, `UpdateProfile`
- Nome claro e descritivo da ação

### Padrões Comuns

- `Get[Entity]UseCase` - Buscar
- `GetAll[Entity]UseCase` - Listar
- `Create[Entity]UseCase` - Criar
- `Update[Entity]UseCase` - Atualizar
- `Delete[Entity]UseCase` - Deletar
- `[Action][Entity]UseCase` - Ações específicas

## ✅ Anatomia de um UseCase

### UseCase Simples (Query)

```typescript
// GetUserUseCase.ts
import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";

/**
 * @usecase GetUserUseCase
 * @description Busca um usuário por ID
 *
 * @businessRules
 * - Usuário deve existir
 * - Retorna erro se não encontrado
 */
export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }
}
```

### UseCase com Validação (Command)

```typescript
// CreateUserUseCase.ts
import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";

/**
 * @usecase CreateUserUseCase
 * @description Cria um novo usuário
 *
 * @businessRules
 * - Email deve ser único
 * - Nome deve ter pelo menos 3 caracteres
 * - Email deve ser válido
 */
export interface CreateUserInput {
  name: string;
  email: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    // 1. Validar input
    this.validateInput(input);

    // 2. Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // 3. Criar entidade
    const user = new User(
      this.generateId(),
      input.name,
      input.email,
      new Date(),
      true,
    );

    // 4. Salvar no repositório
    const savedUser = await this.userRepository.create(user);

    return savedUser;
  }

  private validateInput(input: CreateUserInput): void {
    if (!input.name || input.name.trim().length < 3) {
      throw new Error("Nome deve ter pelo menos 3 caracteres");
    }

    if (!input.email || !this.isValidEmail(input.email)) {
      throw new Error("Email inválido");
    }
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36)}`;
  }
}
```

### UseCase Complexo (Múltiplas Operações)

```typescript
// CreateOrderUseCase.ts
import { Order, OrderItem } from "@/domain/entities/Order";
import { OrderRepository } from "@/domain/repositories/OrderRepository";
import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { UserRepository } from "@/domain/repositories/UserRepository";

/**
 * @usecase CreateOrderUseCase
 * @description Cria um novo pedido
 *
 * @businessRules
 * - Usuário deve existir e estar ativo
 * - Produtos devem existir e ter estoque
 * - Total do pedido deve ser maior que zero
 * - Aplicar descontos se aplicável
 */
export interface CreateOrderInput {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  couponCode?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    // 1. Validar usuário
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    if (!user.isActive) {
      throw new Error("Usuário inativo");
    }

    // 2. Validar produtos e estoque
    const orderItems: OrderItem[] = [];

    for (const item of input.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Produto ${product.name} sem estoque suficiente`);
      }

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 3. Criar pedido
    const order = new Order(
      this.generateId(),
      input.userId,
      orderItems,
      "pending",
      new Date(),
    );

    // 4. Validar total
    if (order.getTotal() <= 0) {
      throw new Error("Total do pedido deve ser maior que zero");
    }

    // 5. Aplicar cupom (se houver)
    if (input.couponCode) {
      // Lógica de cupom
    }

    // 6. Salvar pedido
    const savedOrder = await this.orderRepository.create(order);

    // 7. Atualizar estoque dos produtos
    for (const item of input.items) {
      await this.productRepository.decreaseStock(item.productId, item.quantity);
    }

    return savedOrder;
  }

  private generateId(): string {
    return `order_${Date.now()}`;
  }
}
```

### UseCase com Result Pattern

```typescript
// LoginUseCase.ts

/**
 * Result pattern para retornos mais explícitos
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  token: string;
}

/**
 * @usecase LoginUseCase
 * @description Autentica um usuário
 */
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(input: LoginInput): Promise<Result<LoginOutput>> {
    // 1. Validar input
    if (!input.email || !input.password) {
      return {
        success: false,
        error: new Error("Email e senha são obrigatórios"),
      };
    }

    // 2. Buscar usuário
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      return {
        success: false,
        error: new Error("Credenciais inválidas"),
      };
    }

    // 3. Verificar senha
    const isValidPassword = await this.authService.verifyPassword(
      input.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return {
        success: false,
        error: new Error("Credenciais inválidas"),
      };
    }

    // 4. Gerar token
    const token = await this.authService.generateToken(user.id);

    return {
      success: true,
      data: {
        user,
        token,
      },
    };
  }
}
```

## 🔧 Padrões de UseCase

### Command (Modifica Estado)

- CreateUserUseCase
- UpdateProfileUseCase
- DeleteOrderUseCase

### Query (Busca Dados)

- GetUserUseCase
- GetProductsUseCase
- SearchOrdersUseCase

## ✅ Boas Práticas

### DO ✅

- Um UseCase faz uma coisa só (SRP)
- Injete dependências via construtor
- Valide inputs no UseCase
- Use entidades do domínio
- Lance exceções descritivas
- Documente regras de negócio
- Mantenha UseCase independente de UI
- Use interfaces para repositórios

### DON'T ❌

- Não faça chamadas HTTP diretamente
- Não acesse banco de dados diretamente
- Não coloque lógica de UI
- Não misture múltiplas responsabilidades
- Não ignore validações
- Não retorne tipos da camada de dados

## 🧪 Testes

```typescript
// CreateUserUseCase.test.ts
describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(userRepository);
  });

  it("should create a new user", async () => {
    const input = {
      name: "João Silva",
      email: "joao@example.com",
    };

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(expect.any(User));

    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe(input.name);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should throw error if email already exists", async () => {
    const input = {
      name: "João Silva",
      email: "joao@example.com",
    };

    userRepository.findByEmail.mockResolvedValue(
      new User("1", "Existing", "joao@example.com", new Date()),
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      "Email já está em uso",
    );
  });

  it("should throw error for invalid input", async () => {
    const input = {
      name: "Jo",
      email: "invalid",
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
```

## 📝 Template de Documentação

```typescript
/**
 * @usecase UseCaseName
 * @description Breve descrição do que o UseCase faz
 *
 * @businessRules
 * - Regra 1: Descrição
 * - Regra 2: Descrição
 *
 * @dependencies
 * - Repository1
 * - Repository2
 *
 * @throws {Error} Condição de erro
 *
 * @example
 * const useCase = new UseCaseName(repository);
 * const result = await useCase.execute(input);
 */
```

## 🔗 Ver Também

- [Entities](../entities/README.md)
- [Repositories](../repositories/README.md)
- [Hooks](../../presentation/hooks/README.md)
