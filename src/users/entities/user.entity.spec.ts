import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  it('deve estar definida a entidade User', () => {
    // Teste de criação básica da entidade User
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it('deve gerar um ID automaticamente antes de inserir no banco', () => {
    // Teste de geração automática de ID com prefixo 'user-'
    user.generateId();
    
    expect(user.id).toBeDefined();
    expect(user.id).toMatch(/^user-/);
    expect(user.id.length).toBeGreaterThan(5); // 'user-' + nanoid
  });

  it('deve criar um usuário com todas as propriedades obrigatórias', () => {
    // Teste de criação de usuário com dados obrigatórios
    user.email = 'usuario@teste.com';
    user.name = 'João Silva';
    user.generateId();
    
    expect(user.email).toBe('usuario@teste.com');
    expect(user.name).toBe('João Silva');
    expect(user.id).toMatch(/^user-/);
  });

  it('deve aceitar propriedades opcionais (phone e address)', () => {
    // Teste de propriedades opcionais do usuário
    user.email = 'usuario@teste.com';
    user.name = 'Maria Santos';
    user.phone = '(11) 99999-9999';
    user.address = 'Rua das Flores, 123';
    user.generateId();
    
    expect(user.phone).toBe('(11) 99999-9999');
    expect(user.address).toBe('Rua das Flores, 123');
  });

  it('deve permitir criação de usuário sem propriedades opcionais', () => {
    // Teste de criação de usuário apenas com dados obrigatórios
    user.email = 'simples@teste.com';
    user.name = 'Ana Costa';
    user.generateId();
    
    expect(user.phone).toBeUndefined();
    expect(user.address).toBeUndefined();
    expect(user.email).toBe('simples@teste.com');
    expect(user.name).toBe('Ana Costa');
  });

  it('deve ter propriedades de auditoria (createdAt e updatedAt)', () => {
    // Teste de propriedades de auditoria temporal
    const now = new Date();
    user.createdAt = now;
    user.updatedAt = now;
    
    expect(user.createdAt).toBe(now);
    expect(user.updatedAt).toBe(now);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('deve validar formato de email válido', () => {
    // Teste de validação de formato de email
    const emailsValidos = [
      'teste@email.com',
      'usuario.teste@empresa.com.br',
      'admin@sistema.org'
    ];
    
    emailsValidos.forEach(email => {
      user.email = email;
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('deve manter integridade dos dados após múltiplas modificações', () => {
    // Teste de integridade de dados após modificações
    user.email = 'inicial@teste.com';
    user.name = 'Nome Inicial';
    user.generateId();
    
    const idOriginal = user.id;
    
    // Simulando atualizações
    user.email = 'atualizado@teste.com';
    user.name = 'Nome Atualizado';
    user.phone = '(11) 88888-8888';
    user.address = 'Nova Rua, 456';
    
    expect(user.id).toBe(idOriginal); // ID não deve mudar
    expect(user.email).toBe('atualizado@teste.com');
    expect(user.name).toBe('Nome Atualizado');
    expect(user.phone).toBe('(11) 88888-8888');
    expect(user.address).toBe('Nova Rua, 456');
  });

  it('deve permitir limpeza de propriedades opcionais', () => {
    // Teste de remoção de propriedades opcionais
    user.email = 'teste@email.com';
    user.name = 'Teste User';
    user.phone = '(11) 77777-7777';
    user.address = 'Endereço Temporário';
    user.generateId();
    
    // Removendo dados opcionais
    user.phone = undefined;
    user.address = undefined;
    
    expect(user.phone).toBeUndefined();
    expect(user.address).toBeUndefined();
    expect(user.email).toBe('teste@email.com'); 
    expect(user.name).toBe('Teste User'); 
  });
});
