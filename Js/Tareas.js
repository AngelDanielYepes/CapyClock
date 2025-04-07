// ==============================================
// CONSTANTES Y VARIABLES GLOBALES
// ==============================================
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const contenedorIngresoDatosTarjetas = document.getElementById("contenedor-ingreso-datos-tarjetas");
const contenedorSeccionCrearTarjetas = document.getElementById("contenedor-seccion-crear-tarjetas");
const contenedorCalendarioMes = document.getElementById("calendario-container");
const contenedorCalendarioSemana = document.getElementById("calendario-week-container");

const botonCrearTarjeta = document.getElementById("boton-crear-tarjeta");
const botonAgregarTarjeta = document.getElementById("boton-agregar-tarjeta");

const filaPanelTareas = document.getElementById("fila_panel_de_tareas");
const filaMes = document.getElementById("fila_mes");
const filaSemana = document.getElementById("fila_semana");

const inputTitulo = document.getElementById("input-titulo");
const inputDescripcion = document.getElementById("input-descripcion");
const inputFechaInicio = document.getElementById("input-fecha-inicio");
const inputFechaFin = document.getElementById("input-fecha-fin");
const inputHoraInicio = document.getElementById("input-hora-inicio");
const inputHoraFin = document.getElementById("input-hora-fin");

// Variables para almacenar datos
let cadenaTarjetas = [];
let idActual = 1;

// Variables para las instancias de calendario
let calendarioMes;
let calendarioSemana;

// ==============================================
// CLASES
// ==============================================

/**
 * Clase que representa una tarjeta de tarea
 */
class Tarjeta {
    constructor(id, titulo, descripcion, horaInicio, horaFin, fechaInicio, fechaFin, importancia = "media", completada = false) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.importancia = importancia; // "alta", "media", "baja"
        this.completada = completada;
    }

    /**
     * Calcula los días restantes hasta la fecha límite
     * @returns {number} Días restantes
     */
    getDiasRestantes() {
        const hoy = new Date();
        const fechaFin = new Date(this.fechaFin);
        const diferencia = fechaFin - hoy;
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }
}

/**
 * Clase para gestionar las tareas
 */
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentId = 1;
        this.listeners = [];
    }
    
    /**
     * Añade una nueva tarea
     * @param {Object} task - Datos de la tarea
     * @returns {Object} Tarea creada
     */
    addTask(task) {
        const newTask = {...task, id: this.currentId++};
        this.tasks.push(newTask);
        this.notifyListeners();
        return newTask;
    }
    
    /**
     * Añade un listener para cambios en las tareas
     * @param {Function} callback - Función a llamar cuando cambien las tareas
     */
    addChangeListener(callback) {
        this.listeners.push(callback);
    }
    
    /**
     * Notifica a todos los listeners de cambios en las tareas
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.tasks));
    }
}

// ==============================================
// FUNCIONES DE INICIALIZACIÓN
// ==============================================

/**
 * Inicializa la aplicación
 */
function iniciarJuego() {
    // Configuración inicial de la interfaz
    configurarInterfazInicial();
    
    // Configurar eventos
    configurarEventos();
    
    // Inicializar calendarios
    inicializarCalendarios();
    
    // Cargar tareas guardadas
    cargarTarjetasGuardadas();
}

/**
 * Configura la interfaz inicial
 */
function configurarInterfazInicial() {
    contenedorIngresoDatosTarjetas.style.display = "none";
    
    // Inicialmente solo mostramos el calendario mensual
    contenedorSeccionCrearTarjetas.style.display = "none";
    contenedorCalendarioMes.style.display = "block";
    contenedorCalendarioSemana.style.display = "none";
    
    // Agregar los controles de ordenación y filtrado
    agregarControlesDeTareas();
}

/**
 * Configura los eventos de la aplicación
 */
