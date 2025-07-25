var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Taskify' });
});


/* GET FORMULARIO DE LOGIN. */
router.get('/login', function(req, res, next)
{
  res.render('loginForm', {erro: null});
});

/* GET FORMULARIO DE REGISTRO. */
router.get('/register', function(req, res, next)
{
  res.render('registerForm');
});

/* POST FORMULARIO DE LOGIN */
router.post('/login', async function(req, res ,next) 
{
  const email = req.body.email;
  const senha = req.body.senha;

  const usuario = await global.banco.buscarUsuario({email, senha});
  console.log(usuario);


  if (usuario.usuid)
  {
    global.usucodigo = usuario.usuid;
    global.usuemail = usuario.usuemail;
    global.usunome = usuario.usunome;
    res.redirect('/boards');
  }
  else
  {
    res.render('loginForm', {erro: 'Credenciais Inválidas!'});
  }
  
});

/* POST FORMULARIO DE REGISTRO */
router.post('/register', async function(req, res, next)
{
  const nome = req.body.nome;
  const email = req.body.email;
  const nasc = req.body.nasc;
  const senha = req.body.senha;

  await global.banco.registrarUsuario({nome, email, nasc, senha});

  res.redirect('/login');
});



router.get('/boards', verificarSessao, async function (req, res){
  const usuid = global.usucodigo;
  const quadrosUsuario = await global.banco.buscarQuadrosDoUsuario(global.usucodigo);
  global.quadrosUsuario = await global.banco.buscarQuadrosDoUsuario(global.usucodigo);
  const quadrosFavoritos = await global.banco.listarQuadrosFavoritos(global.usucodigo)
  console.log(quadrosUsuario);
  global.notificacoes = await global.banco.verificarNotificacoes(global.usucodigo);
  console.log("Notificações: " + global.notificacoes);
  const amizades = await global.banco.buscarAmigosUsuario(global.usucodigo);
  global.amigos = [];
  for (const amizade of amizades) {
    const amigoId = amizade.amienvia === global.usucodigo ? amizade.amirecebe : amizade.amienvia;
    const amigo = await global.banco.buscarUsuarioPorId(amigoId);
    if (amigo) {
      global.amigos.push(amigo);
    }
  }
  res.render('boards', { 
    nome: global.usunome, quadrosUsuario, quadro: null, notificacoes: global.notificacoes });
});

/* GET CRIAR QUADRO */
router.get('/boards/new', verificarSessao, async function(req, res, next)
{

  const quadrosUsuario = await global.banco.buscarQuadrosUsuario(global.usucodigo);
  
  res.render('boardForm', {
    nome: global.usunome,
    quadrosUsuario,
    erro: null
  });
});



/* POST CRIAR QUADRO */
router.post('/boards/new', async function (req, res, next)
{
  const {nomeQuadro, descQuadro} = req.body;
  
  if(!nomeQuadro || !descQuadro)
    {
      res.render('/boards/new', {
        nome: global.usunome,
        erro : "preencha todos os campos"
      });
    } 
  
  else 
  {
    const quaid = await global.banco.registrarQuadro(nomeQuadro, descQuadro);
    await global.banco.RegistrarQuaUsu(quaid, global.usucodigo);
    res.redirect('/boards');
  }

});


/*GET QUADRO*/
router.get('/board/:id', verificarSessao, async function(req, res, next) {
  const quaid = parseInt(req.params.id);
  verificarQuadro(quaid, global.usucodigo, res);
  global.quadro = await global.banco.buscarQuadroId(quaid);
  console.log(quadro);
  const quadrosUsuario = await global.banco.buscarQuadrosUsuario(global.usucodigo);
  console.log(quadrosUsuario);
  const tarefas = await global.banco.buscarTarefasQuadro(quaid);
  console.log("TAREFAS:");
  console.log(tarefas);
  return res.render('board',{nome: global.usunome, quadro, quadrosUsuario, tarefas, notificacoes: global.notificacoes});
});

/*GET NOVA TAREFA*/
router.get('/board/:id/new-task', async function(req, res, next)
 {
   const quaid = parseInt(req.params.id);
   console.log('ENTROU EM TAFERA');
   return res.render('taskForm',{quaid});
})

/*POST NOVA TAREFA*/
router.post('/board/:id/new-task', verificarSessao, async function (req, res, next) {
  const quaid = parseInt(req.params.id);
  const { tarnome, tardesc } = req.body;
  const tarusu = global.usucodigo;
  await global.banco.registrarTarefa(tarnome, tardesc, quaid, tarusu);
  res.redirect(`/board/${quaid}`);
});

