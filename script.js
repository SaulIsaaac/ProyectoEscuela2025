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

// Función para mostrar la alerta de éxito
function showSuccessAlert(message) {
  alert(message); // Mostrar la alerta con el mensaje proporcionado
}

//  Funcion para enviar el formulario 
const form = document.getElementById('sellForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar el envío normal del formulario
    
    // Crear el objeto FormData para enviar tanto los datos como la imagen
    const formData = new FormData(form);


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

// Función para mostrar alertas de éxito
function showSuccessAlert(message) {
  const alert = document.getElementById('alert');
  if (alert) { // Verificar que el elemento existe
    alert.style.display = 'block';
    alert.querySelector('p').innerText = message;
  } else {
    console.error('El elemento de alerta no se encuentra en el DOM');
  }
}


// Función para cerrar la alerta
function closeAlert() {
  const alert = document.getElementById('alert');
  alert.style.display = 'none';
}

// Definir la función para permitir solo números en el campo de teléfono
function formatPhone(inputElement) {
  let phoneNumber = inputElement.value; // Obtener el valor del input

  // Eliminar todos los caracteres que no sean números
  phoneNumber = phoneNumber.replace(/\D/g, ''); 

  // Actualizar el valor del input con solo los números
  inputElement.value = phoneNumber;
}

// Asignar la función de formateo al campo de teléfono
const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
  telefonoInput.addEventListener('input', function() {
    formatPhone(this); // Llamar a la función para permitir solo números
  });
}

// Lógica para el formulario de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el envío normal del formulario

    const newUser = {
      nombre: document.getElementById('fullName').value,
      correo: document.getElementById('newEmail').value,
      contrasena: document.getElementById('newPassword').value,
    };

    const newEmail = document.getElementById('newEmail');
    const newPassword = document.getElementById('newPassword');

    if (newEmail && newPassword) {
      const newUser = {
        nombre: document.getElementById('fullName').value,
        correo: newEmail.value,
        contrasena: newPassword.value,
      };
    } else {
      console.error('Faltan campos en el formulario');
}


    // Verificar si el correo ya está registrado
    const existingUser = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUser.some(user => user.correo === newUser.correo);

    if (userExists) {
      showSuccessAlert('El correo ya está registrado');
    } else {
      // Registrar el nuevo usuario
      existingUser.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUser));

      showSuccessAlert('Fuiste registrado con éxito');
      window.location.href = 'login.html'; // Redirige al login
    }
  });
}

// Lógica para el formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el envío del formulario

    const correo = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;

    // Recuperar usuarios desde localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.correo === correo && u.contrasena === contrasena);

    if (user) {
      showSuccessAlert('Inicio de sesión exitoso');
      window.location.href = 'inventario.html'; // Redirige al inventario
    } else {
      showSuccessAlert('Correo o contraseña incorrectos');
    }
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
