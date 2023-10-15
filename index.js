const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000

//set up to call hbs
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/view'))

//set static
app.use(express.static('src/aset'))

//parsing data from cliant
app.use(express.urlencoded({ extended: false }))

//routing
app.get('/home', home)
app.get('/contactMe', contactMe)
app.get('/addMyProject', formBlog)
app.post('/addMyProject', addMyProject)

//local server
app.listen(PORT, () => {
    console.log("runing on server 3000");
})

function home(req, res) {
    res.render('index')
}

function contactMe(req, res) {
    res.render('Contact-Me')
}

function formBlog(req, res) {
    res.render('Add-My-Project');
}

function addMyProject(req, res) {
    const datta = req.body
    console.log(datta);
}