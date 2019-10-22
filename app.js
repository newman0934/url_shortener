const express = require("express")
const app = express()
const port = 3000

const exphbs = require("express-handlebars")
app.engine("handlebars",exphbs({defaultLayout:"main"}))
app.use("view engine", "handlebars")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))

const flash = require("connect-flash")
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.warning_msg = req.flash("warning_msg")
    next()
})

const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/url",{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})

const db = mongoose.connection

db.on("error", ()=>{
    console.log("mongodb error")
})

db.once("open", ()=>{
    console.log("mongodb connected")
})

app.get("/", (req,res)=>{
    res.render("index")
})


app.listen(port, ()=>{
    console.log("app is running")
})