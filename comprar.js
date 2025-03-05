let totalCars = [];  // Autos que vamos a mostrar
let totalPages = 0;  // Total de páginas para paginación
let currentPage = 1;  // Página actual
let precioCarroSeleccionado = 0; // Variable global para el precio del carro seleccionado

// Función para cargar los autos
function fetchCars(searchTerm = '', page = 1) {
    const url = searchTerm 
        ? `http://localhost:3000/autos?limit=4&search=${searchTerm}&page=${page}`
        : `http://localhost:3000/autos?limit=4&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            totalCars = data.autos || [];
            totalPages = Math.ceil(data.totalCount / 4);  // Calcular el total de páginas
            renderCars();  // Renderizar los autos
            renderPagination();  // Renderizar la paginación
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al cargar los autos.');
        });
}

// Función para renderizar los autos
function renderCars() {
    const carsList = document.getElementById('carsList');
    carsList.innerHTML = '';  // Limpiar el contenido previo

    totalCars.forEach(auto => {
        const div = document.createElement('div');
        div.classList.add('auto-card');
        div.innerHTML = `
            <img src="${auto.imagen_url}" alt="Imagen del vehículo" />
            <h3>${auto.marca} ${auto.modelo} - ${auto.anio}</h3>
            <p>${auto.descripcionVehiculo}</p>
            <p>Precio: $${auto.precioVenta}</p>
            <button class="ver-detalles">Ver detalles</button>
        `;
        carsList.appendChild(div);
    });

    // Agregar el evento a los botones "Ver detalles"
    const buttons = document.querySelectorAll('.ver-detalles');
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            const autoIndex = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
            const auto = totalCars[autoIndex];

            // Dentro del evento "click" del botón "Ver detalles"
            precioCarroSeleccionado = auto.precioVenta;
            
            const modal = document.getElementById('modal-details');
            const modalBody = document.getElementById('modal-body');

            // Limpiar el contenido anterior en el modal
            modalBody.innerHTML = '';

            modalBody.innerHTML = `
                <img src="${auto.imagen_url}" alt="Imagen del vehículo" />
                <table>
                    <tr><th>Marca</th><td>${auto.marca}</td></tr>
                    <tr><th>Modelo</th><td>${auto.modelo}</td></tr>
                    <tr><th>Año</th><td>${auto.anio}</td></tr>
                    <tr><th>Kilometraje</th><td>${auto.kilometraje}</td></tr>
                    <tr><th>Transmisión</th><td>${auto.transmision}</td></tr>
                    <tr><th>Eléctrico</th><td>${auto.electric}</td></tr>
                    <tr><th>Precio</th><td>$${auto.precioVenta}</td></tr>
                    <tr><th>Descripción</th><td>${auto.descripcionVehiculo}</td></tr>
                    <!-- Fila para el botón "Comprar ahora" -->
                    <tr>
                        <td colspan="2" class="button-row">
                            <button id="buyNow" class="btn-buy">Comprar ahora</button>
                        </td>
                    </tr>
                </table>
            `;

            // Mostrar el modal de detalles
            modal.style.display = 'block';

            // Agregar evento al botón "Comprar ahora"
            const buyNowButton = document.getElementById('buyNow');
            buyNowButton.addEventListener('click', function() {
                // Cerrar el modal de detalles
                modal.style.display = 'none';

                // Abrir el modal de opciones de pago
                const paymentOptionsModal = document.getElementById('payment-options-modal');
                paymentOptionsModal.style.display = 'flex';  // Muestra el modal de opciones de pago
            });
        });
    });
}

// Asegurarse de que el modal esté oculto cuando se carga la página
const modal = document.getElementById('modal-details');
modal.style.display = 'none';  // Esconde el modal al inicio

// Funcionalidad para cerrar el modal de detalles
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';  // Cierra el modal al hacer clic en la X
});

// Cerrar el modal al presionar la tecla Escape
window.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        modal.style.display = 'none';  // Cierra el modal al presionar Escape
    }
});

// Función para renderizar la paginación
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';  // Limpiar la paginación previa

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => goToPage(i);  // Cambiar a la página correspondiente
        pagination.appendChild(pageButton);
    }
}

// Función para cambiar a una página específica
function goToPage(page) {
    currentPage = page;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    fetchCars(searchTerm, page);  // Recargar los autos de la página seleccionada
}

// Agregar eventos a los botones de búsqueda y reset
document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    fetchCars(searchTerm, 1);  // Recargar los autos con la búsqueda
});

document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('searchInput').value = '';  // Limpiar el campo de búsqueda
    fetchCars('', 1);  // Recargar todos los autos
});

// Cargar los autos al iniciar
window.onload = () => {
    fetchCars();  // Llamada inicial para cargar los autos
};

document.addEventListener('DOMContentLoaded', function() {

  // ============================
  // Modal de detalles adicionales
  // ============================
  const modalDetails = document.getElementById('modal-details'); // Modal de detalles del auto
  const closeDetails = modalDetails.querySelector('.close'); // Botón para cerrar el modal

  // Abrir modal de detalles del vehículo
  document.querySelectorAll('.auto-container .car-card').forEach(car => {
      car.addEventListener('click', () => {
          modalDetails.style.display = 'block';
      });
  });

  // Cerrar modal de detalles
  closeDetails.addEventListener('click', () => {
      modalDetails.style.display = 'none';
  });

  // ============================
// Modal de opciones de pago
// ============================
const paymentOptionsModal = document.getElementById('payment-options-modal'); // Modal de opciones de pago
const closePaymentOptionsModal = document.getElementById('close-payment-options-modal'); // Botón de cierre de la X
const openPaymentInstallmentsModalButton = document.getElementById('open-payment-installments-modal'); // Boton de pago a mensualidades
const closeOptionsModalBtn = document.getElementById('close-options-modal'); // Botón de "Volver"
const openPaymentCashModal = document.getElementById('open-payment-cash-modal'); // Botón para abrir pago de contado

// Asegurándonos de que el botón de cierre de la X funcione
if (closePaymentOptionsModal) {
    closePaymentOptionsModal.addEventListener('click', () => {
        paymentOptionsModal.style.display = 'none'; // Cerrar el modal de opciones de pago
    });
}

// Manejo del botón "Volver"
closeOptionsModalBtn.addEventListener('click', () => {
    paymentOptionsModal.style.display = 'none'; // Cerrar el modal de opciones de pago
});

// Manejo del modal de pago de contado
openPaymentCashModal.addEventListener('click', () => {
    paymentOptionsModal.style.display = 'none';
    cashPaymentModal.style.display = 'block';
});

// ============================
// Cerrar el modal de opciones de pago con la tecla ESC
// ============================
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Verificar si el modal está abierto
        if (paymentOptionsModal.style.display === 'block' || paymentOptionsModal.style.display === 'flex') {
            paymentOptionsModal.style.display = 'none'; // Cerrar el modal
        }
    }
});




// ============================
// Modal de pago en efectivo
// ============================
const cashPaymentModal = document.getElementById('cash-payment-modal'); // Modal de pago en efectivo
const closeCashPaymentModal = document.getElementById('close-cash-payment-modal'); // Botón de cierre del modal de pago en efectivo
const cancelCashPayment = document.getElementById('cancel-cash-payment-1'); // Botón para cancelar el pago en efectivo
const cashOption = document.getElementById('cash-option-1'); // Botón para pagar con efectivo
const chequeOption = document.getElementById('cheque-option-1'); // Botón para pagar con cheque
const cardOption1 = document.getElementById('card-option-1'); // Botón para pagar con tarjeta (trigger para PayPal modal)

// Cerrar el modal de pago en efectivo
closeCashPaymentModal.addEventListener('click', () => {
    cashPaymentModal.style.display = 'none';
});
cancelCashPayment.addEventListener('click', () => {
    cashPaymentModal.style.display = 'none';
});

// Alertas para efectivo y cheque
cashOption.addEventListener('click', () => {
    alert('Por favor, dirígete a una sucursal para completar la transacción.');
});
chequeOption.addEventListener('click', () => {
    alert('Por favor, dirígete a una sucursal para completar la transacción.');
});

// ============================
// Modal de Pago con Tarjeta (PayPal)
// ============================
const paypalPaymentModal = document.getElementById('paypal-payment-modal'); // Modal de pago con PayPal
const closePaypalPaymentModal = document.getElementById('close-paypal-payment-modal'); // Botón de cierre del modal de PayPal
const cancelPaypalPayment = document.getElementById('cancel-paypal-payment'); // Botón para cancelar el pago de PayPal

// Al hacer clic en "Paga con Tarjeta" en el modal de efectivo, se abre el modal de PayPal
cardOption1.addEventListener('click', function() {
    // Cierra el modal de pago en efectivo
    cashPaymentModal.style.display = 'none';
    // Abre el modal de PayPal
    paypalPaymentModal.style.display = 'block';
    
    // Renderiza el botón de PayPal dentro del contenedor solo si aún no se ha renderizado.
    if (!document.getElementById('paypal-button-rendered')) {
        if (typeof paypal !== 'undefined') {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: precioCarroSeleccionado // Precio a pagar 
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Pago exitoso, gracias ' + details.payer.name.given_name);
                        paypalPaymentModal.style.display = 'none';
                        // Aquí puedes agregar más acciones, como redirigir o actualizar la interfaz.
                    });
                },
                onError: function(err) {
                    console.error('Error en el pago', err);
                    alert("Hubo un error con el pago. Por favor, intente nuevamente.");
                }
            }).render('#paypal-button-container').then(() => {
                // Una vez renderizado, insertamos un marcador para evitar renderizar de nuevo.
                const marker = document.createElement('div');
                marker.id = 'paypal-button-rendered';
                document.getElementById('paypal-button-container').appendChild(marker);
            });
        } else {
            console.error("El SDK de PayPal no está cargado.");
        }
    }
});

// Cerrar el modal de PayPal al hacer clic en el botón de cerrar
closePaypalPaymentModal.addEventListener('click', function() {
    paypalPaymentModal.style.display = 'none';
});

// Cerrar el modal de PayPal al hacer clic en "Cancelar"
cancelPaypalPayment.addEventListener('click', function() {
    paypalPaymentModal.style.display = 'none';
});

// Cerrar el modal de PayPal si se hace clic fuera del contenido
paypalPaymentModal.addEventListener('click', function(event) {
    if (event.target === paypalPaymentModal) {
        paypalPaymentModal.style.display = 'none';
    }
});


// ============================
// Modal de Pagar a Mensualidades
// ============================
const modalPagarMensualidades = document.getElementById('modal-pagar-mensualidades');
const closeModalPagarMensualidades = document.getElementById('close-modal-pagar-mensualidades');
const calcularPagoButton = document.getElementById('calcular-pago');
const tablaPagoMensual = document.getElementById('tabla-pago-mensual');
const engancheInput = document.getElementById('enganche-input');
const mesesInput = document.getElementById('meses-financiacion');

// Cerrar el modal de Pagar a Mensualidades al hacer clic en el botón de cierre
closeModalPagarMensualidades.addEventListener('click', () => {
    // Reiniciar valores cuando se cierra el modal
    modalPagarMensualidades.style.display = 'none';
    reiniciarFormulario();
});

// Función para calcular el pago mensual
function calcularPago() {
    const enganche = parseFloat(engancheInput.value); // Obtener el valor del enganche
    const meses = parseInt(mesesInput.value); // Obtener los meses seleccionados
    const tasaInteresAnual = 12.99 / 100;  // Tasa de interés anual de BBVA del 12.99%
    const tasaInteresMensual = tasaInteresAnual / 12; // Convertir a tasa mensual

    // Verificar si los datos están completos y son válidos
    if (isNaN(enganche) || isNaN(meses) || enganche <= 0 || meses <= 0 || isNaN(precioCarroSeleccionado) || precioCarroSeleccionado <= 0) {
        alert('Por favor, ingresa un valor válido para el enganche, el precio del carro y los meses.');
        return;
    }

    // Verificar si el enganche es mayor o igual al precio del carro
    if (enganche >= precioCarroSeleccionado) {
        alert('El enganche no puede ser mayor o igual al precio del carro.');
        return;
    }

    // Calcular el monto financiado (saldo restante)
    const montoFinanciado = precioCarroSeleccionado - enganche;

    // Asegurarnos de que el monto financiado es un número positivo
    if (isNaN(montoFinanciado) || montoFinanciado <= 0) {
        alert('El monto financiado no es válido. Revisa el precio del carro y el enganche.');
        return;
    }

    // Calcular el total con interés compuesto mensualmente
    const totalConInteres = montoFinanciado * Math.pow(1 + tasaInteresMensual, meses);

    // Calcular los intereses totales a pagar
    const interesesTotales = totalConInteres - montoFinanciado;

    // Calcular el pago mensual
    const pagoMensual = totalConInteres / meses;

    // Calcular el total a pagar (precio original + intereses)
    const totalAPagar = parseFloat(precioCarroSeleccionado) + parseFloat(interesesTotales);  // Asegurarse de sumar como números

    // Redondear todos los valores hacia arriba (número entero superior)
    const precioRedondeado = Math.ceil(precioCarroSeleccionado);
    const interesesRedondeados = Math.ceil(interesesTotales);
    const pagoMensualRedondeado = Math.ceil(pagoMensual);
    const totalPagarRedondeado = Math.ceil(totalAPagar);

    // Mostrar los valores corregidos en la tabla
    tablaPagoMensual.innerHTML = `
        <table class="tabla-pago-resultados">
            <thead>
                <tr>
                    <th>Precio Original del Vehículo</th>
                    <th>Intereses Totales a Pagar</th>
                    <th>Meses a financiar</th>
                    <th>Pago Mensual</th>
                    <th>Total a Pagar</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>$${precioRedondeado}</td>
                    <td>$${interesesRedondeados}</td>
                    <td>${meses}</td>
                    <td>$${pagoMensualRedondeado}</td>
                    <td>$${totalPagarRedondeado}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Evento para calcular el pago mensual
calcularPagoButton.addEventListener('click', calcularPago);

// ============================
// Abrir el Modal de Mensualidades desde el Modal de Opciones de Pago
// ============================
openPaymentInstallmentsModalButton.addEventListener('click', () => {
    // Cerrar el modal de opciones
    paymentOptionsModal.style.display = 'none';
    // Abrir el modal de mensualidades
    modalPagarMensualidades.style.display = 'flex'; // O 'block' dependiendo de tu preferencia de diseño
});

// Función para reiniciar el formulario
function reiniciarFormulario() {
    // Resetear los campos de entrada
    engancheInput.value = '';
    mesesInput.value = '';
    
    // Limpiar la tabla de resultados
    tablaPagoMensual.innerHTML = '';
}

// ============================
// Cerrar el modal con la tecla ESC
// ============================
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Verificar si el modal está abierto
        if (modalPagarMensualidades.style.display === 'flex') {
            modalPagarMensualidades.style.display = 'none';
            reiniciarFormulario();
            }
        }
    });
});