router.get('/board/:quaid/edit', verificarSessao, async (req, res) => {
  const quaid = parseInt(req.params.quaid);
  const usuid = global.usucodigo;

  const podeEditar = await global.banco.verificarQuadro(quaid, usuid);
  if (!podeEditar) return res.redirect('/boards');

  const quadro = await global.banco.buscarQuadroId(quaid);
  if (!quadro) return res.redirect('/boards');
  const amigos = await global.banco.buscarAmigosNaoNoQuadro(global.usucodigo, quaid);

  res.render('boardEdit', { quadro, quaid, erro: null, amigos});
});

router.post('/board/:quaid/edit', verificarSessao, async (req, res) => {
  const quaid = parseInt(req.params.quaid);
  const usuid = global.usucodigo;

  const podeEditar = await global.banco.verificarQuadro(quaid, usuid);
  if (!podeEditar) return res.redirect('/boards');

  const { nomeQuadro, descQuadro } = req.body;

  if (!nomeQuadro || nomeQuadro.trim() === '') {
    const quadro = await global.banco.buscarQuadroId(quaid);
    return res.render('boardEdit', { quadro, quaid, erro: 'O nome do quadro é obrigatório.' });
  }

  try {
    await global.banco.editarQuadro(quaid, nomeQuadro.trim(), descQuadro.trim());
    res.redirect(`/board/${quaid}`);
  } catch (err) {
    console.error(err);
    const quadro = await global.banco.buscarQuadroId(quaid);
    res.render('boardEdit', { quadro, quaid, erro: 'Erro ao atualizar quadro. Tente novamente.' });
  }
});

router.get('/board/:quaid/delete', verificarSessao, async (req, res) => {
  const quaid = parseInt(req.params.quaid);
  const usuid = global.usucodigo;
  const podeExcluir = await global.banco.verificarQuadro(quaid, usuid);
  if (!podeExcluir) return res.redirect('/boards');

  try {
    await global.banco.deletarQuadro(quaid);
    res.redirect('/boards');
  } catch (err) {
    console.error(err);
    res.redirect(`/board/${quaid}`);
  }
});

router.get('/board/:quaid/task/:tarid', verificarSessao, async function (req, res, next)
{
  const {quaid, tarid} = req.params;
  verificarQuadro(quaid, global.usucodigo, res);

  const tarefa = await global.banco.buscarTarefaDoQuadro(quaid, tarid);
  if (!tarefa) res.redirect('/boards');

  res.render('task', {nome: usunome, tarefa, quaid});
})

router.post('/task/:id/tarstauts', async function(req, res)
{
  const tarid = parseInt(req.params.id);
  const newStatus = parseInt(req.body.newStatus);

  await banco.atualizarStatusTarefa(newStatus, tarid);
  res.redirect('back');
});

router.get('/task/:id/delete', verificarSessao, async function(req, res, next) {
  const tarid = parseInt(req.params.id);
  const quaid = await global.banco.buscarQuadroDaTarefa(tarid);
  if (!quaid) {
    return res.redirect('/boards');
  }
  await verificarQuadro(quaid, global.usucodigo, res);

  await global.banco.deletarTarefa(tarid);
  res.redirect(`/board/${quaid}`);
});

router.get('/task/:id/edit', verificarSessao, async function (req, res, next) {
  const tarid = parseInt(req.params.id);
  const quaid = await global.banco.buscarQuadroDaTarefa(tarid);
  if (!quaid) {
    return res.redirect('/boards');
  }
  await verificarQuadro(quaid, global.usucodigo, res);
  const tarefa = await global.banco.buscarTarefaDoQuadro(quaid, tarid);
  if (!tarefa) {
    return res.redirect('/boards');
  }
  res.render('taskEdit', { tarefa, quaid });
});

router.post('/task/:id/edit', verificarSessao, async function (req, res, next) {
  const tarid = parseInt(req.params.id);
  const { tarnome, tardesc } = req.body;
  const quaid = await global.banco.buscarQuadroDaTarefa(tarid);
  if (!quaid) {
    return res.redirect('/boards');
  }
  await verificarQuadro(quaid, global.usucodigo, res);
  await global.banco.editarTarefa(tarid, tarnome, tardesc);
  res.redirect(`/board/${quaid}/task/${tarid}`);
});


