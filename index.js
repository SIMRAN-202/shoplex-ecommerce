const express = require('express')  // this is framework library we import
const app = express()   // this is the function we call
const bodyparser = require('body-parser')  // this is for form data collection
const route = require('./route')  // for routing between pages
const mysession = require('express-session')


app.use("/public",express.static(__dirname + "/public")) // for css, images, js files
app.use(express.json()); 
app.use(bodyparser.urlencoded({extended:false}))
app.set('view engine','ejs')  // tells we are using ejs template enjine
app.use(mysession({
    secret: 'secretkey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 360000 // 1 minute
    }
}));
app.use(mysession({
    secret: 'useraddress', 
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 360000 // 1 minute
    }
}));

const port=2025

app.use("/",route)  // find route path in route.js

app.listen(port,()=>{    // listen port, port is any but it should be 4 digit
    console.log(`click here http://localhost:${port}`)
})