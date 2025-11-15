# 🧪 Checklist de Testing - Autenticación y Token

## Pre-Testing

- [ ] El servidor backend está corriendo (`npm start` en la carpeta del backend)
- [ ] El servidor frontend está corriendo (`npm start` en esta carpeta)
- [ ] Puedes acceder a http://localhost:4200

---

## Test 1: Estado de Autenticación Base

### Sin Autenticación

- [ ] Accede a http://localhost:4200 sin estar logueado
- [ ] Accede a http://localhost:4200/diagnostic
- [ ] Verifica que muestra:
  - `Is Authenticated: false`
  - `Token Exists: false`
  - `Current User: No user logged in`

**Resultado esperado:** Todos los valores deben estar vacíos/false

---

## Test 2: Login Exitoso

### Login

- [ ] Accede a http://localhost:4200/login
- [ ] Ingresa credenciales válidas
- [ ] Haz clic en "Iniciar sesión"
- [ ] Abre la consola (F12 → Console)
- [ ] Busca logs que contengan:
  - `🔐 LOGIN PROCESS STARTED`
  - `🔐 Setting Token`
  - `✅ Setting Token` (debe mostrar token preview y "Token stored: true")
  - `✅ Login process completed successfully`

**Resultado esperado:** El login es exitoso, ves los logs, y eres redirigido

---

## Test 3: Estado Post-Login

### Diagnóstico Post-Login

- [ ] Accede a http://localhost:4200/diagnostic
- [ ] Verifica que ahora muestra:
  - [ ] `Is Authenticated: true` ✅
  - [ ] `Token Exists: true` ✅
  - [ ] `Tokens Match: true` ✅ (memory === localStorage)
  - [ ] `Token Valid: true` ✅
  - [ ] `Token Expired: false` ✅
  - [ ] `Expires In (seconds): [número positivo]` ✅
  - [ ] `Current User: [datos del usuario]` ✅
  - [ ] Sección "Decoded JWT Token" muestra datos decodificados ✅

**Resultado esperado:** Todos los valores son correctos

---

## Test 4: Test de Petición HTTP

### Test API Call

- [ ] En la página de diagnóstico, haz clic en "🧪 Test API Call"
- [ ] Abre la consola (F12 → Console)
- [ ] Busca logs:
  - [ ] `🔐 JWT Interceptor - GET /api/profile` 
  - [ ] `Is API request: true`
  - [ ] `Token exists: true`
  - [ ] `✅ Token attached successfully`
  - [ ] `Authorization header: Bearer eyJ...`

**Resultado esperado:** El token se adjunta y la petición es exitosa

### Si la Petición Falla

- [ ] Verifica los logs en el panel de "API Test Result"
- [ ] ¿Dice error 401? → El servidor rechaza el token
- [ ] ¿Dice otra cosa? → Problema diferente

---

## Test 5: Agregar Favorito

### Agregando Favorito

- [ ] Accede a http://localhost:4200 (página de noticias)
- [ ] Haz clic en una noticia para ver el detalle
- [ ] Haz clic en el botón "❤️ Agregar a Favoritos" (o "🤍")
- [ ] Abre la consola (F12 → Console)
- [ ] Busca logs:
  - [ ] `🔐 JWT Interceptor - POST /api/users/[id]/favorites/[id]`
  - [ ] `Is API request: true`
  - [ ] `Token exists: true`
  - [ ] `✅ Token attached successfully`

**Resultado esperado:** 
- Sin error en la consola
- Botón cambia a "❤️ Favorito"
- Alert dice "Agregado a favoritos"

### Si Falla con 401

- [ ] Ve al diagnóstico (`/diagnostic`)
- [ ] ¿Is Authenticated = true? 
  - NO → Haz logout y login nuevamente
  - SÍ → Continúa al siguiente paso
- [ ] Haz clic en "🧪 Test API Call"
- [ ] ¿Ves "Token attached successfully"? 
  - NO → Problema en AuthService
  - SÍ → Problema en el backend

---

## Test 6: Crear Comentario

### Creando Comentario

- [ ] Accede a http://localhost:4200 (página de noticias)
- [ ] Haz clic en una noticia para ver el detalle
- [ ] Desplázate hasta la sección de comentarios
- [ ] Escribe un comentario en el textarea
- [ ] Haz clic en "Enviar Comentario"
- [ ] Abre la consola (F12 → Console)
- [ ] Busca logs:
  - [ ] `🔐 JWT Interceptor - POST /api/news/[id]/comments`
  - [ ] `Is API request: true`
  - [ ] `Token exists: true`
  - [ ] `✅ Token attached successfully`

**Resultado esperado:** 
- Sin error en la consola
- Alert dice "Comentario enviado. Pendiente de aprobación."
- El textarea se limpia

### Si Falla con 401

- [ ] Sigue el mismo troubleshooting que en el Test 5

---

## Test 7: Logout

### Logout

