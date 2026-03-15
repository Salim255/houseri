###############################################################
# 1. BUILD STAGE
# -------------------------------------------------------------
# This stage compiles the NestJS application.
# It uses Node.js because NestJS (TypeScript) must be compiled
# into JavaScript before running in production.
###############################################################
FROM node:20-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy only package.json + package-lock.json first
# -------------------------------------------------------------
# WHY THIS MATTERS:
# - Docker caches this layer.
# - If dependencies do NOT change, "npm ci" is reused.
# - This makes CI/CD builds MUCH faster.
COPY package*.json ./

# Install ALL dependencies (dev + prod)
# -------------------------------------------------------------
# WHY:
# - NestJS needs devDependencies to compile TypeScript.
# - "npm ci" is faster and guarantees reproducible builds.
RUN npm ci

# Copy the rest of the server source code
# -------------------------------------------------------------
# WHY:
# - We copy source AFTER installing dependencies
#   to maximize Docker caching efficiency.
COPY . .

# Build the NestJS app (compile TypeScript → JavaScript)
# -------------------------------------------------------------
# WHY:
# - NestJS compiles TS into JS inside /dist
# - Only the compiled JS is needed in production.
RUN npm run build



###############################################################
# 2. RUNTIME STAGE
# -------------------------------------------------------------
# This stage runs the compiled NestJS app.
# It uses a clean Node.js image with ONLY production dependencies.
# This keeps the final image small, fast, and secure.
###############################################################
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json + package-lock.json
# -------------------------------------------------------------
# WHY:
# - We install ONLY production dependencies here.
# - Dev dependencies are NOT needed at runtime.
COPY package*.json ./

# Install ONLY production dependencies
# -------------------------------------------------------------
# WHY:
# - Smaller image
# - Faster startup
# - More secure
RUN npm ci --only=production

# Copy the compiled application from the build stage
# -------------------------------------------------------------
# WHY:
# - We do NOT copy TypeScript source code.
# - Only compiled JS is needed in production.
COPY --from=build /app/dist ./dist

# Set environment variable for the port
# -------------------------------------------------------------
# WHY:
# - Railway, Render, Heroku, Docker Compose, etc.
#   all inject PORT dynamically.
ENV PORT=3000

# Expose the port (for Docker Compose or local dev)
EXPOSE $PORT

# Start the NestJS server
# -------------------------------------------------------------
# WHY:
# - We run the compiled JS entrypoint.
# - No ts-node, no TypeScript, no dev tools.
CMD ["node", "dist/src/main.js"]
