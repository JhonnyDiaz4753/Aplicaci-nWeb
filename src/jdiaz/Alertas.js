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
          <th>Notificar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  await cargarMateriasPrimas();
  await mostrarStock(1);

  const btnNotificar = document.getElementById('btnNotificar');
  btnNotificar.addEventListener('click', notificarProveedores);
}

async function cargarMateriasPrimas() {
  try {
    const response = await fetch('http://3.148.190.86:3000/api/seminario/materiaprima');
    materiasPrimas = await response.json();
  } catch (error) {
    console.error('Error cargando materias primas:', error);
  }
}

async function mostrarStock(number) {
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
        <button class="btnNotificarIndividual" data-id="${mp.id}"> <svg class="bell" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
  Notifications
  <div class="arrow">›</div></button>
      </td>
      <td>
      <button class="button" type="button" onclick="eliminarMateriaPrima(${mp.id})">
            <span class="button__text">Delete</span>
  <span class="button__icon"><svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line></svg></span>
</button>
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
  if (number === 1) {
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

window.eliminarMateriaPrima = async function(id) {

  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;
  
  try {
    const response = await fetch(`http://3.148.190.86:3000/api/seminario/materiaprima/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      Swal.fire('Eliminado', 'La materia prima ha sido eliminada correctamente.', 'success');
      await cargarMateriasPrimas();
      await mostrarStock(2);
    } else {
      Swal.fire('Error', 'No se pudo eliminar la materia prima.', 'error');
    }
  } catch (error) {
    console.error('Error eliminando materia prima:', error);
    Swal.fire('Error', 'Ocurrió un error al intentar eliminar la materia prima.', 'error');
  }
};
