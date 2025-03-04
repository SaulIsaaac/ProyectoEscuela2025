document.getElementById("mantenimiento-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch("http://localhost:3000/api/mantenimiento", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Intentamos parsear la respuesta como JSON
        return response.json();
    })
    .then((data) => {
        if (data.success) {
            alert("✅ Su solicitud ha sido enviada con éxito.");
            document.getElementById("mantenimiento-form").reset(); // Restablecer el formulario
        } else {
            alert("❌ Se ha producido un error al enviar la solicitud. Por favor, inténtelo nuevamente.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("❌ Ha ocurrido un error inesperado al procesar la solicitud. Inténtelo de nuevo más tarde.");
    });
});