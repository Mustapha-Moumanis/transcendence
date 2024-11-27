#!/bin/bash

# openssl req -x509 -nodes -newkey rsa:2048 \
# -keyout $KEY -out $CRT -subj '/CN='$DOMAIN_NAME''

# sed -i -e "s@Default_crt@'$CRT'@" \
# -e "s@Default_key@'$KEY'@" \
# -e "s@Default_name@'$DOMAIN_NAME'@" \
# /etc/nginx/sites-available/default

# CERTS_="/etc/ssl/certs/certificate.crt"
# P_KEY="/etc/ssl/private/private.key"

if ! [ -f "$CERTS_" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$P_KEY" \
        -out "$CERTS_" \
        -subj "/CN=ft_transcendence"

    echo "Certificate and private key have been generated!"
else
    echo "There is already a certificate and private key!"
fi

# if ! [ -f $CERTS_ ]; then
#     openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#         -keyout $P_KEY \
#         -out $CERTS_
#     echo "Certificate and private key have been generated!"
# else
#     echo "There is already a certificate and private key!"
# fi

sed -i -e "s+CERTS_+$CERTS_+" -e "s+P_KEY+$P_KEY+" /etc/nginx/sites-available/default

exec nginx -g "daemon off;"
