// ============================
// Dependencias necesarias para el proyecto
// ============================

const express = require('express'); // Framework para manejar las solicitudes HTTP y crear servidores
const mysql = require('mysql2'); // Librería para interactuar con bases de datos MySQL
const bodyParser = require('body-parser'); // Middleware para analizar el cuerpo de las solicitudes HTTP
const multer = require('multer'); // Middleware para manejar la carga de archivos (subida de imágenes)
const cors = require('cors'); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const path = require('path'); // Módulo para trabajar con rutas de archivos y directorios
const fs = require('fs'); // Módulo para interactuar con el sistema de archivos
const sharp = require('sharp'); // Librería para la manipulación y conversión de imágenes

// ============================
// Inicialización del servidor y configuraciones
// ============================

const app = express();
const port = 3000;

// ============================
// Configuración de Middlewares
// ============================

app.use(cors()); // Habilitar CORS para permitir peticiones de diferentes orígenes
app.use(express.json()); // Permite que el servidor maneje datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Permite manejar formularios con datos URL codificados
app.use(bodyParser.json()); // Middleware para analizar datos JSON en el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para analizar datos de formularios URL codificados

// ============================
// Configuración de almacenamiento y validación de imágenes
// ============================

// Crear la carpeta "uploads" si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Crear la carpeta de uploads
}

// Configuración de Multer para almacenamiento y validación de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Establece la carpeta de destino de los archivos subidos
  },
  filename: (req, file, cb) => {
    // Se guarda con el nombre basado en la fecha y extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']; // Tipos de archivos permitidos
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar archivos permitidos
  } else {
    cb(new Error('Solo se permiten imágenes'), false); // Rechazar archivos no permitidos
  }
};

const upload = multer({ storage, fileFilter }); // Middleware de Multer
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos desde la carpeta 'uploads'

// ============================
// Conexión a la base de datos MySQL
// ============================

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SaulIsaac', // Contraseña de la base de datos
  database: 'concesionario' // Nombre de la base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos: ', err); // Manejo de errores de conexión
    return;
  }
  console.log('✅ Conexión a MySQL exitosa');
  console.log('==========================');
});

// ============================
// Ruta para el formulario y manejo de imágenes
// ============================

app.post('/submit-form', upload.single('imagen_url'), (req, res) => {
  if (req.file) {
    // Ruta del archivo original subido
    const originalImagePath = path.join(__dirname, 'uploads', req.file.filename);
    // Definir ruta de salida para la imagen convertida a .webp
    const outputImagePath = path.join(__dirname, 'uploads', Date.now() + '.webp');

    // Convertir la imagen a formato .webp con Sharp
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

        // Depuración: Mostrar los datos en consola
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

        // Insertar los datos en la base de datos
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

// ============================
// Ruta para servir las imágenes desde la carpeta 'uploads'
// ============================
app.get('/uploads/:image', (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.params.image); // Construye la ruta completa de la imagen
  res.sendFile(imagePath, (err) => { // Intenta enviar el archivo de la imagen
    if (err) {
      console.log("Error al enviar la imagen:", err); // Si hay un error, lo muestra en consola
      res.status(404).send('Imagen no encontrada'); // Envia un error 404 si la imagen no se encuentra
    }
  });
});

// ============================
// Ruta para obtener las solicitudes pendientes para que el administrador las revise
// ============================
app.get('/admin/solicitudes', (req, res) => {
  const query = 'SELECT * FROM solicitudes_autos WHERE estado = "Pendiente"'; // Consulta para obtener autos pendientes
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener las solicitudes:", error); // Si ocurre un error al consultar, lo muestra en consola
      return res.status(500).json({ message: "Error al obtener las solicitudes" }); // Responde con un error 500
    }
    return res.status(200).json(results); // Si todo va bien, devuelve los resultados como JSON
  });
});

