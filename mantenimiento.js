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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Solicitud enviada con éxito.");
            document.getElementById("mantenimiento-form").reset(); // Resetear el formulario
        } else {
            alert("Hubo un error al enviar la solicitud.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al enviar la solicitud.");
    });
});
