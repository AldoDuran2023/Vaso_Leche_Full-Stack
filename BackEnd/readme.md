## Instalación

### 1. Crear un entorno virtual para Python

```bash
python -m venv venv
```

### 2. Activar el entorno virtual

- En Windows:

```bash
venv\Scripts\activate
```

- En macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Instalar las dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar las variables de entorno

Copiar el archivo `.env.example` como `.env` y modificar los parámetros según la configuración deseada.

```bash
cp .env.example .env
```

Editar el archivo `.env` con los valores correspondientes, como las credenciales de la base de datos.

### 5. Ejecutar el servidor

```bash
python app.py
```

---
