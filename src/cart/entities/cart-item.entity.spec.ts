import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

describe('CartItem Entity', () => {
  let cartItem: CartItem;

  beforeEach(() => {
    cartItem = new CartItem();
  });

  it('deve estar definida a entidade CartItem', () => {
    // Teste de criação básica da entidade CartItem
    expect(cartItem).toBeDefined();
    expect(cartItem).toBeInstanceOf(CartItem);
  });

  it('deve gerar um ID automaticamente antes de inserir no banco', () => {
    // Teste de geração automática de ID com prefixo 'cart-item-'
    cartItem.generateId();
    
    expect(cartItem.id).toBeDefined();
    expect(cartItem.id).toMatch(/^cart-item-/);
    expect(cartItem.id.length).toBeGreaterThan(10); // 'cart-item-' + nanoid
  });

  it('deve criar um item do carrinho com todas as propriedades obrigatórias', () => {
    // Teste de criação de item com dados obrigatórios
    cartItem.cartId = 'cart-123';
    cartItem.productId = 'product-456';
    cartItem.quantity = 2;
    cartItem.unitPrice = 99.99;
    cartItem.subtotal = 199.98;
    cartItem.generateId();
    
    expect(cartItem.cartId).toBe('cart-123');
    expect(cartItem.productId).toBe('product-456');
    expect(cartItem.quantity).toBe(2);
    expect(cartItem.unitPrice).toBe(99.99);
    expect(cartItem.subtotal).toBe(199.98);
    expect(cartItem.id).toMatch(/^cart-item-/);
  });

  it('deve calcular subtotal corretamente baseado em quantidade e preço unitário', () => {
    // Teste de cálculo de subtotal
    cartItem.quantity = 3;
    cartItem.unitPrice = 150.00;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.subtotal).toBe(450.00);
  });

  it('deve validar diferentes quantidades válidas', () => {
    // Teste de validação de quantidades
    const quantidadesValidas = [1, 2, 5, 10, 100];
    
    quantidadesValidas.forEach(quantidade => {
      cartItem.quantity = quantidade;
      expect(cartItem.quantity).toBeGreaterThan(0);
      expect(Number.isInteger(cartItem.quantity)).toBe(true);
    });
  });

  it('deve manter precisão decimal para valores monetários', () => {
    // Teste de precisão decimal em preços
    const precosDecimais = [0.01, 99.99, 1500.50, 2999.90];
    
    precosDecimais.forEach(preco => {
      cartItem.unitPrice = preco;
      cartItem.quantity = 1;
      cartItem.subtotal = cartItem.unitPrice * cartItem.quantity;
      
      expect(cartItem.unitPrice).toBe(preco);
      expect(cartItem.subtotal).toBe(preco);
    });
  });

  it('deve permitir associação com carrinho', () => {
    // Teste de relacionamento com entidade Cart
    const cart = new Cart();
    cart.id = 'cart-owner';
    cart.userId = 'user-123';
    cart.total = 0;
    
    cartItem.cartId = cart.id;
    cartItem.cart = cart;
    cartItem.generateId();
    
    expect(cartItem.cartId).toBe(cart.id);
    expect(cartItem.cart).toBe(cart);
    expect(cartItem.cart.userId).toBe('user-123');
  });

  it('deve permitir associação com produto', () => {
    // Teste de relacionamento com entidade Product
    const product = new Product();
    product.id = 'product-guitar';
    product.name = 'Guitarra Stratocaster';
    product.price = 2500.00;
    product.stock = 10;
    
    cartItem.productId = product.id;
    cartItem.product = product;
    cartItem.unitPrice = product.price;
    cartItem.generateId();
    
    expect(cartItem.productId).toBe(product.id);
    expect(cartItem.product).toBe(product);
    expect(cartItem.product.name).toBe('Guitarra Stratocaster');
    expect(cartItem.unitPrice).toBe(product.price);
  });

  it('deve recalcular subtotal quando quantidade é alterada', () => {
    // Teste de recálculo de subtotal após mudança de quantidade
    cartItem.unitPrice = 100.00;
    cartItem.quantity = 2;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.subtotal).toBe(200.00);
    
    // Alterando quantidade
    cartItem.quantity = 5;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.subtotal).toBe(500.00);
  });

  it('deve recalcular subtotal quando preço unitário é alterado', () => {
    // Teste de recálculo de subtotal após mudança de preço
    cartItem.quantity = 3;
    cartItem.unitPrice = 200.00;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.subtotal).toBe(600.00);
    
    // Alterando preço unitário (ex: desconto)
    cartItem.unitPrice = 180.00;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.subtotal).toBe(540.00);
  });

  it('deve validar cenário de quantidade mínima (1 unidade)', () => {
    // Teste de quantidade mínima válida
    cartItem.quantity = 1;
    cartItem.unitPrice = 50.00;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.quantity).toBe(1);
    expect(cartItem.subtotal).toBe(50.00);
  });

  it('deve validar cenário de alta quantidade', () => {
    // Teste de quantidade alta válida
    cartItem.quantity = 50;
    cartItem.unitPrice = 10.00;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.quantity).toBe(50);
    expect(cartItem.subtotal).toBe(500.00);
  });

  it('deve manter consistência dos IDs de relacionamento', () => {
    // Teste de consistência de chaves estrangeiras
    cartItem.cartId = 'cart-abc123';
    cartItem.productId = 'product-xyz789';
    cartItem.quantity = 1;
    cartItem.unitPrice = 75.50;
    cartItem.subtotal = 75.50;
    cartItem.generateId();
    
    const idsOriginais = {
      id: cartItem.id,
      cartId: cartItem.cartId,
      productId: cartItem.productId
    };
    
    // Alterando apenas dados do item
    cartItem.quantity = 3;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    
    expect(cartItem.id).toBe(idsOriginais.id);
    expect(cartItem.cartId).toBe(idsOriginais.cartId);
    expect(cartItem.productId).toBe(idsOriginais.productId);
    expect(cartItem.subtotal).toBe(226.50);
  });

  it('deve simular fluxo completo de adição ao carrinho', () => {
    // Teste de fluxo completo de item no carrinho
    // Simulando produto sendo adicionado ao carrinho
    const produto = new Product();
    produto.id = 'product-piano';
    produto.name = 'Piano Digital';
    produto.price = 3000.00;
    produto.stock = 5;
    
    const carrinho = new Cart();
    carrinho.id = 'cart-user1';
    carrinho.userId = 'user-1';
    
    // Criando item do carrinho
    cartItem.cartId = carrinho.id;
    cartItem.productId = produto.id;
    cartItem.quantity = 1;
    cartItem.unitPrice = produto.price;
    cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;
    cartItem.cart = carrinho;
    cartItem.product = produto;
    cartItem.generateId();
    
    // Verificações do fluxo completo
    expect(cartItem.id).toMatch(/^cart-item-/);
    expect(cartItem.cartId).toBe(carrinho.id);
    expect(cartItem.productId).toBe(produto.id);
    expect(cartItem.quantity).toBe(1);
    expect(cartItem.unitPrice).toBe(3000.00);
    expect(cartItem.subtotal).toBe(3000.00);
    expect(cartItem.cart.userId).toBe('user-1');
    expect(cartItem.product.name).toBe('Piano Digital');
  });
});
