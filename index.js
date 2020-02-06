let express = require('express');
let app = express();
let bodyParser=require('body-parser');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let port = process.env.PORT ||  3333;
let cors = require('express-cors');

// setting
dotenv.config();

mongoose.connect(process.env.DB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology:true,
        useFindAndModify:false
    }
    ,(err)=>{
    if (err) console.error(err);
    else console.log('Connected Database')
});
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({ allowedOrigins: ['localhost:3000', '127.0.0.1:3000']}));
// routes
const {authVerify,isAdmin} = require("./middelware/auth");


let authRouter = require('./routes/user/auth');
let userRouter = require('./routes/user/user');
let requestRouter = require('./routes/request/request');
let notificationRouter = require('./routes/notification/notification');
let transactionRouter = require('./routes/transaction/transaction');
let centerRouter = require('./routes/center/center');

app.use('/api/auth',authRouter);
app.use('/api/user',authVerify,userRouter);
app.use('/api/request',authVerify,requestRouter);
app.use('/api/notification',authVerify,notificationRouter);
app.use('/api/transaction',authVerify,transactionRouter);
app.use('/api/center',[authVerify,isAdmin],centerRouter);

app.get('/',function (req,res) {
    return res.json({message:"Welcome to our page"});
});

app.listen(port,()=>{
    console.log('Web site is running in url : http://localhost:'+port)
});