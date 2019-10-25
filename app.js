const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:3000/url",{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})
const db = mongoose.connection

const Url = mongoose.model("url")
const urlCheck = require("./lib/url")

db.on("error", ()=>{
    console.log("mongodb error")
})

db.once("open", ()=>{
    console.log("mongodb connected")
})

const express = require("express")
const app = express()
const port = 3000

const exphbs = require("express-handlebars")
app.engine("handlebars",exphbs({defaultLayout:"main"}))
app.set("view engine", "handlebars")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))

const session = require("express-session")
app.use(session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true
}))

const flash = require('connect-flash')
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    next()
})





app.get("/", (req,res)=>{
    res.render("index")
})

app.post("/", (req,res) =>{
    let url = findOne({longUrl : req.body.longUrl}).exec()
    const basicUrl = req.get("origin")

    if(url){
        res.render("index",{
            shortUrl: basicUrl + url.shortUrl,
            longUrl: url.longUrl
        })
    }else{
        let shortDigit = checkUrl()
        const newUrl = new Url({
            longUrl: req.body.longUrl,
            shortUrl: shortDigit
        })
        newUrl.save()
        res.render("index",{
            shortUrl:basicUrl + shortDigit,
            longUrl: req.body.longUrl
        })
    }

})

app.get("/:shortDigit",(req,res) => {
    Url.findOne({shortUrl: req.params.shortDigit},(err,url)=>{
        if(err) throw err

        if(url){
            res.redirect(url.longUrl)
        }else{
            req.flash("warning_msg","網址錯誤")
            res.redirect("/")
        }
    })
})


app.listen(port, ()=>{
    console.log("app is running")
})

