import { renderRegistro } from './jdiaz/registro.js';
import { renderAlertas } from './jdiaz/Alertas.js';
import { renderReportes } from './jdiaz/reportes.js';


document.addEventListener('DOMContentLoaded', () => {
  mostrarComponente('registro'); 

  // Puedes agregar listeners de navegación aquí si tienes botones de menú
  document.getElementById('btnRegistro')?.addEventListener('click', () => mostrarComponente('registro'));
  document.getElementById('btnAlertas')?.addEventListener('click', () => mostrarComponente('Alertas'));
  document.getElementById('btnReportes')?.addEventListener('click', () => mostrarComponente('reportes'));
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
    default:
      contenedor.innerHTML = '<p>Componente no encontrado</p>';
  }
}
