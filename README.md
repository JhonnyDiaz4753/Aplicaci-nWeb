Aquí tienes el texto completamente formateado en **Markdown (.md)** listo para copiar y pegar como tu `README.md`:

---

````md
# 🧾 Sistema de Gestión de Inventario

## 📝 Descripción

Este proyecto es una **aplicación web para la gestión de inventario de materia prima**, que permite:

- Registrar **entradas y salidas**.  
- Consultar el **stock actualizado**.  
- Generar **alertas por niveles críticos**.  
- Visualizar **reportes estadísticos**.  

Incluye un **frontend moderno** y un **backend Node.js** que actúa como **proxy hacia una API externa**.

---

## ⚙️ Instalación y Ejecución

### 🧩 Requisitos
- **Docker** y **Docker Compose**  
- *(Opcional)* **Node.js >= 18** si deseas ejecutar el backend manualmente

---

### 🚀 Ejecución con Docker

1. Clona el repositorio y entra en la carpeta principal:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Aplicaci-nWeb
````

2. Levanta los servicios (frontend y backend proxy):

   ```bash
   docker-compose up --build
   ```

3. Accede a las aplicaciones:

   * **Frontend:** [http://localhost:9500](http://localhost:9500)
   * **Backend Node.js (proxy):** [http://localhost:3000](http://localhost:3000)

---

### 💻 Ejecución manual del backend

1. Instala dependencias:

   ```bash
   cd node-server
   npm install
   ```

2. Inicia el servidor:

   ```bash
   npm start
   ```

---

## 🌟 Funcionalidades principales

* 📦 **Registro de inventario:** Entradas y salidas de materia prima con actualización automática de stock.
* ⚠️ **Alertas:** Notificación visual y por botón cuando el stock es crítico.
* 📊 **Reportes:** Dashboard con gráficos estadísticos y exportación a PDF.
* 🔍 **Inventario de productos:** Consulta y búsqueda de productos con paginación.
* 🗓 **Gestión de seminarios:** Ejemplo de CRUD para eventos/seminarios.
* 🌐 **Proxy backend:** El servidor Node.js reenvía las peticiones a la API externa y expone endpoints REST.

---

## 🔗 Endpoints principales del backend

El backend proxy (`node-server/server.js`) expone rutas como:

| Método   | Endpoint                             | Descripción              |
| -------- | ------------------------------------ | ------------------------ |
| `GET`    | `/api/seminario/materiaprima`        | Lista de materias primas |
| `POST`   | `/api/seminario/entradamateriaprima` | Registrar entrada        |
| `POST`   | `/api/seminario/salidamateriaprima`  | Registrar salida         |
| `PUT`    | `/api/seminario/materiaprima`        | Actualizar stock         |
| `DELETE` | `/api/seminario/materiaprima/:id`    | Eliminar materia prima   |

---

## 🧪 Pruebas y calidad

* Configuración de pruebas con **Jest** (`workspaces/Aplicaci-nWeb/jest.config.js`)
* Integración continua con **SonarCloud** (`.github/workflows/sonarcloud.yml`)

---

## 👥 Créditos

**Desarrolladores:**

* Jhonny Diaz
* Estiven Hurtado
* Kevin Gilon
* Smina
* Jriano

📚 Proyecto académico para la **gestión de inventario de materia prima**.

---

```

¿Quieres que le agregue también **badges** (Docker, Node.js, Angular, SonarCloud, etc.) y una sección de **capturas o GIFs** del proyecto para que quede más visual en GitHub?
```