// ============================
// Ruta para que el administrador acepte o rechace una solicitud de auto
// ============================
app.post('/admin/accept-reject', (req, res) => {
  const { solicitudId, decision } = req.body; // Recibe el ID de la solicitud y la decisión del administrador (aceptar o rechazar)

  // ============================
  // Validación: Si falta algún parámetro, responde con error
  // ============================
  if (!solicitudId || !decision) {
    return res.status(400).json({ message: 'Error: solicitudId y decision son requeridos' });
  }

  // ============================
  // Si la decisión es aceptar, se realiza el proceso de aceptación
  // ============================
  if (decision === 'aceptar') {
    db.beginTransaction((err) => { // Inicia una transacción para asegurarse de que todos los pasos ocurran correctamente
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar la transacción' });
      }

      // ============================
      // 1. Obtener la solicitud de la tabla 'solicitudes_autos'
      // ============================
      const selectQuery = 'SELECT * FROM solicitudes_autos WHERE id = ?';
      db.query(selectQuery, [solicitudId], (err, results) => {
        if (err || results.length === 0) { // Si no se encuentra la solicitud o hay error
          return db.rollback(() => { // Si hay error, hace rollback de la transacción
            return res.status(500).json({ message: 'Error al obtener la solicitud' });
          });
        }
        const auto = results[0]; // Toma el primer resultado (solo uno, ya que la solicitud debe ser única)

        // ============================
        // Depuración: Mostrar los datos del auto en consola
        // ============================
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

        // ============================
        // 2. Insertar la solicitud aceptada en la tabla 'solicitudes_aceptadas'
        // ============================
        const insertSolicitudAceptadaQuery = `INSERT INTO solicitudes_aceptadas
          (id_solicitud, id_usuario, marca, modelo, anio, kilometraje, transmision, electric, descripcionVehiculo, precioVenta, imagen_url, estado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const solicitudAceptadaValues = [
          auto.id,           // ID de la solicitud original
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
          "Aceptado"         // Estado "Aceptado"
        ];
        db.query(insertSolicitudAceptadaQuery, solicitudAceptadaValues, (err, solicitudAceptadaResult) => {
          if (err) { // Si hay error al insertar en 'solicitudes_aceptadas'
            return db.rollback(() => { // Realiza rollback
              return res.status(500).json({ message: 'Error al insertar en solicitudes_aceptadas' });
            });
          }

          // ============================
          // 3. Insertar la solicitud aceptada también en la tabla 'inventario_autos'
          // ============================
          const insertInventarioQuery = `INSERT INTO inventario_autos
            (id_solicitud, id_usuario, marca, modelo, anio, kilometraje, transmision, electric, descripcionVehiculo, precioVenta, imagen_url, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const inventarioValues = [
            auto.id,           // ID de la solicitud original
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
            "Aceptado"         // Estado "Aceptado"
          ];
          db.query(insertInventarioQuery, inventarioValues, (err, inventarioResult) => {
            if (err) { // Si hay error al insertar en 'inventario_autos'
              return db.rollback(() => { // Realiza rollback
                return res.status(500).json({ message: 'Error al insertar en inventario_autos' });
              });
            }

            // ============================
            // 4. Eliminar la solicitud de la tabla 'solicitudes_autos' después de haberla procesado
            // ============================
            const deleteQuery = 'DELETE FROM solicitudes_autos WHERE id = ?';
            db.query(deleteQuery, [solicitudId], (err, deleteResult) => {
              if (err) { // Si hay error al eliminar la solicitud
                return db.rollback(() => { // Realiza rollback
                  return res.status(500).json({ message: 'Error al eliminar la solicitud de solicitudes_autos' });
                });
              }
              db.commit((err) => { // Si todo salió bien, confirma la transacción
                if (err) {
                  return db.rollback(() => { // Realiza rollback en caso de error al confirmar
                    return res.status(500).json({ message: 'Error al confirmar la transacción' });
                  });
                }
                return res.status(200).json({ message: '✅ Solicitud aceptada. La solicitud ha sido registrada en el inventario.' });
              });
            });
          });
        });
      });
    });
  } else if (decision === 'rechazar') { // Si la decisión es rechazar
    // ============================
    // Eliminar la solicitud de la tabla 'solicitudes_autos' sin hacer ningún otro cambio
    // ============================
    const deleteQuery = 'DELETE FROM solicitudes_autos WHERE id = ?';
    db.query(deleteQuery, [solicitudId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error al eliminar la solicitud' });
      }
      return res.status(200).json({ message: '🚫 Solicitud rechazada y eliminada de solicitudes_autos' });
    });
  }
});


