const multer =require('multer')

const store = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads")
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/s,""))
    }
})

const upload = multer({
    storage: store
})

module.exports = upload