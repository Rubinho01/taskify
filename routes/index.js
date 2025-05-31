var express = require('express');
var router = express.Router();
const { conectarBD } = require('../banco');

function verificarSessão(res)
{
  if(!global.usucodigo)
  {
    return res.redirect('/');
  }
}




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



router.get('/boards', async function (req, res){
  const usuid = global.usucodigo;
  const quadrosUsuario = await global.banco.buscarQuadrosDoUsuario(global.usucodigo);
  console.log(quadrosUsuario);
  res.render('boards', { 
    nome: global.usunome,
    quadrosUsuario, quadro: null });
});

/* GET CRIAR QUADRO */
router.get('/boards/new', async function(req, res, next)
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
router.get('/board/:id', async function(req, res, next) {
  const quaid = parseInt(req.params.id);
  verificarQuadro(quaid, global.usucodigo, res);
  global.quadro = await global.banco.buscarQuadroId(quaid);
  console.log(quadro);
  const quadrosUsuario = await global.banco.buscarQuadrosUsuario(global.usucodigo);
  console.log(quadrosUsuario);
  const tarefas = await global.banco.buscarTarefasQuadro(quaid);
  console.log("TAREFAS:");
  console.log(tarefas);
  return res.render('board',{nome: global.usunome, quadro, quadrosUsuario, tarefas});
});

/*GET NOVA TAREFA*/
router.get('/board/:id/new-task', async function(req, res, next)
 {
   const quaid = parseInt(req.params.id);
   console.log('ENTROU EM TAFERA');
   return res.render('taskForm',{quaid});
})

/*POST NOVA TAREFA*/
router.post('/board/:id/new-task', async function (req, res, next) {
  const quaid = parseInt(req.params.id);
  const { tarnome, tardesc } = req.body;
  const tarusu = global.usucodigo;
  await global.banco.registrarTarefa(tarnome, tardesc, quaid, tarusu);
  res.redirect(`/board/${quaid}`);
});



/*GET TAREFA*/
router.get('/board/:quaid/task/:tarid', async function (req, res, next)
{
  const {quaid, tarid} = req.params;
  verificarQuadro(quaid, global.usucodigo, res);
  
  //VERIFICAR TAREFA
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

 async function verificarQuadro(quadro, usuario, res) {
  const verificar = await global.banco.verificarQuadro(quadro, usuario);
    if(!verificar){
    return res.redirect('/boards');
  }
  
}

router.get('/dashboard', async function(req, res) {
  const usuid = global.usucodigo;
  const contagem = await global.banco.contagemDashboardUsuario(usuid);

  res.render('dashboard', {
    nome: global.usunome,
    totalQuadros: contagem.totalQuadros,
    totalTarefas: contagem.totalTarefas
  });
});

router.get('/sair', async function(req, res) {
  delete global.usucodigo
  delete global.usuemail
  delete global.usunome
  res.redirect('/');
});
/* ERROS */
module.exports = router;
