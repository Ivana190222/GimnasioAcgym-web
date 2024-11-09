const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ 
    secret: 'secret', 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new LocalStrategy(
    { usernameField: 'correo', passwordField: 'contrasena' },
    function(correo, contrasena, done) {
        console.log('Attempting login for user:', correo);
        const query = `SELECT * FROM Usuarios WHERE Correo = ? AND Contrasena = ?`;
        db.query(query, [correo, contrasena], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return done(err);
            }
            if (results.length > 0) {
                const user = {
                    username: results[0].Correo,
                    nombre: results[0].Nombre // Incluyendo el campo 'Nombre'
                };
                console.log('User login successful:', user.nombre); // Depuración
                return done(null, user);
            } else {
                console.log('Invalid credentials for user:', correo); // Depuración adicional
                return done(null, false, { message: 'Credenciales incorrectas' });
            }
        });
    }
));



passport.serializeUser((user, done) => { 
    done(null, user); 
});

passport.deserializeUser((user, done) => { 
    done(null, user); 
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Could not log in user' });
            }
            // Asegúrate de que el objeto 'user' tenga un campo 'nombre'
            console.log('User info:', user); // Depuración
            return res.json({ success: true, nombreCompleto: user.nombre });
        });
    })(req, res, next);
});


app.get('/logout', (req, res) => { 
    req.logout(); 
    res.redirect('/'); 
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ivana1983',
    database: 'gym_reservas'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ajuste de la ruta para servir index.html desde la raíz del proyecto
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'index.html'); // Ruta ajustada para acceder a la raíz del proyecto
    console.log('Attempting to serve file at:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving file:', err);
            res.status(404).send('File not found');
        }
    });
});

app.post('/register', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const query = `INSERT INTO Usuarios (Nombre, Correo, Contrasena) VALUES (?, ?, ?)`;
    db.query(query, [nombre, correo, contrasena], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al registrar usuario' });
        } else {
            res.json({ success: true, message: 'Usuario registrado exitosamente' });
        }
    });
});

app.post('/confirm_reservation', (req, res) => {
    const { usuarioID, entrenadorID, fechaHora } = req.body;
    const query = `INSERT INTO Reservas (UsuarioID, EntrenadorID, FechaHora) VALUES (?, ?, ?)`;
    db.query(query, [usuarioID, entrenadorID, fechaHora], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al confirmar reserva' });
        } else {
            res.json({ success: true, message: 'Reserva confirmada exitosamente' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
