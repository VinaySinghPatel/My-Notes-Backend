const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');


const ConnectToDatabase =  () => {
MongoClient.connect('mongodb+srv://cse22devpatel:devpatel@cluster0.xehtvqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', (err, client) => {
  if (err) throw err

  const db = client.db('animals')

  db.collection('mammals').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
    console.log("Database Connected Successfully");             
  })
})
}

const databaseConnect = async () => {
   await mongoose.connect('mongodb+srv://cse22devpatel:devpatel@cluster0.xehtvqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        {}
    );
    console.log("Database Connected Successfully");
}


module.exports = databaseConnect;