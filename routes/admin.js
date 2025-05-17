var express = require('express');
var router = express.Router();
const { conectarBD, contagemDashboard } = require('../banco');

//Debian
/* GETS */
router.get('/', function(req, res, next) {
  res.render('admin/admLoginForm');
});

router.get('/dashboard', async function(req,res){
  verificaLogin(res);

  const counts = await contagemDashboard();
 
  res.render('admin/dashboard',{
    nome: global.admnome,
    totalAdmins: counts.totalAdmins,
    totalTasks: counts.totalTasks,
    totalBoards: counts.totalBoards,
    totalUsers: counts.totalUsers
  });


});
router.get('/sair', function(req, res){
  delete global.admid;
  delete global.admemail;
  delete global.admnome;
  res.redirect('/admin')
});



/* POSTS */
router.post('/login', async function (req,res) {
  const email = req.body.email;
  const senha = req.body.senha;

  const admin = await global.banco.buscarAdmin({email, senha});
  if(admin.admid){
    global.admid = admin.admid;
    global.admemail = admin.admemail;
    global.admnome = admin.admnome;
    res.redirect('/admin/dashboard');
  }else{
    res.render('admin/admLoginForm', {erro: 'credenciais inválidas'});
  }
  
});





function verificaLogin(res){
  if (!global.admemail || global.admemail == ""){
    res.redirect('/admin')
  }
};




module.exports = router;
