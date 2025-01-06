# Using Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY ./client-side/package.json /app/package.json
COPY ./client-side/package-lock.json /app/package-lock.json

# Install dependencies from package.json (including vite)
RUN npm install

# Install global dependencies (if required)
RUN npm install -g serve vite

# Copy the rest of the application code into the container
COPY ./client-side /app

# Build the application using Vite
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application with "serve"
CMD ["serve", "-s", "dist"]
