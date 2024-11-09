let menuVisible = false;
//Función que oculta o muestra el menu
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}
function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
}
function calculateIMC(){
    var weight = document.getElementById('weight').value;
    var height = document.getElementById('height').value;

if (weight !== '' && height !== ''){
    var bmi = weight /((height / 100)**2);
    var result = document.getElementById('result');
    result.innerHTML = 'Tu IMC es: '+ bmi.toFixed(2);

    if (bmi < 18.5){
        result.innerHTML += ' - Bajo peso';
    }else if (bmi <25){
        result.innerHTML += ' - Peso normal';
    }else if (bmi < 30){
        result.innerHTML += ' - Sobrepeso';
    }else {
        result.innerHTML += ' - Obesidad';
    }
}
}

const cartItems = [];

const sessionDetails = {
    'Lunes a viernes 08:00hs': 'Aerobica Vero',
    'Lunes a viernes 14:00hs': 'Aerobica Vero',
    'Lunes a viernes 19:00hs': 'Aerobica Vero',
    'Lunes, Mierc y viernes 15hs': 'Aerobox Brenda',
    'Martes y jueves 19hs': 'Aerobox Brenda',
    'Lunes, Mierc y viernes 18hs': 'Funcional Masculino Joaquin',
    'Martes y Jueves 19hs': 'Funcional Masculino Joaquin',
    'Lunes y Miercoles 20hs': 'Boxeo Recreativo Victor'
};

function addToCart(session) {
    if (!isLoggedIn) {
        openModal(); // Abre el modal si el usuario no está logueado
        return;
    }
    const sessionDetail = `${session} - ${sessionDetails[session]}`;
    cartItems.push(sessionDetail);
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = ''; // Limpiar la lista actual
    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        cartList.appendChild(listItem);
    });

    // Asegúrate de que solo haya un botón "Confirmar Reserva" al final de la lista
    if (cartItems.length > 0 && !document.getElementById('confirm-reservation')) {
        const confirmButton = document.createElement('button');
        confirmButton.id = 'confirm-reservation';
        confirmButton.textContent = 'Confirmar Reserva';
        confirmButton.onclick = confirmReservation;
        cartList.appendChild(confirmButton);
    }
}

/*function confirmReservation() {
    if (cartItems.length === 0) {
        alert('No tienes reservas en el carrito.');
        return;
    }
    // Aquí puedes añadir lógica para confirmar la reserva, por ejemplo, enviarla a un servidor
    alert('Reserva confirmada:\n' + cartItems.join('\n'));
    // Vaciar el carrito después de confirmar la reserva
    cartItems.length = 0;
    updateCart();
}*/
function confirmReservation() {
    if (cartItems.length === 0) {
        alert('No tienes reservas en el carrito.');
        return;
    }

    const usuarioID = getCurrentUserId(); // Asegúrate de obtener el ID del usuario del sistema de autenticación
    const fechaHora = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato para DATETIME en MySQL

    cartItems.forEach(item => {
        const entrenadorID = getEntrenadorIdFromSessionDetail(item); // Implementa esta función para obtener el ID del entrenador

        fetch('/confirm_reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioID, entrenadorID, fechaHora })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Reserva guardada:', data.message);
            } else {
                console.error('Error al guardar reserva:', data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error); // Manejo de errores
        });
    });

    alert('Reserva confirmada:\n' + cartItems.join('\n'));
    // Vaciar el carrito después de confirmar la reserva
    cartItems.length = 0;
    updateCart();
}

// Obtener el ID del usuario actual (implementar según tu lógica de autenticación)
function getCurrentUserId() {
    // Supongamos que lo guardas en el almacenamiento local al iniciar sesión
    return localStorage.getItem('currentUserID');
}

// Obtener el ID del entrenador desde el detalle de la sesión (implementa tu lógica)
function getEntrenadorIdFromSessionDetail(sessionDetail) {
    // Implementa la lógica para extraer el ID del entrenador desde el detalle de la sesión
    // Aquí un ejemplo de cómo podrías hacerlo:
    switch (sessionDetail.split(' - ')[1]) {
        case 'Aerobica Vero':
            return 1; // ID del entrenador Vero
        case 'Aerobox Brenda':
            return 2; // ID del entrenador Brenda
        case 'Funcional Masculino Joaquin':
            return 3; // ID del entrenador Joaquin
        case 'Boxeo Recreativo Victor':
            return 4; // ID del entrenador Victor
        default:
            return null; // En caso de error
    }
}


