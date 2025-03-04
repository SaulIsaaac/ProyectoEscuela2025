// Obtener las solicitudes desde el backend y mostrar los autos pendientes
fetch('http://localhost:3000/admin/solicitudes') // Asegúrate de que la URL sea la correcta
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      console.log(data.message); // No hay solicitudes pendientes
    } else {
      // Mostrar los autos en el menú de administración
      const solicitudesContainer = document.getElementById('solicitudes-container');
      solicitudesContainer.innerHTML = ''; // Limpiar cualquier contenido previo

      data.forEach(solicitud => {
        const solicitudElement = document.createElement('div');
        solicitudElement.classList.add('solicitud-item');
        solicitudElement.innerHTML = `
          <img src="${solicitud.imagen_url}" alt="Imagen del carro">
          <div class="info">
            <h3>${solicitud.marca} - ${solicitud.modelo} - ${solicitud.anio}</h3>
            <p>${solicitud.descripcionVehiculo}</p>
            <p><strong>Precio:</strong> $${solicitud.precioVenta}</p>
          </div>
          <div class="buttons">
            <button onclick="aceptarSolicitud(${solicitud.id})">Aceptar</button>
            <button onclick="rechazarSolicitud(${solicitud.id})" class="reject">Rechazar</button>
          </div>
        `;
        solicitudesContainer.appendChild(solicitudElement);
      });
    }
  })
  .catch(error => {
    console.error('Error al obtener las solicitudes:', error);
  });

// Función para aceptar una solicitud
function aceptarSolicitud(solicitudId) {
  const decision = 'aceptar';
  
  // Realiza la petición al backend para aceptar la solicitud
  fetch('http://localhost:3000/admin/accept-reject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ solicitudId, decision }),
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message); // Mostrar el mensaje de éxito o error
    if (data.message.includes('✅')) {
      // Recargar la lista de solicitudes pendientes después de la acción
      location.reload(); // Recargar solo si la acción fue exitosa
    }
  })
  .catch(error => {
    console.error('Error al aceptar la solicitud:', error);
    alert('Hubo un error al aceptar la solicitud.'); // Mensaje de error
  });
}

// Función para rechazar una solicitud
function rechazarSolicitud(solicitudId) {
  const decision = 'rechazar';
  
  // Realiza la petición al backend para rechazar la solicitud
  fetch('http://localhost:3000/admin/accept-reject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ solicitudId, decision }),
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message); // Mostrar el mensaje de éxito o error
    // Recargar la lista de solicitudes pendientes después de la acción
    if (data.message.includes('🚫')) {
      location.reload(); // Recargar solo si la acción fue exitosa
    }
  })
  .catch(error => {
    console.error('Error al rechazar la solicitud:', error);
    alert('Hubo un error al rechazar la solicitud.'); // Mensaje de error
  });
}

// Función para obtener y mostrar las solicitudes (para refrescar la lista)
function obtenerSolicitudes() {
  fetch('http://localhost:3000/admin/solicitudes')
    .then(response => response.json())
    .then(data => {
      const solicitudesContainer = document.getElementById('solicitudes-container');
      solicitudesContainer.innerHTML = ''; // Limpiar contenido previo

      if (data.message) {
        solicitudesContainer.innerHTML = '<p>No hay solicitudes pendientes.</p>';
      } else {
        data.forEach(solicitud => {
          const solicitudElement = document.createElement('div');
          solicitudElement.classList.add('solicitud-item');
          solicitudElement.innerHTML = `
            <h3>${solicitud.marca} ${solicitud.modelo} (${solicitud.anio})</h3>
            <p>${solicitud.descripcionVehiculo}</p>
            <p>Precio: ${solicitud.precioVenta}</p>
            <img src="${solicitud.imagen_url}" alt="Imagen del auto" width="100">
            <button onclick="aceptarSolicitud(${solicitud.id})">Aceptar</button>
            <button onclick="rechazarSolicitud(${solicitud.id})">Rechazar</button>
          `;
          solicitudesContainer.appendChild(solicitudElement);
        });
      }
    })
    .catch(error => {
      console.error('Error al obtener las solicitudes:', error);
    });
}
