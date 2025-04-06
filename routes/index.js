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



/* ERROS */
module.exports = router;
