// ============================
// Formateo del campo de precio
// ============================
const priceInput = document.getElementById('precio');
if (priceInput) {
  priceInput.addEventListener('input', function () {
    let currentValue = this.value;
    // Limpiar los valores no numéricos
    let numericValue = currentValue.replace(/[^0-9]/g, '');
    this.value = numericValue; // Asignar solo el valor numérico
  });

  // Manejo de borrado
  priceInput.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      let currentValue = this.value;
      // Si el valor tiene " USD", eliminamos antes de realizar el borrado
      if (currentValue.endsWith(' USD')) {
        this.value = currentValue.slice(0, -4); // Eliminar " USD"
      }
    }
  });
}

// ============================
// Formateo del campo de kilometraje
// ============================
const kilometrajeInput = document.getElementById('kilometraje');
if (kilometrajeInput) {
  kilometrajeInput.addEventListener('input', function () {
    let currentValue = this.value;
    // Limpiar los valores no numéricos
    let numericValue = currentValue.replace(/[^0-9]/g, '');
    this.value = numericValue; // Asignar solo el valor numérico
  });

  // Manejo de borrado
  kilometrajeInput.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      let currentValue = this.value;
      // Si el valor tiene " km", eliminamos antes de realizar el borrado
      if (currentValue.endsWith(' km')) {
        this.value = currentValue.slice(0, -3); // Eliminar " km"
      }
    }
  });
}

// ============================
// Mostrar imagen seleccionada
// ============================
function displayImage(event) {
  const file = event.target.files[0]; // Obtener el archivo desde el evento
  if (file) { // Verificar si el archivo existe
    const reader = new FileReader(); // Crear un objeto FileReader
    reader.onload = function (e) {
      const image = document.getElementById('vehicle-image');
      const imagePlaceholder = document.querySelector('.image-placeholder');
      image.src = e.target.result;  // Establecer la imagen cargada
      image.style.display = 'block'; // Asegurarse de que la imagen sea visible
      // Ocultar el texto del placeholder cuando se carga la imagen
      imagePlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file); // Leer el archivo como URL en base64
  }
}

// ============================
// Manejo del formulario
// ============================
document.addEventListener("DOMContentLoaded", function () {
  console.log("📌 JS cargado correctamente");

  const sellForm = document.getElementById("sellForm");
  const idUsuarioInput = document.getElementById("id_usuario");
  let isSubmitting = false;

  // Recuperar el ID del usuario desde localStorage
  const idUsuario = localStorage.getItem("userId");
  console.log("ID Usuario desde localStorage:", idUsuario);

  if (!sellForm) {
    console.warn("⚠️ No se encontró el formulario.");
    return;
  }

  if (!idUsuario) {
    alert("⚠️ ID de usuario no encontrado.");
    return;
  } else {
    idUsuarioInput.value = idUsuario;
  }

  // Enviar formulario
  sellForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (isSubmitting) {
      console.warn("⚠️ Formulario ya en proceso de envío.");
      return;
    }

    isSubmitting = true; // Marcar que el formulario se está enviando

    console.log("🚀 Enviando formulario...");

    const formData = new FormData(sellForm);
    formData.append("id_usuario", idUsuario);

    // Obtener el valor de 'electric' desde el select
    const electricSelect = document.getElementById("electric");
    formData.append("electric", electricSelect.value); // El valor será 'Si' o 'No'
 
    const imageInput = document.getElementById("imagen_url");
    if (imageInput && imageInput.files.length > 0) {
      formData.append("imagen_url", imageInput.files[0]);
    }

    // Depurar el contenido del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Enviar el formulario con fetch
    fetch("http://localhost:3000/submit-form", {
      method: "POST",
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Solicitud enviada correctamente") {
        alert("✅ Su formulario ha sido enviado con éxito.\nLa solicitud se encuentra en estado 'Pendiente' para su revisión.");
        resetForm();
      } else {
        alert("❌ Ha ocurrido un error al enviar la solicitud. Por favor, inténtelo nuevamente.");
      }
    })
    .finally(() => {
      isSubmitting = false;
    });
  });

  // Resetear formulario
  function resetForm() {
    sellForm.reset();
    const image = document.getElementById("vehicle-image");
    const imagePlaceholder = document.querySelector(".image-placeholder");

    if (image) image.style.display = "none";
    if (imagePlaceholder) imagePlaceholder.style.display = "block";

    const imageInput = document.getElementById("imagen_url");
    if (imageInput) imageInput.value = "";
  }
});

// ============================
// Botón de reset
// ============================
document.addEventListener('DOMContentLoaded', function () {
  const resetButton = document.getElementById('resetButton'); // Selecciona el botón de reset
  const imageContainer = document.getElementById('image_container');
  const image = document.getElementById('vehicle-image');
  const imagePlaceholder = document.querySelector('.image-placeholder');
  const fileInput = document.getElementById('imagen_url'); 

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      // Resetear valores de los campos del formulario
      document.getElementById("sellForm").reset();

      // Ocultar la imagen y mostrar el placeholder
      if (image) image.style.display = 'none';
      if (imagePlaceholder) imagePlaceholder.style.display = 'block';

      // Limpiar el campo de imagen
      if (fileInput) fileInput.value = '';
    });
  }
});
