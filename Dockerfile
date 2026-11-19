# Build stage: Node 14 matches Angular 10 and needs no OpenSSL legacy flag
FROM node:14-alpine AS build
WORKDIR /app
# npm 6 (bundled with Node 14) cannot read the lockfile written by npm 7+
RUN npm install -g npm@8
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npx ng build --prod

# Runtime stage: unprivileged nginx (runs as uid 101 on port 8080)
FROM nginxinc/nginx-unprivileged:1.25-alpine
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/fta /usr/share/nginx/html
EXPOSE 8080
