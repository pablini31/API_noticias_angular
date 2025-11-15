# 🧪 GUÍA DE TESTING - Frontend Corregido

## ⚡ Testing Rápido (15 minutos)

### 1️⃣ Iniciar Aplicación
```powershell
# Terminal 1: Frontend
cd C:\code\WEB\angular\api_news_frontend
npm start
# Abre: http://localhost:4200

# Terminal 2: Backend (si no está corriendo)
cd C:\code\WEB\angular\api_news_backend
npm start
# Corre en: http://localhost:3000
```

---

## 👤 TESTS DE USUARIO CONTRIBUTOR

### Test 1: Crear Noticia ✅
1. Login como contributor: `jhon@gmail.com` / `123456`
2. Navegar a **Dashboard > Crear Noticia**
3. Llenar formulario:
   - Título: "Prueba API Compatible"
   - Contenido: "Este es el contenido de prueba con más de 10 caracteres"
   - Categoría: Seleccionar cualquiera
   - Estado: Seleccionar cualquiera
   - Imagen: Dejar vacío o agregar URL
4. Click **Crear Noticia**
5. **Verificar:** Redirección a `/dashboard/my-news`
6. **Verificar:** Noticia aparece en la lista

**✅ Esperado:** 
- Sin errores de consola
- Noticia creada correctamente
- Payload enviado: `{titulo, descripcion, categoria_id, estado_id, fecha_publicacion, imagen?}`

---

### Test 2: Ver Mis Noticias ✅
1. En **Dashboard > Mis Noticias**
2. **Verificar:** Solo aparecen noticias del usuario actual
3. **Verificar:** Contador correcto: "Total: X artículos"
4. **Verificar:** Botones "Editar" y "Eliminar" presentes

**✅ Esperado:**
- Filtrado correcto por `usuario_id`
- Cards con categoría y estado
- Botones funcionales

---

### Test 3: Eliminar Noticia ✅
1. Click en **Eliminar** de cualquier noticia
2. Confirmar en el diálogo
3. **Verificar:** Noticia desaparece de la lista
4. **Verificar:** Toast de éxito

**✅ Esperado:**
- DELETE /api/news/:id enviado
- Noticia eliminada (soft delete)
- Lista actualizada

---

### Test 4: Ver Detalle de Noticia 🆕
1. Click en cualquier noticia de la lista principal
2. **Verificar:** Muestra título, contenido, autor, fecha
3. **Verificar:** Botón "Agregar a Favoritos" visible
4. **Verificar:** Sección de comentarios visible
5. **Verificar:** Formulario de comentario disponible (si autenticado)

**✅ Esperado:**
- Ruta: `/news/:id`
- Todo el contenido se carga
- UI responsive

---

## 👨‍💼 TESTS DE USUARIO ADMIN

### Test 5: Gestión de Noticias (Admin) ✅
1. Login como admin
2. Navegar a **Admin > Gestión de Noticias**
3. **Verificar:** Tabla con TODAS las noticias del sistema
4. **Verificar:** Filtros funcionan:
   - Buscar por título
   - Filtrar por categoría
   - Filtrar por estado

**✅ Esperado:**
- GET /api/news retorna todas las noticias
- Tabla con columnas: ID, Título, Categoría, Estado, Autor, Fecha, Visitas, Acciones

---

### Test 6: Editar Noticia (Admin) ✅
1. En **Gestión de Noticias**, click **Editar** (✏️) en cualquier noticia
2. **Verificar:** Modal se abre con datos prellenados
3. Modificar campos:
   - Cambiar título
   - Cambiar estado de publicación: "Publicado"
   - Cambiar categoría o estado
4. Click **Guardar Cambios**
5. **Verificar:** Modal se cierra
6. **Verificar:** Tabla se actualiza

**✅ Esperado:**
- PUT /api/news/:id enviado correctamente
- Payload: `{titulo, descripcion, categoria_id, estado_id, estado_publicacion, imagen?, fecha_publicacion}`
- Noticia actualizada

---

### Test 7: Eliminar Noticia de Otro Usuario (Admin) ✅
1. En **Gestión de Noticias**, click **Eliminar** (🗑️)
2. Confirmar
3. **Verificar:** Noticia eliminada
4. **Verificar:** Tabla actualizada

