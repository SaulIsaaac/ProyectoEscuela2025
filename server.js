const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); 

const app = express();
const port = 3000;

// Configurar CORS y parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear la carpeta "uploads" si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de Multer para almacenamiento y validación de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta destino
  },
  filename: (req, file, cb) => {
    // Se guarda inicialmente con la extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'), false);
  }
};

const upload = multer({ storage, fileFilter });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SaulIsaac',
  database: 'concesionario'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos: ', err);
    return;
  }
  console.log('✅ Conexión a MySQL exitosa');
  console.log('==========================')
});

// Ruta para el formulario
app.post('/submit-form', upload.single('imagen_url'), (req, res) => {
  if (req.file) {
    // Ruta del archivo original subido
    const originalImagePath = path.join(__dirname, 'uploads', req.file.filename);
    // Definir ruta de salida para la imagen convertida a .webp (nombre único)
    const outputImagePath = path.join(__dirname, 'uploads', Date.now() + '.webp');

    // Convertir la imagen a .webp con sharp
    sharp(originalImagePath)
      .webp()
      .toFile(outputImagePath, (err, info) => {
        if (err) {
          return res.status(500).json({ message: 'Error al procesar la imagen', error: err.message });
        }

        // Eliminar el archivo original
        fs.unlink(originalImagePath, (err) => {
          if (err) {
            console.log('Error al eliminar el archivo original:', err);
          }
        });

        // URL completa de la imagen convertida
        const imagen_url = `http://localhost:3000/uploads/${path.basename(outputImagePath)}`;

        // Extraer datos del formulario
        const { 
          id_usuario, 
          nombre, 
          correo, 
          telefono, 
          marca, 
          modelo, 
          anio, 
          kilometraje, 
          transmision, 
          electric, 
          descripcionVehiculo, 
          precioVenta 
        } = req.body;

        // Verifica el valor de electric y convierte en 'Sí' o 'No'
        const electricValue = electric && electric[0] === '1' ? 'Sí' : 'No';

        // Depuración: Mostrar los datos en consola con formato resaltado
        console.log(`\x1b[1m\x1b[34mEstos son los datos que enviaron desde el formulario\x1b[0m`); 
        console.log(`\x1b[1m\x1b[36mNombre:\x1b[0m ${nombre}`);
        console.log(`\x1b[1m\x1b[36mCorreo Electrónico:\x1b[0m ${correo}`);
        console.log(`\x1b[1m\x1b[36mTeléfono:\x1b[0m ${telefono}`);
        console.log(`\x1b[1m\x1b[36mMarca del vehículo:\x1b[0m ${marca}`);
        console.log(`\x1b[1m\x1b[36mModelo del vehículo:\x1b[0m ${modelo}`);
        console.log(`\x1b[1m\x1b[36mAño del vehículo:\x1b[0m ${anio}`);
        console.log(`\x1b[1m\x1b[36mKilometraje:\x1b[0m ${kilometraje}`);
        console.log(`\x1b[1m\x1b[36mTipo de Transmisión:\x1b[0m ${transmision}`);
        console.log(`\x1b[1m\x1b[36m¿Es el auto eléctrico?\x1b[0m ${electricValue}`);
        console.log(`\x1b[1m\x1b[36mDescripción del Vehículo:\x1b[0m ${descripcionVehiculo}`);
        console.log(`\x1b[1m\x1b[36mPrecio de Venta:\x1b[0m ${precioVenta}`);
        console.log(`\x1b[1m\x1b[36mLink de la imagen:\x1b[0m ${imagen_url}`);
        console.log("=======================");

        // Validar que todos los datos necesarios estén presentes
        if (!id_usuario || !nombre || !correo || !telefono || !marca || !modelo || !anio || !kilometraje || !transmision || electricValue === undefined || !descripcionVehiculo || !precioVenta || !imagen_url) {
          return res.status(400).json({ message: 'Faltan datos obligatorios en la solicitud' });
        }

        // Insertar datos en la base de datos
        const query = `
          INSERT INTO solicitudes_autos 
          (id_usuario, nombre, correo, telefono, marca, modelo, anio, kilometraje, transmision, electric, descripcionVehiculo, precioVenta, imagen_url, estado) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')
        `;

        const values = [
          id_usuario, 
          nombre, 
          correo, 
          telefono, 
          marca, 
          modelo, 
          anio, 
          kilometraje, 
          transmision, 
          electricValue, 
          descripcionVehiculo, 
          precioVenta, 
          imagen_url
        ];

        db.query(query, values, (error, results) => {
          if (error) {
            return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
          }

          return res.json({ message: 'Solicitud enviada correctamente' });
        });
      });
  } else {
    return res.status(400).json({ message: 'No se ha subido una imagen.' });
  }
});




// Ruta para servir las imágenes desde la carpeta 'uploads'
app.get('/uploads/:image', (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.params.image);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.log("Error al enviar la imagen:", err);
      res.status(404).send('Imagen no encontrada');
    }
  });
});



