// Asignar la función de formateo al campo de precio
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
// Función para formatear el kilometraje
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

const form = document.getElementById('sellForm');
if (form) {
  // Al cargar el formulario, rellenamos el campo id_usuario con el valor del localStorage
  const id_usuario = localStorage.getItem('id_usuario');
  if (id_usuario) {
    document.getElementById('id_usuario').value = id_usuario;
  } else {
    alert('No se encontró el ID del usuario. Asegúrate de haber iniciado sesión');
  }

  // Enviar el formulario
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar el envío normal del formulario
    

    // Crear el objeto FormData para enviar tanto los datos como la imagen
    const formData = new FormData(form);
    const imageFile = document.getElementById('imagen').files[0];
    if (imageFile) {
      formData.append('imagen', imageFile);  // Asegúrate de que la imagen esté incluida
    }

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/submit-form', {  // Asegúrate de usar la ruta correcta
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Solicitud aceptada y movida al inventario') {
        alert('Formulario enviado con éxito y solicitud aceptada'); // Alerta en caso de éxito
      } else if (data.message === 'Error al enviar el formulario') {
        alert('Algo salió mal, por favor intenta de nuevo'); // Alerta en caso de error
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al enviar el formulario'); // Alerta en caso de error en la solicitud
    });

    // Resetear el formulario y ocultar la imagen cargada
    const image = document.getElementById('vehicle-image');
    const imagePlaceholder = document.querySelector('.image-placeholder');
    image.style.display = 'none';
    imagePlaceholder.style.display = 'block';
    const fileInput = document.getElementById('imagen');
    fileInput.value = ''; // Limpiar el input de archivo
    form.reset(); // Resetear el formulario
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío normal del formulario

    // Obtener los valores del formulario y hacer trim para eliminar espacios en blanco
    const nombre = document.getElementById('fullName').value.trim();
    const telefono = document.getElementById('phoneNumber').value.trim();
    const correo = document.getElementById('newEmail').value.trim();
    const contrasena = document.getElementById('newPassword').value.trim();

    // Verificar que los campos no estén vacíos
    if (!nombre || !correo || !contrasena || !telefono) {
      console.error('Faltan campos en el formulario');
      alert('Por favor, complete todos los campos');
      return;
    }

    // Crear el objeto newUser con el teléfono incluido
    const newUser = { nombre, correo, contrasena, telefono };

    try {
      // Enviar la solicitud al backend
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json(); // Asegúrate de parsear la respuesta JSON

      if (response.ok) {
        console.log('Usuario registrado:', data);
        alert('Registro exitoso');
        window.location.href = "login.html"; // Redirigir a login después del registro
      } else {
        console.error('Error en el registro:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      alert('Error en la conexión con el servidor');
    }
  });
}


// Lógica para el formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el envío del formulario

    const correo = document.getElementById('username').value.trim(); // Hacer trim para evitar espacios en blanco
    const contrasena = document.getElementById('password').value.trim();

    // Enviar solicitud de login al backend
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contrasena })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('id_usuario', data.id_usuario); // Guardamos el ID del usuario
        showSuccessAlert('Inicio de sesión exitoso');
        window.location.href = 'menu-principal.html'; // Redirige al inventario
      } else {
        showSuccessAlert('Correo o contraseña incorrectos');
      }
    })
    .catch(error => {
      console.error('Error en la conexión:', error);
      showSuccessAlert('Error al intentar iniciar sesión');
    });
  });
}


// Función para mostrar la imagen seleccionada
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

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility(passwordFieldId, toggleButtonId) {
  const passwordField = document.getElementById(passwordFieldId);
  const toggleButton = document.getElementById(toggleButtonId);

  toggleButton.addEventListener('click', function() {
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
  });
}

// Activar la visibilidad de la contraseña en los formularios
if (document.getElementById('password') && document.getElementById('togglePassword')) {
  togglePasswordVisibility('password', 'togglePassword'); // Para el login
}

if (document.getElementById('newPassword') && document.getElementById('togglePasswordRegister')) {
  togglePasswordVisibility('newPassword', 'togglePasswordRegister'); // Para el registro
}

// Función para resetear el formulario y la imagen
function resetForm() {
  // Restablecer el formulario
  const form = document.getElementById('sellForm');
  if (form) {
    form.reset();
  }

  // Ocultar la imagen cargada y mostrar el placeholder
  const image = document.getElementById('vehicle-image');
  const imagePlaceholder = document.querySelector('.image-placeholder');

  image.style.display = 'none';
  imagePlaceholder.style.display = 'block';

  // Limpiar el input de imagen para permitir la carga de una nueva imagen
  const fileInput = document.getElementById('imagen');
  fileInput.value = ''; // Esto asegurará que el input de archivo se resetee
}

// Asignar la función de reset al botón de reset
const resetButton = document.querySelector('button[type="reset"]');
if (resetButton) {
  resetButton.addEventListener('click', resetForm);
}
