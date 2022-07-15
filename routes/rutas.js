const { Router } = require('express')
const router = Router()

const {
    inicioGET,
    contactoGET,
    contactoPOST,
    comoComprarGET,
    detalleProductoGET_ID,
    sobreNosotrosGET
} = require('../controllers/front.ctrl')
console.log("controlador", inicioGET)

// Rutas FRONT
router.get('/', inicioGET)
router.get('/contacto', contactoGET)
router.post('/contacto', contactoPOST)
router.get('/como-comprar', comoComprarGET)
router.get('/detalle-producto/:id', detalleProductoGET_ID)
router.get('/sobre-nosotros', sobreNosotrosGET)

// rutas BACK
console.log("Back")
const {
    adminGET,
    agregarProductoGET,
    agregarProductoPOST,
    editarProducto_ID,
    borrarProducto_ID,
    editarProductoPOST_ID,
    loginGET,
    loginPOST,
    logout
} = require('../controllers/back.ctrl')

router.get('/admin', adminGET)

console.log("agregar")
router.get('/agregar-producto', agregarProductoGET)
router.post('/agregar', agregarProductoPOST)

router.get('/editar-producto/:id', editarProducto_ID)
router.post('/editar/:id', editarProductoPOST_ID)
router.get('/borrar/:id', borrarProducto_ID)

console.log("agregar2")
router.get('/login', loginGET)
router.post('/login', loginPOST)

console.log("agregar3")
router.get('/logout', logout)
console.log("Export")
module.exports = router
