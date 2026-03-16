###############################################
# 1. BUILD STAGE (Angular)
# -------------------------
# This stage compiles the Angular app.
# Angular CLI runs on Node, so we use Node 20.
###############################################
FROM node:20 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (best caching)
# If package.json or package-lock.json don't change,
# Docker reuses the cached npm ci layer → MUCH faster builds.
COPY package*.json ./

# Install dependencies using npm ci (best for CI/CD)
# - Faster
# - Reproducible builds
# - Uses package-lock.json exactly
RUN npm ci

# Copy the rest of the Angular source code
COPY . .

# Build the Angular app for production
# Angular outputs to: dist/<project-name>/
RUN npm run build -- --configuration production
# (This produces: /app/dist/<your-angular-project>/ )


###############################################
# 2. RUNTIME STAGE (NGINX)
# -------------------------
# This stage serves the compiled Angular app.
# NGINX is extremely fast for static files.
###############################################
FROM nginx:alpine

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build output from the builder stage
# IMPORTANT: Angular outputs to dist/<project-name>/
# We copy the *contents* of that folder into NGINX's html directory.
#COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom NGINX config (SPA routing, caching, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 (matches your docker-compose)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
