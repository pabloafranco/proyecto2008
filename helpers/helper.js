
const axios = require('axios');
const hbs = require('hbs');

// cálculo del dolar
let dolarTurista;
let dolar;
axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then( function(respuesta) {
       dolar = respuesta.data[0].casa.venta // toma como string 
       dolar = dolar.replace(/,/g, '.')
       dolar = parseFloat(dolar)
    })
    .then( function() {
        const impuestoPAIS = 0.30;
        const percepcionAFIP = 0.35;
        dolarTurista = (dolar * impuestoPAIS) + (dolar * percepcionAFIP) + dolar;
        return dolarTurista
    })
    .catch( function(error) {
        console.log("error en AXIOS", error)
    })

// Helper de conversión
hbs.registerHelper('dolarApeso', function(dato) {
    
    let precioFinal = (dolarTurista * dato);
    return new Intl.NumberFormat('es-AR',{style: 'currency', currency: 'ARS'}).format(precioFinal)

})

// helper de listado de caracteristicas
hbs.registerHelper('listado', function(objeto){
    // Convierto en array la lista de caracteristicas que recibimos por coma (i3,128gb)
    console.log("Listado Objeto", objeto)
    let array = objeto.split(',') // [i3, 128gb..]
    let html = "<ul>"
    for (let item of array){
        html = `${html} <li> ${item} </li>`
    }

    return html + '</ul>'

})