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
  const sqlAmizades = "DELETE FROM amizades WHERE amienvia = ? OR amirecebe = ?";
  await conexao.query(sqlAmizades, [id, id]);
  const sqlFavoritos = "DELETE FROM favoritos WHERE usuid = ?";
  await conexao.query(sqlFavoritos, [id]);
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

  const sql0 = 'DELETE FROM tarefas WHERE tarqua = ?';
  await conexao.query(sql0, [quaid]);

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
    SELECT 
      q.quaid, 
      q.quanome, 
      q.quadesc, 
      t.tarid, 
      t.tarnome, 
      t.tarstatus,
      CASE WHEN f.usuid IS NOT NULL THEN 1 ELSE 0 END AS favorito
    FROM quadros_usuarios qu
    JOIN quadros q ON qu.quaid = q.quaid
    LEFT JOIN tarefas t ON q.quaid = t.tarqua
    LEFT JOIN favoritos f ON f.quaid = q.quaid AND f.usuid = ?
    WHERE qu.usuid = ?
    ORDER BY favorito DESC, q.quaid, t.tarid;
  `;

  const conexao = await conectarBD();
  const [rows] = await conexao.execute(sql, [usuid, usuid]);

  const quadros = new Map();

  for (const item of rows) {
    if (!quadros.has(item.quaid)) {
      quadros.set(item.quaid, {
        id: item.quaid,
        nome: item.quanome,
        descricao: item.quadesc,
        favorito: item.favorito === 1,
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
async function verificarAmizade(usucodigo, amiid) {
  const conex = await conectarBD();
  const sql = `
    SELECT * FROM amizades 
    WHERE 
      (amienvia = ? AND amirecebe = ?)
      OR 
      (amienvia = ? AND amirecebe = ?)
  `;
  const [verificarAmizade] = await conex.query(sql, [usucodigo, amiid, amiid, usucodigo]);
  if (verificarAmizade.length > 0) return verificarAmizade[0];
  else return {};
}

async function contagemDashboardUsuario(usuid){
  const conexao = await conectarBD();

  const [[{totalQuadros}]] = await conexao.execute(`
    SELECT COUNT(DISTINCT quaid) AS totalQuadros 
    FROM quadros_usuarios WHERE usuid = ?`, [usuid]);

  const [[{totalTarefas}]] = await conexao.execute(`
    SELECT COUNT(t.tarid) AS totalTarefas
    FROM tarefas t 
    INNER JOIN quadros_usuarios qu ON t.tarqua = qu.quaid 
    WHERE qu.usuid = ?`, [usuid]);

  const [[{tarefasConcluidas}]] = await conexao.execute(`
    SELECT COUNT(t.tarid) AS tarefasConcluidas
    FROM tarefas t 
    INNER JOIN quadros_usuarios qu ON t.tarqua = qu.quaid 
    WHERE qu.usuid = ? AND t.tarstatus = 1`, [usuid]);

  const [[{tarefasNaoConcluidas}]] = await conexao.execute(`
    SELECT COUNT(t.tarid) AS tarefasNaoConcluidas
    FROM tarefas t 
    INNER JOIN quadros_usuarios qu ON t.tarqua = qu.quaid 
    WHERE qu.usuid = ? AND t.tarstatus = 0`, [usuid]);

  return {totalQuadros, totalTarefas, tarefasConcluidas, tarefasNaoConcluidas};
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

async function verificarAmizadesPendentes(usuid){
    const conex = await conectarBD();
    const sql = `SELECT am.amiid, u.usunome as amienvia, am.amienvia as amienviaid from amizades am
               inner join usuarios u on u.usuid = am.amienvia
               WHERE amirecebe=? AND amipendente=1; `;
    const [amizadesPendentes] = await conex.query(sql, [usuid]);
    if(amizadesPendentes.length > 0) return amizadesPendentes;
    else return [];
    
}

async function verificarPedidoDeAmizade(amiid, usuid) {
    const conex = await conectarBD();
    const sql = "SELECT * FROM AMIZADES WHERE amienvia=? AND amirecebe=? AND amipendente=1;"
    const [pedidoAmizade] = await conex.query(sql, [amiid, usuid]);
    if(pedidoAmizade.length>0) return true;
    else return false;
    
}

async function aceitarPedidoDeAmizade(amiid, usuid) {
    const conex = await conectarBD();
    const sql = "UPDATE amizades SET amipendente=0 WHERE amienvia=? and amirecebe=?"
    await conex.query(sql, [amiid, usuid]);
}


async function verificarNotificacoes(usuid) {
    const conex = await conectarBD();
    const sql = "select * from notamizades where idrecebe=?"
    const [notificacoes] = await conex.query(sql,[usuid]);
    if(notificacoes.length>0) return notificacoes;
    else return [];
    
}

async function atualizarNome(usuid, nome) {
  const conex = await conectarBD();
  const sql = "UPDATE usuarios SET usunome = ? WHERE usuid = ?";
  await conex.query(sql, [nome, usuid]);
}

async function atualizarEmail(usuid, email) {
  const conex = await conectarBD();
  const sql = "UPDATE usuarios SET usuemail = ? WHERE usuid = ?";
  await conex.query(sql, [email, usuid]);
}

async function atualizarSenha(usuid, senha) {
  const conex = await conectarBD();
  const sql = "UPDATE usuarios SET ususenha = ? WHERE usuid = ?";
  await conex.query(sql, [senha, usuid]);
}

async function atualizarBio(usuid, bio) {
  const conex = await conectarBD();
  const sql = "UPDATE usuarios SET usubio = ? WHERE usuid = ?"
  await conex.query(sql, [bio, usuid]);
}

async function marcarQuadroFavorito(quaid, favorito) {
  const conex = await conectarBD();
  const sql = 'UPDATE quadros SET favorito = ? WHERE quaid = ?';
  const valorFavorito = favorito ? 1 : 0;
  return await conex.query(sql, [valorFavorito, quaid]);
}

async function buscarUsuarioPorNome(nome)
{ 
  const conex = await conectarBD();
  const sql = "SELECT * FROM usuarios where usunome like ?";
  const [usuarios] = await conex.query(sql, [`%${nome}%`]);
  if(usuarios.length>0) return usuarios;
  else return [];
  
}

async function deletarTarefa(tarid) {
  const conex = await conectarBD();
  const sql = "DELETE FROM tarefas WHERE tarid = ?";
  await conex.query(sql, [tarid]);
}

async function buscarQuadroDaTarefa(tarid) {
  const conex = await conectarBD();
  const sql = "SELECT tarqua FROM tarefas WHERE tarid = ?";
  const [rows] = await conex.query(sql, [tarid]);
  if (rows.length > 0) {
    return rows[0].tarqua;
  }
  return null;
}

async function editarTarefa(tarid, tarnome, tardesc){
  const conex = await conectarBD();
  const sql = "UPDATE tarefas SET tarnome = ?, tardesc = ? WHERE tarid = ?"
  await conex.query(sql,[tarnome, tardesc, tarid]);

}

async function deletarQuadro(quaid){
  const conex = await conectarBD();
  await conex.query("DELETE FROM tarefas WHERE tarqua = ?", [quaid]);
  await conex.query("DELETE FROM quadros_usuarios WHERE quaid = ?", [quaid]);
  await conex.query("DELETE FROM quadros WHERE quaid = ?", [quaid]);
  
}

async function editarQuadro(quaid, quanome, quadesc){
  const conex = await conectarBD();
  const sql = "UPDATE quadros SET quanome = ?, quadesc = ? WHERE quaid = ?"
  await conex.query(sql,[quanome, quadesc, quaid])
}

async function adicionarFavorito(usuid, quaid) {
  const conex = await conectarBD();
  const sql = 'INSERT INTO favoritos (usuid, quaid) VALUES (?, ?)';
  await conex.query(sql, [usuid, quaid]);
}

async function removerFavorito(usuid, quaid) {
  const conex = await conectarBD();
  const sql = 'DELETE FROM favoritos WHERE usuid = ? AND quaid = ?';
  await conex.query(sql, [usuid, quaid]);
}

async function listarQuadrosFavoritos(usuid) {
  const conex = await conectarBD();
  const sql = `
    SELECT q.*
    FROM quadros q
    JOIN favoritos f ON q.quaid = f.quaid
    WHERE f.usuid = ?`;
  const [rows] = await conex.query(sql, [usuid]);
  return rows;
}


async function listarQuadrosComFavorito(usuid) {
  const conex = await conectarBD();
  const sql = `
    SELECT q.*, 
           IF(f.usuid IS NULL, 0, 1) AS favorito
    FROM quadros q
    LEFT JOIN favoritos f ON q.quaid = f.quaid AND f.usuid = ?`;
  const [rows] = await conex.query(sql, [usuid]);
  return rows;
}


async function adicionarUsuarioAoQuadro(quaid, id) {
  const conex = await conectarBD();
  const sql = "INSERT INTO quadros_usuarios(quaid, usuid) values (?,?)"
  await conex.query(sql,[quaid, id]);
  
}
async function buscarAmigosNaoNoQuadro(usuId, quaid) {
  const conex = await conectarBD();
  const sql = `
    SELECT u.*
    FROM usuarios u
    JOIN amizades a 
      ON (
       (a.amienvia = u.usuid AND a.amirecebe = ?) OR
        (a.amirecebe = u.usuid AND a.amienvia = ?)
      )
    WHERE a.amipendente = 0
    AND u.usuid NOT IN (
      SELECT usuid 
      FROM quadros_usuarios 
      WHERE quaid = ?
);`;
  const [amigosDisponiveis] = await conex.query(sql, [usuId, usuId, quaid]);
  return amigosDisponiveis;
}

    module.exports = { conectarBD, buscarUsuario, registrarUsuario, buscarAdmin, registrarQuadro, 
        RegistrarQuaUsu, verificarQuadro, contagemDashboard, buscarQuadroId, buscarQuadrosUsuario,
        registrarTarefa, buscarTarefasQuadro, buscarTarefaDoQuadro, atualizarStatusTarefa, listarAdmin,
        adicionarAdmin, admin_listarQuadros, admin_listarUsuarios, admin_removerQuadros, admin_removerUsuarios, removerAdmin, buscarQuadrosDoUsuario,
        contagemDashboardUsuario, buscarUsuarioPorId, registrarPedidoAmizade, verificarAmizade, buscarAmigosUsuario, removerAmizade, verificarAmizadesPendentes,  
        verificarPedidoDeAmizade, aceitarPedidoDeAmizade, atualizarNome, atualizarEmail, atualizarSenha, marcarQuadroFavorito, atualizarBio, verificarNotificacoes,
        buscarUsuarioPorNome, deletarTarefa, buscarQuadroDaTarefa, editarTarefa, editarQuadro, deletarQuadro, adicionarUsuarioAoQuadro, buscarAmigosNaoNoQuadro , adicionarFavorito, 
        removerFavorito, listarQuadrosFavoritos, listarQuadrosComFavorito

      }
