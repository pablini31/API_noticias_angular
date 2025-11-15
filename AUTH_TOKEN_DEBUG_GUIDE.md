# 🔐 Guía de Debugging del Token de Autenticación

## Resumen del Problema

Tu aplicación Angular recibe errores **401 (Unauthorized)** cuando intenta:
- Agregar un favorito
- Crear un comentario

La causa es que **el token JWT no se está adjuntando a las peticiones HTTP**.

---

## 📋 Checklist de Diagnóstico

### 1️⃣ Verificar si el Token se Guarda tras el Login

**Pasos:**
1. Accede a la página de diagnóstico: `http://localhost:4200/diagnostic`
2. Mira la sección "Authentication Status"
3. Revisa los valores:
   - ✅ `Is Authenticated`: Debe ser **true**
   - ✅ `Token Exists`: Debe ser **true**
   - ✅ `Tokens Match`: Debe ser **true** (token en memoria === token en localStorage)

**Si todo es false:**
- El login no está guardando el token correctamente
- Ve a la consola del navegador y busca los logs del login
- Mira específicamente las líneas que dicen "Setting Token"

---

### 2️⃣ Verificar que el Token es Válido

En la página de diagnóstico, mira:
- `Token Valid`: Debe ser **true**
- `Token Expired`: Debe ser **false**
- `Expires In (seconds)`: Debe ser un número positivo (segundos restantes)

**Si el token ha expirado:**
- Necesitas volver a hacer login

**Si el token no es válido:**
- El formato del token no es correcto
- Revisa en "Decoded JWT Token" si la estructura es correcta

---

### 3️⃣ Verificar que el Usuario se Cargó Correctamente

En "Current User", deberías ver:
- `User ID`
- `Name`
- `Email`
- `Profile ID`

Si todo dice "No user logged in", entonces el usuario no se recuperó de la API.

---

### 4️⃣ Verificar que el JWT Interceptor Está Trabajando

1. Abre la consola del navegador (F12 → Console)
2. En la página de diagnóstico, haz clic en "🧪 Test API Call"
3. Mira los logs en la consola

**Deberías ver:**
```
🔐 JWT Interceptor - GET /api/profile
Is API request: true
Token exists: true
Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
✅ Token attached successfully
Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...
```

**Si vez:**
```
⚠️ NO TOKEN AVAILABLE - Request will likely fail with 401
```

Entonces el token no está disponible cuando se hace la petición.

---

## 🔧 Soluciones Comunes

### Problema: El token no se guarda tras el login

**Síntomas:**
- `Is Authenticated: false` en la página de diagnóstico
- `Token Exists: false`

**Soluciones:**

1. **Verifica que localStorage está disponible**
   - En la consola, escribe: `localStorage.getItem('auth_token')`
   - Debería retornar el token (un string largo que comienza con `eyJ`)
   - Si retorna `null`, el token no se guardó

2. **Revisa los logs del login en la consola**
   - Busca logs que digan: `🔐 LOGIN PROCESS STARTED`
   - Sigue la secuencia de logs para ver dónde se detiene

3. **Verifica que el servidor retorna un token válido**
   - Busca el log: `Login successful, received token`
   - Si no lo ves, el login falló en el servidor

### Problema: El token está expirado

**Síntomas:**
- `Token Expired: true` en la página de diagnóstico
- `Expires In (seconds): -XXXXX` (número negativo)

**Solución:**
- Vuelve a hacer login para obtener un token nuevo

### Problema: El interceptor no está adjuntando el token

**Síntomas:**
- Al hacer clic en "🧪 Test API Call", ves: `⚠️ NO TOKEN AVAILABLE`
- Pero el token existe en localStorage

**Causas posibles:**

1. **El token no se recupera del localStorage**
   - En la consola, escribe: `localStorage.getItem('auth_token')`
   - Si retorna el token, pero el interceptor no lo ve, hay un problema de sincronización

2. **El AuthService.getToken() no está funcionando correctamente**
   - Abre la consola y ejecuta:
     ```javascript
     // Inyecta AuthService si es posible
     ng.probe(document.querySelector('app-root')).injector.get(AuthService).getToken()
     ```

---

