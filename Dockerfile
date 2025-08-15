FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies if needed)
RUN npm ci || npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]