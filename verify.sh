#!/bin/bash
# Script de verificación del proyecto Frontend

echo "======================================"
echo "🔍 Verificación del Frontend"
echo "======================================"
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm no está instalado"
    exit 1
fi

# Verificar Angular CLI
echo "📦 Verificando Angular CLI..."
if command -v ng &> /dev/null; then
    echo "✅ Angular CLI: $(ng version --minimal)"
else
    echo "⚠️  Angular CLI no está instalado globalmente"
    echo "   Puedes usar: npx ng --version"
fi

# Verificar archivos esenciales
echo ""
echo "📁 Verificando archivos esenciales..."

FILES=(
    "package.json"
    "angular.json"
    "proxy.conf.json"
    "src/styles.global.css"
    "src/app/core/services/category.service.ts"
    "src/app/core/services/state.service.ts"
    "src/app/core/services/user.service.ts"
    "src/app/components/header/header.component.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTA"
    fi
done

# Verificar dependencias
echo ""
echo "📚 Verificando dependencias en package.json..."

if grep -q "@angular/core" package.json; then
    echo "✅ @angular/core encontrado"
else
    echo "❌ @angular/core no encontrado"
fi

if grep -q "@angular/common" package.json; then
    echo "✅ @angular/common encontrado"
else
    echo "❌ @angular/common no encontrado"
fi

# Verificar node_modules
echo ""
echo "📚 Verificando node_modules..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules existe"
else
    echo "⚠️  node_modules no existe"
    echo "   Ejecuta: npm install"
fi

echo ""
echo "======================================"
echo "✅ Verificación completada"
echo "======================================"
echo ""
echo "Próximos pasos:"
echo "1. Asegúrate de que el backend está en http://localhost:3000"
echo "2. Ejecuta: npm start"
echo "3. Abre: http://localhost:4200"
echo "4. Abre DevTools (F12) para verificar que /api/* requests funcionan"
echo ""
