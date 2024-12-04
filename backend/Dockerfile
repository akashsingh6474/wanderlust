#Stage 1: Build the application
FROM node:21-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Copy the environment file
COPY .env.sample .env

# Stage 2: Create a lightweight production image
FROM node:21-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the built application from the build stage
COPY --from=build /app ./

# Expose the application port
EXPOSE 5050

# Specify the command to run your application
CMD ["npm", "start"]

