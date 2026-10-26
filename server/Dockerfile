# server/Dockerfile
FROM node:20
WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable
RUN yarn config set nodeLinker node-modules
RUN yarn install

COPY . .

# --- ¡LÍNEAS NUEVAS! ---
# Copia nuestro script y lo hace ejecutable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# ------------------------

EXPOSE 5000

# --- ¡LÍNEAS MODIFICADAS! ---
# En lugar de CMD, usamos ENTRYPOINT
ENTRYPOINT ["/entrypoint.sh"]
CMD ["yarn", "dev"]
# -----------------------------