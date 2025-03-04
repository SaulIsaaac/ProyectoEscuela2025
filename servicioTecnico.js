document.getElementById('servicio-tecnico-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar el comportamiento por defecto del formulario

    // Crear un FormData para enviar todos los datos del formulario, incluidos archivos
    const formData = new FormData(this);

    fetch('http://localhost:3000/servicio-tecnico', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
.then((data) => {
    if (data.success) {
        alert("✅ Su formulario ha sido enviado con éxito.");
    } else {
        alert("❌ Se ha producido un error al enviar el formulario. Por favor, inténtelo nuevamente.");
    }
})
.catch((error) => {
    console.error("Error:", error);
    alert("❌ Ha ocurrido un error inesperado al procesar el formulario. Inténtelo de nuevo más tarde.");
});

document.getElementById("servicio-tecnico-form").addEventListener("submit", function(event) {
    setTimeout(() => {
        this.reset(); // Restablece los valores del formulario después de enviarlo
    }, 100);
});
});