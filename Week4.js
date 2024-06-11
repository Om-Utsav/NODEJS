//Set up a simple web server using Express.js that can handle basic routing and middleware. Implement routes to respond to at least two different endpoints.

const express = require('express')
const app = express();

let name = 'Om'
let password = 123987


app.get('/' , (req , res)=> {
    res.send('This is the Login Page')
}) 

app.use(loginMiddleware)

app.get('/profilePage', (req, res)=> {
    res.send('Profile Page')
})

app.get('/feedPage', (req, res)=> {
    res.send('Feed Page')
})

app.listen(8080, ()=>{
    console.log('Port running on 8080')
})

function loginMiddleware(req, res, next){
    if(name=='Om' && password==123987){
        next()
    }
    else{
        res.send('Cannot authenticate the user')
    }
}
