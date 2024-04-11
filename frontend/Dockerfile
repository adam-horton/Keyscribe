FROM node:21-alpine3.18 as build

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

# # Run the application
# CMD ["npm", "start"]

FROM nginx:1.25.4-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]