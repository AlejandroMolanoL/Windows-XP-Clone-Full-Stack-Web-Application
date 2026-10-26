# client/Dockerfile
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

EXPOSE 5173

# --- ¡LÍNEAS MODIFICADAS! ---
ENTRYPOINT ["/entrypoint.sh"]
CMD ["yarn", "dev", "--host", "0.0.0.0"]
# -----------------------------