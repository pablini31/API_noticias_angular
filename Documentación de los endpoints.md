# Documentación de los Endpoints

## Información General

PORT= 3000

**Base URL:** `http://localhost:{PORT}/api`

**Formato de Respuestas:** Todas las respuestas están en formato JSON.

**Autenticación:** Algunos endpoints requieren autenticación mediante token JWT. El token debe incluirse en el header de la petición:
```
Authorization: Bearer {token}
```

### Tipos de Usuarios
- **Admin (perfil_id: 1):** Acceso completo a todos los recursos.
- **Contributor (perfil_id: 2):** Puede crear y gestionar noticias propias.

---

## Autenticación

### Login
Permite a un usuario autenticarse en el sistema.

**Endpoint:** `POST /auth/login`

**Autenticación requerida:** No

**Request Body:**
```json
{
  "correo": "string (email válido)",
  "contraseña": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "string",
  "token": "string (JWT token)"
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Sin autorización"
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "errors": {
    "campo": {
      "msg": "string",
      "param": "string",
      "location": "string"
    }
  }
}
```

---

### Registro
Registra un nuevo usuario en el sistema como Contributor.

**Endpoint:** `POST /auth/register`

**Autenticación requerida:** No

**Request Body:**
```json
{
  "nombre": "string (2-100 caracteres)",
  "apellidos": "string (2-100 caracteres)",
  "nick": "string (2-20 caracteres)",
  "correo": "string (email válido, único)",
  "contraseña": "string (mínimo 8 caracteres)"
}
```

**Response (201 Created):**
```json
{
  "id": "number",
  "perfil_id": "number",
  "nombre": "string",
  "apellidos": "string",
  "nick": "string",
  "correo": "string",
  "activo": "boolean",
  "bio": "string | null",
  "avatar": "string | null",
  "verificado": "boolean",
  "ultima_actividad": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "errors": {
    "campo": {
      "msg": "string",
      "param": "string",
      "location": "string"
    }
  }
}
```

---

## Usuarios

### Obtener Todos los Usuarios
Obtiene la lista completa de usuarios.

**Endpoint:** `GET /users`

