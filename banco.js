const mysql = require('mysql/promise');
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