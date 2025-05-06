import { renderRegistro } from './jdiaz/registro.js';
import { renderAlertas } from './jdiaz/Alertas.js';
import { renderReportes } from './jdiaz/reportes.js';


document.addEventListener('DOMContentLoaded', () => {
  mostrarComponente('bienvenida'); // Muestra la bienvenida al cargar la página
  // Al hacer clic en el logo
  const logoInicio = document.getElementById("logoInicio");
  logoInicio.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarBienvenida();
  });

  // Puedes agregar listeners de navegación aquí si tienes botones de menú
  document.getElementById('btnRegistro')?.addEventListener('click', () => mostrarComponente('registro'));
  document.getElementById('btnAlertas')?.addEventListener('click', () => mostrarComponente('Alertas'));
  document.getElementById('btnReportes')?.addEventListener('click', () => mostrarComponente('reportes'));
  document.getElementById('btnProductos')?.addEventListener('click', () => mostrarComponente('btnProductos'));
  document.getElementById('btnconsulta')?.addEventListener('click', () => mostrarComponente('btnconsulta'));
});

function mostrarComponente(componente) {
  const contenedor = document.getElementById('contenido-principal');

  switch (componente) {
    case 'registro':
      renderRegistro(contenedor);
      break;
    case 'Alertas':
      renderAlertas(contenedor);
      break;
    case 'reportes':
      renderReportes(contenedor);
      break;
    case 'bienvenida':
      mostrarBienvenida(); 
      break;
    case 'btnProductos':
      contenedor.innerHTML = `
        <iframe src="kgilon/inventario.html" style="width: 100%; height: 100%; border: none;"></iframe>
      `;
      break;
    case 'btnconsulta':
      contenedor.innerHTML = `
        <iframe src="ehurtado/index2.html" style="width: 100%; height: 100%; border: none;"></iframe>
      `;  
      break;
      default:
      contenedor.innerHTML = '<p>Componente no encontrado</p>';
  }
}
function mostrarBienvenida(contenedor) {
  const contenidoPrincipal = document.getElementById('contenido-principal');
  contenidoPrincipal.innerHTML = `
    <section class="bienvenida">
      <img src="Logo de Gestión de Inventarios.png" alt="Logo del sistema" class="logo-bienvenida" />
      <h1>¡Bienvenido al Sistema de Gestión de Inventario!</h1>
      <p>
        Este sistema te permite registrar entradas y salidas de materia prima, generar alertas cuando los niveles de stock son críticos,
        y visualizar reportes estadísticos para tomar decisiones informadas. Usa el menú lateral para comenzar a gestionar tu inventario.
      </p>
    </section>
  `;
}
