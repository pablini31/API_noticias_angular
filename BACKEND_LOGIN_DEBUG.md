# 🔐 Backend Login Error - Debugging Guide

## Problem Summary
- **Frontend**: Sending correct credentials to `/api/auth/login`
- **Credentials**: `correo: "jhon@gmail.com"`, `contraseña: "123456"`
- **Backend Response**: `401 Unauthorized` with message `"Sin autorización"`
- **Database**: User exists in `usuarios` table with `correo = 'jhon@gmail.com'`

## Root Cause Analysis

The **401 Unauthorized** error means the backend is **rejecting** the login attempt during validation.

### Most Likely Causes (in order):

1. **Password Hash Mismatch** ⚠️ MOST LIKELY
   - Database has hashed password
   - Backend is comparing `hash("123456")` with stored hash incorrectly
   - Or backend is comparing plaintext "123456" with hashed value

2. **User Validation Logic Error**
   - Backend checking wrong field names
   - Backend checking `activo` status
   - Backend checking `verificado` status

3. **CORS or Request Issue**
   - Backend not receiving request properly
   - Content-Type mismatch

---

## Solution Steps

### Step 1: Inspect Backend Auth Logic

Find your backend login endpoint (typically `routes/auth.js` or `controllers/authController.js`):

Look for code like:
```javascript
// WRONG - comparing plaintext with hash:
if (user.contraseña !== contraseña) {
  return res.status(401).json({ message: 'Sin autorización' });
}

// CORRECT - using bcrypt or similar:
const validPassword = await bcrypt.compare(contraseña, user.contraseña);
if (!validPassword) {
  return res.status(401).json({ message: 'Sin autorización' });
}
```

**Action Required**: 
- Check your backend's `/auth/login` route
- Verify password comparison method
- Send me the code snippet

### Step 2: Check Password Storage Format

In your database, the password field (`contraseña`) should contain:
- **Either**: Hashed password (starting with `$2a$`, `$2b$`, `$argon2`, etc.)
- **Or**: Plaintext (if backend does no hashing)

```sql
-- Check what's stored:
SELECT correo, contraseña FROM usuarios WHERE correo = 'jhon@gmail.com';
```

If the password looks like:
- `123456` → Plaintext, backend should compare directly
- `$2b$12$...` → Bcrypt hash, backend MUST use bcrypt.compare()
- `$argon2...` → Argon2 hash, backend MUST use argon2 comparison

### Step 3: Test Backend Directly

Use **Postman**, **cURL**, or **Thunder Client** to test the login endpoint:

**PowerShell (Windows):**
```powershell
$body = @{
    correo = "jhon@gmail.com"
    contraseña = "123456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

Write-Host $response.StatusCode
Write-Host $response.Content
```

Expected responses:
- **✅ Success (200)**: `{ message: "...", token: "eyJ..." }`
- **❌ Failure (401)**: `{ message: "Sin autorización" }`

If you get **401**, the password validation is failing in the backend.

### Step 4: Enable Debug Logging in Backend

Add logging to your backend login controller:

```javascript
// In your POST /auth/login endpoint:

app.post('/api/auth/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  
  console.log('📤 Login request received:', { correo, passwordProvided: !!contraseña });
  
  const user = await Usuario.findOne({ where: { correo } });
  console.log('🔍 User found:', { id: user?.id, correo: user?.correo });
  
  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({ message: 'Sin autorización' });
  }
  
  // Check password - adjust based on your setup:
  
  // Option A: Plaintext comparison
  const validPassword = user.contraseña === contraseña;
  console.log('🔐 Password validation (plaintext):', { 
    stored: user.contraseña, 
    provided: contraseña, 
    valid: validPassword 
  });
  
  // Option B: Bcrypt comparison
  // const validPassword = await bcrypt.compare(contraseña, user.contraseña);
  // console.log('🔐 Password validation (bcrypt):', { valid: validPassword });
  
  if (!validPassword) {
    console.log('❌ Password mismatch');
    return res.status(401).json({ message: 'Sin autorización' });
  }
  
  // Generate token...
  console.log('✅ Login successful, generating token');
});
```

Then check the **backend console logs** when you submit the login form to see what's happening.

---

## Quick Diagnostic Command

Run this in your backend terminal to verify the user exists:

```bash
# If using Node.js REPL:
node

# Then in Node REPL:
const Usuario = require('./models/Usuario'); // adjust path
const user = await Usuario.findOne({ where: { correo: 'jhon@gmail.com' } });
console.log(user);
```

You should see the user object with all fields including the hashed password.

---

## Common Issues & Fixes

### Issue 1: Password field is plaintext in DB but backend is trying to use bcrypt

**Fix**: Either:
- Hash all passwords in DB with bcrypt
- Remove bcrypt from backend and compare plaintext

### Issue 2: Password field is NULL or empty

**Fix**: Update the database:
```sql
UPDATE usuarios SET contraseña = 'abc123' WHERE correo = 'jhon@gmail.com';
```

### Issue 3: Field name mismatch

Backend might be looking for `password` but DB has `contraseña`:
```javascript
// WRONG:
const user = await Usuario.findOne({ contraseña: pwd });

// CORRECT:
const user = await Usuario.findOne({ contraseña: pwd });
```

---

## Next Steps

Please provide:

1. **Backend login code** - Show me the POST `/api/auth/login` handler
2. **Database check** - Run: `SELECT correo, contraseña FROM usuarios LIMIT 5;`
3. **Backend logs** - Show console output from the login attempt with debug logs enabled
4. **Password hashing method** - What library? bcrypt? argon2? plaintext?

Once I see these, I can provide the exact fix needed.

---

## TL;DR - Quick Checklist

- [ ] Backend running on port 3000
- [ ] User `jhon@gmail.com` exists in database
- [ ] Password comparison logic is correct (bcrypt or plaintext)
- [ ] Backend returning 401 means password validation failed
- [ ] Add console.logs to see exactly what's being compared
- [ ] Test endpoint with Postman directly
