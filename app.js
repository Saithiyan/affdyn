const express = require('express');
const app = express();
const api = require ('./api/v1/index');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const connection = mongoose.connection;

// Port Setting 3000
app.set('port', process.env.port || 10000);

// Middleware BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware CORS
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Route API
app.use('/api/v1', api);
// No route found
app.use((req, res)=>{
    const err = new Error();
    err.message = 'Not found';
    err.staus = 404;
    res.json(err);
});

mongoose.connect('mongodb://localhost:27017/affdynamique');

connection.on('error', (err)=>{
    console.error(`Connection to MongoDB error: ${err.message}`);
});

connection.once('open', () => {
    console.log('Connected to MongoDB !');

    // Server listen port 3000
    app.listen(app.get('port'), ()=>{
        console.log(`Server express listenig on port ${app.get('port')}`);
    });
});

