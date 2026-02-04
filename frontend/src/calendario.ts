const dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horas: string[] = [
  '10:00-11:00', '11:00-12:00', '12:00-13:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00',
  '19:00-20:00', '20:00-21:00'
];

const calendarioDiv = document.getElementById('calendario') as HTMLDivElement;
const semanaSelect = document.getElementById('semana') as HTMLSelectElement;
const reservarBtn = document.getElementById('reservarBtn') as HTMLButtonElement;

interface Reservas {
  [key: string]: 'reservado';
}

function generarSemanas(): void {
  const today = new Date();
  for (let i = 0; i < 4; i++) {
    const start = new Date(today);
    start.setDate(start.getDate() + i * 7 - today.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const key = `${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}`;
    const label = `${start.getDate()} ${start.toLocaleString('es', { month: 'long' })} - ${end.getDate()} ${end.toLocaleString('es', { month: 'long' })}`;

    const option = document.createElement('option');
    option.value = key;
    option.textContent = `Semana del ${label}`;
    semanaSelect.appendChild(option);
  }

  if (semanaSelect.options.length > 0) {
    semanaSelect.selectedIndex = 0;
    crearTabla(semanaSelect.value);
  }
}

function crearTabla(semana: string): void {
  calendarioDiv.innerHTML = '';
  const tabla = document.createElement('table');
  tabla.className = 'table table-bordered text-center';

  const thead = document.createElement('thead');
  thead.innerHTML = `<tr><th>Hora</th>${dias.map(d => `<th>${d}</th>`).join('')}</tr>`;
  tabla.appendChild(thead);

  const tbody = document.createElement('tbody');
  const reservas: Reservas = JSON.parse(localStorage.getItem(semana) || '{}');

  horas.forEach(hora => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<th scope="row">${hora}</th>`;

    dias.forEach(dia => {
  const celda = document.createElement('td') as HTMLTableCellElement;
  const key = `${dia}-${hora}`;
  celda.dataset['key'] = key; // ← cambio aquí

  if (reservas[key] === 'reservado') {
    celda.className = 'reservado';
    celda.title = 'Reservado';
  } else {
    celda.className = 'disponible';
    celda.title = 'Disponible';
    celda.addEventListener('click', () => {
      if (celda.classList.contains('selected-cell')) {
        celda.classList.remove('selected-cell');
        celda.classList.add('disponible');
      } else {
        celda.classList.add('selected-cell');
        celda.classList.remove('disponible');
      }
    });
  }

  fila.appendChild(celda);
});


    tbody.appendChild(fila);
  });

  tabla.appendChild(tbody);
  calendarioDiv.appendChild(tabla);
}

function mostrarMensaje(mensaje: string): void {
  const overlay = document.getElementById('overlayExito') as HTMLDivElement;
  overlay.style.display = 'flex';
  overlay.querySelector('h2')!.textContent = mensaje;

  setTimeout(() => {
    overlay.style.opacity = '1';
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.style.opacity = '1';
      overlay.style.transition = '';
    }, 500);
  }, 3500);
}

function mostrarMensajeError(): void {
  const overlayError = document.getElementById('overlayError') as HTMLDivElement;
  overlayError.style.display = 'flex';

  setTimeout(() => {
    overlayError.style.opacity = '1';
    overlayError.style.transition = 'opacity 0.5s ease';
    overlayError.style.opacity = '0';
    setTimeout(() => {
      overlayError.style.display = 'none';
      overlayError.style.opacity = '1';
      overlayError.style.transition = '';
    }, 500);
  }, 4000);
}

function ocultarMensaje(): void {
  const mensajeDiv = document.getElementById('mensajeReserva') as HTMLDivElement;
  mensajeDiv.style.display = 'none';
}

semanaSelect.addEventListener('change', () => {
  crearTabla(semanaSelect.value);
  ocultarMensaje();
});

reservarBtn.addEventListener('click', () => {
  const asignaturaInput = document.getElementById('asignatura') as HTMLInputElement;
  const asignatura = asignaturaInput.value;
  const semana = semanaSelect.value;

  if (!asignatura) {
    mostrarMensajeError();
    return;
  }

  if (!semana) return alert('Por favor selecciona una semana');

  const tabla = calendarioDiv.querySelector('table');
  if (!tabla) return alert('No hay calendario para reservar');

  const reservas: Reservas = JSON.parse(localStorage.getItem(semana) || '{}');
  const celdasSeleccionadas = tabla.querySelectorAll<HTMLTableCellElement>('td.selected-cell'); // ← cast aquí

  if (celdasSeleccionadas.length === 0) return alert('Selecciona al menos una celda para reservar');

  celdasSeleccionadas.forEach(celda => {
  const key = celda.dataset['key']; // ← cambio aquí
  if (!key) return; // seguridad por si no existe
  reservas[key] = 'reservado';
  celda.className = 'reservado';
  celda.title = 'Reservado';
});


  localStorage.setItem(semana, JSON.stringify(reservas));
  mostrarMensaje('Actualmente no es posible reservar. Página en proceso... Cualquier duda escribe por DM');
});

generarSemanas();
