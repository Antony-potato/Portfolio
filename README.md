# Mi Portafolio Profesional

Proyecto web personal construido con Astro, diseñado para mostrar proyectos, habilidades y trayectoria profesional de manera rápida, moderna y optimizada.

## Inicio Rápido

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

### 1. Clonar o descargar
Si ya lo subiste a GitHub, puedes clonarlo:
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd Portafolio
```

### 2. Instalar dependencias
Instala todas las dependencias necesarias de Node.js:
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
Ejecuta el servidor de desarrollo local para ver tus cambios en tiempo real:
```bash
npm run dev
```
El proyecto estará disponible en http://localhost:4321.

---

## Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build` | Compila el sitio de producción en `./dist/` |
| `npm run preview` | Previsualiza la compilación de producción localmente |
| `npm run astro` | Ejecuta comandos de la CLI de Astro |

---

## Cómo subir este proyecto a GitHub

Este proyecto ya está inicializado con Git y configurado con la rama por defecto `main`. Para subirlo a tu cuenta de GitHub, sigue estos pasos:

1. **Crea un nuevo repositorio en GitHub**:
   - Ve a github.com/new.
   - Nómbralo (por ejemplo, `Portafolio`).
   - Deja el repositorio vacío (no agregues README, .gitignore ni licencia, ya que este proyecto ya los tiene).

2. **Vincula tu repositorio local con GitHub**:
   En la terminal del proyecto, ejecuta el siguiente comando reemplazando con tu usuario y nombre de repositorio:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   ```

3. **Sube tus cambios**:
   Sube la rama `main` a GitHub:
   ```bash
   git push -u origin main
   ```

A partir de ese momento, cada vez que hagas cambios, solo tendrás que hacer:
```bash
git add .
git commit -m "Tus cambios"
git push
```