// Tu ruta para solicitudes pendientes
app.get('/admin/solicitudes', (req, res) => {
  const query = 'SELECT * FROM solicitudes_autos WHERE estado = "Pendiente"';
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener las solicitudes:", error);
      return res.status(500).json({ message: "Error al obtener las solicitudes" });
    }
    return res.status(200).json(results);
  });
});

// Ruta para que el administrador acepte o rechace una solicitud
app.post('/admin/accept-reject', (req, res) => {
  const { solicitudId, decision } = req.body;

  if (!solicitudId || !decision) {
    return res.status(400).json({ message: 'Error: solicitudId y decision son requeridos' });
  }

  if (decision === 'aceptar') {
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar la transacción' });
      }

      // 1. Obtener la solicitud de solicitudes_autos
      const selectQuery = 'SELECT * FROM solicitudes_autos WHERE id = ?';
      db.query(selectQuery, [solicitudId], (err, results) => {
        if (err || results.length === 0) {
          return db.rollback(() => {
            return res.status(500).json({ message: 'Error al obtener la solicitud' });
          });
        }
        const auto = results[0];

        // Depuración: Mostrar los datos en consola con formato resaltado
        console.log(`\x1b[1m\x1b[34mEstos son los datos del auto que aceptaste\x1b[0m`);
        console.log(`\x1b[1m\x1b[36mID del usuario:\x1b[0m ${auto.id_usuario}`);
        console.log(`\x1b[1m\x1b[36mMarca del vehículo:\x1b[0m ${auto.marca}`);
        console.log(`\x1b[1m\x1b[36mModelo del vehículo:\x1b[0m ${auto.modelo}`);
        console.log(`\x1b[1m\x1b[36mAño del vehículo:\x1b[0m ${auto.anio}`);
        console.log(`\x1b[1m\x1b[36mKilometraje:\x1b[0m ${auto.kilometraje}`);
        console.log(`\x1b[1m\x1b[36mTipo de Transmisión:\x1b[0m ${auto.transmision}`);
        console.log(`\x1b[1m\x1b[36m¿Es el auto eléctrico?\x1b[0m ${auto.electric}`);
        console.log(`\x1b[1m\x1b[36mDescripción del Vehículo:\x1b[0m ${auto.descripcionVehiculo}`);
        console.log(`\x1b[1m\x1b[36mPrecio de Venta:\x1b[0m ${auto.precioVenta}`);
        console.log(`\x1b[1m\x1b[36mLink de la imagen:\x1b[0m ${auto.imagen_url}`);
        console.log("=======================");

        // 2. Insertar en solicitudes_aceptadas (copiando la información)
        const insertSolicitudAceptadaQuery = `INSERT INTO solicitudes_aceptadas
          (id_solicitud, id_usuario, marca, modelo, anio, kilometraje, transmision, electric, descripcionVehiculo, precioVenta, imagen_url, estado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const solicitudAceptadaValues = [
          auto.id,           // id_solicitud: referencia al id original de solicitudes_autos
          auto.id_usuario, 
          auto.marca, 
          auto.modelo, 
          auto.anio, 
          auto.kilometraje, 
          auto.transmision, 
          auto.electric, 
          auto.descripcionVehiculo, 
          auto.precioVenta, 
          auto.imagen_url,
          "Aceptado"         // Estado
        ];
        db.query(insertSolicitudAceptadaQuery, solicitudAceptadaValues, (err, solicitudAceptadaResult) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({ message: 'Error al insertar en solicitudes_aceptadas' });
            });
          }

          // 3. Insertar en inventario_autos con los mismos datos
          const insertInventarioQuery = `INSERT INTO inventario_autos
            (id_solicitud, id_usuario, marca, modelo, anio, kilometraje, transmision, electric, descripcionVehiculo, precioVenta, imagen_url, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const inventarioValues = [
            auto.id,           // id_solicitud: mismo id original de solicitudes_autos
            auto.id_usuario, 
            auto.marca, 
            auto.modelo, 
            auto.anio, 
            auto.kilometraje, 
            auto.transmision, 
            auto.electric, 
            auto.descripcionVehiculo, 
            auto.precioVenta, 
            auto.imagen_url,
            "Aceptado"         // Estado
          ];
          db.query(insertInventarioQuery, inventarioValues, (err, inventarioResult) => {
            if (err) {
              return db.rollback(() => {
                return res.status(500).json({ message: 'Error al insertar en inventario_autos' });
              });
            }

            // 4. Eliminar la solicitud de solicitudes_autos
            const deleteQuery = 'DELETE FROM solicitudes_autos WHERE id = ?';
            db.query(deleteQuery, [solicitudId], (err, deleteResult) => {
              if (err) {
                return db.rollback(() => {
                  return res.status(500).json({ message: 'Error al eliminar la solicitud de solicitudes_autos' });
                });
              }
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    return res.status(500).json({ message: 'Error al confirmar la transacción' });
                  });
                }
                return res.status(200).json({ message: '✅ Solicitud aceptada. La solicitud ha sido registrada en el inventario. Puede acceder al inventario de vehículos desde el menú principal para visualizar los detalles disponibles.' });
              });
            });
          });
        });
      });
    });
  } else if (decision === 'rechazar') {
    // Para rechazar, eliminamos la solicitud de solicitudes_autos
    const deleteQuery = 'DELETE FROM solicitudes_autos WHERE id = ?';
    db.query(deleteQuery, [solicitudId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar la solicitud' });
      }
      return res.status(200).json({ message: '🚫 Solicitud rechazada y eliminada de solicitudes_autos' });
    });
  }
});
































