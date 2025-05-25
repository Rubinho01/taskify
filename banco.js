const mysql = require('mysql2/promise');
async function conectarBD() 
{
    if (global.conexao && global.conexao.state !== 'disconnected')
    {
        return global.conexao;
    }

    const conexao = mysql.createConnection
    (
        {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database : 'taskify'
        }
    )
    
    global.conexao = conexao;
    return global.conexao;
}

async function buscarUsuario(usuario) 
{
    const conexao = await conectarBD();

    const sql = "select * from usuarios where usuemail=? and ususenha=?;";
    const [usuarioEncontrado] = await conexao.query(sql, [usuario.email, usuario.senha]);
    if (usuarioEncontrado && usuarioEncontrado.length > 0)
    {
        return usuarioEncontrado[0];

    }
    else
    {
        return {};
    }

    
}

async function registrarUsuario(usuario)
{
    const conexao = await conectarBD();
    const sql = "insert into usuarios(usunome, usuemail, usunascimento, ususenha) values (?,?,?,?);"
    await conexao.query(sql, [usuario.nome, usuario.email, usuario.nasc, usuario.senha]);
}

async function buscarAdmin(admin){
    const conexao = await conectarBD();
    const sql = "select * from admin where admemail=? and admsenha=?;";
    const[adminEncontrado] = await conexao.query(sql,[admin.email, admin.senha]);
    if (adminEncontrado && adminEncontrado.length > 0){
        return adminEncontrado[0];
    }else{
        return{};
    }

}

async function contagemDashboard(){
    const conexao = await conectarBD();
   const [[counts]] = await conexao.execute(`
    select 
      (select count(*) from admin) as totalAdmins,
      (select count(*) from tarefas) as totalTasks,
      (select count(*) from quadros) as totalBoards,
      (select count(*) from usuarios) as totalUsers
  `);
    return counts;
}

async function registrarQuadro(nome, descricao) {
    const conex = await conectarBD();
    const sql = "INSERT INTO quadros(quanome, quadesc) VALUES (?, ?);";
    const [result] = await conex.query(sql, [nome, descricao]);
    return result.insertId;
}

async function RegistrarQuaUsu(quaid, usuid) {
    const conex = await conectarBD();
    const sql = "INSERT INTO quadros_usuarios VALUES (?,?);"
    await conex.query(sql,[quaid, usuid]);
    
}
async function verificarQuadro(quaid, usuid){
    const conex = await conectarBD();
    const sql = "SELECT * FROM quadros_usuarios where quaid=? and usuid=?;";
    const [quadroEncontrado] = await conex.query(sql,[quaid, usuid]);
    return quadroEncontrado[0];
    
}

async function buscarQuadroId(quaid) {
    const conex = await conectarBD();
    const sql = "SELECT * FROM quadros where quaid=?;";
    const [quadro] = await conex.query(sql,[quaid]);
    return quadro[0];

    
}

async function buscarQuadrosUsuario(usuid) {
    const conex = await conectarBD();
    const sql = `SELECT u.usuid, q.quaid, q.quanome from usuarios u
    inner join quadros_usuarios qu on u.usuid = qu.usuid
    inner join quadros q on q.quaid = qu.quaid
    where u.usuid=?`;
    const [quadrosUsuario] = await conex.query(sql, [usuid]);
    return quadrosUsuario;    
}

async function registrarTarefa(tarnome,tardesc,quaid) {
    const conex = await conectarBD();
    const sql = "INSERT INTO tarefas(tarnome,tardesc,tarqua) VALUES (?,?,?)"
    await conex.query(sql,[tarnome,tardesc,quaid]);

}

async function buscarTarefasQuadro(tarqua) {
    const conex = await conectarBD();
    const sql = "select * from tarefas where tarqua=?";
    const [tarefasQuadro] = await conex.query(sql,[tarqua]);
    if (tarefasQuadro) return tarefasQuadro;
    else return {};
}



    module.exports = {buscarUsuario, registrarUsuario, buscarAdmin, registrarQuadro, 
        RegistrarQuaUsu, verificarQuadro, contagemDashboard, buscarQuadroId, buscarQuadrosUsuario,
        registrarTarefa, buscarTarefasQuadro
    };
