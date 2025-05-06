
let materiasPrimas = [];

export async function renderReportes(contenedor) {
  // Limpia el contenedor antes de renderizar
  contenedor.innerHTML = '';

  contenedor.innerHTML = `
  
  <h1 style="text-align: center; margin-top: 2rem;">Dashboard de Materia Prima, Entradas y Salidas</h1>
    <div style="margin-top: 2rem;">
    <button id="generarPDF">Generar PDF del Dashboard</button>
    </div>

    <div class="graficos-dashboard" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
      <div>
  <canvas id="graficoEntradasSalidas"></canvas>
  <p><strong>Entradas de material:</strong> <span id="cantidadEntradas">#</span></p>
</div>
<div>
  <canvas id="graficoEstacionalidad"></canvas>
  <p><strong>Salidas de material:</strong> <span id="cantidadSalidas">#</span></p>
</div>
<div>
  <canvas id="graficoDominanciaStock"></canvas>
  <p><strong>Materiales:</strong> <span id="cantidadMateriales">#</span></p>
</div>
    <div style="margin-top: 2rem;">
      <div style="margin-top: 1rem; font-weight: bold;">
      <p style="font-size: 1.1rem;">Explicación de lo que contiene los gráficos</p>
    </div>
    </div>

  `;




  await renderizarDashboard();
}


document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "generarPDF") {
    const { jsPDF } = window.jspdf;
    const dashboard = document.querySelector(".graficos-dashboard");

    // Mostrar SweetAlert2 con spinner antes de generar el PDF
    Swal.fire({
      title: 'Generando reporte...',
      text: 'Por favor espera unos segundos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra el spinner
      }
    });

    try {
      const canvas = await html2canvas(dashboard, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.text("Dashboard de Materia Prima, Entradas y Salidas", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, pdfWidth - 20, pdfHeight);

      pdf.save("dashboard_report.pdf");

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Reporte generado',
        text: 'El reporte ha sido descargado exitosamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al generar el reporte',
        text: 'Hubo un problema al generar el PDF.'
      });
      console.error(error);
    }
  }
});


// Renderizado de gráficos
export async function renderizarDashboard() {
  const [entradas, salidas] = await Promise.all([
    fetch('http://3.148.190.86:3000/api/seminario/entradamateriaprima').then(r => r.json()),
    fetch('http://3.148.190.86:3000/api/seminario/salidamateriaprima').then(r => r.json())
  ]);

  const entradasPorMes = agruparPorMes(entradas);
  const salidasPorMes = agruparPorMes(salidas);
  document.getElementById("cantidadEntradas").textContent = entradas.length;
  document.getElementById("cantidadSalidas").textContent = salidas.length;
  const meses = [...new Set([...Object.keys(entradasPorMes), ...Object.keys(salidasPorMes)])];
  // === Gráfico 1: Entradas vs Salidas por mes ===
  const graficoEntradasSalidas = new Chart(document.getElementById('graficoEntradasSalidas'), {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        { label: 'Entradas', data: meses.map(m => entradasPorMes[m] || 0), backgroundColor: 'green' },
        { label: 'Salidas', data: meses.map(m => salidasPorMes[m] || 0), backgroundColor: 'red' }
      ]
    },
    options: {
      plugins: {
        title: { display: true, text: 'Entradas vs Salidas por Mes' }
      }
    }
  });

  // === Gráfico 2: Estacionalidad (entradas - salidas por mes) ===
  const variacionPorMes = meses.map(m => (entradasPorMes[m] || 0) - (salidasPorMes[m] || 0));

  const estacional = new Chart(document.getElementById('graficoEstacionalidad'), {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Variación neta de stock por mes',
        data: variacionPorMes,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: false,
        tension: 0.3,
        pointRadius: 5
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Estacionalidad: Variación Neta Mensual del Stock'
        },
        subtitle: {
          display: true,
          text: 'Origen de los datos: N/A',
          font: { size: 12, style: 'italic' },
          color: '#555'
        },
        tooltip: {
          callbacks: {
            label: context => {
              const value = context.parsed.y;
              return value >= 0 ? `+${value} unidades` : `${value} unidades`;
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Variación de stock'
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
// === Gráfico 3: Dominancia del stock actual con datos recientes ===
const seisMesesAtras = new Date();
seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 4);

// Filtrar entradas y salidas recientes
const entradasRecientes = entradas.filter(e => new Date(e.fecha) >= seisMesesAtras);
const salidasRecientes = salidas.filter(s => new Date(s.fecha) >= seisMesesAtras);

// Obtener IDs únicos de materias primas con movimiento
const idsRecientes = [...new Set([
  ...entradasRecientes.map(e => e.materiaPrima?.id),
  ...salidasRecientes.map(s => s.materiaPrima?.id)
])];
document.getElementById("cantidadMateriales").textContent = idsRecientes.length;


// Obtener todas las materias primas
const responseMP = await fetch('http://3.148.190.86:3000/api/seminario/materiaprima');
const todasLasMaterias = await responseMP.json();

// Buscar manualmente las materias primas por ID con un bucle
const materiasConMovimiento = [];
for (const id of idsRecientes) {
  const materia = todasLasMaterias.find(m => m.id === id);
  if (materia) {
    materiasConMovimiento.push(materia);
  }
}

// Verificar que haya datos
if (materiasConMovimiento.length === 0) {
  console.warn("No hay materias primas con movimiento reciente.");
  return;
}

// Generar colores para cada materia prima
function generarColoresAleatorios(n) {
  const colores = [];
  for (let i = 0; i < n; i++) {
    colores.push(`hsl(${Math.floor(Math.random() * 360)}, 60%, 70%)`);
  }
  return colores;
}

const colores = generarColoresAleatorios(materiasConMovimiento.length);

// Crear el gráfico de pastel
const dominacion = new Chart(document.getElementById('graficoDominanciaStock'), {
  type: 'pie',
  data: {
    labels: materiasConMovimiento.map(m => m.nombre),
    datasets: [{
      data: materiasConMovimiento.map(m => m.stockActual),
      backgroundColor: colores
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Distribución del Stock Actual (materias primas con movimiento reciente)'
      }
    }
  }
});

}

// Función auxiliar para agrupar entradas/salidas por mes
function agruparPorMes(lista) {
  const resultado = {};
  lista.forEach(item => {
    const fecha = new Date(item.fecha);
    const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    resultado[key] = (resultado[key] || 0) + item.cantidad;
  });
  return resultado;
}