**Autenticación requerida:** Sí (Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuarios obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "perfil_id": "number",
      "nombre": "string",
      "apellidos": "string",
      "nick": "string",
      "correo": "string",
      "activo": "boolean",
      "bio": "string | null",
      "avatar": "string | null",
      "verificado": "boolean",
      "ultima_actividad": "string (ISO 8601) | null",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Usuario por ID
Obtiene un usuario específico por su ID.

**Endpoint:** `GET /users/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID del usuario (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuario obtenido correctamente",
  "data": {
    "id": "number",
    "perfil_id": "number",
    "nombre": "string",
    "apellidos": "string",
    "nick": "string",
    "correo": "string",
    "activo": "boolean",
    "bio": "string | null",
    "avatar": "string | null",
    "verificado": "boolean",
    "ultima_actividad": "string (ISO 8601) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### Obtener Usuario por Email
Obtiene un usuario específico por su correo electrónico.

**Endpoint:** `GET /users/email/:email`

**Autenticación requerida:** No

**Parámetros de URL:**
- `email` - Correo electrónico del usuario

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuario obtenido correctamente",
  "data": {
    "id": "number",
    "perfil_id": "number",
    "nombre": "string",
    "apellidos": "string",
    "nick": "string",
    "correo": "string",
    "activo": "boolean",
    "bio": "string | null",
    "avatar": "string | null",
    "verificado": "boolean",
    "ultima_actividad": "string (ISO 8601) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### Crear Usuario
Crea un nuevo usuario en el sistema.

**Endpoint:** `POST /users`

**Autenticación requerida:** Sí (Admin)

**Request Body:**
```json
{
  "nombre": "string (2-100 caracteres)",
  "apellidos": "string (2-100 caracteres)",
  "nick": "string (2-20 caracteres)",
  "correo": "string (email válido, único)",
  "contraseña": "string (mínimo 8 caracteres)",
  "perfil_id": "number (ID del perfil existente)",
  "activo": "boolean (opcional)",
  "bio": "string (opcional)",
  "avatar": "string (URL, opcional)",
  "verificado": "boolean (opcional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": "number",
    "perfil_id": "number",
    "nombre": "string",
    "apellidos": "string",
    "nick": "string",
    "correo": "string",
    "activo": "boolean",
    "bio": "string | null",
    "avatar": "string | null",
    "verificado": "boolean",
    "ultima_actividad": "string (ISO 8601) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Actualizar Usuario
Actualiza la información de un usuario existente.

**Endpoint:** `PUT /users/:id`

**Autenticación requerida:** Sí (Admin)

**Parámetros de URL:**
- `id` - ID del usuario (número entero)

**Request Body (todos los campos son opcionales):**
```json
{
  "nombre": "string (2-100 caracteres)",
  "apellidos": "string (2-100 caracteres)",
  "nick": "string (2-20 caracteres)",
  "contraseña": "string (mínimo 8 caracteres)",
  "perfil_id": "number (ID del perfil existente)",
  "activo": "boolean",
  "bio": "string",
  "avatar": "string (URL)",
  "verificado": "boolean"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuario actualizado correctamente",
  "data": {
    "id": "number",
    "perfil_id": "number",
    "nombre": "string",
    "apellidos": "string",
    "nick": "string",
    "correo": "string",
    "activo": "boolean",
    "bio": "string | null",
    "avatar": "string | null",
    "verificado": "boolean",
    "ultima_actividad": "string (ISO 8601) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### Eliminar Usuario
Elimina un usuario del sistema (soft delete, marca como inactivo).

**Endpoint:** `DELETE /users/:id`

**Autenticación requerida:** Sí (Admin)

**Parámetros de URL:**
- `id` - ID del usuario (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuario eliminado correctamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

## Noticias

### Obtener Todas las Noticias
Obtiene la lista completa de noticias.

**Endpoint:** `GET /news`

**Autenticación requerida:** No

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticias obtenidas correctamente",
  "data": [
    {
      "id": "number",
      "categoria_id": "number",
      "estado_id": "number",
      "usuario_id": "number",
      "titulo": "string",
      "slug": "string",
      "fecha_publicacion": "string (ISO 8601)",
      "descripcion": "string",
      "imagen": "string (base64)",
      "estado_publicacion": "string (borrador | publicado | archivado)",
      "visitas": "number",
      "comentarios_count": "number",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)",
      "categoria": { },
      "estado": { },
      "usuario": { }
    }
  ]
}
```

---

### Obtener Noticia por ID
Obtiene una noticia específica por su ID.

**Endpoint:** `GET /news/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticia obtenida correctamente",
  "data": {
    "id": "number",
    "categoria_id": "number",
    "estado_id": "number",
    "usuario_id": "number",
    "titulo": "string",
    "slug": "string",
    "fecha_publicacion": "string (ISO 8601)",
    "descripcion": "string",
    "imagen": "string (base64)",
    "estado_publicacion": "string (borrador | publicado | archivado)",
    "visitas": "number",
    "comentarios_count": "number",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "categoria": { },
    "estado": { },
    "usuario": { }
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Noticia no encontrada"
}
```

---

### Obtener Noticias Trending
Obtiene las noticias más visitadas.

**Endpoint:** `GET /news/trending`

**Autenticación requerida:** No

**Query Parameters:**
- `limit` - Número de resultados (opcional, por defecto 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticias trending obtenidas correctamente",
  "data": [
    {
      "id": "number",
      "categoria_id": "number",
      "estado_id": "number",
      "usuario_id": "number",
      "titulo": "string",
      "slug": "string",
      "fecha_publicacion": "string (ISO 8601)",
      "descripcion": "string",
      "imagen": "string (base64)",
      "estado_publicacion": "string",
      "visitas": "number",
      "comentarios_count": "number",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Noticias Recientes
Obtiene las noticias más recientes.

**Endpoint:** `GET /news/latest`

**Autenticación requerida:** No

**Query Parameters:**
- `limit` - Número de resultados (opcional, por defecto 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticias más recientes obtenidas correctamente",
  "data": [
    {
      "id": "number",
      "categoria_id": "number",
      "estado_id": "number",
      "usuario_id": "number",
      "titulo": "string",
      "slug": "string",
      "fecha_publicacion": "string (ISO 8601)",
      "descripcion": "string",
      "imagen": "string (base64)",
      "estado_publicacion": "string",
      "visitas": "number",
      "comentarios_count": "number",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Buscar Noticias
Busca noticias por término de búsqueda en título y descripción.

**Endpoint:** `GET /news/search/:query`

**Autenticación requerida:** No

**Parámetros de URL:**
- `query` - Término de búsqueda

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Resultados de búsqueda obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "categoria_id": "number",
      "estado_id": "number",
      "usuario_id": "number",
      "titulo": "string",
      "slug": "string",
      "fecha_publicacion": "string (ISO 8601)",
      "descripcion": "string",
      "imagen": "string (base64)",
      "estado_publicacion": "string",
      "visitas": "number",
      "comentarios_count": "number",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Noticias por Categoría
Obtiene todas las noticias de una categoría específica.

**Endpoint:** `GET /news/category/:categoryId`

**Autenticación requerida:** No

**Parámetros de URL:**
- `categoryId` - ID de la categoría (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticias por categoría obtenidas correctamente",
  "data": [
    {
      "id": "number",
      "categoria_id": "number",
      "estado_id": "number",
      "usuario_id": "number",
      "titulo": "string",
      "slug": "string",
      "fecha_publicacion": "string (ISO 8601)",
      "descripcion": "string",
      "imagen": "string (base64)",
      "estado_publicacion": "string",
      "visitas": "number",
      "comentarios_count": "number",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Noticias por Estado
Obtiene todas las noticias de un estado específico.

**Endpoint:** `GET /news/state/:stateId`

**Autenticación requerida:** No

**Parámetros de URL:**
- `stateId` - ID del estado (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticias por estado obtenidas correctamente",
  "data": [
    {
      "id": "number",
      "categoria_id": "number",
      "estado_id": "number",
      "usuario_id": "number",
      "titulo": "string",
      "slug": "string",
      "fecha_publicacion": "string (ISO 8601)",
      "descripcion": "string",
      "imagen": "string (base64)",
      "estado_publicacion": "string",
      "visitas": "number",
      "comentarios_count": "number",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Crear Noticia
Crea una nueva noticia en el sistema.

**Endpoint:** `POST /news`

**Autenticación requerida:** Sí (Admin o Contributor)

**Nota:** El `usuario_id` se obtiene automáticamente del token de autenticación.

**Request Body:**
```json
{
  "categoria_id": "number (ID de categoría existente y activa)",
  "estado_id": "number (ID de estado existente y activo)",
  "titulo": "string (mínimo 2 caracteres)",
  "slug": "string (opcional, se genera automáticamente del título, solo letras minúsculas, números y guiones)",
  "fecha_publicacion": "string (ISO 8601)",
  "descripcion": "string (mínimo 2 caracteres)",
  "imagen": "string (base64)",
  "estado_publicacion": "string (opcional: borrador | publicado | archivado, por defecto: borrador)",
  "activo": "boolean (opcional, por defecto true)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Noticia creada correctamente",
  "data": {
    "id": "number",
    "categoria_id": "number",
    "estado_id": "number",
    "usuario_id": "number",
    "titulo": "string",
    "slug": "string",
    "fecha_publicacion": "string (ISO 8601)",
    "descripcion": "string",
    "imagen": "string (base64)",
    "estado_publicacion": "string",
    "visitas": "number",
    "comentarios_count": "number",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Actualizar Noticia
Actualiza una noticia existente.

**Endpoint:** `PUT /news/:id`

**Autenticación requerida:** Sí (Admin o Contributor)

**Parámetros de URL:**
- `id` - ID de la noticia (número entero)

**Request Body (todos los campos son opcionales):**
```json
{
  "categoria_id": "number",
  "estado_id": "number",
  "titulo": "string (mínimo 2 caracteres)",
  "slug": "string (solo letras minúsculas, números y guiones)",
  "fecha_publicacion": "string (ISO 8601)",
  "descripcion": "string (mínimo 2 caracteres)",
  "imagen": "string (base64)",
  "estado_publicacion": "string (borrador | publicado | archivado)",
  "activo": "boolean"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticia actualizada correctamente",
  "data": {
    "id": "number",
    "categoria_id": "number",
    "estado_id": "number",
    "usuario_id": "number",
    "titulo": "string",
    "slug": "string",
    "fecha_publicacion": "string (ISO 8601)",
    "descripcion": "string",
    "imagen": "string (base64)",
    "estado_publicacion": "string",
    "visitas": "number",
    "comentarios_count": "number",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Noticia no encontrada"
}
```

---

### Eliminar Noticia
Elimina una noticia del sistema (soft delete, marca como inactiva).

**Endpoint:** `DELETE /news/:id`

**Autenticación requerida:** Sí (Admin o Contributor)

**Parámetros de URL:**
- `id` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticia eliminada correctamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Noticia no encontrada"
}
```

---

## Categorías

### Obtener Todas las Categorías
Obtiene la lista completa de categorías.

**Endpoint:** `GET /categories`

**Autenticación requerida:** No

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categorías obtenidas correctamente",
  "data": [
    {
      "id": "number",
      "nombre": "string",
      "descripcion": "string",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Categoría por ID
Obtiene una categoría específica por su ID.

**Endpoint:** `GET /categories/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID de la categoría (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categoría obtenida correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "descripcion": "string",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Categoría no encontrada"
}
```

---

### Crear Categoría
Crea una nueva categoría en el sistema.

**Endpoint:** `POST /categories`

**Autenticación requerida:** Sí (Admin)

**Request Body:**
```json
{
  "nombre": "string (5-50 caracteres, único)",
  "descripcion": "string (5-255 caracteres)",
  "activo": "boolean (opcional, por defecto true)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Categoría creada correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "descripcion": "string",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Actualizar Categoría
Actualiza una categoría existente.

**Endpoint:** `PUT /categories/:id`

**Autenticación requerida:** Sí (Admin)

**Parámetros de URL:**
- `id` - ID de la categoría (número entero)

**Request Body (todos los campos son opcionales):**
```json
{
  "nombre": "string (5-50 caracteres)",
  "descripcion": "string (5-255 caracteres)",
  "activo": "boolean"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categoría actualizada correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "descripcion": "string",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Categoría no encontrada"
}
```

---

### Eliminar Categoría
Elimina una categoría del sistema (soft delete, marca como inactiva).

**Endpoint:** `DELETE /categories/:id`

**Autenticación requerida:** Sí (Admin)

**Parámetros de URL:**
- `id` - ID de la categoría (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categoría eliminada correctamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Categoría no encontrada"
}
```

---

## Estados

### Obtener Todos los Estados
Obtiene la lista completa de estados.

**Endpoint:** `GET /states`

**Autenticación requerida:** No

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estados obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "nombre": "string",
      "abreviacion": "string",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Estado por ID
Obtiene un estado específico por su ID.

**Endpoint:** `GET /states/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID del estado (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado obtenido correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "abreviacion": "string",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Estado no encontrado"
}
```

---

### Crear Estado
Crea un nuevo estado en el sistema.

**Endpoint:** `POST /states`

**Autenticación requerida:** Sí (Admin)

**Request Body:**
```json
{
  "nombre": "string (2-50 caracteres, único)",
  "abreviacion": "string (2-5 caracteres, único)",
  "activo": "boolean (opcional, por defecto true)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Estado creado correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "abreviacion": "string",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Actualizar Estado
Actualiza un estado existente.

**Endpoint:** `PUT /states/:id`

**Autenticación requerida:** Sí (Admin)

**Parámetros de URL:**
- `id` - ID del estado (número entero)

**Request Body (todos los campos son opcionales):**
```json
{
  "nombre": "string (2-50 caracteres)",
  "abreviacion": "string (2-5 caracteres)",
  "activo": "boolean"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado actualizado correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "abreviacion": "string",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Estado no encontrado"
}
```

---

### Eliminar Estado
Elimina un estado del sistema (soft delete, marca como inactivo).

**Endpoint:** `DELETE /states/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID del estado (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado eliminado correctamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Estado no encontrado"
}
```

---

## Perfiles

### Obtener Todos los Perfiles
Obtiene la lista completa de perfiles de usuario.

**Endpoint:** `GET /profiles`

**Autenticación requerida:** No

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfiles obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "nombre": "string",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

---

### Obtener Perfil por ID
Obtiene un perfil específico por su ID.

**Endpoint:** `GET /profiles/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID del perfil (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil obtenido correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Perfil no encontrado"
}
```

---

### Crear Perfil
Crea un nuevo perfil en el sistema.

**Endpoint:** `POST /profiles`

**Autenticación requerida:** No

**Request Body:**
```json
{
  "nombre": "string"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Perfil creado correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Actualizar Perfil
Actualiza un perfil existente.

**Endpoint:** `PUT /profiles/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID del perfil (número entero)

**Request Body:**
```json
{
  "nombre": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil actualizado correctamente",
  "data": {
    "id": "number",
    "nombre": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Perfil no encontrado"
}
```

---

### Eliminar Perfil
Elimina un perfil del sistema.

**Endpoint:** `DELETE /profiles/:id`

**Autenticación requerida:** No

**Parámetros de URL:**
- `id` - ID del perfil (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil eliminado correctamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Perfil no encontrado"
}
```

---

## Comentarios

### Obtener Comentarios de una Noticia
Obtiene todos los comentarios de una noticia específica.

**Endpoint:** `GET /news/:newsId/comments`

**Autenticación requerida:** No

**Parámetros de URL:**
- `newsId` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comentarios obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "noticia_id": "number",
      "usuario_id": "number",
      "contenido": "string",
      "aprobado": "boolean",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)",
      "usuario": { }
    }
  ]
}
```

---

### Crear Comentario
Crea un nuevo comentario en una noticia.

**Endpoint:** `POST /news/:newsId/comments`

**Autenticación requerida:** Sí (Admin o Contributor)

**Parámetros de URL:**
- `newsId` - ID de la noticia (número entero)

**Request Body:**
```json
{
  "contenido": "string (1-2000 caracteres)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comentario creado correctamente (pendiente de aprobación)",
  "data": {
    "id": "number",
    "noticia_id": "number",
    "usuario_id": "number",
    "contenido": "string",
    "aprobado": "boolean",
    "activo": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Noticia no encontrada"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Eliminar Comentario
Elimina un comentario de una noticia.

**Endpoint:** `DELETE /news/:newsId/comments/:commentId`

**Autenticación requerida:** Sí (Admin o Contributor)

**Parámetros de URL:**
- `newsId` - ID de la noticia (número entero)
- `commentId` - ID del comentario (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comentario eliminado correctamente"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

### Obtener Comentarios Pendientes
Obtiene todos los comentarios pendientes de aprobación.

**Endpoint:** `GET /news/comments/pending`

**Autenticación requerida:** Sí (Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comentarios pendientes obtenidos",
  "data": [
    {
      "id": "number",
      "noticia_id": "number",
      "usuario_id": "number",
      "contenido": "string",
      "aprobado": "boolean",
      "activo": "boolean",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)",
      "usuario": { },
      "noticia": { }
    }
  ],
  "total": "number"
}
```

---

### Aprobar Comentario
Aprueba un comentario pendiente.

**Endpoint:** `POST /news/comments/approve/:commentId`

**Autenticación requerida:** Sí (Admin)

**Parámetros de URL:**
- `commentId` - ID del comentario (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comentario aprobado"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "string (descripción del error)"
}
```

---

## Favoritos

### Agregar Noticia a Favoritos
Agrega una noticia a los favoritos de un usuario.

**Endpoint:** `POST /users/:usuarioId/favorites/:noticiaId`

**Autenticación requerida:** Sí (Admin o el propio usuario)

**Parámetros de URL:**
- `usuarioId` - ID del usuario (número entero)
- `noticiaId` - ID de la noticia (número entero)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Noticia agregada a favoritos correctamente",
  "data": {
    "id": "number",
    "usuario_id": "number",
    "noticia_id": "number",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "No tienes permiso para agregar favoritos a otro usuario"
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "message": "La noticia ya está en favoritos"
}
```

---

### Remover Noticia de Favoritos
Remueve una noticia de los favoritos de un usuario.

**Endpoint:** `DELETE /users/:usuarioId/favorites/:noticiaId`

**Autenticación requerida:** Sí (Admin o el propio usuario)

**Parámetros de URL:**
- `usuarioId` - ID del usuario (número entero)
- `noticiaId` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Noticia removida de favoritos correctamente"
}
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "No tienes permiso para remover favoritos de otro usuario"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "El favorito no existe"
}
```

---

### Obtener Favoritos de un Usuario
Obtiene todas las noticias favoritas de un usuario.

**Endpoint:** `GET /users/:usuarioId/favorites`

**Autenticación requerida:** No

**Parámetros de URL:**
- `usuarioId` - ID del usuario (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Favoritos del usuario obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "usuario_id": "number",
      "noticia_id": "number",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)",
      "noticia": {
        "id": "number",
        "titulo": "string",
        "descripcion": "string",
        "imagen": "string",
        "fecha_publicacion": "string (ISO 8601)"
      }
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### Verificar si una Noticia está en Favoritos
Verifica si una noticia específica está en los favoritos de un usuario.

**Endpoint:** `GET /users/:usuarioId/favorites/:noticiaId/check`

**Autenticación requerida:** No

**Parámetros de URL:**
- `usuarioId` - ID del usuario (número entero)
- `noticiaId` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado de favorito verificado",
  "data": {
    "isFavorited": "boolean"
  }
}
```

---

### Obtener Usuarios que Favoritearon una Noticia
Obtiene todos los usuarios que marcaron una noticia como favorita.

**Endpoint:** `GET /users/news/:noticiaId/favorited-by`

**Autenticación requerida:** No

**Parámetros de URL:**
- `noticiaId` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuarios que favoritearon esta noticia obtenidos correctamente",
  "data": [
    {
      "id": "number",
      "usuario_id": "number",
      "noticia_id": "number",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)",
      "usuario": {
        "id": "number",
        "nombre": "string",
        "apellidos": "string",
        "nick": "string",
        "avatar": "string"
      }
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Noticia no encontrada"
}
```

---

### Obtener Conteo de Favoritos de una Noticia
Obtiene el número total de usuarios que marcaron una noticia como favorita.

**Endpoint:** `GET /users/news/:noticiaId/favorites-count`

**Autenticación requerida:** No

**Parámetros de URL:**
- `noticiaId` - ID de la noticia (número entero)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Conteo de favoritos obtenido correctamente",
  "data": {
    "count": "number"
  }
}
```

---

## Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado HTTP:

- **200 OK** - La solicitud fue exitosa
- **201 Created** - El recurso fue creado exitosamente
- **400 Bad Request** - La solicitud contiene datos inválidos
- **401 Unauthorized** - Autenticación requerida o credenciales inválidas
- **403 Forbidden** - No tienes permisos para acceder a este recurso
- **404 Not Found** - El recurso solicitado no existe
- **409 Conflict** - Conflicto con el estado actual del recurso
- **422 Unprocessable Entity** - Error de validación en los datos enviados
- **500 Internal Server Error** - Error del servidor

---

## Notas Importantes

### Formato de Fechas
Todas las fechas deben enviarse y se reciben en formato ISO 8601:
```
2025-11-06T12:00:00.000Z
```

### Imágenes
Las imágenes deben enviarse codificadas en base64. El formato completo incluye el prefijo del tipo MIME:
```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
```

### Paginación
La API actualmente no implementa paginación automática. Los endpoints que retornan listas devuelven todos los registros activos. Algunos endpoints como `/news/trending` y `/news/latest` aceptan el parámetro `limit` para controlar la cantidad de resultados.

### Soft Delete
La mayoría de los recursos utilizan soft delete, lo que significa que no se eliminan físicamente de la base de datos, sino que se marcan como inactivos mediante el campo `activo: false`.

### Relaciones
Muchos endpoints devuelven objetos relacionados anidados. Por ejemplo, al obtener una noticia, también se incluyen los objetos `categoria`, `estado` y `usuario` completos.

### Validaciones
Todos los campos tienen validaciones específicas. Si una validación falla, recibirás un error 422 con detalles sobre qué campo falló y por qué.

### Autenticación de Comentarios
Los comentarios se crean en estado pendiente (`aprobado: false`) y requieren aprobación de un administrador antes de ser visibles públicamente.

### Propiedad de Recursos
Los usuarios solo pueden modificar sus propios recursos (noticias, comentarios) a menos que sean administradores.
