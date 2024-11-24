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

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..')));

// Configuración de la base de datos
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

// Estrategia de autenticación local
passport.use(new LocalStrategy(
    { usernameField: 'correo', passwordField: 'contrasena' },
    function(correo, contrasena, done) {
        const query = `SELECT * FROM Usuarios WHERE Correo = ? AND Contrasena = ?`;
        db.query(query, [correo, contrasena], (err, results) => {
            if (err) {
                return done(err);
            }
            if (results.length > 0) {
                const user = {
                    id: results[0].ID,
                    username: results[0].Correo,
                    nombre: results[0].Nombre
                };
                return done(null, user);
            } else {
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

// Rutas de autenticación
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
            // Asegurarse de que el ID del usuario se almacena en el almacenamiento local
            res.json({ success: true, userID: user.id, nombreCompleto: user.nombre });
        });
    })(req, res, next);
});


app.get('/logout', (req, res) => { 
    req.logout(); 
    res.redirect('/'); 
});

// Ruta para registrar nuevos usuarios
app.post('/register', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const query = `INSERT INTO Usuarios (Nombre, Correo, Contrasena) VALUES (?, ?, ?)`;
    db.query(query, [nombre, correo, contrasena], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al registrar usuario' });
        } else {
            return res.json({ success: true, message: 'Usuario registrado exitosamente' });
        }
    });
});

// Ruta para confirmar reservas
app.post('/confirm_reservation', (req, res) => {
    const { usuarioID, entrenadorID, fechaHora } = req.body;
    console.log('Datos recibidos:', req.body); // Verificación en consola
    if (!usuarioID || !entrenadorID || !fechaHora) {
        return res.status(400).json({ success: false, message: 'Faltan datos para confirmar la reserva' });
    }

    const query = `INSERT INTO Reservas (UsuarioID, EntrenadorID, FechaHora) VALUES (?, ?, ?)`;
    db.query(query, [usuarioID, entrenadorID, fechaHora], (err, result) => {
        if (err) {
            console.error('Error al confirmar reserva:', err);
            return res.status(500).json({ success: false, message: 'Error al confirmar reserva' });
        }
        res.json({ success: true, message: 'Reserva confirmada exitosamente' });
    });
});


// Ruta para obtener reservas
app.get('/reservas', (req, res) => {
    const query = `SELECT r.ID, u.Nombre AS Usuario, e.Nombre AS Entrenador, r.FechaHora 
                   FROM Reservas r 
                   JOIN Usuarios u ON r.UsuarioID = u.ID 
                   JOIN Entrenadores e ON r.EntrenadorID = e.ID`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener reservas:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener reservas' });
        }
        res.json({ success: true, reservas: results });
    });
});

// Ruta para eliminar reservas
app.delete('/reservas/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM Reservas WHERE ID = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar reserva:', err);
            return res.status(500).json({ success: false, message: 'Error al eliminar reserva' });
        }
        res.json({ success: true, message: 'Reserva eliminada exitosamente' });
    });
});

// Ruta para servir admin.html
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, '..', 'admin.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });
});

// Ruta para servir index.html
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
