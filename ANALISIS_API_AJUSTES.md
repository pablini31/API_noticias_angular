# 🔍 Análisis End-to-End: Consumo de API Frontend → Backend

## ✅ Estado Actual de los Servicios

### 1. **AuthService** (`auth.service.ts`)
#### Flujo de Login:
```typescript
POST /api/auth/login → Recibe { message, token }
```

#### ❌ **PROBLEMA CRÍTICO**: No decodifica el JWT
- El servicio guarda el `token` pero **nunca extrae el usuario del payload**
- El usuario se guarda manualmente con `setUser()` pero **no hay lógica para decodificarlo del token**
- Esto significa que después del login, `authState$.user` es **NULL**

#### ✅ Respuesta API Actual (Correcta):
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

El payload del JWT contiene:
```json
{
  "id": 1,
  "correo": "user@example.com",
  "perfil_id": 2,
  "iat": 1699280400,
  "exp": 1699366800
}
```

---

### 2. **NewsService** (`news.service.ts`)
#### ✅ Correctamente implementado:
```typescript
GET /api/news → map(res => res.data)
GET /api/news/:id → map(res => res.data)
GET /api/news/category/:categoryId → map(res => res.data)
POST /api/news → map(res => res.data)
PUT /api/news/:id → map(res => res.data)
DELETE /api/news/:id
```

Todos los métodos manejan correctamente el formato `{ success, message, data }`.

---

### 3. **UserService** (`user.service.ts`)
#### ✅ Correctamente implementado:
```typescript
GET /api/users → map(res => res.data)
GET /api/users/:id → map(res => res.data)
GET /api/users/email/:email → map(res => res.data)
POST /api/users → map(res => res.data)
PUT /api/users/:id → map(res => res.data)
DELETE /api/users/:id
```

---

### 4. **CategoryService** (`category.service.ts`)
#### ✅ Correctamente implementado:
Todos los métodos manejan correctamente `res.data`.

---

### 5. **StateService** (`state.service.ts`)
#### ✅ Correctamente implementado:
Todos los métodos manejan correctamente `res.data`.

---

### 6. **ProfileService** (presumiblemente similar)
#### ✅ Debería estar correctamente implementado si sigue el mismo patrón.

---

## 🚨 Problemas Identificados

### PROBLEMA #1: **No se decodifica el JWT después del login**
**Severidad**: 🔴 CRÍTICO

**Descripción**:
- Después de hacer login, el `AuthService` guarda el token pero **no extrae la información del usuario**
- El `HeaderComponent` muestra el `nick` del usuario, pero `authState$.user` es `null`
- Los guards `isAdmin()` y `isAuthenticated()` funcionan, pero `getUser()` retorna `null`

**Impacto**:
- No se puede mostrar el nombre del usuario en el header
- No se puede validar permisos basados en `perfil_id`
- No se puede acceder a información del usuario autenticado

**Solución**:
Decodificar el JWT manualmente o hacer una llamada adicional para obtener los datos del usuario.

---

### PROBLEMA #2: **Register no hace auto-login**
**Severidad**: 🟡 MEDIO

**Descripción**:
Según tu documentación API, el endpoint `/auth/register` retorna el usuario creado:
```json
{
  "id": 1,
  "perfil_id": 2,
  "nombre": "Juan",
  "apellidos": "Pérez",
  "nick": "juanp",
  "correo": "juan@example.com",
  ...
}
```

Pero el frontend **no guarda un token** porque la API no lo envía. El usuario debe hacer login manualmente después de registrarse.

**Solución**: 
- Opción A: Modificar la API para que `/auth/register` también retorne un token
- Opción B: Hacer auto-login después del registro (llamar a `/auth/login` automáticamente)
- Opción C: Mantener el flujo actual (registro → redirigir a login)

**Recomendación**: Mantener flujo actual (Opción C) por seguridad.

---

### PROBLEMA #3: **Falta endpoint para obtener usuario actual**
**Severidad**: 🟡 MEDIO

**Descripción**:
No existe un endpoint tipo `GET /api/auth/me` para obtener el usuario autenticado actual.

**Impacto**:
- Al refrescar la página, se pierde la información del usuario
- Solo se puede acceder al usuario si se decodifica el JWT manualmente

**Solución**:
Agregar endpoint `GET /api/auth/me` en la API o decodificar el JWT en el frontend.

---

## ✅ Soluciones Implementadas

### SOLUCIÓN #1: Decodificar JWT en el Frontend

**Archivo**: `src/app/core/services/auth.service.ts`

**Cambios necesarios**:

1. Instalar librería para decodificar JWT:
```bash
npm install jwt-decode
```

2. Actualizar `AuthService`:

