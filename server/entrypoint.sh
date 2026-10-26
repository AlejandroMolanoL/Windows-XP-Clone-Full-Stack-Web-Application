#!/bin/sh

# 1. Instala/Sincroniza las dependencias CADA VEZ que el contenedor arranca.
# Esto repara cualquier conflicto de volúmenes.
echo "Sincronizando dependencias del servidor..."
yarn install

# 2. Ejecuta el comando principal (que será "yarn dev")
echo "Iniciando servidor..."
exec "$@"