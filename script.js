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
    const fileInput = document.getElementById('imagen_url');
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
const emailInput = document.getElementById('correo'); // Obtenemos el campo de correo

if (registerForm && emailInput) {
  // Verificar si el correo está registrado cuando el usuario cambia el valor del campo
  emailInput.addEventListener('blur', () => {  // 'blur' es cuando el usuario deja el campo
    const correo = emailInput.value;

    if (correo) {
      // Realizar la consulta al servidor para verificar si el correo ya está registrado
      fetch(`http://localhost:3000/check-email?correo=${correo}`)
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            // Si el correo ya está registrado, mostrar mensaje y permitir al usuario cambiar el correo
            alert('Este correo ya está registrado');
            emailInput.removeAttribute('disabled');  // Habilitar el campo de correo nuevamente
            emailInput.value = '';  // Limpiar el valor del campo
          } else {
            // Si el correo no está registrado, habilitar el campo si estaba deshabilitado
            emailInput.removeAttribute('disabled');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error al verificar el correo');
        });
    }
  });

  // Lógica para el formulario de registro
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el envío normal del formulario

    const newUser = {
      nombre: document.getElementById('name').value,
      telefono: document.getElementById('telefono').value,
      correo: document.getElementById('correo').value,
      contrasena: document.getElementById('contrasena').value,
    };
    
    
    // Verificar si el correo o algún campo está vacío
    if (!newUser.nombre || !newUser.correo || !newUser.telefono || !newUser.contrasena) {
      console.error('Faltan campos en el formulario');
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Si el correo no está deshabilitado (es decir, no está registrado), enviar los datos
    if (!emailInput.disabled) {
      // Enviar los datos al servidor
      fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser), // Enviar los datos como JSON
      })
      .then(response => {
        // Verificar si la respuesta es exitosa (status 200)
        if (!response.ok) {
          throw new Error('Error al registrar el usuario');
        }
        return response.json(); // Procesar la respuesta JSON
      })
      .then(data => {
        if (data.message) {
          alert(data.message); // Mostrar la alerta de éxito
          if (data.message === 'Usuario registrado con éxito') {
            // Guardar el id_usuario recibido del servidor en localStorage
            localStorage.setItem('id_usuario', data.id_usuario); // Guardamos el id_usuario
            window.location.href = 'login.html'; // Redirige al login
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al registrar el usuario');
      });
    } else {
      alert('Este correo ya está registrado');
    }
    
  });
}


// Lógica para el formulario de inicio de sesión
const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('correo'); // Obtenemos el campo de correo para inicio de sesión

if (loginForm && loginEmailInput) {
  // Lógica para el formulario de inicio de sesión
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el envío normal del formulario

    const loginData = {
      correo: document.getElementById('correo').value,
      contrasena: document.getElementById('contrasena').value,
    };

    // Verificar si el correo o la contraseña están vacíos
    if (!loginData.correo || !loginData.contrasena) {
      console.error('Faltan campos en el formulario');
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Enviar los datos al servidor para verificar el inicio de sesión
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    .then(response => response.json()) // Procesar la respuesta del servidor
    .then(data => {
      console.log('Respuesta del servidor (login):', data); // Depuración para ver qué responde el servidor
      if (data.message) {
        alert(data.message); // Mostrar la alerta de éxito
        if (data.message === 'Inicio de sesión con éxito') {
          // Guardar el id del usuario en el localStorage
          localStorage.setItem('userId', data.id); // Guardar el id del usuario
          window.location.href = 'menu-principal.html'; // Redirige al panel de usuario
        }
      }
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al iniciar sesión');
    });
  });
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
if (document.getElementById('contrasena') && document.getElementById('togglePassword')) {
  togglePasswordVisibility('contrasena', 'togglePassword'); // Para el login
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
  const fileInput = document.getElementById('imagen_url');
  fileInput.value = ''; // Esto asegurará que el input de archivo se resetee
}

// Asignar la función de reset al botón de reset
const resetButton = document.querySelector('button[type="reset"]');
if (resetButton) {
  resetButton.addEventListener('click', resetForm);
}