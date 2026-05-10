# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set work directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy project
COPY . .

# Build NEXT.js app
# Note: In a real production setup, you might want to pass build-time env vars
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start"]