function configurarEventos() {
    botonCrearTarjeta.addEventListener("click", crearTarjeta);
    botonAgregarTarjeta.addEventListener("click", agregarTarjeta);
    
    // Eventos para cambiar entre vistas
    filaMes.addEventListener("click", () => {
        mostrarVista("mes");
    });
    
    filaSemana.addEventListener("click", () => {
        mostrarVista("semana");
    });
    
    filaPanelTareas.addEventListener("click", () => {
        mostrarVista("tareas");
    });
}

/**
 * Muestra la vista seleccionada
 * @param {string} vista - Vista a mostrar ("mes", "semana" o "tareas")
 */
function mostrarVista(vista) {
    // Ocultar todas las vistas
    contenedorCalendarioMes.style.display = "none";
    contenedorCalendarioSemana.style.display = "none";
    contenedorSeccionCrearTarjetas.style.display = "none";
    
    // Mostrar la vista seleccionada
    switch(vista) {
        case "mes":
            contenedorCalendarioMes.style.display = "block";
            break;
        case "semana":
            contenedorCalendarioSemana.style.display = "block";
            break;
        case "tareas":
            contenedorSeccionCrearTarjetas.style.display = "block";
            break;
    }
}

/**
 * Inicializa los calendarios
 */
function inicializarCalendarios() {
    calendarioMes = new Calendario('calendario-container');
    calendarioSemana = new CalendarioSemanal('calendario-week-container');
}

// ==============================================
// FUNCIONES DE GESTIÓN DE TAREAS
// ==============================================

/**
 * Crea una nueva tarjeta
 */
function crearTarjeta() {
    // Verificar si ya existe el selector de importancia
    if (!document.getElementById("input-importancia")) {
        // Crear el campo de importancia
        const importanciaDiv = document.createElement("div");
        importanciaDiv.style.marginBottom = "10px";
        
        const importanciaLabel = document.createElement("label");
        importanciaLabel.textContent = "Importancia: ";
        importanciaLabel.setAttribute("for", "input-importancia");
        
        const importanciaSelect = document.createElement("select");
        importanciaSelect.id = "input-importancia";
        importanciaSelect.classList.add("search-bar");
        importanciaSelect.innerHTML = `
            <option value="alta">Alta</option>
            <option value="media" selected>Media</option>
            <option value="baja">Baja</option>
        `;
        
        importanciaDiv.appendChild(importanciaLabel);
        importanciaDiv.appendChild(importanciaSelect);
        
        // Insertar antes del botón de agregar
        contenedorIngresoDatosTarjetas.insertBefore(importanciaDiv, botonAgregarTarjeta);
    }
    
    botonCrearTarjeta.style.display = "none";
    contenedorIngresoDatosTarjetas.style.display = "flex";
}

/**
 * Agrega una nueva tarjeta
 */
function agregarTarjeta() {
    // Obtener valores de los campos
    let titulo = inputTitulo.value.trim();
    let descripcion = inputDescripcion.value.trim();
    let fechaInicio = inputFechaInicio.value.trim();
    let fechaFin = inputFechaFin.value.trim();
    let horaInicio = inputHoraInicio.value.trim();
    let horaFin = inputHoraFin.value.trim();
    let importancia = document.getElementById("input-importancia")?.value || "media";

    // Verificar si todos los campos están llenos
    if (!titulo || !descripcion || !fechaInicio || !fechaFin || !horaInicio || !horaFin) {
        alert("Por favor, completa todos los campos antes de agregar la tarjeta.");
        return;
    }

    // Crear la tarjeta y agregarla al array
    let tarjeta = new Tarjeta(idActual, titulo, descripcion, horaInicio, horaFin, fechaInicio, fechaFin, importancia, false);
    cadenaTarjetas.push(tarjeta);
    idActual++;

    // Actualizar la interfaz
    actualizarInterfazDespuesDeAgregar();
}

/**
 * Actualiza la interfaz después de agregar una tarjeta
 */
