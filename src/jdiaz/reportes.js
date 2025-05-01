
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
        <p style="text-align:center; margin-top:0.5rem;">Origen de datos: N/A</p>
      </div>
      <div>
        <canvas id="graficoEstacionalidad"></canvas>
        <p style="text-align:center; margin-top:0.5rem;">Origen de datos: N/A</p>
      </div>
      <div>
        <canvas id="graficoDominanciaStock"></canvas>
        <p style="text-align:center; margin-top:0.5rem;">Origen de datos: N/A</p>
      </div>
    
    <div style="margin-top: 2rem;">
      <p><strong>Entradas de material:</strong> #</p>
      <p><strong>Salidas de material:</strong> #</p>
      <p><strong>Materiales:</strong> #</p>
      
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

    const pdf = new jsPDF("p", "mm", "a4");
    const dashboard = document.querySelector(".graficos-dashboard");

    await html2canvas(dashboard, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.text("Dashboard de Materia Prima, Entradas y Salidas", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, pdfWidth - 20, pdfHeight);
      pdf.save("dashboard_report.pdf");
    });
  }
});

// Renderizado de gráficos
export async function renderizarDashboard() {
  const [entradas, salidas] = await Promise.all([
    fetch('http://localhost:3000/api/seminario/entradamateriaprima').then(r => r.json()),
    fetch('http://localhost:3000/api/seminario/salidamateriaprima').then(r => r.json())
  ]);

  const entradasPorMes = agruparPorMes(entradas);
  const salidasPorMes = agruparPorMes(salidas);
  const meses = [...new Set([...Object.keys(entradasPorMes), ...Object.keys(salidasPorMes)])];

  // === Gráfico 1: Entradas vs Salidas por mes ===
  const graficoEntradasSalidas=new Chart(document.getElementById('graficoEntradasSalidas'), {
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

const estacional=new Chart(document.getElementById('graficoEstacionalidad'), {
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



  // === Gráfico 3: Dominancia del stock actual ===
  const responseMP = await fetch('http://localhost:3000/api/seminario/materiaprima');
  const materias = await responseMP.json();
  materiasPrimas = materias;

  const dominacion = new Chart(document.getElementById('graficoDominanciaStock'), {
    type: 'pie',
    data: {
      labels: materias.map(m => m.nombre),
      datasets: [{
        data: materias.map(m => m.stockActual),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0']
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: 'Distribución del Stock Actual' }
      }
    }
  });


  const criticos = materias.filter(m => m.stockActual <= 10);

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
