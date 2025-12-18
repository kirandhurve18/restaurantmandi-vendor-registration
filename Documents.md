## Document for frontend host restaurentmandi .

## Dockerfile 

````

# Stage 1 - build Angular app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 - Nginx
FROM nginx:alpine

# remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy angular build
COPY --from=build /app/dist/waayu-vendor-registration/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]```

````
## you have to create a nginx.conf in the directory for the frontend hosting with this content :

````
server {
    listen 80;

    # serve frontend
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # proxy backend API
    location /api/ {
        proxy_pass http://34.45.14.62:3006/;  # backend IP  
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

````
# also make the changes in the src/environment/ -

<img width="1028" height="147" alt="image" src="https://github.com/user-attachments/assets/bd05a1ac-e390-4e3c-9fdd-efc51a678e95" />




