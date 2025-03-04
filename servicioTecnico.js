// Se añade un "listener" al formulario cuando se envíe
document.getElementById('servicio-tecnico-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar el comportamiento por defecto del formulario (que recarga la página)

    // Crear un FormData para enviar todos los datos del formulario, incluidos archivos
    const formData = new FormData(this);

    // Realizar la petición POST con los datos del formulario
    fetch('http://localhost:3000/servicio-tecnico', {
        method: 'POST',  // Definir el método HTTP
        body: formData   // Enviar el FormData como cuerpo de la solicitud
    })
    .then((response) => response.json())  // Convertir la respuesta en JSON
    .then((data) => {
        if (data.success) {
            // Si la respuesta es exitosa, se muestra un mensaje de éxito
            alert("✅ Su formulario ha sido enviado con éxito.");
        } else {
            // Si no es exitosa, mostrar un mensaje de error
            alert("❌ Se ha producido un error al enviar el formulario. Por favor, inténtelo nuevamente.");
        }
    })
    .catch((error) => {
        // En caso de que ocurra un error en la solicitud, se muestra un mensaje de error
        console.error("Error:", error);
        alert("❌ Ha ocurrido un error inesperado al procesar el formulario. Inténtelo de nuevo más tarde.");
    });

    // Después de enviar el formulario, restablecer los valores del formulario después de un breve retraso
    setTimeout(() => {
        this.reset();  // Restablece los valores del formulario después de enviarlo
    }, 100);  // Retraso de 100ms para asegurarse de que la solicitud se haya procesado primero
});
