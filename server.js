const express      = require('express')
const body_parser  = require('body-parser')
const cookieParser = require("cookie-parser")
const port         = 3100
const app          = express()
const auth         = require('./modules/credentials.js')
const inventory    = require("./modules/Inventory") 
const cart         = require('./modules/Cart')

app.use(cookieParser());
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
    return res
        .status(200)
        .send("<br><br>This is not a real app. | Contact: grafgonzalo@gmail.com<hr><li><a href='/login'>Login Page</a></li>")
})

app.get('/login', (req, res) => {
    return res
        .status(200)
        .render('pages/login',{
            redirect: "/home"
        })
})


app.post("/authenticate", (req, res) => {

    let username = req.body.username|| null
    let password = req.body.password|| null
    let redirect = req.body.redirect|| "/login"

    if(username===auth.username&&password===auth.password) {
        
        return res
            .status(200)
            .json({status:"success", redirect: redirect})    
    }

    //let the user work with different use cases
    let message = username===null||password===null 
                    ? "Fields can not be empty" : "Wrong credentials"
    
    return res
        .status(403)
        .send(message)
})

app.post("/search-engine",async (req, res)=>{
    let hint = req.body.searchWord|| null
    
    if(hint) {
        //halt response for some secs to see how the candidate hanldes situation
        await new Promise(r => setTimeout(r, 2000));

        return res 
            .status(200)
            .send(`Found one result for ${hint}`)
    }

    //halt response for some secs to see how the candidate hanldes situation
    await new Promise(r => setTimeout(r, 3000));

    return res 
            .status(404)
            .send("Please provide a search word.")
})

app.get("/home",(req,res)=>{
    return res 
        .status(200)
        .render("pages/homepage")
})

app.get("/checkout",(req,res)=>{
    return res
        .status(200)
        .render("pages/form",{
            redirect: "/order",
            sameaddchecked: Math.random()*10>5?"checked":""
        })
})

app.post("/form-validation",(req,res)=>{
    let redirect = req.body.redirect||"/home"
    let sameAddress = req.body.sameadr||null
    
    if(sameAddress!==null) {
        return res
            .status(200)
            .json({status:"success", redirect: redirect})     
    }
    
    //any error to force the checkbox interaction
    return res
        .status(406)
        .send("Shipping address same as billing checkbox must be selected.")
})

app.get("/order",(req,res)=>{
    //dummy new order created page
    //this can be called as many times as needed
    //and it will show a random order number
    return res
        .status(200)
        .render("pages/order",{
            orderNumber: Math.round(Math.random()*10000)
        })
})

app.get("/grid", (req,res)=>{
    
    return res
        .status(200)
        .render("pages/grid",{
            inventory: inventory.getMenu()
        })
})

app.get("/search", (req,res)=>{
    
    return res
        .status(200)
        .render("pages/search")
})

/**
 * Dummy api/ routes to test backend automation frameworks
 */
app.get("/api",(req,res)=>{
    return res.send("up")
})

app.get("/api/inventory",(req,res)=>{
    return res.status(200).json(inventory.getMenuApi())
})

app.get("/api/inventory/filter",(req,res)=>{
    if(req.query.id==null) {
        return res.status(400).send("Not all requirements are met")
    }
    let item = inventory.filterItem(req.query.id)
    if(item==undefined){
        return res.sendStatus(404)
    }
    return res.json(item)
})

app.post("/api/inventory/add",(req,res)=>{
    if(req.body.id==null||req.body.name==null||req.body.price==null||req.body.image==null){
        return res.status(400).send("Not all requirements are met")
    }

    return res.sendStatus(inventory.addItem(req.body))
})

app.use(function(req, res) { res.sendStatus(400) })

app.use(function(req, res) { res.sendStatus(500) })
 
app.listen(port,() => {console.log("waiting for connections on localhost:" + port)})

