# Use the official Node.js image for building the React app
FROM node:14 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use a lightweight Node.js image for serving the built React app
FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app/build ./build

# Install a simple HTTP server to serve the React app
RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]
