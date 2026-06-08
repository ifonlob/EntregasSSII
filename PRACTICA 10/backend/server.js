const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.post('/api/registro', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, correo',
            [nombre, correo, contrasena]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'El correo ya está registrado' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        const usuario = result.rows[0];

        if (usuario && usuario.contrasena === contrasena) {
            res.status(200).json({ correo: usuario.correo, nombre: usuario.nombre });
        } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(3000, () => console.log('Backend corriendo en el puerto 3000'));