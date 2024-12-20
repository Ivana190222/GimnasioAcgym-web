let isLoggedIn = false; // Track login status

function openModal() {
    document.getElementById('reservaModal').style.display = 'block';
}

document.getElementById('login-link').addEventListener('click', function() {
    openModal();
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form-container').style.display = 'none';
});

function closeModal() {
    document.getElementById('reservaModal').style.display = 'none';
}

function handleRegister(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, contrasena })
    })
    .then(response => { 
        const contentType = response.headers.get('content-type'); 
        if (!contentType || !contentType.includes('application/json')) { 
            return Promise.reject(new Error('Invalid Content-Type. Expected application/json')); 
        } 
        return response.json(); 
    })
    .then(data => {
        if (data.success) {
            isLoggedIn = true;
            document.getElementById('login-link').textContent = `Hola, ${nombre}`;
            document.getElementById('logout-link').style.display = 'block';
            closeModal();
            document.getElementById('success-message').style.display = 'block';
        } else {
            alert(data.message || 'Error al registrar usuario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar la solicitud.');
    });
}

function closeSuccessMessage() {
    document.getElementById('success-message').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';
}

// Función para manejar el inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            isLoggedIn = true;
            localStorage.setItem('currentUserID', data.userID);
            if (data.esAdmin) {
                window.open('http://localhost:3000/admin', '_blank'); // Abrir en una nueva ventana
            } else {
                document.getElementById('login-link').textContent = `Hola, ${data.nombreCompleto}`;
                document.getElementById('logout-link').style.display = 'block';
                document.getElementById('login-form').style.display = 'none';
                closeModal();
            }
        } else {
            alert(data.message || 'Credenciales incorrectas');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar la solicitud.');
    });
}


// Función para manejar el cierre de sesión
function handleLogout() {
    fetch('http://localhost:3000/logout')
    .then(() => {
        isLoggedIn = false;
        localStorage.removeItem('currentUserID'); // Eliminar el ID del usuario del almacenamiento local
        document.getElementById('login-link').textContent = 'Iniciar Sesión';
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-form').style.display = 'block'; // Mostrar el formulario de inicio de sesión
    })
    .catch(error => {
        console.error('Error:', error); // Depuración
        alert('Hubo un error al cerrar sesión.');
    });
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('reservaModal');
    if (modal) {
        modal.style.display = 'none'; // Cierra el modal
    }
}
