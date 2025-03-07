const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const contenedorIngresoDatosTarjetas = document.getElementById("contenedor-ingreso-datos-tarjetas");
const contenedorSeccionCrearTarjetas = document.getElementById("contenedor-seccion-crear-tarjetas");
const contenedorCalendarioMes = document.getElementById("calendario-container");
const contenedorCalendarioSemana = document.getElementById("calendario-week-container");

const botonCrearTarjeta = document.getElementById("boton-crear-tarjeta");
const botonAgregarTarjeta = document.getElementById("boton-agregar-tarjeta");

const filaPanelTareas= document.getElementById("fila_panel_de_tareas");
const filaMes= document.getElementById("fila_mes");
const filaSemana= document.getElementById("fila_semana");


const inputTitulo = document.getElementById("input-titulo");
const inputDescripcion = document.getElementById("input-descripcion");
const inputFechaInicio = document.getElementById("input-fecha-inicio");
const inputFechaFin = document.getElementById("input-fecha-fin");
const inputHoraInicio = document.getElementById("input-hora-inicio");
const inputHoraFin = document.getElementById("input-hora-fin");

let cadenaTarjetas = [];
let idActual = 1;

// Variables para las instancias de calendario
let calendarioMes;
let calendarioSemana;

class Tarjeta {
    constructor(id, titulo, descripcion, horaInicio, horaFin, fechaInicio, fechaFin) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
}

function iniciarJuego() {
    contenedorIngresoDatosTarjetas.style.display = "none";
    
    // Inicialmente solo mostramos el calendario mensual
    contenedorSeccionCrearTarjetas.style.display = "none";
    contenedorCalendarioMes.style.display = "block";
    contenedorCalendarioSemana.style.display = "none";
    
    botonCrearTarjeta.addEventListener("click", crearTarjeta);
    botonAgregarTarjeta.addEventListener("click", agregarTarjeta);

    // Inicializar el calendario
    calendarioMes = new Calendario('calendario-container');
    calendarioSemana = new CalendarioSemanal('calendario-week-container');
    
    filaMes.addEventListener("click", () => {
        contenedorCalendarioMes.style.display = "block";
        contenedorSeccionCrearTarjetas.style.display = "none";
        contenedorCalendarioSemana.style.display = "none";
    });
    
    filaSemana.addEventListener("click", () => {
        contenedorCalendarioSemana.style.display = "block";
        contenedorCalendarioMes.style.display = "none";
        contenedorSeccionCrearTarjetas.style.display = "none";
    });
    
    filaPanelTareas.addEventListener("click", () => {
        contenedorCalendarioMes.style.display = "none";
        contenedorCalendarioSemana.style.display = "none";
        contenedorSeccionCrearTarjetas.style.display = "block";
    });
}

function crearTarjeta() {
    botonCrearTarjeta.style.display = "none";
    contenedorIngresoDatosTarjetas.style.display = "flex";
}

function agregarTarjeta() {
    let titulo = inputTitulo.value.trim();
    let descripcion = inputDescripcion.value.trim();
    let fechaInicio = inputFechaInicio.value.trim();
    let fechaFin = inputFechaFin.value.trim();
    let horaInicio = inputHoraInicio.value.trim();
    let horaFin = inputHoraFin.value.trim();

    // Verificar si todos los campos están llenos
    if (!titulo || !descripcion || !fechaInicio || !fechaFin || !horaInicio || !horaFin) {
        alert("Por favor, completa todos los campos antes de agregar la tarjeta.");
        return;
    }

    // Crear la tarjeta y agregarla al array
    let tarjeta = new Tarjeta(idActual, titulo, descripcion, horaInicio, horaFin, fechaInicio, fechaFin);
    cadenaTarjetas.push(tarjeta);
    idActual++;

    // Renderizar la tarjeta
    let codigoTarjeta = `
        <label id="${tarjeta.id}" class="tarjetas">
            <h3>${tarjeta.titulo}</h3>
            <p>${tarjeta.descripcion}</p>
            <div>
                <div class="tabla">
                    <p>${tarjeta.horaInicio}</p>
                    <p> - </p>
                    <p>${tarjeta.horaFin}</p>
                </div>
                <div class="tabla">
                    <p>${tarjeta.fechaInicio}</p>
                    <p> - </p>
                    <p>${tarjeta.fechaFin}</p>
                </div>
            </div>
        </label>
    `;

    contenedorTarjetas.innerHTML += codigoTarjeta;

    // Limpiar los campos
    inputTitulo.value = "";
    inputDescripcion.value = "";
    inputFechaInicio.value = "";
    inputFechaFin.value = "";
    inputHoraInicio.value = "";
    inputHoraFin.value = "";

    // Ocultar el formulario y volver a mostrar el botón de creación
    contenedorIngresoDatosTarjetas.style.display = "none";
    botonCrearTarjeta.style.display = "block";
    
    // Actualizar los calendarios para mostrar la nueva tarea
    if (calendarioMes) {
        calendarioMes.render();
    }
    
    if (calendarioSemana) {
        calendarioSemana.render();
    }
}

window.addEventListener("load", iniciarJuego);