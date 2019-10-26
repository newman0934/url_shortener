const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/url", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection

const Url = require("./models/url")
const urlCheck = require("./lib/url")

db.on("error", () => {
    console.log("mongodb error")
})

db.once("open", () => {
    console.log("mongodb connected")
})

const express = require("express")
const app = express()
const port = 3000

const exphbs = require("express-handlebars")
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}))
app.set("view engine", "handlebars")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    extended: true
}))

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

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", async (req, res) => {
    try {
        let url = await Url.findOne({
            longUrl: req.body.longUrl
        }).exec()
        
        const basicUrl = `${req.get("origin")}/`

        if (url) {
            res.render("index", {
                shortUrl: basicUrl + url.shortUrl,
                longUrl: url.longUrl
            })
        } else {
            let shortId = await urlCheck()
            const newUrl = new Url({
                longUrl: req.body.longUrl,
                shortUrl: shortId
            })
            await newUrl.save()
            res.render("index", {
                shortUrl: basicUrl + shortId,
                longUrl: req.body.longUrl
            })
        }
    } catch (err) {
        req.flash('warning_msg', '網址錯誤')
        if (err) throw err
        res.redirect('/')
    }
})

app.get('/:shortUrl', (req, res) => {
    Url.findOne({
        shortUrl: req.params.shortUrl
    }, (err, url) => {
        if (err) throw err

        if (url) {
            res.redirect(url.longUrl)
        } else {
            req.flash('warning_msg', '縮網址不正確')
            res.redirect('/')
        }
    })
})

app.listen(port, () => {
    console.log("app is running")
})