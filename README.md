
# 🧾 Sistema de Gestión de Inventario
<img width="1915" height="922" alt="image" src="https://github.com/user-attachments/assets/d755fef4-bebd-4886-b96b-d379b8886d9b" />


## 📝 Descripción

Este proyecto es una **aplicación web para la gestión de inventario de materia prima**, que permite:

- Registrar **entradas y salidas**.
  <img width="1911" height="924" alt="image" src="https://github.com/user-attachments/assets/110d32a2-bf6b-4396-99f8-6643f4365599" />

- Consultar el **stock actualizado**.
 <img width="1900" height="592" alt="image" src="https://github.com/user-attachments/assets/86b14574-1fb3-4e5f-b2f3-4c31d3c64958" />
 
- Generar **alertas por niveles críticos**.
  <img width="353" height="274" alt="image" src="https://github.com/user-attachments/assets/81888f65-09fd-49c1-af35-db5d02ed9eea" />

- Visualizar **reportes estadísticos**.
  <img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/09a2d12b-45c8-4fed-bd7c-ad8792bcf62e" />


Incluye un **frontend moderno** y un **backend Node.js** que actúa como **proxy hacia una API externa en AWS**.

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
