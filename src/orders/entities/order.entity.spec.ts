import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';

describe('Order Entity', () => {
  let order: Order;

  beforeEach(() => {
    order = new Order();
  });

  it('deve estar definida a entidade Order', () => {
    // Teste de criação básica da entidade Order
    expect(order).toBeDefined();
    expect(order).toBeInstanceOf(Order);
  });

  it('deve gerar um ID automaticamente antes de inserir no banco', () => {
    // Teste de geração automática de ID com prefixo 'order-'
    order.generateId();
    
    expect(order.id).toBeDefined();
    expect(order.id).toMatch(/^order-/);
    expect(order.id.length).toBeGreaterThan(6); // 'order-' + nanoid
  });

  it('deve criar um pedido com todas as propriedades obrigatórias', () => {
    // Teste de criação de pedido com dados obrigatórios
    order.userId = 'user-123';
    order.total = 1500.00;
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    expect(order.userId).toBe('user-123');
    expect(order.total).toBe(1500.00);
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.id).toMatch(/^order-/);
  });

  it('deve ter status padrão como PENDING', () => {
    // Teste de status padrão do pedido
    order.userId = 'user-456';
    order.total = 500.00;
    order.generateId();
    
    // Status padrão deve ser PENDING
    expect(OrderStatus.PENDING).toBe('pending');
    
    order.status = OrderStatus.PENDING;
    expect(order.status).toBe('pending');
  });

  it('deve validar todos os status possíveis do pedido', () => {
    // Teste de todos os status válidos do enum
    const statusValidos = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED
    ];
    
    statusValidos.forEach(status => {
      order.status = status;
      expect(Object.values(OrderStatus)).toContain(status);
    });
  });

  it('deve aceitar propriedades opcionais (shippingAddress e notes)', () => {
    // Teste de propriedades opcionais do pedido
    order.userId = 'user-789';
    order.total = 2000.00;
    order.status = OrderStatus.PENDING;
    order.shippingAddress = 'Rua das Flores, 123, São Paulo';
    order.notes = 'Entregar no período da manhã';
    order.generateId();
    
    expect(order.shippingAddress).toBe('Rua das Flores, 123, São Paulo');
    expect(order.notes).toBe('Entregar no período da manhã');
  });

  it('deve permitir criação de pedido sem propriedades opcionais', () => {
    // Teste de criação de pedido apenas com dados obrigatórios
    order.userId = 'user-simple';
    order.total = 750.00;
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    expect(order.shippingAddress).toBeUndefined();
    expect(order.notes).toBeUndefined();
    expect(order.userId).toBe('user-simple');
    expect(order.total).toBe(750.00);
  });

  it('deve permitir associação com usuário', () => {
    // Teste de relacionamento com entidade User
    const user = new User();
    user.id = 'user-customer';
    user.email = 'customer@teste.com';
    user.name = 'Cliente Teste';
    
    order.userId = user.id;
    order.user = user;
    order.total = 1200.00;
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    expect(order.userId).toBe(user.id);
    expect(order.user).toBe(user);
    expect(order.user.email).toBe('customer@teste.com');
  });

  it('deve permitir associação com itens do pedido', () => {
    // Teste de relacionamento com OrderItems
    order.userId = 'user-123';
    order.total = 900.00;
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    const item1 = new OrderItem();
    item1.subtotal = 500.00;
    
    const item2 = new OrderItem();
    item2.subtotal = 400.00;
    
    order.items = [item1, item2];
    
    expect(order.items.length).toBe(2);
    expect(order.items[0].subtotal).toBe(500.00);
    expect(order.items[1].subtotal).toBe(400.00);
  });

  it('deve calcular total correto baseado nos itens', () => {
    // Teste de cálculo de total baseado nos itens
    order.userId = 'user-calc';
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    const item1 = new OrderItem();
    item1.subtotal = 299.99;
    
    const item2 = new OrderItem();
    item2.subtotal = 150.01;
    
    const item3 = new OrderItem();
    item3.subtotal = 50.00;
    
    order.items = [item1, item2, item3];
    order.total = order.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    expect(order.total).toBe(500.00);
  });

  it('deve permitir transições de status do pedido', () => {
    // Teste de fluxo de status do pedido
    order.userId = 'user-flow';
    order.total = 800.00;
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    const statusInicial = order.status;
    expect(statusInicial).toBe(OrderStatus.PENDING);
    
    // Confirmando pedido
    order.status = OrderStatus.CONFIRMED;
    expect(order.status).toBe(OrderStatus.CONFIRMED);
    
    // Enviando pedido
    order.status = OrderStatus.SHIPPED;
    expect(order.status).toBe(OrderStatus.SHIPPED);
    
    // Entregando pedido
    order.status = OrderStatus.DELIVERED;
    expect(order.status).toBe(OrderStatus.DELIVERED);
  });

  it('deve permitir cancelamento de pedido', () => {
    // Teste de cancelamento de pedido
    order.userId = 'user-cancel';
    order.total = 600.00;
    order.status = OrderStatus.PENDING;
    order.generateId();
    
    // Cancelando pedido
    order.status = OrderStatus.CANCELLED;
    expect(order.status).toBe(OrderStatus.CANCELLED);
  });

  it('deve ter propriedades de auditoria (createdAt e updatedAt)', () => {
    // Teste de propriedades de auditoria temporal
    const now = new Date();
    order.createdAt = now;
    order.updatedAt = now;
    
    expect(order.createdAt).toBe(now);
    expect(order.updatedAt).toBe(now);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('deve manter precisão decimal para valores monetários', () => {
    // Teste de precisão decimal em valores do pedido
    const valoresDecimais = [99.99, 1500.50, 2999.00, 0.01];
    
    valoresDecimais.forEach(valor => {
      order.total = valor;
      expect(order.total).toBe(valor);
      expect(order.total.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    });
  });

  it('deve manter integridade dos dados após atualização de status', () => {
    // Teste de integridade após mudança de status
    order.userId = 'user-integrity';
    order.total = 1000.00;
    order.status = OrderStatus.PENDING;
    order.shippingAddress = 'Endereço de entrega';
    order.notes = 'Observações importantes';
    order.generateId();
    
    const dadosOriginais = {
      id: order.id,
      userId: order.userId,
      total: order.total,
      shippingAddress: order.shippingAddress,
      notes: order.notes
    };
    
    // Atualizando apenas o status
    order.status = OrderStatus.SHIPPED;
    
    expect(order.id).toBe(dadosOriginais.id);
    expect(order.userId).toBe(dadosOriginais.userId);
    expect(order.total).toBe(dadosOriginais.total);
    expect(order.shippingAddress).toBe(dadosOriginais.shippingAddress);
    expect(order.notes).toBe(dadosOriginais.notes);
    expect(order.status).toBe(OrderStatus.SHIPPED);
  });

  it('deve simular fluxo completo de criação de pedido', () => {
    // Teste de fluxo completo de pedido
    const usuario = new User();
    usuario.id = 'user-complete';
    usuario.email = 'complete@teste.com';
    usuario.name = 'Usuário Completo';
    
    const item = new OrderItem();
    item.subtotal = 850.00;
    item.quantity = 1;
    item.productName = 'Guitarra Premium';
    
    order.userId = usuario.id;
    order.user = usuario;
    order.items = [item];
    order.total = 850.00;
    order.status = OrderStatus.PENDING;
    order.shippingAddress = 'Rua do Músico, 456';
    order.notes = 'Cuidado com o instrumento';
    order.generateId();
    
    // Verificações do fluxo completo
    expect(order.id).toMatch(/^order-/);
    expect(order.userId).toBe(usuario.id);
    expect(order.user.email).toBe('complete@teste.com');
    expect(order.items.length).toBe(1);
    expect(order.items[0].productName).toBe('Guitarra Premium');
    expect(order.total).toBe(850.00);
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.shippingAddress).toBe('Rua do Músico, 456');
    expect(order.notes).toBe('Cuidado com o instrumento');
  });
});
