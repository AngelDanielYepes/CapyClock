const contenedorRegistro = document.getElementById("registro");
const contenedorLogin = document.getElementById("login");
const botonLogin = document.getElementById("boton-cambiar-login");
const BotonRegistro = document.getElementById("boton-cambiar-registro");

contenedorRegistro.style.display = "none";
contenedorLogin.style.display = "block";

BotonRegistro.addEventListener("click", () => {
    contenedorRegistro.style.display = "block";
    contenedorLogin.style.display = "none";
});
botonLogin.addEventListener("click", () => {
    contenedorRegistro.style.display = "none";
    contenedorLogin.style.display = "block";
});