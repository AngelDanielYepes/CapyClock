// Función para calcular estadísticas basadas en las tareas
function calcularEstadisticas(tareas) {
    // Obtener fecha actual
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo como inicio de semana
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    // Estadísticas semanales
    const tareasCompletadasSemana = tareas.filter(t => 
      t.completada && new Date(t.fechaFin) >= inicioSemana && new Date(t.fechaFin) <= hoy
    ).length;
    
    const tareasPendientesSemana = tareas.filter(t => 
      !t.completada && new Date(t.fechaFin) >= inicioSemana && new Date(t.fechaFin) <= hoy
    ).length;
    
    // Estadísticas mensuales
    const tareasCompletadasMes = tareas.filter(t => 
      t.completada && new Date(t.fechaFin) >= inicioMes && new Date(t.fechaFin) <= hoy
    ).length;
    
    const tareasPendientesMes = tareas.filter(t => 
      !t.completada && new Date(t.fechaFin) >= inicioMes && new Date(t.fechaFin) <= hoy
    ).length;
    
    const tareasVencidasMes = tareas.filter(t => 
      !t.completada && new Date(t.fechaFin) < hoy
    ).length;
    
    // Datos de eficiencia por día de la semana
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const eficienciaSemanal = diasSemana.map(dia => {
      const indice = diasSemana.indexOf(dia);
      const tareasDelDia = tareas.filter(t => new Date(t.fechaFin).getDay() === indice);
      const completadas = tareasDelDia.filter(t => t.completada).length;
      const total = tareasDelDia.length;
      
      return {
        dia: dia.substring(0, 3), // Abreviamos a 3 letras
        eficiencia: total > 0 ? Math.round((completadas / total) * 100) : 0,
        total: total
      };
    });
    
    // Datos por importancia
    const tareasAlta = tareas.filter(t => t.importancia === "alta").length;
    const tareasMedia = tareas.filter(t => t.importancia === "media").length;
    const tareasBaja = tareas.filter(t => t.importancia === "baja").length;
    
    // Rendimiento semanal
    const semanaActual = new Date();
    const datosSemanales = [];
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(semanaActual);
      fecha.setDate(semanaActual.getDate() - i);
      
      const tareasDelDia = tareas.filter(t => {
        const fechaTarea = new Date(t.fechaFin);
        return fechaTarea.getDate() === fecha.getDate() && 
               fechaTarea.getMonth() === fecha.getMonth() && 
               fechaTarea.getFullYear() === fecha.getFullYear();
      });
      
      const completadas = tareasDelDia.filter(t => t.completada).length;
      
      datosSemanales.push({
        dia: diasSemana[fecha.getDay()].substring(0, 3),
        completadas: completadas,
        pendientes: tareasDelDia.length - completadas
      });
    }
    
    return {
      semanales: {
        completadas: tareasCompletadasSemana,
        pendientes: tareasPendientesSemana,
        total: tareasCompletadasSemana + tareasPendientesSemana,
        eficiencia: eficienciaSemanal,
        rendimiento: datosSemanales
      },
      mensuales: {
        completadas: tareasCompletadasMes,
        pendientes: tareasPendientesMes,
        vencidas: tareasVencidasMes,
        total: tareasCompletadasMes + tareasPendientesMes + tareasVencidasMes,
        distribucion: [
          { nombre: "Alta", valor: tareasAlta },
          { nombre: "Media", valor: tareasMedia },
          { nombre: "Baja", valor: tareasBaja }
        ]
      }
    };
  }
  
  // Función para generar datos de ejemplo
  function generarDatosEjemplo() {
    // Crear algunas tareas de ejemplo para la demostración
    const hoy = new Date();
    const fechas = [];
    
    for (let i = 0; i < 14; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      fechas.push(fecha.toISOString().split('T')[0]);
    }
    
    const importancias = ["alta", "media", "baja"];
    const tareas = [];
    
    for (let i = 0; i < 20; i++) {
      const fechaIndex = Math.floor(Math.random() * fechas.length);
      tareas.push({
        id: i + 1,
        titulo: `Tarea de ejemplo ${i + 1}`,
        descripcion: `Descripción de la tarea ${i + 1}`,
        horaInicio: "09:00",
        horaFin: "11:00",
        fechaInicio: fechas[fechaIndex],
        fechaFin: fechas[Math.min(fechaIndex + 1, fechas.length - 1)],
        importancia: importancias[Math.floor(Math.random() * importancias.length)],
        completada: Math.random() > 0.5
      });
    }
    
    return tareas;
  }
  
  // Función para mostrar la sección de estadísticas
  function mostrarSeccionEstadisticas() {
    // Ocultar las demás secciones
    document.getElementById('calendario-container').style.display = 'none';
    document.getElementById('calendario-week-container').style.display = 'none';
    document.getElementById('contenedor-seccion-crear-tarjetas').style.display = 'none';
    
    // Mostrar la sección de estadísticas
    const contenedorEstadisticas = document.getElementById('contenedor-estadisticas');
    contenedorEstadisticas.style.display = 'block';
    
    // Cargar y mostrar las estadísticas
    cargarYMostrarEstadisticas();
  }
  
  // Cargar datos y mostrar estadísticas
  function cargarYMostrarEstadisticas() {
    // Cargar tareas desde localStorage
    let tareas = [];
    try {
      const tarjetasGuardadas = localStorage.getItem('tarjetas');
      if (tarjetasGuardadas) {
        tareas = JSON.parse(tarjetasGuardadas);
      } else {
        // Usar datos de ejemplo si no hay tareas guardadas
        tareas = generarDatosEjemplo();
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      tareas = generarDatosEjemplo();
    }
  
    // Calcular estadísticas
    const estadisticas = calcularEstadisticas(tareas);
    
    // Mostrar estadísticas en la UI
    mostrarEstadisticas(estadisticas);
  }
  
  // Función para mostrar las estadísticas en la interfaz
  function mostrarEstadisticas(estadisticas) {
    const contenedor = document.getElementById('contenedor-estadisticas');
    
    // Limpiar el contenedor
    contenedor.innerHTML = '';
    
    // Crear el contenedor principal
    const dashboardEl = document.createElement('div');
    dashboardEl.className = 'estadisticas-dashboard';
    
    // Título principal
    const titulo = document.createElement('h2');
    titulo.textContent = 'Dashboard de Estadísticas';
    titulo.className = 'titulo-dashboard';
    dashboardEl.appendChild(titulo);
    
    // Contenedor para los paneles
    const paneles = document.createElement('div');
    paneles.className = 'paneles-estadisticas';
    
    // Panel 1: Rendimiento Semanal
    const panel1 = crearPanelGrafico(
      'Rendimiento Semanal',
      'rendimiento-semanal',
      `
        <div class="resumen-estadisticas">
          <div><span class="dot completadas"></span> Completadas: ${estadisticas.semanales.completadas}</div>
          <div><span class="dot pendientes"></span> Pendientes: ${estadisticas.semanales.pendientes}</div>
          <div>Total: ${estadisticas.semanales.total}</div>
        </div>
      `
    );
    paneles.appendChild(panel1);
    
    // Panel 2: Eficiencia por Día
    const panel2 = crearPanelGrafico(
      'Eficiencia por Día',
      'eficiencia-dia',
      `
        <div class="resumen-estadisticas">
          Eficiencia media: ${Math.round(estadisticas.semanales.eficiencia.reduce((acc, el) => acc + el.eficiencia, 0) / 7)}%
        </div>
      `
    );
    paneles.appendChild(panel2);
    
    // Panel 3: Estado de Tareas (Mensual)
    const panel3 = crearPanelGrafico(
      'Estado de Tareas (Mensual)',
      'estado-tareas',
      `
        <div class="resumen-estadisticas">
          <div><span class="dot completadas"></span> Completadas: ${estadisticas.mensuales.completadas}</div>
          <div><span class="dot pendientes"></span> Pendientes: ${estadisticas.mensuales.pendientes}</div>
          <div><span class="dot vencidas"></span> Vencidas: ${estadisticas.mensuales.vencidas}</div>
        </div>
      `
    );
    paneles.appendChild(panel3);
    
    // Panel 4: Distribución por Importancia
    const panel4 = crearPanelGrafico(
      'Distribución por Importancia',
      'distribucion-importancia',
      `
        <div class="resumen-estadisticas">
          <div><span class="dot alta"></span> Alta: ${estadisticas.mensuales.distribucion[0].valor}</div>
          <div><span class="dot media"></span> Media: ${estadisticas.mensuales.distribucion[1].valor}</div>
          <div><span class="dot baja"></span> Baja: ${estadisticas.mensuales.distribucion[2].valor}</div>
        </div>
      `
    );
    paneles.appendChild(panel4);
    
    // Resumen general
    const resumenGeneral = document.createElement('div');
    resumenGeneral.className = 'resumen-general';
    resumenGeneral.innerHTML = `
      <h3>Resumen General</h3>
      <div class="cards-resumen">
        <div class="card-resumen total">
          <div class="numero">${estadisticas.mensuales.total}</div>
          <div class="etiqueta">Total Tareas</div>
        </div>
        <div class="card-resumen completadas">
          <div class="numero">${estadisticas.mensuales.completadas}</div>
          <div class="etiqueta">Completadas</div>
        </div>
        <div class="card-resumen pendientes">
          <div class="numero">${estadisticas.mensuales.pendientes}</div>
          <div class="etiqueta">Pendientes</div>
        </div>
        <div class="card-resumen vencidas">
          <div class="numero">${estadisticas.mensuales.vencidas}</div>
          <div class="etiqueta">Vencidas</div>
        </div>
      </div>
    `;
    
    dashboardEl.appendChild(paneles);
    dashboardEl.appendChild(resumenGeneral);
    contenedor.appendChild(dashboardEl);
    
    // Renderizamos los gráficos después de que los elementos estén en el DOM
    setTimeout(() => {
      renderizarGraficos(estadisticas);
    }, 100);
  }
  
  // Función para crear un panel de gráfico
  function crearPanelGrafico(titulo, id, resumenHTML) {
    const panel = document.createElement('div');
    panel.className = 'panel-estadistica';
    panel.innerHTML = `
      <h3>${titulo}</h3>
      <div class="grafico-container">
        <canvas id="${id}" class="grafico"></canvas>
      </div>
      ${resumenHTML}
    `;
    return panel;
  }
  
  // Función para renderizar los gráficos
  function renderizarGraficos(estadisticas) {
    // Limpiamos los gráficos existentes si los hay
    Chart.helpers.each(Chart.instances, function(instance) {
      instance.destroy();
    });
    
    // Rendimiento Semanal (Gráfico de barras)
    const ctx1 = document.getElementById('rendimiento-semanal');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: estadisticas.semanales.rendimiento.map(item => item.dia),
          datasets: [
            {
              label: 'Completadas',
              data: estadisticas.semanales.rendimiento.map(item => item.completadas),
              backgroundColor: '#10B981', // Verde
            },
            {
              label: 'Pendientes',
              data: estadisticas.semanales.rendimiento.map(item => item.pendientes),
              backgroundColor: '#F59E0B', // Amarillo
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Eficiencia por día (Gráfico de línea)
    const ctx2 = document.getElementById('eficiencia-dia');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: estadisticas.semanales.eficiencia.map(item => item.dia),
          datasets: [
            {
              label: 'Eficiencia',
              data: estadisticas.semanales.eficiencia.map(item => item.eficiencia),
              borderColor: '#4F46E5',
              tension: 0.1,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
    
    // Estado de Tareas Mensual (Gráfico circular/dona)
    const ctx3 = document.getElementById('estado-tareas');
    if (ctx3) {
      new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: ['Completadas', 'Pendientes', 'Vencidas'],
          datasets: [
            {
              data: [
                estadisticas.mensuales.completadas,
                estadisticas.mensuales.pendientes,
                estadisticas.mensuales.vencidas
              ],
              backgroundColor: [
                '#10B981', // Verde para completadas
                '#F59E0B', // Amarillo para pendientes
                '#EF4444'  // Rojo para vencidas
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Distribución por Importancia (Gráfico de barras horizontales)
    const ctx4 = document.getElementById('distribucion-importancia');
    if (ctx4) {
      new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: ['Alta', 'Media', 'Baja'],
          datasets: [
            {
              label: 'Tareas',
              data: [
                estadisticas.mensuales.distribucion[0].valor,
                estadisticas.mensuales.distribucion[1].valor,
                estadisticas.mensuales.distribucion[2].valor
              ],
              backgroundColor: [
                '#EF4444', // Rojo para alta
                '#F59E0B', // Amarillo para media
                '#10B981'  // Verde para baja
              ]
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  // Eventos para cambiar entre secciones
  document.addEventListener('DOMContentLoaded', function() {
    // Agregar evento al botón de estadísticas
    const btnEstadisticas = document.getElementById('fila_estadisticas');
    if (btnEstadisticas) {
      btnEstadisticas.addEventListener('click', mostrarSeccionEstadisticas);
    }
    
    // Eventos para los demás botones (que ya deberían existir)
    const btnMes = document.getElementById('fila_mes');
    if (btnMes) {
      btnMes.addEventListener('click', function() {
        document.getElementById('calendario-container').style.display = 'block';
        document.getElementById('calendario-week-container').style.display = 'none';
        document.getElementById('contenedor-seccion-crear-tarjetas').style.display = 'none';
        document.getElementById('contenedor-estadisticas').style.display = 'none';
      });
    }
    
    const btnSemana = document.getElementById('fila_semana');
    if (btnSemana) {
      btnSemana.addEventListener('click', function() {
        document.getElementById('calendario-container').style.display = 'none';
        document.getElementById('calendario-week-container').style.display = 'block';
        document.getElementById('contenedor-seccion-crear-tarjetas').style.display = 'none';
        document.getElementById('contenedor-estadisticas').style.display = 'none';
      });
    }
    
    const btnTareas = document.getElementById('fila_panel_de_tareas');
    if (btnTareas) {
      btnTareas.addEventListener('click', function() {
        document.getElementById('calendario-container').style.display = 'none';
        document.getElementById('calendario-week-container').style.display = 'none';
        document.getElementById('contenedor-seccion-crear-tarjetas').style.display = 'block';
        document.getElementById('contenedor-estadisticas').style.display = 'none';
      });
    }
  });