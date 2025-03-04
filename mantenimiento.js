// Añadimos un evento de escucha al formulario con id "mantenimiento-form"
document.getElementById("mantenimiento-form").addEventListener("submit", function(event) {
    // Prevenimos el comportamiento por defecto (recarga de página)
    event.preventDefault();

    // Creamos un nuevo FormData para obtener los datos del formulario
    const formData = new FormData(this);

    // Convertimos el FormData en un objeto JavaScript
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;  // Asignamos cada valor del formulario a un objeto
    });

    // Enviamos los datos usando fetch a la API de mantenimiento
    fetch("http://localhost:3000/api/mantenimiento", {
        method: "POST",  // Usamos el método POST para enviar los datos
        headers: {
            "Content-Type": "application/json"  // Especificamos que el cuerpo es JSON
        },
        body: JSON.stringify(data)  // Convertimos el objeto JavaScript a una cadena JSON
    })
    .then(response => {
        // Intentamos obtener la respuesta como JSON
        return response.json();
    })
    .then((data) => {
        // Si la respuesta tiene una propiedad "success" con valor true, mostramos un mensaje de éxito
        if (data.success) {
            alert("✅ Su solicitud ha sido enviada con éxito.");
            document.getElementById("mantenimiento-form").reset();  // Restablecemos el formulario
        } else {
            alert("❌ Se ha producido un error al enviar la solicitud. Por favor, inténtelo nuevamente.");
        }
    })
    .catch((error) => {
        // Si ocurre un error en la solicitud o la respuesta, mostramos un mensaje de error
        console.error("Error:", error);
        alert("❌ Ha ocurrido un error inesperado al procesar la solicitud. Inténtelo de nuevo más tarde.");
    });
});
