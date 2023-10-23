const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const upload = require('./src/middlewere/uploadfile')



const config = require('./src/config/config.json')
const { Sequelize, QueryTypes, QueryError } = require('sequelize')
const { log } = require('console')
const { type } = require('os')
const sequelize = new Sequelize(config.development)


//set up to call hbs
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/view'))

//set static
app.use(express.static('src/aset'))
app.use(express.static('src/uploads'))

//parsing data from cliant
app.use(express.urlencoded({ extended: false }))

//set up flash
app.use(flash())

//set up session
app.use(session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 5
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'lidia'
  })
)

//routing
app.get('/home', home)
app.get('/contactMe', contactMe)
app.get('/addMyProject', formBlog)
app.post('/addMyProject', upload.single('upload-image'), addMyProject)
app.get('/blogDetail/:id', blogDetail)
app.get('/delete/:id', Delete )
app.get('/update/:id', getUpdateDetail)
// app.put('/update/:id', addUpdate)
app.get('/register', formRegister)
app.post('/register', addUser)
app.get('/login', formLogin)
app.post('/login', userLogin)
app.get('/logout', logout)

//local server
app.listen(PORT, () => {
    console.log("runing on server 3000");
})


async function home (req, res) {
    try {
      const query = `SELECT blogs.id, title, description, "distanceTime", "Technologiess", image, users.name AS author FROM blogs LEFT JOIN users ON blogs.author = users.id ORDER BY blogs.id DESC` 
      let objt = await sequelize.query(query, { type: QueryTypes.SELECT})
      objt.sort((a, b) => b.id - a.id);
      //console.log(objt.sort((a, b) => a.id - b.id));
      const updatedData = objt.map(item => ({
        ...item,
        technologies: {
            Next: Array.isArray(item.Technologiess) && item.Technologiess.includes('Next'),
            Node: Array.isArray(item.Technologiess) && item.Technologiess.includes('Node'),
            React: Array.isArray(item.Technologiess) && item.Technologiess.includes('React'),
            Typescript: Array.isArray(item.Technologiess) && item.Technologiess.includes('Typescript')
          }
        }));


      //updatedData.sort((a, b) => b.id - a.id);
      //console.log('updateData ===> ', updatedData)
      res.render('index', { blogs: updatedData, 
            isLogin: req.session.isLogin,
            user: req.session.user
     })

    }catch (err) {
      console.log( err )
    }
}

async function blogDetail(req, res) {
    try {
        const { id } = req.params
        const query = `SELECT blogs.id, title, description, "StartDate", "endDate", "distanceTime", "Technologiess", image, users.name AS author FROM blogs LEFT JOIN users ON blogs.author = users.id WHERE blogs.id =${id}`
        const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

        console.log(obj);
        res.render('blog-detail', { blog: obj[0],
            isLogin: req.session.isLogin,
            user: req.session.user
        })
    } catch (err) {

    }
}

function contactMe(req, res) {
    res.render('Contact-Me')
}

function formBlog(req, res) {
    res.render('Add-My-Project', {
        isLogin: req.session.isLogin,
            user: req.session.user
    });
}

//distanceTime
const distanceTimeCount = (StartDate, endDate) => {
    var startDate = new Date(StartDate);
    var endDate = new Date(endDate);

    var timeDiff = endDate - startDate;

    var daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    var months = Math.floor(daysDiff / 30);
    var remainingDays = daysDiff % 30;

    return months > 0 ? months + ' bulan' : daysDiff + ' hari'; 
    
}

const multiCheckbox = (Nodejs, Reactjs, Nextjs, Typescript) => {
    const temp = [];
        if(Nodejs === 'Node'){
            temp.push('Node')
        }
        if(Reactjs === 'React'){
            temp.push('React')
        }
        if(Nextjs === 'Next'){
            temp.push('Next')
        }
        if(Typescript === 'Typescript'){
            temp.push('Typescript')
        }

        return temp
}

async function addMyProject(req, res) {
    try {
        const { title, description, StartDate, endDate, Nodejs, Reactjs, Nextjs, Typescript = []} = req.body
        const temp = [];
        if(Nodejs === 'Node'){
            temp.push('Node')
        }
        if(Reactjs === 'React'){
            temp.push('React')
        }
        if(Nextjs === 'Next'){
            temp.push('Next')
        }
        if(Typescript === 'Typescript'){
            temp.push('Typescript')
        }
        let distanceTime =  distanceTimeCount(StartDate, endDate)
        const idUser = req.session.idUser 
        const image = req.file.filename
        const query = `INSERT INTO blogs (title, description, author, "Technologiess", "StartDate", "endDate", "distanceTime", image, "createdAt", "updatedAt") 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`;

        const values = [title, description, idUser, temp, StartDate, endDate, distanceTime, image];
        await sequelize.query(query, { bind: values })
        .then(() => {
            console.log('Data inserted successfully.');
            // Redirect or respond to the client as needed.
          })
          .catch(error => {
            console.error('Error inserting data:', error);
            // Handle the error and respond accordingly.
          });

    
        res.redirect('/home')
    } catch (err) {
        console.log(err);
    }
}

async function Delete (req, res) {
    try {
      const { id } = req.params

      await sequelize.query(`DELETE FROM blogs WHERE id =${id}`)
      res.redirect('/home')
    } catch (err) {

    }

}

function formUpdate(req, res) {
    res.render('update-project')
}

async function getUpdateDetail(req, res) {
    try {
        const { id } = req.params
        const query = `SELECT id, title, description, "distanceTime", "StartDate", "endDate", "Technologiess", image  FROM blogs WHERE id =${id}`
        const ob = await sequelize.query(query, { type: QueryTypes.SELECT })

        const updatedData = ob.map(item => ({
            ...item,
            technologies: {
                Next: Array.isArray(item.Technologiess) && item.Technologiess.includes('Next'),
                Node: Array.isArray(item.Technologiess) && item.Technologiess.includes('Node'),
                React: Array.isArray(item.Technologiess) && item.Technologiess.includes('React'),
                Typescript: Array.isArray(item.Technologiess) && item.Technologiess.includes('Typescript')
              }
          }));
    

       res.render('update-project', { update : updatedData[0], 
        isLogin: req.session.isLogin,
            user: req.session.user
     })
       console.log(ob);
    }catch (err) {
        console.log(err);
    }
}

function formRegister(req, res) {
    res.render('register')
}

async function addUser(req, res) {
    try {
      const { name, email, password } = req.body
      
      await bcrypt.hash(password, 10, (err, hashpassword) => {
        const query = `INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashpassword}', NOW(), NOW())`
         sequelize.query(query)
      })
      
      res.redirect('/login')
    } catch (err) {

    }
}

function formLogin(req, res) {
    res.render('login')
}

async function userLogin(req, res) {
    try {
      const { email, password } = req.body
      const query = `SELECT * FROM users WHERE email = '${email}'`
      let objc = await sequelize.query(query, { type: QueryTypes.SELECT})

      if(!objc.length) {
        req.flash('dark', "user has not been registered")
        return res.redirect('/login')
      }

      await bcrypt.compare(password, objc[0].password, (err, resulst) => {
        if(!resulst) {
            req.flash('dark', 'password wrong')
            return res.redirect('/login')
        } else {
            req.session.isLogin = true,
            req.session.idUser = objc[0].id
            req.session.user = objc[0].name
            req.flash('success', 'login success')
            return res.redirect('/home')
        }
      })

      console.log(objc);
    } catch (err) {
        console.log(err);
    }
}

async function logout (req, res) {
    console.log('logout page ===> ')
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/login'); // Redirect to the login page after logout
    });
  }