router.get('/dashboard', verificarSessao, async function(req, res) 
{
  const usuid = global.usucodigo;
  const contagem = await global.banco.contagemDashboardUsuario(usuid);

 res.render('dashboard', {
  nome: global.usunome,
  totalQuadros: contagem.totalQuadros,
  totalTarefas: contagem.totalTarefas,
  tarefasConcluidas: contagem.tarefasConcluidas,
  tarefasNaoConcluidas: contagem.tarefasNaoConcluidas,
  notificacoes: global.notificacoes
});
});

router.get('/sair', verificarSessao, async function(req, res) 
{
  delete global.usucodigo
  delete global.usuemail
  delete global.usunome
  res.redirect('/');
});

router.get('/profile/:id', verificarSessao, async function(req, res, next)
{
  const usuid = parseInt(req.params.id);
  const usuario = await global.banco.buscarUsuarioPorId(usuid);
  const quadrosUsuario = await global.banco.buscarQuadrosDoUsuario(global.usucodigo);
  const verificarAmizade = await global.banco.verificarAmizade(global.usucodigo, usuid);
  if(usuario)
    return res.render('profile', {usuario, quadrosUsuario, nome: global.usunome, quadro:null, verificarAmizade});
});

router.post('/profile/:id/add-friend', verificarSessao, async function(req, res, next)
{
  const amiId = parseInt(req.params.id);
  await global.banco.registrarPedidoAmizade(global.usucodigo, amiId);
  res.redirect('back');
  
})

router.post('/profiles-find', verificarSessao, async function(req,res,next)
 {
    const nome = req.body.nome;
    const usuarios = await global.banco.buscarUsuarioPorNome(nome);
    res.render('profiles-by-name', {usuarios, nome: global.usunome, quadrosUsuario, quadro: null, notificacoes: global.notificacoes});
  
})

router.get('/friends', verificarSessao, async function (req, res, next)
{
  const amizades = await global.banco.buscarAmigosUsuario(global.usucodigo);
  global.amigos = [];
  console.log(amizades);

  if(!amizades && amizades.lenght<1)
  {
    return res.render('friends', {amigos: global.amigos, quadrosUsuario: global.quadrosUsuario, quadro: null, nome:global.usunome, erro: null, notificacoes: global.notificacoes});
  }

  for (const amizade of amizades) {
    const amigoId = amizade.amienvia === global.usucodigo ? amizade.amirecebe : amizade.amienvia;
    const amigo = await global.banco.buscarUsuarioPorId(amigoId);
    if (amigo) {
      global.amigos.push(amigo);
    }
  }
  res.render('friends', {amigos: global.amigos, quadrosUsuario: global.quadrosUsuario, quadro: null, nome:global.usunome, erro: null});
  
})

router.post('/friends/remove/:id', verificarSessao, async function(req, res, next)
{
  const amiid = parseInt(req.params.id);
  const verificarAmizade = await global.banco.verificarAmizade(global.usucodigo, amiid);
  if (!verificarAmizade && verificarAmizade == ""){
    return res.redirect('/friends', {amigos: global.amigos, quadrosUsuario: global.quadrosUsuario, quadro: null, nome:global.usunome, erro: amiid + "aren't your friend"})
  }
  await global.banco.removerAmizade(global.usucodigo,amiid);
  return res.redirect('back');
  
});

router.get('/friend-requests', verificarSessao, async function(req, res, next) {
  const amizadesPendentes = await global.banco.verificarAmizadesPendentes(global.usucodigo);
  console.log(amizadesPendentes);

  if(!amizadesPendentes && amizadesPendentes.lenght<1){
    return res.render('friend-requests', {amizadesPendentes: null, quadrosUsuario: global.quadrosUsuario, quadro: null, nome:global.usunome, erro: "You don't have friend requests now"});
  }
  res.render('friend-requests', {amizadesPendentes, quadrosUsuario: global.quadrosUsuario, quadro: null, nome:global.usunome, erro: null});
  
})

router.post('/friend-requests/decline/:id', verificarSessao, async function(req, res, next) {
  const amiid = parseInt(req.params.id);
  const verificarPedido = await global.banco.verificarPedidoDeAmizade(amiid, global.usucodigo);
  if(verificarPedido === false) return res.redirect('/friend-requests');
  await global.banco.removerAmizade(global.usucodigo,amiid);
  res.redirect('back');
  
});

