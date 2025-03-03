class CalendarioSemanal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        this.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.setupTemplate();
        this.render();
        this.setupEventListeners();
    }

    setupTemplate() {
        const template = document.getElementById('calendario-template-semana');
        this.container.appendChild(template.content.cloneNode(true));
    }

    getWeekDates() {
        // Obtenemos el primer día de la semana actual (domingo)
        const currentDay = this.currentDate.getDay();
        const firstDayOfWeek = new Date(this.currentDate);
        firstDayOfWeek.setDate(this.currentDate.getDate() - currentDay);

        // Generamos los 7 días de la semana
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + i);
            return {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                fullDate: date
            };
        });
    }

    getTasksForDate(date) {
        const dateStr = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        return cadenaTarjetas.filter(task => task.fechaInicio === dateStr);
    }

    changeWeek(increment) {
        this.currentDate.setDate(this.currentDate.getDate() + (increment * 7));
        this.render();
    }

    setupEventListeners() {
        const prevButton = this.container.querySelector('.prev-week');
        const nextButton = this.container.querySelector('.next-week');
        
        prevButton.addEventListener('click', () => this.changeWeek(-1));
        nextButton.addEventListener('click', () => this.changeWeek(1));
    }

    formatWeekHeader() {
        const weekDates = this.getWeekDates();
        const firstDay = weekDates[0];
        const lastDay = weekDates[6];
        
        // Si la semana abarca dos meses diferentes
        if (firstDay.month !== lastDay.month) {
            return `${firstDay.day} ${this.monthNames[firstDay.month]} - ${lastDay.day} ${this.monthNames[lastDay.month]} ${lastDay.year}`;
        }
        
        return `${firstDay.day} - ${lastDay.day} ${this.monthNames[firstDay.month]} ${firstDay.year}`;
    }

    render() {
        const headerTitle = this.container.querySelector('.calendario-header h2');
        const grid = this.container.querySelector('.calendario-grid');
        
        // Actualizar título con el rango de la semana
        headerTitle.textContent = this.formatWeekHeader();
        
        // Limpiar grid
        grid.innerHTML = '';
        
        // Agregar encabezados de días
        this.weekDays.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'calendario-cell calendario-header-cell';
            cell.textContent = day;
            grid.appendChild(cell);
        });
        
        // Obtener los días de la semana actual
        const weekDates = this.getWeekDates();
        
        // Agregar cada día de la semana
        weekDates.forEach(date => {
            const cell = document.createElement('div');
            cell.className = 'calendario-cell calendario-day';
            
            // Verificar si es el día actual
            const isToday = new Date().toDateString() === date.fullDate.toDateString();
            if (isToday) {
                cell.style.border = '2px solid var(--ColorSecundario)';
            }
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = date.day;
            cell.appendChild(dayNumber);
            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'day-tasks';
            
            const tasks = this.getTasksForDate(date);
            tasks.forEach(task => {
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
                tasksContainer.appendChild(taskEl);
            });
            
            cell.appendChild(tasksContainer);
            grid.appendChild(cell);
        });
    }
}


