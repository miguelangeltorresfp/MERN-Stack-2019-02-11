const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// MIDDLEWARES
// Para poder recibir los datos que vienen desde los formularios
app.use(express.urlencoded({ extended: false }));
// Para poder hacer peticiones ajax, necesitamos poder manejar objetos json ( los likes en la app )
app.use(express.json());
// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// DATABASE
// Primero se ejecuta la base de datos y luego la aplicación del servidor.
require('./database');

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
