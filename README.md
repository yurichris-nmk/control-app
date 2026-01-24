# Control - React Native App

Aplicativo React Native desenvolvido com Expo, seguindo princípios de **Clean Architecture** para garantir código limpo, testável e escalável.

## 📱 Sobre o Projeto

Este é um projeto base estruturado com arquitetura limpa, pronto para desenvolvimento de aplicações React Native robustas e manuteníveis.

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, separando o código em camadas bem definidas:

```
src/
├── presentation/      # 🎨 UI e lógica de apresentação
│   ├── screens/       # Telas
│   ├── components/    # Componentes
│   ├── hooks/         # Hooks customizados
│   ├── navigation/    # Rotas
│   └── store/         # 🗄️ Gerenciamento de Estado Global
│       ├── zustand/   # Stores Zustand (estado dinâmico)
│       └── context/   # Contexts React (estado estático)
├── domain/            # 💼 Regras de negócio e entidades
├── data/              # 💾 Acesso a dados
├── infrastructure/    # 🏗️ Detalhes técnicos
└── shared/            # 🔄 Código compartilhado
```

### 📚 Documentação Completa

- **[Arquitetura Detalhada](./docs/ARCHITECTURE.md)** - Entenda a estrutura e fluxo de dados
- **[Templates de Documentação](./docs/TEMPLATES.md)** - Padrões para documentar código

### 📂 Documentação por Camada

#### 🎨 Presentation (UI)

- [Presentation](./src/presentation/README.md) - Visão geral da camada
- [Screens](./src/presentation/screens/README.md) - Telas da aplicação
- [Components](./src/presentation/components/README.md) - Componentes reutilizáveis
- [Hooks](./src/presentation/hooks/README.md) - Custom hooks
- [Navigation](./src/presentation/navigation/README.md) - Navegação

#### 💼 Domain (Regras de Negócio)

- [Domain](./src/domain/README.md) - Visão geral da camada
- [Entities](./src/domain/entities/README.md) - Entidades de negócio
- [UseCases](./src/domain/usecases/README.md) - Casos de uso
- [Repositories](./src/domain/repositories/README.md) - Interfaces de repositórios

#### 💾 Data (Acesso a Dados)

- [Data](./src/data/README.md) - Visão geral da camada
- [Repositories](./src/data/repositories/README.md) - Implementações de repositórios
- [DataSources](./src/data/datasources/README.md) - Fontes de dados
- [Models](./src/data/models/README.md) - Modelos de dados (DTOs)

#### 🏗️ Infrastructure (Detalhes Técnicos)

- [Infrastructure](./src/infrastructure/README.md) - Visão geral da camada
- [API](./src/infrastructure/api/README.md) - Cliente de API
- [Storage](./src/infrastructure/storage/README.md) - Armazenamento local
- [Services](./src/infrastructure/services/README.md) - Serviços externos

#### 🔄 Shared (Código Compartilhado)

- [Shared](./src/shared/README.md) - Visão geral da camada
- [Constants](./src/shared/constants/README.md) - Constantes
- [Utils](./src/shared/utils/README.md) - Utilitários
- [Types](./src/shared/types/README.md) - Tipos TypeScript
- [Theme](./src/shared/theme/README.md) - Tema da aplicação

## 🚀 Começando

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- iOS Simulator / Android Emulator (opcional)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start

# Rodar no Android
npm run android

# Rodar no iOS
npm run ios

# Rodar no Web
npm run web
```

## 🛠️ Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **NativeWind** - Styling (Tailwind CSS)
- **AsyncStorage** - Armazenamento local

## 📝 Como Desenvolver

### 1. Criando uma Nova Feature

Siga este fluxo ao adicionar uma nova funcionalidade:

```
1. Domain (Regras de Negócio)
   └─ Criar Entity
   └─ Criar UseCase
   └─ Definir Repository Interface

2. Data (Acesso a Dados)
   └─ Criar Model (DTO)
   └─ Criar DataSource
   └─ Implementar Repository

3. Presentation (UI)
   └─ Criar Hook (conecta UseCase)
   └─ Criar Components
   └─ Criar Screen
```

### 2. Exemplo Prático

Vamos adicionar uma feature de "Produtos":

```typescript
// 1. Domain - Entity
// src/domain/entities/Product.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number
  ) {}
}

// 2. Domain - UseCase
// src/domain/usecases/GetProductsUseCase.ts
export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}

// 3. Domain - Repository Interface
// src/domain/repositories/ProductRepository.ts
export interface ProductRepository {
  findAll(): Promise<Product[]>;
}

// 4. Data - Model
// src/data/models/ProductModel.ts
export interface ProductModel {
  id: string;
  name: string;
  price: number;
}

// 5. Data - DataSource
// src/data/datasources/ProductRemoteDataSource.ts
export class ProductRemoteDataSource {
  async getProducts(): Promise<ProductModel[]> {
    const response = await apiClient.get('/products');
    return response.data;
  }
}

// 6. Data - Repository Implementation
// src/data/repositories/ProductRepositoryImpl.ts
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private dataSource: ProductRemoteDataSource) {}

  async findAll(): Promise<Product[]> {
    const models = await this.dataSource.getProducts();
    return models.map(m => new Product(m.id, m.name, m.price));
  }
}

// 7. Presentation - Hook
// src/presentation/hooks/useGetProducts.ts
export const useGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const useCase = new GetProductsUseCase(repository);
    useCase.execute().then(setProducts).finally(() => setLoading(false));
  }, []);

  return { products, loading };
};

// 8. Presentation - Screen
// src/presentation/screens/ProductListScreen.tsx
export const ProductListScreen = () => {
  const { products, loading } = useGetProducts();

  if (loading) return <Loading />;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
};
```

### 3. Documentando Código

Use os templates em [docs/TEMPLATES.md](./docs/TEMPLATES.md) para documentar:

- Screens
- Components
- Hooks
- UseCases
- Entities
- Repositories
- DataSources
- Models
- Utils

## ✅ Boas Práticas

1. **Separação de Responsabilidades**: Cada camada tem seu papel
2. **Dependency Inversion**: Domain não depende de detalhes
3. **Testes**: Teste cada camada isoladamente
4. **Documentação**: Documente conforme desenvolve
5. **TypeScript**: Use tipagem forte sempre
6. **Clean Code**: Código limpo e legível

## 🧪 Testes

```bash
# Rodar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch
```

## 📦 Build

```bash
# Build de produção
npm run build

# Build Android
npm run build:android

# Build iOS
npm run build:ios
```

## 🤝 Contribuindo

1. Leia a documentação de arquitetura
2. Siga os templates de documentação
3. Escreva testes para seu código
4. Faça commits semânticos
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Contato

- **Documentação**: Verifique a pasta `/docs`
- **Issues**: Use o sistema de issues do repositório

---

**Desenvolvido com ❤️ usando Clean Architecture**
