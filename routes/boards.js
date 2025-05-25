var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next)
{
  verificarSessão(res);

  res.render('boards', {nome: global.usunome});
});

/* GET CRIAR QUADRO */
router.get('/new', function(req, res, next)
{
  verificarSessão(res);
  
  res.render('boardForm', {nome: global.usunome, erro : null});
});


/* POST CRIAR QUADRO */
router.post('new', async function (req, res, next)
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
router.get('/:id', async function(req, res, next) {
  const quaid = parseInt(req.params.id);
  verificarQuadro(quaid, global.usucodigo, res);
  const quadro = await global.banco.buscarQuadroId(quaid);
  console.log(quadro);
  const quadrosUsuario = await global.banco.buscarQuadrosUsuario(global.usucodigo);
  console.log(quadrosUsuario);
  return res.render('board',{quadro, quadrosUsuario});
});

 
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