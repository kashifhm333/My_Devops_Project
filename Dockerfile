FROM node:18-alpine AS builder

WORKDIR /app

# Copy manifest and install dependencies (use npm ci when lockfile present)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Serve SPA: use custom nginx config so client-side routes work
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]