function actualizarInterfazDespuesDeAgregar() {
    // Renderizar todas las tarjetas
    renderizarTarjetas();
    
    // Guardar tareas en localStorage
    guardarTarjetas();
    
    // Limpiar los campos
    limpiarCamposFormulario();

    // Ocultar el formulario y volver a mostrar el botón de creación
    contenedorIngresoDatosTarjetas.style.display = "none";
    botonCrearTarjeta.style.display = "block";
    
    // Actualizar los calendarios para mostrar la nueva tarea
    actualizarCalendarios();
}

/**
 * Limpia los campos del formulario
 */
function limpiarCamposFormulario() {
    inputTitulo.value = "";
    inputDescripcion.value = "";
    inputFechaInicio.value = "";
    inputFechaFin.value = "";
    inputHoraInicio.value = "";
    inputHoraFin.value = "";
    if (document.getElementById("input-importancia")) {
        document.getElementById("input-importancia").value = "media";
    }
}

/**
 * Actualiza los calendarios
 */
function actualizarCalendarios() {
    if (calendarioMes) {
        calendarioMes.render();
    }
    
    if (calendarioSemana) {
        calendarioSemana.render();
    }
}

/**
 * Marca una tarea como completada o pendiente
 * @param {number} id - ID de la tarjeta
 */
function marcarComoCompletada(id) {
    const tarjeta = cadenaTarjetas.find(t => t.id === id);
    if (tarjeta) {
        tarjeta.completada = !tarjeta.completada;
        renderizarTarjetas();
        guardarTarjetas();
        actualizarCalendarios();
    }
}

/**
 * Elimina una tarjeta
 * @param {number} id - ID de la tarjeta
 */
function eliminarTarjeta(id) {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
        cadenaTarjetas = cadenaTarjetas.filter(t => t.id !== id);
        renderizarTarjetas();
        guardarTarjetas();
        actualizarCalendarios();
    }
}

// ==============================================
// FUNCIONES DE RENDERIZADO
// ==============================================

/**
 * Renderiza todas las tarjetas
 * @param {string} criterioOrden - Criterio de ordenación
 */
function renderizarTarjetas(criterioOrden) {
    // Si no se proporciona un criterio, usar el del select (si existe)
    if (!criterioOrden && document.getElementById("select-orden")) {
        criterioOrden = document.getElementById("select-orden").value;
    } else if (!criterioOrden) {
        criterioOrden = "fecha"; // Valor por defecto
    }
    
    // Vaciar el contenedor de tarjetas
    contenedorTarjetas.innerHTML = "";
    
    // Ordenar y filtrar las tarjetas
    let tarjetasOrdenadas = ordenarTarjetas(criterioOrden);
    tarjetasOrdenadas = filtrarTarjetasPorEstado(tarjetasOrdenadas);
    
    // Renderizar cada tarjeta
    tarjetasOrdenadas.forEach(tarjeta => {
        const tarjetaElement = crearElementoTarjeta(tarjeta);
        contenedorTarjetas.appendChild(tarjetaElement);
    });
}

/**
 * Ordena las tarjetas según el criterio
 * @param {string} criterioOrden - Criterio de ordenación
 * @returns {Array} Tarjetas ordenadas
 */
function ordenarTarjetas(criterioOrden) {
    let tarjetasOrdenadas = [...cadenaTarjetas];
    
    switch (criterioOrden) {
        case "importancia":
            // Orden: Alta, Media, Baja
            const prioridad = {"alta": 0, "media": 1, "baja": 2};
            tarjetasOrdenadas.sort((a, b) => prioridad[a.importancia] - prioridad[b.importancia]);
            break;
        case "proximidad":
            // Ordena por días restantes (de menor a mayor)
            tarjetasOrdenadas.sort((a, b) => a.getDiasRestantes() - b.getDiasRestantes());
            break;
        case "fecha":
            // Ordena por fecha de inicio (de más antigua a más reciente)
            tarjetasOrdenadas.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
            break;
        case "estado":
            // Primero las no completadas, luego las completadas
            tarjetasOrdenadas.sort((a, b) => Number(a.completada) - Number(b.completada));
            break;
    }
    
    return tarjetasOrdenadas;
}

