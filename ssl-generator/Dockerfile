FROM alpine:latest

RUN apk update && \
    apk upgrade && \
    apk add --no-cache openssl

ARG IP=10.128.2.100
ENV IP=${IP}

RUN mkdir -p /etc/ssl && \
    openssl req -newkey rsa:4096 -x509 -sha256 \
      -days 365 -nodes \
      -out /etc/ssl/kdaniely.42.fr.pem \
      -keyout /etc/ssl/kdaniely.42.fr.key \
      -subj "/C=AM/ST=Yerevan/L=Yerevan/O=42Yerevan/OU=IT/CN=${IP}" \
      -addext "subjectAltName=IP:${IP}"