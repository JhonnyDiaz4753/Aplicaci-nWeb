// registro.js

let materiasPrimas = [];

export function renderRegistro(contenedor) {
  contenedor.innerHTML = `
    <h1>Registro de Inventario</h1>
    <form id="formRegistro">
      <select name="tipoMovimiento" required>
        <option value="">Seleccione Movimiento</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

     <input type="date" name="fecha" class="custom-date" required>

      <select name="materiaPrima" id="materiaPrimaSelect" required>
        <option value="">Seleccione Materia Prima</option>
      </select>

      <input type="text" name="descripcion" placeholder="Descripción (opcional)" maxlength="50">
      <input type="number" name="cantidad" placeholder="Cantidad" required maxlength="50">

      <button type="submit">Registrar</button>
    </form>

    <h2>Entradas Registradas</h2>
    <table id="tablaEntradas">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Cantidad</th>
          <th>Material</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>

    <h2>Salidas Registradas</h2>
    <table id="tablaSalidas">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Cantidad</th>
          <th>Material</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  cargarMateriasPrimas();
  cargarEntradas();
  cargarSalidas();

  const form = document.getElementById('formRegistro');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => input.classList.remove('error'));

    const tipoMovimiento = form.tipoMovimiento.value.trim();
    const fecha = form.fecha.value.trim();
    const materiaPrimaId = form.materiaPrima.value.trim();
    const descripcion = form.descripcion.value.trim();
    const cantidad = form.cantidad.value.trim();

    let valid = true;

    if (!tipoMovimiento) marcarError(form.tipoMovimiento), valid = false;
    if (!fecha) marcarError(form.fecha), valid = false;
    if (!materiaPrimaId) marcarError(form.materiaPrima), valid = false;
    if (!cantidad || !validarAlfanumerico(cantidad) || cantidad.length > 50) {
      marcarError(form.cantidad), valid = false;
    }
    if (descripcion && (!validarAlfanumerico(descripcion) || descripcion.length > 50)) {
      marcarError(form.descripcion), valid = false;
    }

    if (!valid) {
      Swal.fire({
        icon: 'error',
        title: 'Campos inválidos',
        text: 'Corrige los campos marcados en rojo.',
      });
      return;
    }

    const materiaSeleccionada = materiasPrimas.find(m => m.id == materiaPrimaId);

    const data = {
      materiaPrima: {
        id: materiaSeleccionada.id,
        nombre: materiaSeleccionada.nombre,
        descripcion: descripcion || materiaSeleccionada.descripcion,
        stockActual: materiaSeleccionada.stockActual || 0
      },
      cantidad: parseInt(cantidad),
      fecha: fecha
    };

    let url = tipoMovimiento === 'entrada'
      ? 'http://localhost:3000/api/seminario/entradamateriaprima'
      : 'http://localhost:3000/api/seminario/salidamateriaprima';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          timer: 1500,
          showConfirmButton: false
        });
        form.reset();
        cargarEntradas();
        cargarSalidas();
      } else {
        Swal.fire('Error', 'Error al registrar. Verifica los datos.', 'error');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      Swal.fire('Error', 'Error en la conexión con el servidor.', 'error');
    }
  });
}

function marcarError(elemento) {
  elemento.classList.add('error');
}

function validarAlfanumerico(texto) {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(texto);
}

async function cargarMateriasPrimas() {
  try {
    const response = await fetch('http://localhost:3000/api/seminario/materiaprima');
    materiasPrimas = await response.json();

    const select = document.getElementById('materiaPrimaSelect');
    materiasPrimas.forEach(mp => {
      const option = document.createElement('option');
      option.value = mp.id;
      option.textContent = mp.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando materias primas:', error);
  }
}

async function cargarEntradas() {
  try {
    const response = await fetch('http://localhost:3000/api/seminario/entradamateriaprima');
    const data = await response.json();

    const tbody = document.querySelector('#tablaEntradas tbody');
    tbody.innerHTML = '';
    data.forEach(item => {
      const fila = `
        <tr>
          <td>${item.fecha}</td>
          <td>${item.cantidad}</td>
          <td>${item.materiaPrima.nombre}</td>
          <td>
            <button class="button" onclick="eliminarRegistro(${item.id},'entrada' )">
            <svg viewBox="0 0 448 512" class="svgIcon">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
            </path>
            </svg
            </button>
          </td>
        </tr>
      `;
      tbody.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error cargando entradas:', error);
  }
}

async function cargarSalidas() {
  try {
    const response = await fetch('http://localhost:3000/api/seminario/salidamateriaprima');
    const data = await response.json();

    const tbody = document.querySelector('#tablaSalidas tbody');
    tbody.innerHTML = '';
    data.forEach(item => {
      const fila = `
        <tr>
          <td>${item.fecha}</td>
          <td>${item.cantidad}</td>
          <td>${item.materiaPrima.nombre}</td>
          <td>
            <button class="button" onclick="eliminarRegistro(${item.id}, 'salida')">
            <svg viewBox="0 0 448 512" class="svgIcon">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
            </path>
            </svg
            </button>
          </td>
        </tr>
      `;
      tbody.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error cargando salidas:', error);
  }
}

window.eliminarRegistro = async function(id, tipoMovimiento) {
  const confirmacion = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres eliminar esta ${tipoMovimiento}? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacion.isConfirmed) return;

  try {
    let data, materia, nuevoStock;

    if (tipoMovimiento === 'entrada') {
      const response = await fetch(`http://localhost:3000/api/seminario/entradamateriaprima/${id}`);
      data = await response.json();
      const materiaRes = await fetch(`http://localhost:3000/api/seminario/materiaprima/${data.materiaPrima.id}`);
      materia = await materiaRes.json();

      nuevoStock = materia.stockActual - data.cantidad;
    } else if (tipoMovimiento === 'salida') {
      const response = await fetch(`http://localhost:3000/api/seminario/salidamateriaprima/${id}`);
      data = await response.json();
      const materiaRes = await fetch(`http://localhost:3000/api/seminario/materiaprima/${data.materiaPrima.id}`);
      materia = await materiaRes.json();

      nuevoStock = materia.stockActual + data.cantidad;
    } else {
      console.error('Tipo de movimiento no válido:', tipoMovimiento);
      return;
    }

    const materiaActualizada = {
      ...materia,
      stockActual: nuevoStock
    };

    await fetch('http://localhost:3000/api/seminario/materiaprima', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materiaActualizada)
    });

    const endpoint =
      tipoMovimiento === 'entrada'
        ? `entradamateriaprima/${id}`
        : `salidamateriaprima/${id}`;

    await fetch(`http://localhost:3000/api/seminario/${endpoint}`, {
      method: 'DELETE'
    });

    Swal.fire('Eliminado', `Registro de ${tipoMovimiento} eliminado correctamente.`, 'success');
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    Swal.fire('Error', 'Ocurrió un error al eliminar el registro.', 'error');
  }
};
