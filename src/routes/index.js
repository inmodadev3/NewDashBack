const routes = require('express').Router()
const fs = require('fs')
const path = require('path')

const borrarExtensionDirectorios = (file) =>{
    return file.split('.')[0]
}

const archivos = fs.readdirSync(path.join(__dirname+'/v1'))

const archivos_tienda = fs.readdirSync(path.join(__dirname+'/tienda'))

const archivos_movil = fs.readdirSync(path.join(__dirname+'/movil'))

archivos.forEach((archivo)=>{
    let archivoSinExtension = borrarExtensionDirectorios(archivo)
    if(archivo !== 'index.js'){
        routes.use(`/api/v1/${archivoSinExtension}`,require(`./v1/${archivoSinExtension}`))
    }
})

archivos_tienda.forEach((archivo)=>{
    let archivoSinExtension = borrarExtensionDirectorios(archivo)
    if(archivo !== 'index.js'){
        routes.use(`/api/tienda/${archivoSinExtension}`, require(`./tienda/${archivoSinExtension}`))
    }
})

archivos_movil.forEach((archivo)=>{
    let archivoSinExtension = borrarExtensionDirectorios(archivo)
    if(archivo !== 'index.js'){
        routes.use(`/api/movil/${archivoSinExtension}`, require(`./movil/${archivoSinExtension}`))
    }
})

module.exports = routes