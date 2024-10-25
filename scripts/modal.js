// Obtener el modal
let reservaModal = document.getElementById("reservaModal");

// Obtener el enlace de login en el nav
let loginLink = document.getElementById("login-link");

// Obtener el enlace de "Regístrate aquí" y los formularios
let registerLink = document.getElementById("register-link");
let loginForm = document.getElementById("login-form");
let registerForm = document.getElementById("register-form");

// Obtener el elemento <span> que cierra el modal
let span = document.getElementsByClassName("close")[0];

// Cuando el usuario haga clic en el enlace de login, abrir el modal
loginLink.onclick = function() {
    console.log("Enlace de login clicado"); // Añadido para depuración
    reservaModal.style.display = "block";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
}

// Cuando el usuario haga clic en <span> (x), cerrar el modal
span.onclick = function() {
    console.log("Cerrar modal clicado"); // Añadido para depuración
    reservaModal.style.display = "none";
}

// Cuando el usuario haga clic en cualquier lugar fuera del modal, cerrar el modal
window.onclick = function(event) {
    if (event.target == reservaModal) {
        console.log("Clic fuera del modal"); // Añadido para depuración
        reservaModal.style.display = "none";
    }
}

// Cuando el usuario haga clic en el enlace "Regístrate aquí", mostrar el formulario de registro
register