const { Contados, TerceroXid } = require('../../controllers/movil/Terceros_Controller')

const route = require('express').Router()

route.get('/contados', Contados)
route.get('/:id', TerceroXid)

module.exports = route