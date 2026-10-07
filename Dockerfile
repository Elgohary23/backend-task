FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=base /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
