const express = require('express');
const app = express();
const port = 5000;
const databaseConnect =  require('./ConnectToDatabase');
const NotesRouter = require('./controllers/Notes-Controller');
const UserRouter = require('./controllers/user-controller');
const { router } = require('./controllers/EmailOtpVerify');
const cors = require('cors');


app.use(express.json());

app.get('/',(req, res)=>{
    console.log("Server Started");
})

const allowedOrigins = [
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));


databaseConnect();

app.use('/api/User',UserRouter);
app.use('/Notes',NotesRouter);
app.use('/otp',router);

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
