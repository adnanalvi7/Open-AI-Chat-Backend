FROM node:20

WORKDIR /app

COPY package*.json ./
COPY knexfile.js ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20

WORKDIR /app

COPY package*.json ./
COPY knexfile.js ./  # Use .js if compiled
COPY tsconfig*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations

RUN npm install -g knex

EXPOSE 3000

CMD ["sh", "-c", "knex migrate:latest && node dist/main"]