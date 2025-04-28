// app.js

let materiasPrimas = [];

function mostrarComponente(componente) {
  const contenido = document.getElementById('contenido-principal');

  if (componente === 'registro') {
    contenido.innerHTML = `
      <h1>Registro de Inventario</h1>
      <form id="formRegistro">
        <select name="tipoMovimiento" required>
          <option value="">Seleccione Movimiento</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        <input type="date" name="fecha" required>

        <select name="materiaPrima" id="materiaPrimaSelect" required>
          <option value="">Seleccione Materia Prima</option>
        </select>

        <input type="text" name="descripcion" placeholder="Descripción (opcional)" maxlength="50">

        <input type="text" name="cantidad" placeholder="Cantidad" required maxlength="50">

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

      // Limpiar clases de error
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => input.classList.remove('error'));

      const tipoMovimiento = form.tipoMovimiento.value.trim();
      const fecha = form.fecha.value.trim();
      const materiaPrimaId = form.materiaPrima.value.trim();
      const descripcion = form.descripcion.value.trim();
      const cantidad = form.cantidad.value.trim();
      

      let valid = true;

      // Validaciones
      if (!tipoMovimiento) {
        marcarError(form.tipoMovimiento);
        valid = false;
      }
      if (!fecha) {
        marcarError(form.fecha);
        valid = false;
      }
      if (!materiaPrimaId) {
        marcarError(form.materiaPrima);
        valid = false;
      }
      if (!cantidad || !validarAlfanumerico(cantidad) || cantidad.length > 50) {
        marcarError(form.cantidad);
        valid = false;
      }
      if (descripcion && (!validarAlfanumerico(descripcion) || descripcion.length > 50)) {
        marcarError(form.descripcion);
        valid = false;
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

      let url = '';
      if (tipoMovimiento === 'entrada') {
        url =  'http://3.148.228.241:8085/api/seminario/entradamateriaprima';
        console.log(data);
      } else if (tipoMovimiento === 'salida') {
        url = 'http://3.148.228.241:8085/api/seminario/salidamateriaprima';
      }

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
            showConfirmButton: false,
            timer: 1500
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
  else if (componente === 'reportes') {
    contenido.innerHTML = `
      <h1>Reportes y Alertas</h1>
      <p>Visualización de históricos, alertas de stock crítico y notificaciones automáticas.</p>
    `;
  }
}



// Funciones auxiliares

async function cargarMateriasPrimas() {
  try {
    const response = await fetch( 'http://3.148.228.241:8085/api/seminario/materiaprima');
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
    const response = await fetch( 'http://3.148.228.241:8085/api/seminario/entradamateriaprima');
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
            <button onclick="editarRegistro(${item.id}, 'entrada')">Editar</button>
            <button onclick="eliminarRegistro(${item.id}, 'entrada')">Eliminar</button>
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
    const response = await fetch( 'http://3.148.228.241:8085/api/seminario/salidamateriaprima');
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
            <button onclick="editarRegistro(${item.id}, 'salida')">Editar</button>
            <button onclick="eliminarRegistro(${item.id}, 'salida')">Eliminar</button>
          </td>
        </tr>
      `;
      tbody.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error cargando salidas:', error);
  }
}

function validarAlfanumerico(texto) {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(texto);
}

// Función para marcar errores visuales
function marcarError(elemento) {
  elemento.classList.add('error');
}

function editarRegistro(id, tipo) {
  Swal.fire('Función en desarrollo', `Editar ${tipo} ID: ${id}`, 'info');
}

function eliminarRegistro(id, tipo) {
  Swal.fire('Función en desarrollo', `Eliminar ${tipo} ID: ${id}`, 'warning');
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarComponente('registro');
});
