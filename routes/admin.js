var express = require('express');
var router = express.Router();
//Debian
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admLoginForm');
});

router.post('/login', async function (req,res) {
  const email = req.body.email;
  const senha = req.body.senha;

  const admin = await global.banco.buscarAdmin({email, senha});
  if(admin.admid){
    global.admid = admin.admid;
    global.admemail = admin.admemail;
    res.redirect('/admin/dashbord');
  }else{
    res.render('admin/admLoginForm', {erro: 'credenciais inválidas'});
  }
  
});





module.exports = router;
