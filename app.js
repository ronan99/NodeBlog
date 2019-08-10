//PAREI NA AULA 43

const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const app = express()
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')


//Sessões
app.use(session({
    secret:"Bruna Linda",
    resave:true,
    saveUninitialized:true
}))
app.use(flash())
//Middleware
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//BodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine','handlebars')

//Rotas
app.use('/admin',admin)

//CSS e Js
app.use(express.static(path.join(__dirname,"public")))

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});


const PORT = 3369
app.listen(PORT,()=>{
    console.log(`Servidor rodando na porta ${PORT}.`)
})