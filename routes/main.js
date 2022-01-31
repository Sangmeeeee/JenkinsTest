var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var fs = require('fs')
var ejs = require('ejs')

router.use(bodyParser.urlencoded({ extended: false }))

router.get("/", function (req, res) {
    res.redirect('/main');
})

router.get("/main", function (req, res) {
    console.log("main page")

    fs.readFile('./html/main.html', 'utf-8', function (error, data) {
        res.send(data)
    })
})

module.exports = router;