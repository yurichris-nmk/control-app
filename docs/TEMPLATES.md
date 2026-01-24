# 📝 Templates de Documentação

Este diretório contém templates para documentar diferentes tipos de código no projeto.

## 📋 Templates Disponíveis

### 1. Screen Template

```tsx
/**
 * @screen ScreenName
 * @description Breve descrição do que a screen faz
 *
 * @navigation
 *   - Recebe: { param1: type, param2: type }
 *   - Navega para: OtherScreen, AnotherScreen
 *
 * @usecases
 *   - GetDataUseCase
 *   - UpdateDataUseCase
 *
 * @components
 *   - ComponentName1
 *   - ComponentName2
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 * @updated YYYY-MM-DD
 */
```

### 2. Component Template

```tsx
/**
 * @component ComponentName
 * @description Breve descrição do componente
 *
 * @props
 *   - prop1: type - Descrição
 *   - prop2: type - Descrição
 *
 * @example
 * <ComponentName
 *   prop1="value"
 *   prop2={value}
 * />
 *
 * @accessibility
 *   - Suporta leitores de tela
 *   - Feedback tátil habilitado
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 3. Hook Template

```typescript
/**
 * @hook useHookName
 * @description Breve descrição do que o hook faz
 *
 * @param param1 - Descrição do parâmetro
 * @param param2 - Descrição do parâmetro
 *
 * @returns Objeto com { data, loading, error, refetch }
 *
 * @example
 * const { data, loading } = useHookName(param1, param2);
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 4. UseCase Template

```typescript
/**
 * @usecase UseCaseName
 * @description Breve descrição do caso de uso
 *
 * @businessRules
 * - Regra 1: Descrição
 * - Regra 2: Descrição
 * - Regra 3: Descrição
 *
 * @dependencies
 * - Repository1
 * - Repository2
 *
 * @throws {Error} Descrição do erro
 *
 * @example
 * const useCase = new UseCaseName(repository);
 * const result = await useCase.execute(input);
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 5. Entity Template

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
 * - Invariante 1: Sempre verdadeiro
 * - Invariante 2: Nunca pode acontecer
 *
 * @example
 * const entity = new EntityName('id', 'data');
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 6. Repository Interface Template

```typescript
/**
 * @interface RepositoryName
 * @description Contrato para acesso a dados de [Entity]
 *
 * @responsibilities
 * - Buscar dados
 * - Persistir dados
 * - Gerenciar cache
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 7. Repository Implementation Template

```typescript
/**
 * @repository RepositoryNameImpl
 * @description Implementação do repositório de [Entity]
 * @implements {RepositoryName}
 *
 * @strategy
 * - Cache local para performance
 * - Sincronização com API remota
 * - Fallback offline
 *
 * @dependencies
 * - RemoteDataSource: Acesso à API
 * - LocalDataSource: Cache local
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 8. DataSource Template

```typescript
/**
 * @datasource DataSourceName
 * @description Acessa dados de [fonte]
 *
 * @responsibilities
 * - Fazer chamadas HTTP/Storage
 * - Retornar dados brutos (Models)
 * - Tratar erros de I/O
 *
 * @dependencies
 * - ApiClient / AsyncStorage / etc
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 9. Model Template

```typescript
/**
 * @model ModelName
 * @description Representa dados de [entidade] vindos da API
 * @apiEndpoint GET /api/endpoint
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 10. Utility Function Template

```typescript
/**
 * @function functionName
 * @description Breve descrição do que a função faz
 *
 * @param param1 - Descrição do parâmetro
 * @param param2 - Descrição do parâmetro
 *
 * @returns Descrição do retorno
 *
 * @example
 * const result = functionName(param1, param2);
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

### 11. Service Template

```typescript
/**
 * @service ServiceName
 * @description Breve descrição do serviço
 *
 * @responsibilities
 * - Responsabilidade 1
 * - Responsabilidade 2
 *
 * @dependencies
 * - Dependência externa 1
 * - Dependência externa 2
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

## 📄 README Template para Diretórios

Ao criar um novo diretório com arquivos relacionados, crie um README.md:

```markdown
# Nome do Diretório

## 📝 Descrição

Breve descrição do propósito deste diretório.

## 📁 Arquivos

### NomeDoArquivo1.ts

Descrição do arquivo e seu propósito.

### NomeDoArquivo2.ts

Descrição do arquivo e seu propósito.

## 🔗 Relações

Como este diretório se relaciona com outros.

## ✅ Checklist ao Adicionar Novo Arquivo

- [ ] Arquivo criado com template apropriado
- [ ] Documentação inline completa
- [ ] Testes implementados (se aplicável)
- [ ] README atualizado com novo arquivo
- [ ] Tipos TypeScript definidos

## 📚 Exemplos

Exemplos de uso do código deste diretório.

## 🔗 Ver Também

- Links para diretórios relacionados
```

## 🎯 Quando Usar Cada Template

- **Screen**: Ao criar uma nova tela/página
- **Component**: Ao criar um componente reutilizável
- **Hook**: Ao criar um custom hook
- **UseCase**: Ao implementar uma regra de negócio
- **Entity**: Ao criar uma entidade de domínio
- **Repository**: Ao definir ou implementar acesso a dados
- **DataSource**: Ao criar fonte de dados (API/Storage)
- **Model**: Ao definir estrutura de dados da API
- **Utility**: Ao criar função utilitária
- **Service**: Ao integrar serviço externo

## ✅ Boas Práticas de Documentação

1. **Seja Conciso**: Documentação clara e direta
2. **Use Exemplos**: Código de exemplo ajuda muito
3. **Mantenha Atualizado**: Atualize ao modificar código
4. **Documente o "Porquê"**: Não apenas o "o quê"
5. **Links**: Referencie arquivos relacionados
6. **Regras de Negócio**: Sempre documente regras importantes
7. **Casos de Uso**: Mostre como usar o código
8. **Erros Possíveis**: Documente exceções que podem ocorrer

## 📖 Ferramentas de Documentação

- **TSDoc**: Para documentação inline em TypeScript
- **Markdown**: Para READMEs e documentos
- **Comentários**: Para explicações de lógica complexa

## 🔍 Onde Documentar

- **Inline (TSDoc)**: Para classes, funções, métodos
- **README.md**: Para visão geral de diretórios
- **docs/**: Para documentação extensa
- **Comentários**: Para lógica complexa específica

## 📝 12. Zustand Store Template

```typescript
/**
 * @store StoreName
 * @description Breve descrição do estado gerenciado
 *
 * @state
 * - campo1: Descrição
 * - campo2: Descrição
 *
 * @actions
 * - action1(): Descrição
 * - action2(): Descrição
 *
 * @persistence
 * - [ ] Persiste no AsyncStorage
 * - [ ] Usa DevTools
 *
 * @example
 * const value = useStoreName((state) => state.value);
 * const action = useStoreName((state) => state.action);
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```

## 📝 13. Context API Template

```typescript
/**
 * @context ContextName
 * @description Breve descrição do contexto
 *
 * @state
 * - campo1: Descrição
 * - campo2: Descrição
 *
 * @methods
 * - method1(): Descrição
 * - method2(): Descrição
 *
 * @usage
 * Quando usar este context:
 * - Caso de uso 1
 * - Caso de uso 2
 *
 * @example
 * const { value, method } = useContextName();
 *
 * @provider
 * <ContextNameProvider>
 *   <App />
 * </ContextNameProvider>
 *
 * @author Seu Nome
 * @created YYYY-MM-DD
 */
```