/**
 * Filtra las tarjetas por estado
 * @param {Array} tarjetas - Tarjetas a filtrar
 * @returns {Array} Tarjetas filtradas
 */
function filtrarTarjetasPorEstado(tarjetas) {
    if (document.getElementById("filtro-estado")) {
        const filtro = document.getElementById("filtro-estado").value;
        if (filtro === "pendientes") {
            return tarjetas.filter(t => !t.completada);
        } else if (filtro === "completadas") {
            return tarjetas.filter(t => t.completada);
        }
    }
    return tarjetas;
}

/**
 * Crea un elemento de tarjeta
 * @param {Tarjeta} tarjeta - Datos de la tarjeta
 * @returns {HTMLElement} Elemento de tarjeta
 */
function crearElementoTarjeta(tarjeta) {
    const diasRestantes = tarjeta.getDiasRestantes();
    const tarjetaElement = document.createElement("div");
    tarjetaElement.id = `tarjeta-${tarjeta.id}`;
    tarjetaElement.className = "tarjetas";
    
    // Aplicar estilos según importancia y estado
    aplicarEstilosTarjeta(tarjetaElement, tarjeta, diasRestantes);
    
    // Crear contenido de la tarjeta
    const headerDiv = crearHeaderTarjeta(tarjeta);
    const descripcion = crearDescripcionTarjeta(tarjeta);
    const datosDiv = crearDatosTarjeta(tarjeta, diasRestantes);
    
    // Añadir todos los elementos a la tarjeta
    tarjetaElement.appendChild(headerDiv);
    tarjetaElement.appendChild(descripcion);
    tarjetaElement.appendChild(datosDiv);
    
    return tarjetaElement;
}

/**
 * Aplica estilos a la tarjeta según su importancia y estado
 * @param {HTMLElement} elemento - Elemento de tarjeta
 * @param {Tarjeta} tarjeta - Datos de la tarjeta
 * @param {number} diasRestantes - Días restantes
 */
function aplicarEstilosTarjeta(elemento, tarjeta, diasRestantes) {
    // Estilos base
    elemento.style.marginBottom = "5px";
    elemento.style.padding = "15px";
    elemento.style.borderRadius = "5px";
    elemento.style.position = "relative";
    
    // Estilo según importancia
    if (tarjeta.importancia === "alta") {
        elemento.style.borderLeft = "4px solid #ff4d4d";
    } else if (tarjeta.importancia === "media") {
        elemento.style.borderLeft = "4px solid #ffcc00";
    } else {
        elemento.style.borderLeft = "4px solid #33cc33";
    }
    
    // Estilo según cercanía de fecha límite
    if (diasRestantes < 0) {
        elemento.style.backgroundColor = "rgba(200, 200, 200, 0.2)";
    } else if (diasRestantes <= 2) {
        elemento.style.backgroundColor = "rgba(255, 77, 77, 0.1)";
    } else if (diasRestantes <= 7) {
        elemento.style.backgroundColor = "rgba(255, 204, 0, 0.1)";
    }
    
    // Estilo si está completada
    if (tarjeta.completada) {
        elemento.style.opacity = "0.7";
        elemento.style.backgroundColor = "rgba(200, 200, 200, 0.2)";
    }
}

/**
 * Crea el encabezado de la tarjeta
 * @param {Tarjeta} tarjeta - Datos de la tarjeta
 * @returns {HTMLElement} Encabezado de la tarjeta
 */
