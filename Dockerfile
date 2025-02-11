FROM node:18

# Install npm
RUN apt-get update && \
    apt-get install -y npm net-tools iputils-ping netcat-traditional dnsutils bind9-host

WORKDIR /root/app

COPY ./* .
RUN npm install

ENV PROXY_TARGET=http://127.0.0.1:3000
ENV HOST=0.0.0.0
ENV PORT=8080
ENV SSL_PRIVATE_KEY=
ENV SSL_FULLCHAIN_CERT=

EXPOSE 8080

CMD [ "npm", "run", "start" ]