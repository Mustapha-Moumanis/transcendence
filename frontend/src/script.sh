#!/bin/bash

if ! [ -f "$CERTS_" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$P_KEY" \
        -out "$CERTS_" \
        -subj "/CN=ft_transcendence"

    echo "Certificate and private key have been generated!"
else
    echo "There is already a certificate and private key!"
fi

sed -i -e "s+CERTS_+$CERTS_+" -e "s+P_KEY+$P_KEY+" /etc/nginx/sites-available/default

exec nginx -g "daemon off;"