## 📊 Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario entra credenciales y hace click en "Iniciar sesión" │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌─────────────────────────────────────┐
        │ AuthService.login() enviado          │
        │ POST /api/auth/login                 │
        │ {correo, contraseña}                 │
        └────────────────────┬────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │ Servidor retorna token JWT + datos   │
        │ {token: "eyJ...", ...}               │
        └────────────────────┬────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │ setToken() guarda en localStorage     │
        │ localStorage['auth_token'] = token   │
        │ authState$.next({token, user})       │
        └────────────────────┬────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │ Usuario ahora está autenticado       │
        │ ✓ isAuthenticated() retorna true     │
        └─────────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │ Usuario intenta agregar un favorito   │
        │ favoriteService.addFavorite()         │
        │ POST /api/users/3/favorites/1        │
        └────────────────────┬────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │ HTTP Interceptor intercepta petición │
        │ Lee token con getToken()              │
        │ Adjunta: "Authorization: Bearer ..." │
        └────────────────────┬────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │ Servidor recibe petición con token    │
        │ Verifica token y procesa petición     │
        │ Retorna 200 (éxito) o error          │
        └─────────────────────────────────────┘
```

---

## 🐛 Paso a Paso: Debug Manual

### En la Consola del Navegador (F12 → Console):

1. **Verificar token en localStorage:**
   ```javascript
   localStorage.getItem('auth_token')
   ```
   - Debe retornar un string que comienza con `eyJ`

2. **Verificar token en memoria:**
   ```javascript
   // Solo funciona si tienes acceso a AuthService
   // Desde Components, usa el injection token
   ```

3. **Simular una petición con token:**
   ```javascript
   fetch('/api/profile', {
     headers: {
       'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
     }
   })
   .then(r => r.json())
   .then(data => console.log('Éxito:', data))
   .catch(err => console.error('Error:', err))
   ```

   - Si retorna datos del usuario: ✅ El servidor acepta el token
   - Si retorna 401: ❌ El servidor rechaza el token

---

## 📝 Cambios Realizados en tu Código

Para ayudarte a diagnosticar el problema, hemos mejorado:

### 1. **JWT Interceptor** (`jwt.interceptor.ts`)
- ✅ Logs más detallados para cada petición
- ✅ Muestra si el token se adjunta correctamente
- ✅ Registra errores 401 específicamente

### 2. **Auth Service** (`auth.service.ts`)
- ✅ Logs detallados en `setToken()`
- ✅ Logs detallados en `getToken()`
- ✅ Logs detallados en `login()`
- ✅ Logs detallados en `restoreSession()`
- ✅ Recuperación de token desde localStorage si hay desincronización

### 3. **Diagnostic Service** (`diagnostic.service.ts`)
- ✅ Nueva función `getAuthDiagnostics()` que retorna:
  - Estado de autenticación
  - Detalles del token
  - Información del usuario
  - Estado de localStorage

### 4. **Auth Diagnostic Component** (nuevo)
- ✅ Página visual en `/diagnostic` para ver el estado completo
- ✅ Botón para hacer test de API
- ✅ Botón para refrescar diagnósticos

---

## 🚀 Próximos Pasos

1. **Accede a la página de diagnóstico:**
   ```
   http://localhost:4200/diagnostic
   ```

2. **Haz login si no estás autenticado**

3. **Revisa los datos mostrados:**
   - ¿Está autenticado?
   - ¿Token existe?
   - ¿Token válido?
   - ¿Usuario cargado?

4. **Haz clic en "🧪 Test API Call"**
   - Abre la consola
   - ¿Se adjunta el token?
   - ¿La petición es exitosa?

5. **Basándote en los resultados:**
   - Si todo parece correcto, vuelve a la página de noticias
   - Intenta agregar un comentario o favorito
   - Abre la consola (F12)
   - Busca los logs del interceptor
   - Revisa si ves `⚠️ NO TOKEN AVAILABLE`

---

## 📞 Si Necesitas Más Ayuda

**Captura de pantalla útil:**
1. La página de diagnóstico (`/diagnostic`)
2. Los logs de la consola al hacer login
3. Los logs de la consola al intentar agregar un favorito/comentario

Proporciona estos datos y podremos identificar exactamente dónde está el problema.

---

## 🔗 Referencias Técnicas

- **JWT Interceptor:** `src/app/core/services/jwt.interceptor.ts`
- **Auth Service:** `src/app/core/services/auth.service.ts`
- **Diagnostic Service:** `src/app/core/services/diagnostic.service.ts`
- **Diagnostic Component:** `src/app/features/auth-diagnostic/auth-diagnostic.component.ts`
- **App Routes:** `src/app/app.routes.ts`

---

**Última actualización:** November 6, 2025
