const express = require('express');
const app = express();
const databaseConnect = require('./ConnectToDatabase');
const NotesRouter = require('./controllers/Notes-Controller');
const UserRouter = require('./controllers/user-controller');
const { router } = require('./controllers/EmailOtpVerify');
const cors = require('cors');

// Use Render's PORT (or fallback to 5000 locally)
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  console.log("Server Started");
  res.send("Backend is running "); 
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://effervescent-donut-c3775b.netlify.app/',
  'https://effervescent-donut-c3775b.netlify.app',
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

app.use('/api/User', UserRouter);
app.use('/Notes', NotesRouter);
app.use('/otp', router);

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server is running on port ${PORT}`);
});
