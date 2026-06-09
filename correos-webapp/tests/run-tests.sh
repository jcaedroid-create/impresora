#!/bin/bash

# Script para ejecutar los tests de la aplicación correos-webapp
# Usa pytest con mocks - no requiere Meteor, impresora ni conexión a internet
# Uso: cd correos-webapp && ./tests/run-tests.sh

echo "========================================"
echo "  Tests - Correos Webapp (pytest)"
echo "========================================"
echo ""

# Ir a la carpeta de tests
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Crear .venv si no existe
if [ ! -d ".venv" ]; then
  echo "🐍 Creando entorno virtual (.venv)..."
  python3 -m venv .venv
  echo ""
fi

# Activar .venv
source .venv/bin/activate

# Instalar dependencias
echo "📦 Instalando dependencias..."
pip install -r requirements.txt --quiet
echo ""

# Ejecutar tests
echo "🚀 Ejecutando tests..."
echo ""
pytest test_printer.py -v

# Resultado
EXIT_CODE=$?
echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Todos los tests pasaron correctamente"
else
  echo "❌ Algunos tests fallaron"
fi

deactivate
exit $EXIT_CODE
