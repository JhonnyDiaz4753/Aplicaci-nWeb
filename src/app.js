import { renderRegistro } from './jdiaz/registro.js';
import { renderAlertas } from './jdiaz/Alertas.js';
import { renderReportes } from './jdiaz/reportes.js';

document.addEventListener('DOMContentLoaded', () => {
  mostrarComponente('registro'); 

  // Listeners para botones de menú
  document.getElementById('btnRegistro')?.addEventListener('click', () => mostrarComponente('registro'));
  document.getElementById('btnAlertas')?.addEventListener('click', () => mostrarComponente('Alertas'));
  document.getElementById('btnReportes')?.addEventListener('click', () => mostrarComponente('reportes'));

  // Listener para abrir compras.htm en nueva pestaña
  document.getElementById('btnCompras')?.addEventListener('click', () => {
    window.open('compras.htm', '_blank');
  });  
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
