

/**
 * @module RegistroInventario
 * 
 * Este módulo gestiona el registro de movimientos de inventario (entradas y salidas) 
 * de materias primas en una aplicación web. Proporciona una interfaz para registrar 
 * movimientos, visualizar los registros existentes y eliminarlos si es necesario.
 * 
 * Funcionalidades principales:
 * - Renderizar un formulario para registrar movimientos de inventario.
 * - Validar los datos ingresados en el formulario.
 * - Registrar entradas y salidas de materias primas mediante solicitudes HTTP a una API REST.
 * - Cargar y mostrar las materias primas disponibles desde el servidor.
 * - Mostrar tablas con los registros de entradas y salidas.
 * - Eliminar registros de entradas y salidas, actualizando el stock de las materias primas.
 * 
 * Dependencias:
 * - `fetch`: Para realizar solicitudes HTTP a la API REST.
 * - `Swal` (SweetAlert2): Para mostrar alertas y confirmaciones al usuario.
 * 
 * Notas:
 * - Este módulo asume que la API REST está disponible en `http://localhost:3000/api/seminario`.
 * - Los datos de materias primas, entradas y salidas se gestionan mediante endpoints específicos.
 * - El módulo utiliza validaciones básicas para los campos del formulario.
 */
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
      <span id="stockInfo" style="margin-left: 10px; font-weight: bold;"></span>

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
  const materiaPrimaSelect = document.getElementById('materiaPrimaSelect');
  const tipoMovimientoSelect = form.tipoMovimiento;
  const stockInfo = document.getElementById('stockInfo');

  materiaPrimaSelect.addEventListener('change', () => {
    const seleccion = materiasPrimas.find(mp => mp.id == materiaPrimaSelect.value);

    if (seleccion) {
      const stock = seleccion.stockActual || 0;
      stockInfo.textContent = `Stock actual: ${stock}`;

      const opcionSalida = [...tipoMovimientoSelect.options].find(opt => opt.value === 'salida');
      if (opcionSalida) {
        opcionSalida.disabled = stock <= 0;
      }

      if (stock <= 0 && tipoMovimientoSelect.value === 'salida') {
        tipoMovimientoSelect.value = '';
      }
    } else {
      stockInfo.textContent = '';
    }
  });

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
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
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
    const cantidadNum = parseInt(cantidad);
    let nuevoStock = materiaSeleccionada.stockActual;

    if (tipoMovimiento === 'entrada') {
      nuevoStock += cantidadNum;
    } else if (tipoMovimiento === 'salida') {
      if (cantidadNum > nuevoStock) {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: `Solo hay ${nuevoStock} unidades en stock.`,
        });
        return;
      }
      nuevoStock -= cantidadNum;
    }

    // Primero actualizamos el stock
    const updateResponse = await fetch('http://localhost:3000/api/seminario/materiaprima', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...materiaSeleccionada,
        stockActual: nuevoStock
      })
    });

    if (!updateResponse.ok) {
      Swal.fire('Error', 'No se pudo actualizar el stock.', 'error');
      return;
    }

    const movimientoUrl = tipoMovimiento === 'entrada'
      ? 'http://localhost:3000/api/seminario/entradamateriaprima'
      : 'http://localhost:3000/api/seminario/salidamateriaprima';

    const movimientoData = {
      materiaPrima: {
        id: materiaSeleccionada.id,
        nombre: materiaSeleccionada.nombre,
        descripcion: descripcion || materiaSeleccionada.descripcion,
        stockActual: nuevoStock
      },
      cantidad: cantidadNum,
      fecha: fecha
    };

    try {
      const response = await fetch(movimientoUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          timer: 1500,
          showConfirmButton: false
        });
        form.reset();
        stockInfo.textContent = '';
        cargarMateriasPrimas();
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
         <button class="button" type="button" onclick="eliminarEntradaSalida(${item.id}, 'entrada')">
         <span class="button__text">Delete</span>
  <span class="button__icon"><svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line></svg></span>
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
     <button class="button" type="button" onclick="eliminarEntradaSalida(${item.id}, 'salida')">
         <span class="button__text">Delete</span>
  <span class="button__icon"><svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line></svg></span>
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

window.eliminarEntradaSalida = async function(id, tipoMovimiento) {
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

      materia = materiasPrimas.find(m => m.id === data.materiaPrima.id);
      nuevoStock = materia.stockActual - data.cantidad;

    } else if (tipoMovimiento === 'salida') {
      const response = await fetch(`http://localhost:3000/api/seminario/salidamateriaprima/${id}`);
      data = await response.json();

      materia = materiasPrimas.find(m => m.id === data.materiaPrima.id);
      nuevoStock = materia.stockActual + data.cantidad;

    } else {
      console.error('Tipo de movimiento no válido:', tipoMovimiento);
      return;
    }

    // Actualizar stock
    const materiaActualizada = { ...materia, stockActual: nuevoStock };

    await fetch('http://localhost:3000/api/seminario/materiaprima', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materiaActualizada)
    });

    // Eliminar el movimiento
    const endpoint =
    tipoMovimiento === 'entrada'
      ? `entradamateriaprima/${id}`
      : `salidamateriaprima/${id}`;
  
  await fetch(`http://localhost:3000/api/seminario/${endpoint}`, {
    method: 'DELETE'
  });
    Swal.fire('Eliminado', `Registro de ${tipoMovimiento} eliminado correctamente.`, 'success');

    // Recargar materiasPrimas y mostrar stock actualizado
    await cargarMateriasPrimas();
    cargarEntradas();
    cargarSalidas();
    

  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    Swal.fire('Error', 'Ocurrió un error al eliminar el registro.', 'error');
  }
};