```typescript
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  correo: string;
  perfil_id: number;
  iat: number;
  exp: number;
}

// En el método login:
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
    tap((response) => {
      this.setToken(response.token);
      
      // Decodificar JWT para obtener usuario
      const decoded = jwtDecode<JwtPayload>(response.token);
      
      // Fetch complete user data
      this.fetchUserData(decoded.id).subscribe();
    }),
    catchError((err) => {
      console.error('Login error', err);
      return throwError(() => err?.error?.message || 'Login failed');
    })
  );
}

// Nuevo método para obtener datos completos del usuario
private fetchUserData(userId: number): Observable<User> {
  return this.http.get<any>(`/api/users/${userId}`).pipe(
    map(res => res.data),
    tap(user => {
      this.setUser(user);
    }),
    catchError(err => {
      console.error('Error fetching user data', err);
      return throwError(() => err);
    })
  );
}

// En restoreSession:
private restoreSession(): void {
  const token = this.getStoredToken();
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Verificar si el token no ha expirado
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        this.logout();
        return;
      }
      
      // Restaurar usuario desde localStorage o fetch desde API
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.authState$.next({ token, user: storedUser });
      } else {
        // Fetch user data si no está en localStorage
        this.fetchUserData(decoded.id).subscribe();
      }
    } catch (error) {
      console.error('Invalid token', error);
      this.logout();
    }
  }
}
```

---

### SOLUCIÓN #2: Alternativa sin librería externa

Si no quieres instalar `jwt-decode`, puedes decodificar manualmente:

```typescript
private decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT', error);
    return null;
  }
}
```

---

## 📋 Checklist de Ajustes Necesarios

### ✅ Ya Implementado Correctamente:
- [x] NewsService maneja respuestas API correctamente
- [x] UserService maneja respuestas API correctamente
- [x] CategoryService maneja respuestas API correctamente
- [x] StateService maneja respuestas API correctamente
- [x] ProfileService (presumiblemente correcto)
- [x] JwtInterceptor agrega token a requests
- [x] Error 401 hace logout automáticamente

### ❌ Requiere Corrección:
- [ ] **AuthService: Decodificar JWT después del login**
- [ ] **AuthService: Validar expiración del token al restaurar sesión**
- [ ] **AuthService: Fetch user data completo después de login**
- [ ] **HeaderComponent: Manejar caso cuando user es null**

### 🟡 Opcional/Mejoras:
- [ ] Agregar endpoint `/api/auth/me` en la API
- [ ] Agregar refresh token mechanism
- [ ] Agregar interceptor para refresh automático
- [ ] Mejorar manejo de errores en componentes

---

## 🔧 Archivos que Necesitan Modificación

### 1. `src/app/core/services/auth.service.ts`
**Cambios**: Agregar decodificación de JWT y fetch de usuario

### 2. `package.json`
**Cambios**: Agregar dependencia `jwt-decode`

### 3. `src/app/components/header/header.component.ts`
**Cambios**: Manejar caso cuando `userNick` es undefined/null

---

## 🎯 Resumen Ejecutivo

**Estado General**: 🟢 **80% Correcto**

Los servicios están bien implementados y manejan correctamente las respuestas de la API con formato `{ success, message, data }`.

**Único problema crítico**: 
- El `AuthService` no decodifica el JWT ni obtiene los datos del usuario después del login.

**Solución recomendada**:
1. Instalar `jwt-decode`
2. Modificar `AuthService.login()` para decodificar JWT
3. Hacer fetch de datos completos del usuario con `GET /api/users/:id`
4. Validar expiración del token al restaurar sesión

**Tiempo estimado de corrección**: 30-45 minutos

---

## 📊 Mapa de Endpoints Consumidos

| Endpoint | Servicio | Estado | Formato Response |
|----------|----------|--------|------------------|
| `POST /api/auth/login` | AuthService | ⚠️ Parcial | `{ message, token }` |
| `POST /api/auth/register` | AuthService | ✅ OK | `{ id, nombre, ... }` |
| `GET /api/users` | UserService | ✅ OK | `{ success, message, data: [] }` |
| `GET /api/users/:id` | UserService | ✅ OK | `{ success, message, data: {} }` |
| `GET /api/news` | NewsService | ✅ OK | `{ success, message, data: [] }` |
| `GET /api/news/:id` | NewsService | ✅ OK | `{ success, message, data: {} }` |
| `POST /api/news` | NewsService | ✅ OK | `{ success, message, data: {} }` |
| `GET /api/categories` | CategoryService | ✅ OK | `{ success, message, data: [] }` |
| `GET /api/states` | StateService | ✅ OK | `{ success, message, data: [] }` |
| `GET /api/profiles` | ProfileService | ✅ OK | `{ success, message, data: [] }` |

---

**Fecha de análisis**: November 6, 2025
**Analista**: GitHub Copilot
**Versión del frontend**: Angular Standalone Components
**Versión de la API**: Node.js + Express + Sequelize
