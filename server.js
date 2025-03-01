const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurar CORS para permitir solicitudes desde el cliente
app.use(cors());

// Configurar el body parser para manejar solicitudes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear la carpeta "uploads" si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurar multer para manejar la carga de archivos (imagen)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardará la imagen
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Asignar un nombre único a la imagen
  }
});

const upload = multer({ storage: storage });

// Conectar con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Tu usuario de MySQL
  password: 'SaulIsaac', // Tu contraseña de MySQL
  database: 'concesionario' // Nombre de la base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos: ', err);
    return;
  }
  console.log('✅ Conexión a MySQL exitosa');
});

// Ruta para manejar el envío del formulario de venta
app.post('/submit-form', upload.single('imagen'), (req, res) => {
  console.log('📩 Datos recibidos:', req.body, req.file); // Depuración

  // Recibir los datos del formulario
  const { id_usuario, nombre, correo, telefono, marca, modelo, anio, kilometraje, transmision, electric, descripcion, precio } = req.body;
  const imagen_url = req.file ? req.file.filename : null;

  if (!id_usuario) {
    return res.status(400).json({ message: 'Error: id_usuario es requerido' });
  }

  // Insertar los datos en la base de datos
  const insertQuery = `INSERT INTO solicitudes_autos (id_usuario, nombre, correo, telefono, marca, modelo, año, kilometraje, transmision, electric, descripcion, precio, imagen_url) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertQuery, [id_usuario, nombre, correo, telefono, marca, modelo, anio, kilometraje, transmision, electric ? 1 : 0, descripcion, precio, imagen_url], (err) => {
    if (err) {
      console.error('❌ Error al ejecutar query:', err);
      return res.status(500).json({ message: 'Error al enviar el formulario' });
    }
    res.status(200).json({ message: '✅ Formulario enviado correctamente' });
  });
});

// Ruta para que el administrador acepte o rechace una solicitud
app.post('/admin/accept-reject', (req, res) => {
  const { solicitudId, decision } = req.body;

  if (!solicitudId || !decision) {
    return res.status(400).json({ message: 'Error: solicitudId y decision son requeridos' });
  }

  if (decision === 'aceptar') {
    const query = 'SELECT * FROM solicitudes_autos WHERE id = ?';
    db.query(query, [solicitudId], (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ message: 'Error al obtener la solicitud' });
      }

      const auto = result[0];
      const insertQuery = `INSERT INTO inventario_autos (id_solicitud, marca, modelo, año, kilometraje, transmision, electric, descripcion, precio, imagen_url) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(insertQuery, [auto.id, auto.marca, auto.modelo, auto.año, auto.kilometraje, auto.transmision, auto.electric, auto.descripcion, auto.precio, auto.imagen_url], (insertErr) => {
        if (insertErr) {
          return res.status(500).json({ message: 'Error al mover la solicitud al inventario' });
        }

        const updateQuery = 'UPDATE solicitudes_autos SET estado = "Aceptado" WHERE id = ?';
        db.query(updateQuery, [solicitudId], (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ message: 'Error al actualizar la solicitud' });
          }
          res.status(200).json({ message: '✅ Solicitud aceptada y movida al inventario' });
        });
      });
    });
  } else if (decision === 'rechazar') {
    const query = 'UPDATE solicitudes_autos SET estado = "Rechazado" WHERE id = ?';
    db.query(query, [solicitudId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al rechazar la solicitud' });
      }
      res.status(200).json({ message: '🚫 Solicitud rechazada' });
    });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