- [ ] Ve al diagnóstico (`/diagnostic`)
- [ ] Haz clic en "🚪 Logout"
- [ ] Confirma en el diálogo
- [ ] Verifica que ahora muestra:
  - [ ] `Is Authenticated: false`
  - [ ] `Token Exists: false`
  - [ ] `Current User: No user logged in`

**Resultado esperado:** El estado vuelve a "no autenticado"

---

## Test 8: Restauración de Sesión

### Session Recovery

- [ ] Accede a http://localhost:4200/diagnostic (estando logueado)
- [ ] Verifica estado (`Is Authenticated: true`)
- [ ] **Recarga la página** (F5 o Ctrl+R)
- [ ] Abre la consola
- [ ] Busca logs:
  - [ ] `🔄 Restoring session from localStorage`
  - [ ] `Token found: true`
  - [ ] `Token decoded successfully`
  - [ ] `Restoring auth state with stored user`
  - [ ] `✅ Session restored successfully`

- [ ] Verifica que sigue mostrando:
  - [ ] `Is Authenticated: true`
  - [ ] `Current User: [datos del usuario]`

**Resultado esperado:** La sesión se restaura automáticamente tras recargar

---

## Test 9: Token Expirado

### Simular Token Expirado

**Nota:** Este test requiere manipulación manual

- [ ] En la consola del navegador, ejecuta:
  ```javascript
  localStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzc2MjQwMDB9.fake')
  ```

- [ ] Accede a http://localhost:4200/diagnostic
- [ ] Verifica que muestra:
  - [ ] `Is Authenticated: false` (porque token expiró)
  - [ ] `Token Expired: true`

**Resultado esperado:** El sistema detecta automáticamente que el token expiró y hace logout

---

## Test 10: Navegación Protegida

### Acceso a Rutas Protegidas

- [ ] **Sin autenticación:**
  - [ ] Intenta acceder a http://localhost:4200/dashboard
  - [ ] Deberías ser redirigido a http://localhost:4200/login

- [ ] **Con autenticación:**
  - [ ] Haz login
  - [ ] Accede a http://localhost:4200/dashboard
  - [ ] Deberías ver el panel (no ser redirigido)

**Resultado esperado:** El AuthGuard funciona correctamente

---

## Test 11: Multi-Tab Sync (Opcional)

### Sincronización entre Tabs

- [ ] Abre dos tabs del navegador con http://localhost:4200
- [ ] En Tab 1, haz login
- [ ] En Tab 2, ve a http://localhost:4200/diagnostic
- [ ] Verifica que Tab 2 también muestra:
  - [ ] `Is Authenticated: true`
  - [ ] `Current User: [datos]`

**Resultado esperado:** Los cambios se reflejan en ambos tabs (localStorage es compartido)

---

## 🏁 Resumen de Testing

### ✅ Todo debería funcionar:

- [ ] Login exitoso
- [ ] Token se guarda en memory y localStorage
- [ ] Token se adjunta automáticamente a peticiones
- [ ] Agregar favoritos sin error 401
- [ ] Crear comentarios sin error 401
- [ ] Logout funciona
- [ ] Recargar página mantiene sesión
- [ ] Rutas protegidas están protegidas
- [ ] Sistema detecta token expirado

---

## 📋 Registro de Testing

**Fecha:** _________________

**Tester:** _________________

**Navegador:** _________________

**Backend:** ¿Está corriendo? SÍ / NO

**Frontend:** ¿Está corriendo? SÍ / NO

### Resultados:

| Test | Resultado | Notas |
|------|-----------|-------|
| 1. Estado base sin auth | ✅ / ❌ | _____________ |
| 2. Login exitoso | ✅ / ❌ | _____________ |
| 3. Estado post-login | ✅ / ❌ | _____________ |
| 4. Test HTTP | ✅ / ❌ | _____________ |
| 5. Agregar favorito | ✅ / ❌ | _____________ |
| 6. Crear comentario | ✅ / ❌ | _____________ |
| 7. Logout | ✅ / ❌ | _____________ |
| 8. Session recovery | ✅ / ❌ | _____________ |
| 9. Token expirado | ✅ / ❌ | _____________ |
| 10. Rutas protegidas | ✅ / ❌ | _____________ |
| 11. Multi-tab sync | ✅ / ❌ | _____________ |

---

## 🐛 Si Algo Falla

1. **Nota exactamente qué test falló**
2. **Abre la consola (F12 → Console)**
3. **Busca logs que comiencen con:** 🔐, ✅, ⚠️, ❌
4. **Copia los logs relevantes**
5. **Ve a la página de diagnóstico** y captura pantalla del estado actual
6. **Documenta y reporta**

---

## 🎯 Objetivo Final

Todos los tests deben pasar (✅). Si alguno falla (❌), el sistema te proporciona:
1. **Logs detallados** en la consola para debugging
2. **Página de diagnóstico** con estado visual
3. **Descripción clara** de qué salió mal

Con esta información, podremos identificar y solucionar rápidamente cualquier problema.

---

**Última actualización:** November 6, 2025
