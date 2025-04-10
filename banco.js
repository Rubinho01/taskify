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
    const sql = "insert into usuarios(usunome, usuemail, usunascimento, ususenha) values (?,?,?,?)"
    await conexao.query(sql, [usuario.nome, usuario.email, usuario.nasc, usuario.senha]);
}

async function buscarAdmin(admin){
    const conexao = await conectarBD();
    const sql = "select * from admin where admemail=? and admsenha=?";
    const[adminEncontrado] = await conexao.query(sql,[admin.email, admin.senha]);
    if (adminEncontrado && adminEncontrado.length > 0){
        return adminEncontrado[0];
    }else{
        return{};
    }

}
    module.exports = {buscarUsuario, registrarUsuario, buscarAdmin};