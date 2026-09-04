# Stage 1: Build application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY aktionstage.json ./
COPY mood-scales ./mood-scales

# Build production bundle
RUN npm run build

# Stage 2: Production web server
FROM nginx:alpine AS runner

# Copy built assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/mood-scales /usr/share/nginx/html/mood-scales

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
