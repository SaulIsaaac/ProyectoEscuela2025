document.getElementById('servicio-tecnico-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar el comportamiento por defecto del formulario

    // Crear un FormData para enviar todos los datos del formulario, incluidos archivos
    const formData = new FormData(this);

    fetch('http://localhost:3000/servicio-tecnico', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Formulario enviado con éxito');
        } else {
            alert('Hubo un error al enviar el formulario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
});

document.getElementById("servicio-tecnico-form").addEventListener("submit", function(event) {
    setTimeout(() => {
        this.reset(); // Reinicia los valores del formulario después de enviarlo
    }, 100);
});