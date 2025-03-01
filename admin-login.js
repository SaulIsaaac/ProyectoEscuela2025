// ID y contraseña predefinidos
const adminID = "123"; // ID del administrador (se puede cambiar)
const adminPassword = "admin123"; // Contraseña del administrador (se puede cambiar)

// Validación del formulario de inicio de sesión
const form = document.getElementById("adminLoginForm");
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que el formulario se envíe de la manera predeterminada

  // Obtener los valores del formulario ingresados por el usuario
  const enteredID = document.getElementById("adminID").value;
  const enteredPassword = document.getElementById("adminPassword").value;

  // Verificar si los datos ingresados coinciden con los predefinidos
  if (enteredID === adminID && enteredPassword === adminPassword) {
    alert("¡Bienvenido, administrador!"); // Mensaje de bienvenida
    // Redirige al panel de administración
    window.location.href = "admin-dashboard.html"; // Cambiar esta URL según sea necesario
  } else {
    alert("ID o contraseña incorrectos."); // Mensaje en caso de error
  }
});