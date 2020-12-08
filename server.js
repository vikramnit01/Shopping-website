require('dotenv').config()
const express = require('express');
const app = express()
const ejs = require('ejs')
const path = require('path')  //inbuilt module
const expressLayout=require('express-ejs-layouts')
const PORT=process.env.PORT || 3000 //if 3000 is busy change to 3300
const session = require('express-session')
const mongoose = require('mongoose')
const flash = require('express-flash');
const { createConnection } = require('net');
const MongoDbStore=require('connect-mongo')(session);
const passport=require('passport')
const Emitter = require('events')
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


 //Data base connection
 const url = 'mongodb://localhost/pizza';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',function(){
    console.log('database connected..');
}).catch(err=>{
    console.log('connection fail..')
});

//session store

 let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection:'sessions'
})

//Event emitter
 const eventEmitter = new Emitter()
 app.set('eventEmitter',eventEmitter)


//session confiq
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie:{maxAge: 1000*60*60*24}  //valid for 24 hour
}))

//passport Confiq
const passportInit=require('./app/config/passport');
const { Socket } = require('socket.io');
//const { Passport } = require('passport');
 passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash());
//Assets
app.use(express.static('public'))



//Global middleware to use session or user in fronten page 
app.use((req,res,next)=>{
    res.locals.session =req.session
    res.locals.user=req.user
    next()
})
 
//set Template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)  


//for login use passport
const server = app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
});


//socket
const io = require('socket.io')(server)

io.on('connection',(socket)=>{
    //join
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    }) 
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})