**✅ Esperado:**
- Admin puede eliminar cualquier noticia
- DELETE /api/news/:id funciona

---

### Test 8: Gestión de Usuarios (Admin) ✅
1. Navegar a **Admin > Gestión de Usuarios**
2. Click **+ Nuevo Usuario**
3. Llenar formulario:
   - Nombre: "Test"
   - Apellidos: "Usuario"
   - Nick: "testusr"
   - Correo: "test@test.com"
   - Contraseña: "12345678"
   - Perfil: "Contribuidor"
4. Click **Crear Usuario**
5. **Verificar:** Usuario aparece en tabla

**✅ Esperado:**
- POST /api/users enviado
- Usuario creado
- Tabla actualizada

---

### Test 9: Eliminar Usuario (Admin) ✅
1. En tabla de usuarios, click **Eliminar**
2. Confirmar
3. **Verificar:** Usuario desaparece

**✅ Esperado:**
- DELETE /api/users/:id
- Soft delete (activo = false)

---

### Test 10: Gestión de Categorías (Admin) ✅
1. Navegar a **Admin > Gestión de Categorías**
2. Click **Crear Categoría**
3. Llenar:
   - Nombre: "Testing" (5-50 chars)
   - Descripción: "Categoría de prueba" (5-255 chars)
   - Activa: ✓
4. **Verificar:** Categoría creada
5. Editar categoría
6. Eliminar categoría

**✅ Esperado:**
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id
- Validaciones de longitud funcionan

---

### Test 11: Gestión de Estados (Admin) ✅
1. Navegar a **Admin > Gestión de Estados**
2. Click **Crear Estado**
3. Llenar:
   - Nombre: "Prueba" (2-50 chars)
   - Abreviación: "PR" (2-5 chars)
   - Activo: ✓
4. **Verificar:** Estado creado

**✅ Esperado:**
- POST /api/states
- Validaciones funcionan
- Solo deben existir 5 estados venezolanos en producción

---

## 🔍 TESTS DE VALIDACIÓN

### Test 12: Validaciones en Create-News ✅
1. Ir a **Crear Noticia**
2. Intentar enviar formulario vacío
3. **Verificar:** Errores de validación:
   - "Título requerido (mínimo 2 caracteres)"
   - "Contenido requerido (mínimo 10 caracteres)"
   - "Categoría requerida"
   - "Estado requerido"
4. Llenar correctamente
5. **Verificar:** Botón se habilita
6. Enviar

**✅ Esperado:**
- Validaciones client-side funcionan
- No se envía payload inválido
- Mensajes claros de error

---

### Test 13: Campo "contenido" Eliminado ✅✅✅
1. Inspeccionar formulario de **Crear Noticia**
2. **Verificar:** 
   - ❌ NO existe campo separado llamado "Contenido" adicional
   - ✅ Solo existe UN campo de texto grande llamado "Contenido del Artículo"
3. Abrir DevTools > Network
4. Crear noticia
5. Inspeccionar payload de POST /api/news
6. **Verificar:**
   ```json
   {
     "titulo": "...",
     "descripcion": "...",  // ✅ Campo único, NO "contenido"
     "categoria_id": 1,
     "estado_id": 1,
     "fecha_publicacion": "2025-11-06T...",
     "imagen": "..."
   }
   ```
7. **Verificar:** NO aparece campo `contenido` en payload
8. **Verificar:** NO se concatenan dos campos

**✅ CRÍTICO:** Debe enviar SOLO `descripcion`, NUNCA `contenido`

---

## 🚫 TESTS DE PERMISOS

### Test 14: Contributor NO Puede Acceder a Admin ✅
1. Login como contributor
2. Intentar navegar a `/admin/news-management`
3. **Verificar:** Redirección o error 403
4. **Verificar:** No ve menú de administración

**✅ Esperado:**
- Guards bloquean acceso
- Solo admin puede entrar

---

### Test 15: Contributor Solo Ve Sus Noticias ✅
1. Login como contributor
2. Ir a **Mis Noticias**
3. **Verificar:** Solo aparecen noticias con `usuario_id` del usuario actual
4. **Verificar:** NO aparecen noticias de otros usuarios

