const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/Rut/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname) === '.pdf') {
        cb(null, true)
    } else {
        cb(new Error('El archivo debe estar en un formato PDF'), false);
    }
}

const upload = multer({ storage, fileFilter })

const guardar_archivo = (req, res , next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            next()
        }
    })
}


module.exports = {
    guardar_archivo
}