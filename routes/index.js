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
  verificarSessão(res);
  global.quaid = req.params.id;
  verificarQuadro(res);
  res.render('board');

  
})

 





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

function verificarSessão(res)
{
  if(!global.usucodigo)
  {
    res.redirect('/');
  }
}
async function verificarQuadro(res) {
  const verificar = await global.banco.verificarQuadro(global.quaid, global.usucodigo);
  if(!verificar){
    res.redirect('/boards');
  }
  
}



/* ERROS */
module.exports = router;
