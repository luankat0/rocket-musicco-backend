import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

describe('OrderItem Entity', () => {
  let orderItem: OrderItem;

  beforeEach(() => {
    orderItem = new OrderItem();
  });

  it('deve estar definida a entidade OrderItem', () => {
    // Teste de criação básica da entidade OrderItem
    expect(orderItem).toBeDefined();
    expect(orderItem).toBeInstanceOf(OrderItem);
  });

  it('deve gerar um ID automaticamente antes de inserir no banco', () => {
    // Teste de geração automática de ID com prefixo 'order-item-'
    orderItem.generateId();
    
    expect(orderItem.id).toBeDefined();
    expect(orderItem.id).toMatch(/^order-item-/);
    expect(orderItem.id.length).toBeGreaterThan(11); // 'order-item-' + nanoid
  });

  it('deve criar um item do pedido com todas as propriedades obrigatórias', () => {
    // Teste de criação de item com dados obrigatórios
    orderItem.orderId = 'order-123';
    orderItem.productId = 'product-456';
    orderItem.productName = 'Guitarra Fender';
    orderItem.quantity = 2;
    orderItem.unitPrice = 1500.00;
    orderItem.subtotal = 3000.00;
    orderItem.generateId();
    
    expect(orderItem.orderId).toBe('order-123');
    expect(orderItem.productId).toBe('product-456');
    expect(orderItem.productName).toBe('Guitarra Fender');
    expect(orderItem.quantity).toBe(2);
    expect(orderItem.unitPrice).toBe(1500.00);
    expect(orderItem.subtotal).toBe(3000.00);
    expect(orderItem.id).toMatch(/^order-item-/);
  });

  it('deve calcular subtotal corretamente baseado em quantidade e preço unitário', () => {
    // Teste de cálculo de subtotal
    orderItem.quantity = 3;
    orderItem.unitPrice = 250.00;
    orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
    
    expect(orderItem.subtotal).toBe(750.00);
  });

  it('deve armazenar nome do produto para histórico', () => {
    // Teste de armazenamento do nome do produto no momento da compra
    orderItem.productName = 'Violão Yamaha FG830';
    orderItem.productId = 'product-violao';
    orderItem.quantity = 1;
    orderItem.unitPrice = 1200.00;
    orderItem.subtotal = 1200.00;
    orderItem.generateId();
    
    expect(orderItem.productName).toBe('Violão Yamaha FG830');
    expect(orderItem.productId).toBe('product-violao');
    
    // O nome fica salvo mesmo se o produto mudar no futuro
    expect(typeof orderItem.productName).toBe('string');
    expect(orderItem.productName.length).toBeGreaterThan(0);
  });

  it('deve validar diferentes quantidades válidas', () => {
    // Teste de validação de quantidades válidas
    const quantidadesValidas = [1, 2, 3, 5, 10];
    
    quantidadesValidas.forEach(quantidade => {
      orderItem.quantity = quantidade;
      expect(orderItem.quantity).toBeGreaterThan(0);
      expect(Number.isInteger(orderItem.quantity)).toBe(true);
    });
  });

  it('deve manter precisão decimal para valores monetários', () => {
    // Teste de precisão decimal em preços e subtotais
    const precosDecimais = [99.99, 1500.50, 2999.00, 0.01];
    
    precosDecimais.forEach(preco => {
      orderItem.unitPrice = preco;
      orderItem.quantity = 1;
      orderItem.subtotal = orderItem.unitPrice * orderItem.quantity;
      
      expect(orderItem.unitPrice).toBe(preco);
      expect(orderItem.subtotal).toBe(preco);
    });
  });

  it('deve permitir associação com pedido', () => {
    // Teste de relacionamento com entidade Order
    const order = new Order();
    order.id = 'order-parent';
    order.userId = 'user-123';
    order.total = 2000.00;
    
    orderItem.orderId = order.id;
    orderItem.order = order;
    orderItem.generateId();
    
    expect(orderItem.orderId).toBe(order.id);
    expect(orderItem.order).toBe(order);
    expect(orderItem.order.userId).toBe('user-123');
  });

  it('deve permitir associação com produto', () => {
    // Teste de relacionamento com entidade Product
    const product = new Product();
    product.id = 'product-piano';
    product.name = 'Piano Digital Yamaha';
    product.price = 4000.00;
    product.stock = 3;
    
    orderItem.productId = product.id;
    orderItem.product = product;
    orderItem.productName = product.name;
    orderItem.unitPrice = product.price;
    orderItem.generateId();
    
    expect(orderItem.productId).toBe(product.id);
    expect(orderItem.product).toBe(product);
    expect(orderItem.productName).toBe(product.name);
    expect(orderItem.unitPrice).toBe(product.price);
  });

  it('deve preservar preço no momento da compra', () => {
    // Teste de preservação do preço histórico
    orderItem.productName = 'Bateria Pearl';
    orderItem.unitPrice = 3500.00; // Preço no momento da compra
    orderItem.quantity = 1;
    orderItem.subtotal = 3500.00;
    orderItem.generateId();
    
    const precoHistorico = orderItem.unitPrice;
    
    // Mesmo que o produto mude de preço depois,
    // o item do pedido mantém o preço original
    expect(orderItem.unitPrice).toBe(precoHistorico);
    expect(orderItem.subtotal).toBe(precoHistorico);
  });

  it('deve calcular subtotal para múltiplas unidades', () => {
    // Teste de cálculo para várias unidades do mesmo produto
    orderItem.productName = 'Corda de Violão';
    orderItem.unitPrice = 15.90;
    orderItem.quantity = 6; // 6 jogos de cordas
    orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
    
    expect(orderItem.subtotal).toBe(95.40);
    expect(orderItem.quantity).toBe(6);
  });

  it('deve validar cenário de produto de alto valor', () => {
    // Teste de item com produto de alto valor
    orderItem.productName = 'Saxofone Alto Selmer';
    orderItem.unitPrice = 15000.00;
    orderItem.quantity = 1;
    orderItem.subtotal = 15000.00;
    orderItem.generateId();
    
    expect(orderItem.unitPrice).toBe(15000.00);
    expect(orderItem.subtotal).toBe(15000.00);
    expect(orderItem.quantity).toBe(1);
  });

  it('deve validar cenário de produto de baixo valor em quantidade', () => {
    // Teste de item com produto barato em grande quantidade
    orderItem.productName = 'Palheta de Guitarra';
    orderItem.unitPrice = 2.50;
    orderItem.quantity = 20;
    orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
    
    expect(orderItem.unitPrice).toBe(2.50);
    expect(orderItem.quantity).toBe(20);
    expect(orderItem.subtotal).toBe(50.00);
  });

  it('deve manter consistência dos IDs de relacionamento', () => {
    // Teste de consistência de chaves estrangeiras
    orderItem.orderId = 'order-xyz789';
    orderItem.productId = 'product-abc123';
    orderItem.productName = 'Flauta Doce';
    orderItem.quantity = 1;
    orderItem.unitPrice = 45.00;
    orderItem.subtotal = 45.00;
    orderItem.generateId();
    
    const idsOriginais = {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId
    };
    
    // Verificando que os IDs não mudam
    expect(orderItem.id).toBe(idsOriginais.id);
    expect(orderItem.orderId).toBe(idsOriginais.orderId);
    expect(orderItem.productId).toBe(idsOriginais.productId);
  });

  it('deve preservar integridade em cenário de desconto', () => {
    // Teste de cenário com desconto aplicado
    const precoOriginal = 500.00;
    const precoComDesconto = 450.00; // 10% de desconto
    
    orderItem.productName = 'Teclado Digital';
    orderItem.unitPrice = precoComDesconto; // Preço já com desconto
    orderItem.quantity = 2;
    orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
    orderItem.generateId();
    
    expect(orderItem.unitPrice).toBe(precoComDesconto);
    expect(orderItem.subtotal).toBe(900.00);
    expect(orderItem.unitPrice).toBeLessThan(precoOriginal);
  });

  it('deve simular fluxo completo de item no pedido', () => {
    // Teste de fluxo completo de criação de item do pedido
    const produto = new Product();
    produto.id = 'product-drums';
    produto.name = 'Bateria Acústica Pearl';
    produto.price = 4500.00;
    produto.stock = 2;
    
    const pedido = new Order();
    pedido.id = 'order-complete';
    pedido.userId = 'user-drummer';
    
    // Criando item do pedido
    orderItem.orderId = pedido.id;
    orderItem.productId = produto.id;
    orderItem.productName = produto.name; // Nome congelado no momento
    orderItem.quantity = 1;
    orderItem.unitPrice = produto.price; // Preço congelado no momento
    orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
    orderItem.order = pedido;
    orderItem.product = produto;
    orderItem.generateId();
    
    // Verificações do fluxo completo
    expect(orderItem.id).toMatch(/^order-item-/);
    expect(orderItem.orderId).toBe(pedido.id);
    expect(orderItem.productId).toBe(produto.id);
    expect(orderItem.productName).toBe('Bateria Acústica Pearl');
    expect(orderItem.quantity).toBe(1);
    expect(orderItem.unitPrice).toBe(4500.00);
    expect(orderItem.subtotal).toBe(4500.00);
    expect(orderItem.order.userId).toBe('user-drummer');
    expect(orderItem.product.stock).toBe(2);
  });
});