function crearHeaderTarjeta(tarjeta) {
    const headerDiv = document.createElement("div");
    headerDiv.style.display = "flex";
    headerDiv.style.justifyContent = "space-between";
    headerDiv.style.alignItems = "center";
    headerDiv.style.marginBottom = "5px";
    
    const titulo = document.createElement("h2");
    titulo.textContent = tarjeta.titulo;
    if (tarjeta.completada) {
        titulo.style.textDecoration = "line-through";
    }
    
    const botonesDiv = document.createElement("div");
    botonesDiv.style.display = "flex";
    botonesDiv.style.gap = "5px";
    
    const botonCompletar = document.createElement("button");
    botonCompletar.innerHTML = tarjeta.completada ? "✓" : "O";
    botonCompletar.style.background = "none";
    botonCompletar.style.cursor = "pointer";
    botonCompletar.style.fontSize = "10px";
    botonCompletar.title = tarjeta.completada ? "Marcar como pendiente" : "Marcar como completada";
    botonCompletar.onclick = () => marcarComoCompletada(tarjeta.id);
    
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "🗑️";
    botonEliminar.style.background = "none";
    botonEliminar.style.cursor = "pointer";
    botonEliminar.style.fontSize = "10px";
    botonEliminar.title = "Eliminar tarea";
    botonEliminar.onclick = () => eliminarTarjeta(tarjeta.id);
    
    botonesDiv.appendChild(botonCompletar);
    botonesDiv.appendChild(botonEliminar);
    
    headerDiv.appendChild(titulo);
    headerDiv.appendChild(botonesDiv);
    
    return headerDiv;
}

/**
 * Crea la descripción de la tarjeta
 * @param {Tarjeta} tarjeta - Datos de la tarjeta
 * @returns {HTMLElement} Descripción de la tarjeta
 */
function crearDescripcionTarjeta(tarjeta) {
    const descripcion = document.createElement("p");
    descripcion.textContent = tarjeta.descripcion;
    if (tarjeta.completada) {
        descripcion.style.textDecoration = "line-through";
    }
    return descripcion;
}

/**
 * Crea los datos de la tarjeta
 * @param {Tarjeta} tarjeta - Datos de la tarjeta
 * @param {number} diasRestantes - Días restantes
 * @returns {HTMLElement} Datos de la tarjeta
 */
function crearDatosTarjeta(tarjeta, diasRestantes) {
    const datosDiv = document.createElement("div");
    datosDiv.style.marginTop = "10px";
    
    // Crear tabla de horario
    const tablaHorario = document.createElement("div");
    tablaHorario.className = "tabla";
    tablaHorario.innerHTML = `
        <p>${tarjeta.horaInicio}</p>
        <p> - </p>
        <p>${tarjeta.horaFin}</p>
    `;
    
    // Crear tabla de fechas
    const tablaFechas = document.createElement("div");
    tablaFechas.className = "tabla";
    tablaFechas.innerHTML = `
        <p>${tarjeta.fechaInicio}</p>
        <p> - </p>
        <p>${tarjeta.fechaFin}</p>
    `;
    
    // Crear etiquetas
    const etiquetasDiv = document.createElement("div");
    etiquetasDiv.style.display = "flex";
    etiquetasDiv.style.gap = "5px";
    etiquetasDiv.style.marginTop = "10px";
    
    // Etiqueta de importancia
    const etiquetaImportancia = document.createElement("span");
    etiquetaImportancia.textContent = tarjeta.importancia;
    etiquetaImportancia.style.padding = "2px 6px";
    etiquetaImportancia.style.backgroundColor = "#555";
    etiquetaImportancia.style.color = "white";
    etiquetaImportancia.style.borderRadius = "12px";
    etiquetaImportancia.style.fontSize = "0.8em";
    
    // Etiqueta de días restantes
    const etiquetaDias = document.createElement("span");
    etiquetaDias.textContent = diasRestantes < 0 ? 'Vencida' : `${diasRestantes} días`;
    etiquetaDias.style.padding = "2px 6px";
    etiquetaDias.style.backgroundColor = "#2c7be5";
    etiquetaDias.style.color = "white";
    etiquetaDias.style.borderRadius = "12px";
    etiquetaDias.style.fontSize = "0.8em";
    
    etiquetasDiv.appendChild(etiquetaImportancia);
    etiquetasDiv.appendChild(etiquetaDias);
    
    datosDiv.appendChild(tablaHorario);
    datosDiv.appendChild(tablaFechas);
    datosDiv.appendChild(etiquetasDiv);
    
    return datosDiv;
}

