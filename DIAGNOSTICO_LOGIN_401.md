# Diagnóstico: Error 401 en Login

## El Problema

El login intenta conectar a `http://localhost:4200/api/auth/login` pero debería ir a `http://localhost:3000/api/auth/login` a través del proxy.

### Logs Actuales
```
🔐 Login attempt with: {correo: 'jhon@gmail.com', passwordLength: 6}
POST http://localhost:4200/api/auth/login 401 (Unauthorized)
❌ Login error details: {status: 401, statusText: 'Unauthorized', message: 'Sin autorización'}
```

## Causas Posibles (en orden de probabilidad)

### 1. ❌ Backend NO está ejecutándose en puerto 3000
**MÁS PROBABLE** - El proxy intenta conectar a `http://localhost:3000` pero si el backend no está corriendo, el navegador devuelve un error 401 genérico.

**Solución:**
```bash
# En una terminal NUEVA (en el directorio del backend):
npm start
# O dependiendo de tu configuración:
node server.js
# O:
npm run dev
```

Verifica que veas: `Server running on port 3000` o similar.

### 2. ⚠️ El proxy no está siendo usado correctamente
**Menos probable pero posible** - Angular dev server no está usando el proxy.conf.json

**Verificar:**
- El archivo `proxy.conf.json` está en el directorio raíz ✓
- El `angular.json` tiene configurado `"proxyConfig": "proxy.conf.json"` ✓
- El servidor fue iniciado con: `npm start` (que lee angular.json) ✓

**Si el proxy NO funciona después de estas verificaciones:**
```bash
# 1. Mata todos los procesos node
taskkill /F /IM node.exe

# 2. Limpia la caché de Angular
npm cache clean --force

# 3. Reinicia el servidor explícitamente:
npm start -- --proxy-config proxy.conf.json
```

### 3. 🔐 Las credenciales no existen en el backend
Si el backend SÍ está corriendo pero devuelve 401, significa:

**Verificar en el backend:**
```javascript
// En tu base de datos, verifica que exista el usuario:
// Email: jhon@gmail.com
// Password: (la que estés usando)
```

**O si estás usando un seeder/script de inicialización:**
```bash
# En directorio del backend:
npm run seed
# O similar según tu proyecto
```

---

## Pasos para Diagnosticar (Sigue EN ORDEN)

### Paso 1: Verifica que el Backend está corriendo
```bash
# Abre una terminal NUEVA en el directorio del backend
cd path/to/backend
npm start
```

Deberías ver algo como:
```
Server running on port 3000
Database connected
```

**Si ves error de puerto ocupado:**
```bash
netstat -ano | findstr :3000
# Identifica el PID y mata el proceso:
taskkill /PID <PID> /F
```

### Paso 2: Verifica la configuración del proxy
Abre el navegador en: `http://localhost:4200`

Abre Developer Tools (F12) → Tab "Network"

Intenta hacer login e inspecciona la petición:
- **URL**: Debería ser algo como `http://localhost:4200/api/auth/login` (lo que ves en Network)
- **Remote Address**: Debería mostrar `localhost:3000` o `127.0.0.1:3000`
- **Status**: `401` o `200` (no 404)

Si ves URL `http://localhost:4200/api/auth/login` pero Remote Address es `localhost:3000`, **el proxy SÍ está funcionando correctamente**.

### Paso 3: Verifica las credenciales
En el backend, verifica que el usuario existe. Prueba estas opciones:

**Opción A: Usa Postman o cURL para probar el endpoint directamente**
```bash
# Windows PowerShell:
$body = @{
    correo = "jhon@gmail.com"
    contraseña = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# O con curl:
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"jhon@gmail.com\",\"contraseña\":\"123456\"}"
```

Si ves un token en la respuesta → El backend funciona, el problema es en el frontend o proxy.
Si ves `{message: "Sin autorización"}` → El usuario no existe o contraseña incorrecta.

**Opción B: Verifica la base de datos directamente**
```sql
-- Si usas MySQL/PostgreSQL, verifica que exista el usuario:
SELECT id, correo, verificado FROM usuarios WHERE correo = 'jhon@gmail.com';

-- Si es SQLite:
SELECT id, correo, verificado FROM usuarios WHERE correo = 'jhon@gmail.com';
```

---

## Resumen de Checklist

- [ ] Backend está corriendo en `http://localhost:3000`
- [ ] Terminal muestra mensaje de "Server running on port 3000"
- [ ] Frontend dev server está corriendo en `http://localhost:4200`
- [ ] El archivo `proxy.conf.json` existe en el directorio raíz
- [ ] El archivo `angular.json` contiene `"proxyConfig": "proxy.conf.json"`
- [ ] El usuario `jhon@gmail.com` existe en la base de datos
- [ ] La contraseña es correcta (probada con Postman/cURL)
- [ ] Las credenciales se envían en formato JSON correcto

---

## Comandos Rápidos para Resolver

```bash
# Terminal 1: Inicia el backend
cd ...\backend-folder
npm start

# Terminal 2: Inicia el frontend (espera a que termine)
cd ...\api_news_frontend
npm start -- --proxy-config proxy.conf.json
```

Luego intenta login en `http://localhost:4200` con:
- Email: `jhon@gmail.com`
- Password: `123456` (o la que corresponda)

---

## Recursos para Debugging Adicional

### Ver logs del proxy en tiempo real
Si iniciaste con `--proxy-config proxy.conf.json`, los logs del proxy deberían aparecer en la consola de Angular.

### Habilitar debug en Chrome DevTools
1. Abre DevTools (F12)
2. Ve a Network tab
3. Busca peticiones POST a `/api/auth/login`
4. Inspecciona Headers y Response
5. Verifica que el `Remote Address` sea `localhost:3000`, no `localhost:4200`

### Verificar CORS
Si ves error de CORS, es señal de que el backend está corriendo pero rechazando la petición del frontend.

En ese caso, verifica en el backend que tenga CORS habilitado para `http://localhost:4200`:
```javascript
// Backend Express típico:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```
