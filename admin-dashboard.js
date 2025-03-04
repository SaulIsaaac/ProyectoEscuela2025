// Obtener las solicitudes desde el backend y mostrar los autos pendientes
fetch('http://localhost:3000/admin/solicitudes')
  .then(response => response.json()) // Convertir la respuesta en formato JSON
  .then(data => {
    if (data.message) {
      console.log(data.message); // Si no hay solicitudes, mostrar el mensaje en la consola
    } else {
      // Mostrar los autos en el menú de administración
      const solicitudesContainer = document.getElementById('solicitudes-container');
      solicitudesContainer.innerHTML = ''; // Limpiar cualquier contenido previo

      // Recorrer las solicitudes y crear un div para cada una
      data.forEach(solicitud => {
        const solicitudElement = document.createElement('div');
        solicitudElement.classList.add('solicitud-item');
        solicitudElement.innerHTML = `
          <img src="${solicitud.imagen_url}" alt="Imagen del carro"> <!-- Imagen del vehículo -->
          <div class="info">
            <h3>${solicitud.marca} - ${solicitud.modelo} - ${solicitud.anio}</h3> <!-- Información del vehículo -->
            <p>${solicitud.descripcionVehiculo}</p> <!-- Descripción del vehículo -->
            <p><strong>Precio:</strong> $${solicitud.precioVenta}</p> <!-- Precio del vehículo -->
          </div>
          <div class="buttons">
            <!-- Botones para aceptar o rechazar la solicitud -->
            <button onclick="aceptarSolicitud(${solicitud.id})">Aceptar</button>
            <button onclick="rechazarSolicitud(${solicitud.id})" class="reject">Rechazar</button>
          </div>
        `;
        solicitudesContainer.appendChild(solicitudElement); // Añadir el div creado al contenedor
      });
    }
  })
  .catch(error => {
    console.error('Error al obtener las solicitudes:', error); // Mostrar error en la consola si falla la petición
  });

// Función para aceptar una solicitud
function aceptarSolicitud(solicitudId) {
  const decision = 'aceptar'; // Definir la acción a realizar

  // Realiza la petición al backend para aceptar la solicitud
  fetch('http://localhost:3000/admin/accept-reject', {
    method: 'POST', // Método HTTP POST para enviar los datos
    headers: {
      'Content-Type': 'application/json', // Tipo de contenido en formato JSON
    },
    body: JSON.stringify({ solicitudId, decision }), // Cuerpo de la solicitud con la ID y la decisión
  })
  .then(response => response.json()) // Convertir la respuesta en formato JSON
  .then(data => {
    alert(data.message); // Mostrar el mensaje de éxito o error
    if (data.message.includes('✅')) {
      // Recargar la lista de solicitudes pendientes solo si la acción fue exitosa
      location.reload();
    }
  })
  .catch(error => {
    console.error('Error al aceptar la solicitud:', error); // Mostrar error en la consola si falla la petición
    alert('Hubo un error al aceptar la solicitud.'); // Mostrar mensaje de error
  });
}

// Función para rechazar una solicitud
function rechazarSolicitud(solicitudId) {
  const decision = 'rechazar'; // Definir la acción a realizar

  // Realiza la petición al backend para rechazar la solicitud
  fetch('http://localhost:3000/admin/accept-reject', {
    method: 'POST', // Método HTTP POST para enviar los datos
    headers: {
      'Content-Type': 'application/json', // Tipo de contenido en formato JSON
    },
    body: JSON.stringify({ solicitudId, decision }), // Cuerpo de la solicitud con la ID y la decisión
  })
  .then(response => response.json()) // Convertir la respuesta en formato JSON
  .then(data => {
    alert(data.message); // Mostrar el mensaje de éxito o error
    // Recargar la lista de solicitudes pendientes solo si la acción fue exitosa
    if (data.message.includes('🚫')) {
      location.reload();
    }
  })
  .catch(error => {
    console.error('Error al rechazar la solicitud:', error); // Mostrar error en la consola si falla la petición
    alert('Hubo un error al rechazar la solicitud.'); // Mostrar mensaje de error
  });
}

// Función para obtener y mostrar las solicitudes (para refrescar la lista)
function obtenerSolicitudes() {
  fetch('http://localhost:3000/admin/solicitudes')
    .then(response => response.json()) // Convertir la respuesta en formato JSON
    .then(data => {
      const solicitudesContainer = document.getElementById('solicitudes-container');
      solicitudesContainer.innerHTML = ''; // Limpiar contenido previo

      // Si no hay solicitudes, mostrar mensaje
      if (data.message) {
        solicitudesContainer.innerHTML = '<p>No hay solicitudes pendientes.</p>';
      } else {
        // Recorrer las solicitudes y mostrarlas
        data.forEach(solicitud => {
          const solicitudElement = document.createElement('div');
          solicitudElement.classList.add('solicitud-item');
          solicitudElement.innerHTML = `
            <h3>${solicitud.marca} ${solicitud.modelo} (${solicitud.anio})</h3> <!-- Información del vehículo -->
            <p>${solicitud.descripcionVehiculo}</p> <!-- Descripción del vehículo -->
            <p>Precio: ${solicitud.precioVenta}</p> <!-- Precio del vehículo -->
            <img src="${solicitud.imagen_url}" alt="Imagen del auto" width="100"> <!-- Imagen del vehículo -->
            <!-- Botones para aceptar o rechazar la solicitud -->
            <button onclick="aceptarSolicitud(${solicitud.id})">Aceptar</button>
            <button onclick="rechazarSolicitud(${solicitud.id})">Rechazar</button>
          `;
          solicitudesContainer.appendChild(solicitudElement); // Añadir el div creado al contenedor
        });
      }
    })
    .catch(error => {
      console.error('Error al obtener las solicitudes:', error); // Mostrar error en la consola si falla la petición
    });
}
