# STAGE: Builder
FROM node:20-alpine AS builder

WORKDIR /builder

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# STAGE: Prod Deploy Ready Image
FROM node:20-alpine

# Create necessary directories and set permissions before switching user
WORKDIR /home/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --only=production

COPY --from=builder --chown=node:node /builder/dist ./dist

USER node

EXPOSE 3333 80

CMD ["node", "dist/src/app.js"]
