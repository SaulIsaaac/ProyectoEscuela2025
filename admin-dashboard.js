// Función que carga los autos desde el localStorage y los muestra en el panel de administración
function loadCars() {
  // Recupera los autos del localStorage (si no hay, inicializa un array vacío)
  const cars = JSON.parse(localStorage.getItem("autos")) || [];

  const carsList = document.getElementById("carsList");
  carsList.innerHTML = ""; // Limpiamos la lista para evitar duplicados

  // Si no hay autos enviados, mostramos un mensaje
  if (cars.length === 0) {
    carsList.innerHTML = "<p>No hay autos enviados.</p>";
    return;
  }

  // Mostrar los autos en el panel de administración
  cars.forEach((car, index) => {
    const carDiv = document.createElement("div");
    carDiv.classList.add("car-item");

    // Crear el contenido HTML para cada auto
    carDiv.innerHTML = `
      <p><strong>Marca:</strong> ${car["Marca del Vehículo"]}</p>
      <p><strong>Modelo:</strong> ${car["Modelo del Vehículo"]}</p>
      <p><strong>Año:</strong> ${car["Año del Vehículo"]}</p>
      <p><strong>Precio:</strong> ${car["Precio de Venta"]}</p>
      <p><strong>Descripción:</strong> ${car["Descripción del Vehículo"]}</p>
      <p><strong>Foto:</strong> <img src="${car["Imagen"]}" alt="Imagen del auto" style="width: 100px;"></p>
      <button class="accept" data-index="${index}">Aceptar</button>
      <button class="reject" data-index="${index}">Rechazar</button>
    `;

    carsList.appendChild(carDiv);
  });

  // Añadir eventos para aceptar y rechazar autos
  document.querySelectorAll(".accept").forEach(button => {
    button.addEventListener("click", function() {
      const carIndex = this.getAttribute("data-index");
      acceptCar(carIndex); // Aceptar el auto
    });
  });

  document.querySelectorAll(".reject").forEach(button => {
    button.addEventListener("click", function() {
      const carIndex = this.getAttribute("data-index");
      rejectCar(carIndex); // Rechazar el auto
    });
  });
}

// Función para aceptar un auto y moverlo al inventario
function acceptCar(index) {
  const cars = JSON.parse(localStorage.getItem("autos"));
  const carToAccept = cars[index];

  // Guardar el auto aceptado en una nueva lista o moverlo a "comprar"
  let acceptedCars = JSON.parse(localStorage.getItem("acceptedCars")) || [];
  acceptedCars.push(carToAccept);
  localStorage.setItem("acceptedCars", JSON.stringify(acceptedCars));

  // Eliminar el auto de la lista de autos enviados
  cars.splice(index, 1);
  localStorage.setItem("autos", JSON.stringify(cars));

  // Recargar la lista de autos
  loadCars();
}

// Función para rechazar un auto y eliminarlo de la lista
function rejectCar(index) {
  const cars = JSON.parse(localStorage.getItem("autos"));

  // Eliminar el auto de la lista de autos enviados
  cars.splice(index, 1);
  localStorage.setItem("autos", JSON.stringify(cars));

  // Recargar la lista de autos
  loadCars();
}

// Cargar los autos al cargar la página
loadCars();
