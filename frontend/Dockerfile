# Stage 1: Build the application
FROM node:21 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Clean npm cache and install dependencies without running the prepare script
RUN npm cache clean --force && npm install --legacy-peer-deps --ignore-scripts

# Copy the rest of the application files to the working directory
COPY . .


# (Optional) Build your application if needed
# RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:21-slim AS production

# Set the working directory
WORKDIR /app

# Copy only the built application from the build stage
COPY --from=build /app ./

# Copy .env.sample to .env.local
COPY .env.sample .env.local

# Expose the port your app runs on
EXPOSE 5173

# Specify the command to run your application
CMD ["npm", "run", "dev", "--", "--host"]

