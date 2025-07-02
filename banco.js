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

async function registrarUsuario(usuario) {
  const conexao = await conectarBD()
  const sql = 'insert into usuarios(usunome,usuemail,usunascimento,ususenha) values (?,?,?,?)';
    await conexao.execute(sql,[usuario.nome,usuario.email,usuario.nasc, usuario.senha])
  
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

};

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
};

async function listarAdmin(){
    const conexao = await conectarBD();
    const [lista] = await conexao.query("select * from admin");
    return lista;
}

async function adicionarAdmin(admin){
    const conexao = await conectarBD();
    const sql = "Insert into admin (admnome,admemail,admsenha) values (?,?,?)";
    await conexao.query(sql,[admin.nome, admin.email, admin.senha]);
}

async function removerAdmin(id){
    const conexao = await conectarBD();
    const sql = "delete from admin where admid = ?";
    await conexao.query(sql,[id]);

}


async function admin_listarUsuarios(){
    const conexao = await conectarBD();
    const [lista] = await conexao.query("select * from usuarios");
    return lista;
}


async function admin_removerUsuarios(id){
  const conexao = await conectarBD();

  const sql0 = "DELETE FROM tarefas WHERE tarusu = ?";
  await conexao.query(sql0, [id]);

  const sql1 = "DELETE FROM quadros_usuarios WHERE usuid = ?";
  await conexao.query(sql1, [id]);

  const sql2 = "DELETE FROM usuarios WHERE usuid = ?";
  await conexao.query(sql2, [id]);
}


async function admin_listarQuadros(){
    const conexao = await conectarBD();
    const [lista] = await conexao.query("select * from quadros");
    return lista;
}


async function admin_removerQuadros(quaid) {
  const conexao = await conectarBD();

  const sql1 = 'DELETE FROM quadros_usuarios WHERE quaid = ?';
  await conexao.query(sql1, [quaid]);

  const sql2 = 'DELETE FROM quadros WHERE quaid = ?';
  await conexao.query(sql2, [quaid]);
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

async function registrarTarefa(tarnome,tardesc,quaid,tarusu) {
    const conex = await conectarBD();
    const sql = "INSERT INTO tarefas(tarnome,tardesc,tarqua,tarusu) VALUES (?,?,?,?)"
    await conex.query(sql,[tarnome,tardesc,quaid,tarusu]);

}

async function buscarTarefasQuadro(tarqua) {
    const conex = await conectarBD();
    const sql = "select * from tarefas where tarqua=?";
    const [tarefasQuadro] = await conex.query(sql,[tarqua]);
    if (tarefasQuadro) return tarefasQuadro;
    else return {};
}

async function buscarTarefaDoQuadro(quaid, tarid){
    const conex = await conectarBD();
    const sql = "SELECT * FROM tarefas WHERE tarqua=? and tarid=?";
    const [tarefa] = await conex.query(sql,[quaid, tarid]);
    if(tarefa) return tarefa[0];
    else return {};
    
}

async function atualizarStatusTarefa(tarstatus, tarid) {
    const conex = await conectarBD();
    const sql = "UPDATE Tarefas SET tarstatus=? where tarid=?";
    await conex.query(sql,[tarstatus, tarid]);   
}

async function buscarQuadrosDoUsuario(usuid) {
  const sql = `
    SELECT q.quaid, q.quanome, q.quadesc, t.tarid, t.tarnome, t.tarstatus
    FROM quadros_usuarios qu
    JOIN quadros q ON qu.quaid = q.quaid
    LEFT JOIN tarefas t ON q.quaid = t.tarqua
    WHERE qu.usuid = ?
    ORDER BY q.quaid, t.tarid;
  `;

  const conexao = await conectarBD();
  const [rows] = await conexao.execute(sql, [usuid]);

  const quadros = new Map();

  for (const item of rows) {
    if (!quadros.has(item.quaid)) {
      quadros.set(item.quaid, {
        id: item.quaid,
        nome: item.quanome,
        descricao: item.quadesc,
        tarefas: []
      });
    }

    if (item.tarid) {
      quadros.get(item.quaid).tarefas.push({
        id: item.tarid,
        nome: item.tarnome,
        status: item.tarstatus
      });
    }
  }

  return Array.from(quadros.values());
}

async function buscarUsuarioPorId(id) {
    const conex = await conectarBD();
    const sql = "SELECT * FROM usuarios where usuid=?;";
    const [usuario] = await conex.query(sql, [id]);
    if(usuario) return usuario[0];
    else {};
    
}

async function registrarPedidoAmizade(usuid, amiId){
    const conex = await conectarBD();
    const sql = "INSERT INTO amizades(amienvia, amirecebe) VALUES (?,?)";
    await conex.query(sql,[usuid, amiId]);
    
}
async function verificarAmizade(usucodigo, amiid){
    const conex = await conectarBD();
    const sql = `SELECT * FROM amizades where amienvia = ? and amirecebe = ?
                OR
                amienvia= ? and amirecebe= ?`;
    const [verificarAmizade] = await conex.query(sql,[usucodigo, amiid, amiid, usucodigo])
    if(verificarAmizade.length>0) return verificarAmizade[0];
    else return {};
}
async function contagemDashboardUsuario(usuid){
    const conexao = await conectarBD();

    const [[{totalQuadros}]] = await conexao.execute(`
    SELECT COUNT(DISTINCT quaid) AS totalQuadros 
    FROM quadros_usuarios WHERE usuid = ?`, [usuid]);

    const [[{totalTarefas}]] = await conexao.execute(`SELECT COUNT(t.tarid) AS totalTarefas
        from tarefas t inner join quadros_usuarios qu on t.tarqua = qu.quaid where qu.usuid=?`, [usuid])


    return {totalQuadros, totalTarefas};

}
async function buscarAmigosUsuario(usuid) {
    const conex = await conectarBD();
    const sql =  "SELECT * FROM amizades where amienvia=? and amipendente=0 or amirecebe=? and amipendente=0"
    const [amigos] = await conex.query(sql,[usuid,usuid]);
    if(amigos.length > 0) return amigos;
    else return [];
    
}

async function removerAmizade(usuid,amiid)
{
    const conex = await conectarBD();
    const sql = `DELETE FROM amizades WHERE
                ((amienvia=? AND amirecebe=?)
                OR
                (amienvia=? AND amirecebe=?));`
    await conex.query(sql,[usuid, amiid, amiid, usuid]);
    
}


    module.exports = { conectarBD, buscarUsuario, registrarUsuario, buscarAdmin, registrarQuadro, 
        RegistrarQuaUsu, verificarQuadro, contagemDashboard, buscarQuadroId, buscarQuadrosUsuario,
        registrarTarefa, buscarTarefasQuadro, buscarTarefaDoQuadro, atualizarStatusTarefa, listarAdmin,
        adicionarAdmin, admin_listarQuadros, admin_listarUsuarios, admin_removerQuadros, admin_removerUsuarios, removerAdmin, buscarQuadrosDoUsuario,
        contagemDashboardUsuario, buscarUsuarioPorId, registrarPedidoAmizade, verificarAmizade, buscarAmigosUsuario, removerAmizade
    };
