let materiasPrimas = [];

export async function renderAlertas(contenedor) {
  contenedor.innerHTML = `
 

    <h2>Stock Actual</h2>
    <table id="tablaStock">
      <thead>
        <tr>
          <th>Materia Prima</th>
          <th>Descripción</th>
          <th>Stock Actual</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  await cargarMateriasPrimas();
  await mostrarStock();

  const btnNotificar = document.getElementById('btnNotificar');
  btnNotificar.addEventListener('click', notificarProveedores);
}

async function cargarMateriasPrimas() {
  try {
    const response = await fetch('http://3.145.104.62:8085/api/seminario/materiaprima');
    materiasPrimas = await response.json();
  } catch (error) {
    console.error('Error cargando materias primas:', error);
  }
}

async function mostrarStock() {
  const tbody = document.querySelector('#tablaStock tbody');
  tbody.innerHTML = '';

  let hayCriticos = false;

  materiasPrimas.forEach(mp => {
    const esCritico = mp.stockActual <= 10;
    if (esCritico) hayCriticos = true;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${mp.nombre}</td>
      <td>${mp.descripcion}</td>
      <td>${mp.stockActual}</td>
      <td style="color:${esCritico ? 'red' : 'green'}">
        ${esCritico ? 'Stock Crítico' : 'OK'}
      </td>
      <td>
        <button class="btnNotificarIndividual" data-id="${mp.id}">Notificar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Agregar eventos para cada botón individual
  document.querySelectorAll('.btnNotificarIndividual').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const mp = materiasPrimas.find(m => m.id === id);
      notificarIndividual(mp);
    });
  });

  document.querySelectorAll('.btnReporteIndividual').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const mp = materiasPrimas.find(m => m.id === id);
      generarReporte(mp);
    });
  });

  // Alerta automática si hay algún stock crítico
  if (hayCriticos) {
    const lista = materiasPrimas
      .filter(mp => mp.stockActual <= 10)
      .map(mp => `- ${mp.nombre} (${mp.stockActual})`)
      .join('\n');

    Swal.fire({
      icon: 'warning',
      title: '¡Atención!',
      html: `<p>Los siguientes materiales tienen <b>stock crítico</b>:</p><pre style="text-align:left">${lista}</pre>`
    });
  }
}

function notificarProveedores() {
  const materialesCriticos = materiasPrimas.filter(mp => mp.stockActual <= 10);

  if (materialesCriticos.length === 0) {
    Swal.fire('Todo en orden', 'No hay materiales con stock crítico.', 'success');
    return;
  }

  const lista = materialesCriticos.map(mp => `- ${mp.nombre} (${mp.stockActual})`).join('\n');
  Swal.fire({
    title: 'Notificación enviada',
    icon: 'info',
    html: `
      <p>Se ha notificado a proveedores sobre los siguientes materiales:</p>
      <pre style="text-align:left">${lista}</pre>
    `
  });
}

function notificarIndividual(mp) {
  Swal.fire({
    title: `Notificado: ${mp.nombre}`,
    icon: 'info',
    text: `Se ha notificado al proveedor de "${mp.nombre}" (Stock: ${mp.stockActual})`
  });
}

function generarReporte(mp) {
  Swal.fire({
    title: `Generando Reporte`,
    icon: 'info',
    text: `Se generará un reporte para: ${mp.nombre}. Funcionalidad próximamente.`
  });
}
