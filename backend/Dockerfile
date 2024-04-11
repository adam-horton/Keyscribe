# Node image 
FROM node:21-alpine3.18

RUN apk --no-cache add curl

# Set working directory in the container
WORKDIR /app

# # Node runs without root processes
# RUN chown node:node ./

# # Switch to user node
# USER node

# Copy the package.json over, ignoring ./node_modules
COPY package*.json ./

# Run npm clean install to install the dependencies
RUN npm ci && npm cache clean --force

# Copy everything over
# COPY --chown=node:node . .
COPY . .

# Expose port 8000 (the port the app is running on), so that other docker containers can access it
EXPOSE 8000

# Start the app
CMD ["node", "./dist/index.js"]
