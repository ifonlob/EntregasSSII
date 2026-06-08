"use strict";

const cerrarSesion = () => {
    localStorage.removeItem("usuarioSesion");
    localStorage.removeItem("nombreUsuario");
    window.location.href = "index.html";
};

const mostrarMensajeUsuario = () => {
    const apartado = document.getElementById("apartadoUsuario");
    const usuarioActivo = localStorage.getItem("usuarioSesion");
    const nombre = localStorage.getItem("nombreUsuario");

    if (apartado && usuarioActivo) {
        apartado.style.display = "block";
        apartado.innerHTML = `
            <article class="introduccion">
                <h2 class="introduccion__titulo">¡Hola de nuevo, Chef ${nombre || 'Gourmet'}!</h2>
                <p class="introduccion__descripcion">Nos alegra tenerte de vuelta en la cocina de Bocado Mágico. Mantente atento, porque próximamente llegarán recetas nuevas y exclusivas a nuestra colección para que sigas deleitando paladares.</p>
            </article>
        `;
    }
};

const gestionarNavegacion = () => {
    const contenedorNav = document.querySelector(".cabecera__navegacion");
    const sesionActiva = localStorage.getItem("usuarioSesion");
    const esPaginaAuth = document.getElementById('formularioLogin') || document.getElementById('formularioRegistro');

    if (contenedorNav && sesionActiva && !esPaginaAuth) {
        contenedorNav.innerHTML = `
            <ul class="navegacion__lista">
                <li class="navegacion__identificacion">
                    <img class="navegacion__usuario" src="./assets/imgs/usuario.png" alt="Usuario">
                    <a href="#" class="navegacion__enlace" id="btnCerrarSesion">Cerrar Sesión</a>
                </li>
            </ul>
        `;

        const btnCerrar = document.getElementById("btnCerrarSesion");
        if (btnCerrar) {
            btnCerrar.addEventListener("click", (evento) => {
                evento.preventDefault();
                cerrarSesion();
            });
        }
    }
};

const servicioLogin = async (correo, contrasena) => {
    try {
        const respuesta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem("usuarioSesion", data.correo);
            localStorage.setItem("nombreUsuario", data.nombre);
            window.location.href = "bienvenida-login.html";
        } else {
            alert(data.error || "Usuario o contraseña incorrectos");
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
};

const servicioRegistro = async (correo, contrasena, nombre) => {
    try {
        const respuesta = await fetch('/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, contrasena })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem("usuarioSesion", data.correo);
            localStorage.setItem("nombreUsuario", data.nombre);
            window.location.href = "bienvenida-registro.html";
        } else {
            alert(data.error || "Error al registrar");
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
};

const manejarRedireccionBienvenida = () => {
    const paginaActual = document.body.dataset.pagina;
    if (paginaActual === "bienvenida-registro" || paginaActual === "bienvenida-login") {
        setTimeout(() => {
            window.location.href = "index.html";
        }, 5000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    gestionarNavegacion();
    mostrarMensajeUsuario();
    manejarRedireccionBienvenida();

    const formularioAcceso = document.getElementById('formularioLogin');
    const formularioCrear = document.getElementById('formularioRegistro');

    if (formularioAcceso) {
        formularioAcceso.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const correo = document.getElementById('usuario').value.trim();
            const contrasena = document.getElementById('password').value.trim();
            servicioLogin(correo, contrasena);
        });
    }

    if (formularioCrear) {
        formularioCrear.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nombre = document.getElementById('registroUsuario').value.trim();
            const correo = document.getElementById('registroEmail').value.trim();
            const contrasena = document.getElementById('registroPassword').value.trim();
            servicioRegistro(correo, contrasena, nombre);
        });
    }
});