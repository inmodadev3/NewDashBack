require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORTSERVER || 8083
const rutas = require('./src/routes')
const {validarCnxDASH} = require('./src/databases/DashConexion')
const {ConexionHgi} = require('./src/databases/HgiConexion')


app.use(cors())
app.use(express.json())
app.use(rutas)

validarCnxDASH()
ConexionHgi()

app.listen(port,()=>{
    console.log(`SERVIDOR FUNCIONANDO EN PUERTO ${port}`)
})