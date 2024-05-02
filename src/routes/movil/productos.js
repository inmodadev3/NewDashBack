const { Xid } = require('../../controllers/movil/Productos_Controller')

const route = require('express').Router()

route.get('/:id', Xid)

module.exports = route