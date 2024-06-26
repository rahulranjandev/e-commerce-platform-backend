# Dockerfile for nginx 
FROM nginx:alpine

# Delete default nginx config file
RUN rm /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config file from the current directorys
COPY nginx.conf /etc/nginx/

COPY server.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