/**
 * Filtra las tareas por estado
 */
function filtrarTareas() {
    renderizarTarjetas();
}

// ==============================================
// FUNCIONES DE PERSISTENCIA
// ==============================================

/**
 * Guarda las tarjetas en localStorage
 */
function guardarTarjetas() {
    localStorage.setItem('tarjetas', JSON.stringify(cadenaTarjetas));
    localStorage.setItem('idActual', idActual.toString());
}

/**
 * Carga las tarjetas guardadas
 */
function cargarTarjetasGuardadas() {
    const tarjetasGuardadas = localStorage.getItem('tarjetas');
    const idGuardado = localStorage.getItem('idActual');
    
    if (tarjetasGuardadas) {
        // Convertir las tarjetas guardadas en objetos Tarjeta
        const tarjetasObj = JSON.parse(tarjetasGuardadas);
        cadenaTarjetas = tarjetasObj.map(t => {
            return new Tarjeta(
                t.id, 
                t.titulo, 
                t.descripcion, 
                t.horaInicio, 
                t.horaFin, 
                t.fechaInicio, 
                t.fechaFin, 
                t.importancia || "media", 
                t.completada || false
            );
        });
        
        // Restaurar el ID actual
        if (idGuardado) {
            idActual = parseInt(idGuardado);
        }
        
        // Renderizar las tarjetas cargadas
        renderizarTarjetas();
    }
}

// ==============================================
// FUNCIONES DE CONTROLES
// ==============================================

/**
 * Agrega los controles de ordenación y filtrado
 */
function agregarControlesDeTareas() {
    const controlesDiv = document.createElement("div");
    controlesDiv.id = "controles-tareas";
    controlesDiv.style.margin = "10px 0";
    controlesDiv.style.display = "flex";
    controlesDiv.style.justifyContent = "space-between";

    // Control de ordenación
    const ordenDiv = document.getElementById("controles-tareas");
    const ordenLabel = document.getElementById("labels");
    
    const ordenSelect = document.getElementById("select-orden");
    ordenSelect.addEventListener("change", () => {
        renderizarTarjetas(ordenSelect.value);
    });
    
    // Control de filtrado
    const filtroDiv = document.createElement("div");
    const filtroLabel = document.createElement("label");
    filtroLabel.textContent = "Mostrar: ";
    filtroLabel.setAttribute("for", "filtro-estado");
    
    const filtroSelect = document.createElement("select");
    filtroSelect.id = "filtro-estado";
    filtroSelect.style.padding = "5px";
    filtroSelect.innerHTML = `
        <option value="todas">Todas</option>
        <option value="pendientes">Pendientes</option>
        <option value="completadas">Completadas</option>
    `;
    filtroSelect.addEventListener("change", filtrarTareas);
    
    filtroDiv.appendChild(filtroLabel);
    filtroDiv.appendChild(filtroSelect);
    
    // Añadir al div de controles
    controlesDiv.appendChild(ordenDiv);
    controlesDiv.appendChild(filtroDiv);
    
    // Insertar antes del contenedor de tarjetas
    contenedorTarjetas.parentNode.insertBefore(controlesDiv, contenedorTarjetas);
}

// ==============================================
// INICIALIZACIÓN
// ==============================================
window.addEventListener("load", iniciarJuego);