**✅ Esperado:**
- Filtro: `news.filter(n => n.usuario_id === currentUser.id)`
- Sin acceso a noticias ajenas

---

## 📱 TESTS DE INTERFAZ

### Test 16: Responsive Design ✅
1. Abrir DevTools (F12)
2. Cambiar a vista móvil (Ctrl + Shift + M)
3. Navegar por todas las páginas:
   - Home
   - Dashboard
   - Admin panels
   - News detail
4. **Verificar:** Todo se ve bien en mobile

**✅ Esperado:**
- Grid se adapta
- Botones apilados verticalmente
- Sin overflow horizontal

---

### Test 17: Loading States ✅
1. Abrir DevTools > Network
2. Throttle a "Slow 3G"
3. Navegar entre páginas
4. **Verificar:** Aparecen indicadores de carga:
   - "Cargando noticias..."
   - Spinners
   - Estados vacíos

**✅ Esperado:**
- Feedback visual mientras carga
- No pantallas en blanco

---

## 🔥 TESTS DE ERRORES

### Test 18: Error Handling ✅
1. Detener el backend (Ctrl+C)
2. Intentar crear noticia
3. **Verificar:** Mensaje de error amigable
4. **Verificar:** No crash de aplicación

**✅ Esperado:**
- try/catch funciona
- Alerts o toasts informativos
- App no se rompe

---

### Test 19: Token Expirado 🔒
1. Login normalmente
2. Editar localStorage y cambiar token a uno inválido
3. Intentar crear noticia
4. **Verificar:** Error 401
5. **Verificar:** Redirección a login

**✅ Esperado:**
- Interceptor detecta 401
- Logout automático
- Redirección correcta

---

## 📋 CHECKLIST FINAL

### Funcionalidad Core
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Crear noticia SIN error de campo "contenido"
- [ ] Payload enviado coincide con API spec
- [ ] Mis noticias filtradas correctamente
- [ ] Editar propia noticia funciona
- [ ] Eliminar propia noticia funciona

### Admin Features
- [ ] Ver todas las noticias
- [ ] Editar cualquier noticia
- [ ] Eliminar cualquier noticia
- [ ] Crear usuarios
- [ ] Eliminar usuarios
- [ ] CRUD de categorías
- [ ] CRUD de estados

### UI/UX
- [ ] No errores en consola
- [ ] Loading states presentes
- [ ] Error messages claros
- [ ] Responsive design OK
- [ ] Navegación fluida

### API Compatibility
- [ ] Todos los endpoints usan rutas correctas
- [ ] Payloads coinciden con API spec
- [ ] Headers incluyen JWT
- [ ] Response handling correcto

---

## 🎯 TESTS PRIORITARIOS (5 minutos)

Si tienes poco tiempo, ejecuta estos 3 tests:

1. **Test 13** - Verificar campo "contenido" eliminado ⭐⭐⭐
2. **Test 1** - Crear noticia como contributor ⭐⭐
3. **Test 6** - Editar noticia como admin ⭐⭐

---

## 📊 REPORTE DE BUGS

Si encuentras errores, documenta:

```
BUG #X
Página: [URL]
Usuario: [admin/contributor]
Pasos:
1. ...
2. ...
3. ...
Error: [descripción]
Consola: [error de consola]
Network: [request/response]
```

---

## ✅ TESTS PASADOS

Al completar cada test, marca aquí:

- [x] Test 1: Crear noticia
- [x] Test 2: Ver mis noticias
- [ ] Test 3: Eliminar noticia
- [ ] Test 4: Ver detalle
- [ ] Test 5: Gestión de noticias (admin)
- [ ] Test 6: Editar noticia (admin)
- [ ] Test 7: Eliminar noticia ajena (admin)
- [ ] Test 8: Gestión de usuarios
- [ ] Test 9: Eliminar usuario
- [ ] Test 10: Gestión de categorías
- [ ] Test 11: Gestión de estados
- [ ] Test 12: Validaciones
- [ ] Test 13: Campo contenido eliminado ⭐
- [ ] Test 14: Permisos contributor
- [ ] Test 15: Filtro mis noticias
- [ ] Test 16: Responsive
- [ ] Test 17: Loading states
- [ ] Test 18: Error handling
- [ ] Test 19: Token expirado

---

*Happy Testing! 🚀*
