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
    const response = await fetch('http://localhost:3000/api/seminario/materiaprima');
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
        <button class="btnNotificarIndividual" data-id="${mp.id}"> <svg class="bell" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
  Notifications
  <div class="arrow">›</div></button>
<button class="button" onclick="eliminarRegistro(${mp.id})">
            <svg viewBox="0 0 448 512" class="svgIcon">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
            </path>
            </svg</button>

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

window.eliminarRegistro = async function(id) {
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres eliminar esta materia prima? Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    // Buscar si tiene registros de entrada o salida asociados
    const entradas = await fetch(`http://localhost:3000/api/seminario/entradamateriaprima`)
      .then(res => res.json());
    const salidas = await fetch(`http://localhost:3000/api/seminario/salidamateriaprima`)
      .then(res => res.json());

    const tieneMovimientos = entradas.some(e => e.materiaPrima.id === id) || salidas.some(s => s.materiaPrima.id === id);

    if (tieneMovimientos) {
      Swal.fire('No permitido', 'No se puede eliminar una materia prima con movimientos registrados.', 'error');
      return;
    }

    // Eliminar la materia prima
    await fetch(`http://localhost:3000/api/seminario/materiaprima/${id}`, {
      method: 'DELETE'
    });

    Swal.fire('Eliminado', 'Materia prima eliminada correctamente.', 'success');

    // Recargar la lista
    await cargarMateriasPrimas();
    await mostrarStock();

  } catch (error) {
    console.error('Error al eliminar la materia prima:', error);
    Swal.fire('Error', 'Ocurrió un error al eliminar la materia prima.', 'error');
  }
};
