const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos.');
});

// Ruta de registro de usuario
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Error en el registro');
        res.status(201).send('Usuario registrado');
    });
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send('Error en el inicio de sesión');
        if (results.length === 0) return res.status(404).send('Usuario no encontrado');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});