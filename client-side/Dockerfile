# Node.js runtime as a parent image
FROM node:20-alpine

# The working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY ./client-side/package.json /app/package.json
RUN npm install -g serve

# Copy the rest of the application code
COPY ./client-side /app

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist"]
