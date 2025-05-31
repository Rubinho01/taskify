const banco = require('../banco');

jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    query: jest.fn(),
    execute: jest.fn(),
    state: 'connected'
  }),
}));

describe('Funções do banco', () => {
  beforeEach(() => {
    global.conexao = {
      query: jest.fn(),
      execute: jest.fn(),
      state: 'connected',
    };
  });

  test('buscarAdmin retorna admin correto', async () => {
    const fakeAdmin = [{ admid: 1, admemail: 'teste@admin.com', admsenha: '123' }];
    global.conexao.query.mockResolvedValue([fakeAdmin]);

    const result = await banco.buscarAdmin({ email: 'teste@admin.com', senha: '123' });
    expect(result).toEqual(fakeAdmin[0]);
  });

  test('buscarAdmin se não encontrar, não retorna nada', async () => {
    global.conexao.query.mockResolvedValue([[]]);

    const result = await banco.buscarAdmin({ email: 'debian@admin.com', senha: '123' });
    expect(result).toEqual({});
  });

  test('adicionarAdmin insere dados corretamente', async () => {
    await banco.adicionarAdmin({ nome: 'João', email: 'joao@email.com', senha: 'senha123' });
    expect(global.conexao.query).toHaveBeenCalledWith(
      expect.stringContaining('Insert into admin'),
      ['João', 'joao@email.com', 'senha123']
    );
  });

  test('removerAdmin remove o admin com o id correto', async () => {
    await banco.removerAdmin(5);
    expect(global.conexao.query).toHaveBeenCalledWith(
      expect.stringContaining('delete from admin'),
      [5]
    );
  });

  test('admin_listarUsuarios retorna a lista de usuários', async () => {
    const fakeUsers = [{ usuid: 1, usunome: 'Maria' }];
    global.conexao.query.mockResolvedValue([fakeUsers]);

    const result = await banco.admin_listarUsuarios();
    expect(result).toEqual(fakeUsers);
  });

  test('admin_removerUsuarios remove o usuario com o id correto', async () => {
    await banco.admin_removerUsuarios(7);
    expect(global.conexao.query).toHaveBeenCalledWith(
      expect.stringContaining('delete from usuarios'),
      [7]
    );
  });

  test('contagemDashboard retorna os valores contados', async () => {
    const fakeCounts = {
      totalAdmins: 3,
      totalTasks: 10,
      totalBoards: 2,
      totalUsers: 15,
    };

    global.conexao.execute.mockResolvedValue([[fakeCounts]]);

    const result = await banco.contagemDashboard();
    expect(result).toEqual(fakeCounts);
  });

  test('Registro de usuário bem sucedido', async () => {
  global.conexao.query.mockResolvedValue([]);

  const usuario = {
    usunome: 'Anderson',
    usuemail: 'teste21@gmail.com',
    usunascimento: '01-01-2001',
    ususenha: '321',
  };

  await banco.registrarUsuario(usuario);
  expect(global.conexao.query).toHaveBeenCalledWith(
    'insert into usuarios(usunome,usuemail,usunascimento,ususenha) values (?,?,?,?)',
    [usuario.usunome, usuario.usuemail, usuario.usunascimento, usuario.ususenha]
  );
}); 

test('admin_listarQuadros retorna os quadros', async () => {
  const fakeBoards = [{ quaid: 1, quanome: 'Quadro 1' }];
  global.conexao.query.mockResolvedValue([fakeBoards]);

  const result = await banco.admin_listarQuadros();
  expect(result).toEqual(fakeBoards);
});

test('admin_removerQuadros remove os quadros com o id correto', async () => {
  await banco.admin_removerQuadros(2);
  expect(global.conexao.query).toHaveBeenCalledWith(
    expect.stringContaining('delete from quadros'),
    [2]
  );
});

test('listarAdmin retorna os admins', async () => {
  const fakeAdmins = [{ admid: 1, admnome: 'Debian' }];
  global.conexao.query.mockResolvedValue([fakeAdmins]);

  const result = await banco.listarAdmin();
  expect(result).toEqual(fakeAdmins);
});

test('registrarQuadro registra um quadro e retorna um ID', async () => {
  global.conexao.query.mockResolvedValue([{ insertID: 5 }]);

  const result = await banco.registrarQuadro('teste', 'teste');
  expect(global.conexao.query).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO quadros'),
    ['teste', 'teste']
  );
});

test('RegistrarquaUsu associa o quadro ao usuario', async ()=>{
  await banco.RegistrarQuaUsu(1,2);
  expect(global.conexao.query).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO quadros_usuarios'),
    [1,2]
  )

})

test('verificarQuadro retorna o quadro', async () =>{
  const fakeQua = [{quaid: 1, usuid: 1}];
  global.conexao.query.mockResolvedValue([fakeQua])

  const result = await banco.verificarQuadro('1,2')
  expect(result).toEqual(fakeQua[0]);


});

test('buscarQuaID retorna o quadro equivalente ao ID', async () =>
{
  const fakeQuadro = [{quaid: 2, quanome : 'TesteQua'}]
  global.conexao.query.mockResolvedValue([fakeQuadro])

  const result = await banco.buscarQuadroId(2);
  expect(result).toEqual(fakeQuadro[0])
}
);

test('buscarQuadroUsuario retorna os quadros referentes ao usuario', async () =>{
  const fakeLista = [{usuid: 1, quaid:2, quadnome : 'debian'}]
  global.conexao.query.mockResolvedValue([fakeLista])

  const result = await banco.buscarQuadrosUsuario(1);
  expect(result).toEqual(fakeLista);


});

test('registrarTarefa, registra a tarefa corretamente', async() =>{
  await banco.registrarTarefa('Teste','Teste',1);
  expect(global.conexao.query).toHaveBeenCalledWith(
    expect.stringContaining('INSERT INTO tarefas'),
    ['Teste', 'Teste', 1]
  )


});


test('buscarTarefasQuadro retorna as tarefas do quadro', async () =>{
  const fakeTasks = [{ tarid : 1, tarnome: 'Teste'}];
  global.conexao.query.mockResolvedValue([]);

  const result = await banco.buscarTarefasQuadro(1);
  expect(result).toEqual(fakeTasks[0])

});

test('buscarTarefaDOQuadro retora uma tarefa especifica', async() =>{
  const fakeTask = [{ tarid : 2, tarnome: 'Teste1'}];
  global.conexao.query.mockResolvedValue([fakeTask]);

  const result = await banco.buscarTarefaDoQuadro(2);
  expect(result).toEqual(fakeTask[0]);
  
});


test('atualizarStatusTarefa atualiza o status da tarefa', async() =>{
  await banco.atualizarStatusTarefa('concluido', 3);
  expect(global.conexao.query).toHaveBeenCalledWith(
    expect.stringContaining("UPDATE Tarefas SET tarstatus=? where tarid=?"),
    ['concluido', 3]
  );



});



  
});