// ============================
// Ruta para obtener los autos
// ============================
app.get('/autos', (req, res) => {
  const { search = '', page = 1, limit = 4 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM inventario_autos WHERE estado = 'Aceptado' AND (marca LIKE '%${search}%' OR modelo LIKE '%${search}%') LIMIT ${limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) throw err;

    // ============================
    // Contamos el total de autos que cumplen con los criterios de búsqueda
    // ============================
    db.query(`SELECT COUNT(*) AS totalCount FROM inventario_autos WHERE estado = 'Aceptado' AND (marca LIKE '%${search}%' OR modelo LIKE '%${search}%')`, (err, countResult) => {
      if (err) throw err;
      res.json({
        autos: results,
        totalCount: countResult[0].totalCount
      });
    });
  });
});

// ============================
// Endpoint para verificar si el correo ya está registrado
// ============================
app.get('/check-email', (req, res) => {
  const { correo } = req.query;

  if (!correo) {
    return res.status(400).json({ message: 'Correo es necesario para la consulta' });
  }

  // ============================
  // Consulta a la base de datos para verificar si el correo ya está registrado
  // ============================
  db.query('SELECT * FROM users WHERE correo = ?', [correo], (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    // ============================
    // Si el correo ya existe, devolver una respuesta indicando que está registrado
    // ============================
    if (result.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

// ============================
// Endpoint para registrar un usuario
// ============================
app.post('/register', (req, res) => {
  const { nombre, telefono, correo, contrasena } = req.body;

  // ============================
  // Guardar al usuario en la base de datos
  // ============================
  const query = 'INSERT INTO users (nombre, telefono, correo, contrasena) VALUES (?, ?, ?, ?)';
  const values = [nombre, telefono, correo, contrasena];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);  // Para ver el error en la consola del servidor
      return res.status(500).json({ message: 'Error al registrar usuario' });
    }

    // ============================
    // Obtener el id del nuevo usuario generado automáticamente
    // ============================
    const idUsuario = result.insertId;

    console.log(`✅ Usuario registrado con éxito. ID: ${idUsuario}`); // Agregado console.log
    console.log('==========================');
    
    // Solo enviamos el id_usuario como parte de la respuesta al cliente
    res.status(200).json({
      message: 'Usuario registrado con éxito',
      id_usuario: idUsuario  // Solo devolver el id generado por la base de datos
    });
  });
});

// ============================
// Endpoint para iniciar sesión
// ============================
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña son necesarios' });
  }

  // ============================
  // Consulta para verificar si el usuario existe y la contraseña es correcta
  // ============================
  const query = 'SELECT id, correo, contrasena FROM users WHERE correo = ? AND contrasena = ?';
  db.query(query, [correo, contrasena], (err, result) => {
    if (err) {
      console.error('Error al verificar el usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (result.length > 0) {
      const userId = result[0].id;
      console.log(`✅ Inicio de sesión con éxito. ID: ${userId}`); // Agregado console.log
      console.log('==========================');

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

// ============================
// Ruta para procesar el formulario de mantenimiento
// ============================
app.post('/api/mantenimiento', (req, res) => {
  const { nombre, correo, telefono, marca, modelo, año, tipo_mantenimiento, descripcion } = req.body;

  // ============================
  // Insertar los datos en la tabla 'solicitudes_mantenimiento'
  // ============================
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

// ============================
// Ruta para procesar el formulario de servicio técnico
// ============================
app.post('/servicio-tecnico', upload.single('archivo'), (req, res) => {
  const { nombre, correo, telefono, motivo, descripcion } = req.body;

  // ============================
  // Insertar los datos en la tabla 'solicitudes_servicio'
  // ============================
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

// ============================
// Iniciar el servidor
// ============================
app.listen(port, () => {
  console.log('==========================');
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
