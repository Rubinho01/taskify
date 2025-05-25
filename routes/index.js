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








/* GET PÁGINA DE QUADROS */
router.get('/boards', function(req, res, next)
{
  verificarSessão(res);

  res.render('boards', {nome: global.usunome});
});

/* GET CRIAR QUADRO */
router.get('/boards/new', function(req, res, next)
{
  verificarSessão(res);
  
  res.render('boardForm', {nome: global.usunome, erro : null});
});


/* POST CRIAR QUADRO */
router.post('/boards/new', async function (req, res, next)
{
  verificarSessão(res);
  const {nomeQuadro, descQuadro} = req.body;
  
  if(!nomeQuadro || !descQuadro)
    {
      res.redirect('/boards/new', {
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
  return res.render('board',{quadro, quadrosUsuario, tarefas});
});

/*GET NOVA TAREFA*/
router.get('/board/:id/new-task', async function(req, res, next)
 {
   const quaid = parseInt(req.params.id);
   console.log('ENTROU EM TAFERA');
   return res.render('taskForm',{quaid});
})

router.post('/board/:id/new-task', async function (req,res,next)
{
  const quaid = parseInt(req.params.id);
  const {tarnome, tardesc} = req.body;
  console.log("ID recebido:", req.params.id);
  await global.banco.registrarTarefa(tarnome,tardesc,quaid);
  res.redirect(`/board/${quaid}`);

  
})



 
function verificarSessão(res)
{
  if(!global.usucodigo)
  {
    return res.redirect('/');
  }
}

async function verificarQuadro(quadro, usuario, res) {
  const verificar = await global.banco.verificarQuadro(quadro, usuario);
    if(!verificar){
    return res.redirect('/boards');
  }
  
}


/* ERROS */
module.exports = router;
