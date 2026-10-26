#!/bin/sh

# 1. Instala/Sincroniza las dependencias CADA VEZ que el contenedor arranca.
echo "Sincronizando dependencias del cliente..."
yarn install

# 2. Ejecuta el comando principal (que será "yarn dev --host 0.0.0.0")
echo "Iniciando cliente..."
exec "$@"