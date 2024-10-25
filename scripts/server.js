const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ivana1983', // Agrega tu contraseña aquí si tienes una configurada
    database: 'gym_reservas'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/index.html');
});

app.post('/register', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const query = `INSERT INTO Usuarios (Nombre, Correo, Contrasena) VALUES ('${nombre}', '${correo}', '${contrasena}')`;
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error al registrar usuario');
            throw err;
        }
        res.send('Usuario registrado exitosamente');
    });
});

app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;
    const query = `SELECT * FROM Usuarios WHERE Correo = '${correo}'`;
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error al iniciar sesión');
            throw err;
        }
        if (result.length > 0 && result[0].Contrasena === contrasena) {
            res.send(`Bienvenido, ${result[0].Nombre}`);
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

