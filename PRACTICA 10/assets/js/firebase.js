"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const configuracionFirebase = {
    apiKey: "AIzaSyBcuDoChegnRreOvK6uBxLayV8dlBLtwsE",
    authDomain: "bocadomagico-30a9f.firebaseapp.com",
    projectId: "bocadomagico-30a9f",
    storageBucket: "bocadomagico-30a9f.firebasestorage.app",
    messagingSenderId: "346071697903",
    appId: "1:346071697903:web:f7473f1cefecdacefc4e1a",
    measurementId: "G-7GFCRJLV54"
};

const aplicacion = initializeApp(configuracionFirebase);
const autenticacion = getAuth(aplicacion);

const cerrarSesion = async () => {
    try {
        await signOut(autenticacion);
        localStorage.removeItem("usuarioSesion");
        localStorage.removeItem("nombreUsuario");
        window.location.href = "index.html";
    } catch (errorObtenido) {
        console.error(errorObtenido);
    }
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

const servicioLogin = async (formulario, correo, contrasena) => {
    try {
        const credencial = await signInWithEmailAndPassword(autenticacion, correo, contrasena);
        localStorage.setItem("usuarioSesion", credencial.user.email);
        window.location.href = "bienvenida-login.html";
    } catch (errorObtenido) {
        alert("Usuario o contraseña incorrectos");
    }
};

const servicioRegistro = async (formulario, correo, contrasena, nombre) => {
    try {
        const credencial = await createUserWithEmailAndPassword(autenticacion, correo, contrasena);
        localStorage.setItem("usuarioSesion", credencial.user.email);
        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "bienvenida-registro.html";
    } catch (errorObtenido) {
        alert("Error: El correo ya existe o los datos son inválidos");
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
            servicioLogin(formularioAcceso, correo, contrasena);
        });
    }

    if (formularioCrear) {
        formularioCrear.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nombre = document.getElementById('registroUsuario').value.trim();
            const correo = document.getElementById('registroEmail').value.trim();
            const contrasena = document.getElementById('registroPassword').value.trim();
            servicioRegistro(formularioCrear, correo, contrasena, nombre);
        });
    }
});