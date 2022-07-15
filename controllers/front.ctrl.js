require('dotenv').config()
const db = require('../db')

// para recibir emails 
let nodemailer = require('nodemailer');


// INICIO:GET 
const inicioGET = function (req, res) {

        /*
    console.log("Sesion", req.session)
    console.log("Sesion Jd", req.session.id)

    req.session.visita = req.session.visita ? req.session.visita + 1 : 1;
    res.send(`Visita numero: ${req.session.visita}`)
    */
  
    let sql = 'SELECT * FROM productos'
    db.query(sql, function(err,data) {
        if (err) res.send(`Ocurrió el siguiente error: ${err}`)
        // console.log(data)
        res.render('index', {
            logeado: req.session.logeado,
            usuario: req.session.nombreUsuario,
            titulo: "Mi emprendimiento",
            productos: data
        })
    })
    


}

const contactoGET = function (req, res) {
    res.render('contacto', {
        titulo: "Contacto",
        logeado: req.session.logeado,
        usuario: req.session.nombreUsuario
    }
    )
}

  
const contactoPOST = function (req, res) {
    // Definimos el transporter
    console.log('Entre al email')
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        port: 587, // port for secure SMTP
        secureConnection: false,
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user:  process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }    )
   //definimos el email
    //esta es la info que recibimos del formulario
    let data = req.body
    let emailOptions = {
        from: data.nombre, // de: "Pablo"
        to: process.env.EMAIL_PRIMARIO ,
        subject: data.asunto,
        html: `<p> ${data.mensaje}</p>`
        }
    // enviar email
    transporter.sendMail(emailOptions, function(error, info){
        if (error){
            console.log(error)
            res.status(500, error.message)
            res.status(500).render('contacto', {
                mostrar: true,
                mensaje: `Ha ocurrido el siguiente error ${error.message}`,
                clase: 'danger'
            })
        }else {
            console.log('Email enviado')
            res.status(200).render('contacto', {
                mostrar: true,
                clase: 'sucess',
                mensaje: `Email enviado exitosamente`
            })
        }
    })
}


const comoComprarGET = function (req, res) {
    res.render('como-comprar', {
        titulo: "Como Comprar",
        logeado: req.session.logeado,
        usuario: req.session.nombreUsuario
    })
}

const detalleProductoGET_ID = function (req, res) {
   
    let id = req.params.id // Toma de la URL el valor indicado por el parámetro ej "detalle-producto/1", entonces obtendrá el 1.
    let sql = "SELECT * FROM productos WHERE id = ?" // Seleccionar de la tabla productos, DONDE el registro tenga el ID 
    db.query(sql, id, function(err, data) {
        console.log("DATA -->", data[0])
        if (err) res.send(`Ocurrió un error ${err.code}`)
        if (data == "") { // Si no encuentra el ID, entonces obtendrá un vacio

            res.status(404).render('404', {
                mensaje: `Producto con ID ${id} no existe`
            })
        } else {
            res.render('detalle-producto', {
                producto: data[0],
                titulo: `Producto: ${data[0].nombre}`,
                logeado: req.session.logeado,
                usuario: req.session.nombreUsuario
            })
        }
    })
    


}

const sobreNosotrosGET = function (req, res) {
    res.render('sobre-nosotros', {
        titulo: "Sobre Nosotros",
        logeado: req.session.logeado,
        usuario: req.session.nombreUsuario
    })
}

module.exports = {
    inicioGET,
    contactoGET,
    contactoPOST,
    comoComprarGET,
    detalleProductoGET_ID,
    sobreNosotrosGET
}