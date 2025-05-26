var express = require('express');
var router = express.Router();
const { conectarBD } = require('../banco');

function verificaLogin(res) {
  if (!global.admemail || global.admemail === "") {
    res.redirect('/admin');
  }
}


router.get('/', async function(req, res, next) {
  res.render('admin/admLoginForm');
});

router.get('/dashboard', async function(req, res) {
  verificaLogin(res);

  const counts = await global.banco.contagemDashboard();

  res.render('admin/dashboard', {
    nome: global.admnome,
    totalAdmins: counts.totalAdmins,
    totalTasks: counts.totalTasks,
    totalBoards: counts.totalBoards,
    totalUsers: counts.totalUsers
  });
});

router.get('/sair', async function(req, res) {
  delete global.admid;
  delete global.admemail;
  delete global.admnome;
  res.redirect('/admin');
});


router.post('/login', async function(req, res) {
  const email = req.body.email;
  const senha = req.body.senha;

  const admin = await global.banco.buscarAdmin({ email, senha });
  if (admin.admid) {
    global.admid = admin.admid;
    global.admemail = admin.admemail;
    global.admnome = admin.admnome;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/admLoginForm', { erro: 'credenciais inválidas' });
  }
});

router.get('/admins', async function(req, res) {
  const admins = await global.banco.listarAdmin();
  res.render('admin/admins', { admins, mensagem: null, sucesso: null });
});

router.post('/admins/novo', async function(req, res) {
  verificaLogin(res);
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    const admins = await global.banco.listarAdmin();
    return res.render('admin/admins', {
      admins,
      mensagem: 'Por favor, preencha todos os campos.',
      sucesso: false
    });
  }

  await global.banco.adicionarAdmin({ nome, email, senha });
  const admins = await global.banco.listarAdmin();
  res.render('admin/admins', {
    admins,
    mensagem: 'Administrador adicionado com sucesso!',
    sucesso: true
  });
});

router.post('/admins/remover/:id', async function(req, res) {
  verificaLogin(res);
  const id = req.params.id;

  await global.banco.removerAdmin(id);
  res.redirect('/admin/admins');
});

router.get('/usuarios', async function(req,res) {
  const usuarios = await global.banco.admin_listarUsuarios();
  res.render('admin/usuarios', { usuarios, mensagem: null, sucesso: null })

})

router.post('/usuarios/remover/:id', async function (req, res)  {
  const id = req.params.id;
  await global.banco.admin_removerUsuarios(id);
  res.redirect('/admin/usuarios');
});

router.get('/quadros', async (req, res) => {
  const boards = await global.banco.admin_listarQuadros();
  res.render('admin/quadros', { boards, mensagem: null, sucesso: null });
});

router.post('/boards/remover/:id', async (req, res) => {
  const id = req.params.id;
  await global.banco.admin_removerQuadros(id);
  res.redirect('/admin/quadros');
});


module.exports = router;