router.post('/friend-requests/accept/:id', verificarSessao, async function(req, res, next) {
  const amiid = parseInt(req.params.id);
  const verificarPedido = await global.banco.verificarPedidoDeAmizade(amiid, global.usucodigo);
  if(verificarPedido === false) return res.redirect('/friend-requests');
  await global.banco.aceitarPedidoDeAmizade(amiid, global.usucodigo);
  res.redirect('back');
  
  });



//MIDDLEWARES
function verificarSessao(req, res, next) {
  if (!global.usucodigo) {
    return res.redirect('/');
  }
  next();
}

 async function verificarQuadro(quadro, usuario, res) {
  const verificar = await global.banco.verificarQuadro(quadro, usuario);
    if(!verificar){
    return res.redirect('/boards');
  }
  
}



router.get('/perfil', verificarSessao, async function(req, res, next) {
  const usuario = await global.banco.buscarUsuarioPorId(global.usucodigo);
  const quadrosUsuario = await global.banco.buscarQuadrosDoUsuario(global.usucodigo); 

  res.render('perfil', {
    usuario,
    nome: usuario.usunome, 
    quadrosUsuario,       
    quadro: null,          
    mensagem: null,
    sucesso: null
  });
});

router.post('/perfil/atualizar', verificarSessao, async function(req, res, next) {
    const usuid = global.usucodigo;
    const { nome, email, senha, bio, senhaAtual } = req.body;

    const usuario = await global.banco.buscarUsuarioPorId(usuid);
    const quadrosUsuario = await global.banco.buscarQuadrosDoUsuario(usuid);

    if (!senhaAtual || senhaAtual !== usuario.ususenha) {
      return res.render('perfil', {
        usuario,
        nome: usuario.usunome,
        quadrosUsuario,
        quadro: null,
        mensagem: 'Incorrect current password. No changes were made.',
        sucesso: false
      });
    }

    let mensagens = [];

    if (nome && nome !== usuario.usunome) {
      await global.banco.atualizarNome(usuid, nome);
      mensagens.push('Name updated successfully!');
    }

    if (email && email !== usuario.usuemail) {
      await global.banco.atualizarEmail(usuid, email);
      mensagens.push('E-mail updated successfully!');
    }

    if (senha) {
      await global.banco.atualizarSenha(usuid, senha);
      mensagens.push('Password updated successfully!');
    }

    if (bio !== undefined && bio !== usuario.usubio) {
      await global.banco.atualizarBio(usuid, bio)
      mensagens.push('Biography updated successfully!')
    }

    const usuarioAtualizado = await global.banco.buscarUsuarioPorId(usuid);

    res.render('perfil', {
      usuario: usuarioAtualizado,
      nome: usuarioAtualizado.usunome,
      quadrosUsuario,
      quadro: null,
      mensagem: mensagens.length ? mensagens.join(' ') : 'No changes were made.',
      sucesso: true
    });
});

router.get('/perfilview', verificarSessao, async function (req, res, next) {
  const usuid = global.usucodigo;
  const usuario = await global.banco.buscarUsuarioPorId(usuid);
 res.render('perfilview', {
    usuario,
    nome: usuario.usunome, 
    quadrosUsuario,       
    quadro: null,          
    mensagem: null,
    sucesso: null, notificacoes: global.notificacoes
  });
});

router.post('/board/:id/favorite', async (req, res) => {
  const usuid = global.usucodigo;
  const quaid = parseInt(req.params.id);
  const { favorito } = req.body;

  try {
    if (favorito) {
      await banco.adicionarFavorito(usuid, quaid);
    } else {
      await banco.removerFavorito(usuid, quaid);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar favorito');
  }
});

router.post('/add/board/:quaid/user/:id', verificarSessao, async (req, res) => {
  const { quaid, id } = req.params;
  const amizadeExiste = await global.banco.verificarAmizade(global.usucodigo, id);
  if (amizadeExiste) {
    await global.banco.adicionarUsuarioAoQuadro(quaid, id);
  }
  res.redirect('back');
});



router.get('/favorites', verificarSessao, async function (req, res) {
  const usuid = global.usucodigo;

  const todosQuadros = await global.banco.buscarQuadrosDoUsuario(usuid);
  const quadrosFavoritos = todosQuadros.filter(q => q.favorito === true);

  global.notificacoes = await global.banco.verificarNotificacoes(usuid);

  res.render('boards', {
    nome: global.usunome,
    quadrosUsuario: quadrosFavoritos,
    quadro: null,
    notificacoes: global.notificacoes
  });
});


/* ERROS */
module.exports = router;
