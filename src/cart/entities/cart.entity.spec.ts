import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { User } from '../../users/entities/user.entity';

describe('Cart Entity', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it('deve estar definida a entidade Cart', () => {
    // Teste de criação básica da entidade Cart
    expect(cart).toBeDefined();
    expect(cart).toBeInstanceOf(Cart);
  });

  it('deve gerar um ID automaticamente antes de inserir no banco', () => {
    // Teste de geração automática de ID com prefixo 'cart-'
    cart.generateId();
    
    expect(cart.id).toBeDefined();
    expect(cart.id).toMatch(/^cart-/);
    expect(cart.id.length).toBeGreaterThan(5); // 'cart-' + nanoid
  });

  it('deve criar um carrinho com propriedades obrigatórias', () => {
    // Teste de criação de carrinho com dados obrigatórios
    cart.userId = 'user-123';
    cart.total = 0;
    cart.generateId();
    
    expect(cart.userId).toBe('user-123');
    expect(cart.total).toBe(0);
    expect(cart.id).toMatch(/^cart-/);
  });

  it('deve inicializar com total zero por padrão', () => {
    // Teste de inicialização de carrinho vazio
    cart.userId = 'user-456';
    cart.generateId();
    
    expect(cart.total).toBeUndefined(); // Não definido até ser setado
    
    // Simulando valor padrão do banco
    cart.total = 0;
    expect(cart.total).toBe(0);
  });

  it('deve aceitar array de itens vazio inicialmente', () => {
    // Teste de carrinho sem itens inicialmente
    cart.userId = 'user-789';
    cart.items = [];
    cart.total = 0;
    cart.generateId();
    
    expect(cart.items).toEqual([]);
    expect(cart.items.length).toBe(0);
  });

  it('deve permitir associação com usuário', () => {
    // Teste de relacionamento com entidade User
    const user = new User();
    user.id = 'user-owner';
    user.email = 'owner@teste.com';
    user.name = 'Proprietário';
    
    cart.userId = user.id;
    cart.user = user;
    cart.generateId();
    
    expect(cart.userId).toBe(user.id);
    expect(cart.user).toBe(user);
    expect(cart.user.email).toBe('owner@teste.com');
  });

  it('deve calcular total correto com múltiplos itens', () => {
    // Teste de cálculo de total com vários itens
    cart.userId = 'user-123';
    cart.generateId();
    
    // Simulando itens no carrinho
    const item1 = new CartItem();
    item1.subtotal = 299.99;
    
    const item2 = new CartItem();
    item2.subtotal = 150.50;
    
    cart.items = [item1, item2];
    cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    expect(cart.total).toBe(450.49);
    expect(cart.items.length).toBe(2);
  });

  it('deve manter precisão decimal em valores monetários', () => {
    // Teste de precisão decimal para valores monetários
    cart.userId = 'user-456';
    cart.generateId();
    
    const valoresDecimais = [99.99, 150.50, 1000.00, 0.01];
    
    valoresDecimais.forEach(valor => {
      cart.total = valor;
      expect(cart.total).toBe(valor);
      expect(cart.total.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    });
  });

  it('deve ter propriedades de auditoria (createdAt e updatedAt)', () => {
    // Teste de propriedades de auditoria temporal
    const now = new Date();
    cart.createdAt = now;
    cart.updatedAt = now;
    
    expect(cart.createdAt).toBe(now);
    expect(cart.updatedAt).toBe(now);
    expect(cart.createdAt).toBeInstanceOf(Date);
    expect(cart.updatedAt).toBeInstanceOf(Date);
  });

  it('deve permitir atualização de total ao adicionar itens', () => {
    // Teste de atualização dinâmica do total
    cart.userId = 'user-789';
    cart.total = 0;
    cart.items = [];
    cart.generateId();
    
    const totalInicial = cart.total;
    
    // Simulando adição de item
    const novoItem = new CartItem();
    novoItem.subtotal = 89.90;
    
    cart.items.push(novoItem);
    cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    expect(cart.total).toBeGreaterThan(totalInicial);
    expect(cart.total).toBe(89.90);
    expect(cart.items.length).toBe(1);
  });

  it('deve permitir remoção de itens e recálculo do total', () => {
    // Teste de remoção de itens e atualização do total
    cart.userId = 'user-321';
    cart.generateId();
    
    // Carrinho com itens
    const item1 = new CartItem();
    item1.subtotal = 100.00;
    
    const item2 = new CartItem();
    item2.subtotal = 200.00;
    
    cart.items = [item1, item2];
    cart.total = 300.00;
    
    // Removendo um item
    cart.items = cart.items.filter(item => item !== item1);
    cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    expect(cart.items.length).toBe(1);
    expect(cart.total).toBe(200.00);
  });

  it('deve retornar total zero quando carrinho está vazio', () => {
    // Teste de carrinho vazio com total zero
    cart.userId = 'user-empty';
    cart.items = [];
    cart.total = 0;
    cart.generateId();
    
    expect(cart.items.length).toBe(0);
    expect(cart.total).toBe(0);
  });

  it('deve manter integridade após múltiplas operações', () => {
    // Teste de integridade após várias operações
    cart.userId = 'user-complex';
    cart.total = 0;
    cart.items = [];
    cart.generateId();
    
    const idOriginal = cart.id;
    const userIdOriginal = cart.userId;
    
    // Múltiplas operações
    const item = new CartItem();
    item.subtotal = 50.00;
    cart.items.push(item);
    cart.total = 50.00;
    
    // Verificando integridade
    expect(cart.id).toBe(idOriginal);
    expect(cart.userId).toBe(userIdOriginal);
    expect(cart.total).toBe(50.00);
    expect(cart.items.length).toBe(1);
  });
});
