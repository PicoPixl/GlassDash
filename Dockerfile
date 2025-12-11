FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the React application (Vite)
RUN npm run build

# Create the data directory for persistence
RUN mkdir -p /app/data

# Expose port 80 (internal container port)
EXPOSE 80

# Set environment variables
ENV PORT=80
ENV NODE_ENV=production

# Start the Node.js Express server
CMD ["npm", "start"]
