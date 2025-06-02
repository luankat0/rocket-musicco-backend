import { Product } from './product.entity';

describe('Product Entity', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product();
  });

  it('deve estar definida a entidade Product', () => {
    // Teste de criação básica da entidade Product
    expect(product).toBeDefined();
    expect(product).toBeInstanceOf(Product);
  });

  it('deve gerar um ID automaticamente antes de inserir no banco', () => {
    // Teste de geração automática de ID com prefixo 'product-'
    product.generateId();
    
    expect(product.id).toBeDefined();
    expect(product.id).toMatch(/^product-/);
    expect(product.id.length).toBeGreaterThan(8); // 'product-' + nanoid
  });

  it('deve criar um produto com todas as propriedades obrigatórias', () => {
    // Teste de criação de produto com dados obrigatórios
    product.name = 'Guitarra Fender';
    product.price = 2999.99;
    product.stock = 10;
    product.generateId();
    
    expect(product.name).toBe('Guitarra Fender');
    expect(product.price).toBe(2999.99);
    expect(product.stock).toBe(10);
    expect(product.id).toMatch(/^product-/);
  });

  it('deve aceitar propriedades opcionais (description e imageUrl)', () => {
    // Teste de propriedades opcionais do produto
    product.name = 'Violão Yamaha';
    product.price = 899.50;
    product.stock = 5;
    product.description = 'Violão clássico de alta qualidade';
    product.imageUrl = 'https://example.com/violao.jpg';
    product.generateId();
    
    expect(product.description).toBe('Violão clássico de alta qualidade');
    expect(product.imageUrl).toBe('https://example.com/violao.jpg');
  });

  it('deve permitir criação de produto sem propriedades opcionais', () => {
    // Teste de criação de produto apenas com dados obrigatórios
    product.name = 'Bateria Básica';
    product.price = 1500.00;
    product.stock = 3;
    product.generateId();
    
    expect(product.description).toBeUndefined();
    expect(product.imageUrl).toBeUndefined();
    expect(product.name).toBe('Bateria Básica');
    expect(product.price).toBe(1500.00);
    expect(product.stock).toBe(3);
  });

  it('deve validar valores de preço corretos', () => {
    // Teste de validação de preços válidos
    const precosValidos = [0.01, 99.99, 1000.00, 9999.99];
    
    precosValidos.forEach(preco => {
      product.price = preco;
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.price).toBe('number');
    });
  });

  it('deve validar quantidades de estoque corretas', () => {
    // Teste de validação de estoque válido
    const estoquesValidos = [0, 1, 10, 100, 1000];
    
    estoquesValidos.forEach(estoque => {
      product.stock = estoque;
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(product.stock)).toBe(true);
    });
  });

  it('deve ter propriedades de auditoria (createdAt e updatedAt)', () => {
    // Teste de propriedades de auditoria temporal
    const now = new Date();
    product.createdAt = now;
    product.updatedAt = now;
    
    expect(product.createdAt).toBe(now);
    expect(product.updatedAt).toBe(now);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it('deve manter integridade dos dados após atualização de estoque', () => {
    // Teste de atualização de estoque mantendo outros dados
    product.name = 'Piano Digital';
    product.price = 3500.00;
    product.stock = 15;
    product.description = 'Piano digital 88 teclas';
    product.generateId();
    
    const idOriginal = product.id;
    const nomeOriginal = product.name;
    const precoOriginal = product.price;
    
    // Simulando venda - redução de estoque
    product.stock = 12;
    
    expect(product.id).toBe(idOriginal);
    expect(product.name).toBe(nomeOriginal);
    expect(product.price).toBe(precoOriginal);
    expect(product.stock).toBe(12);
  });

  it('deve permitir atualização de preço sem afetar outros dados', () => {
    // Teste de atualização de preço isolada
    product.name = 'Saxofone Alto';
    product.price = 4000.00;
    product.stock = 8;
    product.description = 'Saxofone alto profissional';
    product.generateId();
    
    const dadosOriginais = {
      id: product.id,
      name: product.name,
      stock: product.stock,
      description: product.description
    };
    
    // Atualizando apenas o preço
    product.price = 3800.00;
    
    expect(product.id).toBe(dadosOriginais.id);
    expect(product.name).toBe(dadosOriginais.name);
    expect(product.stock).toBe(dadosOriginais.stock);
    expect(product.description).toBe(dadosOriginais.description);
    expect(product.price).toBe(3800.00);
  });

  it('deve validar produto em estoque vs produto sem estoque', () => {
    // Teste de verificação de disponibilidade de estoque
    product.name = 'Flauta Transversal';
    product.price = 800.00;
    product.generateId();
    
    // Produto com estoque
    product.stock = 5;
    expect(product.stock).toBeGreaterThan(0);
    
    // Produto sem estoque
    product.stock = 0;
    expect(product.stock).toBe(0);
  });

  it('deve permitir limpeza de propriedades opcionais', () => {
    // Teste de remoção de propriedades opcionais
    product.name = 'Teclado MIDI';
    product.price = 1200.00;
    product.stock = 7;
    product.description = 'Teclado MIDI 61 teclas';
    product.imageUrl = 'https://example.com/teclado.jpg';
    product.generateId();
    
    // Removendo dados opcionais
    product.description = undefined;
    product.imageUrl = undefined;
    
    expect(product.description).toBeUndefined();
    expect(product.imageUrl).toBeUndefined();
    expect(product.name).toBe('Teclado MIDI'); 
    expect(product.price).toBe(1200.00); 
    expect(product.stock).toBe(7); 
  });

  it('deve calcular valor total baseado em quantidade', () => {
    // Teste de cálculo de valor total para quantidade específica
    product.name = 'Violino 4/4';
    product.price = 650.00;
    product.stock = 12;
    product.generateId();
    
    const quantidade = 3;
    const valorTotal = product.price * quantidade;
    
    expect(valorTotal).toBe(1950.00);
    expect(quantidade).toBeLessThanOrEqual(product.stock);
  });
});
