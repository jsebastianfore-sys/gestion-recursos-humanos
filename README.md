# Sistema de Gestión de Recursos Humanos

Este proyecto consiste en un ecosistema web completo para el control de nómina y empleados. La arquitectura implementa un desacoplamiento total: un Backend robusto estructurado como una API RESTful utilizando Django y Django REST Framework, conectado a una base de datos relacional MySQL, y una interfaz de usuario interactiva (Frontend) desarrollada en React con Vite y estilizada mediante Bootstrap.

## Fases de Desarrollo

### Fase Inicial: Configuración del Entorno e Infraestructura Base
* **Backend:** Inicialización del proyecto bajo Python mediante entornos virtuales (`venv`). Configuración esencial en `settings.py` incluyendo los módulos externos de `corsheaders` y `rest_framework`. Se implementó el puente de compatibilidad de base de datos declarando `pymysql.install_as_MySQLdb()`.
* **Frontend:** Creación del andamiaje con Vite. Instalación de dependencias críticas mediante `npm install`, incorporando `axios` para la ejecución asíncrona de peticiones HTTP.

### Fase 1: Listado de Empleados (Lectura - GET)
* **Mecanismo:** Al montarse el componente de React, se despacha un hook `useEffect` encargado de disparar una petición asíncrona mediante un método `GET` hacia el endpoint local de la API (`/api/empleados/`).
* **Lógica Interna:** El servidor Django intercepta la petición, invoca el ORM de Python (`Empleado.objects.all()`), convierte las entidades de base de datos a formato JSON a través de `EmpleadoSerializer` y retorna una respuesta con código de estado `200 OK`. El Frontend recibe la colección y actualiza el hook de estado `setEmpleados` mapeándolo en una tabla dinámica.

### Fase 2: Registro de Empleados (Escritura - POST)
* **Mecanismo:** El usuario interactúa con un formulario controlado en React. Al presionar "Registrar Empleado", se ejecutan validaciones previas de sanidad en el cliente y se envía un objeto JSON estructurado mediante un método `POST`.
* **Validación Obvia pero Fundamental:** El motor de Django REST Framework aplica reglas restrictivas de validación dentro de `serializers.py`:
  1. `validate_nombre`: Impide la inserción de registros vacíos o compuestos únicamente por espacios en blanco a través del método `.strip()`. Valida que contenga una longitud mínima (`len(value) < 2`).
  2. `validate_sueldo`: Verifica mediante una sentencia de control que los valores monetarios sean positivos y mayores estrictos a cero (`value <= 0`).
* Al pasar los filtros, el backend retorna un código `201 Created` y añade el registro físico a MySQL.

### Fase 3: Modificación de Datos Existentes (Actualización - PUT/PATCH)
* **Mecanismo:** Al presionar el botón "Editar", React captura el objeto específico de la fila seleccionada y transfiere sus atributos temporales al formulario, mutando el estado para almacenar el `idEmpleado`.
* **Impacto en Base de Datos:** Al enviar los datos modificados, la aplicación despacha una petición `PUT` dirigida a la ruta parametrizada (`/api/empleados/{idEmpleado}/`). La API mapea la petición a través de `EmpleadoDetailView` (heredera de `RetrieveUpdateDestroyAPIView`), ejecutando la sobreescritura del método `update()` para retornar un mensaje de confirmación controlado con un estado `200 OK`.

### Fase 4: Eliminación de Registros (Borrado - DELETE)
* **Mecanismo:** La eliminación se acciona por medio de la captura unívoca del Identificador Primario (`idEmpleado`) del registro seleccionado en la interfaz. 
* **Discontinuidad Secuencial (Pilar del Desarrollo):** Un elemento de infraestructura crítico para documentar es que, al ejecutar la sentencia `DELETE`, MySQL elimina la fila física pero los índices autoincrementales (`AutoField`) mantienen la secuencia original. Esto significa que si se elimina el ID 3, el siguiente elemento creado poseerá el ID 4, generando un salto lógico que previene la colisión de llaves primarias en auditorías de sistemas relacionales. La API procesa el borrado en el backend y devuelve una respuesta controlada con código de estado `200 OK`.

---

## Bitácora de Errores Encontrados y Soluciones Aplicadas

Durante el proceso de desarrollo e integración de componentes se documentaron los siguientes incidentes técnicos críticos:

1. **Error de Indentación en Vistas de Django (`IndentationError`):**
   * *Descripción:* Inicialmente la clase `EmpleadoDetailView` se encontraba accidentalmente anidada dentro del margen de indentación de `EmpleadoListView`.
   * *Solución:* Se corrigieron los márgenes izquierdos en `views.py` abstrayéndola como una clase independiente a nivel de módulo.

2. **Lógica Inversa en Validaciones del Serializador:**
   * *Descripción:* La función `validate_nombre` descartaba erróneamente los nombres válidos largos debido al uso del condicional de longitud mayor que (`len(value) > 2`).
   * *Solución:* Se alteró la expresión relacional reemplazándola por el operador menor que (`< 2`) para garantizar la longitud mínima exigida.

3. **Restricción de Seguridad por Bloqueo de CORS:**
   * *Descripción:* Al intentar comunicar React (`puerto 5173`) con Django (`puerto 8000`), el navegador bloqueaba las llamadas por políticas de seguridad de origen cruzado.
   * *Solución:* Se instaló y configuró la librería `django-cors-headers` agregando explícitamente el origen del Frontend en el arreglo `CORS_ALLOWED_ORIGINS` de `settings.py`.
