# 📋 Audit: Frontend vs API - Incompatibilidades Encontradas

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Create-News Component** (MAJOR ISSUES)

**Problemas:**
- ❌ Campo `contenido` NO EXISTE en API
- ❌ API solo acepta `descripcion` (máximo 2000 caracteres según comentarios)
- ❌ No hay campo para `slug` automático (API lo genera)
- ❌ No hay validación de `fecha_publicacion` 
- ❌ No hay campo `estado_publicacion` selector (debería venir como `borrador` por defecto)

**API Expects:**
```json
{
  "categoria_id": number,      // ✓ OK
  "estado_id": number,         // ✓ OK
  "titulo": string (2+ chars), // ✓ OK
  "slug": string (OPTIONAL),   // ⚠️ Auto-generated
  "fecha_publicacion": ISO8601,// ✓ OK
  "descripcion": string,       // ✓ OK (NOT contenido!)
  "imagen": base64,            // ✓ OK
  "estado_publicacion": string (borrador|publicado|archivado), // ⚠️ Default: borrador
  "activo": boolean            // ⚠️ Optional, default true
}
```

**Fix Required:**
- Remove `contenido` field
- Rename form control: `contenido` → `descripcion`
- Remove `estado_publicacion` field (let API default to "borrador")
- Add auto `fecha_publicacion` = today's date
- Remove `slug` field (API generates it)

---

### 2. **News Management Component** (PLACEHOLDER ONLY)

**Status:** Component is just a placeholder
- ❌ No CRUD functionality implemented
- ❌ Should show all news with filters
- ❌ Should allow edit/delete per API permissions

**API Support:**
- ✓ GET /news - Get all
- ✓ GET /news/:id - Get one
- ✓ PUT /news/:id - Update
- ✓ DELETE /news/:id - Delete
- ✓ Filtering by category, state, search

**Action:** Build proper UI with CRUD operations

---

### 3. **User Management Component** (PLACEHOLDER)

**Status:** Component is a placeholder
- ❌ No CRUD functionality
- ❌ Should show user list (Admin only)

**API Support:**
- ✓ GET /users - Get all (Admin only)
- ✓ GET /users/:id - Get one
- ✓ POST /users - Create (Admin only)
- ✓ PUT /users/:id - Update (Admin only)
- ✓ DELETE /users/:id - Delete (Admin only)

---

### 4. **Category Management Component** (PLACEHOLDER)

**Status:** Component is a placeholder

**API Support:**
- ✓ GET /categories - Get all
- ✓ GET /categories/:id - Get one
- ✓ POST /categories - Create (Admin only)
- ✓ PUT /categories/:id - Update (Admin only)
- ✓ DELETE /categories/:id - Delete (Admin only)

**Note:** API restricts CRUD to Admin only - form should be hidden for non-admin users

---

### 5. **State Management Component** (PLACEHOLDER)

**Status:** Component is a placeholder

**API Support:**
- ✓ GET /states - Get all
- ✓ GET /states/:id - Get one
- ✓ POST /states - Create (Admin only)
- ✓ PUT /states/:id - Update (Admin only)
- ✓ DELETE /states/:id - Delete (Admin only)

**Note:** Only 5 states exist in DB (Estados Venezolanos)

---

### 6. **Profile Management Component** (PLACEHOLDER)

**Status:** Component is a placeholder

**API Support:**
- ✓ GET /profiles - Get all
- ✓ GET /profiles/:id - Get one
- ✓ POST /profiles - Create
- ✓ PUT /profiles/:id - Update
- ✓ DELETE /profiles/:id - Delete

**Note:** Only 2 profiles: Admin (1), Contributor (2)

---

### 7. **Dashboard: Create-News** (PARTIALLY CORRECT)

**Issues:**
- ❌ `contenido` field should be `descripcion`
- ❌ `imagen` not being converted to base64
- ❌ `slug` field not needed
- ❌ `estado_publicacion` not in form (let API default)
- ❌ Missing error handling for image conversion

**Fix:**
- Remove `contenido` validator
- Add image to base64 converter
- Set `fecha_publicacion` to current date
- Remove slug from form

