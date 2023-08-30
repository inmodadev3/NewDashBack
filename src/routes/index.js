const routes = require('express').Router()
const fs = require('fs')
const path = require('path')

const borrarExtensionDirectorios = (file) =>{
    return file.split('.')[0]
}

const archivos = fs.readdirSync(path.join(__dirname+'/v1'))
console.log(archivos)

archivos.forEach((archivo)=>{
    let archivoSinExtension = borrarExtensionDirectorios(archivo)
    if(archivo !== 'index.js'){
        routes.use(`/api/v1/${archivoSinExtension}`,require(`./v1/${archivoSinExtension}`))
    }
})

module.exports = routes