# 🗞️ ApiNewsFrontend - Plataforma de Noticias

Proyecto Angular 18+ que consume una API completa de noticias. Frontend moderno con autenticación JWT, gestión de noticias, administración de usuarios y más.

**Lenguaje**: 🇪🇸 Español | **Diseño**: Minimalista Japonés | **Endpoints**: 40+

---

## 📋 Características

- ✅ **Autenticación JWT**: Login/Register con tokens
- ✅ **Gestión de Noticias**: Crear, leer, actualizar, eliminar noticias
- ✅ **Filtrado**: Por categoría y estado
- ✅ **Panel Admin**: Gestión de categorías, estados, usuarios y perfiles
- ✅ **Responsive**: Diseño adaptable para móvil, tablet y desktop
- ✅ **Tema Claro/Oscuro**: Con detección automática del sistema
- ✅ **Interfaz en Español**: Todos los textos traducidos
- ✅ **Proxy Configurado**: Para desarrollo sin CORS

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm 9+
- Backend en `http://localhost:3000`

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Verificar setup
npm run verify

# 3. Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [EXECUTION_GUIDE.md](./EXECUTION_GUIDE.md) | Guía paso a paso de ejecución |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Solución de problemas comunes |
| [CHANGES.md](./CHANGES.md) | Listado completo de cambios |
| [README_FRONTEND.md](./README_FRONTEND.md) | Especificaciones técnicas |
| [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) | Checklist de verificación |

---

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/           # Protección de rutas
│   │   ├── models/           # Interfaces TypeScript
│   │   └── services/         # Servicios HTTP
│   ├── features/             # Componentes por feature
│   │   ├── admin/           # Panel administrativo
│   │   ├── auth/            # Login/Register
│   │   └── dashboard/       # Dashboard de usuario
│   ├── components/           # Componentes compartidos
│   ├── services/             # Servicios locales
│   └── shared/              # Componentes reutilizables
├── styles.global.css         # Diseño completo
└── main.ts                   # Entry point
```

---

## 🔌 Endpoints Consumidos

**Públicos:**
- `GET /api/news` - Obtener todas las noticias
- `GET /api/categories` - Obtener categorías
- `GET /api/states` - Obtener estados
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

**Protegidos (Usuario):**
- `GET /api/news/:id` - Detalle de noticia
- `POST /api/news` - Crear noticia
- `PUT /api/news/:id` - Actualizar noticia
- `DELETE /api/news/:id` - Eliminar noticia
- `GET /api/profile` - Perfil de usuario

**Administrativos:**
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/categories` - Gestionar categorías
- Y más... (ver documentación completa)

---

## 🎨 Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Primario | `#C84C4C` | Botones, enlaces |
| Oscuro | `#2E2E2E` | Texto principal |
| Gris claro | `#6B6B6B` | Texto secundario |
| Fondo | `#F9F9F9` | Fondo claro |
| Oscuro (tema) | `#1A1A1A` | Fondo oscuro |

---

## 🛠️ Desarrollo

### Comandos disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar pruebas unitarias
npm run test

# Linting del código
npm run lint

# Generar componente
ng generate component nombre
```

---

## 🔍 Debugging

### Verificar conexión con backend

1. Abre **DevTools** (F12)
2. Ve a la pestaña **Network**
3. Recarga la página
4. Busca requests a `/api/*`
5. Verifica que el estado sea `200 OK`

### Verificar proxy

El archivo `proxy.conf.json` debe contener:
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

---

## ⚠️ Problemas Comunes

### Error: `/api/news 404 Not Found`
**Solución**: El backend no está corriendo. Inicia el backend en `http://localhost:3000`

### Error: `Status 200 but ok: false`
**Solución**: Verifica que el backend devuelve `{success: true, data: [...]}`

### CORS Error
**Solución**: Usa el proxy configurado en `proxy.conf.json`

Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para más detalles.

---

## 👨‍💻 Desarrollo Servidor

Para iniciar un servidor local de desarrollo, corre:

```bash
ng serve
```

La aplicación recargará automáticamente cuando modifiques archivos.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
