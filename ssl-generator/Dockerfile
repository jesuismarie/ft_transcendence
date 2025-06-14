FROM alpine:latest

RUN apk update && \
    apk upgrade && \
    apk add --no-cache openssl

RUN mkdir -p /etc/ssl && \
    openssl req -newkey rsa:4096 -x509 -sha256 \
      -days 365 -nodes \
      -out /etc/ssl/gehovhan.42.fr.pem \
      -keyout /etc/ssl/gehovhan.42.fr.key \
      -subj "/C=AM/ST=Yerevan/L=Yerevan/O=42Yerevan/OU=IT/CN=localhost"
