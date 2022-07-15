const db = require('../db')

const adminGET = function (req, res) {
    
    if (req.session.logeado){ // chequea que hiciemos el loginj
        let sql = "SELECT * FROM productos"
        db.query(sql, function(err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            
            console.log("USUARIO:", req.session)
            res.render('admin', {
                titulo: "Panel de control",
                logged: true,
                usuario: req.session.nombreUsuario,
                productos: data
            })
        })
    
    } else {
        res.render("login", {
            titulo: "Login",
            error: "Nombre de uusario o clave incorrecto"
        })
    }


}

const agregarProductoGET = function (req, res) {
    if (req.session.logeado){ // chequea que hiciemos el loginj
       res.render('agregar-producto', {
       titulo: "Agregar producto",
       logged: true,
       usuario: req.session.nombreUsuario})
    }else
    {
        res.render("login", {
            titulo: "Agregar producto",
            error: "Nombre de uusario o clave incorrecto"
        })
    }

}

const agregarProductoPOST = function (req, res) {
    let detalleProducto = req.body // Tomará un objeto con la info del formulario

    // consulta de base de datos
    let sql = "INSERT INTO productos SET ?"
    db.query(sql, detalleProducto, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log("Producto agregado")
    })
    res.render('agregar-producto', {
        mensaje: "Producto agregado correctamente", 
        titulo: 'Agregar producto' 
    })
}

const editarProducto_ID = function (req, res) {

    if (req.session.logeado){ // chequea que hiciemos el loginj
    
    let id = req.params.id
    let sql = "SELECT * FROM productos WHERE id = ?"
    db.query(sql, id, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);

        if (data == "") {
            res.send(`
                <h1>no existe producto con id ${id}</h1>
                <a href="./admin/">Ver listado de productos</a>    
            `)
        } else {
            res.render('editar-producto', {
                titulo: "Editar producto",
                logged: true,
                usuario: req.session.nombreUsuario,
                producto: data[0]
            })
        }
    })

}else
{
    res.render("login", {
        titulo: "Login",
        error: "Nombre de uusario o clave incorrecto"
    })
}
}

const editarProductoPOST_ID = function(req, res) {
    let id = req.params.id // parámetro ID de la url
    let detalleProducto = req.body  // datos del formulario

    let sql = "UPDATE productos SET ? WHERE id = ?" // comando SQL para actualizar un registro

    db.query(sql, [detalleProducto, id], function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro actualizado");
    })

    res.redirect('/admin');
}

const borrarProducto_ID = function (req, res) {

    let id = req.params.id

    let sql = "DELETE FROM productos WHERE id = ?"
    db.query(sql, id, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro borrado");
    })

    res.redirect('/admin');
    
}

const loginGET = function (req, res) {
    res.render('login')
}

const loginPOST = function (req, res) {
    let usuario = req.body.username
    let clave = req.body.password

    if (usuario && clave) { // chequea que No este vacio, si son true ambas
        let sql="SELECT * from cuentas where usuario = ? and clave = ?"
        db.query(sql,  [usuario, clave], function(err, data) {
            console.log("LONGITUD DATA", data.length)
            if ( data.length>0 ){
                req.session.logeado = true; // Creamos una propidad llamado logger para que sepamos que estemos logeado
                req.session.nombreUsuario = usuario
                res.redirect ('/admin') // Aca invocamos la pagina.!
            } else {
                res.render('login', {
                    titulo: "Login",
                    error: 'Nombre de usuario o contraseña incorrecto'
                })
            }


        })

    }else {
        res.render('login', {
            titulo: "Login",
            error: 'Nombre de usuario o contraseña incorrecto'
        })
    }
}

const logout = function(req, res){
    req.session.destroy(function(err){
        console.log(`Error en el logout: ${err}`)
    })

    // Al salir vuelve al inicio
    let sql = "SELECT * FROM productos"
    db.query(sql, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        
        res.render('index', {
            titulo: "Comarca del Sol",
            data
        })
    })

}

module.exports = {
    adminGET,
    agregarProductoGET,
    loginGET,
    loginPOST,
    agregarProductoPOST,
    editarProducto_ID,
    borrarProducto_ID,
    editarProductoPOST_ID,
    logout
}