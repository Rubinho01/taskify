var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Taskify' });
});


/* GET FORMULARIO DE LOGIN. */
router.get('/login', function(req, res, next){
  res.render('loginForm');
});

/* GET PÁGINA DE QUADROS */
router.get('/boards', function(req, res, next){
  verificarSessão(res);
  res.render('boards');
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
    res.redirect('/boards');
  }
  else
  {
    res.redirect('/');
  }
  
});

function verificarSessão(res)
{
  if(!global.usucodigo)
  {
    res.redirect('/');
  }
}

module.exports = router;
