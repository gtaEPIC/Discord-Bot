# Base image for Node.js
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Install Python (required for youtube-dl-exec)
RUN apt-get update && apt-get install -y python3 libopus-dev && ln -sf /usr/bin/python3 /usr/bin/python

# Copy files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code and build it
COPY . .
RUN npm run build

# Use Node.js to run the server
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache python3 build-base opus-dev && ln -sf python3 /usr/bin/python

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm install --production


# Start the backend server
CMD ["node", "dist/index.js"]