// Ruta para obtener los autos
app.get('/autos', (req, res) => {
  const { search = '', page = 1, limit = 4 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM inventario_autos WHERE estado = 'Aceptado' AND (marca LIKE '%${search}%' OR modelo LIKE '%${search}%') LIMIT ${limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) throw err;

    // Contamos el total de autos que cumplen con los criterios de búsqueda
    db.query(`SELECT COUNT(*) AS totalCount FROM inventario_autos WHERE estado = 'Aceptado' AND (marca LIKE '%${search}%' OR modelo LIKE '%${search}%')`, (err, countResult) => {
      if (err) throw err;
      res.json({
        autos: results,
        totalCount: countResult[0].totalCount
      });
    });
  });
});

// Endpoint para verificar si el correo ya está registrado
app.get('/check-email', (req, res) => {
  const { correo } = req.query;

  if (!correo) {
    return res.status(400).json({ message: 'Correo es necesario para la consulta' });
  }

  // Consulta a la base de datos para verificar si el correo ya está registrado
  db.query('SELECT * FROM users WHERE correo = ?', [correo], (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    // Si el correo ya existe, devolver una respuesta indicando que está registrado
    if (result.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

app.post('/register', (req, res) => {
  const { nombre, telefono, correo, contrasena } = req.body;

  // Guardar al usuario en la base de datos
  const query = 'INSERT INTO users (nombre, telefono, correo, contrasena) VALUES (?, ?, ?, ?)';
  const values = [nombre, telefono, correo, contrasena];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);  // Para ver el error en la consola del servidor
      return res.status(500).json({ message: 'Error al registrar usuario' });
    }

    // Obtener el id del nuevo usuario generado automáticamente
    const idUsuario = result.insertId;

    console.log(`✅ Usuario registrado con éxito. ID: ${idUsuario}`); // Agregado console.log
    console.log('==========================')
    

    // Solo enviamos el id_usuario como parte de la respuesta al cliente
    res.status(200).json({
      message: 'Usuario registrado con éxito',
      id_usuario: idUsuario  // Solo devolver el id generado por la base de datos
    });
  });
});



// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña son necesarios' });
  }

  // Consulta para verificar si el usuario existe y la contraseña es correcta
  const query = 'SELECT id, correo, contrasena FROM users WHERE correo = ? AND contrasena = ?';
  db.query(query, [correo, contrasena], (err, result) => {
    if (err) {
      console.error('Error al verificar el usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (result.length > 0) {
      const userId = result[0].id;
      console.log(`✅ Inicio de sesión con éxito. ID: ${userId}`); // Agregado console.log
      console.log('==========================')

      
      // Si el usuario existe, enviar mensaje de éxito junto con el id del usuario
      return res.json({
        message: 'Inicio de sesión con éxito',
        id: userId
      });
    } else {
      // Si no existe, enviar mensaje de error
      return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
    }
  });
});






// Ruta para procesar el formulario
app.post('/api/mantenimiento', (req, res) => {
  const { nombre, correo, telefono, marca, modelo, año, tipo_mantenimiento, descripcion } = req.body;

  // Insertar los datos en la tabla 'solicitudes_mantenimiento'
  const query = 'INSERT INTO solicitudes_mantenimiento (nombre, correo, telefono, marca, modelo, año, tipo_mantenimiento, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [nombre, correo, telefono, marca, modelo, año, tipo_mantenimiento, descripcion], (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      // Responder con un error en formato JSON
      return res.status(500).json({
        success: false,
        message: 'Error al procesar la solicitud.'
      });
    }
    // Responder con éxito en formato JSON
    res.status(200).json({
      success: true,
      message: 'Solicitud enviada correctamente.'
    });
  });
});

// Ruta para procesar el formulario
app.post('/servicio-tecnico', upload.single('archivo'), (req, res) => {
  const { nombre, correo, telefono, motivo, descripcion } = req.body;

  // Insertar los datos en la tabla 'solicitudes_servicio'
  const query = 'INSERT INTO solicitudes_servicio (nombre, correo, telefono, motivo, descripcion ) VALUES (?, ?, ?, ?, ? )';

  db.query(query, [nombre, correo, telefono, motivo, descripcion], (err, result) => {
      if (err) {
          console.error('Error al insertar los datos:', err);
          return res.status(500).send('Error al procesar la solicitud.');
      }

      // Responder con un mensaje de éxito
      res.json({ success: true, message: 'Solicitud enviada correctamente.' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log('==========================')
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