---

### 8. **My-News Component** (VERIFY)

**Needs checking:**
- Should fetch user's own news
- Should allow edit/delete only own news
- Status: Not reviewed yet

---

### 9. **Comments** (NOT IMPLEMENTED)

**API has full support:**
- ✓ GET /news/:newsId/comments
- ✓ POST /news/:newsId/comments
- ✓ DELETE /news/:newsId/comments/:commentId
- ✓ GET /news/comments/pending (Admin only)
- ✓ POST /news/comments/approve/:commentId (Admin only)

**Frontend Status:** NOT IMPLEMENTED
- No comments display component
- No comments section in news detail
- No approval system for admins

---

### 10. **Favorites** (NOT FULLY IMPLEMENTED)

**API has full support:**
- ✓ POST /users/:usuarioId/favorites/:noticiaId
- ✓ DELETE /users/:usuarioId/favorites/:noticiaId
- ✓ GET /users/:usuarioId/favorites
- ✓ GET /users/:usuarioId/favorites/:noticiaId/check
- ✓ GET /users/news/:noticiaId/favorited-by
- ✓ GET /users/news/:noticiaId/favorites-count

**Frontend Status:** Service exists but not wired to UI
- No favorite button on news
- No favorites page
- Services are correct but not used

---

### 11. **Profile Component** (NEEDS REVIEW)

**API Support:**
- ✓ GET /users/:id - Get user by ID
- Can only update own profile (no specific endpoint - use PUT /users/:id if admin or own user)

**Frontend Status:** Not reviewed yet

---

## 📝 PRIORITY FIX ORDER

### Phase 1: Critical (MUST FIX)
1. **Create-News**: Remove `contenido`, fix `descripcion`, add image to base64
2. **Auth Flow**: Verify login token handling works correctly
3. **News Service**: Verify all endpoint routes match API exactly

### Phase 2: Important (SHOULD FIX)
4. **News Management**: Replace placeholder with full CRUD UI
5. **User Management**: Replace placeholder with admin CRUD UI
6. **Category Management**: Replace placeholder with admin CRUD UI
7. **State Management**: Replace placeholder with admin CRUD UI

### Phase 3: Enhancement (NICE TO HAVE)
8. **Comments**: Implement comment display and approval system
9. **Favorites**: Wire favorites button to news cards
10. **Profile**: Implement profile edit form

---

## 🎯 FIELD-BY-FIELD VALIDATION

### News Fields
```
titulo          ✓ Correct (2-100 chars)
descripcion     ✓ Correct (API accepts this, not 'contenido')
imagen          ⚠️ Must be base64, not File
categoria_id    ✓ Correct (number)
estado_id       ✓ Correct (number)
fecha_publicacion ✓ Correct (ISO8601, must send today's date)
slug            ⚠️ Optional, API generates automatically
estado_publicacion ⚠️ Optional, API defaults to 'borrador'
activo          ⚠️ Optional, API defaults to true
```

### User Fields (Create/Update)
```
nombre          ✓ (2-100 chars)
apellidos       ✓ (2-100 chars)
nick            ✓ (2-20 chars)
correo          ✓ (email)
contraseña      ✓ (8+ chars, only for create)
perfil_id       ✓ (for admin create)
activo          ⚠️ Optional
bio             ⚠️ Optional
avatar          ⚠️ Optional URL
verificado      ⚠️ Optional
```

---

## ✅ WHAT'S CORRECT

- ✓ Login endpoint and format
- ✓ Register endpoint and format
- ✓ News service endpoints (all paths correct)
- ✓ Category service (basic)
- ✓ State service (basic)
- ✓ JWT interceptor setup
- ✓ Error handling structure

---

## 🔧 NEXT STEPS

1. Fix Create-News component field mapping
2. Implement proper News Management CRUD
3. Implement User Management CRUD for admins
4. Implement Category Management CRUD for admins
5. Implement State Management CRUD for admins
6. Add comments functionality
7. Wire favorites to UI
8. Test all flows end-to-end

