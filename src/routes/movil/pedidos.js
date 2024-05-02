const route = require('express').Router()
route.get('/', (req, res) => {
    res.status(200).json({ data: 'hola mundo' })
})

module.exports = route