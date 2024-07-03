# Stage 1: Build stage
FROM node:18.15.0 as build

# Set the working directory
WORKDIR /usr/src/app

# Set the npm registry to Taobao (if needed)
RUN npm config set registry http://registry.npm.taobao.org

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Stage 2: Production stage
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy the entire application code
COPY . .

# Copy node_modules from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Generate Prisma client
RUN npx prisma generate

# Build your application
RUN npm run build

# Expose the port (if needed)
EXPOSE 8088

# Set environment variable (fix the syntax)
ENV mcEnv='mysql://nalinv:Nlx_Ngj(@2023)@rm-uf6g70120evh02dif8o.mysql.rds.aliyuncs.com/store'

# Define the command to run your application
CMD ["node", "./dist/main.js"]