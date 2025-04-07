/**
 * Clase que representa un calendario mensual
 */
class Calendario {
    /**
     * Constructor del calendario
     * @param {string} containerId - ID del contenedor del calendario
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        this.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.setupTemplate();
        this.render();
        this.setupEventListeners();
    }

    /**
     * Configura la plantilla del calendario
     */
    setupTemplate() {
        const template = document.getElementById('calendario-template');
        this.container.appendChild(template.content.cloneNode(true));
    }

    /**
     * Obtiene los días del mes actual
     * @param {Date} date - Fecha para la que obtener los días
     * @returns {Array} Array con los días del mes
     */
    getDaysInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        return Array.from({ length: 42 }, (_, i) => {
            const day = i - firstDayOfMonth + 1;
            if (day <= 0 || day > daysInMonth) return null;
            return day;
        });
    }

    /**
     * Obtiene las tareas para un día específico
     * @param {number} day - Día del mes
     * @returns {Array} Tareas para ese día
     */
    getTasksForDay(day) {
        const dateStr = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return cadenaTarjetas.filter(task => task.fechaInicio === dateStr);
    }

    /**
     * Cambia el mes actual
     * @param {number} increment - Incremento de meses (positivo o negativo)
     */
    changeMonth(increment) {
        this.currentDate.setMonth(this.currentDate.getMonth() + increment);
        this.render();
    }

    /**
     * Configura los eventos del calendario
     */
    setupEventListeners() {
        const prevButton = this.container.querySelector('.prev-month');
        const nextButton = this.container.querySelector('.next-month');
        
        prevButton.addEventListener('click', () => this.changeMonth(-1));
        nextButton.addEventListener('click', () => this.changeMonth(1));
    }

    /**
     * Renderiza el calendario
     */
    render() {
        const headerTitle = this.container.querySelector('.calendario-header h2');
        const grid = this.container.querySelector('.calendario-grid');
        
        // Actualizar título
        headerTitle.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Limpiar grid
        grid.innerHTML = '';
        
        // Agregar encabezados de días
        this.renderWeekDays(grid);
        
        // Agregar días
        this.renderDays(grid);
    }

    /**
     * Renderiza los encabezados de los días de la semana
     * @param {HTMLElement} grid - Elemento grid del calendario
     */
    renderWeekDays(grid) {
        this.weekDays.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'calendario-cell calendario-header-cell';
            cell.textContent = day;
            grid.appendChild(cell);
        });
    }

    /**
     * Renderiza los días del mes
     * @param {HTMLElement} grid - Elemento grid del calendario
     */
    renderDays(grid) {
        this.getDaysInMonth(this.currentDate).forEach(day => {
            const cell = document.createElement('div');
            cell.className = `calendario-cell ${day ? 'calendario-day' : 'calendario-empty'}`;
            
            if (day) {
                this.renderDayCell(cell, day);
            }
            
            grid.appendChild(cell);
        });
    }

    /**
     * Renderiza una celda de día
     * @param {HTMLElement} cell - Celda del día
     * @param {number} day - Día del mes
     */
    renderDayCell(cell, day) {
        // Crear número del día
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);
        
        // Crear contenedor de tareas
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'day-tasks';
        
        // Obtener y renderizar tareas
        const tasks = this.getTasksForDay(day);
        tasks.forEach(task => {
            const taskEl = this.createTaskElement(task);
            tasksContainer.appendChild(taskEl);
        });
        
        cell.appendChild(tasksContainer);
    }

    /**
     * Crea un elemento de tarea
     * @param {Object} task - Datos de la tarea
     * @returns {HTMLElement} Elemento de tarea
     */
    createTaskElement(task) {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.innerHTML = `
            <div class="task-title">${task.titulo}</div>
            <div class="task-time">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${task.horaInicio} - ${task.horaFin}
            </div>
        `;
        return taskEl;
    }
}